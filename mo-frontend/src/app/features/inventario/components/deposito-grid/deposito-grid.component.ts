import {
  Component,
  ChangeDetectionStrategy,
  signal,
  input,
  output,
} from '@angular/core';

import {
  DepositoGridRow,
  InsumoGridRow,
  GridActionEvent,
} from '../../models/inventario-grid.model';

@Component({
  selector: 'app-deposito-grid',
  standalone: true,
  imports: [],
  template: `
    <div class="grid-container">
      @if (loading()) {
        <div class="loading-overlay">
          <div class="spinner"></div>
          <span>Cargando depositos...</span>
        </div>
      }

      <table class="master-table">
        <thead>
          <tr>
            <th class="col-nombre">NOMBRE</th>
            <th class="col-tipo">TIPO</th>
            <th class="col-insumos">INSUMOS</th>
            <th class="col-ubicacion">UBICACION</th>
            <th class="col-acciones">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          @for (dep of rowData(); track dep.id) {
            <!-- Master row (deposito) -->
            <tr class="master-row" [class.expanded]="isExpanded(dep.id)" (click)="toggleExpand(dep.id)">
              <td class="col-nombre">
                <div class="nombre-cell">
                  <span class="chevron" [class.chevron-open]="isExpanded(dep.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/>
                    </svg>
                  </span>
                  <span class="dep-icon" [style.background]="getIconColor(dep.tipo)">
                    {{ getIconEmoji(dep.tipo) }}
                  </span>
                  <div class="dep-info">
                    <span class="dep-name">{{ dep.nombre }}</span>
                    <span class="dep-desc">{{ dep.descripcion }}</span>
                  </div>
                </div>
              </td>
              <td class="col-tipo">
                <span class="badge-tipo" [class]="'tipo-' + dep.tipo.toLowerCase()">
                  {{ dep.tipo }}
                </span>
              </td>
              <td class="col-insumos">
                <div class="insumos-count">
                  <span class="count-number">{{ dep.insumosCount }}</span>
                  <span class="count-label">insumos</span>
                </div>
              </td>
              <td class="col-ubicacion">{{ dep.ubicacion || '-' }}</td>
              <td class="col-acciones" (click)="$event.stopPropagation()">
                <div class="acciones-cell">
                  <button class="btn-new-insumo" (click)="agregarInsumo.emit(dep.id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    Nuevo insumo
                  </button>
                  <button class="btn-edit" (click)="onAction('edit', 'deposito', dep)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar
                  </button>
                </div>
              </td>
            </tr>

            <!-- Detail rows (insumos) -->
            @if (isExpanded(dep.id)) {
              <tr class="detail-row">
                <td colspan="5">
                  <div class="detail-wrapper">
                    <table class="detail-table">
                      <thead>
                        <tr>
                          <th>NOMBRE</th>
                          <th>ESTADO</th>
                          <th>STOCK ACTUAL</th>
                          <th>STOCK MIN.</th>
                          <th>PRECIO</th>
                          <th>ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (ins of dep.insumos; track ins.id) {
                          <tr class="insumo-row">
                            <td>{{ ins.nombre }}</td>
                            <td>
                              <span class="badge-estado" [class]="'estado-' + ins.estadoStock.toLowerCase()">
                                {{ ins.estadoStock === 'NORMAL' ? 'Normal' : ins.estadoStock === 'BAJO' ? 'Bajo' : 'Critico' }}
                              </span>
                            </td>
                            <td class="stock-cell">{{ ins.stockActual }} {{ ins.unidadMedida }}</td>
                            <td>{{ ins.stockMinimo }} {{ ins.unidadMedida }}</td>
                            <td>{{ ins.precio ? formatPrice(ins.precio) : '-' }}</td>
                            <td>
                              <div class="acciones-cell">
                                <button class="btn-edit-sm" (click)="onAction('edit', 'insumo', ins)">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                  Editar
                                </button>
                                <button class="btn-adjust" (click)="onAction('adjust-stock', 'insumo', ins)">
                                  Ajustar
                                </button>
                                @if (ins.activo) {
                                  <button class="btn-deactivate" (click)="onAction('deactivate', 'insumo', ins)">Desactivar</button>
                                } @else {
                                  <button class="btn-activate" (click)="onAction('activate', 'insumo', ins)">Activar</button>
                                }
                              </div>
                            </td>
                          </tr>
                        } @empty {
                          <tr>
                            <td colspan="6" class="empty-insumos">Sin insumos en este deposito</td>
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
                  <span class="empty-state-title">Sin depositos</span>
                  <span class="empty-state-description">No se encontraron depositos con los filtros seleccionados</span>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .grid-container { position: relative; width: 100%; }

    .loading-overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(255,255,255,0.95); display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 16px; z-index: 10;
      font-size: 14px; color: var(--gray-600);
    }

    /* Master table */
    .master-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    .master-table thead th {
      padding: 14px 16px; font-size: 12px; font-weight: 600; color: var(--slate-500);
      text-transform: uppercase; letter-spacing: 0.05em; text-align: left;
      border-bottom: 1px solid var(--slate-200); background: white;
    }

    .col-nombre { width: 30%; }
    .col-tipo { width: 15%; }
    .col-insumos { width: 15%; }
    .col-ubicacion { width: 15%; }
    .col-acciones { width: 25%; text-align: right !important; }

    /* Master row */
    .master-row { cursor: pointer; transition: background 0.15s; }
    .master-row:hover { background: #FAFAFA; }
    .master-row.expanded { background: #FAFAFA; }
    .master-row td {
      padding: 12px 16px; border-bottom: 1px solid var(--slate-100);
      vertical-align: middle; font-size: 14px; color: var(--gray-700);
    }

    /* Chevron */
    .chevron {
      display: inline-flex; align-items: center; justify-content: center;
      color: var(--slate-400); transition: transform 0.2s ease; flex-shrink: 0;
    }
    .chevron-open { transform: rotate(90deg); }

    /* Nombre cell */
    .nombre-cell { display: flex; align-items: center; gap: 12px; }
    .dep-icon {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    .dep-info { display: flex; flex-direction: column; }
    .dep-name { font-weight: 600; color: var(--text-heading); }
    .dep-desc { font-size: 12px; color: var(--slate-400); margin-top: 2px; }

    /* Tipo badges */
    .badge-tipo {
      display: inline-block; padding: 3px 10px; font-size: 12px; font-weight: 500;
      border-radius: 6px;
    }
    .tipo-verduras { background: var(--success-bg); color: var(--success-text); }
    .tipo-carnes { background: var(--danger-bg); color: var(--danger-text); }
    .tipo-lacteos { background: #DBEAFE; color: #1E40AF; }
    .tipo-bebidas { background: #E0E7FF; color: #3730A3; }
    .tipo-secos { background: var(--warning-bg); color: #92400E; }
    .tipo-congelados { background: #CFFAFE; color: #155E75; }
    .tipo-otros { background: var(--slate-100); color: var(--slate-600); }

    /* Insumos count */
    .insumos-count { display: flex; flex-direction: column; }
    .count-number { font-weight: 600; font-size: 14px; color: var(--primary-orange); }
    .count-label { font-size: 12px; color: var(--slate-400); }

    /* Acciones */
    .acciones-cell { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }

    .btn-new-insumo {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; font-size: 13px; font-weight: 500;
      color: #FF8800; background: #FFFFFF; border: 1px solid #FF8800;
      border-radius: 6px; cursor: pointer; transition: all 0.15s; white-space: nowrap;
    }
    .btn-new-insumo:hover { background: #FFF7ED; }

    .btn-edit, .btn-edit-sm {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; font-size: 13px; font-weight: 500;
      color: var(--gray-700); background: white; border: 1px solid var(--slate-200);
      border-radius: 6px; cursor: pointer; transition: all 0.15s;
    }
    .btn-edit:hover, .btn-edit-sm:hover { background: var(--gray-50); border-color: var(--gray-300); }
    .btn-edit svg, .btn-edit-sm svg { width: 16px; height: 16px; }

    .btn-adjust {
      padding: 6px 12px; font-size: 13px; font-weight: 500;
      color: #2563EB; background: #EFF6FF; border: 1px solid #BFDBFE;
      border-radius: 6px; cursor: pointer; transition: all 0.15s;
    }
    .btn-adjust:hover { background: #DBEAFE; }

    .btn-deactivate {
      padding: 6px 12px; font-size: 13px; font-weight: 500;
      color: #DC2626; background: #FFFFFF; border: 1px solid #FECACA;
      border-radius: 6px; cursor: pointer; transition: background 0.15s;
    }
    .btn-deactivate:hover { background: #FEF2F2; }

    .btn-activate {
      padding: 6px 12px; font-size: 13px; font-weight: 500;
      color: #059669; background: #FFFFFF; border: 1px solid #A7F3D0;
      border-radius: 6px; cursor: pointer; transition: background 0.15s;
    }
    .btn-activate:hover { background: #ECFDF5; }

    /* Detail row */
    .detail-row td { padding: 0; border-bottom: 1px solid var(--slate-100); }
    .detail-wrapper { padding: 0 16px 16px 16px; background: #FAFAFA; }
    .detail-table {
      width: 100%; border-collapse: collapse;
      background: white; border: 1px solid var(--slate-200);
      border-radius: 8px; overflow: hidden;
    }
    .detail-table thead th {
      padding: 10px 16px; font-size: 11px; font-weight: 600; color: var(--slate-500);
      text-transform: uppercase; letter-spacing: 0.05em; text-align: left;
      background: var(--slate-100); border-bottom: 1px solid var(--slate-200);
    }
    .detail-table thead th:last-child { text-align: right; }
    .insumo-row td {
      padding: 12px 16px; font-size: 14px; color: var(--gray-700);
      border-bottom: 1px solid var(--slate-100);
    }
    .insumo-row:last-child td { border-bottom: none; }

    /* Insumo tipo badges */
    .badge-insumo-tipo {
      display: inline-block; padding: 2px 8px; font-size: 11px;
      font-weight: 500; border-radius: 4px;
    }
    .insumo-tipo-comprado { background: #DBEAFE; color: #1E40AF; }
    .insumo-tipo-elaborado { background: var(--warning-bg); color: #92400E; }

    /* Estado badges */
    .badge-estado {
      display: inline-block; padding: 2px 8px; font-size: 11px;
      font-weight: 500; border-radius: 4px;
    }
    .estado-normal { background: var(--success-bg); color: var(--success-text); }
    .estado-bajo { background: var(--warning-bg); color: #92400E; }
    .estado-critico { background: var(--danger-bg); color: var(--danger-text); }

    .stock-cell { font-weight: 600; }

    .empty-insumos {
      padding: 24px 16px; text-align: center; color: var(--slate-400); font-size: 13px;
    }

    .empty-state-row td { padding: 0; }
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      gap: 8px; padding: 48px 16px; color: var(--slate-400);
    }
    .empty-state-title { font-size: 16px; font-weight: 600; color: var(--slate-500); }
    .empty-state-description { font-size: 14px; }

    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner {
      width: 32px; height: 32px; border: 3px solid var(--slate-200);
      border-top-color: var(--primary-orange); border-radius: 50%; animation: spin 0.8s linear infinite;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositoGridComponent {
  rowData = input<DepositoGridRow[]>([]);
  loading = input(false);
  actionEvent = output<GridActionEvent>();
  agregarInsumo = output<number>();

  private expandedIds = signal<Set<number>>(new Set());

  isExpanded(id: number): boolean {
    return this.expandedIds().has(id);
  }

  toggleExpand(id: number): void {
    this.expandedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  onAction(action: GridActionEvent['action'], type: GridActionEvent['type'], data: DepositoGridRow | InsumoGridRow): void {
    this.actionEvent.emit({ action, type, data });
  }

  formatPrice(value: number): string {
    return '$' + value.toLocaleString('es-AR');
  }

  private readonly iconMap: Record<string, { emoji: string; color: string }> = {
    VERDURAS: { emoji: '🥬', color: 'var(--success-bg)' },
    CARNES: { emoji: '🥩', color: 'var(--danger-bg)' },
    LACTEOS: { emoji: '🧀', color: '#DBEAFE' },
    BEBIDAS: { emoji: '🥤', color: '#E0E7FF' },
    SECOS: { emoji: '🌾', color: 'var(--warning-bg)' },
    CONGELADOS: { emoji: '🧊', color: '#CFFAFE' },
    OTROS: { emoji: '📦', color: 'var(--slate-100)' },
  };

  getIconEmoji(tipo: string): string {
    return this.iconMap[tipo]?.emoji ?? '📦';
  }

  getIconColor(tipo: string): string {
    return this.iconMap[tipo]?.color ?? 'var(--slate-100)';
  }
}
