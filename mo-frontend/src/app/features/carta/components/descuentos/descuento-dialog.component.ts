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
import { Descuento, DescuentoFormData, TipoDescuento } from '../../models/descuento.model';

@Component({
  selector: 'app-descuento-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <h2 class="dialog-title">{{ descuento ? 'Editar descuento' : 'Nuevo descuento' }}</h2>
          <p class="dialog-subtitle">{{ descuento ? 'Modifica los datos del descuento.' : 'Completa los datos para crear un nuevo descuento.' }}</p>
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
              placeholder="Ej: Promos Noche"
              [class.form-input-error]="isFieldInvalid('nombre')"
            />
            @if (isFieldInvalid('nombre')) {
              <span class="form-error">El nombre es requerido</span>
            }
          </div>

          <!-- Tipo de descuento -->
          <div class="form-group">
            <label class="form-label">Tipo de descuento</label>
            <div class="tipo-toggle">
              <button
                type="button"
                class="tipo-btn"
                [class.tipo-btn-active]="form.get('tipoDescuento')?.value === 'porcentaje'"
                (click)="setTipo('porcentaje')"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5 19.5 4.5M6.75 6.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm12 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                </svg>
                Porcentaje
              </button>
              <button
                type="button"
                class="tipo-btn"
                [class.tipo-btn-active]="form.get('tipoDescuento')?.value === 'importe'"
                (click)="setTipo('importe')"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                Importe fijo
              </button>
            </div>
          </div>

          <!-- Cantidad -->
          <div class="form-group">
            <label for="cantidad" class="form-label">
              {{ form.get('tipoDescuento')?.value === 'porcentaje' ? 'Porcentaje' : 'Importe' }}
            </label>
            <div class="input-with-prefix">
              <span class="input-prefix">{{ form.get('tipoDescuento')?.value === 'porcentaje' ? '%' : '$' }}</span>
              <input
                id="cantidad"
                type="number"
                formControlName="cantidad"
                class="form-input form-input-prefixed"
                [placeholder]="form.get('tipoDescuento')?.value === 'porcentaje' ? '10' : '5000'"
                [class.form-input-error]="isFieldInvalid('cantidad')"
              />
            </div>
            @if (isFieldInvalid('cantidad')) {
              <span class="form-error">
                {{ form.get('tipoDescuento')?.value === 'porcentaje'
                  ? 'Ingresa un porcentaje entre 1 y 100'
                  : 'El importe debe ser mayor a 0' }}
              </span>
            }
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || isSubmitting()">
              @if (isSubmitting()) {
                <span class="spinner spinner-sm"></span>
              }
              {{ descuento ? 'Guardar' : 'Crear' }}
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
      max-width: 440px;
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
    .form-input-error { border-color: var(--danger-color) !important; }
    .form-error { display: block; margin-top: 6px; font-size: 12px; color: var(--danger-color); }

    /* Tipo toggle */
    .tipo-toggle {
      display: flex;
      gap: 8px;
    }

    .tipo-btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: var(--slate-500);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .tipo-btn:hover {
      border-color: var(--slate-300);
      background: var(--slate-50);
    }
    .tipo-btn-active {
      color: var(--primary-orange);
      border-color: var(--primary-orange);
      background: #FFF7ED;
    }
    .tipo-btn-active:hover {
      background: #FFF7ED;
      border-color: var(--primary-orange);
    }

    /* Input with prefix */
    .input-with-prefix {
      display: flex;
      align-items: center;
      border: 1px solid var(--slate-200);
      border-radius: 10px;
      overflow: hidden;
      transition: all 0.15s ease;
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
export class DescuentoDialogComponent implements OnInit {
  @Input() descuento: Descuento | null = null;
  @Output() guardar = new EventEmitter<DescuentoFormData>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [this.descuento?.nombre ?? '', [Validators.required]],
      tipoDescuento: [this.descuento?.tipoDescuento ?? 'porcentaje'],
      cantidad: [this.descuento?.cantidad ?? null, [Validators.required, Validators.min(1)]],
    });
  }

  setTipo(tipo: TipoDescuento): void {
    this.form.patchValue({ tipoDescuento: tipo, cantidad: null });
    this.form.get('cantidad')?.markAsUntouched();
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
    this.guardar.emit(this.form.value);
  }

  resetSubmitting(): void {
    this.isSubmitting.set(false);
  }
}
