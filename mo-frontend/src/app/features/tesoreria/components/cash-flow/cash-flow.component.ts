import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MroCurrencyPipe } from '../../../balances/pipes/currency.pipe';
import { KpiCashFlow, ProyeccionDiaria, AlertaCashFlow } from '../../models';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [CommonModule, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../../balances/styles/balances-shared.css',
  template: `


    <!-- KPI Row: 4 cards con operadores -->
    <div class="kpi-ops-row">
      @for (kpi of kpis(); track kpi.label; let first = $first) {
        @if (!first) {
          <span class="kpi-op" aria-hidden="true">{{ kpi.operador === '-' ? '−' : kpi.operador === '=' ? '=' : '+' }}</span>
        }
        <div class="kpi-card" [style.background]="kpi.bgColor ?? '#fff'"
          [style.border-color]="kpi.bgColor ? '#A7F3D0' : ''">
          <span class="kpi-label">{{ kpi.label }}</span>
          <span class="kpi-value" [style.color]="kpi.color ?? 'var(--slate-900, #111827)'">
            {{ kpi.value | mroCurrency }}
          </span>
        </div>
      }
    </div>

    <!-- Bottom Row: Table + Alerts -->
    <div class="bottom-row-cashflow">
      <!-- Left: Proyección Diaria -->
      <div class="card table-card">
        <h3 class="card-title">Proyección Diaria de Saldos</h3>
        <table class="data-table" aria-label="Proyección diaria de saldos">
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
                  {{ row.entradas != null ? (row.entradas | mroCurrency) : '—' }}
                </td>
                <td class="th-right td-salida">
                  {{ row.salidas != null ? (row.salidas | mroCurrency) : '—' }}
                </td>
                <td
                  class="th-right td-bold"
                  [class.saldo-negative]="row.saldoAcumulado < 0"
                >
                  {{ row.saldoAcumulado | mroCurrency }}
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5">
                  <div class="empty-state" role="status">
                    <span class="empty-state-icon" aria-hidden="true">📉</span>
                    No hay datos de proyección disponibles
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
        <div class="alerts-list" role="list">
          @for (alerta of alertas(); track $index) {
            <div class="alert-item" role="listitem" [class]="'alert-border-' + alerta.severidad">
              <span class="alert-titulo">{{ alerta.titulo }}</span>
              <span class="alert-desc">{{ alerta.descripcion }}</span>
            </div>
          } @empty {
            <div class="empty-state" role="status">
              <span class="empty-state-icon" aria-hidden="true">✅</span>
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

    /* KPI 4 cards con operadores */
    .kpi-ops-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .kpi-ops-row .kpi-card {
      flex: 1;
      align-items: center;
      text-align: center;
    }

    .kpi-op {
      font-size: 22px;
      font-weight: 300;
      color: var(--slate-400, #9CA3AF);
      flex-shrink: 0;
    }

    @media (max-width: 1024px) {
      .kpi-ops-row { flex-wrap: wrap; }
      .kpi-ops-row .kpi-card { flex: 1 1 calc(50% - 24px); min-width: 160px; }
      .kpi-op { display: none; }
    }

    @media (max-width: 768px) {
      .kpi-ops-row .kpi-card { flex: 1 1 100%; }
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

    .saldo-negative {
      color: #EF4444;
    }

    .row-alerta {
      background-color: #FFFBEB;
    }

    .row-hoy td {
      font-weight: 600;
      background-color: #F0F5FF;
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

}
