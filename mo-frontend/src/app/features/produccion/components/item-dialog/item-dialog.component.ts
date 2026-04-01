import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, computed, inject, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduccionGridRow, EstacionProduccionRow } from '../../models/produccion-grid.model';

export interface ItemFormData {
  nombre: string;
  tipo: 'TRANSFORMACION' | 'ELABORADO';
  estacionId: number;
  insumoOrigenNombre: string;
  origenCantidad: number;
  resultadoCantidad: number;
  unidadMedida: string;
  unidadMedidaOrigen: string;
  tipoTransformacion?: string;
  vencimiento?: string;
}

@Component({
  selector: 'app-item-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <h2 class="dialog-title">{{ isEdit ? 'Editar item' : 'Nuevo item' }}</h2>
          <p class="dialog-subtitle">{{ isEdit ? 'Modifica los datos del item.' : 'Agrega un nuevo item a la estacion.' }}</p>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
          <div class="form-group">
            <label class="form-label">Nombre <span class="required">*</span></label>
            <input type="text" formControlName="nombre" class="form-input" placeholder="Ej: Rebanadas de tomate"
              [class.form-input-error]="isFieldInvalid('nombre')"/>
            @if (isFieldInvalid('nombre')) { <span class="form-error">El nombre es requerido</span> }
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Tipo <span class="required">*</span></label>
              <select formControlName="tipo" class="form-select">
                <option value="TRANSFORMACION">Transformacion</option>
                <option value="ELABORADO">Elaborado</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Estacion <span class="required">*</span></label>
              <select formControlName="estacionId" class="form-select">
                @for (est of estaciones; track est.id) {
                  <option [value]="est.id">{{ est.nombre }}</option>
                }
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Insumo de origen <span class="required">*</span></label>
            <input type="text" formControlName="insumoOrigenNombre" class="form-input" placeholder="Ej: Tomate"/>
          </div>

          @if (form.get('tipo')?.value === 'TRANSFORMACION') {
            <div class="form-group">
              <label class="form-label">Tipo de transformacion</label>
              <input type="text" formControlName="tipoTransformacion" class="form-input" placeholder="Ej: rebanar, cortar, empanar..."/>
            </div>
          }

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Cantidad origen</label>
              <input type="number" formControlName="origenCantidad" class="form-input" placeholder="1" min="1"/>
            </div>
            <div class="form-group">
              <label class="form-label">Unidad origen</label>
              <select formControlName="unidadMedidaOrigen" class="form-select">
                <option value="kg">kg</option>
                <option value="lt">lt</option>
                <option value="unidad">unidad</option>
                <option value="gr">gr</option>
                <option value="ml">ml</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Cantidad resultado</label>
              <input type="number" formControlName="resultadoCantidad" class="form-input" placeholder="1" min="1"/>
            </div>
            <div class="form-group">
              <label class="form-label">Unidad resultado</label>
              <select formControlName="unidadMedida" class="form-select">
                <option value="unidades">unidades</option>
                <option value="kg">kg</option>
                <option value="gr">gr</option>
                <option value="lt">lt</option>
                <option value="ml">ml</option>
                <option value="porciones">porciones</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Vencimiento</label>
            <input type="date" formControlName="vencimiento" class="form-input"/>
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" (click)="cancelar.emit()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid">{{ isEdit ? 'Guardar' : 'Crear' }}</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
    .dialog-container { background: white; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; }
    .dialog-header { padding: 28px 28px 0; }
    .dialog-title { font-size: 22px; font-weight: 600; color: #1F2937; margin: 0 0 6px; }
    .dialog-subtitle { font-size: 14px; color: #6B7280; margin: 0; }
    .dialog-form { padding: 24px 28px 28px; }
    .form-group { margin-bottom: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .form-label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px; }
    .required { color: #EF4444; }
    .form-input, .form-select {
      width: 100%; padding: 10px 12px; font-size: 14px; font-family: inherit;
      color: #374151; background: white; border: 1px solid #E5E7EB; border-radius: 10px; transition: all 0.15s;
    }
    .form-input:focus, .form-select:focus { outline: none; border-color: #F97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
    .form-input-error { border-color: #EF4444; }
    .form-error { display: block; margin-top: 4px; font-size: 12px; color: #EF4444; }
    .form-select { cursor: pointer; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; padding-right: 40px;
    }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 8px; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; font-size: 14px; font-weight: 500; font-family: inherit; border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background: #1F2937; color: white; }
    .btn-primary:hover:not(:disabled) { background: #374151; }
    .btn-secondary { background: white; color: #374151; border: 1px solid #E5E7EB; }
    .btn-secondary:hover { background: #F9FAFB; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  @Input() item?: ProduccionGridRow;
  @Input() estaciones: EstacionProduccionRow[] = [];
  @Input() preselectedEstacionId?: number;
  @Output() guardar = new EventEmitter<ItemFormData>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;
  get isEdit(): boolean { return !!this.item; }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [this.item?.nombre ?? '', [Validators.required, Validators.minLength(2)]],
      tipo: [this.item?.tipo ?? 'TRANSFORMACION'],
      estacionId: [this.item?.estacionId ?? this.preselectedEstacionId ?? '', [Validators.required]],
      insumoOrigenNombre: [this.item?.insumoOrigenNombre ?? '', [Validators.required]],
      tipoTransformacion: [this.item?.tipoTransformacion ?? ''],
      origenCantidad: [this.item?.origenCantidad ?? 1],
      unidadMedidaOrigen: [this.item?.unidadMedidaOrigen ?? 'kg'],
      resultadoCantidad: [this.item?.resultadoCantidad ?? 1],
      unidadMedida: [this.item?.unidadMedida ?? 'unidades'],
      vencimiento: [this.item?.vencimiento ?? ''],
    });
  }

  isFieldInvalid(field: string): boolean {
    const f = this.form.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancelar.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardar.emit(this.form.value as ItemFormData);
  }
}
