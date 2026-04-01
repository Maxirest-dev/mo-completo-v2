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
      <div class="filter-tabs">
        @for (filtro of filtros; track filtro.value) {
          <button
            class="filter-tab"
            [class.filter-tab--active]="facade.filtroConcepto() === filtro.value"
            (click)="facade.setFiltroConcepto(filtro.value)">
            {{ filtro.label }} ({{ getConteo(filtro.value) }})
          </button>
        }
      </div>
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
            <button class="btn-action" (click)="editarClick.emit(concepto.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            @if (concepto.activo) {
              <button class="btn-action btn-action--danger" (click)="desactivarClick.emit(concepto.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
              </button>
            }
          </div>
        </div>
      } @empty {
        <div class="grid-empty">No hay conceptos de gasto</div>
      }
    </div>
  `,
  styles: [`
    .grid-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      gap: 12px;
    }

    .filter-tabs {
      display: flex;
      gap: 6px;
    }

    .filter-tab {
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-full);
      background: white;
      color: var(--gray-500);
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover:not(.filter-tab--active) {
        background: var(--gray-50);
      }

      &--active {
        background: var(--primary-orange-light);
        color: var(--primary-orange);
        border-color: var(--primary-orange);
      }
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
    .grid-col--acciones { width: 100px; display: flex; gap: 6px; justify-content: flex-end; }

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

    .btn-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      background: white;
      color: var(--gray-500);
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: var(--gray-50);
        border-color: var(--gray-300);
      }

      &--danger:hover {
        background: var(--danger-bg);
        border-color: #FECACA;
        color: #DC2626;
      }
    }

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

  getConteo(filtro: FiltroConcepto): number {
    const conteos = this.facade.conteosConceptos();
    return conteos[filtro];
  }

  onBusqueda(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.facade.setBusquedaConcepto(value);
  }
}
