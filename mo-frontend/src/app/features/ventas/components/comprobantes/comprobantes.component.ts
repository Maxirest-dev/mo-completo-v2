import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartData, ChartOptions } from 'chart.js';
import { ComprobanteVenta, VentaComprobante } from '../../models';

Chart.register(...registerables);

@Component({
  selector: 'app-comprobantes',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="comprobantes-container">
      <!-- Top: cards -->
      <div class="cards-row">
        @for (comp of comprobantes(); track comp.tipo) {
          <div class="comp-card" [style.border-left-color]="comp.color">
            <h4 class="comp-tipo">{{ comp.tipo }}</h4>
            <div class="comp-total">\${{ formatNumber(comp.total) }}</div>
            <div class="comp-details">
              <div class="comp-detail">
                <span class="comp-detail-label">Operaciones</span>
                <span class="comp-detail-value">{{ comp.operaciones }}</span>
              </div>
              <div class="comp-detail">
                <span class="comp-detail-label">Promedio</span>
                <span class="comp-detail-value">\${{ formatNumber(comp.promedio) }}</span>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Bottom: table of all sales -->
      <div class="table-card">
        <h3 class="table-title">Comprobantes emitidos</h3>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Numero</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Forma de cobro</th>
                <th class="text-right">Subtotal</th>
                <th class="text-right">Descuento</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              @for (venta of ventas(); track venta.numero) {
                <tr>
                  <td class="cell-code">{{ venta.numero }}</td>
                  <td>
                    <span class="tipo-badge" [style.background]="getTipoColor(venta.tipo)" style="color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">
                      {{ venta.tipo }}
                    </span>
                  </td>
                  <td>{{ venta.fecha }}</td>
                  <td>{{ venta.cliente }}</td>
                  <td>{{ venta.formaCobro }}</td>
                  <td class="text-right">\${{ formatNumber(venta.subtotal) }}</td>
                  <td class="text-right desc-cell">{{ venta.descuento > 0 ? '-\$' + formatNumber(venta.descuento) : '-' }}</td>
                  <td class="text-right font-bold">\${{ formatNumber(venta.total) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comprobantes-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cards-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .comp-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 20px 24px;
      border-left: 4px solid;
    }

    .comp-tipo {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #6B7280;
      margin: 0 0 8px;
    }

    .comp-total {
      font-family: 'Inter', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 14px;
    }

    .comp-details {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .comp-detail {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .comp-detail-label {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: #9CA3AF;
    }

    .comp-detail-value {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #374151;
    }

    .chart-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 20px 24px;
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
      height: 300px;
    }

    .table-card {
      background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px 24px;
    }
    .table-title {
      font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
      color: #374151; margin: 0 0 16px;
    }
    .table-wrapper { overflow-x: auto; }
    .data-table {
      width: 100%; border-collapse: separate; border-spacing: 0;
      font-family: 'Inter', sans-serif; font-size: 13px;
    }
    .data-table thead tr { background: #F3F4F6; }
    .data-table th {
      padding: 10px 12px; font-weight: 600; color: #6B7280; text-align: left;
      font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;
      white-space: nowrap; border-bottom: 1px solid #E5E7EB;
    }
    .data-table th:first-child { border-top-left-radius: 8px; }
    .data-table th:last-child { border-top-right-radius: 8px; }
    .data-table td {
      padding: 10px 12px; color: #374151; border-bottom: 1px solid #F3F4F6; white-space: nowrap;
    }
    .data-table tbody tr:hover { background: #FAFAFA; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 600; }
    .cell-code { font-family: 'Inter', monospace; font-size: 12px; color: #6B7280; }
    .desc-cell { color: #DC2626; }

    @media (max-width: 1024px) {
      .cards-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .cards-row {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ComprobantesComponent {
  readonly comprobantes = input.required<ComprobanteVenta[]>();
  readonly ventas = input.required<VentaComprobante[]>();

  private readonly tipoColorMap: Record<string, string> = {
    'Factura A': '#3B82F6',
    'Factura B': '#8B5CF6',
    'Ticket Fiscal': '#10B981',
    'Nota de Credito': '#F59E0B',
  };

  getTipoColor(tipo: string): string {
    return this.tipoColorMap[tipo] ?? '#6B7280';
  }

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

  readonly comprobantesBarData = computed<ChartData<'bar'>>(() => {
    const comps = this.comprobantes();
    return {
      labels: comps.map(c => c.tipo),
      datasets: [{
        data: comps.map(c => c.total),
        backgroundColor: comps.map(c => c.color),
        borderRadius: 6,
        maxBarThickness: 50,
      }],
    };
  });

  formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }
}
