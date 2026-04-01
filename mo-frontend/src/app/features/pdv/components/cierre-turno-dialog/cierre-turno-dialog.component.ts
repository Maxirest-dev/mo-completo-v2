import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CierreTurnoData } from '../../models';

@Component({
  selector: 'app-cierre-turno-dialog',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-backdrop" (click)="cerrar.emit()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="dialog-header">
          <div class="dialog-header-top">
            <h2 class="dialog-title">{{ cierreTurno().local }}</h2>
            <button class="close-btn" (click)="cerrar.emit()" title="Cerrar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="filter-badges">
            <span class="filter-badge">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="14" height="14">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              {{ cierreTurno().fecha }}
            </span>
            <span class="filter-badge">{{ cierreTurno().turno }}</span>
            <span class="filter-badge">Cobros</span>
            <span class="filter-badge">Otros</span>
          </div>
        </div>

        <!-- KPIs -->
        <div class="dialog-kpis">
          <div class="kpi-box">
            <span class="kpi-box-label">Tickets</span>
            <span class="kpi-box-value">#{{ cierreTurno().tickets }}</span>
          </div>
          <div class="kpi-box">
            <span class="kpi-box-label">Cubiertos</span>
            <span class="kpi-box-value">#{{ cierreTurno().cubiertos }}</span>
          </div>
        </div>

        <!-- Total -->
        <div class="total-card">
          <span class="total-label">Total del turno</span>
          <span class="total-value">\${{ formatNumber(cierreTurno().totalTurno) }}</span>
        </div>

        <!-- Formas de Cobro Table -->
        <div class="table-section">
          <h4 class="section-title">Formas de Cobro</h4>
          <table class="cobro-table">
            <thead>
              <tr>
                <th>Forma</th>
                <th>Operaciones</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              @for (fc of cierreTurno().formasCobro; track fc.nombre) {
                <tr>
                  <td>{{ fc.nombre }}</td>
                  <td>{{ fc.operaciones }}</td>
                  <td class="text-right">\${{ formatNumber(fc.total) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Actions -->
        <div class="dialog-actions">
          <button class="btn btn-secondary" (click)="cerrar.emit()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            Enviar por mail
          </button>
          <button class="btn btn-secondary" (click)="cerrar.emit()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 7.209A8.282 8.282 0 0 0 12 4.5c-2.572 0-4.922.968-6.75 2.709" />
            </svg>
            Imprimir
          </button>
          <button class="btn btn-dark" (click)="cerrar.emit()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Descargar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 43, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 24px;
    }

    .dialog {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 580px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
    }

    .dialog-header {
      padding: 24px 24px 16px;
      border-bottom: 1px solid var(--divider-color);
    }

    .dialog-header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .dialog-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-heading);
      margin: 0;
    }

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--slate-400);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .close-btn:hover {
      background: var(--slate-100);
      color: var(--slate-600);
    }

    .filter-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 500;
      background: var(--inactive-bg);
      color: var(--inactive-text);
      border: 1px solid var(--inactive-border);
      border-radius: var(--radius-sm);
    }

    .dialog-kpis {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 20px 24px;
    }

    .kpi-box {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px;
      background: var(--slate-50);
      border: 1px solid var(--divider-color);
      border-radius: var(--radius-md);
      text-align: center;
    }

    .kpi-box-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .kpi-box-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-heading);
    }

    .total-card {
      margin: 0 24px 20px;
      padding: 20px;
      background: var(--success-bg);
      border: 1px solid var(--success-border);
      border-radius: var(--radius-lg);
      text-align: center;
    }

    .total-label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--success-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 4px;
    }

    .total-value {
      font-size: 32px;
      font-weight: 700;
      color: var(--success-color);
    }

    .table-section {
      padding: 0 24px 16px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 12px 0;
    }

    .cobro-table {
      width: 100%;
      border-collapse: collapse;
    }

    .cobro-table th {
      padding: 8px 12px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
      background: var(--slate-50);
    }

    .cobro-table td {
      padding: 10px 12px;
      font-size: 14px;
      color: var(--text-primary);
      border-bottom: 1px solid var(--divider-color);
    }

    .text-right {
      text-align: right;
      font-weight: 600;
      color: var(--text-heading);
    }

    .cobro-table th:last-child {
      text-align: right;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid var(--divider-color);
    }
  `],
})
export class CierreTurnoDialogComponent {
  cierreTurno = input.required<CierreTurnoData>();
  cerrar = output<void>();
  finalizar = output<void>();

  tasaPesado = signal(0);

  formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }
}
