import {
  Component,
  ChangeDetectionStrategy,
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

export interface NuevaListaFormData {
  nombre: string;
  precioBase: 'default' | 'takeaway' | 'delivery';
  tipoAjuste: 'porcentaje' | 'importe';
  valorAjuste: number;
}

@Component({
  selector: 'app-nueva-lista-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <h2 class="dialog-title">Nueva Lista de Precios</h2>
          <p class="dialog-subtitle">Crea una nueva lista de precios basada en una existente con un ajuste aplicado.</p>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
          <!-- Nombre -->
          <div class="form-group">
            <label for="nombre" class="form-label">Nombre</label>
            <input
              id="nombre"
              type="text"
              formControlName="nombre"
              class="form-input"
              placeholder="Ej: Lista Fin de Semana"
              [class.form-input-error]="isFieldInvalid('nombre')"
            />
            @if (isFieldInvalid('nombre')) {
              <span class="form-error">El nombre es requerido</span>
            }
          </div>

          <!-- Precio base -->
          <div class="form-group">
            <label for="precioBase" class="form-label">Precio base</label>
            <select
              id="precioBase"
              formControlName="precioBase"
              class="form-input form-select"
            >
              <option value="default">Default</option>
              <option value="takeaway">Take Away</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <!-- Ajuste de precio -->
          <div class="form-group">
            <label class="form-label">Ajuste de precio</label>
            <div class="ajuste-row">
              <div class="toggle-group">
                <button
                  type="button"
                  class="toggle-btn toggle-percent"
                  [class.toggle-active-percent]="tipoAjuste() === 'porcentaje'"
                  (click)="setTipoAjuste('porcentaje')"
                >%</button>
                <button
                  type="button"
                  class="toggle-btn toggle-fixed"
                  [class.toggle-active-fixed]="tipoAjuste() === 'importe'"
                  (click)="setTipoAjuste('importe')"
                >$</button>
              </div>
              <div class="input-with-prefix">
                <span class="input-prefix">{{ tipoAjuste() === 'porcentaje' ? '%' : '$' }}</span>
                <input
                  type="number"
                  formControlName="valorAjuste"
                  class="form-input form-input-prefixed"
                  placeholder="0"
                  [class.form-input-error]="isFieldInvalid('valorAjuste')"
                />
              </div>
            </div>
            @if (isFieldInvalid('valorAjuste')) {
              <span class="form-error">El valor de ajuste es requerido y no puede ser 0</span>
            }
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || isSubmitting()">
              @if (isSubmitting()) {
                <span class="spinner spinner-sm"></span>
              }
              Crear Lista
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
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
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

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

    .dialog-header { padding: 28px 28px 0; }
    .dialog-title { font-size: 22px; font-weight: 600; color: var(--text-heading); margin: 0 0 6px 0; }
    .dialog-subtitle { font-size: 14px; color: var(--slate-500); margin: 0; }

    .dialog-form { padding: 24px 28px 28px; }
    .form-group { margin-bottom: 20px; }
    .form-label { display: block; font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }

    .form-input {
      width: 100%;
      padding: 12px 14px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-primary);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 10px;
      transition: all 0.15s ease;
      box-sizing: border-box;
    }
    .form-input:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1); }
    .form-input::placeholder { color: var(--slate-400); }
    .form-input-error { border-color: var(--danger-color); }
    .form-error { display: block; margin-top: 6px; font-size: 12px; color: var(--danger-color); }

    .form-select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 40px;
      cursor: pointer;
    }

    /* Ajuste row */
    .ajuste-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toggle-group {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }

    .toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      font-size: 16px;
      font-weight: 600;
      font-family: inherit;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      background: white;
      color: var(--slate-500);
    }
    .toggle-btn:hover { border-color: var(--slate-300); background: var(--slate-50); }

    .toggle-active-percent {
      background: #60A5FA;
      color: white;
      border-color: #60A5FA;
    }
    .toggle-active-percent:hover {
      background: #3B82F6;
      border-color: #3B82F6;
    }

    .toggle-active-fixed {
      background: var(--primary-orange);
      color: white;
      border-color: var(--primary-orange);
    }
    .toggle-active-fixed:hover {
      background: var(--primary-orange-hover);
      border-color: var(--primary-orange-hover);
    }

    .input-with-prefix {
      display: flex;
      align-items: center;
      border: 1px solid var(--slate-200);
      border-radius: 10px;
      overflow: hidden;
      transition: all 0.15s ease;
      flex: 1;
    }
    .input-with-prefix:focus-within {
      border-color: var(--primary-orange);
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }
    .input-prefix {
      padding: 12px 0 12px 14px;
      font-size: 14px;
      color: var(--slate-500);
      font-weight: 500;
    }
    .form-input-prefixed {
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      padding-left: 4px !important;
    }
    .form-input-prefixed:focus { outline: none; }

    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 12px; }

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

    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    .spinner-sm { width: 14px; height: 14px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevaListaDialogComponent implements OnInit {
  @Output() guardar = new EventEmitter<NuevaListaFormData>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;
  isSubmitting = signal(false);
  tipoAjuste = signal<'porcentaje' | 'importe'>('porcentaje');

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      precioBase: ['default'],
      valorAjuste: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  setTipoAjuste(tipo: 'porcentaje' | 'importe'): void {
    this.tipoAjuste.set(tipo);
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
    const data: NuevaListaFormData = {
      nombre: this.form.value.nombre,
      precioBase: this.form.value.precioBase,
      tipoAjuste: this.tipoAjuste(),
      valorAjuste: this.form.value.valorAjuste,
    };
    this.guardar.emit(data);
  }
}
