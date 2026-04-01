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
import { PreciosFormData } from '../../models/producto-perfil.model';

@Component({
  selector: 'app-precios-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <h2 class="dialog-title">Editar Precios</h2>
          <p class="dialog-subtitle">Modifica los precios del producto para cada canal de venta.</p>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
          <div class="form-group">
            <label for="precioSalon" class="form-label">Precio Salon</label>
            <div class="input-with-prefix">
              <span class="input-prefix">$</span>
              <input
                id="precioSalon"
                type="number"
                formControlName="precioSalon"
                class="form-input form-input-prefixed"
                placeholder="0"
                [class.form-input-error]="isFieldInvalid('precioSalon')"
              />
            </div>
            @if (isFieldInvalid('precioSalon')) {
              <span class="form-error">El precio es requerido y debe ser mayor a 0</span>
            }
          </div>

          <div class="form-group">
            <label for="precioDelivery" class="form-label">Precio Delivery</label>
            <div class="input-with-prefix">
              <span class="input-prefix">$</span>
              <input
                id="precioDelivery"
                type="number"
                formControlName="precioDelivery"
                class="form-input form-input-prefixed"
                placeholder="0"
                [class.form-input-error]="isFieldInvalid('precioDelivery')"
              />
            </div>
            @if (isFieldInvalid('precioDelivery')) {
              <span class="form-error">El precio es requerido y debe ser mayor a 0</span>
            }
          </div>

          <div class="form-group">
            <label for="precioMostrador" class="form-label">Precio Mostrador</label>
            <div class="input-with-prefix">
              <span class="input-prefix">$</span>
              <input
                id="precioMostrador"
                type="number"
                formControlName="precioMostrador"
                class="form-input form-input-prefixed"
                placeholder="0"
                [class.form-input-error]="isFieldInvalid('precioMostrador')"
              />
            </div>
            @if (isFieldInvalid('precioMostrador')) {
              <span class="form-error">El precio es requerido y debe ser mayor a 0</span>
            }
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
      max-width: 420px;
      max-height: 90vh;
      overflow-y: auto;
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

    .input-with-prefix {
      display: flex;
      align-items: center;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      overflow: hidden;
      transition: all 0.15s ease;
    }
    .input-with-prefix:focus-within {
      border-color: #F97316;
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }
    .input-prefix {
      padding: 12px 0 12px 14px;
      font-size: 14px;
      color: #6B7280;
      font-weight: 500;
    }
    .form-input-prefixed {
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      padding-left: 4px !important;
    }
    .form-input-prefixed:focus { outline: none; }

    .form-input {
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
    .form-input:focus { outline: none; border-color: #F97316; box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1); }
    .form-input::placeholder { color: #9CA3AF; }
    .form-input-error { border-color: #EF4444; }
    .form-error { display: block; margin-top: 6px; font-size: 12px; color: #EF4444; }

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
export class PreciosDialogComponent implements OnInit {
  @Input() precioSalon = 0;
  @Input() precioDelivery = 0;
  @Input() precioMostrador = 0;
  @Output() guardar = new EventEmitter<PreciosFormData>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      precioSalon: [this.precioSalon, [Validators.required, Validators.min(1)]],
      precioDelivery: [this.precioDelivery, [Validators.required, Validators.min(1)]],
      precioMostrador: [this.precioMostrador, [Validators.required, Validators.min(1)]],
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
    this.guardar.emit(this.form.value);
  }

  resetSubmitting(): void {
    this.isSubmitting.set(false);
  }
}
