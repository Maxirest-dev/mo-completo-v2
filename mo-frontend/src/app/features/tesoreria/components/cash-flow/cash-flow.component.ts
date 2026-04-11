import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MroCurrencyPipe } from '../../../balances/pipes/currency.pipe';
import { KpiCashFlow, ProyeccionDiaria, AlertaCashFlow, HorizonteProyeccion } from '../../models';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [CommonModule, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../../balances/styles/balances-shared.css',
  template: `
    <!-- Horizon Selector -->
    <div class="horizon-selector">
      <span class="horizon-label">Horizonte de proyecci\u00f3n:</span>
      <div class="pill-group">
        @for (opt of horizonteOptions; track opt.value) {
          <button
            class="pill-btn"
            [class.pill-active]="horizonte() === opt.value"
            (click)="horizonteChange.emit(opt.value)"
            type="button"
          >
            {{ opt.label }}
          </button>
        }
      </div>
    </div>

    <!-- Projection Summary -->
    <div class="card projection-summary">
      <div class="summary-row">
        @for (kpi of kpis(); track $index; let last = $last; let first = $first) {
          @if (!first) {
            <span class="summary-operator">{{ kpi.operador }}</span>
          }
          <div
            class="summary-item"
            [style.background]="kpi.bgColor ?? 'transparent'"
          >
            <span class="summary-label">{{ kpi.label }}</span>
            <span
              class="summary-value"
              [style.color]="kpi.color ?? 'var(--slate-900, #111827)'"
            >
              {{ kpi.value | mroCurrency }}
            </span>
          </div>
        }
      </div>
    </div>

    <!-- Bottom Row: Table + Alerts -->
    <div class="bottom-row-cashflow">
      <!-- Left: Proyecci\u00f3n Diaria -->
      <div class="card table-card">
        <h3 class="card-title">Proyecci\u00f3n Diaria de Saldos</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Detalle</th>
              <th class="th-right">Entradas</th>
              <th class="th-right">Salidas</th>
              <th class="th-right">Saldo Acumulado</th>
            </tr>
          </thead>
          <tbody>
            @for (row of proyeccion(); track $index; let first = $first) {
              <tr
                [class.row-alerta]="row.esAlerta"
                [class.row-hoy]="first"
              >
                <td [class.td-bold]="first">{{ row.fecha }}</td>
                <td [class.td-bold]="first">{{ row.detalle }}</td>
                <td class="th-right td-entrada">
                  {{ row.entradas != null ? (row.entradas | mroCurrency) : '\u2014' }}
                </td>
                <td class="th-right td-salida">
                  {{ row.salidas != null ? (row.salidas | mroCurrency) : '\u2014' }}
                </td>
                <td class="th-right td-bold">{{ row.saldoAcumulado | mroCurrency }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5">
                  <div class="empty-state">
                    <span class="empty-state-icon">\uD83D\uDCC9</span>
                    No hay datos de proyecci\u00f3n disponibles
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Right: Alertas y Recomendaciones -->
      <div class="card alerts-card">
        <h3 class="card-title">Alertas y Recomendaciones</h3>
        <div class="alerts-list">
          @for (alerta of alertas(); track $index) {
            <div class="alert-item" [class]="'alert-border-' + alerta.severidad">
              <span class="alert-titulo">{{ alerta.titulo }}</span>
              <span class="alert-desc">{{ alerta.descripcion }}</span>
            </div>
          } @empty {
            <div class="empty-state">
              <span class="empty-state-icon">\u2705</span>
              Sin alertas activas
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ===== HORIZON SELECTOR ===== */
    .horizon-selector {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .horizon-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--slate-500, #6B7280);
      white-space: nowrap;
    }

    .pill-group {
      display: flex;
      gap: 8px;
    }

    .pill-btn {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      padding: 6px 16px;
      border: 1px solid var(--slate-200, #E5E7EB);
      border-radius: 9999px;
      background: #fff;
      color: var(--slate-500, #6B7280);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .pill-btn:hover:not(.pill-active) {
      border-color: #D1D5DB;
      background: #F9FAFB;
    }

    .pill-active {
      background: #1155CC;
      color: #fff;
      border-color: #1155CC;
    }

    /* ===== PROJECTION SUMMARY ===== */
    .projection-summary {
      margin-bottom: 16px;
    }

    .summary-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 16px 24px;
      border-radius: 8px;
      min-width: 140px;
    }

    .summary-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--slate-500, #6B7280);
    }

    .summary-value {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .summary-operator {
      font-size: 22px;
      font-weight: 600;
      color: var(--slate-400, #9CA3AF);
      user-select: none;
    }

    /* ===== BOTTOM ROW ===== */
    .bottom-row-cashflow {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 16px;
    }

    .table-card {
      overflow-x: auto;
    }

    .alerts-card {
      min-width: 0;
    }

    /* ===== TABLE COLORS ===== */
    .td-entrada { color: #22C55E; }
    .td-salida  { color: #EF4444; }

    .row-alerta {
      background-color: #FFFBEB;
    }

    .row-hoy td {
      font-weight: 600;
    }

    /* ===== ALERTS LIST ===== */
    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .alert-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 10px 12px;
      border-radius: 6px;
      border-left: 4px solid transparent;
      background: #F9FAFB;
    }

    .alert-border-critica { border-left-color: #EF4444; }
    .alert-border-alta    { border-left-color: #F97316; }
    .alert-border-media   { border-left-color: #EAB308; }
    .alert-border-info    { border-left-color: #22C55E; }

    .alert-titulo {
      font-size: 13px;
      font-weight: 600;
      color: var(--slate-900, #111827);
    }

    .alert-desc {
      font-size: 12px;
      color: var(--slate-500, #6B7280);
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .bottom-row-cashflow {
        grid-template-columns: 1fr;
      }

      .alerts-card {
        max-width: 100%;
      }
    }

    @media (max-width: 768px) {
      .horizon-selector {
        flex-direction: column;
        align-items: flex-start;
      }

      .summary-row {
        flex-direction: column;
      }

      .summary-operator {
        font-size: 18px;
      }

      .summary-item {
        width: 100%;
        padding: 12px 16px;
      }
    }
  `],
})
export class CashFlowComponent {
  readonly kpis = input.required<KpiCashFlow[]>();
  readonly proyeccion = input.required<ProyeccionDiaria[]>();
  readonly alertas = input.required<AlertaCashFlow[]>();
  readonly horizonte = input.required<number>();

  readonly horizonteChange = output<number>();

  readonly horizonteOptions: { value: HorizonteProyeccion; label: string }[] = [
    { value: 7, label: '7 d\u00edas' },
    { value: 15, label: '15 d\u00edas' },
    { value: 30, label: '30 d\u00edas' },
  ];
}
