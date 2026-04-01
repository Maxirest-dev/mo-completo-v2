import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';

import { KpiData } from '../../models/kpi.model';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';
import { KpiRenderStrategy } from '../kpi-card/kpi-strategies';
import { CurrencyKpiStrategy } from '../kpi-card/kpi-strategies';
import { PercentageKpiStrategy } from '../kpi-card/kpi-strategies';
import { GaugeKpiStrategy } from '../kpi-card/kpi-strategies';

interface KpiWithStrategy {
  data: KpiData;
  strategy: KpiRenderStrategy;
}

// Singleton instances to avoid recreating on each render
const SPARKLINE_STRATEGY = new CurrencyKpiStrategy('sparkline');
const TREND_ARROW_STRATEGY = new CurrencyKpiStrategy('trend-arrow');
const PERCENTAGE_STRATEGY = new PercentageKpiStrategy();
const GAUGE_STRATEGY = new GaugeKpiStrategy();

@Component({
  selector: 'app-kpi-cards-row',
  standalone: true,
  imports: [KpiCardComponent],
  template: `
    <div class="kpi-row">
      @for (item of kpiItems(); track item.data.id) {
        <app-kpi-card
          class="kpi-col"
          [data]="item.data"
          [strategy]="item.strategy"
        />
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .kpi-row {
      display: flex;
      gap: var(--spacing-md, 16px);
      align-items: stretch;
    }

    .kpi-col {
      flex: 1;
      min-width: 0;
      display: flex;
    }

    @media (max-width: 768px) {
      .kpi-row {
        flex-wrap: wrap;
      }

      .kpi-col {
        flex: 0 0 calc(50% - 8px);
      }
    }

    @media (max-width: 480px) {
      .kpi-col {
        flex: 0 0 100%;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardsRowComponent {

  kpis = input.required<KpiData[]>();

  kpiItems = computed<KpiWithStrategy[]>(() =>
    this.kpis().map(kpi => ({
      data: kpi,
      strategy: this.resolveStrategy(kpi),
    }))
  );

  private resolveStrategy(kpi: KpiData): KpiRenderStrategy {
    switch (kpi.tipo) {
      case 'currency':
        // Distinguish Ventas (sparkline) from Ticket Promedio (trend-arrow)
        // by checking the KPI id or title for 'ticket' keyword
        return this.isTrendArrowCurrency(kpi)
          ? TREND_ARROW_STRATEGY
          : SPARKLINE_STRATEGY;

      case 'percentage':
        return PERCENTAGE_STRATEGY;

      case 'gauge':
        return GAUGE_STRATEGY;

      default:
        return SPARKLINE_STRATEGY;
    }
  }

  /**
   * Determines if a currency KPI should use the trend-arrow template
   * instead of sparkline. Ticket Promedio uses trend-arrow.
   */
  private isTrendArrowCurrency(kpi: KpiData): boolean {
    const id = kpi.id.toLowerCase();
    const titulo = kpi.titulo.toLowerCase();
    return id.includes('ticket') || titulo.includes('ticket');
  }
}
