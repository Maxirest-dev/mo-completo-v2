import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartData, ChartOptions } from 'chart.js';
import { ArticuloVenta, CategoriaVenta } from '../../models';

Chart.register(...registerables);

@Component({
  selector: 'app-articulos',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="articulos-layout">
      <!-- Left: chart -->
      <div class="chart-card">
        <h3 class="chart-title">Categorias</h3>
        <div class="chart-container">
          <canvas baseChart
            [type]="'bar'"
            [data]="categoriasBarData()"
            [options]="barOptions">
          </canvas>
        </div>
      </div>

      <!-- Right: table -->
      <div class="table-card">
        <h3 class="table-title">Articulos</h3>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Cod</th>
                <th>Nombre</th>
                <th>Categoria</th>
                <th class="text-right">Cantidad</th>
                <th class="text-right">Precio Unit</th>
                <th class="text-right">Subtotal</th>
                <th class="text-right">Descuento</th>
                <th class="text-right">Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              @for (art of articulos(); track art.cod) {
                <tr>
                  <td class="cell-code">{{ art.cod }}</td>
                  <td>{{ art.nombre }}</td>
                  <td>{{ art.categoria }}</td>
                  <td class="text-right">{{ art.cantidad }}</td>
                  <td class="text-right">\${{ formatNumber(art.precioUnit) }}</td>
                  <td class="text-right">\${{ formatNumber(art.subtotal) }}</td>
                  <td class="text-right">\${{ formatNumber(art.descuento) }}</td>
                  <td class="text-right font-bold">\${{ formatNumber(art.total) }}</td>
                  <td>
                    <span class="status-badge" [class.status-active]="art.estado === 'Activo'" [class.status-inactive]="art.estado === 'Inactivo'">
                      {{ art.estado }}
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
    .articulos-layout {
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

    .cell-code {
      font-family: 'Inter', monospace;
      font-size: 12px;
      color: #6B7280;
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
      .articulos-layout {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ArticulosComponent {
  readonly articulos = input.required<ArticuloVenta[]>();
  readonly categorias = input.required<CategoriaVenta[]>();

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

  readonly categoriasBarData = computed<ChartData<'bar'>>(() => {
    const cats = this.categorias();
    return {
      labels: cats.map(c => c.nombre),
      datasets: [{
        data: cats.map(c => c.total),
        backgroundColor: cats.map(c => c.color),
        borderRadius: 6,
        maxBarThickness: 40,
      }],
    };
  });

  formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }
}
