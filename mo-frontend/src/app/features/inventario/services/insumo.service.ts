import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Insumo, InsumoCreate, InsumoUpdate } from '../models';

@Injectable({ providedIn: 'root' })
export class InsumoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/insumos`;

  findAll(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.baseUrl);
  }

  findById(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.baseUrl}/${id}`);
  }

  findByDeposito(depositoId: number): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.baseUrl}/deposito/${depositoId}`);
  }

  create(insumo: InsumoCreate): Observable<Insumo> {
    return this.http.post<Insumo>(this.baseUrl, insumo);
  }

  update(id: number, insumo: InsumoUpdate): Observable<Insumo> {
    return this.http.put<Insumo>(`${this.baseUrl}/${id}`, insumo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  toggleActivo(id: number): Observable<Insumo> {
    return this.http.patch<Insumo>(`${this.baseUrl}/${id}/toggle-activo`, {});
  }

  findStockBajo(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.baseUrl}/stock-bajo`);
  }

  findSinStock(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.baseUrl}/sin-stock`);
  }

  search(query: string): Observable<Insumo[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Insumo[]>(`${this.baseUrl}/search`, { params });
  }
}
