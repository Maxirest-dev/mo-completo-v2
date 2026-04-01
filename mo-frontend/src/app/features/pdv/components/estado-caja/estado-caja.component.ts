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
    <div class="card">
      <div class="card-header">
        <div class="card-header-left">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="header-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
          </svg>
          <span class="card-header-title">Estado de Caja</span>
        </div>
      </div>
      <div class="card-body">
        <div class="caja-metrics">
          <div class="metric">
            <div class="metric-header">
              <span class="metric-label">Saldo</span>
              <span class="metric-badge">{{ estadoCaja().porcentajeEfectivo }}%</span>
            </div>
            <span class="metric-value metric-value--saldo">\${{ formatNumber(estadoCaja().efectivo) }}</span>
          </div>
          <div class="metric-separator"></div>
          <div class="metric">
            <span class="metric-label">Ingresos</span>
            <span class="metric-value metric-value--ingreso">\${{ formatNumber(estadoCaja().ingreso) }}</span>
          </div>
          <div class="metric-separator"></div>
          <div class="metric">
            <span class="metric-label">Egresos</span>
            <span class="metric-value metric-value--egreso">\${{ formatNumber(estadoCaja().diferencia) }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 25px;
      border-bottom: 1px solid var(--divider-color);
    }

    .card-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-icon {
      width: 20px;
      height: 20px;
      color: var(--slate-400);
    }

    .card-header-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-heading);
    }

    .card-body {
      padding: 20px 25px 25px;
    }

    .caja-metrics {
      display: flex;
      align-items: stretch;
    }

    .metric {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .metric-separator {
      width: 1px;
      background: var(--divider-color);
      align-self: stretch;
      margin: 0 25px;
    }

    .metric-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .metric-label {
      font-size: 13px;
      font-weight: 400;
      color: var(--text-secondary);
    }

    .metric-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
      border-radius: var(--radius-sm);
      background: var(--success-bg);
      color: var(--success-color);
      border: 1px solid var(--success-border);
    }

    .metric-value {
      font-size: 28px;
      font-weight: 700;
      line-height: 1.1;
    }

    .metric-value--saldo { color: var(--text-heading); }
    .metric-value--ingreso { color: var(--success-color); }
    .metric-value--egreso { color: var(--danger-color); }

    @media (max-width: 768px) {
      .caja-metrics {
        flex-direction: column;
        gap: 16px;
      }

      .metric-separator {
        width: 100%;
        height: 1px;
        margin: 0;
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
