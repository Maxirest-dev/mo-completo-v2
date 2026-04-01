import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { DashboardPanelComponent } from '../dashboard-panel/dashboard-panel.component';
import { DemandChartComponent } from './demand-chart.component';
import { PrepListComponent } from './prep-list.component';
import { DemandForecast } from '../../models/demand-forecast.model';
import { PrepItem } from '../../models/prep-list.model';

@Component({
  selector: 'app-demand-forecast',
  standalone: true,
  imports: [DashboardPanelComponent, DemandChartComponent, PrepListComponent],
  template: `
    <app-dashboard-panel
      titulo="Prevision de Demanda & Prep-List"
      icono="📊"
      [loading]="loading()"
    >
      <div class="demand-forecast-content">
        <section class="chart-section">
          @if (forecast(); as fc) {
            <app-demand-chart [forecast]="fc" />
          }
        </section>

        <hr class="section-divider" />

        <section class="prep-section">
          <h3 class="prep-section-title">Lista de Produccion</h3>
          <app-prep-list
            [items]="prepItems()"
            (itemToggled)="prepItemToggled.emit($event)"
          />
        </section>
      </div>
    </app-dashboard-panel>
  `,
  styles: [`
    :host {
      display: block;
    }

    .demand-forecast-content {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .chart-section {
      margin: -8px -4px 0;
    }

    .section-divider {
      border: none;
      border-top: 1px solid var(--divider-color, #F1F5F9);
      margin: 12px 0;
    }

    .prep-section-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--slate-600, #45556C);
      margin: 0 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemandForecastComponent {
  forecast = input.required<DemandForecast | null>();
  prepItems = input.required<PrepItem[]>();
  loading = input(false);

  prepItemToggled = output<string>();
}
