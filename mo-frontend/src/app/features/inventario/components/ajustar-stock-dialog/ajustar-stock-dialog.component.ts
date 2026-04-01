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
import { InsumoGridRow } from '../../models/inventario-grid.model';
import { Deposito } from '../../models/deposito.model';

export type TipoAjuste = 'ingreso' | 'egreso' | 'transferencia';

export interface AjusteStockData {
  tipoAjuste: TipoAjuste;
  insumoId: number;
  depositoOrigenId: number;
  cantidad: number;
  motivo: string;
  depositoDestinoId?: number;
}

@Component({
  selector: 'app-ajustar-stock-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Backdrop -->
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <!-- Dialog Container -->
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <!-- Header -->
        <header class="dialog-header">
          <h2 class="dialog-title">Ajustar Stock</h2>
          <div class="dialog-insumo-info">
            <span class="insumo-name">{{ insumo.nombre }}</span>
            <span class="insumo-stock">
              Stock actual: <strong>{{ insumo.stockActual }}</strong> {{ insumo.unidadMedida }}
            </span>
          </div>
        </header>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
          <!-- Tipo de ajuste: radio buttons -->
          <div class="form-group">
            <label class="form-label">Tipo de ajuste</label>
            <div class="radio-group">
              <label class="radio-option" [class.radio-selected]="tipoAjuste() === 'ingreso'">
                <input type="radio" formControlName="tipoAjuste" value="ingreso" />
                <span class="radio-dot"></span>
                <div class="radio-content">
                  <span class="radio-label">Ingreso</span>
                  <span class="radio-desc">Agregar stock</span>
                </div>
              </label>
              <label class="radio-option" [class.radio-selected]="tipoAjuste() === 'egreso'">
                <input type="radio" formControlName="tipoAjuste" value="egreso" />
                <span class="radio-dot"></span>
                <div class="radio-content">
                  <span class="radio-label">Egreso</span>
                  <span class="radio-desc">Retirar stock</span>
                </div>
              </label>
              <label class="radio-option" [class.radio-selected]="tipoAjuste() === 'transferencia'">
                <input type="radio" formControlName="tipoAjuste" value="transferencia" />
                <span class="radio-dot"></span>
                <div class="radio-content">
                  <span class="radio-label">Transferencia</span>
                  <span class="radio-desc">Mover a otro deposito</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Cantidad -->
          <div class="form-group">
            <label for="cantidad" class="form-label">Cantidad ({{ insumo.unidadMedida }})</label>
            <input
              id="cantidad"
              type="number"
              formControlName="cantidad"
              class="form-input"
              placeholder="0"
              min="1"
              [class.form-input-error]="isFieldInvalid('cantidad')"
            />
            @if (isFieldInvalid('cantidad')) {
              <span class="form-error">{{ getCantidadError() }}</span>
            }
          </div>

          <!-- Deposito destino (solo transferencia) -->
          @if (tipoAjuste() === 'transferencia') {
            <div class="form-group">
              <label for="depositoDestinoId" class="form-label">Deposito destino</label>
              <select
                id="depositoDestinoId"
                formControlName="depositoDestinoId"
                class="form-select"
                [class.form-input-error]="isFieldInvalid('depositoDestinoId')"
              >
                <option [ngValue]="null">Seleccionar deposito</option>
                @for (dep of depositosDestino(); track dep.id) {
                  <option [ngValue]="dep.id">{{ dep.nombre }}</option>
                }
              </select>
              @if (isFieldInvalid('depositoDestinoId')) {
                <span class="form-error">El deposito destino es requerido</span>
              }
            </div>
          }

          <!-- Motivo -->
          <div class="form-group">
            <label for="motivo" class="form-label">Motivo <span class="label-optional">(opcional)</span></label>
            <input
              id="motivo"
              type="text"
              formControlName="motivo"
              class="form-input"
              placeholder="Ej: Compra de mercaderia, ajuste por inventario..."
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
              Confirmar ajuste
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
      max-width: 480px;
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
      margin: 0 0 12px 0;
    }

    .dialog-insumo-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--slate-50);
      border-radius: 10px;
      border: 1px solid var(--slate-200);
    }

    .insumo-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .insumo-stock {
      font-size: 13px;
      color: var(--slate-500);
    }

    .insumo-stock strong {
      color: var(--primary-orange);
      font-weight: 600;
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

    .label-optional {
      font-weight: 400;
      color: var(--slate-400);
      font-size: 12px;
    }

    /* Radio group */
    .radio-group {
      display: flex;
      gap: 8px;
    }

    .radio-option {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border: 1px solid var(--slate-200);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
      background: white;
    }

    .radio-option:hover {
      border-color: var(--slate-300);
      background: var(--slate-50);
    }

    .radio-option input[type="radio"] {
      display: none;
    }

    .radio-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid var(--slate-300);
      flex-shrink: 0;
      transition: all 0.15s ease;
      position: relative;
    }

    .radio-selected .radio-dot {
      border-color: var(--primary-orange);
    }

    .radio-selected .radio-dot::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--primary-orange);
    }

    .radio-selected {
      border-color: var(--primary-orange);
      background: #FFF7ED;
    }

    .radio-content {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .radio-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .radio-desc {
      font-size: 11px;
      color: var(--slate-400);
      white-space: nowrap;
    }

    .radio-selected .radio-label {
      color: var(--primary-orange-hover);
    }

    /* Inputs */
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

      .radio-group {
        flex-direction: column;
      }

      .dialog-insumo-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustarStockDialogComponent implements OnInit {
  @Input({ required: true }) insumo!: InsumoGridRow;
  @Input() depositos: Deposito[] = [];
  @Input() depositoActualId: number = 0;
  @Output() guardar = new EventEmitter<AjusteStockData>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;
  isSubmitting = signal(false);

  tipoAjuste = signal<TipoAjuste>('ingreso');

  depositosDestino = computed(() =>
    this.depositos.filter(d => d.id !== this.depositoActualId && d.activo)
  );

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      tipoAjuste: ['ingreso'],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      motivo: [''],
      depositoDestinoId: [null],
    });

    this.form.get('tipoAjuste')!.valueChanges.subscribe((tipo: TipoAjuste) => {
      this.tipoAjuste.set(tipo);
      this.updateValidators(tipo);
    });
  }

  private updateValidators(tipo: TipoAjuste): void {
    const cantidadCtrl = this.form.get('cantidad')!;
    const destinoCtrl = this.form.get('depositoDestinoId')!;

    if (tipo === 'ingreso') {
      cantidadCtrl.setValidators([Validators.required, Validators.min(1)]);
      destinoCtrl.clearValidators();
      destinoCtrl.setValue(null);
    } else if (tipo === 'egreso') {
      cantidadCtrl.setValidators([Validators.required, Validators.min(1), Validators.max(this.insumo.stockActual)]);
      destinoCtrl.clearValidators();
      destinoCtrl.setValue(null);
    } else {
      cantidadCtrl.setValidators([Validators.required, Validators.min(1), Validators.max(this.insumo.stockActual)]);
      destinoCtrl.setValidators([Validators.required]);
    }

    cantidadCtrl.updateValueAndValidity();
    destinoCtrl.updateValueAndValidity();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getCantidadError(): string {
    const cantidadCtrl = this.form.get('cantidad');
    if (!cantidadCtrl) return '';

    if (cantidadCtrl.hasError('required')) return 'La cantidad es requerida';
    if (cantidadCtrl.hasError('min')) return 'La cantidad debe ser mayor a 0';
    if (cantidadCtrl.hasError('max')) return `La cantidad no puede superar el stock actual (${this.insumo.stockActual})`;
    return '';
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
    const data: AjusteStockData = {
      tipoAjuste: formValue.tipoAjuste,
      insumoId: this.insumo.id,
      depositoOrigenId: this.depositoActualId,
      cantidad: formValue.cantidad,
      motivo: formValue.motivo?.trim() || '',
      ...(formValue.tipoAjuste === 'transferencia' && { depositoDestinoId: formValue.depositoDestinoId }),
    };

    this.guardar.emit(data);
  }

  resetSubmitting(): void {
    this.isSubmitting.set(false);
  }
}
