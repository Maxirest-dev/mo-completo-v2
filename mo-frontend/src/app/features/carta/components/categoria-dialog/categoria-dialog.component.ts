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
import { Categoria, CategoriaCreate, CategoriaUpdate } from '../../models';

export interface IconOption {
  emoji: string;
  label: string;
}

const ICON_OPTIONS: IconOption[] = [
  { emoji: '🥟', label: 'Empanada' },
  { emoji: '🍖', label: 'Parrilla' },
  { emoji: '☕', label: 'Cafe' },
  { emoji: '🌭', label: 'Hot Dog' },
  { emoji: '🥩', label: 'Carne' },
  { emoji: '🌮', label: 'Taco' },
  { emoji: '🍔', label: 'Hamburguesa' },
  { emoji: '🍺', label: 'Cerveza' },
  { emoji: '🍕', label: 'Pizza' },
];

export interface TipoCategoria {
  value: string;
  label: string;
}

const TIPO_OPTIONS: TipoCategoria[] = [
  { value: 'comida', label: 'Comida' },
  { value: 'bebida', label: 'Bebida' },
  { value: 'postre', label: 'Postre' },
  { value: 'entrada', label: 'Entrada' },
  { value: 'otro', label: 'Otro' },
];

@Component({
  selector: 'app-categoria-dialog',
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
          <p class="dialog-subtitle">Completa los datos y selecciona un icono para el rubro.</p>
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
              placeholder="Ej: Sanguches"
              [class.form-input-error]="isFieldInvalid('nombre')"
            />
            @if (isFieldInvalid('nombre')) {
              <span class="form-error">El nombre es requerido</span>
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
              placeholder="-"
            />
          </div>

          <!-- Tipo -->
          <div class="form-group">
            <label for="tipo" class="form-label">Tipo</label>
            <select
              id="tipo"
              formControlName="tipo"
              class="form-select"
            >
              <option value="">-</option>
              @for (tipo of tipoOptions; track tipo.value) {
                <option [value]="tipo.value">{{ tipo.label }}</option>
              }
            </select>
          </div>

          <!-- Imagen (Galeria de Iconos) -->
          <div class="form-group">
            <label class="form-label">Imagen</label>
            <div class="icon-gallery-container">
              <div class="icon-gallery-header">
                <span class="gallery-title">Galeria</span>
                <button type="button" class="gallery-action-btn" title="Ver mas iconos">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                  </svg>
                </button>
              </div>
              <div class="icon-grid">
                @for (icon of iconOptions; track icon.emoji) {
                  <button
                    type="button"
                    class="icon-option"
                    [class.icon-option-selected]="selectedIcon() === icon.emoji"
                    [title]="icon.label"
                    (click)="selectIcon(icon.emoji)"
                  >
                    <span class="icon-emoji">{{ icon.emoji }}</span>
                  </button>
                }
                <!-- Add more button -->
                <button
                  type="button"
                  class="icon-option icon-option-add"
                  title="Agregar icono"
                  (click)="onAddIconClick()"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>
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

    /* Dialog Container - Matching reference design */
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
      color: #1F2937;
      margin: 0 0 6px 0;
    }

    .dialog-subtitle {
      font-size: 14px;
      color: #6B7280;
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
      color: #374151;
      margin-bottom: 8px;
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: 12px 14px;
      font-size: 14px;
      font-family: inherit;
      color: #374151;
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      transition: all 0.15s ease;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #F97316;
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }

    .form-input::placeholder {
      color: #9CA3AF;
    }

    .form-input-error {
      border-color: #EF4444;
    }

    .form-input-error:focus {
      border-color: #EF4444;
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
      color: #EF4444;
    }

    /* Icon Gallery - Matching reference exactly */
    .icon-gallery-container {
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      overflow: hidden;
    }

    .icon-gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #F3F4F6;
    }

    .gallery-title {
      font-size: 13px;
      font-weight: 500;
      color: #6B7280;
    }

    .gallery-action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: #9CA3AF;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .gallery-action-btn:hover {
      background: #F3F4F6;
      color: #6B7280;
    }

    .gallery-action-btn svg {
      width: 18px;
      height: 18px;
    }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      padding: 16px;
    }

    .icon-option {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F9FAFB;
      border: 2px solid transparent;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .icon-option:hover {
      background: #F3F4F6;
      transform: scale(1.05);
    }

    .icon-option-selected {
      border-color: #F97316;
      background: #FFF7ED;
    }

    .icon-option-selected:hover {
      background: #FFEDD5;
    }

    .icon-emoji {
      font-size: 28px;
      line-height: 1;
    }

    .icon-option-add {
      background: white;
      border: 2px dashed #D1D5DB;
    }

    .icon-option-add:hover {
      border-color: #9CA3AF;
      background: #F9FAFB;
      transform: scale(1.05);
    }

    .icon-option-add svg {
      width: 24px;
      height: 24px;
      color: #9CA3AF;
    }

    /* Actions - Matching reference button style */
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

    /* Primary button - Dark blue like reference */
    .btn-primary {
      background-color: #1F2937;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #374151;
    }

    /* Secondary button */
    .btn-secondary {
      background-color: white;
      color: #374151;
      border: 1px solid #E5E7EB;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #F9FAFB;
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

      .icon-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        padding: 12px;
      }

      .icon-emoji {
        font-size: 24px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriaDialogComponent implements OnInit {
  @Input() categoria?: Categoria;
  @Output() guardar = new EventEmitter<CategoriaCreate | CategoriaUpdate>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;
  iconOptions = ICON_OPTIONS;
  tipoOptions = TIPO_OPTIONS;

  selectedIcon = signal<string | null>(null);
  isSubmitting = signal(false);

  isEditMode = computed(() => !!this.categoria);
  dialogTitle = computed(() => this.isEditMode() ? 'Editar Categoria' : 'Nueva Categoria');
  submitButtonText = computed(() => this.isEditMode() ? 'Guardar' : 'Crear');

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();

    if (this.categoria) {
      this.populateForm();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: [''],
      tipo: [''],
    });
  }

  private populateForm(): void {
    if (!this.categoria) return;

    this.form.patchValue({
      nombre: this.categoria.nombre,
      descripcion: this.categoria.descripcion || '',
    });

    if (this.categoria.icono) {
      this.selectedIcon.set(this.categoria.icono);
    }
  }

  selectIcon(emoji: string): void {
    if (this.selectedIcon() === emoji) {
      this.selectedIcon.set(null);
    } else {
      this.selectedIcon.set(emoji);
    }
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

  onAddIconClick(): void {
    // Placeholder for future functionality
    console.log('Add icon clicked - feature not implemented');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.form.value;
    const data: CategoriaCreate | CategoriaUpdate = {
      nombre: formValue.nombre.trim(),
      descripcion: formValue.descripcion?.trim() || undefined,
      icono: this.selectedIcon() || undefined,
    };

    this.guardar.emit(data);
  }

  resetSubmitting(): void {
    this.isSubmitting.set(false);
  }
}
