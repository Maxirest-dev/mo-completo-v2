import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Producto, ProductoCreate, ProductoUpdate } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/productos`;

  getAll(includeInactive = false): Observable<Producto[]> {
    let params = new HttpParams();
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }
    return this.http.get<Producto[]>(this.baseUrl, { params });
  }

  getByCategoria(categoriaId: number, includeInactive = false): Observable<Producto[]> {
    let params = new HttpParams();
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }
    return this.http.get<Producto[]>(`${this.baseUrl}/categoria/${categoriaId}`, { params });
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  create(producto: ProductoCreate): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, producto);
  }

  update(id: number, producto: ProductoUpdate): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${id}`, producto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  toggleActive(id: number): Observable<Producto> {
    return this.http.patch<Producto>(`${this.baseUrl}/${id}/toggle-active`, {});
  }

  toggleDisponible(id: number): Observable<Producto> {
    return this.http.patch<Producto>(`${this.baseUrl}/${id}/toggle-disponible`, {});
  }

  toggleDestacado(id: number): Observable<Producto> {
    return this.http.patch<Producto>(`${this.baseUrl}/${id}/toggle-destacado`, {});
  }

  reorder(categoriaId: number, orderedIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/categoria/${categoriaId}/reorder`, orderedIds);
  }
}
