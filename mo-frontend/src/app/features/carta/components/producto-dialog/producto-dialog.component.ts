import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Producto, ProductoCreate, ProductoUpdate, TIPOS_PRODUCTO } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-producto-dialog',
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
          <p class="dialog-subtitle">Completa los datos del producto.</p>
        </header>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
          <!-- Row 1: Nombre -->
          <div class="form-group">
            <label for="nombre" class="form-label">
              Nombre del plato <span class="required">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              formControlName="nombre"
              class="form-input"
              [class.form-input-error]="isFieldInvalid('nombre')"
              placeholder="Ej: Milanesa napolitana"
            />
            @if (isFieldInvalid('nombre')) {
              <span class="form-error">El nombre es requerido</span>
            }
          </div>

          <!-- Row 2: Tipo + Categoria -->
          <div class="form-row two-columns-equal">
            <div class="form-group">
              <label for="tipo" class="form-label">
                Tipo <span class="required">*</span>
              </label>
              <select
                id="tipo"
                formControlName="tipo"
                class="form-select"
                [class.form-input-error]="isFieldInvalid('tipo')"
              >
                <option value="" disabled>Selecciona un tipo</option>
                @for (t of tiposProducto; track t.value) {
                  <option [value]="t.value">{{ t.label }}</option>
                }
              </select>
              @if (isFieldInvalid('tipo')) {
                <span class="form-error">El tipo es requerido</span>
              }
            </div>
            <div class="form-group">
              <label for="categoriaId" class="form-label">
                Categoria <span class="required">*</span>
              </label>
              <select
                id="categoriaId"
                formControlName="categoriaId"
                class="form-select"
                [class.form-input-error]="isFieldInvalid('categoriaId')"
              >
                <option value="" disabled>Selecciona una categoria</option>
                @for (cat of categorias; track cat.id) {
                  <option [value]="cat.id">
                    {{ cat.icono }} {{ cat.nombre }}
                  </option>
                }
              </select>
              @if (isFieldInvalid('categoriaId')) {
                <span class="form-error">La categoria es requerida</span>
              }
            </div>
          </div>

          <!-- Row 3: Precio -->
          <div class="form-group" style="max-width: 240px;">
            <label for="precio" class="form-label">
              Precio <span class="required">*</span>
            </label>
            <div class="input-with-prefix">
              <span class="input-prefix">$</span>
              <input
                id="precio"
                type="number"
                formControlName="precio"
                class="form-input has-prefix"
                [class.form-input-error]="isFieldInvalid('precio')"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            @if (isFieldInvalid('precio')) {
              <span class="form-error">
                @if (form.get('precio')?.hasError('required')) {
                  El precio es requerido
                } @else if (form.get('precio')?.hasError('min')) {
                  El precio debe ser mayor a 0
                }
              </span>
            }
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
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
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
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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

    .form-row {
      margin-bottom: 20px;
    }

    .form-row.two-columns {
      display: grid;
      grid-template-columns: 130px 1fr;
      gap: 16px;
    }

    .form-row.two-columns-equal {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-row .form-group {
      margin-bottom: 0;
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

    .required {
      color: var(--danger-color);
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

    .form-textarea {
      resize: vertical;
      min-height: 80px;
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

    /* Input with prefix */
    .input-with-prefix {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-prefix {
      position: absolute;
      left: 14px;
      color: var(--slate-500);
      font-size: 14px;
      font-weight: 500;
      pointer-events: none;
      z-index: 1;
    }

    .form-input.has-prefix {
      padding-left: 30px;
    }

    /* Stock field */
    .stock-group {
      max-width: 150px;
    }

    .stock-input {
      text-align: center;
    }

    /* Remove number input spinners */
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type="number"] {
      -moz-appearance: textfield;
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
      to {
        transform: rotate(360deg);
      }
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

      .form-row.two-columns,
      .form-row.two-columns-equal {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  // Inputs
  @Input() producto?: Producto;
  @Input() categoriaId?: number;
  @Input() categorias: Categoria[] = [];

  // Tipos de producto
  tiposProducto = TIPOS_PRODUCTO;

  // Outputs
  @Output() guardar = new EventEmitter<ProductoCreate | ProductoUpdate>();
  @Output() cancelar = new EventEmitter<void>();

  // Signals
  isSubmitting = signal(false);
  isEditMode = computed(() => !!this.producto);
  dialogTitle = computed(() => this.isEditMode() ? 'Editar Producto' : 'Nuevo Producto');
  submitButtonText = computed(() => this.isEditMode() ? 'Guardar' : 'Crear');

  // Form
  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();

    if (this.producto) {
      this.populateForm();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      tipo: ['', [Validators.required]],
      categoriaId: [this.categoriaId || '', [Validators.required]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  private populateForm(): void {
    if (!this.producto) return;

    this.form.patchValue({
      nombre: this.producto.nombre,
      tipo: this.producto.tipo || '',
      categoriaId: this.producto.categoriaId,
      precio: this.producto.precio,
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

    if (this.isEditMode()) {
      const updateDTO: ProductoUpdate = {
        categoriaId: Number(formValue.categoriaId),
        tipo: formValue.tipo || null,
        nombre: formValue.nombre.trim(),
        precio: Number(formValue.precio),
      };
      this.guardar.emit(updateDTO);
    } else {
      const createDTO: ProductoCreate = {
        categoriaId: Number(formValue.categoriaId),
        tipo: formValue.tipo || undefined,
        nombre: formValue.nombre.trim(),
        precio: Number(formValue.precio),
      };
      this.guardar.emit(createDTO);
    }
  }

  // Public method to reset submitting state (called from parent on error)
  resetSubmitting(): void {
    this.isSubmitting.set(false);
  }
}
