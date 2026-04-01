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
      <div class="summary-card card-green">
        <div class="card-header">
          <h3 class="card-title">Ventas totales</h3>
          <span
            class="badge"
            [class.badge-positive]="ventasResumen().variacion >= 0"
            [class.badge-negative]="ventasResumen().variacion < 0"
          >
            {{ ventasResumen().variacion >= 0 ? '+' : '' }}{{ ventasResumen().variacion }}%
          </span>
        </div>
        <div class="card-metrics">
          <div class="metric">
            <span class="metric-label">Total</span>
            <span class="metric-value">\${{ formatNumber(ventasResumen().total) }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Operaciones</span>
            <span class="metric-value">{{ ventasResumen().operaciones }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Promedio</span>
            <span class="metric-value">\${{ formatNumber(ventasResumen().promedio) }}</span>
          </div>
        </div>
      </div>

      <!-- Informacion de formas -->
      <div class="summary-card card-orange">
        <div class="card-header">
          <h3 class="card-title">Informacion de descuentos</h3>
          <span
            class="badge"
            [class.badge-positive]="formasResumen().variacion >= 0"
            [class.badge-negative]="formasResumen().variacion < 0"
          >
            {{ formasResumen().variacion >= 0 ? '+' : '' }}{{ formasResumen().variacion }}%
          </span>
        </div>
        <div class="card-metrics">
          <div class="metric">
            <span class="metric-label">Total</span>
            <span class="metric-value">\${{ formatNumber(formasResumen().total) }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Operaciones</span>
            <span class="metric-value">{{ formasResumen().operaciones }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Promedio</span>
            <span class="metric-value">\${{ formatNumber(formasResumen().promedio) }}</span>
          </div>
        </div>
      </div>

      <!-- Otros -->
      <div class="summary-card card-gray">
        <div class="card-header">
          <h3 class="card-title">Cubiertos</h3>
          <span
            class="badge"
            [class.badge-positive]="otrosResumen().variacion >= 0"
            [class.badge-negative]="otrosResumen().variacion < 0"
          >
            {{ otrosResumen().variacion >= 0 ? '+' : '' }}{{ otrosResumen().variacion }}%
          </span>
        </div>
        <div class="card-metrics">
          <div class="metric">
            <span class="metric-label">Total</span>
            <span class="metric-value">\${{ formatNumber(otrosResumen().total) }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Operaciones</span>
            <span class="metric-value">{{ otrosResumen().operaciones }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Promedio</span>
            <span class="metric-value">\${{ formatNumber(otrosResumen().promedio) }}</span>
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

    .summary-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 12px 20px 20px;
      border-left: 4px solid;
    }

    .card-green {
      border-left-color: #10B981;
    }

    .card-orange {
      border-left-color: #F97316;
    }

    .card-gray {
      border-left-color: #9CA3AF;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .card-title {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: #6B7280;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .badge {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
    }

    .badge-positive {
      background: #D1FAE5;
      color: #065F46;
    }

    .badge-negative {
      background: #FEE2E2;
      color: #991B1B;
    }

    .card-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      padding-top: 8px;
    }

    .metric {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .metric-label {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 500;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .metric-value {
      font-family: 'Inter', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #111827;
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
