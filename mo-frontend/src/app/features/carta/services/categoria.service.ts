import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Categoria, CategoriaCreate, CategoriaUpdate, CategoriaWithProducts } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categorias`;

  getAll(includeInactive = false): Observable<Categoria[]> {
    let params = new HttpParams();
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }
    return this.http.get<Categoria[]>(this.baseUrl, { params });
  }

  getAllWithProducts(includeInactive = false): Observable<CategoriaWithProducts[]> {
    let params = new HttpParams();
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }
    return this.http.get<CategoriaWithProducts[]>(`${this.baseUrl}/with-products`, { params });
  }

  getById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/${id}`);
  }

  create(categoria: CategoriaCreate): Observable<Categoria> {
    return this.http.post<Categoria>(this.baseUrl, categoria);
  }

  update(id: number, categoria: CategoriaUpdate): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.baseUrl}/${id}`, categoria);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  toggleActive(id: number): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.baseUrl}/${id}/toggle-active`, {});
  }

  reorder(orderedIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/reorder`, orderedIds);
  }
}
