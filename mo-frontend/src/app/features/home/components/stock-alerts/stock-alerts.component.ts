import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { DashboardPanelComponent } from '../dashboard-panel/dashboard-panel.component';
import { StockAlertItemComponent } from './stock-alert-item.component';
import { StockAlert, StockAlertEstado } from '../../models';

const ESTADO_PRIORIDAD: Record<StockAlertEstado, number> = {
  CRITICO: 0,
  BAJO: 1,
  NORMAL: 2,
};

@Component({
  selector: 'app-stock-alerts',
  standalone: true,
  imports: [DashboardPanelComponent, StockAlertItemComponent],
  template: `
    <app-dashboard-panel titulo="Alertas de Stock" icono="📦" [loading]="loading()">
      @if (sortedAlerts().length === 0) {
        <div class="empty-state">
          <span class="empty-icon">✅</span>
          <p class="empty-text">Sin alertas de stock</p>
        </div>
      } @else {
        <div class="alerts-list">
          @for (alert of sortedAlerts(); track alert.insumoId) {
            <app-stock-alert-item [alert]="alert" />
          }
        </div>
      }

      <ng-container panel-footer>
        @if (criticCount() > 0) {
          <span class="footer-summary">
            {{ criticCount() }} insumo{{ criticCount() > 1 ? 's' : '' }} en estado critico
          </span>
        }
      </ng-container>
    </app-dashboard-panel>
  `,
  styles: [`
    .alerts-list {
      display: flex;
      flex-direction: column;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      gap: 8px;
    }

    .empty-icon {
      font-size: 28px;
    }

    .empty-text {
      font-size: 14px;
      color: var(--slate-400, #90A1B9);
      margin: 0;
    }

    .footer-summary {
      font-size: 12px;
      font-weight: 500;
      color: var(--danger-color, #EF4444);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockAlertsComponent {
  alerts = input.required<StockAlert[]>();
  loading = input(false);

  protected sortedAlerts = computed(() =>
    [...this.alerts()].sort(
      (a, b) => ESTADO_PRIORIDAD[a.estado] - ESTADO_PRIORIDAD[b.estado]
    )
  );

  protected criticCount = computed(() =>
    this.alerts().filter(a => a.estado === 'CRITICO').length
  );
}
