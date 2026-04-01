import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VentasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ventas`;

  getResumen(): Observable<any> { return this.http.get(`${this.baseUrl}/resumen`); }
  getArticulos(): Observable<any> { return this.http.get(`${this.baseUrl}/articulos`); }
  getFormasCobro(): Observable<any> { return this.http.get(`${this.baseUrl}/formas-cobro`); }
  getComprobantes(): Observable<any> { return this.http.get(`${this.baseUrl}/comprobantes`); }
  getConceptos(): Observable<any> { return this.http.get(`${this.baseUrl}/conceptos`); }
}
