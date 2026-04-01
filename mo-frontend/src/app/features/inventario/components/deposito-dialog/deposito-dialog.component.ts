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
import { Deposito, DepositoCreate, DepositoUpdate, DepositoTipo } from '../../models';

export interface TipoDepositoOption {
  value: DepositoTipo;
  label: string;
}

const TIPO_OPTIONS: TipoDepositoOption[] = [
  { value: 'VERDURAS', label: 'Verduras' },
  { value: 'CARNES', label: 'Carnes' },
  { value: 'LACTEOS', label: 'Lacteos' },
  { value: 'BEBIDAS', label: 'Bebidas' },
  { value: 'SECOS', label: 'Secos' },
  { value: 'CONGELADOS', label: 'Congelados' },
  { value: 'OTROS', label: 'Otros' },
];

@Component({
  selector: 'app-deposito-dialog',
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
          <p class="dialog-subtitle">Completa los datos del deposito.</p>
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
              placeholder="Ej: Camara de carnes"
              [class.form-input-error]="isFieldInvalid('nombre')"
            />
            @if (isFieldInvalid('nombre')) {
              <span class="form-error">El nombre es requerido</span>
            }
          </div>

          <!-- Tipo -->
          <div class="form-group">
            <label for="tipo" class="form-label">Tipo</label>
            <select
              id="tipo"
              formControlName="tipo"
              class="form-select"
              [class.form-input-error]="isFieldInvalid('tipo')"
            >
              <option value="">Seleccionar tipo</option>
              @for (tipo of tipoOptions; track tipo.value) {
                <option [value]="tipo.value">{{ tipo.label }}</option>
              }
            </select>
            @if (isFieldInvalid('tipo')) {
              <span class="form-error">El tipo es requerido</span>
            }
          </div>

          <!-- Descripcion -->
          <div class="form-group">
            <label for="descripcion" class="form-label">Descripcion</label>
            <input
              id="descripcion"
              type="text"
              formControlName="descripcion"
              class="form-input"
              placeholder="Descripcion opcional"
            />
          </div>

          <!-- Ubicacion -->
          <div class="form-group">
            <label for="ubicacion" class="form-label">Ubicacion</label>
            <input
              id="ubicacion"
              type="text"
              formControlName="ubicacion"
              class="form-input"
              placeholder="Ej: Camara fria 1"
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
      max-width: 460px;
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
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositoDialogComponent implements OnInit {
  @Input() deposito?: Deposito;
  @Output() guardar = new EventEmitter<DepositoCreate | DepositoUpdate>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;
  tipoOptions = TIPO_OPTIONS;

  isSubmitting = signal(false);

  isEditMode = computed(() => !!this.deposito);
  dialogTitle = computed(() => this.isEditMode() ? 'Editar Deposito' : 'Nuevo Deposito');
  submitButtonText = computed(() => this.isEditMode() ? 'Guardar' : 'Crear');

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();

    if (this.deposito) {
      this.populateForm();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      tipo: ['', [Validators.required]],
      descripcion: [''],
      ubicacion: [''],
    });
  }

  private populateForm(): void {
    if (!this.deposito) return;

    this.form.patchValue({
      nombre: this.deposito.nombre,
      tipo: this.deposito.tipo,
      descripcion: this.deposito.descripcion || '',
      ubicacion: this.deposito.ubicacion || '',
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
    const data: DepositoCreate | DepositoUpdate = {
      nombre: formValue.nombre.trim(),
      tipo: formValue.tipo,
      descripcion: formValue.descripcion?.trim() || undefined,
      ubicacion: formValue.ubicacion?.trim() || undefined,
    };

    this.guardar.emit(data);
  }

  resetSubmitting(): void {
    this.isSubmitting.set(false);
  }
}
