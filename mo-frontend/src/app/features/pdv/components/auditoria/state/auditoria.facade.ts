import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuditoriaService } from '../services/auditoria.service';
import {
  AuditoriaEvento,
  ConfiguracionAuditoria,
  FiltroAuditoria,
  ConteosPrioridad,
  PrioridadAuditoria,
  CategoriaConfiguracion
} from '../models/auditoria.models';

@Injectable({ providedIn: 'root' })
export class AuditoriaFacade {
  private auditoriaService = inject(AuditoriaService);

  // ============== ESTADO PRIVADO ==============

  // Eventos de auditoría
  private _eventos = signal<AuditoriaEvento[]>([]);
  private _eventoSeleccionado = signal<AuditoriaEvento | null>(null);

  // Configuraciones
  private _configuraciones = signal<ConfiguracionAuditoria[]>([]);
  private _cambiosPendientes = signal<Map<number, Partial<ConfiguracionAuditoria>>>(new Map());

  // Filtros
  private _filtroActivo = signal<string>('todos');
  private _busqueda = signal<string>('');

  // UI State
  private _loading = signal<boolean>(false);
  private _guardando = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // ============== SELECTORES PÚBLICOS (READONLY) ==============

  readonly eventos = this._eventos.asReadonly();
  readonly eventoSeleccionado = this._eventoSeleccionado.asReadonly();
  readonly configuraciones = this._configuraciones.asReadonly();
  readonly cambiosPendientes = this._cambiosPendientes.asReadonly();
  readonly filtroActivo = this._filtroActivo.asReadonly();
  readonly busqueda = this._busqueda.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly guardando = this._guardando.asReadonly();
  readonly error = this._error.asReadonly();

  // ============== SELECTORES COMPUTADOS ==============

  readonly eventosFiltrados = computed(() => {
    const filtro = this._filtroActivo();
    const eventos = this._eventos();

    if (filtro === 'todos') return eventos;

    const prioridadMap: Record<string, PrioridadAuditoria> = {
      'critico': 'CRITICO',
      'comunes': 'COMUN',
      'alta': 'ALTA',
      'baja': 'BAJA'
    };

    const prioridad = prioridadMap[filtro];
    return prioridad ? eventos.filter(e => e.prioridad === prioridad) : eventos;
  });

  readonly conteosPorPrioridad = computed<ConteosPrioridad>(() => {
    const eventos = this._eventos();
    return {
      todos: eventos.length,
      critico: eventos.filter(e => e.prioridad === 'CRITICO').length,
      comunes: eventos.filter(e => e.prioridad === 'COMUN').length,
      altaPrioridad: eventos.filter(e => e.prioridad === 'ALTA').length,
      bajaPrioridad: eventos.filter(e => e.prioridad === 'BAJA').length
    };
  });

  readonly configuracionesPorCategoria = computed(() => {
    const configs = this._configuraciones();
    const cambios = this._cambiosPendientes();

    // Aplicar cambios pendientes a la vista
    const configsConCambios = configs.map(c => {
      const cambio = cambios.get(c.id);
      return cambio ? { ...c, ...cambio } : c;
    });

    return {
      mesa: configsConCambios.filter(c => c.categoria === 'MESA'),
      factura: configsConCambios.filter(c => c.categoria === 'FACTURA'),
      articulo: configsConCambios.filter(c => c.categoria === 'ARTICULO'),
      seguridad: configsConCambios.filter(c => c.categoria === 'SEGURIDAD'),
      notificaciones: configsConCambios.filter(c => c.categoria === 'NOTIFICACIONES')
    };
  });

  readonly conteosConfiguracion = computed(() => {
    const byCategoria = this.configuracionesPorCategoria();
    return {
      mesa: {
        activas: byCategoria.mesa.filter(c => c.activo).length,
        total: byCategoria.mesa.length
      },
      factura: {
        activas: byCategoria.factura.filter(c => c.activo).length,
        total: byCategoria.factura.length
      },
      articulo: {
        activas: byCategoria.articulo.filter(c => c.activo).length,
        total: byCategoria.articulo.length
      },
      seguridad: {
        activas: byCategoria.seguridad.filter(c => c.activo).length,
        total: byCategoria.seguridad.length
      }
    };
  });

  readonly tieneCambiosPendientes = computed(() => this._cambiosPendientes().size > 0);

  // ============== ACCIONES - AUDITORÍA ==============

  async cargarEventos(filtro?: FiltroAuditoria): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const eventos = await firstValueFrom(this.auditoriaService.listarEventos(filtro));
      this._eventos.set(eventos);
    } catch (err) {
      this._error.set('Error al cargar eventos de auditoría');
      console.error(err);
    } finally {
      this._loading.set(false);
    }
  }

  setFiltroActivo(filtro: string): void {
    this._filtroActivo.set(filtro);
  }

  setBusqueda(texto: string): void {
    this._busqueda.set(texto);
    // Recargar con búsqueda
    this.cargarEventos({ busqueda: texto });
  }

  seleccionarEvento(evento: AuditoriaEvento | null): void {
    this._eventoSeleccionado.set(evento);
  }

  async actualizarDetalle(eventoId: number, detalleId: number, activo: boolean): Promise<void> {
    try {
      await firstValueFrom(this.auditoriaService.actualizarDetalle(eventoId, detalleId, activo));

      // Actualizar estado local
      const eventos = this._eventos();
      const eventoIndex = eventos.findIndex(e => e.id === eventoId);

      if (eventoIndex !== -1) {
        const evento = { ...eventos[eventoIndex] };
        const detalleIndex = evento.detalles.findIndex(d => d.id === detalleId);

        if (detalleIndex !== -1) {
          evento.detalles = [...evento.detalles];
          evento.detalles[detalleIndex] = { ...evento.detalles[detalleIndex], activo };

          const nuevosEventos = [...eventos];
          nuevosEventos[eventoIndex] = evento;
          this._eventos.set(nuevosEventos);
        }
      }
    } catch (err) {
      this._error.set('Error al actualizar detalle');
      console.error(err);
    }
  }

  // ============== ACCIONES - CONFIGURACIÓN ==============

  async cargarConfiguraciones(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const configs = await firstValueFrom(this.auditoriaService.listarConfiguraciones());
      this._configuraciones.set(configs);
      this._cambiosPendientes.set(new Map());
    } catch (err) {
      this._error.set('Error al cargar configuraciones');
      console.error(err);
    } finally {
      this._loading.set(false);
    }
  }

  toggleConfiguracion(id: number, activo: boolean): void {
    const cambios = new Map(this._cambiosPendientes());
    cambios.set(id, { activo });
    this._cambiosPendientes.set(cambios);
  }

  activarTodas(categoria?: CategoriaConfiguracion): void {
    const configs = this._configuraciones();
    const cambios = new Map(this._cambiosPendientes());

    configs
      .filter(c => !categoria || c.categoria === categoria)
      .forEach(c => cambios.set(c.id, { activo: true }));

    this._cambiosPendientes.set(cambios);
  }

  async guardarConfiguraciones(): Promise<boolean> {
    if (!this.tieneCambiosPendientes()) return true;

    this._guardando.set(true);
    this._error.set(null);

    try {
      await firstValueFrom(this.auditoriaService.guardarConfiguraciones(this._cambiosPendientes()));

      // Recargar configuraciones
      await this.cargarConfiguraciones();
      return true;
    } catch (err) {
      this._error.set('Error al guardar configuraciones');
      console.error(err);
      return false;
    } finally {
      this._guardando.set(false);
    }
  }

  cancelarCambios(): void {
    this._cambiosPendientes.set(new Map());
  }

  // ============== HELPERS ==============

  limpiarError(): void {
    this._error.set(null);
  }
}
