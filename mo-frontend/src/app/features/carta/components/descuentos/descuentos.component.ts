import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ToastContainerComponent, NotificationService } from '@mro/shared-ui';
import { DescuentoDialogComponent } from './descuento-dialog.component';
import { MOCK_DESCUENTOS } from '../../data/mock-descuentos.data';
import {
  Descuento,
  EstadoDescuento,
  DescuentoFiltroTipo,
  DescuentoFilterContadores,
  DescuentoFormData,
} from '../../models/descuento.model';

@Component({
  selector: 'app-descuentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastContainerComponent, DescuentoDialogComponent],
  template: `
    <div class="descuentos-container">
      <!-- Header -->
      <header class="page-header">
        <button class="back-btn" (click)="onBack()" title="Volver">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div class="header-info">
          <div class="header-title-row">
            <h1 class="page-title">Descuentos</h1>
            <svg class="title-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
          </div>
          <p class="page-subtitle">Gestiona los precios de tus productos en todas las listas</p>
        </div>
      </header>

      <!-- Toolbar -->
      <div class="filter-toolbar">
        <div class="filter-tabs">
          @for (tab of tabs; track tab.id) {
            <button
              type="button"
              class="filter-tab"
              [class.filter-tab-active]="filtroActivo() === tab.id"
              (click)="onFiltroClick(tab.id)"
            >
              {{ tab.label }} ({{ getCount(tab.countKey) }})
            </button>
          }
        </div>

        <div class="toolbar-right">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar..."
              class="search-input"
              [ngModel]="busquedaInterna()"
              (ngModelChange)="onBusquedaInput($event)"
            />
            @if (busquedaInterna()) {
              <button type="button" class="search-clear" (click)="clearSearch()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
              </button>
            }
          </div>

          <button type="button" class="btn-nueva" (click)="onNuevoDescuento()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            Nueva descuento
          </button>
        </div>
      </div>

      <!-- Table Card -->
      <div class="card">
        <div class="grid-container">
          <table class="master-table">
            <thead>
              <tr>
                <th class="col-nombre">NOMBRE</th>
                <th class="col-descuento">DESCUENTO</th>
                <th class="col-estado">ESTADO</th>
                <th class="col-acciones">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              @for (desc of filteredDescuentos(); track desc.id) {
                <tr class="master-row">
                  <td class="col-nombre">{{ desc.nombre }}</td>
                  <td class="col-descuento">{{ formatDescuento(desc) }}</td>
                  <td class="col-estado">
                    <span class="badge" [class]="desc.estado === 'ACTIVA' ? 'badge-activa' : 'badge-onhold'">
                      {{ desc.estado === 'ACTIVA' ? 'Activa' : 'On Hold' }}
                    </span>
                  </td>
                  <td class="col-acciones" (click)="$event.stopPropagation()">
                    <div class="acciones-cell">
                      <button class="btn-edit" (click)="onEditar(desc)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Editar
                      </button>
                      @if (desc.estado === 'ACTIVA') {
                        <button class="btn-deactivate" (click)="onToggleEstado(desc)">Desactivar</button>
                      } @else {
                        <button class="btn-activate" (click)="onToggleEstado(desc)">Activar</button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="empty-state-row">
                    <div class="empty-state">
                      <span class="empty-state-title">Sin descuentos</span>
                      <span class="empty-state-description">No se encontraron descuentos con los filtros seleccionados</span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Dialog -->
    @if (showDialog()) {
      <app-descuento-dialog
        [descuento]="descuentoToEdit()"
        (guardar)="onGuardarDescuento($event)"
        (cancelar)="onCancelarDialog()"
      />
    }

    <app-toast-container />
  `,
  styles: [`
    .descuentos-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* ---- Header ---- */
    .page-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 32px;
    }

    .back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--slate-200);
      background: white;
      color: var(--slate-700);
      cursor: pointer;
      transition: background 0.15s;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .back-btn:hover { background: var(--slate-50); border-color: var(--slate-300); }

    .header-info { flex: 1; }

    .header-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .page-title {
      font-size: 26px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
      letter-spacing: -0.01em;
    }

    .title-icon { flex-shrink: 0; }

    .page-subtitle {
      font-size: 14px;
      color: var(--gray-500);
      margin: 6px 0 0 0;
    }

    /* ---- Toolbar ---- */
    .filter-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 20px;
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
      color: var(--slate-500);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .filter-tab:hover {
      border-color: var(--slate-300);
      background: var(--slate-50);
    }
    .filter-tab-active {
      color: var(--primary-orange);
      border-color: var(--primary-orange);
      background: #FFF7ED;
    }
    .filter-tab-active:hover {
      background: #FFF7ED;
      border-color: var(--primary-orange);
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* Search */
    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      padding: 0 12px;
      min-width: 220px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .search-box:focus-within {
      border-color: var(--primary-orange);
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }
    .search-icon {
      width: 18px;
      height: 18px;
      color: var(--slate-400);
      flex-shrink: 0;
    }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 10px 10px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-primary);
      background: transparent;
      min-width: 140px;
    }
    .search-input::placeholder { color: var(--slate-400); }
    .search-clear {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
      background: var(--slate-100);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      color: var(--slate-500);
      transition: all 0.15s ease;
    }
    .search-clear:hover { background: var(--slate-200); color: var(--text-primary); }
    .search-clear svg { width: 12px; height: 12px; }

    /* Nueva descuento button */
    .btn-nueva {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: white;
      background: var(--primary-orange);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      box-shadow: 0 1px 2px rgba(249, 115, 22, 0.2);
    }
    .btn-nueva:hover { background: var(--primary-orange-hover); }
    .btn-nueva:active { background: #C2410C; }
    .btn-nueva svg { width: 18px; height: 18px; }

    /* ---- Card ---- */
    .card {
      overflow: hidden;
      background: white;
      border-radius: 12px;
      border: 1px solid var(--gray-200);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .grid-container {
      position: relative;
      width: 100%;
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
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      border-bottom: 1px solid var(--slate-200);
      background: white;
    }

    .col-chevron { width: 48px; }
    .col-codigo { width: 10%; }
    .col-nombre { width: 25%; }
    .col-descuento { width: 14%; }
    .col-estado { width: 14%; }
    .col-grupo { width: 15%; }
    .col-acciones { width: 18%; text-align: right !important; }

    /* ---- Master row ---- */
    .master-row {
      cursor: pointer;
      transition: background 0.15s;
    }
    .master-row:hover { background: #FAFAFA; }
    .master-row.expanded { background: #FAFAFA; }

    .master-row td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--slate-100);
      vertical-align: middle;
      font-size: 14px;
      color: var(--gray-700);
    }

    /* Chevron */
    .chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--slate-400);
      transition: transform 0.2s ease;
    }
    .chevron-open { transform: rotate(90deg); }

    /* Badge */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      font-size: 13px;
      font-weight: 500;
      border-radius: var(--radius-md);
      white-space: nowrap;
    }
    .badge::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .badge-activa { background: var(--success-bg); color: var(--success-text); }
    .badge-activa::before { background: var(--success-color); }
    .badge-onhold { background: var(--slate-100); color: var(--slate-600); }
    .badge-onhold::before { background: var(--slate-500); }

    /* Acciones */
    .acciones-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
    }

    .btn-deactivate, .btn-activate {
      padding: 6px 14px;
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
    .btn-deactivate:hover, .btn-activate:hover { background: var(--slate-50); border-color: var(--slate-300); }

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

    /* ---- Detail row ---- */
    .detail-row td {
      padding: 0;
      border-bottom: 1px solid var(--slate-100);
    }

    .detail-wrapper {
      padding: 0 16px 16px 16px;
      background: #FAFAFA;
    }

    .detail-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      overflow: hidden;
    }

    .detail-table thead th {
      padding: 10px 16px;
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      background: var(--slate-100);
      border-bottom: 1px solid var(--slate-200);
    }

    .producto-row td {
      padding: 12px 16px;
      font-size: 14px;
      color: var(--gray-700);
      border-bottom: 1px solid var(--slate-100);
    }
    .producto-row:last-child td { border-bottom: none; }

    .precio-descuento {
      color: var(--success-color);
      font-weight: 600;
    }

    .empty-productos {
      padding: 24px 16px;
      text-align: center;
      color: var(--slate-400);
      font-size: 13px;
    }

    .empty-state-row {
      padding: 48px 24px !important;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-state-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-700);
    }

    .empty-state-description {
      font-size: 14px;
      color: var(--slate-400);
    }

    /* ---- Responsive ---- */
    @media (max-width: 1024px) {
      .filter-toolbar {
        flex-direction: column;
        align-items: stretch;
      }
    }

    @media (max-width: 768px) {
      .page-title { font-size: 22px; }
      .filter-tabs { overflow-x: auto; padding-bottom: 4px; }
      .toolbar-right { justify-content: space-between; }
      .search-box { flex: 1; min-width: 0; }
    }

    @media (max-width: 480px) {
      .toolbar-right { flex-direction: column; align-items: stretch; }
      .search-box { width: 100%; }
      .btn-nueva { width: 100%; justify-content: center; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescuentosComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  // State
  descuentos = signal<Descuento[]>([...MOCK_DESCUENTOS]);
  filtroActivo = signal<DescuentoFiltroTipo>('todas');
  searchTerm = signal('');
  busquedaInterna = signal('');
  private expandedRows = signal<Set<number>>(new Set());

  // Dialog state
  showDialog = signal(false);
  descuentoToEdit = signal<Descuento | null>(null);

  // Debounce
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // ID counter for new descuentos
  private nextId = MOCK_DESCUENTOS.length + 1;

  // Tabs config
  readonly tabs: { id: DescuentoFiltroTipo; label: string; countKey: keyof DescuentoFilterContadores }[] = [
    { id: 'todas', label: 'Todas', countKey: 'todas' },
    { id: 'activas', label: 'Activos', countKey: 'activas' },
    { id: 'onHold', label: 'Inactivos', countKey: 'onHold' },
  ];

  // Computed
  contadores = computed<DescuentoFilterContadores>(() => {
    const all = this.descuentos();
    return {
      todas: all.length,
      activas: all.filter(d => d.estado === 'ACTIVA').length,
      onHold: all.filter(d => d.estado === 'ON_HOLD').length,
    };
  });

  filteredDescuentos = computed<Descuento[]>(() => {
    const filter = this.filtroActivo();
    const search = this.searchTerm().toLowerCase().trim();
    let filtered = [...this.descuentos()];

    switch (filter) {
      case 'activas':
        filtered = filtered.filter(d => d.estado === 'ACTIVA');
        break;
      case 'onHold':
        filtered = filtered.filter(d => d.estado === 'ON_HOLD');
        break;
    }

    if (search) {
      filtered = filtered.filter(d =>
        d.nombre.toLowerCase().includes(search) ||
        d.grupo.toLowerCase().includes(search) ||
        d.codigo.toString().includes(search)
      );
    }

    return filtered;
  });

  constructor() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(value => this.searchTerm.set(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCount(key: keyof DescuentoFilterContadores): number {
    return this.contadores()[key];
  }

  onFiltroClick(filtro: DescuentoFiltroTipo): void {
    if (filtro !== this.filtroActivo()) {
      this.filtroActivo.set(filtro);
    }
  }

  onBusquedaInput(value: string): void {
    this.busquedaInterna.set(value);
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.busquedaInterna.set('');
    this.searchSubject.next('');
  }

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

  onToggleEstado(desc: Descuento): void {
    const newEstado: EstadoDescuento = desc.estado === 'ACTIVA' ? 'ON_HOLD' : 'ACTIVA';
    this.descuentos.update(list =>
      list.map(d => d.id === desc.id ? { ...d, estado: newEstado } : d)
    );
    const label = newEstado === 'ON_HOLD' ? 'desactivado' : 'activado';
    this.notificationService.success(`Descuento "${desc.nombre}" ${label} correctamente`);
  }

  onEditar(desc: Descuento): void {
    this.descuentoToEdit.set(desc);
    this.showDialog.set(true);
  }

  onNuevoDescuento(): void {
    this.descuentoToEdit.set(null);
    this.showDialog.set(true);
  }

  onGuardarDescuento(formData: DescuentoFormData): void {
    const editing = this.descuentoToEdit();

    if (editing) {
      // Update existing
      this.descuentos.update(list =>
        list.map(d => {
          if (d.id !== editing.id) return d;
          const updated = { ...d, nombre: formData.nombre, tipoDescuento: formData.tipoDescuento, cantidad: formData.cantidad };
          // Recalculate product prices
          updated.productos = d.productos.map(p => ({
            ...p,
            precioConDescuento: formData.tipoDescuento === 'porcentaje'
              ? Math.round(p.precioOriginal * (1 - formData.cantidad / 100))
              : Math.max(0, p.precioOriginal - formData.cantidad),
          }));
          return updated;
        })
      );
      this.notificationService.success(`Descuento "${formData.nombre}" actualizado correctamente`);
    } else {
      // Create new
      const newDesc: Descuento = {
        id: this.nextId,
        codigo: this.nextId,
        nombre: formData.nombre,
        tipoDescuento: formData.tipoDescuento,
        cantidad: formData.cantidad,
        estado: 'ACTIVA',
        grupo: '-',
        productos: [],
      };
      this.nextId++;
      this.descuentos.update(list => [...list, newDesc]);
      this.notificationService.success(`Descuento "${formData.nombre}" creado correctamente`);
    }

    this.showDialog.set(false);
    this.descuentoToEdit.set(null);
  }

  onCancelarDialog(): void {
    this.showDialog.set(false);
    this.descuentoToEdit.set(null);
  }

  onBack(): void {
    this.router.navigate(['/carta']);
  }

  formatDescuento(desc: Descuento): string {
    return desc.tipoDescuento === 'porcentaje'
      ? `%${desc.cantidad}`
      : `$${desc.cantidad.toLocaleString('es-AR')}`;
  }

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-AR');
  }
}
