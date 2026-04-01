import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartData, ChartOptions } from 'chart.js';
import { FormaCobro, ComprobanteVenta, ArticuloVenta, CategoriaVenta, MovimientoHora } from '../../models';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-grid">
      <!-- Top row -->
      <div class="chart-card">
        <h3 class="chart-title">Formas de Cobro</h3>
        <div class="chart-container chart-container-sm">
          <canvas baseChart
            [type]="'doughnut'"
            [data]="formasDoughnutData()"
            [options]="doughnutOptions">
          </canvas>
        </div>
      </div>

      <div class="chart-card">
        <h3 class="chart-title">Conceptos</h3>
        <div class="chart-container chart-container-sm">
          <canvas baseChart
            [type]="'bar'"
            [data]="cobroEfectivoData()"
            [options]="barOptions">
          </canvas>
        </div>
      </div>

      <div class="chart-card">
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
      <div class="chart-card chart-card-half">
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
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 20px 24px;
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
      font-size: 14px;
      font-weight: 600;
      color: #374151;
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
      color: #374151;
      flex: 1;
    }

    .comprobante-total {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #111827;
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

  readonly doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { family: 'Inter', size: 12 },
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
        ticks: { font: { family: 'Inter', size: 11 } },
        grid: { color: '#F3F4F6' },
      },
      x: {
        ticks: { font: { family: 'Inter', size: 11 } },
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
        ticks: { font: { family: 'Inter', size: 11 } },
        grid: { color: '#F3F4F6' },
      },
      y: {
        ticks: { font: { family: 'Inter', size: 11 } },
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
          usePointStyle: true,
          pointStyleWidth: 8,
          padding: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { family: 'Inter', size: 11 } },
        grid: { color: '#F3F4F6' },
      },
      x: {
        ticks: { font: { family: 'Inter', size: 11 } },
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
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: 'Delivery',
          data: movs.map(m => m.delivery),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: 'Take Away',
          data: movs.map(m => m.takeaway),
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
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
