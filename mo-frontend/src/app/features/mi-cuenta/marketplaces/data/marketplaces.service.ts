import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import {
  ProductoHardware,
  Solucion,
  ListaPrecios,
  MetodoAceptacionOption,
  DatosFacturacion,
  ResultadoActivacion
} from '../models/marketplaces.models';
import {
  MOCK_PRODUCTOS_HARDWARE,
  MOCK_SOLUCIONES,
  MOCK_LISTAS_PRECIOS,
  MOCK_METODOS_ACEPTACION,
  MOCK_DATOS_FACTURACION
} from './marketplaces-mock.data';

@Injectable({ providedIn: 'root' })
export class MarketplacesService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8090/api/v1';
  private useMock = true;

  // ============== CATALOGO ==============

  listarProductosHardware(): Observable<ProductoHardware[]> {
    if (this.useMock) {
      return of([...MOCK_PRODUCTOS_HARDWARE]).pipe(delay(300));
    }
    return this.http.get<ProductoHardware[]>(`${this.baseUrl}/marketplaces/productos`);
  }

  listarSoluciones(): Observable<Solucion[]> {
    if (this.useMock) {
      return of([...MOCK_SOLUCIONES.map(s => ({ ...s }))]).pipe(delay(300));
    }
    return this.http.get<Solucion[]>(`${this.baseUrl}/marketplaces/soluciones`);
  }

  // ============== WIZARD PEDIDOS YA ==============

  listarListasPrecios(): Observable<ListaPrecios[]> {
    if (this.useMock) {
      return of([...MOCK_LISTAS_PRECIOS]).pipe(delay(200));
    }
    return this.http.get<ListaPrecios[]>(`${this.baseUrl}/marketplaces/pedidosya/listas-precios`);
  }

  listarMetodosAceptacion(): Observable<MetodoAceptacionOption[]> {
    if (this.useMock) {
      return of([...MOCK_METODOS_ACEPTACION]).pipe(delay(200));
    }
    return this.http.get<MetodoAceptacionOption[]>(`${this.baseUrl}/marketplaces/pedidosya/metodos-aceptacion`);
  }

  obtenerDatosFacturacion(): Observable<DatosFacturacion> {
    if (this.useMock) {
      return of({ ...MOCK_DATOS_FACTURACION }).pipe(delay(200));
    }
    return this.http.get<DatosFacturacion>(`${this.baseUrl}/marketplaces/facturacion`);
  }

  activarIntegracion(): Observable<ResultadoActivacion> {
    if (this.useMock) {
      return of({
        sincronizacionIniciada: true,
        menuPublicado: true,
        sistemaListo: true
      }).pipe(delay(2500));
    }
    return this.http.post<ResultadoActivacion>(`${this.baseUrl}/marketplaces/pedidosya/activar`, {});
  }
}
