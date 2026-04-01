import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EstacionProduccionRow } from '../models/produccion-grid.model';
import { CocinarRequest } from '../models/produccion.model';

@Injectable({ providedIn: 'root' })
export class ProduccionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/produccion`;

  findAll(): Observable<EstacionProduccionRow[]> {
    return this.http.get<EstacionProduccionRow[]>(this.baseUrl);
  }

  cocinar(request: CocinarRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/cocinar`, request);
  }
}
