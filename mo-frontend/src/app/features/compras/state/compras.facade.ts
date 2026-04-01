import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ComprasService } from '../services/compras.service';
import {
  OrdenCompra,
  Proveedor,
  Insumo,
  CategoriaInsumo,
  ProyeccionPagos,
  EstadoOrden,
  EstadoInsumo,
  VistaActiva,
  ConteosPorEstado,
  ConteosInsumos,
  ConteosProveedores,
  FiltroProveedor,
  TipoComprobante,
  OrdenProducto,
  RubroConceptoGasto,
  ConceptoGasto,
  FiltroConcepto,
  ConteosConceptos
} from '../models/compras.models';

@Injectable({ providedIn: 'root' })
export class ComprasFacade {
  private comprasService = inject(ComprasService);

  // ============== ESTADO PRIVADO ==============

  // Data
  private _ordenes = signal<OrdenCompra[]>([]);
  private _proveedores = signal<Proveedor[]>([]);
  private _insumos = signal<Insumo[]>([]);
  private _categorias = signal<CategoriaInsumo[]>([]);
  private _proyeccion = signal<ProyeccionPagos | null>(null);
  private _rubros = signal<RubroConceptoGasto[]>([]);
  private _conceptos = signal<ConceptoGasto[]>([]);

  // Filtros
  private _filtroEstado = signal<EstadoOrden | 'todas'>('todas');
  private _filtroInsumo = signal<EstadoInsumo | 'todos'>('todos');
  private _busqueda = signal<string>('');
  private _busquedaProveedor = signal<string>('');
  private _filtroProveedor = signal<FiltroProveedor>('todos');
  private _filtroConcepto = signal<FiltroConcepto>('todos');
  private _busquedaConcepto = signal<string>('');

  // UI State
  private _vistaActiva = signal<VistaActiva>('ordenes');
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // ============== SELECTORES PUBLICOS (READONLY) ==============

  readonly ordenes = this._ordenes.asReadonly();
  readonly proveedores = this._proveedores.asReadonly();
  readonly insumos = this._insumos.asReadonly();
  readonly categorias = this._categorias.asReadonly();
  readonly proyeccion = this._proyeccion.asReadonly();
  readonly filtroEstado = this._filtroEstado.asReadonly();
  readonly filtroInsumo = this._filtroInsumo.asReadonly();
  readonly busqueda = this._busqueda.asReadonly();
  readonly busquedaProveedor = this._busquedaProveedor.asReadonly();
  readonly filtroProveedor = this._filtroProveedor.asReadonly();
  readonly rubros = this._rubros.asReadonly();
  readonly conceptos = this._conceptos.asReadonly();
  readonly filtroConcepto = this._filtroConcepto.asReadonly();
  readonly busquedaConcepto = this._busquedaConcepto.asReadonly();
  readonly vistaActiva = this._vistaActiva.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // ============== SELECTORES COMPUTADOS ==============

  readonly ordenesFiltradas = computed(() => {
    let ordenes = this._ordenes();
    const filtro = this._filtroEstado();
    const busqueda = this._busqueda().toLowerCase();

    if (filtro !== 'todas') {
      ordenes = ordenes.filter(o => o.estado === filtro);
    }

    if (busqueda) {
      ordenes = ordenes.filter(o =>
        o.numero.toLowerCase().includes(busqueda) ||
        o.proveedor.toLowerCase().includes(busqueda) ||
        o.numeroComprobante.toLowerCase().includes(busqueda)
      );
    }

    return ordenes;
  });

  readonly conteosPorEstado = computed<ConteosPorEstado>(() => {
    const ordenes = this._ordenes();
    return {
      todas: ordenes.length,
      pendientes: ordenes.filter(o => o.estado === 'Pendiente').length,
      pedidas: ordenes.filter(o => o.estado === 'Pedida').length,
      recibidas: ordenes.filter(o => o.estado === 'Recibida').length,
      facturadas: ordenes.filter(o => o.estado === 'Facturada').length,
      pagadas: ordenes.filter(o => o.estado === 'Pagada').length
    };
  });

  readonly insumosFiltrados = computed(() => {
    let insumos = this._insumos();
    const filtro = this._filtroInsumo();

    if (filtro !== 'todos') {
      insumos = insumos.filter(i => i.estado === filtro);
    }

    return insumos;
  });

  readonly conteosInsumos = computed<ConteosInsumos>(() => {
    const insumos = this._insumos();
    return {
      todos: insumos.length,
      activos: insumos.filter(i => i.estado === 'Activo').length,
      inactivos: insumos.filter(i => i.estado === 'Inactivo').length,
      stockBajo: insumos.filter(i => i.estado === 'StockBajo').length,
      sinStock: insumos.filter(i => i.estado === 'SinStock').length
    };
  });

  readonly proveedoresFiltrados = computed(() => {
    let proveedores = this._proveedores();
    const filtro = this._filtroProveedor();
    const busqueda = this._busquedaProveedor().toLowerCase();

    if (filtro === 'activos') {
      proveedores = proveedores.filter(p => p.activo);
    } else if (filtro === 'inactivos') {
      proveedores = proveedores.filter(p => !p.activo);
    }

    if (busqueda) {
      proveedores = proveedores.filter(p =>
        p.nombre.toLowerCase().includes(busqueda) ||
        p.razonSocial.toLowerCase().includes(busqueda) ||
        p.cuit.includes(busqueda) ||
        p.codigo.toLowerCase().includes(busqueda)
      );
    }

    return proveedores;
  });

  readonly conteosProveedores = computed<ConteosProveedores>(() => {
    const proveedores = this._proveedores();
    return {
      todos: proveedores.length,
      activos: proveedores.filter(p => p.activo).length,
      inactivos: proveedores.filter(p => !p.activo).length
    };
  });

  readonly proveedoresActivos = computed(() =>
    this._proveedores().filter(p => p.activo)
  );

  readonly conceptosFiltrados = computed(() => {
    let conceptos = this._conceptos();
    const filtro = this._filtroConcepto();
    const busqueda = this._busquedaConcepto().toLowerCase();

    if (filtro === 'activos') {
      conceptos = conceptos.filter(c => c.activo);
    } else if (filtro === 'inactivos') {
      conceptos = conceptos.filter(c => !c.activo);
    }

    if (busqueda) {
      conceptos = conceptos.filter(c =>
        c.nombre.toLowerCase().includes(busqueda) ||
        c.rubro.toLowerCase().includes(busqueda)
      );
    }

    return conceptos;
  });

  readonly conceptosActivos = computed(() =>
    this._conceptos().filter(c => c.activo)
  );

  readonly conteosConceptos = computed<ConteosConceptos>(() => {
    const conceptos = this._conceptos();
    return {
      todos: conceptos.length,
      activos: conceptos.filter(c => c.activo).length,
      inactivos: conceptos.filter(c => !c.activo).length
    };
  });

  // ============== ACCIONES - CARGA INICIAL ==============

  cargarDatos(): void {
    this._loading.set(true);
    this._error.set(null);

    forkJoin({
      ordenes: this.comprasService.listarOrdenes(),
      proveedores: this.comprasService.listarProveedores(),
      insumos: this.comprasService.listarInsumos(),
      categorias: this.comprasService.listarCategorias(),
      proyeccion: this.comprasService.obtenerProyeccion(),
      rubros: this.comprasService.listarRubros(),
      conceptos: this.comprasService.listarConceptos()
    }).subscribe({
      next: (result) => {
        this._ordenes.set(result.ordenes);
        this._proveedores.set(result.proveedores);
        this._insumos.set(result.insumos);
        this._categorias.set(result.categorias);
        this._proyeccion.set(result.proyeccion);
        this._rubros.set(result.rubros);
        this._conceptos.set(result.conceptos);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Error al cargar datos de compras');
        console.error(err);
        this._loading.set(false);
      }
    });
  }

  // ============== ACCIONES - ORDENES ==============

  crearOrden(orden: Partial<OrdenCompra>): void {
    this._loading.set(true);
    this._error.set(null);

    this.comprasService.crearOrden(orden).subscribe({
      next: (nueva) => {
        this._ordenes.update(ordenes => [nueva, ...ordenes]);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Error al crear orden de compra');
        console.error(err);
        this._loading.set(false);
      }
    });
  }

  actualizarOrden(id: number, data: Partial<OrdenCompra>): void {
    this._error.set(null);

    this.comprasService.actualizarOrden(id, data).subscribe({
      next: (actualizada) => {
        this._ordenes.update(ordenes =>
          ordenes.map(o => o.id === id ? actualizada : o)
        );
      },
      error: (err) => {
        this._error.set('Error al actualizar orden');
        console.error(err);
      }
    });
  }

  cambiarEstadoOrden(id: number, nuevoEstado: EstadoOrden): void {
    this._error.set(null);

    this.comprasService.cambiarEstadoOrden(id, nuevoEstado).subscribe({
      next: (actualizada) => {
        this._ordenes.update(ordenes =>
          ordenes.map(o => o.id === id ? actualizada : o)
        );
      },
      error: (err) => {
        this._error.set('Error al cambiar estado de orden');
        console.error(err);
      }
    });
  }

  // ============== ACCIONES - PROVEEDORES ==============

  crearProveedor(proveedor: Partial<Proveedor>): void {
    this._loading.set(true);
    this._error.set(null);

    this.comprasService.crearProveedor(proveedor).subscribe({
      next: (nuevo) => {
        this._proveedores.update(proveedores => [...proveedores, nuevo]);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Error al crear proveedor');
        console.error(err);
        this._loading.set(false);
      }
    });
  }

  actualizarProveedor(id: number, data: Partial<Proveedor>): void {
    this._error.set(null);

    this.comprasService.actualizarProveedor(id, data).subscribe({
      next: (actualizado) => {
        this._proveedores.update(proveedores =>
          proveedores.map(p => p.id === id ? actualizado : p)
        );
      },
      error: (err) => {
        this._error.set('Error al actualizar proveedor');
        console.error(err);
      }
    });
  }

  // ============== ACCIONES - RUBROS ==============

  crearRubro(rubro: Partial<RubroConceptoGasto>): void {
    this._error.set(null);

    this.comprasService.crearRubro(rubro).subscribe({
      next: (nuevo) => {
        this._rubros.update(rubros => [...rubros, nuevo]);
      },
      error: (err) => {
        this._error.set('Error al crear rubro');
        console.error(err);
      }
    });
  }

  actualizarRubro(id: number, data: Partial<RubroConceptoGasto>): void {
    this._error.set(null);

    this.comprasService.actualizarRubro(id, data).subscribe({
      next: (actualizado) => {
        this._rubros.update(rubros => rubros.map(r => r.id === id ? actualizado : r));
      },
      error: (err) => {
        this._error.set('Error al actualizar rubro');
        console.error(err);
      }
    });
  }

  // ============== ACCIONES - CONCEPTOS ==============

  crearConcepto(concepto: Partial<ConceptoGasto>): void {
    this._error.set(null);

    this.comprasService.crearConcepto(concepto).subscribe({
      next: (nuevo) => {
        this._conceptos.update(conceptos => [...conceptos, nuevo]);
      },
      error: (err) => {
        this._error.set('Error al crear concepto');
        console.error(err);
      }
    });
  }

  actualizarConcepto(id: number, data: Partial<ConceptoGasto>): void {
    this._error.set(null);

    this.comprasService.actualizarConcepto(id, data).subscribe({
      next: (actualizado) => {
        this._conceptos.update(conceptos => conceptos.map(c => c.id === id ? actualizado : c));
      },
      error: (err) => {
        this._error.set('Error al actualizar concepto');
        console.error(err);
      }
    });
  }

  desactivarConcepto(id: number): void {
    this._error.set(null);

    this.comprasService.desactivarConcepto(id).subscribe({
      next: (actualizado) => {
        this._conceptos.update(conceptos => conceptos.map(c => c.id === id ? actualizado : c));
      },
      error: (err) => {
        this._error.set('Error al desactivar concepto');
        console.error(err);
      }
    });
  }

  // ============== ACCIONES - FILTROS ==============

  setFiltroEstado(filtro: EstadoOrden | 'todas'): void {
    this._filtroEstado.set(filtro);
  }

  setFiltroInsumo(filtro: EstadoInsumo | 'todos'): void {
    this._filtroInsumo.set(filtro);
  }

  setBusqueda(texto: string): void {
    this._busqueda.set(texto);
  }

  setBusquedaProveedor(texto: string): void {
    this._busquedaProveedor.set(texto);
  }

  setFiltroProveedor(filtro: FiltroProveedor): void {
    this._filtroProveedor.set(filtro);
  }

  setFiltroConcepto(filtro: FiltroConcepto): void {
    this._filtroConcepto.set(filtro);
  }

  setBusquedaConcepto(texto: string): void {
    this._busquedaConcepto.set(texto);
  }

  setVistaActiva(vista: VistaActiva): void {
    this._vistaActiva.set(vista);
  }

  // ============== HELPERS ==============

  limpiarError(): void {
    this._error.set(null);
  }
}
