import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DetalleFormData } from '../../models/producto-perfil.model';

interface CategoriaOption {
  id: number;
  nombre: string;
}

interface TipoOption {
  value: string;
  label: string;
}

const CATEGORIA_OPTIONS: CategoriaOption[] = [
  { id: 1, nombre: 'Entradas calientes' },
  { id: 2, nombre: 'Principal' },
  { id: 3, nombre: 'Parrilla' },
  { id: 4, nombre: 'Tacos' },
  { id: 5, nombre: 'Hamburguesas' },
  { id: 6, nombre: 'Pastas' },
  { id: 7, nombre: 'Bebidas' },
  { id: 8, nombre: 'Postres' },
];

const TIPO_OPTIONS: TipoOption[] = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'principal', label: 'Principal' },
  { value: 'guarnicion', label: 'Guarnicion' },
  { value: 'combo', label: 'Combo' },
  { value: 'menu', label: 'Menu' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'sushi', label: 'Sushi' },
  { value: 'bebida', label: 'Bebida' },
  { value: 'postre', label: 'Postre' },
];

@Component({
  selector: 'app-detalle-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <h2 class="dialog-title">Editar Detalle</h2>
          <p class="dialog-subtitle">Modifica la categoria, porciones y tipo del producto.</p>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
          <div class="form-group">
            <label for="categoriaId" class="form-label">Categoria</label>
            <select
              id="categoriaId"
              formControlName="categoriaId"
              class="form-select"
            >
              @for (cat of categoriaOptions; track cat.id) {
                <option [value]="cat.id">{{ cat.nombre }}</option>
              }
            </select>
          </div>

          <div class="form-group">
            <label for="rindeParaPersonas" class="form-label">Rinde para (personas)</label>
            <input
              id="rindeParaPersonas"
              type="number"
              formControlName="rindeParaPersonas"
              class="form-input"
              placeholder="1"
              min="1"
              [class.form-input-error]="isFieldInvalid('rindeParaPersonas')"
            />
            @if (isFieldInvalid('rindeParaPersonas')) {
              <span class="form-error">Debe ser al menos 1 persona</span>
            }
          </div>

          <div class="form-group">
            <label for="tipo" class="form-label">Tipo</label>
            <select
              id="tipo"
              formControlName="tipo"
              class="form-select"
            >
              @for (tipo of tipoOptions; track tipo.value) {
                <option [value]="tipo.value">{{ tipo.label }}</option>
              }
            </select>
          </div>

          <div class="form-group">
            <label for="origen" class="form-label">Origen</label>
            <select
              id="origen"
              formControlName="origen"
              class="form-select"
            >
              <option value="elaborado">Elaborado</option>
              <option value="comprado">Comprado</option>
            </select>
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || isSubmitting()">
              @if (isSubmitting()) {
                <span class="spinner spinner-sm"></span>
              }
              Guardar
            </button>
          </div>
        </form>
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
      width: 100%; max-width: 420px; max-height: 90vh; overflow-y: auto;
      animation: slideUp 0.2s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dialog-header { padding: 28px 28px 0; }
    .dialog-title { font-size: 22px; font-weight: 600; color: #1F2937; margin: 0 0 6px 0; }
    .dialog-subtitle { font-size: 14px; color: #6B7280; margin: 0; }

    .dialog-form { padding: 24px 28px 28px; }
    .form-group { margin-bottom: 20px; }
    .form-label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; }

    .form-input,
    .form-select {
      width: 100%; padding: 12px 14px; font-size: 14px; font-family: inherit;
      color: #374151; background: white; border: 1px solid #E5E7EB;
      border-radius: 10px; transition: all 0.15s ease;
    }
    .form-input:focus,
    .form-select:focus { outline: none; border-color: #F97316; box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1); }
    .form-input::placeholder { color: #9CA3AF; }
    .form-input-error { border-color: #EF4444; }
    .form-error { display: block; margin-top: 6px; font-size: 12px; color: #EF4444; }

    .form-select {
      cursor: pointer; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center;
      background-size: 16px; padding-right: 44px;
    }

    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 12px; }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 24px; font-size: 14px; font-weight: 500; font-family: inherit;
      border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s ease;
    }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background-color: #1F2937; color: white; }
    .btn-primary:hover:not(:disabled) { background-color: #374151; }
    .btn-secondary { background-color: white; color: #374151; border: 1px solid #E5E7EB; }
    .btn-secondary:hover:not(:disabled) { background-color: #F9FAFB; }

    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    .spinner-sm { width: 14px; height: 14px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleDialogComponent implements OnInit {
  @Input() categoriaId = 1;
  @Input() rindeParaPersonas = 1;
  @Input() tipo = 'plato';
  @Input() origen = 'elaborado';
  @Output() guardar = new EventEmitter<DetalleFormData>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;
  categoriaOptions = CATEGORIA_OPTIONS;
  tipoOptions = TIPO_OPTIONS;
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      categoriaId: [this.categoriaId, [Validators.required]],
      rindeParaPersonas: [this.rindeParaPersonas, [Validators.required, Validators.min(1)]],
      tipo: [this.tipo, [Validators.required]],
      origen: [this.origen || 'elaborado', [Validators.required]],
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
    const data: DetalleFormData = {
      categoriaId: Number(this.form.value.categoriaId),
      rindeParaPersonas: this.form.value.rindeParaPersonas,
      tipo: this.form.value.tipo,
      origen: this.form.value.origen,
    };
    this.guardar.emit(data);
  }

  resetSubmitting(): void {
    this.isSubmitting.set(false);
  }
}
