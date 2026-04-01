import { Component, ChangeDetectionStrategy, signal, OnInit, computed, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriaGridComponent } from './components/categoria-grid/categoria-grid.component';
import {
  FilterToolbarComponent,
  FilterContadores,
  FiltroTipo,
} from './components/filter-toolbar/filter-toolbar.component';
import { CategoriaDialogComponent } from './components/categoria-dialog/categoria-dialog.component';
import { ProductoDialogComponent } from './components/producto-dialog/producto-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogType } from './components/confirm-dialog/confirm-dialog.component';
import { ToastContainerComponent, NotificationService } from '@mro/shared-ui';
import { CategoriaGridRow, ProductoGridRow, GridActionEvent } from './models/categoria-grid.model';
import { Categoria, CategoriaCreate, CategoriaUpdate } from './models';
import { ProductoCreate, ProductoUpdate } from './models/producto.model';
import { CategoriaService, ProductoService } from './services';
import { MOCK_CATEGORIAS } from './data/mock-categorias.data';

interface ConfirmDialogConfig {
  visible: boolean;
  titulo: string;
  mensaje: string;
  tipo: ConfirmDialogType;
  data: CategoriaGridRow | ProductoGridRow | null;
  entityType: 'categoria' | 'producto';
}

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [
    CommonModule,
    CategoriaGridComponent,
    FilterToolbarComponent,
    CategoriaDialogComponent,
    ProductoDialogComponent,
    ConfirmDialogComponent,
    ToastContainerComponent,
  ],
  template: `
    <div class="carta-container">
      <!-- Page Header -->
      <header class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Configuracion de productos</h1>
          <p class="page-subtitle">Gestiona tu catalogo</p>
        </div>

        <div class="page-header-actions">
          <button class="btn btn-secondary" (click)="onActualizarPreciosClick()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Actualizar precios
          </button>
          <button class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            Agrupadores
          </button>
          <button class="btn btn-secondary" (click)="onDescuentosClick()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
            Descuentos
          </button>
          <button class="btn btn-secondary" (click)="onEdicionMasivaClick()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
            </svg>
            Edicion masiva
          </button>
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
        (nuevaCategoria)="onNuevaCategoria()"
      />

      <!-- Grid Content -->
      <main class="carta-content">
        <div class="card">
          <app-categoria-grid
            #categoriaGrid
            [rowData]="filteredCategorias()"
            [loading]="loading()"
            (actionEvent)="onGridAction($event)"
          />
        </div>
      </main>
    </div>

    <!-- Categoria Dialog -->
    @if (showCategoriaDialog()) {
      <app-categoria-dialog
        [categoria]="categoriaToEdit()"
        (guardar)="onGuardarCategoria($event)"
        (cancelar)="onCancelarDialog()"
      />
    }

    <!-- Producto Dialog -->
    @if (showProductoDialog()) {
      <app-producto-dialog
        [categoriaId]="productoDialogCategoriaId()"
        [categorias]="categoriasForDialog()"
        (guardar)="onGuardarProducto($event)"
        (cancelar)="onCancelarProductoDialog()"
      />
    }

    <!-- Confirmation Dialog -->
    @if (confirmDialog().visible) {
      <app-confirm-dialog
        #confirmDialogRef
        [titulo]="confirmDialog().titulo"
        [mensaje]="confirmDialog().mensaje"
        [tipo]="confirmDialog().tipo"
        (confirmar)="onConfirmAction()"
        (cancelar)="onCancelAction()"
      />
    }

    <!-- Toast Notifications -->
    <app-toast-container />
  `,
  styles: [`
    .carta-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Page Header - matching reference design */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      gap: 24px;
    }

    .page-header-left {
      flex-shrink: 0;
    }

    .page-title {
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

    .page-header-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    /* Action buttons styling - white with border like reference */
    .page-header-actions .btn {
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 500;
    }

    .page-header-actions .btn svg {
      width: 18px;
      height: 18px;
    }

    .page-header-actions .btn-secondary {
      background: white;
      border: 1px solid var(--gray-200);
      color: var(--gray-700);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .page-header-actions .btn-secondary:hover {
      background: var(--gray-50);
      border-color: var(--gray-300);
    }

    /* Filter Toolbar spacing */
    app-filter-toolbar {
      display: block;
      margin-bottom: 20px;
    }

    /* Content card */
    .carta-content {
      min-height: 500px;
    }

    .card {
      overflow: hidden;
      background: white;
      border-radius: 12px;
      border: 1px solid var(--gray-200);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .page-header {
        flex-direction: column;
      }

      .page-header-actions {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 22px;
      }

      .page-header-actions .btn {
        padding: 8px 12px;
        font-size: 13px;
      }
    }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaComponent implements OnInit {
  @ViewChild(CategoriaDialogComponent) categoriaDialog?: CategoriaDialogComponent;
  @ViewChild('categoriaGrid') categoriaGridRef?: CategoriaGridComponent;
  @ViewChild('confirmDialogRef') confirmDialogRef?: ConfirmDialogComponent;

  private readonly router = inject(Router);
  private readonly categoriaService = inject(CategoriaService);
  private readonly productoService = inject(ProductoService);
  private readonly notificationService = inject(NotificationService);

  // State signals
  loading = signal(false);
  categorias = signal<CategoriaGridRow[]>([]);
  searchTerm = signal('');
  filtroActivo = signal<FiltroTipo>('todos');

  // Dialog state
  showCategoriaDialog = signal(false);
  categoriaToEdit = signal<Categoria | undefined>(undefined);

  // Producto dialog state
  showProductoDialog = signal(false);
  productoDialogCategoriaId = signal<number | undefined>(undefined);
  categoriasForDialog = computed<Categoria[]>(() =>
    this.categorias().map(c => ({
      id: c.id,
      nombre: c.nombre,
      descripcion: c.descripcion || null,
      icono: c.icono || null,
      orden: c.orden || 0,
      activo: c.activo,
      createdAt: '',
      updatedAt: '',
    }))
  );


  // Confirmation dialog state
  confirmDialog = signal<ConfirmDialogConfig>({
    visible: false,
    titulo: '',
    mensaje: '',
    tipo: 'desactivar',
    data: null,
    entityType: 'categoria',
  });

  // Backup for optimistic update rollback
  private backupState: CategoriaGridRow[] = [];

  // Computed filter counters for toolbar
  filterContadores = computed<FilterContadores>(() => {
    const all = this.categorias();
    return {
      todos: all.length,
      activos: all.filter(c => c.activo && c.estado !== 'SIN_STOCK').length,
      inactivos: all.filter(c => !c.activo || c.estado === 'INACTIVO').length,
      stockBajo: all.filter(c => c.estado === 'STOCK_MEDIO').length,
      sinStock: all.filter(c => c.estado === 'SIN_STOCK').length,
    };
  });

  // Computed filtered data
  filteredCategorias = computed<CategoriaGridRow[]>(() => {
    const filter = this.filtroActivo();
    const search = this.searchTerm().toLowerCase().trim();
    let filtered = [...this.categorias()];

    // Apply filter
    switch (filter) {
      case 'activos':
        filtered = filtered.filter(c => c.activo && c.estado !== 'SIN_STOCK');
        break;
      case 'inactivos':
        filtered = filtered.filter(c => !c.activo || c.estado === 'INACTIVO');
        break;
      case 'stockBajo':
        filtered = filtered.filter(c => c.estado === 'STOCK_MEDIO');
        break;
      case 'sinStock':
        filtered = filtered.filter(c => c.estado === 'SIN_STOCK');
        break;
    }

    // Apply search
    if (search) {
      filtered = filtered.filter(c =>
        c.nombre.toLowerCase().includes(search) ||
        c.descripcion?.toLowerCase().includes(search) ||
        c.categoriaPadre?.toLowerCase().includes(search)
      );
    }

    return filtered;
  });

  ngOnInit(): void {
    this.loadCategorias();
  }

  private loadCategorias(): void {
    this.loading.set(true);

    // Simulate API call with mock data
    setTimeout(() => {
      this.categorias.set(MOCK_CATEGORIAS);
      this.loading.set(false);
    }, 500);
  }

  // Toolbar event handlers
  onFiltroChange(filtro: FiltroTipo): void {
    this.filtroActivo.set(filtro);
  }

  onBusquedaChange(busqueda: string): void {
    this.searchTerm.set(busqueda);
  }

  onActualizarPreciosClick(): void {
    this.router.navigate(['/carta/actualizar-precios']);
  }

  onDescuentosClick(): void {
    this.router.navigate(['/carta/descuentos']);
  }

  onNuevaCategoria(): void {
    this.categoriaToEdit.set(undefined);
    this.showCategoriaDialog.set(true);
  }

  onGridAction(event: GridActionEvent): void {
    console.log('Grid action:', event);

    switch (event.action) {
      case 'edit':
        if (event.type === 'categoria') {
          this.editCategoria(event.data as CategoriaGridRow);
        } else {
          this.editProducto(event.data as ProductoGridRow);
        }
        break;
      case 'deactivate':
        if (event.type === 'categoria') {
          this.showDeactivateCategoriaDialog(event.data as CategoriaGridRow);
        } else {
          this.showDeactivateProductoDialog(event.data as ProductoGridRow);
        }
        break;
      case 'activate':
        if (event.type === 'categoria') {
          this.showActivateCategoriaDialog(event.data as CategoriaGridRow);
        } else {
          this.showActivateProductoDialog(event.data as ProductoGridRow);
        }
        break;
      case 'create':
        if (event.type === 'producto') {
          this.openNuevoProductoDialog(event.data as CategoriaGridRow);
        }
        break;
      case 'delete':
        // Handle delete (future implementation)
        break;
    }
  }

  // ----- Edit Actions -----

  private editCategoria(categoria: CategoriaGridRow): void {
    // Convert CategoriaGridRow to Categoria for the dialog
    const categoriaData: Categoria = {
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || null,
      icono: categoria.icono || null,
      orden: categoria.orden || 0,
      activo: categoria.activo,
      createdAt: '',
      updatedAt: '',
    };
    this.categoriaToEdit.set(categoriaData);
    this.showCategoriaDialog.set(true);
  }

  private editProducto(producto: ProductoGridRow): void {
    this.router.navigate(['/carta/producto', producto.id]);
  }

  // ----- Nuevo Producto -----

  private openNuevoProductoDialog(categoria: CategoriaGridRow): void {
    this.productoDialogCategoriaId.set(categoria.id);
    this.showProductoDialog.set(true);
  }

  onGuardarProducto(data: ProductoCreate | ProductoUpdate): void {
    console.log('Nuevo producto:', data);
    this.notificationService.success('Producto creado exitosamente');
    this.showProductoDialog.set(false);
  }

  onCancelarProductoDialog(): void {
    this.showProductoDialog.set(false);
  }

  onEdicionMasivaClick(): void {
    this.router.navigate(['/carta/edicion-masiva']);
  }

  // ----- Deactivate Dialogs -----

  private showDeactivateCategoriaDialog(categoria: CategoriaGridRow): void {
    const productCount = categoria.productos?.length || 0;
    const productMessage = productCount > 0
      ? ` Los ${productCount} productos de esta categoria tambien se desactivaran.`
      : '';

    this.confirmDialog.set({
      visible: true,
      titulo: 'Desactivar categoria',
      mensaje: `Estas seguro de desactivar "${categoria.nombre}"?${productMessage}`,
      tipo: 'desactivar',
      data: categoria,
      entityType: 'categoria',
    });
  }

  private showDeactivateProductoDialog(producto: ProductoGridRow): void {
    this.confirmDialog.set({
      visible: true,
      titulo: 'Desactivar producto',
      mensaje: `Estas seguro de desactivar "${producto.nombre}"? No estara disponible para la venta.`,
      tipo: 'desactivar',
      data: producto,
      entityType: 'producto',
    });
  }

  // ----- Activate Dialogs -----

  private showActivateCategoriaDialog(categoria: CategoriaGridRow): void {
    this.confirmDialog.set({
      visible: true,
      titulo: 'Activar categoria',
      mensaje: `Estas seguro de activar "${categoria.nombre}"? Estara visible en el menu.`,
      tipo: 'activar',
      data: categoria,
      entityType: 'categoria',
    });
  }

  private showActivateProductoDialog(producto: ProductoGridRow): void {
    this.confirmDialog.set({
      visible: true,
      titulo: 'Activar producto',
      mensaje: `Estas seguro de activar "${producto.nombre}"? Estara disponible para la venta.`,
      tipo: 'activar',
      data: producto,
      entityType: 'producto',
    });
  }

  // ----- Confirm Dialog Actions -----

  onConfirmAction(): void {
    const dialog = this.confirmDialog();
    if (!dialog.data) return;

    // Save backup for rollback
    this.backupState = JSON.parse(JSON.stringify(this.categorias()));

    if (dialog.tipo === 'desactivar') {
      if (dialog.entityType === 'categoria') {
        this.deactivateCategoria(dialog.data as CategoriaGridRow);
      } else {
        this.deactivateProducto(dialog.data as ProductoGridRow);
      }
    } else if (dialog.tipo === 'activar') {
      if (dialog.entityType === 'categoria') {
        this.activateCategoria(dialog.data as CategoriaGridRow);
      } else {
        this.activateProducto(dialog.data as ProductoGridRow);
      }
    }
  }

  onCancelAction(): void {
    this.closeConfirmDialog();
  }

  private closeConfirmDialog(): void {
    this.confirmDialog.update(d => ({ ...d, visible: false }));
  }

  // ----- Optimistic Update Methods -----

  private deactivateCategoria(categoria: CategoriaGridRow): void {
    // Optimistic update - update UI immediately
    this.updateCategoriaState(categoria.id, false);

    // Simulate API call (mock)
    setTimeout(() => {
      // Simulate success (90% success rate for demo)
      const success = Math.random() > 0.1;

      if (success) {
        this.notificationService.success(`Categoria "${categoria.nombre}" desactivada correctamente`);
        this.closeConfirmDialog();
      } else {
        // Rollback on failure
        this.categorias.set(this.backupState);
        this.notificationService.error(`Error al desactivar la categoria "${categoria.nombre}". Intente nuevamente.`);
        this.confirmDialogRef?.resetLoading();
      }

      this.refreshGrid();
    }, 800);

    // Real API call would be:
    // this.categoriaService.toggleActive(categoria.id).subscribe({
    //   next: () => { ... },
    //   error: () => { ... }
    // });
  }

  private activateCategoria(categoria: CategoriaGridRow): void {
    // Optimistic update
    this.updateCategoriaState(categoria.id, true);

    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.1;

      if (success) {
        this.notificationService.success(`Categoria "${categoria.nombre}" activada correctamente`);
        this.closeConfirmDialog();
      } else {
        this.categorias.set(this.backupState);
        this.notificationService.error(`Error al activar la categoria "${categoria.nombre}". Intente nuevamente.`);
        this.confirmDialogRef?.resetLoading();
      }

      this.refreshGrid();
    }, 800);
  }

  private deactivateProducto(producto: ProductoGridRow): void {
    // Optimistic update
    this.updateProductoState(producto.id, false);

    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.1;

      if (success) {
        this.notificationService.success(`Producto "${producto.nombre}" desactivado correctamente`);
        this.closeConfirmDialog();
      } else {
        this.categorias.set(this.backupState);
        this.notificationService.error(`Error al desactivar el producto "${producto.nombre}". Intente nuevamente.`);
        this.confirmDialogRef?.resetLoading();
      }

      this.refreshGrid();
    }, 800);
  }

  private activateProducto(producto: ProductoGridRow): void {
    // Optimistic update
    this.updateProductoState(producto.id, true);

    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.1;

      if (success) {
        this.notificationService.success(`Producto "${producto.nombre}" activado correctamente`);
        this.closeConfirmDialog();
      } else {
        this.categorias.set(this.backupState);
        this.notificationService.error(`Error al activar el producto "${producto.nombre}". Intente nuevamente.`);
        this.confirmDialogRef?.resetLoading();
      }

      this.refreshGrid();
    }, 800);
  }

  private updateCategoriaState(categoriaId: number, activo: boolean): void {
    this.categorias.update(cats =>
      cats.map(cat => {
        if (cat.id === categoriaId) {
          return {
            ...cat,
            activo,
            estado: activo ? 'DISPONIBLE' : 'INACTIVO',
            // Also update all products in this category
            productos: cat.productos.map(prod => ({
              ...prod,
              activo,
              estado: activo ? 'ACTIVO' : 'INACTIVO',
            })),
          };
        }
        return cat;
      })
    );
  }

  private updateProductoState(productoId: number, activo: boolean): void {
    this.categorias.update(cats =>
      cats.map(cat => ({
        ...cat,
        productos: cat.productos.map(prod => {
          if (prod.id === productoId) {
            return {
              ...prod,
              activo,
              estado: activo ? 'ACTIVO' : 'INACTIVO',
            };
          }
          return prod;
        }),
      }))
    );
  }

  private refreshGrid(): void {
    // No-op: grid reacts to signal changes automatically
  }

  // ----- Category Dialog Actions -----

  onGuardarCategoria(data: CategoriaCreate | CategoriaUpdate): void {
    const isEdit = !!this.categoriaToEdit();

    if (isEdit && this.categoriaToEdit()?.id) {
      // Update existing categoria
      this.categoriaService.update(this.categoriaToEdit()!.id, data as CategoriaUpdate).subscribe({
        next: (updated) => {
          console.log('Categoria actualizada:', updated);
          this.notificationService.success(`Categoria "${updated.nombre}" actualizada correctamente`);
          this.showCategoriaDialog.set(false);
          this.categoriaToEdit.set(undefined);
          this.loadCategorias(); // Reload data
        },
        error: (error) => {
          console.error('Error al actualizar categoria:', error);
          this.notificationService.error('Error al actualizar la categoria. Intente nuevamente.');
          this.categoriaDialog?.resetSubmitting();
        },
      });
    } else {
      // Create new categoria
      this.categoriaService.create(data as CategoriaCreate).subscribe({
        next: (created) => {
          console.log('Categoria creada:', created);
          this.notificationService.success(`Categoria "${created.nombre}" creada correctamente`);
          this.showCategoriaDialog.set(false);
          this.categoriaToEdit.set(undefined);
          this.loadCategorias(); // Reload data
        },
        error: (error) => {
          console.error('Error al crear categoria:', error);
          this.notificationService.error('Error al crear la categoria. Intente nuevamente.');
          this.categoriaDialog?.resetSubmitting();
        },
      });
    }
  }

  onCancelarDialog(): void {
    this.showCategoriaDialog.set(false);
    this.categoriaToEdit.set(undefined);
  }
}
