import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { KpiFinanciero, FlujoCajaMes, PendienteApp, DeudaProveedor } from '../../models/balances.model';
import { MroCurrencyPipe } from '../../pipes/currency.pipe';
import { createBarOptions } from '../../config/chart.config';

@Component({
  selector: 'app-financieros',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../styles/balances-shared.css',
  template: `
    <!-- KPI Row -->
    <div class="kpi-row">
      @for (kpi of kpis(); track kpi.label) {
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">{{ kpi.label }}</span>
            <span class="kpi-trend"
              [class.trend-up]="kpi.trend > 0"
              [class.trend-down]="kpi.trend < 0">
              {{ kpi.trendLabel }}
            </span>
          </div>
          <div class="kpi-values">
            <div class="kpi-col">
              <span class="kpi-col-label">Hoy</span>
              <span class="kpi-col-value">{{ kpi.hoy | mroCurrency }}</span>
            </div>
            <div class="kpi-col">
              <span class="kpi-col-label">30 dias</span>
              <span class="kpi-col-value">{{ kpi.dias30 | mroCurrency }}</span>
            </div>
            <div class="kpi-col kpi-col-total">
              <span class="kpi-col-label">Total</span>
              <span class="kpi-col-value kpi-total">{{ kpi.total | mroCurrency }}</span>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Bottom Row -->
    <div class="bottom-row">
      <!-- Flujo de Caja -->
      <div class="card">
        <h3 class="card-title">Flujo de Caja</h3>
        <div class="chart-container">
          <canvas baseChart
            [type]="'bar'"
            [data]="flujoChartData()"
            [options]="barOptions">
          </canvas>
        </div>
      </div>

      <!-- Pendientes Apps Delivery -->
      <div class="card">
        <h3 class="card-title">Pendientes Apps Delivery</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Plataforma</th>
              <th class="th-right">Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (p of pendientes(); track p.plataforma) {
              <tr>
                <td class="td-bold">{{ p.plataforma }}</td>
                <td class="td-right">{{ p.monto | mroCurrency }}</td>
                <td>
                  <span class="badge"
                    [class.badge-pending]="p.estado === 'Pendiente'"
                    [class.badge-process]="p.estado === 'En proceso'"
                    [class.badge-cancel]="p.estado === 'Cancelado'">
                    {{ p.estado }}
                  </span>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="3">
                  <div class="empty-state">
                    <span aria-hidden="true">📋</span>
                    <span>No hay pendientes de apps delivery</span>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Deuda a Proveedores -->
      <div class="card">
        <h3 class="card-title">Deuda a Proveedores</h3>
        <div class="proveedores-list">
          @for (d of deudas(); track d.proveedor + d.detalle) {
            <div class="proveedor-row">
              <div class="proveedor-info">
                <div class="proveedor-nombre-row">
                  <span class="proveedor-nombre">{{ d.proveedor }}</span>
                  @if (d.vencida) {
                    <span class="badge badge-vencida">VENCIDA</span>
                  }
                </div>
                @if (d.detalle) {
                  <span class="proveedor-detalle">{{ d.detalle }}</span>
                }
                <span class="proveedor-fecha">Vto: {{ d.fechaVencimiento }}</span>
              </div>
              <span class="proveedor-monto">{{ d.monto | mroCurrency }}</span>
            </div>
          } @empty {
            <div class="empty-state">
              <span aria-hidden="true">✅</span>
              <span>No hay deudas registradas con proveedores</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .kpi-values {
      display: flex;
      gap: 16px;
    }

    .kpi-col {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .kpi-col-total {
      margin-left: auto;
    }

    .kpi-col-label {
      font-size: 11px;
      color: var(--slate-400, #9CA3AF);
    }

    .kpi-col-value {
      font-size: 16px;
      font-weight: 600;
      color: var(--slate-900, #111827);
    }

    .kpi-total {
      font-size: 20px;
      font-weight: 700;
    }

    /* Proveedores */
    .proveedores-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .proveedor-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid #F9FAFB;
    }

    .proveedor-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .proveedor-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .proveedor-nombre-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .proveedor-nombre {
      font-size: 13px;
      font-weight: 600;
      color: var(--slate-900, #111827);
    }

    .proveedor-detalle {
      font-size: 11px;
      color: var(--slate-400, #9CA3AF);
    }

    .proveedor-fecha {
      font-size: 11px;
      color: var(--slate-400, #9CA3AF);
    }

    .proveedor-monto {
      font-size: 14px;
      font-weight: 600;
      color: var(--slate-900, #111827);
      white-space: nowrap;
    }

    .badge-vencida {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 9999px;
      background: #FEF2F2;
      color: #EF4444;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
  `],
})
export class FinancierosComponent {
  readonly kpis = input.required<KpiFinanciero[]>();
  readonly flujoCaja = input.required<FlujoCajaMes[]>();
  readonly pendientes = input.required<PendienteApp[]>();
  readonly deudas = input.required<DeudaProveedor[]>();

  readonly flujoChartData = computed<ChartData<'bar'>>(() => {
    const data = this.flujoCaja();
    return {
      labels: data.map(d => d.mes),
      datasets: [
        {
          label: 'Efectivo',
          data: data.map(d => d.efectivo),
          backgroundColor: '#22C55E',
          borderRadius: 2,
          barPercentage: 0.7,
          stack: 'ingresos',
        },
        {
          label: 'Tarjetas',
          data: data.map(d => d.tarjetas),
          backgroundColor: '#3B82F6',
          borderRadius: 2,
          barPercentage: 0.7,
          stack: 'ingresos',
        },
        {
          label: 'Transferencias',
          data: data.map(d => d.transferencias),
          backgroundColor: '#8B5CF6',
          borderRadius: 2,
          barPercentage: 0.7,
          stack: 'ingresos',
        },
        {
          label: 'Proveedores',
          data: data.map(d => d.pagoProveedores),
          backgroundColor: '#EF4444',
          borderRadius: 2,
          barPercentage: 0.7,
          stack: 'egresos',
        },
        {
          label: 'Impuestos',
          data: data.map(d => d.impuestos),
          backgroundColor: '#F97316',
          borderRadius: 2,
          barPercentage: 0.7,
          stack: 'egresos',
        },
        {
          label: 'Retiros Socios',
          data: data.map(d => d.retirosSocios),
          backgroundColor: '#9CA3AF',
          borderRadius: 2,
          barPercentage: 0.7,
          stack: 'egresos',
        },
      ],
    };
  });

  readonly barOptions = createBarOptions({
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#9CA3AF' },
      },
      y: {
        stacked: true,
        grid: { color: '#F3F4F6' },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#9CA3AF',
          callback: (v) => '$' + (Number(v) / 1000000).toFixed(1) + 'M',
        },
        beginAtZero: true,
      },
    },
  });
}
