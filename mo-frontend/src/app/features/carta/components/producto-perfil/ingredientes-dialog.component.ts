import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ingrediente, IngredientesFormData } from '../../models/producto-perfil.model';

const UNIDADES = ['Un', 'Gr', 'Ml', 'Kg'];

@Component({
  selector: 'app-ingredientes-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <!-- Header -->
        <header class="dialog-header">
          <h2 class="dialog-title">INGREDIENTES</h2>
          <div class="header-badges">
            <div class="badge badge-green">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              {{ formatPrice(costoTotal()) }}
            </div>
            <div class="badge badge-teal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"/>
              </svg>
              {{ pesoTotal() }}gr
            </div>
          </div>
        </header>

        <div class="dialog-body">
          <!-- Ingredient list -->
          <div class="ingredients-list">
            @for (ing of items(); track $index; let i = $index) {
              <div class="ingredient-row">
                <div class="stepper">
                  <button class="stepper-btn" (click)="decrementQty(i)" [disabled]="ing.cantidadNum! <= 1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"/>
                    </svg>
                  </button>
                  <span class="stepper-value">{{ ing.cantidadNum }}</span>
                  <span class="stepper-unit">{{ ing.unidad }}</span>
                  <button class="stepper-btn" (click)="incrementQty(i)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                  </button>
                </div>

                <div class="ingredient-info">
                  <span class="ingredient-name">{{ ing.nombre }}</span>
                  <div class="ingredient-details">
                    <span class="detail-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"/>
                      </svg>
                      {{ calcPesoTotal(ing) }}gr ({{ ing.pesoUnitario }}gr c/u)
                    </span>
                    <span class="detail-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                      </svg>
                      {{ formatPrice(calcCostoTotal(ing)) }} ({{ formatPrice(ing.costoUnitario!) }} c/u)
                    </span>
                  </div>
                </div>

                <button class="remove-btn" (click)="removeIngrediente(i)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            }
          </div>

          @if (items().length === 0) {
            <div class="empty-state">Sin ingredientes. Agrega uno usando el formulario de abajo.</div>
          }

          <!-- Add existing ingredient row -->
          <div class="add-section-label">Agregar del inventario</div>
          <div class="add-row">
            <select class="add-input add-unidad" [(ngModel)]="newUnidad">
              @for (u of unidades; track u) {
                <option [value]="u">{{ u }}</option>
              }
            </select>
            <input class="add-input add-cantidad" type="number" [(ngModel)]="newCantidad" placeholder="1" min="1"/>
            <input class="add-input add-nombre" type="text" [(ngModel)]="newNombre" placeholder="Buscar ingrediente del inventario..." (keydown.enter)="addIngrediente()"/>
            <input class="add-input add-peso" type="number" [(ngModel)]="newPeso" placeholder="Peso (gr)" min="0"/>
            <input class="add-input add-costo" type="number" [(ngModel)]="newCosto" placeholder="Costo ($)" min="0"/>
            <button class="add-btn" (click)="addIngrediente()" [disabled]="!newNombre.trim()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
              </svg>
            </button>
          </div>

          <!-- Create new ingredient -->
          <div class="create-section">
            @if (!showCrearForm()) {
              <span class="create-hint">Crea un ingrediente nuevo y sumalo al inventario del local</span>
              <button class="btn-crear-ingrediente" (click)="showCrearForm.set(true)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
                Crear ingrediente
              </button>
            } @else {
              <div class="create-form">
                <div class="create-form-header">
                  <span class="create-form-title">Nuevo ingrediente para inventario</span>
                  <button class="create-form-close" (click)="cancelCrear()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <div class="create-form-fields">
                  <input class="add-input create-nombre" type="text" [(ngModel)]="crearNombre" placeholder="Nombre del ingrediente"/>
                  <select class="add-input add-unidad" [(ngModel)]="crearUnidad">
                    @for (u of unidades; track u) {
                      <option [value]="u">{{ u }}</option>
                    }
                  </select>
                  <input class="add-input create-peso" type="number" [(ngModel)]="crearPeso" placeholder="Peso unitario (gr)" min="0"/>
                  <input class="add-input create-costo" type="number" [(ngModel)]="crearCosto" placeholder="Costo unitario ($)" min="0"/>
                  <button class="btn-confirmar-crear" (click)="crearIngrediente()" [disabled]="!crearNombre.trim()">
                    Crear y agregar
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Footer stats -->
          @if (items().length > 0) {
            <div class="stats-footer">
              <span class="stats-count">{{ items().length }} ingrediente{{ items().length !== 1 ? 's' : '' }}</span>
              <div class="stats-right">
                <span>Peso unitario promedio: <strong>{{ pesoPromedio() }}gr</strong></span>
                <span>Costo unitario promedio: <strong>{{ formatPrice(costoPromedio()) }}</strong></span>
              </div>
            </div>
          }
        </div>

        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
          <button type="button" class="btn btn-primary" (click)="onSubmit()">GUARDAR RECETA</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px; animation: fadeIn 0.15s ease-out;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .dialog-container {
      background: white; border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 100%; max-width: 1000px; max-height: 90vh; overflow-y: auto;
      animation: slideUp 0.2s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Header */
    .dialog-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 28px 28px 20px;
    }
    .dialog-title {
      font-size: 18px; font-weight: 700; color: var(--text-heading);
      text-transform: uppercase; letter-spacing: 0.04em; margin: 0;
    }
    .header-badges { display: flex; gap: 10px; }
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; font-size: 15px; font-weight: 700;
      border-radius: 10px;
    }
    .badge-green { background: #F0FDF4; color: #166534; border: 1px solid #BBF7D0; }
    .badge-teal { background: #F0FDFA; color: #115E59; border: 1px solid #99F6E4; }

    .dialog-body { padding: 0 28px 16px; }

    /* Add row */
    .add-row {
      display: flex; gap: 8px; align-items: center;
      padding: 16px 0;
    }
    .add-input {
      padding: 10px 12px; font-size: 14px; font-family: inherit;
      color: var(--text-primary); background: white; border: 1px solid var(--slate-200);
      border-radius: 10px; transition: all 0.15s;
    }
    .add-input:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1); }
    .add-input::placeholder { color: var(--slate-400); }
    .add-unidad { width: 70px; cursor: pointer; appearance: none; padding-right: 8px; text-align: center; }
    .add-cantidad { width: 60px; text-align: center; }
    .add-nombre { flex: 1; min-width: 0; }
    .add-peso { width: 110px; }
    .add-costo { width: 110px; }
    .add-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 42px; height: 42px; padding: 0; flex-shrink: 0;
      background: var(--text-heading); color: white; border: none;
      border-radius: 10px; cursor: pointer; transition: all 0.15s;
    }
    .add-btn:hover:not(:disabled) { background: var(--text-primary); }
    .add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* Ingredient list */
    .ingredients-list { }
    .ingredient-row {
      display: flex; align-items: center; gap: 16px;
      padding: 18px 0;
      border-bottom: 1px solid var(--slate-100);
    }
    .ingredient-row:last-child { border-bottom: 1px solid var(--slate-100); }

    /* Stepper */
    .stepper {
      display: flex; align-items: center; gap: 4px;
      flex-shrink: 0;
    }
    .stepper-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; padding: 0;
      background: white; color: var(--slate-500); border: 1px solid var(--slate-200);
      border-radius: 8px; cursor: pointer; transition: all 0.15s;
    }
    .stepper-btn:hover:not(:disabled) { border-color: var(--primary-orange); color: var(--primary-orange); }
    .stepper-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .stepper-value {
      font-size: 18px; font-weight: 700; color: var(--text-heading);
      min-width: 30px; text-align: center;
    }
    .stepper-unit {
      font-size: 13px; color: var(--slate-400); font-weight: 500;
      margin-right: 2px;
    }

    /* Info */
    .ingredient-info { flex: 1; min-width: 0; }
    .ingredient-name {
      display: block; font-size: 15px; font-weight: 600; color: var(--text-heading);
      margin-bottom: 4px;
    }
    .ingredient-details {
      display: flex; gap: 20px; flex-wrap: wrap;
    }
    .detail-item {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 13px; color: var(--slate-500);
    }

    .remove-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; padding: 0; flex-shrink: 0;
      background: transparent; color: var(--slate-300); border: none;
      border-radius: 6px; cursor: pointer; transition: all 0.15s;
    }
    .remove-btn:hover { color: var(--danger-color); background: #FEF2F2; }

    .empty-state {
      padding: 32px; text-align: center;
      font-size: 14px; color: var(--slate-400);
    }

    /* Footer stats */
    .stats-footer {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 0 0; border-top: 1px solid var(--slate-200); margin-top: 8px;
    }
    .stats-count { font-size: 13px; color: #3B82F6; font-weight: 500; }
    .stats-right { display: flex; gap: 24px; }
    .stats-right span { font-size: 13px; color: var(--slate-500); }
    .stats-right strong { color: var(--text-heading); }

    .dialog-actions {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 16px 28px 28px;
    }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 24px; font-size: 14px; font-weight: 500; font-family: inherit;
      border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s ease;
    }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background-color: var(--text-heading); color: white; }
    .btn-primary:hover:not(:disabled) { background-color: var(--text-primary); }
    .btn-secondary { background-color: white; color: var(--text-primary); border: 1px solid var(--slate-200); }
    .btn-secondary:hover:not(:disabled) { background-color: var(--slate-50); }

    /* Add section label */
    .add-section-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-400);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding-top: 8px;
    }

    /* Create ingredient section */
    .create-section {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      justify-content: flex-end;
    }
    .btn-crear-ingrediente {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      color: white;
      background: #FF8800;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .btn-crear-ingrediente:hover { background: #E67A00; }
    .create-hint {
      font-size: 13px;
      color: var(--slate-400);
    }
    .create-form {
      flex: 1;
      background: #FFFBF5;
      border: 1px solid #FED7AA;
      border-radius: 10px;
      padding: 14px 16px;
    }
    .create-form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .create-form-title {
      font-size: 13px;
      font-weight: 600;
      color: #92400E;
    }
    .create-form-close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--slate-400);
      padding: 2px;
      display: flex;
    }
    .create-form-close:hover { color: var(--slate-500); }
    .create-form-fields {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .create-nombre { flex: 1; min-width: 0; }
    .create-peso { width: 130px; }
    .create-costo { width: 130px; }
    .btn-confirmar-crear {
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 500;
      color: white;
      background: #FF8800;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .btn-confirmar-crear:hover { background: #E67A00; }
    .btn-confirmar-crear:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 700px) {
      .add-row { flex-wrap: wrap; }
      .add-nombre { width: 100%; }
      .stats-footer { flex-direction: column; gap: 8px; align-items: flex-start; }
      .stats-right { flex-direction: column; gap: 4px; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientesDialogComponent implements OnInit {
  @Input() ingredientes: Ingrediente[] = [];
  @Output() guardar = new EventEmitter<IngredientesFormData>();
  @Output() cancelar = new EventEmitter<void>();

  unidades = UNIDADES;
  items = signal<Ingrediente[]>([]);

  // Add existing ingredient form
  newUnidad = 'Un';
  newCantidad = 1;
  newNombre = '';
  newPeso = 0;
  newCosto = 0;

  // Create new ingredient form
  showCrearForm = signal(false);
  crearNombre = '';
  crearUnidad = 'Un';
  crearPeso = 0;
  crearCosto = 0;

  costoTotal = computed(() => {
    return this.items().reduce((sum, ing) => sum + this.calcCostoTotal(ing), 0);
  });

  pesoTotal = computed(() => {
    return this.items().reduce((sum, ing) => sum + this.calcPesoTotal(ing), 0);
  });

  pesoPromedio = computed(() => {
    const items = this.items();
    if (items.length === 0) return 0;
    const totalPesoUnit = items.reduce((sum, ing) => sum + (ing.pesoUnitario || 0), 0);
    return Math.round(totalPesoUnit / items.length);
  });

  costoPromedio = computed(() => {
    const items = this.items();
    if (items.length === 0) return 0;
    const totalCostoUnit = items.reduce((sum, ing) => sum + (ing.costoUnitario || 0), 0);
    return Math.round(totalCostoUnit / items.length);
  });

  ngOnInit(): void {
    this.items.set(this.ingredientes.map(i => ({ ...i })));
  }

  calcPesoTotal(ing: Ingrediente): number {
    return (ing.cantidadNum || 0) * (ing.pesoUnitario || 0);
  }

  calcCostoTotal(ing: Ingrediente): number {
    return (ing.cantidadNum || 0) * (ing.costoUnitario || 0);
  }

  formatPrice(value: number): string {
    return '$' + value.toLocaleString('es-AR');
  }

  addIngrediente(): void {
    if (!this.newNombre.trim()) return;
    const ing: Ingrediente = {
      nombre: this.newNombre.trim(),
      unidad: this.newUnidad,
      cantidadNum: this.newCantidad || 1,
      pesoUnitario: this.newPeso || 0,
      costoUnitario: this.newCosto || 0,
    };
    this.items.update(list => [...list, ing]);
    this.newNombre = '';
    this.newCantidad = 1;
    this.newPeso = 0;
    this.newCosto = 0;
  }

  removeIngrediente(index: number): void {
    this.items.update(list => list.filter((_, i) => i !== index));
  }

  incrementQty(index: number): void {
    this.items.update(list => list.map((ing, i) =>
      i === index ? { ...ing, cantidadNum: (ing.cantidadNum || 1) + 1 } : ing
    ));
  }

  decrementQty(index: number): void {
    this.items.update(list => list.map((ing, i) =>
      i === index && (ing.cantidadNum || 1) > 1
        ? { ...ing, cantidadNum: (ing.cantidadNum || 1) - 1 }
        : ing
    ));
  }

  crearIngrediente(): void {
    if (!this.crearNombre.trim()) return;
    const ing: Ingrediente = {
      nombre: this.crearNombre.trim(),
      unidad: this.crearUnidad,
      cantidadNum: 1,
      pesoUnitario: this.crearPeso || 0,
      costoUnitario: this.crearCosto || 0,
    };
    this.items.update(list => [...list, ing]);
    this.cancelCrear();
  }

  cancelCrear(): void {
    this.showCrearForm.set(false);
    this.crearNombre = '';
    this.crearUnidad = 'Un';
    this.crearPeso = 0;
    this.crearCosto = 0;
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  onCancel(): void {
    this.cancelar.emit();
  }

  onSubmit(): void {
    this.guardar.emit({ ingredientes: this.items() });
  }
}
