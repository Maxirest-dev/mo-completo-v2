import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import { TurnoActual, ViewMode } from '../../models';

@Component({
  selector: 'app-turno-kpis',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kpi-card">
      <div class="kpi-header">
        <div class="kpi-header-left">
          <span class="badge-success badge-pill">Turno abierto</span>
        </div>
        <div class="kpi-toggle">
          <button
            class="toggle-btn"
            [class.active]="viewMode() === 'pesos'"
            (click)="viewModeChange.emit('pesos')"
            title="Ver en pesos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
          <button
            class="toggle-btn"
            [class.active]="viewMode() === 'cubiertos'"
            (click)="viewModeChange.emit('cubiertos')"
            title="Ver en cubiertos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
            </svg>
          </button>
        </div>
      </div>

      <div class="kpi-body">
        @if (viewMode() === 'pesos') {
          <div class="kpi-item">
            <span class="kpi-label">Cobrado</span>
            <span class="kpi-value">\${{ formatNumber(turno().ventas) }}</span>
          </div>
          <div class="kpi-divider"></div>
          <div class="kpi-item">
            <span class="kpi-label">A cobrar</span>
            <span class="kpi-value">\${{ formatNumber(turno().regulaciones) }}</span>
          </div>
          <div class="kpi-divider"></div>
          <div class="kpi-item">
            <span class="kpi-label">Proyeccion</span>
            <span class="kpi-value kpi-value-highlight">\${{ formatNumber(turno().promedio) }}</span>
          </div>
        } @else {
          <div class="kpi-item">
            <span class="kpi-label">Tickets</span>
            <span class="kpi-value">#{{ formatNumber(turno().cantTickets) }}</span>
          </div>
          <div class="kpi-divider"></div>
          <div class="kpi-item">
            <span class="kpi-label">Regulaciones</span>
            <span class="kpi-value">#{{ formatNumber(turno().cantRegulaciones) }}</span>
          </div>
          <div class="kpi-divider"></div>
          <div class="kpi-item">
            <span class="kpi-label">Cubiertos</span>
            <span class="kpi-value kpi-value-highlight">#{{ formatNumber(turno().cantCubiertos) }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .kpi-card {
      background: white;
      border: 1px solid var(--border-color);
      border-left: 4px solid var(--success-color);
      border-radius: 12px;
      padding: 20px 24px;
    }

    .kpi-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 14px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 9999px;
      background: var(--success-bg);
      color: var(--success-text);
    }

    .badge-pill::before {
      content: '';
      width: 6px;
      height: 6px;
      background: var(--success-color);
      border-radius: 50%;
    }

    .kpi-toggle {
      display: flex;
      background: var(--gray-100);
      border-radius: 8px;
      padding: 2px;
    }

    .toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 32px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--gray-400);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .toggle-btn.active {
      background: white;
      color: var(--gray-800);
      box-shadow: var(--shadow-sm);
    }

    .toggle-btn:hover:not(.active) {
      color: var(--gray-600);
    }

    .kpi-body {
      display: flex;
      align-items: stretch;
      gap: 0;
    }

    .kpi-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 0 20px;
    }

    .kpi-item:first-child {
      padding-left: 0;
    }

    .kpi-item:last-child {
      padding-right: 0;
    }

    .kpi-divider {
      width: 1px;
      background: var(--border-color);
      align-self: stretch;
    }

    .kpi-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .kpi-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--gray-900);
      line-height: 1.1;
    }

    .kpi-value-highlight {
      color: var(--success-color);
    }

    @media (max-width: 768px) {
      .kpi-body {
        flex-direction: column;
        gap: 16px;
      }

      .kpi-divider {
        width: 100%;
        height: 1px;
      }

      .kpi-item {
        padding: 0;
      }

      .kpi-value {
        font-size: 22px;
      }
    }
  `],
})
export class TurnoKpisComponent {
  turno = input.required<TurnoActual>();
  viewMode = input.required<ViewMode>();
  viewModeChange = output<ViewMode>();

  formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }
}
