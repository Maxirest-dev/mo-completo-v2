import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, EMPTY } from 'rxjs';

import { KpiData } from '../models';
import { DASHBOARD_DATA_SOURCE } from '../../../core/tokens/dashboard-data-source.token';
import { WebSocketSimulatorService } from '../../../core/services/websocket-simulator.service';

/**
 * Manages KPI data: initial load via DataSource + real-time updates via WebSocket.
 */
@Injectable()
export class KpiService {

  private readonly dataSource = inject(DASHBOARD_DATA_SOURCE);
  private readonly wsService = inject(WebSocketSimulatorService);
  private readonly destroyRef = inject(DestroyRef);

  // --- State ---
  readonly kpis = signal<KpiData[]>([]);
  readonly loading = signal(true);

  // --- Actions ---

  loadKpis(turnoId: string): void {
    this.loading.set(true);

    this.dataSource.getKpis(turnoId).pipe(
      tap(data => {
        this.kpis.set(data);
        this.loading.set(false);
      }),
      catchError(err => {
        console.error('[KpiService] Error loading KPIs:', err);
        this.loading.set(false);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  /**
   * Subscribes to WebSocket KPI updates and patches individual KPIs
   * in the signal array when real-time events arrive.
   */
  startRealTimeUpdates(): void {
    this.wsService.kpiUpdates$.pipe(
      tap(event => {
        const current = this.kpis();
        const index = current.findIndex(k => k.id === event.payload.id);

        if (index === -1) {
          return;
        }

        const existing = current[index];
        const previousValue = existing.valor;
        const newValue = event.payload.valor;

        // Recalculate variacion based on the real-time value change
        const variacionValor = previousValue !== 0
          ? Math.round(((newValue - previousValue) / previousValue) * 100)
          : 0;

        const updatedKpi: KpiData = {
          ...existing,
          valor: newValue,
          variacion: {
            ...existing.variacion,
            valor: Math.abs(variacionValor),
            direccion: variacionValor > 0 ? 'up' : variacionValor < 0 ? 'down' : 'neutral',
            valorAnterior: previousValue
          }
        };

        const updated = [...current];
        updated[index] = updatedKpi;
        this.kpis.set(updated);
      }),
      catchError(err => {
        console.error('[KpiService] WebSocket KPI update error:', err);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
