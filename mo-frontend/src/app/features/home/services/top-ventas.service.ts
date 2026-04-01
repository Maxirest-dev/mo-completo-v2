import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, EMPTY } from 'rxjs';

import { TopVenta } from '../models';
import { DASHBOARD_DATA_SOURCE } from '../../../core/tokens/dashboard-data-source.token';
import { WebSocketSimulatorService } from '../../../core/services/websocket-simulator.service';

/**
 * Manages top-selling products ranking with real-time updates from WebSocket venta events.
 */
@Injectable()
export class TopVentasService {

  private readonly dataSource = inject(DASHBOARD_DATA_SOURCE);
  private readonly wsService = inject(WebSocketSimulatorService);
  private readonly destroyRef = inject(DestroyRef);

  // --- State ---
  readonly topVentas = signal<TopVenta[]>([]);
  readonly loading = signal(true);

  // --- Actions ---

  loadTopVentas(turnoId: string): void {
    this.loading.set(true);

    this.dataSource.getTopVentas(turnoId).pipe(
      tap(data => {
        this.topVentas.set(data);
        this.loading.set(false);
      }),
      catchError(err => {
        console.error('[TopVentasService] Error loading top ventas:', err);
        this.loading.set(false);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  /**
   * Subscribes to WebSocket venta events and updates rankings in real-time.
   * When a new venta arrives, increments cantidadPedidos for matching products
   * and re-sorts the ranking.
   */
  startRealTimeUpdates(): void {
    this.wsService.ventaUpdates$.pipe(
      tap(event => {
        const current = this.topVentas();
        if (current.length === 0) {
          return;
        }

        let updated = [...current];
        let changed = false;

        for (const producto of event.payload.productos) {
          const index = updated.findIndex(tv => tv.productoId === producto.productoId);
          if (index !== -1) {
            const existing = updated[index];
            updated[index] = {
              ...existing,
              cantidadPedidos: existing.cantidadPedidos + producto.cantidad,
              tendencia: 'SUBE'
            };
            changed = true;
          }
        }

        if (changed) {
          // Re-sort by cantidadPedidos descending and reassign positions
          updated.sort((a, b) => b.cantidadPedidos - a.cantidadPedidos);
          updated = updated.map((item, idx) => ({
            ...item,
            posicion: idx + 1
          }));
          this.topVentas.set(updated);
        }
      }),
      catchError(err => {
        console.error('[TopVentasService] WebSocket venta update error:', err);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
