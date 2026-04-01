import { Component, ChangeDetectionStrategy, signal, OnInit, computed, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DepositoGridComponent } from './components/deposito-grid/deposito-grid.component';
import {
  FilterToolbarComponent,
  FilterContadores,
  FiltroTipo,
} from './components/filter-toolbar/filter-toolbar.component';
import { DepositoDialogComponent } from './components/deposito-dialog/deposito-dialog.component';
import { InsumoDialogComponent } from './components/insumo-dialog/insumo-dialog.component';
import { AjustarStockDialogComponent, AjusteStockData } from './components/ajustar-stock-dialog/ajustar-stock-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogType } from './components/confirm-dialog/confirm-dialog.component';
import { ToastContainerComponent } from '@mro/shared-ui';
import { DepositoGridRow, InsumoGridRow, GridActionEvent } from './models/inventario-grid.model';
import { Deposito, DepositoCreate, DepositoUpdate, InsumoCreate, InsumoUpdate } from './models';
import { DepositoService, InsumoService } from './services';
import { NotificationService } from '@mro/shared-ui';
import { MOCK_DEPOSITOS } from './data/mock-inventario.data';
import { MOCK_INSUMO_PERFIL } from './data/mock-insumo-perfil.data';

interface ConfirmDialogConfig {
  visible: boolean;
  titulo: string;
  mensaje: string;
  tipo: ConfirmDialogType;
  data: DepositoGridRow | InsumoGridRow | null;
  entityType: 'deposito' | 'insumo';
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    CommonModule,
    DepositoGridComponent,
    FilterToolbarComponent,
    DepositoDialogComponent,
    InsumoDialogComponent,
    AjustarStockDialogComponent,
    ConfirmDialogComponent,
    ToastContainerComponent,
  ],
  template: `
    <div class="inventario-container">
      <!-- Page Header -->
      <header class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Inventario</h1>
          <p class="page-subtitle">Gestion de stock y control de depositos</p>
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
        (nuevoDeposito)="onNuevoDeposito()"
      />

      <!-- Grid Content -->
      <main class="inventario-content">
        <div class="card">
          <app-deposito-grid
            [rowData]="filteredDepositos()"
            [loading]="loading()"
            (actionEvent)="onGridAction($event)"
            (agregarInsumo)="onAgregarInsumo($event)"
          />
        </div>
      </main>
    </div>

    <!-- Deposito Dialog -->
    @if (showDepositoDialog()) {
      <app-deposito-dialog
        [deposito]="depositoToEdit()"
        (guardar)="onGuardarDeposito($event)"
        (cancelar)="onCancelarDepositoDialog()"
      />
    }

    <!-- Insumo Dialog -->
    @if (showInsumoDialog()) {
      <app-insumo-dialog
        [insumo]="insumoToEdit()"
        [depositos]="depositoListForSelect()"
        [preselectedDepositoId]="preselectedDepositoId()"
        (guardar)="onGuardarInsumo($event)"
        (cancelar)="onCancelarInsumoDialog()"
      />
    }

    <!-- Ajustar Stock Dialog -->
    @if (showAjustarStockDialog()) {
      <app-ajustar-stock-dialog
        [insumo]="insumoToAdjust()!"
        [depositos]="depositoListForSelect()"
        [depositoActualId]="depositoActualIdForAdjust()"
        (guardar)="onGuardarAjusteStock($event)"
        (cancelar)="onCancelarAjusteStock()"
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
    .inventario-container {
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

    /* Content */
    .inventario-content {
      min-height: 500px;
    }

    .card {
      overflow: hidden;
      background: white;
      border-radius: 12px;
      border: 1px solid var(--gray-200);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .deposito-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Loading state */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 80px 24px;
      font-size: 14px;
      color: var(--gray-600);
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #E5E7EB;
      border-top-color: #F97316;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 80px 24px;
      text-align: center;
    }

    .empty-icon {
      width: 48px;
      height: 48px;
      color: #D1D5DB;
    }

    .empty-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-700);
    }

    .empty-description {
      font-size: 14px;
      color: var(--gray-500);
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
export class InventarioComponent implements OnInit {
  @ViewChild(DepositoDialogComponent) depositoDialog?: DepositoDialogComponent;
  @ViewChild(InsumoDialogComponent) insumoDialog?: InsumoDialogComponent;
  @ViewChild('confirmDialogRef') confirmDialogRef?: ConfirmDialogComponent;

  private readonly router = inject(Router);
  private readonly depositoService = inject(DepositoService);
  private readonly insumoService = inject(InsumoService);
  private readonly notificationService = inject(NotificationService);

  // State signals
  loading = signal(false);
  depositos = signal<DepositoGridRow[]>([]);
  searchTerm = signal('');
  filtroActivo = signal<FiltroTipo>('todos');

  // Dialog state
  showDepositoDialog = signal(false);
  depositoToEdit = signal<Deposito | undefined>(undefined);
  showInsumoDialog = signal(false);
  insumoToEdit = signal<any>(undefined);
  preselectedDepositoId = signal<number | undefined>(undefined);

  // Ajustar stock dialog state
  showAjustarStockDialog = signal(false);
  insumoToAdjust = signal<InsumoGridRow | undefined>(undefined);
  depositoActualIdForAdjust = signal<number>(0);

  // Confirmation dialog state
  confirmDialog = signal<ConfirmDialogConfig>({
    visible: false,
    titulo: '',
    mensaje: '',
    tipo: 'desactivar',
    data: null,
    entityType: 'deposito',
  });

  // Backup for optimistic update rollback
  private backupState: DepositoGridRow[] = [];

  // Deposito list for insumo dialog select
  depositoListForSelect = computed(() => {
    return this.depositos().map(d => ({
      id: d.id,
      nombre: d.nombre,
      descripcion: d.descripcion,
      tipo: d.tipo,
      ubicacion: d.ubicacion,
      activo: d.activo,
      orden: d.orden,
      insumosCount: d.insumosCount,
      createdAt: '',
      updatedAt: '',
    } as Deposito));
  });

  // Computed filter counters for toolbar
  filterContadores = computed<FilterContadores>(() => {
    const all = this.depositos();
    const allInsumos = all.flatMap(d => d.insumos);
    return {
      todos: all.length,
      activos: all.filter(d => d.activo).length,
      stockBajo: allInsumos.filter(i => i.estadoStock === 'BAJO').length,
      critico: allInsumos.filter(i => i.estadoStock === 'CRITICO').length,
    };
  });

  // Computed filtered data
  filteredDepositos = computed<DepositoGridRow[]>(() => {
    const filter = this.filtroActivo();
    const search = this.searchTerm().toLowerCase().trim();
    let filtered = [...this.depositos()];

    // Apply filter
    switch (filter) {
      case 'activos':
        filtered = filtered.filter(d => d.activo);
        break;
      case 'stockBajo':
        filtered = filtered.filter(d =>
          d.insumos.some(i => i.estadoStock === 'BAJO')
        );
        break;
      case 'critico':
        filtered = filtered.filter(d =>
          d.insumos.some(i => i.estadoStock === 'CRITICO')
        );
        break;
    }

    // Apply search
    if (search) {
      filtered = filtered.filter(d =>
        d.nombre.toLowerCase().includes(search) ||
        d.descripcion?.toLowerCase().includes(search) ||
        d.tipo.toLowerCase().includes(search) ||
        d.insumos.some(i => i.nombre.toLowerCase().includes(search))
      );
    }

    return filtered;
  });

  ngOnInit(): void {
    this.loadDepositos();
  }

  private loadDepositos(): void {
    this.loading.set(true);

    // Simulate API call with mock data
    setTimeout(() => {
      this.depositos.set(MOCK_DEPOSITOS);
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

  onNuevoDeposito(): void {
    this.depositoToEdit.set(undefined);
    this.showDepositoDialog.set(true);
  }

  onGridAction(event: GridActionEvent): void {
    console.log('Grid action:', event);

    switch (event.action) {
      case 'edit':
        if (event.type === 'deposito') {
          this.editDeposito(event.data as DepositoGridRow);
        } else {
          this.editInsumo(event.data as InsumoGridRow);
        }
        break;
      case 'deactivate':
        if (event.type === 'deposito') {
          this.showDeactivateDepositoDialog(event.data as DepositoGridRow);
        } else {
          this.showDeactivateInsumoDialog(event.data as InsumoGridRow);
        }
        break;
      case 'activate':
        if (event.type === 'deposito') {
          this.showActivateDepositoDialog(event.data as DepositoGridRow);
        } else {
          this.showActivateInsumoDialog(event.data as InsumoGridRow);
        }
        break;
      case 'delete':
        // Handle delete (future implementation)
        break;
      case 'adjust-stock':
        this.openAjustarStockDialog(event.data as InsumoGridRow);
        break;
    }
  }

  // ----- Edit Actions -----

  private editDeposito(deposito: DepositoGridRow): void {
    const depositoData: Deposito = {
      id: deposito.id,
      nombre: deposito.nombre,
      descripcion: deposito.descripcion,
      tipo: deposito.tipo,
      ubicacion: deposito.ubicacion,
      activo: deposito.activo,
      orden: deposito.orden,
      insumosCount: deposito.insumosCount,
      createdAt: '',
      updatedAt: '',
    };
    this.depositoToEdit.set(depositoData);
    this.showDepositoDialog.set(true);
  }

  private editInsumo(insumo: InsumoGridRow): void {
    this.router.navigate(['/inventario/insumo', insumo.id]);
  }

  // ----- Deactivate Dialogs -----

  private showDeactivateDepositoDialog(deposito: DepositoGridRow): void {
    const insumoCount = deposito.insumos?.length || 0;
    const insumoMessage = insumoCount > 0
      ? ` Los ${insumoCount} insumos de este deposito tambien se desactivaran.`
      : '';

    this.confirmDialog.set({
      visible: true,
      titulo: 'Desactivar deposito',
      mensaje: `Estas seguro de desactivar "${deposito.nombre}"?${insumoMessage}`,
      tipo: 'desactivar',
      data: deposito,
      entityType: 'deposito',
    });
  }

  private showDeactivateInsumoDialog(insumo: InsumoGridRow): void {
    this.confirmDialog.set({
      visible: true,
      titulo: 'Desactivar insumo',
      mensaje: `Estas seguro de desactivar "${insumo.nombre}"? No estara disponible para su uso.`,
      tipo: 'desactivar',
      data: insumo,
      entityType: 'insumo',
    });
  }

  // ----- Activate Dialogs -----

  private showActivateDepositoDialog(deposito: DepositoGridRow): void {
    this.confirmDialog.set({
      visible: true,
      titulo: 'Activar deposito',
      mensaje: `Estas seguro de activar "${deposito.nombre}"? Estara disponible en el inventario.`,
      tipo: 'activar',
      data: deposito,
      entityType: 'deposito',
    });
  }

  private showActivateInsumoDialog(insumo: InsumoGridRow): void {
    this.confirmDialog.set({
      visible: true,
      titulo: 'Activar insumo',
      mensaje: `Estas seguro de activar "${insumo.nombre}"? Estara disponible para su uso.`,
      tipo: 'activar',
      data: insumo,
      entityType: 'insumo',
    });
  }

  // ----- Confirm Dialog Actions -----

  onConfirmAction(): void {
    const dialog = this.confirmDialog();
    if (!dialog.data) return;

    // Save backup for rollback
    this.backupState = JSON.parse(JSON.stringify(this.depositos()));

    if (dialog.tipo === 'desactivar') {
      if (dialog.entityType === 'deposito') {
        this.deactivateDeposito(dialog.data as DepositoGridRow);
      } else {
        this.deactivateInsumo(dialog.data as InsumoGridRow);
      }
    } else if (dialog.tipo === 'activar') {
      if (dialog.entityType === 'deposito') {
        this.activateDeposito(dialog.data as DepositoGridRow);
      } else {
        this.activateInsumo(dialog.data as InsumoGridRow);
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

  private deactivateDeposito(deposito: DepositoGridRow): void {
    this.updateDepositoState(deposito.id, false);

    setTimeout(() => {
      const success = Math.random() > 0.1;

      if (success) {
        this.notificationService.success(`Deposito "${deposito.nombre}" desactivado correctamente`);
        this.closeConfirmDialog();
      } else {
        this.depositos.set(this.backupState);
        this.notificationService.error(`Error al desactivar el deposito "${deposito.nombre}". Intente nuevamente.`);
        this.confirmDialogRef?.resetLoading();
      }
    }, 800);
  }

  private activateDeposito(deposito: DepositoGridRow): void {
    this.updateDepositoState(deposito.id, true);

    setTimeout(() => {
      const success = Math.random() > 0.1;

      if (success) {
        this.notificationService.success(`Deposito "${deposito.nombre}" activado correctamente`);
        this.closeConfirmDialog();
      } else {
        this.depositos.set(this.backupState);
        this.notificationService.error(`Error al activar el deposito "${deposito.nombre}". Intente nuevamente.`);
        this.confirmDialogRef?.resetLoading();
      }
    }, 800);
  }

  private deactivateInsumo(insumo: InsumoGridRow): void {
    this.updateInsumoState(insumo.id, false);

    setTimeout(() => {
      const success = Math.random() > 0.1;

      if (success) {
        this.notificationService.success(`Insumo "${insumo.nombre}" desactivado correctamente`);
        this.closeConfirmDialog();
      } else {
        this.depositos.set(this.backupState);
        this.notificationService.error(`Error al desactivar el insumo "${insumo.nombre}". Intente nuevamente.`);
        this.confirmDialogRef?.resetLoading();
      }
    }, 800);
  }

  private activateInsumo(insumo: InsumoGridRow): void {
    this.updateInsumoState(insumo.id, true);

    setTimeout(() => {
      const success = Math.random() > 0.1;

      if (success) {
        this.notificationService.success(`Insumo "${insumo.nombre}" activado correctamente`);
        this.closeConfirmDialog();
      } else {
        this.depositos.set(this.backupState);
        this.notificationService.error(`Error al activar el insumo "${insumo.nombre}". Intente nuevamente.`);
        this.confirmDialogRef?.resetLoading();
      }
    }, 800);
  }

  private updateDepositoState(depositoId: number, activo: boolean): void {
    this.depositos.update(deps =>
      deps.map(dep => {
        if (dep.id === depositoId) {
          return {
            ...dep,
            activo,
            insumos: dep.insumos.map(ins => ({
              ...ins,
              activo,
            })),
          };
        }
        return dep;
      })
    );
  }

  private updateInsumoState(insumoId: number, activo: boolean): void {
    this.depositos.update(deps =>
      deps.map(dep => ({
        ...dep,
        insumos: dep.insumos.map(ins => {
          if (ins.id === insumoId) {
            return { ...ins, activo };
          }
          return ins;
        }),
      }))
    );
  }

  // ----- Deposito Dialog Actions -----

  onGuardarDeposito(data: DepositoCreate | DepositoUpdate): void {
    const isEdit = !!this.depositoToEdit();

    if (isEdit && this.depositoToEdit()?.id) {
      this.depositoService.update(this.depositoToEdit()!.id, data as DepositoUpdate).subscribe({
        next: (updated) => {
          console.log('Deposito actualizado:', updated);
          this.notificationService.success(`Deposito "${updated.nombre}" actualizado correctamente`);
          this.showDepositoDialog.set(false);
          this.depositoToEdit.set(undefined);
          this.loadDepositos();
        },
        error: (error) => {
          console.error('Error al actualizar deposito:', error);
          this.notificationService.error('Error al actualizar el deposito. Intente nuevamente.');
          this.depositoDialog?.resetSubmitting();
        },
      });
    } else {
      this.depositoService.create(data as DepositoCreate).subscribe({
        next: (created) => {
          console.log('Deposito creado:', created);
          this.notificationService.success(`Deposito "${created.nombre}" creado correctamente`);
          this.showDepositoDialog.set(false);
          this.depositoToEdit.set(undefined);
          this.loadDepositos();
        },
        error: (error) => {
          console.error('Error al crear deposito:', error);
          this.notificationService.error('Error al crear el deposito. Intente nuevamente.');
          this.depositoDialog?.resetSubmitting();
        },
      });
    }
  }

  onCancelarDepositoDialog(): void {
    this.showDepositoDialog.set(false);
    this.depositoToEdit.set(undefined);
  }

  // ----- Insumo Dialog Actions -----

  onAgregarInsumo(depositoId: number): void {
    this.insumoToEdit.set(undefined);
    this.preselectedDepositoId.set(depositoId);
    this.showInsumoDialog.set(true);
  }

  onGuardarInsumo(data: InsumoCreate | InsumoUpdate): void {
    const createData = data as InsumoCreate;

    // Generate a new ID
    const allInsumos = this.depositos().flatMap(d => d.insumos);
    const maxId = allInsumos.length > 0
      ? Math.max(...allInsumos.map(i => i.id))
      : 0;
    const newId = maxId + 1;

    // Determine estadoStock
    const stockActual = createData.stockActual ?? 0;
    const stockMinimo = createData.stockMinimo ?? 0;
    let estadoStock: 'NORMAL' | 'BAJO' | 'CRITICO' = 'NORMAL';
    if (stockActual === 0) {
      estadoStock = 'CRITICO';
    } else if (stockActual <= stockMinimo) {
      estadoStock = 'BAJO';
    }

    const deposito = this.depositos().find(d => d.id === createData.depositoId);

    // Create new insumo row
    const newInsumo: InsumoGridRow = {
      id: newId,
      depositoId: createData.depositoId!,
      nombre: createData.nombre,
      tipoInsumo: createData.tipoInsumo ?? 'COMPRADO',
      codigo: createData.codigo ?? null,
      unidadMedida: createData.unidadMedida ?? 'kg',
      stockActual,
      stockMinimo,
      precio: createData.precio ?? null,
      estadoStock,
      activo: true,
    };

    // Add to deposito
    this.depositos.update(deps =>
      deps.map(dep => {
        if (dep.id === createData.depositoId) {
          return {
            ...dep,
            insumosCount: dep.insumosCount + 1,
            insumos: [...dep.insumos, newInsumo],
          };
        }
        return dep;
      })
    );

    // Also add to mock perfil data so the profile page works
    MOCK_INSUMO_PERFIL[newId] = {
      id: newId,
      depositoId: createData.depositoId!,
      depositoNombre: deposito?.nombre ?? '',
      nombre: createData.nombre,
      imagen: null,
      tipoInsumo: createData.tipoInsumo ?? 'COMPRADO',
      codigo: createData.codigo ?? null,
      unidadMedida: createData.unidadMedida ?? 'kg',
      stockActual,
      stockMinimo,
      precio: createData.precio ?? null,
      estadoStock,
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ingredientes: [],
      elaboracion: [],
      tiempoElaboracion: null,
      pesoTotal: null,
      transformaciones: [],
    };

    this.showInsumoDialog.set(false);
    this.insumoToEdit.set(undefined);
    this.preselectedDepositoId.set(undefined);

    this.notificationService.success(`Insumo "${createData.nombre}" creado correctamente`);

    // Navigate to profile
    this.router.navigate(['/inventario/insumo', newId]);
  }

  onCancelarInsumoDialog(): void {
    this.showInsumoDialog.set(false);
    this.insumoToEdit.set(undefined);
    this.preselectedDepositoId.set(undefined);
  }

  // ----- Ajustar Stock Dialog Actions -----

  private openAjustarStockDialog(insumo: InsumoGridRow): void {
    this.insumoToAdjust.set(insumo);
    this.depositoActualIdForAdjust.set(insumo.depositoId);
    this.showAjustarStockDialog.set(true);
  }

  onGuardarAjusteStock(data: AjusteStockData): void {
    this.backupState = JSON.parse(JSON.stringify(this.depositos()));

    // Update source insumo stock (ingreso adds, egreso/transferencia subtracts)
    this.depositos.update(deps =>
      deps.map(dep => ({
        ...dep,
        insumos: dep.insumos.map(ins => {
          if (ins.id === data.insumoId && dep.id === data.depositoOrigenId) {
            const newStock = data.tipoAjuste === 'ingreso'
              ? ins.stockActual + data.cantidad
              : ins.stockActual - data.cantidad;
            return {
              ...ins,
              stockActual: newStock,
              estadoStock: this.calcEstadoStock(newStock, ins.stockMinimo),
            };
          }
          return ins;
        }),
      }))
    );

    // For transfer: add insumo to destination if it doesn't exist there
    if (data.tipoAjuste === 'transferencia' && data.depositoDestinoId) {
      const sourceInsumo = this.insumoToAdjust()!;
      this.depositos.update(deps =>
        deps.map(dep => {
          if (dep.id !== data.depositoDestinoId) return dep;
          const existingInsumo = dep.insumos.find(i => i.nombre === sourceInsumo.nombre);
          if (existingInsumo) {
            return {
              ...dep,
              insumos: dep.insumos.map(ins => {
                if (ins.nombre === sourceInsumo.nombre) {
                  const newStock = ins.stockActual + data.cantidad;
                  return {
                    ...ins,
                    stockActual: newStock,
                    estadoStock: this.calcEstadoStock(newStock, ins.stockMinimo),
                  };
                }
                return ins;
              }),
            };
          } else {
            const allInsumos = deps.flatMap(d => d.insumos);
            const maxId = Math.max(...allInsumos.map(i => i.id), 0);
            const newInsumo: InsumoGridRow = {
              id: maxId + 1,
              depositoId: data.depositoDestinoId!,
              nombre: sourceInsumo.nombre,
              tipoInsumo: sourceInsumo.tipoInsumo,
              codigo: sourceInsumo.codigo,
              unidadMedida: sourceInsumo.unidadMedida,
              stockActual: data.cantidad,
              stockMinimo: sourceInsumo.stockMinimo,
              precio: sourceInsumo.precio,
              estadoStock: this.calcEstadoStock(data.cantidad, sourceInsumo.stockMinimo),
              activo: true,
            };
            return {
              ...dep,
              insumosCount: dep.insumosCount + 1,
              insumos: [...dep.insumos, newInsumo],
            };
          }
        })
      );
    }

    const tipoLabel = data.tipoAjuste === 'ingreso' ? 'Ingreso' : data.tipoAjuste === 'egreso' ? 'Egreso' : 'Transferencia';
    this.notificationService.success(`${tipoLabel} de ${data.cantidad} ${this.insumoToAdjust()?.unidadMedida} realizado correctamente`);

    this.showAjustarStockDialog.set(false);
    this.insumoToAdjust.set(undefined);
  }

  onCancelarAjusteStock(): void {
    this.showAjustarStockDialog.set(false);
    this.insumoToAdjust.set(undefined);
  }

  private calcEstadoStock(stockActual: number, stockMinimo: number): 'NORMAL' | 'BAJO' | 'CRITICO' {
    if (stockActual === 0) return 'CRITICO';
    if (stockActual <= stockMinimo) return 'BAJO';
    return 'NORMAL';
  }
}
