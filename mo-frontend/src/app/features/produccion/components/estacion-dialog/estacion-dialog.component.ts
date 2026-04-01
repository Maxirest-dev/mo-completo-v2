import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, inject, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstacionTipo } from '../../models/produccion-grid.model';

export interface EstacionCreateData {
  nombre: string;
  tipo: EstacionTipo;
}

const TIPO_OPTIONS: { value: EstacionTipo; label: string }[] = [
  { value: 'COCINA', label: 'Cocina' },
  { value: 'PARRILLA', label: 'Parrilla' },
  { value: 'MOSTRADOR', label: 'Mostrador' },
  { value: 'BARRA', label: 'Barra' },
];

@Component({
  selector: 'app-estacion-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <h2 class="dialog-title">{{ isEdit ? 'Editar estacion' : 'Nueva estacion de trabajo' }}</h2>
          <p class="dialog-subtitle">{{ isEdit ? 'Modifica los datos de la estacion.' : 'Crea una nueva estacion donde se preparan items.' }}</p>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
          <div class="form-group">
            <label for="nombre" class="form-label">Nombre <span class="required">*</span></label>
            <input id="nombre" type="text" formControlName="nombre" class="form-input"
              placeholder="Ej: Cocina fria" [class.form-input-error]="isFieldInvalid('nombre')"/>
            @if (isFieldInvalid('nombre')) {
              <span class="form-error">El nombre es requerido</span>
            }
          </div>

          <div class="form-group">
            <label for="tipo" class="form-label">Tipo <span class="required">*</span></label>
            <select id="tipo" formControlName="tipo" class="form-select">
              @for (t of tipoOptions; track t.value) {
                <option [value]="t.value">{{ t.label }}</option>
              }
            </select>
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" (click)="cancelar.emit()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || isSubmitting()">
              @if (isSubmitting()) { <span class="spinner"></span> }
              {{ isEdit ? 'Guardar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px;
    }
    .dialog-container {
      background: white; border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      width: 100%; max-width: 440px;
    }
    .dialog-header { padding: 28px 28px 0; }
    .dialog-title { font-size: 22px; font-weight: 600; color: var(--text-heading); margin: 0 0 6px; }
    .dialog-subtitle { font-size: 14px; color: var(--slate-500); margin: 0; }
    .dialog-form { padding: 24px 28px 28px; }
    .form-group { margin-bottom: 20px; }
    .form-label { display: block; font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
    .required { color: var(--danger-color); }
    .form-input, .form-select {
      width: 100%; padding: 12px 14px; font-size: 14px; font-family: inherit;
      color: var(--text-primary); background: white; border: 1px solid var(--slate-200);
      border-radius: 10px; transition: all 0.15s;
    }
    .form-input:focus, .form-select:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
    .form-input-error { border-color: var(--danger-color); }
    .form-error { display: block; margin-top: 6px; font-size: 12px; color: var(--danger-color); }
    .form-select { cursor: pointer; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center; background-size: 16px; padding-right: 44px;
    }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 12px; }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 24px; font-size: 14px; font-weight: 500; font-family: inherit;
      border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s;
    }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background: var(--text-heading); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--text-primary); }
    .btn-secondary { background: white; color: var(--text-primary); border: 1px solid var(--slate-200); }
    .btn-secondary:hover { background: var(--slate-50); }
    .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstacionDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  @Input() estacion?: { id: number; nombre: string; tipo: EstacionTipo };
  @Output() guardar = new EventEmitter<EstacionCreateData>();
  @Output() cancelar = new EventEmitter<void>();

  tipoOptions = TIPO_OPTIONS;
  isSubmitting = signal(false);
  isEdit = false;

  form!: FormGroup;

  ngOnInit(): void {
    this.isEdit = !!this.estacion;
    this.form = this.fb.group({
      nombre: [this.estacion?.nombre ?? '', [Validators.required, Validators.minLength(2)]],
      tipo: [this.estacion?.tipo ?? 'COCINA', [Validators.required]],
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
    this.isSubmitting.set(true);
    this.guardar.emit(this.form.value as EstacionCreateData);
  }
}
