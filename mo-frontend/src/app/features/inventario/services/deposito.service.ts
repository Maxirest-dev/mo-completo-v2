import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Deposito, DepositoCreate, DepositoUpdate, DepositoWithInsumos } from '../models';

@Injectable({ providedIn: 'root' })
export class DepositoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/depositos`;

  findAll(): Observable<Deposito[]> {
    return this.http.get<Deposito[]>(this.baseUrl);
  }

  findAllWithInsumos(): Observable<DepositoWithInsumos[]> {
    return this.http.get<DepositoWithInsumos[]>(`${this.baseUrl}/with-insumos`);
  }

  findById(id: number): Observable<Deposito> {
    return this.http.get<Deposito>(`${this.baseUrl}/${id}`);
  }

  create(deposito: DepositoCreate): Observable<Deposito> {
    return this.http.post<Deposito>(this.baseUrl, deposito);
  }

  update(id: number, deposito: DepositoUpdate): Observable<Deposito> {
    return this.http.put<Deposito>(`${this.baseUrl}/${id}`, deposito);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  toggleActivo(id: number): Observable<Deposito> {
    return this.http.patch<Deposito>(`${this.baseUrl}/${id}/toggle-activo`, {});
  }

  reorder(ids: number[]): Observable<Deposito[]> {
    return this.http.put<Deposito[]>(`${this.baseUrl}/reorder`, ids);
  }
}
