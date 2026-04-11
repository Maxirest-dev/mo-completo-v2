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
import { PreciosFormData, PrecioStrategy, PizzaTamano } from '../../models/producto-perfil.model';

@Component({
  selector: 'app-precios-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <h2 class="dialog-title">Editar Precios</h2>
          <p class="dialog-subtitle">{{ isPizzaMode ? 'Los precios se definen por tamano en la configuracion.' : 'Modifica los precios del producto para cada canal de venta.' }}</p>
        </header>

        @if (isPizzaMode) {
          <div class="dialog-form">
            <div class="pizza-precios-list">
              @for (tam of pizzaTamanos; track tam.id) {
                <div class="pizza-precio-row">
                  <span class="pizza-precio-icon">🍕</span>
                  <span class="pizza-precio-name">{{ tam.nombre }}</span>
                  <span class="pizza-precio-detail">{{ tam.porciones }} porciones</span>
                  <span class="pizza-precio-value">{{ formatPrice(tam.precio) }}</span>
                </div>
              } @empty {
                <div class="pizza-precios-empty">Sin tamanos configurados</div>
              }
            </div>
            <p class="pizza-precios-hint">Para modificar los precios, edita los tamanos desde Configuracion.</p>
            <div class="dialog-actions">
              <button type="button" class="btn btn-secondary" (click)="onCancel()">Cerrar</button>
            </div>
          </div>
        } @else {

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
          @if (isCombo) {
            <div class="form-group">
              <label class="form-label">Toma de precio</label>
              <select class="form-select" formControlName="precioStrategy" (change)="onStrategyChange()">
                <option value="suma">Suma de todos los productos</option>
                <option value="mayor">Toma precio del producto mas caro</option>
                <option value="manual">Manual (definido manualmente)</option>
              </select>
            </div>

            @if (currentStrategy() === 'manual') {
              <div class="form-group">
                <label for="precioSalon" class="form-label">Precio</label>
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
            } @else {
              <div class="form-group">
                <label class="form-label">Precio calculado</label>
                <div class="input-with-prefix input-readonly">
                  <span class="input-prefix">$</span>
                  <span class="readonly-value">{{ formatPrice(precioCalculado()) }}</span>
                </div>
                <span class="form-hint">{{ currentStrategy() === 'suma' ? 'Calculado sumando el precio de todos los productos del agrupador' : 'Toma el precio del producto mas caro del agrupador' }}</span>
              </div>
            }
          } @else {
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
          }

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
        }
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
    .dialog-title { font-size: 22px; font-weight: 600; color: var(--text-heading); margin: 0 0 6px 0; }
    .dialog-subtitle { font-size: 14px; color: var(--slate-500); margin: 0; }

    .dialog-form { padding: 24px 28px 28px; }
    .form-group { margin-bottom: 20px; }
    .form-label { display: block; font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }

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
    }
    .form-input:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1); }
    .form-input::placeholder { color: var(--slate-400); }
    .form-input-error { border-color: var(--danger-color); }
    .form-error { display: block; margin-top: 6px; font-size: 12px; color: var(--danger-color); }

    .form-select {
      width: 100%;
      padding: 12px 14px;
      padding-right: 36px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-primary);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 10px;
      transition: all 0.15s ease;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
    }
    .form-select:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1); }

    .input-readonly {
      background: var(--slate-50);
      border-color: var(--slate-200);
    }

    .readonly-value {
      padding: 12px 4px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-heading);
    }

    .form-hint {
      display: block;
      margin-top: 6px;
      font-size: 12px;
      color: var(--slate-400);
      line-height: 1.4;
    }

    .pizza-precios-list {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .pizza-precio-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 0;
      border-bottom: 1px solid var(--slate-100);
    }

    .pizza-precio-row:last-child { border-bottom: none; }

    .pizza-precio-icon { font-size: 18px; flex-shrink: 0; }
    .pizza-precio-name { font-size: 14px; font-weight: 600; color: var(--text-heading); }
    .pizza-precio-detail { font-size: 12px; color: var(--slate-400); flex: 1; }
    .pizza-precio-value { font-size: 16px; font-weight: 700; color: var(--text-heading); }

    .pizza-precios-empty {
      padding: 20px 0;
      text-align: center;
      font-size: 13px;
      color: var(--slate-400);
    }

    .pizza-precios-hint {
      font-size: 12px;
      color: var(--slate-400);
      margin: 12px 0 0;
      padding: 8px 12px;
      background: var(--slate-50);
      border-radius: 8px;
      line-height: 1.4;
    }

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
export class PreciosDialogComponent implements OnInit {
  @Input() precioSalon = 0;
  @Input() precioDelivery = 0;
  @Input() precioMostrador = 0;
  @Input() isCombo = false;
  @Input() isPizzaMode = false;
  @Input() pizzaTamanos: PizzaTamano[] = [];
  @Input() precioStrategy: PrecioStrategy = 'manual';
  @Input() precioSuma = 0;
  @Input() precioMayor = 0;
  @Output() guardar = new EventEmitter<PreciosFormData & { precioStrategy?: PrecioStrategy }>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;
  isSubmitting = signal(false);
  currentStrategy = signal<PrecioStrategy>('manual');

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.currentStrategy.set(this.precioStrategy);
    this.form = this.fb.group({
      precioSalon: [this.precioSalon, [Validators.required, Validators.min(1)]],
      precioDelivery: [this.precioDelivery, [Validators.required, Validators.min(1)]],
      precioMostrador: [this.precioMostrador, [Validators.required, Validators.min(1)]],
      ...(this.isCombo ? { precioStrategy: [this.precioStrategy] } : {}),
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onStrategyChange(): void {
    this.currentStrategy.set(this.form.get('precioStrategy')?.value ?? 'manual');
  }

  precioCalculado(): number {
    return this.currentStrategy() === 'suma' ? this.precioSuma : this.precioMayor;
  }

  formatPrice(value: number): string {
    return value.toLocaleString('es-AR');
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
