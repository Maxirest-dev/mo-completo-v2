import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  TurnoActual,
  EstadoCaja,
  FormaCobrotTurno,
  FinTurno,
  CierreTurnoData,
  ConfigEstacion,
  ConfigFormaCobro,
  ConfigCategoria,
  ConfigDispositivo,
  ConfigTurno,
  ArcaConfig,
} from '../models';
import {
  MOCK_TURNO_ACTUAL,
  MOCK_ESTADO_CAJA,
  MOCK_FORMAS_COBRO,
  MOCK_FINES_TURNO,
  MOCK_CIERRE_TURNO,
  MOCK_ESTACIONES,
  MOCK_FORMAS_COBRO_CONFIG,
  MOCK_CATEGORIAS,
  MOCK_DISPOSITIVOS,
  MOCK_TURNOS,
  MOCK_ARCA_CONFIG,
} from '../data/mock-pdv.data';

@Injectable({ providedIn: 'root' })
export class PdvService {
  private readonly http = inject(HttpClient);

  getTurnoActual(): Observable<TurnoActual> {
    return of(MOCK_TURNO_ACTUAL);
  }

  getEstadoCaja(): Observable<EstadoCaja> {
    return of(MOCK_ESTADO_CAJA);
  }

  getFormasCobro(): Observable<FormaCobrotTurno[]> {
    return of(MOCK_FORMAS_COBRO);
  }

  getFinesTurno(): Observable<FinTurno[]> {
    return of(MOCK_FINES_TURNO);
  }

  getCierreTurnoData(): Observable<CierreTurnoData> {
    return of(MOCK_CIERRE_TURNO);
  }

  getEstaciones(): Observable<ConfigEstacion[]> {
    return of(MOCK_ESTACIONES);
  }

  getFormasCobroConfig(): Observable<ConfigFormaCobro[]> {
    return of(MOCK_FORMAS_COBRO_CONFIG);
  }

  getCategorias(): Observable<ConfigCategoria[]> {
    return of(MOCK_CATEGORIAS);
  }

  getDispositivos(): Observable<ConfigDispositivo[]> {
    return of(MOCK_DISPOSITIVOS);
  }

  getTurnos(): Observable<ConfigTurno[]> {
    return of(MOCK_TURNOS);
  }

  getArcaConfig(): Observable<ArcaConfig> {
    return of(MOCK_ARCA_CONFIG);
  }
}
