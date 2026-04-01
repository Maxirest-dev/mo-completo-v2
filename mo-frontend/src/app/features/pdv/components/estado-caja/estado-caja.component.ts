import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import { EstadoCaja } from '../../models';

@Component({
  selector: 'app-estado-caja',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="caja-card">
      <h3 class="caja-title">Estado de Caja</h3>
      <div class="caja-metrics">
        <div class="metric">
          <div class="metric-header">
            <span class="metric-label">Saldo</span>
            <span class="metric-badge">{{ estadoCaja().porcentajeEfectivo }}%</span>
          </div>
          <span class="metric-value saldo">\${{ formatNumber(estadoCaja().efectivo) }}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Ingresos</span>
          <span class="metric-value ingreso">\${{ formatNumber(estadoCaja().ingreso) }}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Egresos</span>
          <span class="metric-value egreso">\${{ formatNumber(estadoCaja().diferencia) }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .caja-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
    }

    .caja-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 20px 0;
    }

    .caja-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .metric {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .metric-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .metric-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .metric-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9999px;
      background: var(--success-bg);
      color: var(--success-text);
    }

    .metric-value {
      font-size: 26px;
      font-weight: 700;
      line-height: 1.1;
    }

    .metric-value.saldo { color: #1F2937; }
    .metric-value.ingreso { color: #059669; }
    .metric-value.egreso { color: #DC2626; }

    @media (max-width: 768px) {
      .caja-metrics {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .metric-value {
        font-size: 22px;
      }
    }
  `],
})
export class EstadoCajaComponent {
  estadoCaja = input.required<EstadoCaja>();

  formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }
}
