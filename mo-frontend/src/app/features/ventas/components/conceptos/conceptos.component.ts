import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartData, ChartOptions } from 'chart.js';
import { ConceptoVenta } from '../../models';

Chart.register(...registerables);

@Component({
  selector: 'app-conceptos',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="conceptos-layout">
      <!-- Left: stacked bar chart -->
      <div class="chart-card">
        <h3 class="chart-title">Conceptos</h3>
        <div class="chart-container">
          <canvas baseChart
            [type]="'bar'"
            [data]="conceptosBarData()"
            [options]="stackedBarOptions">
          </canvas>
        </div>
      </div>

      <!-- Right: table -->
      <div class="table-card">
        <h3 class="table-title">Detalle de Conceptos</h3>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Cod</th>
                <th>Forma</th>
                <th class="text-right">Vuelto</th>
                <th class="text-right">Subtotal</th>
                <th class="text-right">Descuento</th>
                <th class="text-right">Total</th>
                <th class="text-right">Volumen</th>
                <th class="text-right">Descuento%</th>
                <th>Adherencia</th>
              </tr>
            </thead>
            <tbody>
              @for (concepto of conceptos(); track concepto.cod) {
                <tr>
                  <td class="cell-code">{{ concepto.cod }}</td>
                  <td>{{ concepto.forma }}</td>
                  <td class="text-right">\${{ formatNumber(concepto.vuelto) }}</td>
                  <td class="text-right">\${{ formatNumber(concepto.subtotal) }}</td>
                  <td class="text-right">\${{ formatNumber(concepto.descuento) }}</td>
                  <td class="text-right font-bold">\${{ formatNumber(concepto.total) }}</td>
                  <td class="text-right">{{ concepto.volumen }}</td>
                  <td class="text-right">{{ concepto.descuentoPct }}%</td>
                  <td>
                    <span
                      class="adherencia-badge"
                      [class.adherencia-alto]="concepto.adherencia === 'Alto'"
                      [class.adherencia-normal]="concepto.adherencia === 'Normal'"
                      [class.adherencia-bajo]="concepto.adherencia === 'Bajo'"
                    >
                      {{ concepto.adherencia }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .conceptos-layout {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 16px;
      align-items: start;
    }

    @media (max-width: 1024px) {
      .conceptos-layout { grid-template-columns: 1fr; }
    }

    .chart-card,
    .table-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 20px 24px;
    }

    .chart-title,
    .table-title {
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

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
    }

    .data-table thead tr {
      background: #F3F4F6;
    }

    .data-table th {
      padding: 10px 12px;
      font-weight: 600;
      color: #6B7280;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      border-bottom: 1px solid #E5E7EB;
    }

    .data-table th:first-child {
      border-top-left-radius: 8px;
    }

    .data-table th:last-child {
      border-top-right-radius: 8px;
    }

    .data-table td {
      padding: 10px 12px;
      color: #374151;
      border-bottom: 1px solid #F3F4F6;
      white-space: nowrap;
    }

    .data-table tbody tr:hover {
      background: #FAFAFA;
    }

    .text-right {
      text-align: right;
    }

    .font-bold {
      font-weight: 600;
    }

    .cell-code {
      font-family: 'Inter', monospace;
      font-size: 12px;
      color: #6B7280;
    }

    .adherencia-badge {
      font-size: 12px;
      font-weight: 500;
      padding: 2px 10px;
      border-radius: 12px;
    }

    .adherencia-alto {
      background: #D1FAE5;
      color: #065F46;
    }

    .adherencia-normal {
      background: #DBEAFE;
      color: #1E40AF;
    }

    .adherencia-bajo {
      background: #FEE2E2;
      color: #991B1B;
    }
  `],
})
export class ConceptosComponent {
  readonly conceptos = input.required<ConceptoVenta[]>();

  readonly stackedBarOptions: ChartOptions<'bar'> = {
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
        stacked: true,
        beginAtZero: true,
        ticks: { font: { family: 'Inter', size: 11 } },
        grid: { color: '#F3F4F6' },
      },
      x: {
        stacked: true,
        ticks: { font: { family: 'Inter', size: 11 } },
        grid: { display: false },
      },
    },
  };

  readonly conceptosBarData = computed<ChartData<'bar'>>(() => {
    const conceptos = this.conceptos();
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    return {
      labels: conceptos.map(c => c.forma),
      datasets: [
        {
          label: 'Subtotal',
          data: conceptos.map(c => c.subtotal),
          backgroundColor: '#3B82F6',
          borderRadius: 4,
        },
        {
          label: 'Descuento',
          data: conceptos.map(c => c.descuento),
          backgroundColor: '#EF4444',
          borderRadius: 4,
        },
        {
          label: 'Total',
          data: conceptos.map(c => c.total),
          backgroundColor: '#10B981',
          borderRadius: 4,
        },
      ],
    };
  });

  formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }
}
