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
    <div class="stats-card">
      <h3 class="stats-title">Estadisticas</h3>
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
  `,
  styles: [`
    .stats-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
    }

    .stats-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 20px 0;
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
      color: var(--gray-600);
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
      gap: 8px;
      margin-top: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-label {
      flex: 1;
      color: var(--gray-700);
    }

    .legend-value {
      font-weight: 600;
      color: var(--gray-900);
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
        backgroundColor: ['#F97316', '#FB923C', '#FDBA74'],
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
        ticks: { color: '#6B7280', font: { size: 12 } },
      },
      y: {
        grid: { color: '#F3F4F6' },
        ticks: {
          color: '#6B7280',
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
