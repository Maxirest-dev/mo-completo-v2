import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MroCurrencyPipe } from '../../../balances/pipes/currency.pipe';
import { KpiAgenda, FacturaPendiente } from '../../models/tesoreria.model';

@Component({
  selector: 'app-agenda-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../../balances/styles/balances-shared.css',
  template: `
    <!-- Action Bar -->
    <div class="action-bar">
      <div class="action-filters">
        <select
          class="filter-select"
          [ngModel]="filtroProveedor()"
          (ngModelChange)="filtroProveedor.set($event)">
          <option value="">Todos los proveedores</option>
          @for (prov of proveedores(); track prov) {
            <option [value]="prov">{{ prov }}</option>
          }
        </select>

        <select
          class="filter-select"
          [ngModel]="filtroEstado()"
          (ngModelChange)="filtroEstado.set($event)">
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Vencida">Vencida</option>
          <option value="Pagada">Pagada</option>
          <option value="Parcial">Parcial</option>
        </select>
      </div>

      <div class="action-right">
        <div class="view-toggle">
          <button class="pill-btn pill-active">Lista</button>
          <button class="pill-btn">Calendario</button>
        </div>
        <button class="btn-action btn-export">Exportar Excel</button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="kpi-row">
      @for (kpi of kpis(); track kpi.label) {
        <div class="kpi-card">
          <span class="kpi-label">{{ kpi.label }}</span>
          <span class="kpi-value" [style.color]="kpi.color">
            {{ kpi.value | mroCurrency }}
          </span>
          <span class="kpi-subtitle">{{ kpi.subtitle }}</span>
        </div>
      }
    </div>

    <!-- Facturas Pendientes Table Card -->
    <div class="table-card">
      <div class="table-header-row">
        <h3 class="table-title">
          Facturas Pendientes de Pago
          <span class="card-badge">{{ filteredFacturas().length }}</span>
        </h3>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Nro. Factura</th>
              <th>Fecha Vencimiento</th>
              <th class="text-right">Monto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (fp of paginatedFacturas(); track fp.id) {
              <tr>
                <td>{{ fp.proveedor }}</td>
                <td class="cell-code">{{ fp.nroFactura }}</td>
                <td>{{ fp.fechaVencimiento }}</td>
                <td class="text-right font-bold">{{ fp.monto | mroCurrency }}</td>
                <td>
                  <span class="badge" [ngClass]="estadoBadgeClass(fp.estado)">
                    {{ fp.estado }}
                  </span>
                </td>
                <td>
                  @if (fp.estado !== 'Pagada') {
                    <button class="btn-pagar">Pagar</button>
                  }
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6">
                  <div class="empty-state">
                    <span class="empty-state-icon">📋</span>
                    <span>No hay facturas pendientes</span>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (totalPages() > 1) {
        <div class="pagination">
          <button
            class="pagination-btn"
            [disabled]="currentPage() === 1"
            (click)="currentPage.set(currentPage() - 1)">
            &laquo;
          </button>
          @for (page of pagesArray(); track page) {
            <button
              class="pagination-btn"
              [class.pagination-active]="page === currentPage()"
              (click)="currentPage.set(page)">
              {{ page }}
            </button>
          }
          <button
            class="pagination-btn"
            [disabled]="currentPage() === totalPages()"
            (click)="currentPage.set(currentPage() + 1)">
            &raquo;
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    /* === ACTION BAR === */
    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .action-filters {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .filter-select {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      padding: 7px 32px 7px 12px;
      border: 1px solid var(--slate-200, #E2E8F0);
      border-radius: 8px;
      background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 10px center;
      color: var(--slate-700, #314158);
      appearance: none;
      cursor: pointer;
      min-width: 180px;
    }

    .filter-select:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .action-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .view-toggle {
      display: flex;
      background: var(--slate-100, #F3F4F6);
      border-radius: 8px;
      padding: 2px;
    }

    .pill-btn {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      padding: 6px 14px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--slate-500, #6B7280);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .pill-active {
      background: #fff;
      color: var(--slate-900, #0F172B);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    }

    .btn-export {
      border: 1px solid var(--slate-200, #E2E8F0);
      border-radius: 8px;
      background: #fff;
      padding: 7px 16px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: var(--slate-700, #314158);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-export:hover {
      background: var(--slate-50, #F8FAFC);
      border-color: #D1D5DB;
    }

    /* === TABLE CARD === */
    .table-card {
      background: var(--bg-primary, white);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-sm, 0 1px 1.75px -1px rgba(0,0,0,0.1), 0 1px 2.625px rgba(0,0,0,0.1));
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
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .table-wrapper { overflow-x: auto; }

    .data-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
    }

    .data-table thead tr { background: var(--slate-50, #F8FAFC); }

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

    .data-table th:first-child { border-top-left-radius: var(--radius-sm, 8px); }
    .data-table th:last-child { border-top-right-radius: var(--radius-sm, 8px); }

    .data-table td {
      padding: 10px 12px;
      color: var(--slate-700, #314158);
      border-bottom: 1px solid var(--slate-200, #E2E8F0);
      white-space: nowrap;
    }

    .data-table tbody tr:hover { background: var(--slate-50, #F8FAFC); }

    .text-right { text-align: right; }
    .font-bold { font-weight: 600; }
    .cell-code {
      font-family: 'Inter', monospace;
      font-size: 12px;
      color: var(--slate-400, #90A1B9);
    }

    /* === ESTADO BADGES === */
    .badge-yellow { background: #FEF3C7; color: #D97706; }
    .badge-red { background: #FEF2F2; color: #EF4444; }
    .badge-green { background: #F0FDF4; color: #22C55E; }
    .badge-blue { background: #DBEAFE; color: #2563EB; }

    /* === PAGAR BUTTON === */
    .btn-pagar {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      padding: 4px 12px;
      border: 1px solid #3B82F6;
      border-radius: 6px;
      background: transparent;
      color: #3B82F6;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-pagar:hover {
      background: #3B82F6;
      color: #fff;
    }

    /* === PAGINATION === */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--slate-100, #F3F4F6);
    }

    .pagination-btn {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      min-width: 32px;
      height: 32px;
      border: 1px solid var(--slate-200, #E2E8F0);
      border-radius: 6px;
      background: #fff;
      color: var(--slate-700, #314158);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      background: var(--slate-50, #F8FAFC);
      border-color: #D1D5DB;
    }

    .pagination-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .pagination-active {
      background: #3B82F6;
      color: #fff;
      border-color: #3B82F6;
    }

    .pagination-active:hover {
      background: #2563EB;
      border-color: #2563EB;
    }

    /* === RESPONSIVE === */
    @media (max-width: 768px) {
      .action-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .action-right {
        justify-content: space-between;
      }

      .filter-select {
        min-width: 0;
        flex: 1;
      }
    }
  `],
})
export class AgendaPagosComponent {
  readonly kpis = input.required<KpiAgenda[]>();
  readonly facturas = input.required<FacturaPendiente[]>();

  /** Filtros locales */
  readonly filtroProveedor = signal<string>('');
  readonly filtroEstado = signal<string>('');

  /** Paginacion */
  readonly currentPage = signal<number>(1);
  readonly pageSize = 7;

  /** Lista unica de proveedores para el dropdown */
  readonly proveedores = computed(() => {
    const set = new Set(this.facturas().map(f => f.proveedor));
    return [...set].sort();
  });

  /** Facturas filtradas por proveedor y estado */
  readonly filteredFacturas = computed(() => {
    let result = this.facturas();
    const prov = this.filtroProveedor();
    const est = this.filtroEstado();

    if (prov) {
      result = result.filter(f => f.proveedor === prov);
    }
    if (est) {
      result = result.filter(f => f.estado === est);
    }

    // Reset page when filters change
    this.currentPage.set(1);

    return result;
  });

  /** Total de paginas */
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredFacturas().length / this.pageSize))
  );

  /** Array de numeros de pagina para iterar */
  readonly pagesArray = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  /** Facturas de la pagina actual */
  readonly paginatedFacturas = computed(() => {
    const all = this.filteredFacturas();
    const start = (this.currentPage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  /** Clase CSS para badge de estado */
  estadoBadgeClass(estado: FacturaPendiente['estado']): string {
    switch (estado) {
      case 'Pendiente': return 'badge-yellow';
      case 'Vencida':   return 'badge-red';
      case 'Pagada':    return 'badge-green';
      case 'Parcial':   return 'badge-blue';
    }
  }
}
