import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movimiento } from '../../models/tesoreria.model';
import { MroCurrencyPipe } from '../../../balances/pipes/currency.pipe';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../../balances/styles/balances-shared.css',
  styles: [`
    /* ===== TABLE CARD (Ventas articulos pattern) ===== */
    .table-card {
      background: var(--bg-primary, white);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-sm, 0 1px 1.75px -1px rgba(0,0,0,0.1), 0 1px 2.625px rgba(0,0,0,0.1));
      padding: 20px 25px;
    }

    /* ===== HEADER ===== */
    .movimientos-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-title {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--slate-900, #0F172B);
      margin: 0;
    }

    .count-badge {
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-500, #6B7280);
      background: var(--slate-100, #F3F4F6);
      padding: 3px 10px;
      border-radius: 9999px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    /* ===== FILTERS ===== */
    .filter-select {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      padding: 7px 28px 7px 12px;
      border: 1px solid var(--slate-200, #E2E8F0);
      border-radius: 8px;
      background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2390A1B9' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 10px center;
      color: var(--slate-700, #314158);
      appearance: none;
      cursor: pointer;
      min-width: 160px;
      transition: border-color 0.15s ease;
    }

    .filter-select:hover {
      border-color: #D1D5DB;
    }

    .filter-select:focus {
      outline: none;
      border-color: #1155CC;
      box-shadow: 0 0 0 2px rgba(17, 85, 204, 0.12);
    }

    /* ===== BUTTONS ===== */
    .btn-primary {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      padding: 7px 16px;
      border: none;
      border-radius: 8px;
      background: #1155CC;
      color: #fff;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
    }

    .btn-primary:hover {
      background: #0E47AE;
    }

    .btn-outline {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      padding: 7px 16px;
      border: 1px solid var(--slate-200, #E2E8F0);
      border-radius: 8px;
      background: #fff;
      color: var(--slate-700, #314158);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }

    .btn-outline:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
    }

    .btn-icon {
      font-size: 14px;
      line-height: 1;
    }

    /* ===== TABLE ===== */
    .table-wrapper {
      overflow-x: auto;
    }

    .text-right {
      text-align: right;
    }

    /* ===== MONTO COLORS ===== */
    .monto-positive {
      font-weight: 600;
      color: #22C55E;
    }

    .monto-negative {
      font-weight: 600;
      color: #EF4444;
    }

    .monto-zero {
      font-weight: 600;
      color: var(--slate-700, #314158);
    }

    /* ===== STATUS BADGES ===== */
    .status-badge {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      padding: 4px 12px;
      border-radius: var(--radius-sm, 8px);
      border: 1px solid transparent;
    }

    .status-confirmado {
      background: var(--success-bg, #ECFDF5);
      color: var(--success-color, #00A43D);
      border-color: var(--success-border, #A4F4CF);
    }

    .status-pendiente {
      background: #FEF3C7;
      color: #D97706;
      border-color: #FDE68A;
    }

    .status-anulado {
      background: #FEF2F2;
      color: #EF4444;
      border-color: #FECACA;
    }

    /* ===== TIPO BADGES ===== */
    .tipo-badge {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      padding: 4px 12px;
      border-radius: var(--radius-sm, 8px);
      border: 1px solid transparent;
    }

    .tipo-ingreso {
      background: #F0FDF4;
      color: #16A34A;
      border-color: #BBF7D0;
    }

    .tipo-egreso {
      background: #FEF2F2;
      color: #EF4444;
      border-color: #FECACA;
    }

    .tipo-transferencia {
      background: #EFF6FF;
      color: #2563EB;
      border-color: #BFDBFE;
    }

    /* ===== CELL HELPERS ===== */
    .cell-ref {
      font-family: 'Inter', monospace;
      font-size: 12px;
      color: var(--slate-400, #90A1B9);
    }

    /* ===== PAGINATION ROW ===== */
    .pagination-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--slate-100, #F3F4F6);
    }

    .pagination-buttons {
      display: flex;
      gap: 4px;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .movimientos-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media (max-width: 768px) {
      .table-card {
        padding: 14px 16px;
      }

      .header-actions {
        width: 100%;
      }

      .filter-select {
        flex: 1;
        min-width: 0;
      }
    }
  `],
  template: `
    <div class="table-card">
      <!-- Header -->
      <div class="movimientos-header">
        <div class="header-left">
          <h3 class="header-title">Historial de Movimientos</h3>
          <span class="count-badge">{{ filteredMovimientos().length }}</span>
        </div>

        <div class="header-actions">
          <button class="btn-primary" type="button"
                  aria-label="Nuevo movimiento"
                  (click)="onNuevoMovimiento.emit()">
            <span class="btn-icon" aria-hidden="true">+</span>
            Nuevo Movimiento
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table class="data-table" aria-label="Historial de movimientos">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cuenta</th>
              <th>Tipo</th>
              <th>Categoria</th>
              <th>Descripcion</th>
              <th>Ref</th>
              <th class="th-right">Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (mov of paginatedMovimientos(); track mov.id) {
              <tr>
                <td>{{ mov.fecha }}</td>
                <td>{{ mov.cuenta }}</td>
                <td>
                  <span class="tipo-badge"
                        [class.tipo-ingreso]="mov.tipo === 'Ingreso'"
                        [class.tipo-egreso]="mov.tipo === 'Egreso'"
                        [class.tipo-transferencia]="mov.tipo === 'Transferencia'">
                    {{ mov.tipo }}
                  </span>
                </td>
                <td>{{ mov.categoria }}</td>
                <td>{{ mov.descripcion }}</td>
                <td class="cell-ref">{{ mov.referencia }}</td>
                <td class="td-right"
                    [class.monto-positive]="mov.monto > 0"
                    [class.monto-negative]="mov.monto < 0"
                    [class.monto-zero]="mov.monto === 0">
                  {{ mov.monto | mroCurrency }}
                </td>
                <td>
                  <span class="status-badge"
                        [class.status-confirmado]="mov.estado === 'Confirmado'"
                        [class.status-pendiente]="mov.estado === 'Pendiente'"
                        [class.status-anulado]="mov.estado === 'Anulado'">
                    {{ mov.estado }}
                  </span>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="8">
                  <div class="empty-state">
                    <span class="empty-state-icon" role="status" aria-hidden="true">&#128203;</span>
                    <span>No hay movimientos para mostrar</span>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (totalPages() > 1) {
        <div class="pagination-row">
          <span class="pagination-info">
            Mostrando {{ paginationStart() }} de {{ filteredMovimientos().length }} resultados
          </span>

          <div class="pagination-buttons">
            <button class="page-btn"
                    [disabled]="currentPage() === 1"
                    (click)="currentPage.set(currentPage() - 1)">
              &lsaquo;
            </button>

            @for (page of pageNumbers(); track page) {
              <button class="page-btn"
                      [class.page-active]="page === currentPage()"
                      (click)="currentPage.set(page)">
                {{ page }}
              </button>
            }

            <button class="page-btn"
                    [disabled]="currentPage() === totalPages()"
                    (click)="currentPage.set(currentPage() + 1)">
              &rsaquo;
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class MovimientosComponent {
  readonly movimientos = input.required<Movimiento[]>();

  /** Output events */
  readonly onNuevoMovimiento = output<void>();

  /** Filter signals */
  readonly filtroCuenta = signal('');
  readonly filtroCategoria = signal('');
  readonly currentPage = signal(1);

  private readonly PAGE_SIZE = 7;

  constructor() {
    // Reset page to 1 whenever filters change
    effect(() => {
      this.filtroCuenta();
      this.filtroCategoria();
      this.currentPage.set(1);
    });
  }

  /** Unique accounts extracted from input data */
  readonly cuentasUnicas = computed(() => {
    const cuentas = this.movimientos().map(m => m.cuenta);
    return [...new Set(cuentas)].sort();
  });

  /** Unique categories extracted from input data */
  readonly categoriasUnicas = computed(() => {
    const categorias = this.movimientos().map(m => m.categoria);
    return [...new Set(categorias)].sort();
  });

  /** Movimientos filtered by cuenta and categoria */
  readonly filteredMovimientos = computed(() => {
    let result = this.movimientos();
    const cuenta = this.filtroCuenta();
    const categoria = this.filtroCategoria();

    if (cuenta) {
      result = result.filter(m => m.cuenta === cuenta);
    }
    if (categoria) {
      result = result.filter(m => m.categoria === categoria);
    }

    return result;
  });

  /** Total pages */
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredMovimientos().length / this.PAGE_SIZE))
  );

  /** Page numbers array */
  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  /** Paginated slice of filtered movimientos */
  readonly paginatedMovimientos = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.PAGE_SIZE;
    return this.filteredMovimientos().slice(start, start + this.PAGE_SIZE);
  });

  /** "Mostrando X de Y" text helper */
  readonly paginationStart = computed(() => {
    const page = this.currentPage();
    const total = this.filteredMovimientos().length;
    const start = (page - 1) * this.PAGE_SIZE + 1;
    const end = Math.min(page * this.PAGE_SIZE, total);
    return `${start}-${end}`;
  });
}
