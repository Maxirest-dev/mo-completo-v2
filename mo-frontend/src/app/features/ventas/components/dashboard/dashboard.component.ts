import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartData, ChartOptions } from 'chart.js';
import { FormaCobro, ComprobanteVenta, ArticuloVenta, CategoriaVenta, MovimientoHora, TabVentas } from '../../models';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-grid">
      <!-- Top row -->
      <div class="chart-card chart-card--clickable" (click)="tabChange.emit('formasCobro')">
        <h3 class="chart-title">Formas de Cobro</h3>
        <div class="chart-container chart-container-sm">
          <canvas baseChart
            [type]="'doughnut'"
            [data]="formasDoughnutData()"
            [options]="doughnutOptions">
          </canvas>
        </div>
      </div>

      <div class="chart-card chart-card--clickable" (click)="tabChange.emit('conceptos')">
        <h3 class="chart-title">Conceptos</h3>
        <div class="chart-container chart-container-sm">
          <canvas baseChart
            [type]="'bar'"
            [data]="cobroEfectivoData()"
            [options]="barOptions">
          </canvas>
        </div>
      </div>

      <div class="chart-card chart-card--clickable" (click)="tabChange.emit('comprobantes')">
        <h3 class="chart-title">Ventas por Comprobante</h3>
        <div class="comprobante-list">
          @for (comp of comprobantes(); track comp.tipo) {
            <div class="comprobante-item">
              <div class="comprobante-dot" [style.background]="comp.color"></div>
              <span class="comprobante-tipo">{{ comp.tipo }}</span>
              <span class="comprobante-total">\${{ formatNumber(comp.total) }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Bottom row -->
      <div class="chart-card chart-card-half chart-card--clickable" (click)="tabChange.emit('articulos')">
        <h3 class="chart-title">Articulos</h3>
        <div class="chart-container">
          <canvas baseChart
            [type]="'bar'"
            [data]="articulosBarData()"
            [options]="horizontalBarOptions">
          </canvas>
        </div>
      </div>

      <div class="chart-card chart-card-half">
        <h3 class="chart-title">Movimientos por Hora</h3>
        <div class="chart-container">
          <canvas baseChart
            [type]="'line'"
            [data]="movimientosLineData()"
            [options]="lineOptions">
          </canvas>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .chart-card {
      background: var(--bg-primary, white);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-sm, 0 1px 1.75px -1px rgba(0,0,0,0.1), 0 1px 2.625px rgba(0,0,0,0.1));
      padding: 20px 25px;
    }

    .chart-card--clickable {
      cursor: pointer;
      transition: box-shadow 0.15s ease, transform 0.15s ease;
    }

    .chart-card--clickable:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .chart-card--clickable:active {
      transform: translateY(0);
    }

    .chart-card-half {
      grid-column: span 1;
    }

    .dashboard-grid > .chart-card-half:nth-child(4) {
      grid-column: 1 / 2;
    }

    .dashboard-grid > .chart-card-half:nth-child(5) {
      grid-column: 2 / 4;
    }

    .chart-title {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--slate-900, #0F172B);
      margin: 0 0 16px;
    }

    .chart-container {
      position: relative;
      height: 280px;
    }

    .chart-container-sm {
      height: 240px;
    }

    .comprobante-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 8px 0;
    }

    .comprobante-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .comprobante-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .comprobante-tipo {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: var(--slate-700, #314158);
      flex: 1;
    }

    .comprobante-total {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--slate-900, #0F172B);
    }

    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .chart-card-half {
        grid-column: span 1 !important;
      }

      .dashboard-grid > .chart-card-half:nth-child(5) {
        grid-column: 1 !important;
      }
    }
  `],
})
export class DashboardComponent {
  readonly formasCobro = input.required<FormaCobro[]>();
  readonly comprobantes = input.required<ComprobanteVenta[]>();
  readonly articulos = input.required<ArticuloVenta[]>();
  readonly categorias = input.required<CategoriaVenta[]>();
  readonly movimientos = input.required<MovimientoHora[]>();
  readonly tabChange = output<TabVentas>();

  readonly doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { family: 'Inter', size: 12 },
          color: '#314158',
          padding: 12,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
    },
  };

  readonly barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { family: 'Inter', size: 11 }, color: '#90A1B9' },
        grid: { color: '#F1F5F9' },
      },
      x: {
        ticks: { font: { family: 'Inter', size: 11 }, color: '#90A1B9' },
        grid: { display: false },
      },
    },
  };

  readonly horizontalBarOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { font: { family: 'Inter', size: 11 }, color: '#90A1B9' },
        grid: { color: '#F1F5F9' },
      },
      y: {
        ticks: { font: { family: 'Inter', size: 11 }, color: '#90A1B9' },
        grid: { display: false },
      },
    },
  };

  readonly lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Inter', size: 12 },
          color: '#314158',
          usePointStyle: true,
          pointStyleWidth: 8,
          padding: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { family: 'Inter', size: 11 }, color: '#90A1B9' },
        grid: { color: '#F1F5F9' },
      },
      x: {
        ticks: { font: { family: 'Inter', size: 11 }, color: '#90A1B9' },
        grid: { display: false },
      },
    },
  };

  readonly formasDoughnutData = computed<ChartData<'doughnut'>>(() => {
    const formas = this.formasCobro();
    return {
      labels: formas.map(f => f.nombre),
      datasets: [{
        data: formas.map(f => f.total),
        backgroundColor: formas.map(f => f.color),
        borderWidth: 0,
        hoverOffset: 4,
      }],
    };
  });

  readonly cobroEfectivoData = computed<ChartData<'bar'>>(() => {
    const formas = this.formasCobro();
    return {
      labels: formas.map(f => f.nombre),
      datasets: [{
        data: formas.map(f => f.total),
        backgroundColor: formas.map(f => f.color),
        borderRadius: 6,
        maxBarThickness: 40,
      }],
    };
  });

  readonly articulosBarData = computed<ChartData<'bar'>>(() => {
    const cats = this.categorias();
    return {
      labels: cats.map(c => c.nombre),
      datasets: [{
        data: cats.map(c => c.total),
        backgroundColor: cats.map(c => c.color),
        borderRadius: 6,
        maxBarThickness: 24,
      }],
    };
  });

  readonly movimientosLineData = computed<ChartData<'line'>>(() => {
    const movs = this.movimientos();
    return {
      labels: movs.map(m => `${m.hora}:00`),
      datasets: [
        {
          label: 'Salon',
          data: movs.map(m => m.salon),
          borderColor: '#F27920',
          backgroundColor: 'rgba(242, 121, 32, 0.1)',
          tension: 0.3,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: 'Delivery',
          data: movs.map(m => m.delivery),
          borderColor: '#314158',
          backgroundColor: 'rgba(49, 65, 88, 0.1)',
          tension: 0.3,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: 'Take Away',
          data: movs.map(m => m.takeaway),
          borderColor: '#90A1B9',
          backgroundColor: 'rgba(144, 161, 185, 0.1)',
          tension: 0.3,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    };
  });

  formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }
}
