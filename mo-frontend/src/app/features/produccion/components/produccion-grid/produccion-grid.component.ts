import {
  Component, ChangeDetectionStrategy, signal, input, output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstacionProduccionRow, ProduccionGridRow, GridActionEvent, EstacionTipo } from '../../models/produccion-grid.model';

@Component({
  selector: 'app-produccion-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid-container">
      @if (loading()) {
        <div class="loading-overlay">
          <div class="spinner"></div>
          <span>Cargando produccion...</span>
        </div>
      }

      <table class="master-table">
        <thead>
          <tr>
            <th class="col-nombre">ESTACION DE TRABAJO</th>
            <th class="col-tipo">TIPO</th>
            <th class="col-items">ITEMS</th>
            <th class="col-acciones">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          @for (dep of rowData(); track dep.id) {
            <tr class="master-row" [class.expanded]="isExpanded(dep.id)" (click)="toggleExpand(dep.id)">
              <td class="col-nombre">
                <div class="nombre-cell">
                  <span class="chevron" [class.chevron-open]="isExpanded(dep.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/>
                    </svg>
                  </span>
                  <span class="dep-icon" [style.background]="getIconColor(dep.tipo)">{{ getIconEmoji(dep.tipo) }}</span>
                  <span class="dep-name">{{ dep.nombre }}</span>
                </div>
              </td>
              <td class="col-tipo">
                <span class="badge-tipo" [class]="'tipo-' + dep.tipo.toLowerCase()">{{ dep.tipo }}</span>
              </td>
              <td class="col-items">
                <div class="items-count">
                  <span class="count-number">{{ dep.itemsCount }}</span>
                  <span class="count-label">items</span>
                </div>
              </td>
              <td class="col-acciones" (click)="$event.stopPropagation()">
                <div class="master-acciones">
                  <button class="btn-nuevo-item" (click)="agregarItem.emit(dep.id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    Nuevo item
                  </button>
                  <button class="btn-edit" (click)="editarEstacion.emit(dep.id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar
                  </button>
                  <button class="btn-cocinar-todos" (click)="cocinarTodos.emit(dep.id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"/>
                    </svg>
                    Cocinar todos
                  </button>
                </div>
              </td>
            </tr>

            @if (isExpanded(dep.id)) {
              <tr class="detail-row">
                <td colspan="4">
                  <div class="detail-wrapper">
                    <table class="detail-table">
                      <thead>
                        <tr>
                          <th>NOMBRE</th>
                          <th>ESTADO</th>
                          <th>STOCK PROD.</th>
                          <th>STOCK INV.</th>
                          <th>VENCIMIENTO</th>
                          <th>ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (item of dep.items; track item.id) {
                          <tr class="item-row">
                            <td>
                              <div class="item-name-cell">
                                <span class="item-name">{{ item.nombre }}</span>
                                @if (item.tipoTransformacion) {
                                  <span class="item-formula">{{ item.origenCantidad }} {{ item.unidadMedidaOrigen }} {{ item.insumoOrigenNombre }} → {{ item.tipoTransformacion }}</span>
                                }
                              </div>
                            </td>
                            <td>
                              <span class="badge-estado" [class]="getEstadoClass(item)">
                                {{ getEstadoLabel(item) }}
                              </span>
                            </td>
                            <td>
                              <span class="stock-prod" [class.stock-zero]="item.stockProduccion === 0">
                                {{ item.stockProduccion }} {{ item.unidadMedida }}
                              </span>
                            </td>
                            <td>
                              <span class="stock-inv">{{ item.stockInventario }} {{ item.unidadMedidaOrigen }}</span>
                            </td>
                            <td>
                              <span class="vencimiento" [class]="getVencimientoClass(item)">{{ getVencimiento(item) }}</span>
                            </td>
                            <td>
                              <div class="acciones-cell">
                                <button class="btn-edit-item" (click)="editarItem.emit(item); $event.stopPropagation()">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                  Editar
                                </button>
                                <button class="btn-cocinar" (click)="onCocinar(item); $event.stopPropagation()">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"/>
                                  </svg>
                                  Cocinar
                                </button>
                              </div>
                            </td>
                          </tr>
                        } @empty {
                          <tr><td colspan="6" class="empty-items">Sin items en este deposito</td></tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            }
          } @empty {
            <tr>
              <td colspan="4" class="empty-state-row">
                <div class="empty-state">
                  <span class="empty-state-title">Sin items de produccion</span>
                  <span class="empty-state-description">No se encontraron items con los filtros seleccionados</span>
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

    .master-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    .master-table thead th {
      padding: 14px 16px; font-size: 12px; font-weight: 600; color: var(--slate-500);
      text-transform: uppercase; letter-spacing: 0.05em; text-align: left;
      border-bottom: 1px solid var(--slate-200); background: white;
    }
    .col-nombre { width: 40%; }
    .col-tipo { width: 15%; }
    .col-items { width: 15%; }
    .col-acciones { width: 30%; text-align: right !important; }

    .master-row { cursor: pointer; transition: background 0.15s; }
    .master-row:hover { background: #FAFAFA; }
    .master-row.expanded { background: #FAFAFA; }
    .master-row td {
      padding: 12px 16px; border-bottom: 1px solid var(--slate-100);
      vertical-align: middle; font-size: 14px; color: var(--gray-700);
    }

    .chevron { display: inline-flex; align-items: center; color: var(--slate-400); transition: transform 0.2s; flex-shrink: 0; }
    .chevron-open { transform: rotate(90deg); }
    .nombre-cell { display: flex; align-items: center; gap: 12px; }
    .dep-icon {
      width: 40px; height: 40px; border-radius: 10px; display: flex;
      align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;
    }
    .dep-name { font-weight: 600; color: var(--text-heading); }

    .badge-tipo { display: inline-block; padding: 3px 10px; font-size: 12px; font-weight: 500; border-radius: 6px; }
    .tipo-cocina { background: var(--danger-bg); color: var(--danger-text); }
    .tipo-parrilla { background: var(--warning-bg); color: #92400E; }
    .tipo-mostrador { background: var(--success-bg); color: var(--success-text); }
    .tipo-barra { background: #DBEAFE; color: #1E40AF; }

    .items-count { display: flex; flex-direction: column; }
    .count-number { font-weight: 600; font-size: 14px; color: var(--primary-orange); }
    .count-label { font-size: 12px; color: var(--slate-400); }

    .master-acciones { display: flex; justify-content: flex-end; gap: 8px; }
    .btn-nuevo-item {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; font-size: 13px; font-weight: 500;
      color: #FF8800; background: #FFFFFF; border: 1px solid #FF8800;
      border-radius: 6px; cursor: pointer; transition: all 0.15s; white-space: nowrap;
    }
    .btn-cocinar-todos {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; font-size: 13px; font-weight: 500;
      color: white; background: var(--text-heading); border: none;
      border-radius: 6px; cursor: pointer; transition: all 0.15s; white-space: nowrap;
    }
    .btn-cocinar-todos:hover { background: var(--text-primary); }
    .btn-nuevo-item:hover { background: #FFF7ED; }
    .btn-edit {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; font-size: 13px; font-weight: 500;
      color: var(--gray-700); background: white; border: 1px solid var(--slate-200);
      border-radius: 6px; cursor: pointer; transition: all 0.15s;
    }
    .btn-edit:hover { background: var(--gray-50); border-color: var(--gray-300); }
    .btn-edit svg { width: 16px; height: 16px; }

    /* Detail */
    .detail-row td { padding: 0; border-bottom: 1px solid var(--slate-100); }
    .detail-wrapper { padding: 0 16px 16px 16px; background: #FAFAFA; }
    .detail-table {
      width: 100%; border-collapse: collapse; background: white;
      border: 1px solid var(--slate-200); border-radius: 8px; overflow: hidden;
    }
    .detail-table thead th {
      padding: 10px 16px; font-size: 11px; font-weight: 600; color: var(--slate-500);
      text-transform: uppercase; letter-spacing: 0.05em; text-align: left;
      background: var(--slate-100); border-bottom: 1px solid var(--slate-200);
    }
    .detail-table thead th:last-child { text-align: right; }
    .item-row td {
      padding: 12px 16px; font-size: 14px; color: var(--gray-700);
      border-bottom: 1px solid var(--slate-100);
    }
    .item-row:last-child td { border-bottom: none; }

    .item-name-cell { display: flex; flex-direction: column; gap: 2px; }
    .item-name { font-weight: 500; color: var(--text-heading); }
    .item-formula { font-size: 12px; color: var(--slate-400); }

    .badge-item-tipo { display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: 500; border-radius: 4px; }
    .item-tipo-transformacion { background: #DBEAFE; color: #1E40AF; }
    .item-tipo-elaborado { background: var(--warning-bg); color: #92400E; }

    .badge-estado { display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: 500; border-radius: 4px; }
    .estado-disponible { background: var(--success-bg); color: var(--success-text); }
    .estado-sin-stock { background: var(--danger-bg); color: var(--danger-text); }
    .estado-bajo { background: var(--warning-bg); color: #92400E; }

    .stock-prod { font-weight: 700; color: #059669; }
    .stock-zero { color: #DC2626; }
    .stock-inv { color: var(--slate-500); }

    .vencimiento { font-size: 13px; }
    .venc-ok { color: #059669; }
    .venc-pronto { color: var(--warning-color); }
    .venc-vencido { color: #DC2626; }

    .acciones-cell { display: flex; justify-content: flex-end; gap: 8px; }
    .btn-edit-item {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; font-size: 13px; font-weight: 500;
      color: var(--gray-700); background: white; border: 1px solid var(--slate-200);
      border-radius: 6px; cursor: pointer; transition: all 0.15s;
    }
    .btn-edit-item:hover { background: var(--gray-50); border-color: var(--gray-300); }
    .btn-cocinar {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; font-size: 13px; font-weight: 500;
      color: #FF8800; background: #FFFFFF; border: 1px solid #FF8800;
      border-radius: 6px; cursor: pointer; transition: all 0.15s; white-space: nowrap;
    }
    .btn-cocinar:hover { background: #FFF7ED; }

    .empty-items { padding: 24px 16px; text-align: center; color: var(--slate-400); font-size: 13px; }
    .empty-state-row td { padding: 0; }
    .empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 48px 16px; color: var(--slate-400); }
    .empty-state-title { font-size: 16px; font-weight: 600; color: var(--slate-500); }
    .empty-state-description { font-size: 14px; }

    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--slate-200); border-top-color: var(--primary-orange); border-radius: 50%; animation: spin 0.8s linear infinite; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProduccionGridComponent {
  rowData = input<EstacionProduccionRow[]>([]);
  loading = input(false);
  actionEvent = output<GridActionEvent>();
  agregarItem = output<number>();
  editarEstacion = output<number>();
  cocinarTodos = output<number>();
  editarItem = output<ProduccionGridRow>();

  private expandedIds = signal<Set<number>>(new Set());

  isExpanded(id: number): boolean { return this.expandedIds().has(id); }

  toggleExpand(id: number): void {
    this.expandedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  onCocinar(item: ProduccionGridRow): void {
    this.actionEvent.emit({ action: 'cocinar', data: item });
  }

  private readonly iconMap: Record<string, { emoji: string; color: string }> = {
    COCINA: { emoji: '🔥', color: 'var(--danger-bg)' },
    PARRILLA: { emoji: '🥩', color: 'var(--warning-bg)' },
    MOSTRADOR: { emoji: '🏪', color: 'var(--success-bg)' },
    BARRA: { emoji: '🍸', color: '#DBEAFE' },
  };

  getIconEmoji(tipo: string): string { return this.iconMap[tipo]?.emoji ?? '📦'; }
  getIconColor(tipo: string): string { return this.iconMap[tipo]?.color ?? 'var(--slate-100)'; }

  getEstadoLabel(item: ProduccionGridRow): string {
    if (item.stockProduccion === 0) return 'Sin stock';
    if (item.stockProduccion <= 5) return 'Bajo';
    return 'Disponible';
  }

  getEstadoClass(item: ProduccionGridRow): string {
    if (item.stockProduccion === 0) return 'estado-sin-stock';
    if (item.stockProduccion <= 5) return 'estado-bajo';
    return 'estado-disponible';
  }

  getVencimiento(item: ProduccionGridRow): string {
    if (!item.vencimiento) return '-';
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const venc = new Date(item.vencimiento + 'T00:00:00');
    const diff = Math.ceil((venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Vencido';
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Manana';
    return `${diff} dias`;
  }

  getVencimientoClass(item: ProduccionGridRow): string {
    if (!item.vencimiento) return '';
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const venc = new Date(item.vencimiento + 'T00:00:00');
    const diff = Math.ceil((venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return 'venc-vencido';
    if (diff <= 2) return 'venc-pronto';
    return 'venc-ok';
  }
}
