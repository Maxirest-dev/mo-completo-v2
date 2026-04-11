import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { PlRow, PuntoEquilibrio, ResultadoMes, GastoFijo } from '../../models';
import { MroCurrencyPipe } from '../../pipes/currency.pipe';
import { createBarOptions, DONUT_OPTIONS } from '../../config/chart.config';

@Component({
  selector: 'app-economicos',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../styles/balances-shared.css',
  template: `
    <!-- Estado de Resultados (P&L) -->
    <div class="card pl-card">
      <h3 class="card-title">Estado de Resultados (P&L)</h3>

      @for (row of plRows(); track row.label) {
        <div class="pl-row">
          <div class="pl-indicator" [style.background]="row.color"></div>
          <span class="pl-label">{{ row.label }}</span>
          <div class="pl-bar-wrapper">
            <div class="pl-bar" [style.width.%]="row.percentage" [style.background]="row.color"></div>
          </div>
          <span class="pl-value">{{ row.value | mroCurrency }}</span>
          @if (row.trend != null) {
            <span class="kpi-trend"
              [class.trend-up]="row.trend >= 0"
              [class.trend-down]="row.trend < 0">
              {{ row.trend >= 0 ? '\u2191' : '\u2193' }} {{ row.trend >= 0 ? row.trend : -row.trend }}%
            </span>
          }
        </div>
      } @empty {
        <div class="empty-state">
          <span class="empty-state-icon">&#128202;</span>
          <span>No hay datos de resultados disponibles</span>
        </div>
      }

      <div class="pl-divider"></div>

      <div class="pl-row pl-row-total">
        <div class="pl-indicator" [style.background]="plResultado().color"></div>
        <span class="pl-label pl-label-bold">{{ plResultado().label }}</span>
        <div class="pl-bar-wrapper">
          <div class="pl-bar"
            [style.width.%]="plResultado().percentage"
            [style.background]="plResultado().color">
          </div>
        </div>
        <span class="pl-value pl-value-bold">{{ plResultado().value | mroCurrency }}</span>
        @if (plResultado().trend != null) {
          <span class="kpi-trend"
            [class.trend-up]="plResultado().trend! >= 0"
            [class.trend-down]="plResultado().trend! < 0">
            {{ plResultado().trend! >= 0 ? '\u2191' : '\u2193' }} {{ plResultado().trend! >= 0 ? plResultado().trend : -(plResultado().trend!) }}%
          </span>
        }
      </div>
    </div>

    <!-- Bottom Row: 3 columns -->
    <div class="bottom-row">

      <!-- Punto de Equilibrio -->
      <div class="card card-center">
        <h3 class="card-title">Punto de Equilibrio</h3>
        <div class="equilibrio-chart">
          <div class="donut-wrapper">
            <canvas baseChart
              [type]="'doughnut'"
              [data]="donutData()"
              [options]="donutOptions">
            </canvas>
            <div class="donut-center">
              <span class="donut-pct">{{ puntoEquilibrio().porcentaje }}%</span>
              <span class="donut-label">sobre PE</span>
            </div>
          </div>
        </div>
        <div class="equilibrio-info">
          <span class="eq-label">Ventas actuales: {{ puntoEquilibrio().ventasActuales | mroCurrency }}</span>
          <span class="eq-label">Punto PE: {{ puntoEquilibrio().puntoEquilibrio | mroCurrency }}</span>
        </div>
      </div>

      <!-- Estadistica Resultado Neto -->
      <div class="card">
        <h3 class="card-title">Estad\u00edstica Resultado Neto</h3>
        <div class="chart-container">
          <canvas baseChart
            [type]="'bar'"
            [data]="resultadoChartData()"
            [options]="barOptions">
          </canvas>
        </div>
      </div>

      <!-- Desglose Gastos Fijos -->
      <div class="card">
        <h3 class="card-title">Desglose Gastos Fijos</h3>
        <div class="gastos-list">
          @for (g of gastosFijos(); track g.nombre) {
            <div class="gasto-row">
              <div class="gasto-color" [style.background]="g.color"></div>
              <span class="gasto-nombre">{{ g.nombre }}</span>
              <span class="gasto-monto">{{ g.monto | mroCurrency }}</span>
              <span class="gasto-pct">{{ g.porcentaje }}%</span>
            </div>
          } @empty {
            <div class="empty-state">
              <span class="empty-state-icon">&#128203;</span>
              <span>No hay gastos fijos registrados</span>
            </div>
          }
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .card-center { align-items: center; }

    .pl-card { margin-bottom: 16px; }

    /* P&L Rows */
    .pl-row {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .pl-indicator {
      width: 4px;
      height: 24px;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .pl-label {
      font-size: 13px;
      color: #374151;
      width: 120px;
      flex-shrink: 0;
    }

    .pl-label-bold { font-weight: 700; color: #111827; }

    .pl-bar-wrapper {
      flex: 1;
      height: 24px;
      background: #F9FAFB;
      border-radius: 6px;
      overflow: hidden;
    }

    .pl-bar {
      height: 100%;
      border-radius: 6px;
      transition: width 0.6s ease;
    }

    .pl-value {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
      width: 110px;
      text-align: right;
      flex-shrink: 0;
    }

    .pl-value-bold { font-size: 14px; font-weight: 700; }

    .pl-divider {
      height: 1px;
      background: #F3F4F6;
      width: 100%;
    }

    .pl-row-total { padding-top: 4px; }

    /* Donut */
    .equilibrio-chart {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .donut-wrapper {
      position: relative;
      width: 180px;
      height: 180px;
    }

    .donut-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .donut-pct {
      font-size: 28px;
      font-weight: 700;
      color: #22C55E;
    }

    .donut-label {
      font-size: 11px;
      color: #9CA3AF;
    }

    .equilibrio-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      align-items: center;
    }

    .eq-label {
      font-size: 11px;
      color: #6B7280;
    }

    /* Gastos Fijos */
    .gastos-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .gasto-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .gasto-color {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      flex-shrink: 0;
    }

    .gasto-nombre {
      font-size: 13px;
      color: #374151;
      flex: 1;
    }

    .gasto-monto {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }

    .gasto-pct {
      font-size: 11px;
      color: #9CA3AF;
      width: 40px;
      text-align: right;
    }

    @media (max-width: 1024px) {
      .donut-wrapper {
        width: 150px;
        height: 150px;
      }
    }
  `],
})
export class EconomicosComponent {
  readonly plRows = input.required<PlRow[]>();
  readonly plResultado = input.required<PlRow>();
  readonly puntoEquilibrio = input.required<PuntoEquilibrio>();
  readonly resultadoMeses = input.required<ResultadoMes[]>();
  readonly gastosFijos = input.required<GastoFijo[]>();

  readonly donutOptions = DONUT_OPTIONS;

  readonly barOptions = createBarOptions({
    plugins: { legend: { display: false } },
    scales: {
      y: {
        ticks: {
          callback: (v) => '$' + (Number(v) / 1000).toFixed(0) + 'k',
        },
      },
    },
  });

  readonly donutData = computed<ChartData<'doughnut'>>(() => {
    const pe = this.puntoEquilibrio();
    const over = Math.max(0, pe.ventasActuales - pe.puntoEquilibrio);
    return {
      labels: ['Sobre PE', 'Punto Equilibrio'],
      datasets: [{
        data: [over, pe.puntoEquilibrio],
        backgroundColor: ['#22C55E', '#E5E7EB'],
        borderWidth: 0,
        cutout: '75%',
      }],
    };
  });

  readonly resultadoChartData = computed<ChartData<'bar'>>(() => {
    const data = this.resultadoMeses();
    return {
      labels: data.map(d => d.mes),
      datasets: [{
        label: 'Resultado Neto',
        data: data.map(d => d.resultado),
        backgroundColor: '#1155CC',
        borderRadius: 4,
        barPercentage: 0.5,
      }],
    };
  });
}
