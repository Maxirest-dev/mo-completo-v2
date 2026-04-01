import { Injectable, inject, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, EMPTY } from 'rxjs';

import { StockAlert } from '../models';
import { DASHBOARD_DATA_SOURCE } from '../../../core/tokens/dashboard-data-source.token';

/**
 * Manages stock alert data with a computed count of critical items.
 */
@Injectable()
export class StockAlertsService {

  private readonly dataSource = inject(DASHBOARD_DATA_SOURCE);
  private readonly destroyRef = inject(DestroyRef);

  // --- State ---
  readonly alerts = signal<StockAlert[]>([]);
  readonly loading = signal(true);

  // --- Computed ---
  readonly criticalCount = computed(() =>
    this.alerts().filter(a => a.estado === 'CRITICO').length
  );

  // --- Actions ---

  loadAlerts(): void {
    this.loading.set(true);

    this.dataSource.getStockAlerts().pipe(
      tap(data => {
        this.alerts.set(data);
        this.loading.set(false);
      }),
      catchError(err => {
        console.error('[StockAlertsService] Error loading stock alerts:', err);
        this.loading.set(false);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
