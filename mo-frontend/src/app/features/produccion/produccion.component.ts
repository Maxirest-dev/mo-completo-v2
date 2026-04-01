import { Component, ChangeDetectionStrategy, signal, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduccionGridComponent } from './components/produccion-grid/produccion-grid.component';
import { FilterToolbarComponent } from './components/filter-toolbar/filter-toolbar.component';
import { CocinarDialogComponent } from './components/cocinar-dialog/cocinar-dialog.component';
import { EstacionDialogComponent, EstacionCreateData } from './components/estacion-dialog/estacion-dialog.component';
import { ItemDialogComponent, ItemFormData } from './components/item-dialog/item-dialog.component';
import { ToastContainerComponent, NotificationService } from '@mro/shared-ui';
import {
  EstacionProduccionRow,
  ProduccionGridRow,
  GridActionEvent,
  ProduccionFilterType,
  ProduccionFilterContadores,
} from './models/produccion-grid.model';
import { CocinarRequest } from './models/produccion.model';
import { MOCK_PRODUCCION } from './data/mock-produccion.data';

@Component({
  selector: 'app-produccion',
  standalone: true,
  imports: [
    CommonModule,
    ProduccionGridComponent,
    FilterToolbarComponent,
    CocinarDialogComponent,
    EstacionDialogComponent,
    ItemDialogComponent,
    ToastContainerComponent,
  ],
  template: `
    <div class="produccion-container">
      <!-- Page Header -->
      <header class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Produccion</h1>
          <p class="page-subtitle">Control de produccion y transformaciones de cocina</p>
        </div>

        <div class="page-header-actions">
          <button class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Importar / Exportar
          </button>
        </div>
      </header>

      <!-- Toolbar -->
      <app-filter-toolbar
        [contadores]="filterContadores()"
        [filtroActivo]="filtroActivo()"
        [busqueda]="searchTerm()"
        (filtroChange)="onFiltroChange($event)"
        (busquedaChange)="onBusquedaChange($event)"
        (nuevaEstacion)="onNuevaEstacion()"
      />

      <!-- Grid Content -->
      <main class="produccion-content">
        <div class="card">
          <app-produccion-grid
            [rowData]="filteredEstaciones()"
            [loading]="loading()"
            (actionEvent)="onGridAction($event)"
            (agregarItem)="onAgregarItem($event)"
            (editarEstacion)="onEditarEstacion($event)"
            (cocinarTodos)="onCocinarTodos($event)"
            (editarItem)="onEditarItem($event)"
          />
        </div>
      </main>
    </div>

    <!-- Cocinar Dialog -->
    @if (showCocinarDialog() && itemToCocinar()) {
      <app-cocinar-dialog
        [item]="itemToCocinar()!"
        (confirmar)="onConfirmCocinar($event)"
        (cancelar)="showCocinarDialog.set(false)"
      />
    }

    <!-- Estacion Dialog -->
    @if (showEstacionDialog()) {
      <app-estacion-dialog
        [estacion]="estacionToEdit()"
        (guardar)="onGuardarEstacion($event)"
        (cancelar)="closeEstacionDialog()"
      />
    }

    <!-- Item Dialog -->
    @if (showItemDialog()) {
      <app-item-dialog
        [item]="itemToEdit()"
        [estaciones]="estaciones()"
        [preselectedEstacionId]="preselectedEstacionId()"
        (guardar)="onGuardarItem($event)"
        (cancelar)="closeItemDialog()"
      />
    }

    <!-- Toast Notifications -->
    <app-toast-container />
  `,
  styles: [`
    .produccion-container { max-width: 1400px; margin: 0 auto; }

    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 24px; gap: 24px;
    }
    .page-title {
      font-size: 26px; font-weight: 600; color: var(--gray-900);
      margin: 0 0 6px; letter-spacing: -0.01em;
    }
    .page-subtitle { font-size: 14px; color: var(--gray-500); margin: 0; }

    .page-header-actions { display: flex; gap: 10px; flex-wrap: wrap; }
    .btn-secondary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; font-size: 14px; font-weight: 500; font-family: inherit;
      color: var(--gray-700); background: white; border: 1px solid var(--slate-200);
      border-radius: 10px; cursor: pointer; transition: all 0.15s; white-space: nowrap;
    }
    .btn-secondary:hover { background: var(--slate-50); border-color: var(--slate-300); }
    .btn-secondary svg { width: 18px; height: 18px; }

    .produccion-content { margin-top: 20px; }

    .card {
      overflow: hidden; background: white; border-radius: 12px;
      border: 1px solid var(--gray-200); box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProduccionComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);

  loading = signal(false);
  estaciones = signal<EstacionProduccionRow[]>([]);
  searchTerm = signal('');
  filtroActivo = signal<ProduccionFilterType>('todos');

  showCocinarDialog = signal(false);
  itemToCocinar = signal<ProduccionGridRow | undefined>(undefined);
  showEstacionDialog = signal(false);
  estacionToEdit = signal<any>(undefined);
  showItemDialog = signal(false);
  itemToEdit = signal<ProduccionGridRow | undefined>(undefined);
  preselectedEstacionId = signal<number | undefined>(undefined);

  filterContadores = computed<ProduccionFilterContadores>(() => {
    const allItems = this.estaciones().flatMap(d => d.items);
    return {
      todos: allItems.length,
      conStock: allItems.filter(i => i.stockProduccion > 0).length,
      sinStock: allItems.filter(i => i.stockProduccion === 0).length,
    };
  });

  filteredEstaciones = computed<EstacionProduccionRow[]>(() => {
    const filter = this.filtroActivo();
    const search = this.searchTerm().toLowerCase().trim();

    return this.estaciones()
      .map(dep => {
        let items = [...dep.items];

        if (filter === 'conStock') items = items.filter(i => i.stockProduccion > 0);
        if (filter === 'sinStock') items = items.filter(i => i.stockProduccion === 0);

        if (search) {
          items = items.filter(i =>
            i.nombre.toLowerCase().includes(search) ||
            i.insumoOrigenNombre.toLowerCase().includes(search) ||
            i.tipo.toLowerCase().includes(search) ||
            (i.tipoTransformacion?.toLowerCase().includes(search))
          );
        }

        return { ...dep, items, itemsCount: items.length };
      })
      .filter(dep => dep.items.length > 0);
  });

  ngOnInit(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.estaciones.set(MOCK_PRODUCCION);
      this.loading.set(false);
    }, 500);
  }

  onFiltroChange(filtro: ProduccionFilterType): void { this.filtroActivo.set(filtro); }
  onBusquedaChange(busqueda: string): void { this.searchTerm.set(busqueda); }

  // --- Estacion CRUD ---

  onNuevaEstacion(): void {
    this.estacionToEdit.set(undefined);
    this.showEstacionDialog.set(true);
  }

  onEditarEstacion(estacionId: number): void {
    const est = this.estaciones().find(e => e.id === estacionId);
    if (!est) return;
    this.estacionToEdit.set({ id: est.id, nombre: est.nombre, tipo: est.tipo });
    this.showEstacionDialog.set(true);
  }

  closeEstacionDialog(): void {
    this.showEstacionDialog.set(false);
    this.estacionToEdit.set(undefined);
  }

  onGuardarEstacion(data: EstacionCreateData): void {
    const editing = this.estacionToEdit();
    if (editing) {
      this.estaciones.update(list => list.map(e =>
        e.id === editing.id ? { ...e, nombre: data.nombre, tipo: data.tipo } : e
      ));
      this.notificationService.success(`Estacion "${data.nombre}" actualizada`);
    } else {
      const newId = Math.max(0, ...this.estaciones().map(e => e.id)) + 1;
      this.estaciones.update(list => [...list, { id: newId, nombre: data.nombre, tipo: data.tipo, itemsCount: 0, items: [] }]);
      this.notificationService.success(`Estacion "${data.nombre}" creada`);
    }
    this.closeEstacionDialog();
  }

  // --- Item CRUD ---

  onAgregarItem(estacionId: number): void {
    this.itemToEdit.set(undefined);
    this.preselectedEstacionId.set(estacionId);
    this.showItemDialog.set(true);
  }

  onEditarItem(item: ProduccionGridRow): void {
    this.itemToEdit.set(item);
    this.preselectedEstacionId.set(item.estacionId);
    this.showItemDialog.set(true);
  }

  closeItemDialog(): void {
    this.showItemDialog.set(false);
    this.itemToEdit.set(undefined);
    this.preselectedEstacionId.set(undefined);
  }

  onGuardarItem(data: ItemFormData): void {
    const editing = this.itemToEdit();
    const estacionId = Number(data.estacionId);

    if (editing) {
      this.estaciones.update(list => list.map(est => ({
        ...est,
        items: est.items.map(item =>
          item.id === editing.id
            ? { ...item, nombre: data.nombre, tipo: data.tipo, estacionId, insumoOrigenNombre: data.insumoOrigenNombre, origenCantidad: data.origenCantidad, resultadoCantidad: data.resultadoCantidad, unidadMedida: data.unidadMedida, unidadMedidaOrigen: data.unidadMedidaOrigen, tipoTransformacion: data.tipoTransformacion, vencimiento: data.vencimiento || null }
            : item
        ),
      })));
      this.notificationService.success(`Item "${data.nombre}" actualizado`);
    } else {
      const newId = Date.now();
      const newItem: ProduccionGridRow = {
        id: newId, estacionId, nombre: data.nombre, tipo: data.tipo,
        stockProduccion: 0, stockInventario: 0, unidadMedida: data.unidadMedida,
        unidadMedidaOrigen: data.unidadMedidaOrigen, origenCantidad: data.origenCantidad,
        resultadoCantidad: data.resultadoCantidad, costoUnitario: null,
        vencimiento: data.vencimiento || null, insumoOrigenNombre: data.insumoOrigenNombre,
        tipoTransformacion: data.tipoTransformacion,
      };
      this.estaciones.update(list => list.map(est =>
        est.id === estacionId ? { ...est, items: [...est.items, newItem], itemsCount: est.itemsCount + 1 } : est
      ));
      this.notificationService.success(`Item "${data.nombre}" creado`);
    }
    this.closeItemDialog();
  }

  onCocinarTodos(estacionId: number): void {
    const estacion = this.estaciones().find(e => e.id === estacionId);
    if (!estacion) return;

    const itemsCocinados: string[] = [];

    this.estaciones.update(list =>
      list.map(est => {
        if (est.id !== estacionId) return est;
        return {
          ...est,
          items: est.items.map(item => {
            const maxBatches = Math.floor(item.stockInventario / item.origenCantidad);
            if (maxBatches <= 0) return item;
            const consumo = item.origenCantidad;
            const resultado = item.resultadoCantidad;
            itemsCocinados.push(`${resultado} ${item.unidadMedida} de ${item.nombre}`);
            return {
              ...item,
              stockProduccion: item.stockProduccion + resultado,
              stockInventario: item.stockInventario - consumo,
            };
          }),
        };
      })
    );

    if (itemsCocinados.length > 0) {
      this.notificationService.success(
        `${estacion.nombre}: se cocinaron ${itemsCocinados.length} items (1 lote c/u)`
      );
    } else {
      this.notificationService.warning(`${estacion.nombre}: no hay stock de inventario disponible`);
    }
  }

  onGridAction(event: GridActionEvent): void {
    if (event.action === 'cocinar') {
      this.itemToCocinar.set(event.data);
      this.showCocinarDialog.set(true);
    }
  }

  onConfirmCocinar(request: CocinarRequest): void {
    this.estaciones.update(deps =>
      deps.map(dep => ({
        ...dep,
        items: dep.items.map(item => {
          if (item.id === request.itemId) {
            return {
              ...item,
              stockProduccion: item.stockProduccion + request.cantidadResultado,
              stockInventario: item.stockInventario - request.cantidadConsumo,
            };
          }
          return item;
        }),
      }))
    );

    const item = this.itemToCocinar();
    this.showCocinarDialog.set(false);
    this.notificationService.success(
      `Se produjeron ${request.cantidadResultado} ${item?.unidadMedida} de ${item?.nombre}`
    );
  }
}
