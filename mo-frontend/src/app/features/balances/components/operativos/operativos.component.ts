import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import {
  KpiOperativo,
  FoodCostMes,
  MermaItem,
  CuadranteMenu,
  BalanceInventario,
} from '../../models';
import { MroCurrencyPipe } from '../../pipes/currency.pipe';
import { createBarOptions } from '../../config/chart.config';

@Component({
  selector: 'app-operativos',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../styles/balances-shared.css',
  styles: [`
    :host { display: block; }

    /* Mid row: Inventario + Food Cost */
    .mid-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .inventario-formula {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      padding: 12px 0;
    }

    .formula-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .formula-label {
      font-size: 11px;
      font-weight: 500;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .formula-value {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }

    .formula-operator {
      font-size: 20px;
      font-weight: 600;
      color: #9CA3AF;
      padding-top: 14px;
    }

    .inventario-comparison {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      padding: 12px 16px;
      background: #F9FAFB;
      border-radius: 8px;
    }

    .comparison-block {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .comparison-label {
      font-size: 11px;
      font-weight: 500;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .comparison-value {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
    }

    .comparison-operator {
      font-size: 18px;
      font-weight: 600;
      color: #9CA3AF;
      padding-top: 12px;
    }

    .diferencia-positive {
      color: #22C55E;
    }

    .diferencia-negative {
      color: #EF4444;
    }

    .valorizacion-row {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding-top: 8px;
      margin-top: auto;
      border-top: 1px solid #F3F4F6;
    }

    .valorizacion-label {
      font-size: 12px;
      font-weight: 500;
      color: #6B7280;
    }

    .valorizacion-value {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }

    /* Cuadrantes */
    .cuadrantes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      flex: 1;
    }

    .cuadrante {
      border-radius: 10px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .cuadrante-emoji {
      font-size: 20px;
      margin-bottom: 4px;
    }

    .cuadrante-nombre {
      font-size: 13px;
      font-weight: 700;
    }

    .cuadrante-items {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }

    .cuadrante-desc {
      font-size: 10px;
      color: #6B7280;
    }

    .cuadrante-platos {
      list-style: none;
      margin: 4px 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .cuadrante-plato {
      font-size: 10px;
      color: #374151;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Top Mermas - estilo Ventas */
    .table-card {
      background: var(--bg-primary, white);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-lg, 14px);
      box-shadow: 0 1px 1.75px -1px rgba(0,0,0,0.1), 0 1px 2.625px rgba(0,0,0,0.1);
      padding: 20px 25px;
    }

    .table-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .table-title {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--slate-900, #0F172B);
      margin: 0;
    }

    .table-wrapper { overflow-x: auto; }

    .mermas-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
    }

    .mermas-table thead tr {
      background: var(--slate-50, #F8FAFC);
    }

    .mermas-table th {
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

    .mermas-table th:first-child { border-top-left-radius: 8px; }
    .mermas-table th:last-child { border-top-right-radius: 8px; }

    .mermas-table td {
      padding: 10px 12px;
      color: var(--slate-700, #314158);
      border-bottom: 1px solid var(--slate-200, #E2E8F0);
      white-space: nowrap;
    }

    .mermas-table tbody tr:hover {
      background: var(--slate-50, #F8FAFC);
    }

    .text-right { text-align: right; }
    .font-bold { font-weight: 600; }

    .status-badge {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      padding: 5px 12px;
      border-radius: 8px;
      border: 1px solid transparent;
    }

    .status-alert {
      background: #FEF2F2;
      color: #EF4444;
      border-color: #FECACA;
    }

    .status-ok {
      background: #ECFDF5;
      color: #00A43D;
      border-color: #A4F4CF;
    }

    @media (max-width: 1024px) {
      .mid-row { grid-template-columns: 1fr; }
    }
  `],
  template: `
    <!-- KPI Row -->
    <section class="kpi-row" aria-label="Indicadores operativos clave">
      @for (kpi of kpis(); track kpi.label) {
        <article class="kpi-card" [attr.aria-label]="kpi.label + ': ' + kpi.value">
          <div class="kpi-header">
            <span class="kpi-label">{{ kpi.label }}</span>
            <span
              class="kpi-trend"
              [class.trend-down]="kpi.trend < 0"
              [class.trend-up]="kpi.trend > 0"
              [attr.aria-label]="'Tendencia: ' + kpi.trendLabel">
              {{ kpi.trendLabel }}
            </span>
          </div>
          <span class="kpi-value">
            @switch (kpi.format) {
              @case ('percent') { {{ kpi.value }}% }
              @case ('currency') { {{ kpi.value | mroCurrency }} }
              @default { {{ kpi.value }} }
            }
          </span>
          <span class="kpi-subtitle">{{ kpi.subtitle }}</span>
        </article>
      } @empty {
        <div class="empty-state" role="status">
          <span class="empty-state-icon" aria-hidden="true">📊</span>
          <span>No hay indicadores operativos disponibles</span>
        </div>
      }
    </section>

    <!-- Balance de Inventario + Food Cost Comparativo -->
    <div class="mid-row">
      <section class="card" aria-label="Balance de inventario">
        <h3 class="card-title">Balance de Inventario</h3>

        <!-- Formula: Stock Inicial + Compras - Ventas = Stock Teorico -->
        <div class="inventario-formula" role="math" aria-label="Stock Inicial mas Compras menos Ventas igual Stock Teorico">
          <div class="formula-item">
            <span class="formula-label">Stock Inicial</span>
            <span class="formula-value">{{ balanceInventario().stockInicial | mroCurrency }}</span>
          </div>
          <span class="formula-operator" aria-hidden="true">+</span>
          <div class="formula-item">
            <span class="formula-label">Compras</span>
            <span class="formula-value">{{ balanceInventario().compras | mroCurrency }}</span>
          </div>
          <span class="formula-operator" aria-hidden="true">&minus;</span>
          <div class="formula-item">
            <span class="formula-label">Ventas</span>
            <span class="formula-value">{{ balanceInventario().ventas | mroCurrency }}</span>
          </div>
          <span class="formula-operator" aria-hidden="true">=</span>
          <div class="formula-item">
            <span class="formula-label">Stock Teórico</span>
            <span class="formula-value">{{ balanceInventario().stockTeorico | mroCurrency }}</span>
          </div>
        </div>

        <!-- Comparison: Stock Teorico vs Stock Real = Diferencia -->
        <div class="inventario-comparison" aria-label="Comparacion stock teorico contra stock real">
          <div class="comparison-block">
            <span class="comparison-label">Stock Teórico</span>
            <span class="comparison-value">{{ balanceInventario().stockTeorico | mroCurrency }}</span>
          </div>
          <span class="comparison-operator" aria-hidden="true">vs</span>
          <div class="comparison-block">
            <span class="comparison-label">Stock Real</span>
            <span class="comparison-value">{{ balanceInventario().stockReal | mroCurrency }}</span>
          </div>
          <span class="comparison-operator" aria-hidden="true">=</span>
          <div class="comparison-block">
            <span class="comparison-label">Diferencia</span>
            <span
              class="comparison-value"
              [class.diferencia-positive]="balanceInventario().diferencia >= 0"
              [class.diferencia-negative]="balanceInventario().diferencia < 0">
              {{ balanceInventario().diferencia | mroCurrency }}
            </span>
          </div>
        </div>

        <!-- Valorizacion -->
        <div class="valorizacion-row">
          <span class="valorizacion-label">Valorización total</span>
          <span class="valorizacion-value">{{ balanceInventario().valorizacion | mroCurrency }}</span>
        </div>
      </section>

      <!-- Food Cost Comparativo -->
      <section class="card" aria-label="Food cost comparativo">
        <h3 class="card-title">Food Cost Comparativo</h3>
        <div class="chart-container" role="img" aria-label="Grafico de barras comparando food cost real vs ideal por mes">
          <canvas baseChart
            [type]="'bar'"
            [data]="foodCostChartData()"
            [options]="barOptions">
          </canvas>
        </div>
      </section>
    </div>

    <!-- Bottom Row -->
    <div class="bottom-row-2">
      <!-- Top Mermas -->
      <section class="table-card" aria-label="Top mermas">
        <div class="table-header-row">
          <h3 class="table-title">Top Mermas</h3>
          <span class="card-badge">{{ mermas().length }} items</span>
        </div>
        <div class="table-wrapper">
          <table class="mermas-table" aria-label="Tabla de mermas principales">
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">Cantidad</th>
                <th scope="col" class="text-right">Costo</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              @for (m of mermas(); track m.producto) {
                <tr>
                  <td class="font-bold">{{ m.producto }}</td>
                  <td>{{ m.cantidad }}</td>
                  <td class="text-right">{{ m.costo }}</td>
                  <td>
                    <span
                      class="status-badge"
                      [class.status-alert]="m.estado === 'Alerta'"
                      [class.status-ok]="m.estado === 'Aceptable'"
                      role="status">
                      {{ m.estado }}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4">
                    <div class="empty-state" role="status">
                      <span class="empty-state-icon" aria-hidden="true">📦</span>
                      <span>No se registraron mermas en este periodo</span>
                    </div>
                  </td>
                </tr>
            }
          </tbody>
          </table>
        </div>
      </section>

      <!-- Ingenieria de Menu (Matriz BCG) -->
      <section class="card" aria-label="Ingenieria de menu matriz BCG">
        <h3 class="card-title">Ingeniería de Menú (Matriz BCG)</h3>
        <div class="cuadrantes-grid">
          @for (c of cuadrantes(); track c.nombre) {
            <article class="cuadrante" [style.background]="c.bgColor" [attr.aria-label]="c.nombre + ': ' + c.items + ' items'">
              <span class="cuadrante-emoji" aria-hidden="true">{{ c.emoji }}</span>
              <span class="cuadrante-nombre" [style.color]="c.color">{{ c.nombre }}</span>
              <span class="cuadrante-items">{{ c.items }} items</span>
              <span class="cuadrante-desc">{{ c.descripcion }}</span>
              @if (c.platos.length > 0) {
                <ul class="cuadrante-platos" [attr.aria-label]="'Platos en ' + c.nombre">
                  @for (plato of c.platos; track plato) {
                    <li class="cuadrante-plato">{{ plato }}</li>
                  } @empty {
                    <li class="cuadrante-plato" aria-hidden="true">—</li>
                  }
                </ul>
              }
            </article>
          } @empty {
            <div class="empty-state" role="status">
              <span class="empty-state-icon" aria-hidden="true">🍽️</span>
              <span>No hay datos de ingeniería de menú disponibles</span>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export class OperativosComponent {
  readonly kpis = input.required<KpiOperativo[]>();
  readonly foodCostMeses = input.required<FoodCostMes[]>();
  readonly mermas = input.required<MermaItem[]>();
  readonly cuadrantes = input.required<CuadranteMenu[]>();
  readonly balanceInventario = input.required<BalanceInventario>();

  readonly foodCostChartData = computed<ChartData<'bar'>>(() => {
    const data = this.foodCostMeses();
    return {
      labels: data.map(d => d.mes),
      datasets: [
        {
          label: 'Real',
          data: data.map(d => d.real),
          backgroundColor: '#EF4444',
          borderRadius: 4,
          barPercentage: 0.6,
        },
        {
          label: 'Ideal',
          data: data.map(d => d.ideal),
          backgroundColor: '#E5E7EB',
          borderRadius: 4,
          barPercentage: 0.6,
        },
      ],
    };
  });

  readonly barOptions = createBarOptions({
    scales: {
      y: {
        ticks: {
          callback: (v) => v + '%',
        },
      },
    },
  });
}
