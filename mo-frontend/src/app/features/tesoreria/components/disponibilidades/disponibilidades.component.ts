import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import {
  CuentaDisponibilidad,
  SaldoConsolidado,
  EvolucionMes,
  DistribucionCuenta,
} from '../../models/tesoreria.model';
import { MroCurrencyPipe } from '../../../balances/pipes/currency.pipe';
import { createBarOptions, DONUT_OPTIONS } from '../../../balances/config/chart.config';

@Component({
  selector: 'app-disponibilidades',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../../balances/styles/balances-shared.css',
  template: `
    <!-- KPI Row: 4 cuenta cards -->
    <div class="kpi-row kpi-row-4" role="list" aria-label="Cuentas disponibles">
      @for (cuenta of cuentas(); track cuenta.nombre) {
        <div class="kpi-card" role="listitem" [attr.aria-label]="cuenta.nombre + ': ' + (cuenta.saldo | mroCurrency)">
          <div class="kpi-header">
            <span class="kpi-label">{{ cuenta.nombre }}</span>
            <span class="kpi-trend"
              [class.trend-up]="cuenta.trend >= 0"
              [class.trend-down]="cuenta.trend < 0"
              [attr.aria-label]="cuenta.trendLabel">
              {{ cuenta.trend >= 0 ? '\u2191' : '\u2193' }} {{ cuenta.trendLabel }}
            </span>
          </div>
          <span class="kpi-value">{{ cuenta.saldo | mroCurrency }}</span>
        </div>
      } @empty {
        <div class="empty-state" role="status">
          <span class="empty-state-icon" aria-hidden="true">&#128176;</span>
          <span>No hay cuentas disponibles</span>
        </div>
      }
    </div>

    <!-- Saldo Total Consolidado -->
    <div class="card consolidado-card" role="region" aria-label="Saldo Total Consolidado">
      <h3 class="card-title">Saldo Total Consolidado</h3>
      <span class="consolidado-total">{{ saldoConsolidado().total | mroCurrency }}</span>

      <!-- Segmented color bar -->
      <div class="consolidado-bar" role="img" aria-label="Distribucion proporcional de saldo por cuenta">
        @for (c of saldoConsolidado().cuentas; track c.nombre) {
          <div class="consolidado-segment"
            [style.width.%]="c.porcentaje"
            [style.background]="c.color"
            [attr.aria-label]="c.nombre + ': ' + c.porcentaje + '%'">
          </div>
        }
      </div>

      <!-- Legend row -->
      <div class="consolidado-legend" role="list" aria-label="Leyenda de cuentas">
        @for (c of saldoConsolidado().cuentas; track c.nombre) {
          <div class="legend-item" role="listitem">
            <span class="legend-dot" [style.background]="c.color" aria-hidden="true"></span>
            <span class="legend-label">{{ c.nombre }}</span>
            <span class="legend-pct">{{ c.porcentaje }}%</span>
          </div>
        }
      </div>
    </div>

    <!-- Bottom Row: 2 columns -->
    <div class="bottom-row-2">

      <!-- Evolucion de Disponibilidades -->
      <div class="card" role="region" aria-label="Evolucion de Disponibilidades">
        <h3 class="card-title">Evoluci\u00f3n de Disponibilidades</h3>
        @if (evolucion().length > 0) {
          <div class="chart-container">
            <canvas baseChart
              [type]="'bar'"
              [data]="evolucionChartData()"
              [options]="barOptions"
              aria-label="Grafico de barras apiladas mostrando evolucion mensual de disponibilidades">
            </canvas>
          </div>
        } @else {
          <div class="empty-state" role="status">
            <span class="empty-state-icon" aria-hidden="true">&#128200;</span>
            <span>No hay datos de evoluci\u00f3n disponibles</span>
          </div>
        }
      </div>

      <!-- Distribucion por Cuenta -->
      <div class="card card-center" role="region" aria-label="Distribucion por Cuenta">
        <h3 class="card-title">Distribuci\u00f3n por Cuenta</h3>
        @if (distribucion().length > 0) {
          <div class="donut-wrapper">
            <canvas baseChart
              [type]="'doughnut'"
              [data]="distribucionChartData()"
              [options]="donutOptions"
              aria-label="Grafico de dona mostrando distribucion de saldo por cuenta">
            </canvas>
          </div>
          <div class="distribucion-legend" role="list" aria-label="Leyenda de distribucion">
            @for (d of distribucion(); track d.nombre) {
              <div class="dist-legend-row" role="listitem">
                <span class="legend-dot" [style.background]="d.color" aria-hidden="true"></span>
                <span class="dist-legend-nombre">{{ d.nombre }}</span>
                <span class="dist-legend-monto">{{ d.monto | mroCurrency }}</span>
                <span class="dist-legend-pct">{{ d.porcentaje }}%</span>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state" role="status">
            <span class="empty-state-icon" aria-hidden="true">&#128203;</span>
            <span>No hay datos de distribuci\u00f3n disponibles</span>
          </div>
        }
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    /* KPI Row override: 4 columns for disponibilidades */
    .kpi-row-4 {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 1024px) {
      .kpi-row-4 { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 768px) {
      .kpi-row-4 { grid-template-columns: 1fr; }
    }

    /* Saldo Consolidado */
    .consolidado-card { margin-bottom: 16px; }

    .consolidado-total {
      font-size: 36px;
      font-weight: 700;
      color: #1155CC;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .consolidado-bar {
      display: flex;
      height: 12px;
      border-radius: 6px;
      overflow: hidden;
      width: 100%;
    }

    .consolidado-segment {
      height: 100%;
      transition: width 0.6s ease;
    }

    .consolidado-segment:first-child {
      border-radius: 6px 0 0 6px;
    }

    .consolidado-segment:last-child {
      border-radius: 0 6px 6px 0;
    }

    .consolidado-segment:only-child {
      border-radius: 6px;
    }

    .consolidado-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-label {
      font-size: 12px;
      color: #374151;
    }

    .legend-pct {
      font-size: 12px;
      font-weight: 600;
      color: #6B7280;
    }

    /* Donut & Distribution */
    .card-center { align-items: center; }

    .donut-wrapper {
      position: relative;
      width: 200px;
      height: 200px;
    }

    .distribucion-legend {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }

    .dist-legend-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dist-legend-nombre {
      font-size: 13px;
      color: #374151;
      flex: 1;
    }

    .dist-legend-monto {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }

    .dist-legend-pct {
      font-size: 11px;
      color: #9CA3AF;
      width: 40px;
      text-align: right;
    }

    @media (max-width: 1024px) {
      .donut-wrapper {
        width: 160px;
        height: 160px;
      }
    }
  `],
})
export class DisponibilidadesComponent {
  readonly cuentas = input.required<CuentaDisponibilidad[]>();
  readonly saldoConsolidado = input.required<SaldoConsolidado>();
  readonly evolucion = input.required<EvolucionMes[]>();
  readonly distribucion = input.required<DistribucionCuenta[]>();

  readonly donutOptions = DONUT_OPTIONS;

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

  readonly evolucionChartData = computed<ChartData<'bar'>>(() => {
    const data = this.evolucion();
    const cuentaColors = this.cuentas();
    const colorMap: Record<string, string> = {};
    for (const c of cuentaColors) {
      colorMap[c.nombre] = c.color;
    }

    return {
      labels: data.map(d => d.mes),
      datasets: [
        {
          label: 'Caja Sal\u00f3n',
          data: data.map(d => d.cajaSalon),
          backgroundColor: colorMap['Caja Sal\u00f3n'] ?? '#22C55E',
          borderRadius: 2,
          barPercentage: 0.7,
          stack: 'disponibilidades',
        },
        {
          label: 'Caja Admin',
          data: data.map(d => d.cajaAdmin),
          backgroundColor: colorMap['Caja Admin'] ?? '#3B82F6',
          borderRadius: 2,
          barPercentage: 0.7,
          stack: 'disponibilidades',
        },
        {
          label: 'Bancos',
          data: data.map(d => d.bancos),
          backgroundColor: colorMap['Bancos'] ?? '#8B5CF6',
          borderRadius: 2,
          barPercentage: 0.7,
          stack: 'disponibilidades',
        },
        {
          label: 'Billeteras',
          data: data.map(d => d.billeteras),
          backgroundColor: colorMap['Billeteras'] ?? '#F59E0B',
          borderRadius: 2,
          barPercentage: 0.7,
          stack: 'disponibilidades',
        },
      ],
    };
  });

  readonly distribucionChartData = computed<ChartData<'doughnut'>>(() => {
    const data = this.distribucion();
    return {
      labels: data.map(d => d.nombre),
      datasets: [{
        data: data.map(d => d.monto),
        backgroundColor: data.map(d => d.color),
        borderWidth: 0,
        cutout: '75%',
      }],
    };
  });
}
