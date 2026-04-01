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
      font-size: 12px;
      font-weight: 500;
      padding: 2px 10px;
      border-radius: 12px;
    }

    .status-active {
      background: #D1FAE5;
      color: #065F46;
    }

    .status-inactive {
      background: #FEE2E2;
      color: #991B1B;
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
