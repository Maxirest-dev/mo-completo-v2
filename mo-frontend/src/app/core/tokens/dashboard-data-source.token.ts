import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

import {
  KpiData,
  AiSummary,
  StockAlert,
  TopVenta,
  DemandForecast,
  PrepItem,
  RentabilityAlert
} from '../../features/home/models';

import {
  MOCK_KPIS,
  MOCK_AI_SUMMARY,
  MOCK_STOCK_ALERTS,
  MOCK_TOP_VENTAS,
  MOCK_DEMAND_FORECAST,
  MOCK_PREP_LIST,
  MOCK_RENTABILITY_ALERTS
} from '../../features/home/data';

// --- Interface (Adapter contract) ---

export interface DashboardDataSource {
  getKpis(turnoId: string): Observable<KpiData[]>;
  getAiSummary(turnoId: string): Observable<AiSummary>;
  getStockAlerts(): Observable<StockAlert[]>;
  getTopVentas(turnoId: string): Observable<TopVenta[]>;
  getDemandForecast(fecha: string): Observable<DemandForecast>;
  getPrepList(turnoId: string): Observable<PrepItem[]>;
  getRentabilityAlerts(turnoId: string): Observable<RentabilityAlert[]>;
}

// --- InjectionToken ---

export const DASHBOARD_DATA_SOURCE = new InjectionToken<DashboardDataSource>(
  'DashboardDataSource'
);

// --- Mock implementation (Adapter for development) ---

@Injectable()
export class MockDashboardDataSource implements DashboardDataSource {

  getKpis(_turnoId: string): Observable<KpiData[]> {
    return of(MOCK_KPIS).pipe(delay(300));
  }

  getAiSummary(_turnoId: string): Observable<AiSummary> {
    return of(MOCK_AI_SUMMARY).pipe(delay(300));
  }

  getStockAlerts(): Observable<StockAlert[]> {
    return of(MOCK_STOCK_ALERTS).pipe(delay(300));
  }

  getTopVentas(_turnoId: string): Observable<TopVenta[]> {
    return of(MOCK_TOP_VENTAS).pipe(delay(300));
  }

  getDemandForecast(_fecha: string): Observable<DemandForecast> {
    return of(MOCK_DEMAND_FORECAST).pipe(delay(300));
  }

  getPrepList(_turnoId: string): Observable<PrepItem[]> {
    return of(MOCK_PREP_LIST).pipe(delay(300));
  }

  getRentabilityAlerts(_turnoId: string): Observable<RentabilityAlert[]> {
    return of(MOCK_RENTABILITY_ALERTS).pipe(delay(300));
  }
}
