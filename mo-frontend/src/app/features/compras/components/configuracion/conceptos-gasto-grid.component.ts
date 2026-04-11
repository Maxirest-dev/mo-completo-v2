import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasFacade } from '../../state/compras.facade';
import { FiltroConcepto, FILTROS_CONCEPTO } from '../../models/compras.models';

@Component({
  selector: 'app-conceptos-gasto-grid',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid-controls">
      <h2 class="grid-title">Conceptos de Gasto</h2>
      <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          class="search-input"
          placeholder="Buscar conceptos..."
          [value]="facade.busquedaConcepto()"
          (input)="onBusqueda($event)">
      </div>
      <button class="btn-nuevo" (click)="nuevoClick.emit()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nuevo Concepto
      </button>
    </div>

    <div class="grid-table">
      <div class="grid-header">
        <div class="grid-col grid-col--nombre">Concepto</div>
        <div class="grid-col grid-col--rubro">Rubro</div>
        <div class="grid-col grid-col--estado">Estado</div>
        <div class="grid-col grid-col--acciones">Acciones</div>
      </div>
      @for (concepto of facade.conceptosFiltrados(); track concepto.id) {
        <div class="grid-row">
          <div class="grid-col grid-col--nombre">{{ concepto.nombre }}</div>
          <div class="grid-col grid-col--rubro">
            <span class="rubro-badge">{{ concepto.rubro }}</span>
          </div>
          <div class="grid-col grid-col--estado">
            <span class="estado-badge" [class.estado-badge--activo]="concepto.activo" [class.estado-badge--inactivo]="!concepto.activo">
              {{ concepto.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          <div class="grid-col grid-col--acciones">
            <button class="btn-edit" (click)="editarClick.emit(concepto.id)">Editar</button>
            @if (concepto.activo) {
              <button class="btn-deactivate" (click)="desactivarClick.emit(concepto.id)">Desactivar</button>
            }
          </div>
        </div>
      } @empty {
        <div class="grid-empty">No hay conceptos de gasto</div>
      }
    </div>
  `,
  styles: [`
    .btn-nuevo {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: white;
      background: var(--primary-orange);
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background 0.15s ease;
      white-space: nowrap;
    }
    .btn-nuevo:hover { background: var(--primary-orange-hover); }

    .grid-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--slate-900);
      margin: 0;
      margin-right: auto;
    }

    .grid-controls {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      gap: 12px;
    }

    .filter-tabs {
      display: flex;
      gap: 22px;
      flex-wrap: wrap;
    }

    .filter-tab {
      padding: 11px 16px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: var(--slate-700);
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      line-height: 1.428;
    }

    .filter-tab:hover {
      border-color: var(--slate-300);
      background: var(--slate-50);
    }

    .filter-tab-active {
      color: var(--primary-orange-dark);
      border-color: var(--primary-orange-lighter);
      background: var(--primary-orange-light);
    }

    .filter-tab-active:hover {
      background: var(--primary-orange-light);
      border-color: var(--primary-orange-lighter);
    }

    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      padding: 0 10px;
      min-width: 200px;

      &:focus-within {
        border-color: var(--primary-orange);
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
      }

      .search-icon { color: var(--gray-400); flex-shrink: 0; }

      .search-input {
        flex: 1;
        border: none;
        outline: none;
        padding: 8px 8px;
        font-size: 13px;
        font-family: inherit;
        color: var(--gray-700);
        background: transparent;

        &::placeholder { color: var(--gray-400); }
      }
    }

    .grid-table {
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: white;
    }

    .grid-header {
      display: flex;
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      padding: 10px 16px;
      font-size: 12px;
      font-weight: 600;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .grid-row {
      display: flex;
      padding: 12px 16px;
      border-bottom: 1px solid var(--gray-100);
      align-items: center;
      font-size: 14px;
      color: var(--gray-700);

      &:last-child { border-bottom: none; }
      &:hover { background: var(--gray-50); }
    }

    .grid-col--nombre { flex: 1; }
    .grid-col--rubro { width: 160px; }
    .grid-col--estado { width: 100px; }
    .grid-col--acciones { width: 200px; display: flex; gap: 8px; justify-content: flex-end; }

    .rubro-badge {
      font-size: 12px;
      padding: 3px 10px;
      border-radius: var(--radius-full);
      background: var(--gray-100);
      color: var(--gray-600);
    }

    .estado-badge {
      font-size: 12px;
      font-weight: 500;
      padding: 3px 10px;
      border-radius: var(--radius-full);

      &--activo {
        background: var(--success-bg);
        color: var(--success-text);
      }

      &--inactivo {
        background: var(--slate-100);
        color: var(--slate-600);
      }
    }

    .btn-edit {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      color: var(--gray-700);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-edit:hover { background: var(--slate-50); border-color: var(--slate-300); }

    .btn-deactivate {
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      color: #DC2626;
      background: #FFFFFF;
      border: 1px solid #FECACA;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-deactivate:hover { background: #FEF2F2; }

    .grid-empty {
      padding: 24px;
      text-align: center;
      color: var(--gray-400);
      font-size: 14px;
    }
  `]
})
export class ConceptosGastoGridComponent {
  facade = inject(ComprasFacade);
  filtros = FILTROS_CONCEPTO;

  editarClick = output<number>();
  desactivarClick = output<number>();
  nuevoClick = output<void>();

  getConteo(filtro: FiltroConcepto): number {
    const conteos = this.facade.conteosConceptos();
    return conteos[filtro];
  }

  onBusqueda(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.facade.setBusquedaConcepto(value);
  }
}
