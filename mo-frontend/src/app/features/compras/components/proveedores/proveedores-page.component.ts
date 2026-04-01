import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasFacade } from '../../state/compras.facade';
import { ProveedoresGridComponent } from './proveedores-grid.component';
import { ProveedorModalComponent } from './proveedor-modal.component';
import { Proveedor, FiltroProveedor, FILTROS_PROVEEDOR } from '../../models/compras.models';

@Component({
  selector: 'app-proveedores-page',
  standalone: true,
  imports: [CommonModule, ProveedoresGridComponent, ProveedorModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-row">
      <div class="filter-tabs">
        @for (filtro of filtros; track filtro.value) {
          <button
            class="filter-tab"
            [class.filter-tab--active]="facade.filtroProveedor() === filtro.value"
            (click)="facade.setFiltroProveedor(filtro.value)">
            {{ filtro.label }} ({{ getConteo(filtro.value) }})
          </button>
        }
      </div>
      <div class="filters-actions">
        <div class="search-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="Buscar proveedores..."
            [value]="facade.busquedaProveedor()"
            (input)="onBusqueda($event)">
        </div>
        <button class="btn btn-primary" (click)="abrirModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nuevo Proveedor
        </button>
      </div>
    </div>

    <app-proveedores-grid
      [data]="facade.proveedoresFiltrados()"
      (editarClick)="onEditar($event)" />

    @if (modalAbierto()) {
      <app-proveedor-modal
        [proveedorEditar]="proveedorEditar()"
        (guardar)="onGuardar($event)"
        (cerrar)="cerrarModal()" />
    }
  `,
  styles: [`
    .filters-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 16px;
    }

    .filter-tabs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-tab {
      padding: 9px 18px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-full);
      background: white;
      color: var(--gray-500);
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;

      &:hover:not(.filter-tab--active) {
        background: var(--gray-50);
        border-color: var(--gray-300);
      }

      &--active {
        background: var(--primary-orange-light);
        color: var(--primary-orange);
        border-color: var(--primary-orange);

        &:hover {
          background: var(--primary-orange-light);
          border-color: var(--primary-orange);
        }
      }
    }

    .filters-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      padding: 0 12px;
      min-width: 220px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;

      &:focus-within {
        border-color: var(--primary-orange);
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
      }

      .search-icon {
        color: var(--gray-400);
        flex-shrink: 0;
      }

      .search-input {
        flex: 1;
        border: none;
        outline: none;
        padding: 10px 10px;
        font-size: 14px;
        font-family: inherit;
        color: var(--gray-700);
        background: transparent;
        min-width: 140px;

        &::placeholder {
          color: var(--gray-400);
        }
      }
    }
  `]
})
export class ProveedoresPageComponent {
  facade = inject(ComprasFacade);

  filtros = FILTROS_PROVEEDOR;
  modalAbierto = signal(false);
  proveedorEditar = signal<number | null>(null);

  getConteo(filtro: FiltroProveedor): number {
    const conteos = this.facade.conteosProveedores();
    return conteos[filtro] || 0;
  }

  onBusqueda(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.facade.setBusquedaProveedor(value);
  }

  abrirModal(): void {
    this.proveedorEditar.set(null);
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.proveedorEditar.set(null);
  }

  onEditar(id: number): void {
    this.proveedorEditar.set(id);
    this.modalAbierto.set(true);
  }

  onGuardar(data: Partial<Proveedor>): void {
    if (this.proveedorEditar()) {
      this.facade.actualizarProveedor(this.proveedorEditar()!, data);
    } else {
      this.facade.crearProveedor(data);
    }
    this.cerrarModal();
  }
}
