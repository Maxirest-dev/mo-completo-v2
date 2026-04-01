import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  OnInit,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  registerables,
  ChartConfiguration,
} from 'chart.js';
import { FormaCobrotTurno } from '../../models';

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <div class="card-header">
        <div class="card-header-left">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="header-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
          </svg>
          <span class="card-header-title">Estadisticas</span>
        </div>
      </div>
      <div class="card-body">
        <div class="stats-grid">
          <div class="chart-container">
            <h4 class="chart-label">Ventas por concepto</h4>
            <div class="chart-wrapper">
              <canvas baseChart
                [type]="'bar'"
                [data]="barChartData()"
                [options]="barChartOptions">
              </canvas>
            </div>
          </div>
          <div class="chart-container">
            <h4 class="chart-label">Formas de Cobro</h4>
            <div class="chart-wrapper-doughnut">
              <canvas baseChart
                [type]="'doughnut'"
                [data]="doughnutChartData()"
                [options]="doughnutChartOptions">
              </canvas>
            </div>
            <div class="legend">
              @for (fc of formasCobro(); track fc.nombre) {
                <div class="legend-item">
                  <span class="legend-dot" [style.background]="fc.color"></span>
                  <span class="legend-label">{{ fc.nombre }}</span>
                  <span class="legend-value">{{ fc.porcentaje }}%</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 25px;
      border-bottom: 1px solid var(--divider-color);
    }

    .card-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-icon {
      width: 20px;
      height: 20px;
      color: var(--slate-400);
    }

    .card-header-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-heading);
    }

    .card-body {
      padding: 20px 25px 25px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .chart-container {
      display: flex;
      flex-direction: column;
    }

    .chart-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      margin: 0 0 16px 0;
    }

    .chart-wrapper {
      height: 220px;
      position: relative;
    }

    .chart-wrapper-doughnut {
      height: 180px;
      position: relative;
      display: flex;
      justify-content: center;
    }

    .legend {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      flex-shrink: 0;
    }

    .legend-label {
      flex: 1;
      color: var(--text-primary);
    }

    .legend-value {
      font-weight: 600;
      color: var(--text-heading);
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class EstadisticasComponent {
  formasCobro = input.required<FormaCobrotTurno[]>();

  barChartData = computed<ChartConfiguration<'bar'>['data']>(() => ({
    labels: ['Salon', 'Delivery', 'Take Away'],
    datasets: [
      {
        data: [95000, 48000, 24128],
        backgroundColor: ['#F27920', '#F59E0B', '#FFD6A7'],
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  }));

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `$ ${(ctx.raw as number).toLocaleString('es-AR')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#90A1B9', font: { size: 12 } },
      },
      y: {
        grid: { color: '#F1F5F9' },
        ticks: {
          color: '#90A1B9',
          font: { size: 11 },
          callback: (val) => `$${(Number(val) / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  doughnutChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const fc = this.formasCobro();
    return {
      labels: fc.map((f) => f.nombre),
      datasets: [
        {
          data: fc.map((f) => f.porcentaje),
          backgroundColor: fc.map((f) => f.color),
          borderWidth: 0,
          cutout: '65%',
        },
      ],
    };
  });

  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };
}
