import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MarketplacesService } from '../data/marketplaces.service';
import { NotificationService } from '@mro/shared-ui';
import {
  ProductoHardware,
  Solucion,
  ListaPrecios,
  MetodoAceptacionOption,
  DatosFacturacion,
  ConfiguracionPedidosYa,
  EstadoIntegracion,
  ResultadoActivacion,
  IdentificacionTienda,
  TipoIdentificacionTienda,
  Sucursal
} from '../models/marketplaces.models';

@Injectable({ providedIn: 'root' })
export class MarketplacesFacade {
  private service = inject(MarketplacesService);
  private notificationService = inject(NotificationService);

  // ============== ESTADO PRIVADO - CATALOGO ==============

  private _productosHardware = signal<ProductoHardware[]>([]);
  private _soluciones = signal<Solucion[]>([]);
  private _loading = signal<boolean>(false);

  // ============== ESTADO PRIVADO - WIZARD ==============

  private _estadoIntegracion = signal<EstadoIntegracion>('idle');
  private _solucionSeleccionada = signal<Solucion | null>(null);
  private _listasPrecios = signal<ListaPrecios[]>([]);
  private _metodosAceptacion = signal<MetodoAceptacionOption[]>([]);
  private _datosFacturacion = signal<DatosFacturacion | null>(null);
  private _configuracion = signal<ConfiguracionPedidosYa>({
    listaPrecios: null,
    metodoAceptacion: null,
    terminosAceptados: false
  });
  private _identificacion = signal<IdentificacionTienda>({
    sucursal: null,
    tipo: null,
    idTienda: ''
  });
  private _sucursales = signal<Sucursal[]>([]);
  private _resultadoActivacion = signal<ResultadoActivacion | null>(null);

  // ============== SELECTORES PUBLICOS (READONLY) ==============

  readonly productosHardware = this._productosHardware.asReadonly();
  readonly soluciones = this._soluciones.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly estadoIntegracion = this._estadoIntegracion.asReadonly();
  readonly solucionSeleccionada = this._solucionSeleccionada.asReadonly();
  readonly listasPrecios = this._listasPrecios.asReadonly();
  readonly metodosAceptacion = this._metodosAceptacion.asReadonly();
  readonly datosFacturacion = this._datosFacturacion.asReadonly();
  readonly configuracion = this._configuracion.asReadonly();
  readonly identificacion = this._identificacion.asReadonly();
  readonly sucursales = this._sucursales.asReadonly();
  readonly resultadoActivacion = this._resultadoActivacion.asReadonly();

  // ============== SELECTORES COMPUTADOS ==============

  readonly wizardAbierto = computed(() =>
    this._estadoIntegracion() !== 'idle'
  );

  readonly configuracionValida = computed(() => {
    const config = this._configuracion();
    return config.listaPrecios !== null && config.metodoAceptacion !== null;
  });

  readonly identificacionValida = computed(() => {
    const ident = this._identificacion();
    if (ident.sucursal === null) return false;
    if (ident.tipo === 'nueva') return true;
    if (ident.tipo === 'existente') return ident.idTienda.trim().length > 0;
    return false;
  });

  readonly puedeActivar = computed(() => {
    const config = this._configuracion();
    return this.configuracionValida() && config.terminosAceptados;
  });

  readonly solucionesActivas = computed(() =>
    this._soluciones().filter(s => s.estado === 'Activo')
  );

  readonly solucionesDisponibles = computed(() =>
    this._soluciones().filter(s => s.estado === 'Disponible')
  );

  // ============== ACCIONES - CARGA INICIAL ==============

  async cargarCatalogo(): Promise<void> {
    this._loading.set(true);
    try {
      const [productos, soluciones] = await Promise.all([
        firstValueFrom(this.service.listarProductosHardware()),
        firstValueFrom(this.service.listarSoluciones())
      ]);
      this._productosHardware.set(productos);
      this._soluciones.set(soluciones);
    } catch (err) {
      console.error('Error al cargar catalogo', err);
      this.notificationService.error('Error al cargar el catalogo de integraciones');
    } finally {
      this._loading.set(false);
    }
  }

  // ============== ACCIONES - WIZARD STATE MACHINE ==============

  abrirContratacion(solucion: Solucion): void {
    if (!solucion.tieneWizard) return;
    this._solucionSeleccionada.set(solucion);
    this._estadoIntegracion.set('contratacion');
    this._configuracion.set({
      listaPrecios: null,
      metodoAceptacion: null,
      terminosAceptados: false
    });
    this._identificacion.set({
      sucursal: null,
      tipo: null,
      idTienda: ''
    });
    this._resultadoActivacion.set(null);
  }

  async avanzarAIdentificacion(): Promise<void> {
    this._estadoIntegracion.set('identificacion');
    if (this._sucursales().length === 0) {
      try {
        const sucursales = await firstValueFrom(this.service.listarSucursales());
        this._sucursales.set(sucursales);
        // Autoselección si solo hay una sucursal
        if (sucursales.length === 1 && this._identificacion().sucursal === null) {
          this._identificacion.update(i => ({ ...i, sucursal: sucursales[0] }));
        }
      } catch (err) {
        console.error('Error al cargar sucursales', err);
        this.notificationService.error('Error al cargar las sucursales');
      }
    }
  }

  async avanzarAConfiguracion(): Promise<void> {
    if (!this.identificacionValida()) return;
    this._estadoIntegracion.set('configuracion');
    // Load wizard data if not loaded
    if (this._listasPrecios().length === 0) {
      try {
        const [listas, metodos, facturacion] = await Promise.all([
          firstValueFrom(this.service.listarListasPrecios()),
          firstValueFrom(this.service.listarMetodosAceptacion()),
          firstValueFrom(this.service.obtenerDatosFacturacion())
        ]);
        this._listasPrecios.set(listas);
        this._metodosAceptacion.set(metodos);
        this._datosFacturacion.set(facturacion);
      } catch (err) {
        console.error('Error al cargar configuracion del wizard', err);
        this.notificationService.error('Error al cargar datos de configuracion');
      }
    }
  }

  avanzarAConfirmacion(): void {
    if (this.configuracionValida()) {
      this._estadoIntegracion.set('confirmacion');
    }
  }

  volverAContratacion(): void {
    this._estadoIntegracion.set('contratacion');
  }

  volverAIdentificacion(): void {
    this._estadoIntegracion.set('identificacion');
  }

  volverAConfiguracion(): void {
    this._estadoIntegracion.set('configuracion');
  }

  async activarIntegracion(): Promise<void> {
    if (!this.puedeActivar()) return;
    this._estadoIntegracion.set('activando');
    try {
      const resultado = await firstValueFrom(this.service.activarIntegracion());
      this._resultadoActivacion.set(resultado);
      this._estadoIntegracion.set('exito');
      this.notificationService.success('Integracion con Pedidos Ya activada correctamente');
    } catch (err) {
      console.error('Error al activar integracion', err);
      this.notificationService.error('Error al activar la integracion');
      this._estadoIntegracion.set('confirmacion');
    }
  }

  cerrarWizard(): void {
    this._estadoIntegracion.set('idle');
    this._solucionSeleccionada.set(null);
    this._configuracion.set({
      listaPrecios: null,
      metodoAceptacion: null,
      terminosAceptados: false
    });
    this._identificacion.set({
      sucursal: null,
      tipo: null,
      idTienda: ''
    });
    this._resultadoActivacion.set(null);
  }

  // ============== ACCIONES - CONFIGURACION ==============

  setListaPrecios(lista: ListaPrecios): void {
    this._configuracion.update(c => ({ ...c, listaPrecios: lista }));
  }

  crearListaPrecios(nombre: string, basadaEnId: number): void {
    const base = this._listasPrecios().find(l => l.id === basadaEnId);
    const nextId = Math.max(0, ...this._listasPrecios().map(l => l.id)) + 1;
    const nuevaLista: ListaPrecios = {
      id: nextId,
      nombre: nombre.trim(),
      productosSincronizados: base?.productosSincronizados ?? 0
    };
    this._listasPrecios.update(list => [...list, nuevaLista]);
    this._configuracion.update(c => ({ ...c, listaPrecios: nuevaLista }));
    this.notificationService.success(`Lista "${nuevaLista.nombre}" creada y seleccionada`);
  }

  setMetodoAceptacion(metodo: MetodoAceptacionOption): void {
    this._configuracion.update(c => ({ ...c, metodoAceptacion: metodo }));
  }

  setTerminosAceptados(aceptados: boolean): void {
    this._configuracion.update(c => ({ ...c, terminosAceptados: aceptados }));
  }

  setTipoIdentificacion(tipo: TipoIdentificacionTienda): void {
    this._identificacion.update(i => ({
      ...i,
      tipo,
      idTienda: tipo === 'nueva' ? '' : i.idTienda
    }));
  }

  setIdTienda(idTienda: string): void {
    this._identificacion.update(i => ({ ...i, idTienda }));
  }

  setSucursal(sucursal: Sucursal): void {
    this._identificacion.update(i => ({ ...i, sucursal }));
  }
}
