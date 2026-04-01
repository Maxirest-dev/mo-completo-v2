import {
  Component,
  ChangeDetectionStrategy,
  signal,
  input,
  output,
} from '@angular/core';

import {
  CategoriaGridRow,
  ProductoGridRow,
  GridActionEvent,
} from '../../models/categoria-grid.model';

@Component({
  selector: 'app-categoria-grid',
  standalone: true,
  imports: [],
  template: `
    <div class="grid-container">
      @if (loading()) {
        <div class="loading-overlay">
          <div class="spinner"></div>
          <span>Cargando categorias...</span>
        </div>
      }

      <table class="master-table">
        <thead>
          <tr>
            <th class="col-nombre">NOMBRE</th>
            <th class="col-estado">ESTADO</th>
            <th class="col-productos">PRODUCTOS</th>
            <th class="col-categoria">CATEGORIA</th>
            <th class="col-acciones">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          @for (cat of rowData(); track cat.id) {
            <!-- Master row (categoria) -->
            <tr class="master-row" [class.expanded]="isExpanded(cat.id)" (click)="toggleExpand(cat.id)">
              <td class="col-nombre">
                <div class="nombre-cell">
                  <span class="chevron" [class.chevron-open]="isExpanded(cat.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/>
                    </svg>
                  </span>
                  <span class="cat-icon" [style.background]="cat.iconoColor">
                    {{ cat.icono || '📦' }}
                  </span>
                  <div class="cat-info">
                    <span class="cat-name">{{ cat.nombre }}</span>
                    <span class="cat-desc">{{ cat.descripcion }}</span>
                  </div>
                </div>
              </td>
              <td class="col-estado">
                <span class="badge" [class]="getBadgeClass(cat.estado)">
                  {{ getEstadoLabel(cat.estado) }}
                </span>
              </td>
              <td class="col-productos">
                <div class="productos-count">
                  <span class="count-number">{{ cat.productosCount }}</span>
                  <span class="count-label">unidades</span>
                </div>
              </td>
              <td class="col-categoria">{{ cat.categoriaPadre || '-' }}</td>
              <td class="col-acciones" (click)="$event.stopPropagation()">
                <div class="acciones-cell">
                  <button class="btn-new-plato" (click)="onAction('create', 'producto', cat)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    Nuevo plato
                  </button>
                  <button class="btn-edit" (click)="onAction('edit', 'categoria', cat)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar
                  </button>
                </div>
              </td>
            </tr>

            <!-- Detail rows (productos) -->
            @if (isExpanded(cat.id)) {
              <tr class="detail-row">
                <td colspan="5">
                  <div class="detail-wrapper">
                    <table class="detail-table">
                      <thead>
                        <tr>
                          <th>NOMBRE</th>
                          <th>ESTADÍSTICA</th>
                          <th>ESTADO</th>
                          <th>PRECIO</th>
                          <th>PRECIO DELY</th>
                          <th>ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (prod of cat.productos; track prod.id) {
                          <tr class="producto-row">
                            <td>{{ prod.nombre }}</td>
                            <td>
                              @if (prod.estadistica !== null && prod.estadistica !== undefined) {
                                <span class="badge-estadistica" [class.badge-estadistica-positiva]="prod.estadistica >= 0" [class.badge-estadistica-negativa]="prod.estadistica < 0">
                                  {{ prod.estadistica >= 0 ? '↗' : '↘' }} {{ prod.estadistica >= 0 ? '' : '' }}{{ prod.estadistica }}%
                                </span>
                              } @else {
                                <span>-</span>
                              }
                            </td>
                            <td>
                              <span class="badge-producto" [class]="prod.estado === 'ACTIVO' ? 'badge-prod-activo' : 'badge-prod-inactivo'">
                                {{ prod.estado === 'ACTIVO' ? 'Activo' : 'Inactivo' }}
                              </span>
                            </td>
                            <td>{{ formatPrice(prod.precio) }}</td>
                            <td>{{ formatPrice(prod.precioDelivery) }}</td>
                            <td>
                              <div class="acciones-cell">
                                <button class="btn-edit" (click)="onAction('edit', 'producto', prod)">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                  Editar
                                </button>
                                @if (prod.estado === 'ACTIVO') {
                                  <button class="btn-deactivate" (click)="onAction('deactivate', 'producto', prod)">Desactivar</button>
                                } @else {
                                  <button class="btn-activate" (click)="onAction('activate', 'producto', prod)">Activar</button>
                                }
                              </div>
                            </td>
                          </tr>
                        } @empty {
                          <tr>
                            <td colspan="6" class="empty-productos">Sin productos en esta categoria</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            }
          } @empty {
            <tr>
              <td colspan="5" class="empty-state-row">
                <div class="empty-state">
                  <span class="empty-state-title">Sin categorias</span>
                  <span class="empty-state-description">No se encontraron categorias con los filtros seleccionados</span>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .grid-container {
      position: relative;
      width: 100%;
    }

    .loading-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 10;
      font-size: 14px;
      color: var(--gray-600);
    }

    /* ---- Master table ---- */
    .master-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .master-table thead th {
      padding: 14px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      border-bottom: 1px solid #E5E7EB;
      background: white;
    }

    .col-nombre { width: 35%; }
    .col-estado { width: 15%; }
    .col-productos { width: 15%; }
    .col-categoria { width: 15%; }
    .col-acciones { width: 20%; text-align: right !important; }

    /* ---- Master row ---- */
    .master-row {
      cursor: pointer;
      transition: background 0.15s;
    }

    .master-row:hover { background: #FAFAFA; }
    .master-row.expanded { background: #FAFAFA; }

    .master-row td {
      padding: 12px 16px;
      border-bottom: 1px solid #F3F4F6;
      vertical-align: middle;
      font-size: 14px;
      color: var(--gray-700);
    }

    /* Chevron */
    .chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #9CA3AF;
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }
    .chevron-open { transform: rotate(90deg); }

    /* Nombre cell */
    .nombre-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cat-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .cat-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .cat-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-900);
    }

    .cat-desc {
      font-size: 13px;
      color: var(--gray-500);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Badge estado */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 9999px;
      white-space: nowrap;
    }
    .badge::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .badge-disponible { background: #D1FAE5; color: #065F46; }
    .badge-disponible::before { background: #10B981; }

    .badge-stock-medio { background: #FEF3C7; color: #92400E; }
    .badge-stock-medio::before { background: #F59E0B; }

    .badge-sin-stock { background: #FEE2E2; color: #991B1B; }
    .badge-sin-stock::before { background: #EF4444; }

    .badge-inactivo { background: #F3F4F6; color: #4B5563; }
    .badge-inactivo::before { background: #6B7280; }

    /* Productos count */
    .productos-count {
      display: flex;
      flex-direction: column;
    }
    .count-number {
      font-weight: 600;
      font-size: 14px;
      color: #F97316;
    }
    .count-label {
      font-size: 12px;
      color: #9CA3AF;
    }

    /* Acciones */
    .acciones-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
    }

    .btn-new-plato {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      color: #FF8800;
      background: #FFFFFF;
      border: 1px solid #FF8800;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .btn-new-plato:hover { background: #FFF7ED; }

    .btn-edit {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-700);
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-edit:hover { background: #F9FAFB; border-color: #D1D5DB; }

    .btn-more {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      color: #9CA3AF;
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-more:hover { background: #F3F4F6; color: #6B7280; }

    .btn-deactivate {
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      color: #DC2626;
      background: #FFFFFF;
      border: 1px solid #FECACA;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-deactivate:hover { background: #FEF2F2; }

    .btn-activate {
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      color: white;
      background: #10B981;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-activate:hover { background: #059669; }

    /* ---- Detail row ---- */
    .detail-row td {
      padding: 0;
      border-bottom: 1px solid #F3F4F6;
    }

    .detail-wrapper {
      padding: 0 16px 16px 16px;
      background: #FAFAFA;
    }

    .detail-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      overflow: hidden;
    }

    .detail-table thead th {
      padding: 10px 16px;
      font-size: 11px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      background: #F3F4F6;
      border-bottom: 1px solid #E5E7EB;
    }

    .detail-table thead th:last-child { text-align: right; }

    .producto-row td {
      padding: 12px 16px;
      font-size: 14px;
      color: var(--gray-700);
      border-bottom: 1px solid #F3F4F6;
    }
    .producto-row:last-child td { border-bottom: none; }

    .badge-producto {
      font-size: 13px;
      font-weight: 500;
    }
    .badge-prod-activo { color: #10B981; }
    .badge-prod-inactivo { color: #6B7280; }

    .badge-estadistica {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 4px 10px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 16px;
    }
    .badge-estadistica-positiva {
      color: #059669;
      background: #ECFDF5;
    }
    .badge-estadistica-negativa {
      color: #DC2626;
      background: #FEF2F2;
    }

    .empty-productos {
      padding: 24px 16px;
      text-align: center;
      color: #9CA3AF;
      font-size: 13px;
    }

    .empty-state-row {
      padding: 48px 24px !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriaGridComponent {
  rowData = input<CategoriaGridRow[]>([]);
  loading = input<boolean>(false);
  actionEvent = output<GridActionEvent>();

  private expandedRows = signal<Set<number>>(new Set());

  isExpanded(id: number): boolean {
    return this.expandedRows().has(id);
  }

  toggleExpand(id: number): void {
    const current = new Set(this.expandedRows());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.expandedRows.set(current);
  }

  onAction(action: GridActionEvent['action'], type: GridActionEvent['type'], data: CategoriaGridRow | ProductoGridRow): void {
    this.actionEvent.emit({ action, type, data });
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'badge-disponible';
      case 'STOCK_MEDIO': return 'badge-stock-medio';
      case 'SIN_STOCK': return 'badge-sin-stock';
      case 'INACTIVO': return 'badge-inactivo';
      default: return 'badge-disponible';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'Disponible';
      case 'STOCK_MEDIO': return 'Stock medio';
      case 'SIN_STOCK': return 'Sin stock';
      case 'INACTIVO': return 'Inactivo';
      default: return estado;
    }
  }

  formatPrice(price: number | null): string {
    if (price == null) return '-';
    return '$' + price.toLocaleString('es-AR');
  }

  expandAll(): void {
    const all = new Set(this.rowData().map(c => c.id));
    this.expandedRows.set(all);
  }

  collapseAll(): void {
    this.expandedRows.set(new Set());
  }
}
