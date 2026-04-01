import { Injectable, inject, computed, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, tap, catchError, EMPTY, take } from 'rxjs';

import { PrepItem } from '../models';
import { DASHBOARD_DATA_SOURCE } from '../../../core/tokens/dashboard-data-source.token';
import { WebSocketSimulatorService } from '../../../core/services/websocket-simulator.service';

import { TurnoContextService } from './turno-context.service';
import { KpiService } from './kpi.service';
import { AiInsightsService } from './ai-insights.service';
import { DemandForecastService } from './demand-forecast.service';
import { StockAlertsService } from './stock-alerts.service';
import { TopVentasService } from './top-ventas.service';
import { RentabilityService } from './rentability.service';

/**
 * Facade Pattern -- single entry point for the HomeComponent to access
 * all dashboard data. Orchestrates loading, real-time updates, turno changes,
 * and cleanup across 7+ sub-services.
 */
@Injectable()
export class DashboardFacadeService {

  // --- Injected sub-services ---
  private readonly turnoContext = inject(TurnoContextService);
  private readonly kpiService = inject(KpiService);
  private readonly aiService = inject(AiInsightsService);
  private readonly demandService = inject(DemandForecastService);
  private readonly stockService = inject(StockAlertsService);
  private readonly topVentasService = inject(TopVentasService);
  private readonly rentabilityService = inject(RentabilityService);
  private readonly wsService = inject(WebSocketSimulatorService);
  private readonly dataSource = inject(DASHBOARD_DATA_SOURCE);
  private readonly destroyRef = inject(DestroyRef);

  // --- Prep list (managed directly by facade since it has toggle logic) ---
  readonly prepList = signal<PrepItem[]>([]);

  // --- Exposed readonly signals from sub-services ---
  readonly kpis = this.kpiService.kpis;
  readonly aiSummary = this.aiService.summary;
  readonly stockAlerts = this.stockService.alerts;
  readonly topVentas = this.topVentasService.topVentas;
  readonly demandForecast = this.demandService.forecast;
  readonly rentabilityAlerts = this.rentabilityService.alerts;
  readonly turnoActivo = this.turnoContext.turnoActivo;
  readonly turnos = this.turnoContext.turnos;
  readonly criticalStockCount = this.stockService.criticalCount;

  // --- Aggregated loading state ---
  readonly isLoading = computed(() =>
    this.kpiService.loading() ||
    this.aiService.loading() ||
    this.demandService.loading() ||
    this.stockService.loading() ||
    this.topVentasService.loading() ||
    this.rentabilityService.loading()
  );

  // --- Computed: any critical alerts active ---
  readonly hasActiveAlerts = computed(() =>
    this.stockService.alerts().some(a => a.estado === 'CRITICO') ||
    this.rentabilityService.alerts().some(a => a.severidad === 'CRITICAL')
  );

  // --- Actions ---

  /**
   * Initializes the dashboard:
   * 1. Load turno activo and turno list
   * 2. Load all data in parallel
   * 3. Start WebSocket simulation for real-time updates
   */
  init(): void {
    // Step 1: Load turno context
    this.turnoContext.loadTurnos();
    this.turnoContext.loadTurnoActivo();

    // Step 2: Once turno is available, load all data in parallel
    this.turnoContext.turnoActivo$.pipe(
      take(1),
      switchMap(turno => {
        if (!turno) {
          return EMPTY;
        }

        const turnoId = turno.id;
        const today = new Date().toISOString().split('T')[0];

        // Fire all loads (each service manages its own loading state)
        this.kpiService.loadKpis(turnoId);
        this.aiService.loadSummary(turnoId);
        this.demandService.loadForecast(today);
        this.stockService.loadAlerts();
        this.topVentasService.loadTopVentas(turnoId);
        this.rentabilityService.loadAlerts(turnoId);

        // Load prep list directly
        return this.dataSource.getPrepList(turnoId).pipe(
          tap(items => this.prepList.set(items)),
          catchError(err => {
            console.error('[DashboardFacade] Error loading prep list:', err);
            return EMPTY;
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    // Step 3: Start real-time streams
    this.wsService.startSimulation();
    this.kpiService.startRealTimeUpdates();
    this.topVentasService.startRealTimeUpdates();
  }

  /** Force reload all data from the current turno. */
  refresh(): void {
    const turno = this.turnoContext.turnoActivo();
    if (!turno) {
      return;
    }

    const turnoId = turno.id;
    const today = new Date().toISOString().split('T')[0];

    this.kpiService.loadKpis(turnoId);
    this.aiService.refresh(turnoId);
    this.demandService.loadForecast(today);
    this.stockService.loadAlerts();
    this.topVentasService.loadTopVentas(turnoId);
    this.rentabilityService.loadAlerts(turnoId);

    this.dataSource.getPrepList(turnoId).pipe(
      tap(items => this.prepList.set(items)),
      catchError(err => {
        console.error('[DashboardFacade] Error refreshing prep list:', err);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  /** Switch to a different turno and reload all data. */
  changeTurno(turnoId: string): void {
    this.turnoContext.changeTurno(turnoId);
    this.refresh();
  }

  /** Toggle a prep-list item's completado state. */
  togglePrepItem(itemId: string): void {
    const current = this.prepList();
    const index = current.findIndex(item => item.id === itemId);
    if (index === -1) {
      return;
    }

    const item = current[index];
    const updated = [...current];
    updated[index] = {
      ...item,
      completado: !item.completado,
      completadoAt: !item.completado ? new Date().toISOString() : null,
      completadoPor: !item.completado ? 'current-user' : null
    };
    this.prepList.set(updated);
  }

  /** Cleanup: stop simulation and release resources. */
  destroy(): void {
    this.wsService.stopSimulation();
  }
}
