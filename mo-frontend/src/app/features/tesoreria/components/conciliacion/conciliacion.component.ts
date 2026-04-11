import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiConciliacion, CuponPendiente, ResumenApp } from '../../models/tesoreria.model';
import { MroCurrencyPipe } from '../../../balances/pipes/currency.pipe';

@Component({
  selector: 'app-conciliacion',
  standalone: true,
  imports: [CommonModule, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../../balances/styles/balances-shared.css',
  template: `
    <!-- KPI Row -->
    <section class="kpi-row" aria-label="Indicadores de conciliacion">
      @for (kpi of kpis(); track kpi.label) {
        <div class="kpi-card" role="group" [attr.aria-label]="kpi.label">
          <div class="kpi-header">
            <span class="kpi-label">{{ kpi.label }}</span>
            <span class="kpi-trend"
              [class.trend-up]="kpi.trend > 0"
              [class.trend-down]="kpi.trend < 0"
              [attr.aria-label]="'Tendencia: ' + kpi.trendLabel">
              {{ kpi.trendLabel }}
            </span>
          </div>
          <span class="kpi-value">{{ kpi.value | mroCurrency }}</span>
          <span class="kpi-subtitle">{{ kpi.subtitle }}</span>
        </div>
      }
    </section>

    <!-- Main Row: Table + Apps Card -->
    <div class="main-row">
      <!-- Left: Cupones Pendientes de Acreditacion -->
      <div class="card cupones-card">
        <h3 class="card-title">Cupones Pendientes de Acreditacion</h3>
        <div class="table-wrapper">
          <table class="data-table" aria-label="Cupones pendientes de acreditacion">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Medio Pago</th>
                <th>Lote</th>
                <th class="th-right">Bruto</th>
                <th class="th-right">Comision</th>
                <th class="th-right">Neto</th>
                <th>Estado</th>
                <th>Fecha Acreditacion</th>
              </tr>
            </thead>
            <tbody>
              @for (cup of cupones(); track cup.id) {
                <tr>
                  <td>{{ cup.fecha }}</td>
                  <td class="td-bold">{{ cup.medioPago }}</td>
                  <td>{{ cup.lote }}</td>
                  <td class="td-right">{{ cup.bruto | mroCurrency }}</td>
                  <td class="td-right">{{ cup.comision }}%</td>
                  <td class="td-right td-bold">{{ cup.neto | mroCurrency }}</td>
                  <td>
                    <span class="badge"
                      [class.badge-pending]="cup.estado === 'Pendiente'"
                      [class.badge-ok]="cup.estado === 'Acreditado'"
                      [class.badge-cancel]="cup.estado === 'Rechazado'">
                      {{ cup.estado }}
                    </span>
                  </td>
                  <td>{{ cup.fechaAcreditacion || '\u2014' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8">
                    <div class="empty-state" role="status">
                      <span class="empty-state-icon" aria-hidden="true">📋</span>
                      <span>No hay cupones pendientes de acreditacion</span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right: Resumen Apps Delivery -->
      <div class="card apps-card">
        <h3 class="card-title">Resumen Apps Delivery</h3>
        <div class="apps-list" role="list" aria-label="Resumen de aplicaciones delivery">
          @for (app of appsResumen(); track app.plataforma) {
            <div class="app-row" role="listitem">
              <div class="app-info">
                <div class="app-header-row">
                  <span class="app-nombre">{{ app.plataforma }}</span>
                  <span class="badge"
                    [class.badge-pending]="app.estado === 'Pendiente'"
                    [class.badge-process]="app.estado === 'En proceso'"
                    [class.badge-ok]="app.estado === 'Acreditado'">
                    {{ app.estado }}
                  </span>
                </div>
                <span class="app-detalle">{{ app.detalle }}</span>
              </div>
              <span class="app-monto">{{ app.monto | mroCurrency }}</span>
            </div>
          } @empty {
            <div class="empty-state" role="status">
              <span class="empty-state-icon" aria-hidden="true">📦</span>
              <span>No hay datos de apps delivery</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    /* Main row: table wider, apps card fixed ~400px */
    .main-row {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 16px;
    }

    /* Table overflow */
    .table-wrapper {
      overflow-x: auto;
    }

    /* Apps Delivery list */
    .apps-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .app-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid #F9FAFB;
    }

    .app-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .app-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .app-header-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .app-nombre {
      font-size: 13px;
      font-weight: 600;
      color: var(--slate-900, #111827);
    }

    .app-detalle {
      font-size: 11px;
      color: var(--slate-400, #9CA3AF);
    }

    .app-monto {
      font-size: 14px;
      font-weight: 600;
      color: var(--slate-900, #111827);
      white-space: nowrap;
      margin-left: 12px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .main-row {
        grid-template-columns: 1fr;
      }

      .apps-card {
        max-width: 100%;
      }
    }
  `],
})
export class ConciliacionComponent {
  readonly kpis = input.required<KpiConciliacion[]>();
  readonly cupones = input.required<CuponPendiente[]>();
  readonly appsResumen = input.required<ResumenApp[]>();
}
