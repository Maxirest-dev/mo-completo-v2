import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, EMPTY } from 'rxjs';

import { DemandForecast } from '../models';
import { DASHBOARD_DATA_SOURCE } from '../../../core/tokens/dashboard-data-source.token';

/**
 * Manages demand forecast data (historical + AI prediction series).
 */
@Injectable()
export class DemandForecastService {

  private readonly dataSource = inject(DASHBOARD_DATA_SOURCE);
  private readonly destroyRef = inject(DestroyRef);

  // --- State ---
  readonly forecast = signal<DemandForecast | null>(null);
  readonly loading = signal(true);

  // --- Actions ---

  loadForecast(fecha: string): void {
    this.loading.set(true);

    this.dataSource.getDemandForecast(fecha).pipe(
      tap(data => {
        this.forecast.set(data);
        this.loading.set(false);
      }),
      catchError(err => {
        console.error('[DemandForecastService] Error loading forecast:', err);
        this.loading.set(false);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
