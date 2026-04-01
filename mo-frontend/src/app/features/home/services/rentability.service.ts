import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, EMPTY } from 'rxjs';

import { RentabilityAlert } from '../models';
import { DASHBOARD_DATA_SOURCE } from '../../../core/tokens/dashboard-data-source.token';

/**
 * Manages BI/AI-generated rentability alerts.
 */
@Injectable()
export class RentabilityService {

  private readonly dataSource = inject(DASHBOARD_DATA_SOURCE);
  private readonly destroyRef = inject(DestroyRef);

  // --- State ---
  readonly alerts = signal<RentabilityAlert[]>([]);
  readonly loading = signal(true);

  // --- Actions ---

  loadAlerts(turnoId: string): void {
    this.loading.set(true);

    this.dataSource.getRentabilityAlerts(turnoId).pipe(
      tap(data => {
        this.alerts.set(data);
        this.loading.set(false);
      }),
      catchError(err => {
        console.error('[RentabilityService] Error loading rentability alerts:', err);
        this.loading.set(false);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
