import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import {
  AuditoriaEvento,
  ConfiguracionAuditoria,
  FiltroAuditoria,
  TipoAccion
} from '../models/auditoria.models';
import { MOCK_EVENTOS, MOCK_CONFIGURACIONES, TIPOS_ACCION } from './auditoria-mock.data';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/v1';

  // Flag para usar mock data (cambiar a false cuando el backend esté listo)
  private useMock = true;

  // ============== AUDITORÍA ==============

  listarEventos(filtro?: FiltroAuditoria): Observable<AuditoriaEvento[]> {
    if (this.useMock) {
      let eventos = [...MOCK_EVENTOS];

      if (filtro?.prioridad) {
        eventos = eventos.filter(e => e.prioridad === filtro.prioridad);
      }

      if (filtro?.busqueda) {
        const search = filtro.busqueda.toLowerCase();
        eventos = eventos.filter(e =>
          e.mesa.toLowerCase().includes(search) ||
          e.ubicacion.toLowerCase().includes(search) ||
          e.empleado.nombre.toLowerCase().includes(search) ||
          e.comprobante.toLowerCase().includes(search)
        );
      }

      return of(eventos).pipe(delay(300));
    }

    let params = new HttpParams();
    if (filtro?.prioridad) params = params.set('prioridad', filtro.prioridad);
    if (filtro?.busqueda) params = params.set('q', filtro.busqueda);
    if (filtro?.fechaDesde) params = params.set('desde', filtro.fechaDesde);
    if (filtro?.fechaHasta) params = params.set('hasta', filtro.fechaHasta);

    return this.http.get<AuditoriaEvento[]>(`${this.baseUrl}/auditoria`, { params });
  }

  obtenerEventoPorId(id: number): Observable<AuditoriaEvento | undefined> {
    if (this.useMock) {
      const evento = MOCK_EVENTOS.find(e => e.id === id);
      return of(evento).pipe(delay(200));
    }

    return this.http.get<AuditoriaEvento>(`${this.baseUrl}/auditoria/${id}`);
  }

  actualizarEvento(id: number, data: Partial<AuditoriaEvento>): Observable<AuditoriaEvento> {
    if (this.useMock) {
      const index = MOCK_EVENTOS.findIndex(e => e.id === id);
      if (index !== -1) {
        MOCK_EVENTOS[index] = { ...MOCK_EVENTOS[index], ...data };
        return of(MOCK_EVENTOS[index]).pipe(delay(300));
      }
      throw new Error('Evento no encontrado');
    }

    return this.http.put<AuditoriaEvento>(`${this.baseUrl}/auditoria/${id}`, data);
  }

  actualizarDetalle(eventoId: number, detalleId: number, activo: boolean): Observable<void> {
    if (this.useMock) {
      const evento = MOCK_EVENTOS.find(e => e.id === eventoId);
      if (evento) {
        const detalle = evento.detalles.find(d => d.id === detalleId);
        if (detalle) {
          detalle.activo = activo;
        }
      }
      return of(undefined).pipe(delay(200));
    }

    return this.http.put<void>(
      `${this.baseUrl}/auditoria/${eventoId}/detalle/${detalleId}`,
      { activo }
    );
  }

  // ============== CONFIGURACIÓN ==============

  listarConfiguraciones(): Observable<ConfiguracionAuditoria[]> {
    if (this.useMock) {
      return of([...MOCK_CONFIGURACIONES]).pipe(delay(300));
    }

    return this.http.get<ConfiguracionAuditoria[]>(`${this.baseUrl}/configuracion`);
  }

  actualizarConfiguracion(id: number, activo: boolean): Observable<ConfiguracionAuditoria> {
    if (this.useMock) {
      const index = MOCK_CONFIGURACIONES.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_CONFIGURACIONES[index].activo = activo;
        return of(MOCK_CONFIGURACIONES[index]).pipe(delay(200));
      }
      throw new Error('Configuración no encontrada');
    }

    return this.http.put<ConfiguracionAuditoria>(
      `${this.baseUrl}/configuracion/${id}`,
      { activo }
    );
  }

  activarTodasConfiguraciones(categoria?: string): Observable<ConfiguracionAuditoria[]> {
    if (this.useMock) {
      MOCK_CONFIGURACIONES.forEach(c => {
        if (!categoria || c.categoria === categoria) {
          c.activo = true;
        }
      });
      return of([...MOCK_CONFIGURACIONES]).pipe(delay(300));
    }

    return this.http.put<ConfiguracionAuditoria[]>(
      `${this.baseUrl}/configuracion/activar-todas`,
      { categoria }
    );
  }

  guardarConfiguraciones(cambios: Map<number, Partial<ConfiguracionAuditoria>>): Observable<void> {
    if (this.useMock) {
      cambios.forEach((data, id) => {
        const index = MOCK_CONFIGURACIONES.findIndex(c => c.id === id);
        if (index !== -1) {
          MOCK_CONFIGURACIONES[index] = { ...MOCK_CONFIGURACIONES[index], ...data };
        }
      });
      return of(undefined).pipe(delay(300));
    }

    const payload = Array.from(cambios.entries()).map(([id, data]) => ({ id, ...data }));
    return this.http.post<void>(`${this.baseUrl}/configuracion/guardar`, payload);
  }

  // ============== CATÁLOGOS ==============

  listarTiposAccion(): Observable<TipoAccion[]> {
    if (this.useMock) {
      return of([...TIPOS_ACCION]).pipe(delay(100));
    }

    return this.http.get<TipoAccion[]>(`${this.baseUrl}/tipos-accion`);
  }
}
