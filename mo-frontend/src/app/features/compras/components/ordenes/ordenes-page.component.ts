import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasFacade } from '../../state/compras.facade';
import { OrdenesGridComponent } from './ordenes-grid.component';
import { ProyeccionPagosComponent } from './proyeccion-pagos.component';
import { OrdenModalComponent } from './orden-modal.component';
import { ProveedoresPageComponent } from '../proveedores/proveedores-page.component';
import { ConfiguracionPageComponent } from '../configuracion/configuracion-page.component';
import { EstadoOrden, FILTROS_ESTADO } from '../../models/compras.models';

@Component({
  selector: 'app-ordenes-page',
  standalone: true,
  imports: [
    CommonModule,
    OrdenesGridComponent,
    ProyeccionPagosComponent,
    OrdenModalComponent,
    ProveedoresPageComponent,
    ConfiguracionPageComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1>Gestión de Compras</h1>
        <p class="page-subtitle">Análisis detallado del rendimiento</p>
      </div>
      <div class="page-header-right">
        <div class="toggle-group">
          <button
            class="toggle-btn"
            [class.toggle-btn--active]="facade.vistaActiva() === 'ordenes'"
            (click)="facade.setVistaActiva('ordenes')">
            Ordenes
          </button>
          <button
            class="toggle-btn"
            [class.toggle-btn--active]="facade.vistaActiva() === 'proveedores'"
            (click)="facade.setVistaActiva('proveedores')">
            Proveedores
          </button>
          <button
            class="toggle-btn"
            [class.toggle-btn--active]="facade.vistaActiva() === 'configuracion'"
            (click)="facade.setVistaActiva('configuracion')">
            Configuración
          </button>
        </div>
      </div>
    </div>

    @if (facade.vistaActiva() === 'ordenes') {
      <!-- Filtros -->
      <div class="filters-row">
        <div class="filter-tabs">
          @for (filtro of filtros; track filtro.value) {
            <button
              class="filter-tab"
              [class.filter-tab-active]="facade.filtroEstado() === filtro.value"
              (click)="facade.setFiltroEstado(filtro.value)">
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
              placeholder="Buscar ordenes..."
              [value]="facade.busqueda()"
              (input)="onBusqueda($event)">
          </div>
          <button class="btn btn-primary" (click)="abrirModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nueva Orden
          </button>
        </div>
      </div>

      <!-- Proyeccion -->
      <app-proyeccion-pagos [data]="facade.proyeccion()" />

      <!-- Grid -->
      <app-ordenes-grid
        [data]="facade.ordenesFiltradas()"
        (verOrdenClick)="onVerOrden($event)"
        (cambiarEstadoClick)="onCambiarEstado($event)" />

      <!-- Modal -->
      @if (modalAbierto()) {
        <app-orden-modal
          [ordenEditar]="ordenEditar()"
          (guardar)="onGuardarOrden($event)"
          (cerrar)="cerrarModal()" />
      }
    } @else if (facade.vistaActiva() === 'proveedores') {
      <app-proveedores-page />
    } @else if (facade.vistaActiva() === 'configuracion') {
      <app-configuracion-page />
    }
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
      gap: 24px;

      h1 {
        font-size: 26px;
        font-weight: 600;
        color: var(--gray-900);
        margin: 0 0 6px 0;
        letter-spacing: -0.01em;
      }

      .page-subtitle {
        font-size: 14px;
        color: var(--gray-500);
        margin: 0;
      }
    }

    .toggle-group {
      display: flex;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .toggle-btn {
      padding: 8px 20px;
      font-size: 13px;
      font-weight: 500;
      border: none;
      background: white;
      color: var(--gray-600);
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover:not(.toggle-btn--active) {
        background: var(--gray-50);
      }

      &--active {
        background: var(--gray-900);
        color: white;
      }
    }

    .filters-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 16px;
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
export class OrdenesPageComponent implements OnInit {
  facade = inject(ComprasFacade);

  filtros = FILTROS_ESTADO;
  modalAbierto = signal(false);
  ordenEditar = signal<number | null>(null);

  ngOnInit(): void {
    this.facade.cargarDatos();
  }

  getConteo(filtro: EstadoOrden | 'todas'): number {
    const conteos = this.facade.conteosPorEstado();
    const map: Record<string, keyof typeof conteos> = {
      'todas': 'todas',
      'Pendiente': 'pendientes',
      'Pedida': 'pedidas',
      'Recibida': 'recibidas',
      'Facturada': 'facturadas',
      'Pagada': 'pagadas'
    };
    return conteos[map[filtro]] || 0;
  }

  onBusqueda(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.facade.setBusqueda(value);
  }

  abrirModal(): void {
    this.ordenEditar.set(null);
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.ordenEditar.set(null);
  }

  onVerOrden(id: number): void {
    this.ordenEditar.set(id);
    this.modalAbierto.set(true);
  }

  onCambiarEstado(event: { id: number; estado: EstadoOrden }): void {
    this.facade.cambiarEstadoOrden(event.id, event.estado);
  }

  onGuardarOrden(orden: any): void {
    if (this.ordenEditar()) {
      this.facade.actualizarOrden(this.ordenEditar()!, orden);
    } else {
      this.facade.crearOrden(orden);
    }
    this.cerrarModal();
  }
}
