import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartData, ChartOptions } from 'chart.js';
import { ProyeccionPagos } from '../../models/compras.models';
import { CurrencyArsPipe } from '@mro/shared-ui';

Chart.register(...registerables);

@Component({
  selector: 'app-proyeccion-pagos',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, CurrencyArsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .proyeccion-card {
      background: white;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-lg, 14px);
      padding: 20px 24px;
      margin-bottom: 16px;
      box-shadow: var(--shadow-sm);
    }

    .proyeccion-title {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--slate-600);
      margin-bottom: 16px;
    }

    .proyeccion-content {
      display: flex;
      align-items: center;
    }

    .proyeccion-kpis {
      display: flex;
      gap: 32px;
    }

    .kpi-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .kpi-value {
      font-size: 22px;
      font-weight: 700;
      color: var(--slate-900);
      white-space: nowrap;
    }

    .kpi-detail {
      font-size: 12px;
      color: var(--slate-500);
      margin-top: 2px;
      white-space: nowrap;
    }

    .kpi-esta-semana .kpi-label { color: #3B82F6; }
    .kpi-prox-30 .kpi-label { color: var(--warning-color, #F59E0B); }
    .kpi-vencidas .kpi-label { color: #8B5CF6; }

    .proyeccion-chart {
      width: 220px;
      height: 140px;
      flex-shrink: 0;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .proyeccion-card {
      position: relative;
    }
  `],
  template: `
    <div class="proyeccion-card">
      <div class="proyeccion-title">Proyección de Pagos</div>
      <div class="proyeccion-content">
        <div class="proyeccion-kpis">
          @if (data(); as proy) {
            <div class="kpi-item kpi-esta-semana">
              <div class="kpi-label">Esta Semana</div>
              <div class="kpi-value">{{ proy.estaSemana.monto | currencyArs }}</div>
              <div class="kpi-detail">{{ proy.estaSemana.cantidadFacturas }} facturas pendientes</div>
            </div>
            <div class="kpi-item kpi-prox-30">
              <div class="kpi-label">Próx 30 Días</div>
              <div class="kpi-value">{{ proy.proximos30Dias.monto | currencyArs }}</div>
              <div class="kpi-detail">{{ proy.proximos30Dias.cantidadFacturas }} facturas pendientes</div>
            </div>
            <div class="kpi-item kpi-vencidas">
              <div class="kpi-label">Vencidas</div>
              <div class="kpi-value">{{ proy.vencidas.monto | currencyArs }}</div>
              <div class="kpi-detail">{{ proy.vencidas.cantidadFacturas }} facturas</div>
            </div>
          }
        </div>
        <div class="proyeccion-chart">
          <canvas baseChart
            [type]="'doughnut'"
            [data]="chartData()"
            [options]="chartOptions"
          ></canvas>
        </div>
      </div>
    </div>
  `
})
export class ProyeccionPagosComponent {
  data = input.required<ProyeccionPagos | null>();

  readonly chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#64748B',
          font: { size: 12, family: 'Inter' },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed;
            return ` $${val.toLocaleString('es-AR')}`;
          },
        },
      },
    },
    layout: {
      padding: { right: 10 },
    },
  };

  chartData = computed<ChartData<'doughnut'>>(() => {
    const proy = this.data();
    if (!proy) {
      return { labels: [], datasets: [] };
    }
    return {
      labels: ['Esta semana', 'Próximos 30 días', 'Vencidas'],
      datasets: [{
        data: [proy.estaSemana.monto, proy.proximos30Dias.monto, proy.vencidas.monto],
        backgroundColor: ['#3B82F6', '#F59E0B', '#8B5CF6'],
        borderWidth: 0,
      }],
    };
  });
}
