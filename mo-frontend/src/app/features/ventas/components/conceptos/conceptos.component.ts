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
      background: var(--bg-primary, white);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-sm, 0 1px 1.75px -1px rgba(0,0,0,0.1), 0 1px 2.625px rgba(0,0,0,0.1));
      padding: 20px 25px;
    }

    .chart-title,
    .table-title {
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
      background: var(--slate-50, #F8FAFC);
    }

    .data-table th {
      padding: 10px 12px;
      font-weight: 600;
      color: var(--slate-400, #90A1B9);
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      border-bottom: 1px solid var(--slate-200, #E2E8F0);
    }

    .data-table th:first-child {
      border-top-left-radius: var(--radius-sm, 8px);
    }

    .data-table th:last-child {
      border-top-right-radius: var(--radius-sm, 8px);
    }

    .data-table td {
      padding: 10px 12px;
      color: var(--slate-700, #314158);
      border-bottom: 1px solid var(--slate-200, #E2E8F0);
      white-space: nowrap;
    }

    .data-table tbody tr:hover {
      background: var(--slate-50, #F8FAFC);
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
      color: var(--slate-400, #90A1B9);
    }

    .adherencia-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 500;
      padding: 5px 12px;
      border-radius: var(--radius-sm, 8px);
      border: 1px solid transparent;
    }

    .adherencia-alto {
      background: var(--success-bg, #ECFDF5);
      color: var(--success-color, #00A43D);
      border-color: var(--success-border, #A4F4CF);
    }

    .adherencia-normal {
      background: var(--info-bg, #EFF6FF);
      color: var(--info-text, #1E40AF);
      border-color: var(--info-border, #BFDBFE);
    }

    .adherencia-bajo {
      background: var(--danger-bg, #FEF2F2);
      color: var(--danger-text, #DC2626);
      border-color: var(--danger-border, #FECACA);
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
          color: '#314158',
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
        ticks: { font: { family: 'Inter', size: 11 }, color: '#90A1B9' },
        grid: { color: '#F1F5F9' },
      },
      x: {
        stacked: true,
        ticks: { font: { family: 'Inter', size: 11 }, color: '#90A1B9' },
        grid: { display: false },
      },
    },
  };

  readonly conceptosBarData = computed<ChartData<'bar'>>(() => {
    const conceptos = this.conceptos();
    return {
      labels: conceptos.map(c => c.forma),
      datasets: [
        {
          label: 'Subtotal',
          data: conceptos.map(c => c.subtotal),
          backgroundColor: '#F27920',
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
          backgroundColor: '#314158',
          borderRadius: 4,
        },
      ],
    };
  });

  formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }
}
