import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { TurnoActual, EstadoCaja, ViewMode } from '../../models';

@Component({
  selector: 'app-turno-kpis',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat-card">
      <!-- Header -->
      <div class="stat-card-header">
        <div class="stat-card-header-left">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="header-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
          <span class="stat-card-title">Turno Actual</span>
          <span class="badge badge-success">Turno abierto</span>
        </div>
        <div class="kpi-toggle">
          <button
            class="toggle-pill"
            [class.active]="viewMode() === 'pesos'"
            (click)="viewModeChange.emit('pesos')"
            title="Ver en pesos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Pesos
          </button>
          <button
            class="toggle-pill"
            [class.active]="viewMode() === 'cubiertos'"
            (click)="viewModeChange.emit('cubiertos')"
            title="Ver en cubiertos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
            </svg>
            Cubiertos
          </button>
        </div>
      </div>

      <!-- Turno KPIs -->
      <div class="stat-card-body">
        @if (viewMode() === 'pesos') {
          <div class="stat-card-metric">
            <span class="stat-card-label">Cobrado</span>
            <span class="stat-card-value">\${{ formatNumber(turno().ventas) }}</span>
          </div>
          <div class="stat-card-metric">
            <span class="stat-card-label">A cobrar</span>
            <span class="stat-card-value">\${{ formatNumber(turno().regulaciones) }}</span>
          </div>
          <div class="stat-card-metric">
            <span class="stat-card-label">Proyeccion</span>
            <span class="stat-card-value stat-card-value--highlight">\${{ formatNumber(turno().promedio) }}</span>
          </div>
        } @else {
          <div class="stat-card-metric">
            <span class="stat-card-label">Tickets</span>
            <span class="stat-card-value">#{{ formatNumber(turno().cantTickets) }}</span>
          </div>
          <div class="stat-card-metric">
            <span class="stat-card-label">Regulaciones</span>
            <span class="stat-card-value">#{{ formatNumber(turno().cantRegulaciones) }}</span>
          </div>
          <div class="stat-card-metric">
            <span class="stat-card-label">Cubiertos</span>
            <span class="stat-card-value stat-card-value--highlight">#{{ formatNumber(turno().cantCubiertos) }}</span>
          </div>
        }
      </div>

      <!-- Estado de Caja — compact footer -->
      <div class="caja-footer">
        <div class="caja-item">
          <span class="caja-dot caja-dot--saldo"></span>
          <span class="caja-label">Saldo</span>
          <span class="caja-value">\${{ formatNumber(estadoCaja().efectivo) }}</span>
          <span class="caja-pct">{{ estadoCaja().porcentajeEfectivo }}%</span>
        </div>
        <div class="caja-sep"></div>
        <div class="caja-item">
          <span class="caja-dot caja-dot--ingreso"></span>
          <span class="caja-label">Ingresos</span>
          <span class="caja-value caja-value--ingreso">\${{ formatNumber(estadoCaja().ingreso) }}</span>
        </div>
        <div class="caja-sep"></div>
        <div class="caja-item">
          <span class="caja-dot caja-dot--egreso"></span>
          <span class="caja-label">Egresos</span>
          <span class="caja-value caja-value--egreso">\${{ formatNumber(estadoCaja().diferencia) }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .stat-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 25px;
      border-bottom: 1px solid var(--divider-color);
    }

    .stat-card-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-icon {
      width: 20px;
      height: 20px;
      color: var(--slate-400);
    }

    .stat-card-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-heading);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 500;
      border-radius: var(--radius-sm);
      white-space: nowrap;
      border: 1px solid transparent;
      line-height: 1.333;
    }

    .badge-success {
      background-color: var(--success-bg);
      color: var(--success-color);
      border-color: var(--success-border);
    }

    .badge-success::before {
      content: '';
      width: 6px;
      height: 6px;
      background-color: var(--success-color);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .kpi-toggle {
      display: flex;
      gap: 6px;
    }

    .toggle-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background: var(--bg-primary);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .toggle-pill:hover:not(.active) {
      border-color: var(--slate-300);
      color: var(--text-primary);
    }

    .toggle-pill.active {
      background: var(--slate-900);
      color: white;
      border-color: var(--slate-900);
    }

    .stat-card-body {
      display: flex;
      gap: 0;
      padding: 20px 25px 25px;
    }

    .stat-card-metric {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .stat-card-metric + .stat-card-metric {
      padding-left: 25px;
      border-left: 1px solid var(--divider-color);
    }

    .stat-card-label {
      font-size: 13px;
      font-weight: 400;
      color: var(--text-secondary);
    }

    .stat-card-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-heading);
      line-height: 1.1;
    }

    .stat-card-value--highlight {
      color: var(--success-color);
    }

    /* Caja compact footer */
    .caja-footer {
      display: flex;
      align-items: center;
      padding: 14px 25px;
      background: var(--slate-50, #F8FAFC);
      border-top: 1px solid var(--divider-color);
    }

    .caja-item {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .caja-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .caja-dot--saldo { background: var(--slate-500, #64748B); }
    .caja-dot--ingreso { background: var(--success-color, #00A43D); }
    .caja-dot--egreso { background: var(--danger-color, #EF4444); }

    .caja-label {
      font-size: 12px;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .caja-value {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-heading);
      white-space: nowrap;
    }

    .caja-value--ingreso { color: var(--success-color); }
    .caja-value--egreso { color: var(--danger-color); }

    .caja-pct {
      font-size: 11px;
      font-weight: 600;
      padding: 1px 6px;
      border-radius: 4px;
      background: var(--success-bg);
      color: var(--success-color);
      white-space: nowrap;
    }

    .caja-sep {
      width: 1px;
      height: 20px;
      background: var(--border-color);
      margin: 0 16px;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .stat-card-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .stat-card-body {
        flex-direction: column;
        gap: 16px;
      }

      .stat-card-metric + .stat-card-metric {
        padding-left: 0;
        border-left: none;
        padding-top: 16px;
        border-top: 1px solid var(--divider-color);
      }

      .stat-card-value {
        font-size: 22px;
      }

      .caja-footer {
        flex-wrap: wrap;
        gap: 10px;
      }

      .caja-sep {
        display: none;
      }
    }
  `],
})
export class TurnoKpisComponent {
  turno = input.required<TurnoActual>();
  estadoCaja = input.required<EstadoCaja>();
  viewMode = input.required<ViewMode>();
  viewModeChange = output<ViewMode>();

  formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }
}
