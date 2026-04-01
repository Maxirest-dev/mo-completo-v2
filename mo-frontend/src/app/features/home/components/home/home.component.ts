import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';

import { DashboardFacadeService } from '../../services/dashboard-facade.service';
import { TurnoContextService } from '../../services/turno-context.service';
import { KpiService } from '../../services/kpi.service';
import { AiInsightsService } from '../../services/ai-insights.service';
import { DemandForecastService } from '../../services/demand-forecast.service';
import { StockAlertsService } from '../../services/stock-alerts.service';
import { TopVentasService } from '../../services/top-ventas.service';
import { RentabilityService } from '../../services/rentability.service';
import {
  DASHBOARD_DATA_SOURCE,
  MockDashboardDataSource,
} from '../../../../core/tokens/dashboard-data-source.token';

import { TurnoSelectorComponent } from '../turno-selector';
import { AiSummaryBannerComponent } from '../ai-summary-banner';
import { KpiCardsRowComponent } from '../kpi-cards-row';
import { DemandForecastComponent } from '../demand-forecast';
import { StockAlertsComponent } from '../stock-alerts';
import { TopVentasComponent } from '../top-ventas';
import { RentabilityAlertsComponent } from '../rentability-alerts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TurnoSelectorComponent,
    AiSummaryBannerComponent,
    KpiCardsRowComponent,
    DemandForecastComponent,
    StockAlertsComponent,
    TopVentasComponent,
    RentabilityAlertsComponent,
  ],
  providers: [
    DashboardFacadeService,
    TurnoContextService,
    KpiService,
    AiInsightsService,
    DemandForecastService,
    StockAlertsService,
    TopVentasService,
    RentabilityService,
    { provide: DASHBOARD_DATA_SOURCE, useClass: MockDashboardDataSource },
  ],
  template: `
    <div class="home-container">
      <header class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Home</h1>
          <p class="page-subtitle">Dashboard operativo del turno actual</p>
        </div>
        <div class="page-header-right">
          <app-turno-selector
            [turnoActivo]="facade.turnoActivo()"
            [turnos]="facade.turnos()"
            (turnoChange)="facade.changeTurno($event)"
          />
        </div>
      </header>

      <!-- AI Banner -->
      <app-ai-summary-banner
        [summary]="facade.aiSummary()"
        [loading]="facade.isLoading()"
      />

      <!-- KPI Cards -->
      <app-kpi-cards-row [kpis]="facade.kpis()" />

      <!-- Bottom Grid: 2 columns -->
      <div class="dashboard-grid">
        <div class="grid-col-left">
          <app-demand-forecast
            [forecast]="facade.demandForecast()"
            [prepItems]="facade.prepList()"
            [loading]="facade.isLoading()"
            (prepItemToggled)="facade.togglePrepItem($event)"
          />
          <app-top-ventas
            [ventas]="facade.topVentas()"
            [loading]="facade.isLoading()"
          />
        </div>
        <div class="grid-col-right">
          <app-stock-alerts
            [alerts]="facade.stockAlerts()"
            [loading]="facade.isLoading()"
          />
          <app-rentability-alerts
            [alerts]="facade.rentabilityAlerts()"
            [loading]="facade.isLoading()"
          />
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
    }

    .home-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--spacing-lg, 24px);
    }

    .page-header-left {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs, 4px);
    }

    .page-title {
      font-size: 26px;
      font-weight: 600;
      color: var(--slate-900, #0F172B);
      margin: 0;
      line-height: 1.2;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--slate-400, #90A1B9);
      margin: 0;
    }

    .page-header-right {
      display: flex;
      align-items: center;
    }

    app-ai-summary-banner {
      display: block;
      margin-bottom: var(--spacing-md, 16px);
    }

    app-kpi-cards-row {
      display: block;
      margin-bottom: var(--spacing-md, 16px);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md, 16px);
    }

    .grid-col-left,
    .grid-col-right {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md, 16px);
    }

    @media (max-width: 1024px) {
      :host {
        padding: var(--spacing-md, 16px);
      }

      .page-header {
        flex-direction: column;
        gap: 12px;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  readonly facade = inject(DashboardFacadeService);

  ngOnInit(): void {
    this.facade.init();
  }

  ngOnDestroy(): void {
    this.facade.destroy();
  }
}
