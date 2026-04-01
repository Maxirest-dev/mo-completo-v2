import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartData, ChartOptions } from 'chart.js';
import { FormaCobro } from '../../models';

Chart.register(...registerables);

@Component({
  selector: 'app-formas-cobro',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="formas-layout">
      <!-- Left: doughnut chart -->
      <div class="chart-card">
        <h3 class="chart-title">Formas de Cobro</h3>
        <div class="chart-container">
          <canvas baseChart
            [type]="'doughnut'"
            [data]="doughnutData()"
            [options]="doughnutOptions">
          </canvas>
        </div>
      </div>

      <!-- Right: table -->
      <div class="table-card">
        <h3 class="table-title">Detalle de Formas</h3>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Forma</th>
                <th class="text-right">Total</th>
                <th class="text-right">Operaciones</th>
                <th class="text-right">Porcentaje</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              @for (forma of formasCobro(); track forma.nombre) {
                <tr>
                  <td>
                    <div class="forma-name">
                      <span class="forma-dot" [style.background]="forma.color"></span>
                      {{ forma.nombre }}
                    </div>
                  </td>
                  <td class="text-right font-bold">\${{ formatNumber(forma.total) }}</td>
                  <td class="text-right">{{ forma.operaciones }}</td>
                  <td class="text-right">{{ forma.porcentaje }}%</td>
                  <td>
                    <span class="status-badge" [class.status-active]="forma.estado === 'Activo'" [class.status-inactive]="forma.estado === 'Inactivo'">
                      {{ forma.estado }}
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
    .formas-layout {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 16px;
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
      height: 300px;
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

    .forma-name {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .forma-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 500;
      padding: 5px 12px;
      border-radius: var(--radius-sm, 8px);
      border: 1px solid transparent;
    }

    .status-active {
      background: var(--success-bg, #ECFDF5);
      color: var(--success-color, #00A43D);
      border-color: var(--success-border, #A4F4CF);
    }

    .status-inactive {
      background: var(--inactive-bg, #F1F5F9);
      color: var(--inactive-text, #45556C);
      border-color: var(--inactive-border, #E2E8F0);
    }

    @media (max-width: 1024px) {
      .formas-layout {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class FormasCobroComponent {
  readonly formasCobro = input.required<FormaCobro[]>();

  readonly doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Inter', size: 12 },
          color: '#314158',
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
    },
  };

  readonly doughnutData = computed<ChartData<'doughnut'>>(() => {
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

  formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }
}
