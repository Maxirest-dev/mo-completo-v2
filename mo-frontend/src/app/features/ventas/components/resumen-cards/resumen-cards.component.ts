import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaResumen } from '../../models';

@Component({
  selector: 'app-resumen-cards',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cards-row">
      <!-- Ventas totales -->
      <div class="stat-card">
        <div class="stat-card-header">
          <h3 class="stat-card-title">Ventas totales</h3>
          <span
            class="trend-badge"
            [class.trend-up]="ventasResumen().variacion >= 0"
            [class.trend-down]="ventasResumen().variacion < 0"
          >
            <span class="trend-arrow">{{ ventasResumen().variacion >= 0 ? '\u2191' : '\u2193' }}</span>
            {{ ventasResumen().variacion >= 0 ? '+' : '' }}{{ ventasResumen().variacion }}%
          </span>
        </div>
        <div class="stat-card-body">
          <div class="stat-card-metric">
            <span class="stat-card-label">Total</span>
            <span class="stat-card-value">\${{ formatNumber(ventasResumen().total) }}</span>
          </div>
          <div class="stat-card-metric">
            <span class="stat-card-label">Cantidad</span>
            <span class="stat-card-value">{{ ventasResumen().operaciones }}</span>
          </div>
          <div class="stat-card-metric">
            <span class="stat-card-label">Promedio</span>
            <span class="stat-card-value">\${{ formatNumber(ventasResumen().promedio) }}</span>
          </div>
        </div>
      </div>

      <!-- Informacion de descuentos -->
      <div class="stat-card">
        <div class="stat-card-header">
          <h3 class="stat-card-title">Informacion de descuentos</h3>
          <span
            class="trend-badge"
            [class.trend-up]="formasResumen().variacion >= 0"
            [class.trend-down]="formasResumen().variacion < 0"
          >
            <span class="trend-arrow">{{ formasResumen().variacion >= 0 ? '\u2191' : '\u2193' }}</span>
            {{ formasResumen().variacion >= 0 ? '+' : '' }}{{ formasResumen().variacion }}%
          </span>
        </div>
        <div class="stat-card-body">
          <div class="stat-card-metric">
            <span class="stat-card-label">Total</span>
            <span class="stat-card-value">\${{ formatNumber(formasResumen().total) }}</span>
          </div>
          <div class="stat-card-metric">
            <span class="stat-card-label">Cantidad</span>
            <span class="stat-card-value">{{ formasResumen().operaciones }}</span>
          </div>
          <div class="stat-card-metric">
            <span class="stat-card-label">Promedio</span>
            <span class="stat-card-value">\${{ formatNumber(formasResumen().promedio) }}</span>
          </div>
        </div>
      </div>

      <!-- Cubiertos -->
      <div class="stat-card">
        <div class="stat-card-header">
          <h3 class="stat-card-title">Cubiertos</h3>
          <span
            class="trend-badge"
            [class.trend-up]="otrosResumen().variacion >= 0"
            [class.trend-down]="otrosResumen().variacion < 0"
          >
            <span class="trend-arrow">{{ otrosResumen().variacion >= 0 ? '\u2191' : '\u2193' }}</span>
            {{ otrosResumen().variacion >= 0 ? '+' : '' }}{{ otrosResumen().variacion }}%
          </span>
        </div>
        <div class="stat-card-body">
          <div class="stat-card-metric">
            <span class="stat-card-label">Total</span>
            <span class="stat-card-value">\${{ formatNumber(otrosResumen().total) }}</span>
          </div>
          <div class="stat-card-metric">
            <span class="stat-card-label">Cantidad</span>
            <span class="stat-card-value">{{ otrosResumen().operaciones }}</span>
          </div>
          <div class="stat-card-metric">
            <span class="stat-card-label">Promedio</span>
            <span class="stat-card-value">\${{ formatNumber(otrosResumen().promedio) }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cards-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--bg-primary, white);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-sm, 0 1px 1.75px -1px rgba(0,0,0,0.1), 0 1px 2.625px rgba(0,0,0,0.1));
      border: 1px solid var(--border-color, #E2E8F0);
      overflow: hidden;
    }

    .stat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 25px 0;
    }

    .stat-card-title {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--slate-900, #0F172B);
      margin: 0;
    }

    .trend-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .trend-up {
      color: #059669;
      background: #ECFDF5;
    }

    .trend-down {
      color: #DC2626;
      background: #FEF2F2;
    }

    .trend-arrow {
      font-size: 11px;
    }

    .stat-card-body {
      display: flex;
      gap: 0;
      padding: 16px 25px 25px;
    }

    .stat-card-metric {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .stat-card-metric + .stat-card-metric {
      padding-left: 25px;
      border-left: 1px solid var(--divider-color, #F1F5F9);
    }

    .stat-card-label {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 400;
      color: var(--slate-400, #90A1B9);
    }

    .stat-card-value {
      font-family: 'Inter', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--slate-900, #0F172B);
      line-height: 1.1;
    }

    @media (max-width: 1024px) {
      .cards-row {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ResumenCardsComponent {
  readonly ventasResumen = input.required<VentaResumen>();
  readonly formasResumen = input.required<VentaResumen>();
  readonly otrosResumen = input.required<VentaResumen>();

  formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }
}
