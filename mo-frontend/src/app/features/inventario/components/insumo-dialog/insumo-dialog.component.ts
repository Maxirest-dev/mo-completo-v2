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
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Deposito } from '../../models/deposito.model';
import { Insumo, InsumoCreate, InsumoUpdate, TipoInsumo } from '../../models/insumo.model';

interface TipoInsumoOption {
  value: TipoInsumo;
  label: string;
}

interface UnidadMedidaOption {
  value: string;
  label: string;
}

const TIPO_INSUMO_OPTIONS: TipoInsumoOption[] = [
  { value: 'COMPRADO', label: 'Comprado' },
  { value: 'ELABORADO', label: 'Elaborado' },
];

const UNIDAD_MEDIDA_OPTIONS: UnidadMedidaOption[] = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'lt', label: 'Litros (lt)' },
  { value: 'unidad', label: 'Unidad' },
  { value: 'paquete', label: 'Paquete' },
];

@Component({
  selector: 'app-insumo-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Backdrop -->
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <!-- Dialog Container -->
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <!-- Header -->
        <header class="dialog-header">
          <h2 class="dialog-title">{{ dialogTitle() }}</h2>
          <p class="dialog-subtitle">Completa los datos del insumo.</p>
        </header>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
          <!-- Nombre -->
          <div class="form-group">
            <label for="nombre" class="form-label">Nombre</label>
            <input
              id="nombre"
              type="text"
              formControlName="nombre"
              class="form-input"
              placeholder="Ej: Tomate"
              [class.form-input-error]="isFieldInvalid('nombre')"
            />
            @if (isFieldInvalid('nombre')) {
              <span class="form-error">El nombre es requerido</span>
            }
          </div>

          <!-- Row: Deposito + Tipo -->
          <div class="form-row">
            <div class="form-group">
              <label for="depositoId" class="form-label">Deposito</label>
              <select
                id="depositoId"
                formControlName="depositoId"
                class="form-select"
                [class.form-input-error]="isFieldInvalid('depositoId')"
              >
                <option [ngValue]="null">Seleccionar deposito</option>
                @for (dep of depositos; track dep.id) {
                  <option [ngValue]="dep.id">{{ dep.nombre }}</option>
                }
              </select>
              @if (isFieldInvalid('depositoId')) {
                <span class="form-error">El deposito es requerido</span>
              }
            </div>
            <div class="form-group">
              <label for="tipoInsumo" class="form-label">Tipo</label>
              <select
                id="tipoInsumo"
                formControlName="tipoInsumo"
                class="form-select"
              >
                @for (tipo of tipoInsumoOptions; track tipo.value) {
                  <option [value]="tipo.value">{{ tipo.label }}</option>
                }
              </select>
            </div>
          </div>

          <!-- Row: Codigo + Unidad de medida -->
          <div class="form-row">
            <div class="form-group">
              <label for="codigo" class="form-label">Codigo</label>
              <input
                id="codigo"
                type="text"
                formControlName="codigo"
                class="form-input"
                placeholder="Ej: VER-001"
              />
            </div>
            <div class="form-group">
              <label for="unidadMedida" class="form-label">Unidad de medida</label>
              <select
                id="unidadMedida"
                formControlName="unidadMedida"
                class="form-select"
              >
                @for (unidad of unidadMedidaOptions; track unidad.value) {
                  <option [value]="unidad.value">{{ unidad.label }}</option>
                }
              </select>
            </div>
          </div>

          <!-- Row: Stock Actual + Stock Minimo -->
          <div class="form-row">
            <div class="form-group">
              <label for="stockActual" class="form-label">Stock actual</label>
              <input
                id="stockActual"
                type="number"
                formControlName="stockActual"
                class="form-input"
                placeholder="0"
                min="0"
              />
            </div>
            <div class="form-group">
              <label for="stockMinimo" class="form-label">Stock minimo</label>
              <input
                id="stockMinimo"
                type="number"
                formControlName="stockMinimo"
                class="form-input"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <!-- Precio -->
          <div class="form-group">
            <label for="precio" class="form-label">Precio</label>
            <input
              id="precio"
              type="number"
              formControlName="precio"
              class="form-input"
              placeholder="0"
              min="0"
            />
          </div>

          <!-- Actions -->
          <div class="dialog-actions">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="onCancel()"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="form.invalid || isSubmitting()"
            >
              @if (isSubmitting()) {
                <span class="spinner spinner-sm"></span>
              }
              {{ submitButtonText() }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    /* Backdrop */
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
      animation: fadeIn 0.15s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Dialog Container */
    .dialog-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.2s ease-out;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Header */
    .dialog-header {
      padding: 28px 28px 0;
    }

    .dialog-title {
      font-size: 22px;
      font-weight: 600;
      color: var(--text-heading);
      margin: 0 0 6px 0;
    }

    .dialog-subtitle {
      font-size: 14px;
      color: var(--slate-500);
      margin: 0;
    }

    /* Form */
    .dialog-form {
      padding: 24px 28px 28px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: 12px 14px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-primary);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 10px;
      transition: all 0.15s ease;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: var(--primary-orange);
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }

    .form-input::placeholder {
      color: var(--slate-400);
    }

    .form-input-error {
      border-color: var(--danger-color);
    }

    .form-input-error:focus {
      border-color: var(--danger-color);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .form-select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      background-size: 16px;
      padding-right: 44px;
    }

    .form-error {
      display: block;
      margin-top: 6px;
      font-size: 12px;
      color: var(--danger-color);
    }

    /* Actions */
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: var(--text-heading);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--text-primary);
    }

    .btn-secondary {
      background-color: white;
      color: var(--text-primary);
      border: 1px solid var(--slate-200);
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: var(--slate-50);
    }

    /* Spinner */
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .spinner-sm {
      width: 14px;
      height: 14px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 520px) {
      .dialog-container {
        max-width: 100%;
      }

      .dialog-header,
      .dialog-form {
        padding-left: 20px;
        padding-right: 20px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsumoDialogComponent implements OnInit {
  @Input() insumo?: Insumo;
  @Input() depositos: Deposito[] = [];
  @Input() preselectedDepositoId?: number;
  @Output() guardar = new EventEmitter<InsumoCreate | InsumoUpdate>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;
  tipoInsumoOptions = TIPO_INSUMO_OPTIONS;
  unidadMedidaOptions = UNIDAD_MEDIDA_OPTIONS;

  isSubmitting = signal(false);

  isEditMode = computed(() => !!this.insumo);
  dialogTitle = computed(() => this.isEditMode() ? 'Editar Insumo' : 'Nuevo Insumo');
  submitButtonText = computed(() => this.isEditMode() ? 'Guardar' : 'Crear');

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();

    if (this.insumo) {
      this.populateForm();
    } else if (this.preselectedDepositoId) {
      this.form.patchValue({ depositoId: this.preselectedDepositoId });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      depositoId: [null, [Validators.required]],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      tipoInsumo: ['COMPRADO'],
      codigo: [''],
      unidadMedida: ['kg'],
      stockActual: [0, [Validators.min(0)]],
      stockMinimo: [0, [Validators.min(0)]],
      precio: [null, [Validators.min(0)]],
    });
  }

  private populateForm(): void {
    if (!this.insumo) return;

    this.form.patchValue({
      depositoId: this.insumo.depositoId,
      nombre: this.insumo.nombre,
      tipoInsumo: this.insumo.tipoInsumo,
      codigo: this.insumo.codigo || '',
      unidadMedida: this.insumo.unidadMedida,
      stockActual: this.insumo.stockActual,
      stockMinimo: this.insumo.stockMinimo,
      precio: this.insumo.precio,
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.form.value;
    const data: InsumoCreate | InsumoUpdate = {
      depositoId: formValue.depositoId,
      nombre: formValue.nombre.trim(),
      tipoInsumo: formValue.tipoInsumo,
      codigo: formValue.codigo?.trim() || undefined,
      unidadMedida: formValue.unidadMedida,
      stockActual: formValue.stockActual,
      stockMinimo: formValue.stockMinimo,
      precio: formValue.precio ?? undefined,
    };

    this.guardar.emit(data);
  }

  resetSubmitting(): void {
    this.isSubmitting.set(false);
  }
}
