import { Component, ChangeDetectionStrategy, input, output, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empleado, RolGastronomico, EstadoEmpleado } from '../../models';

const ROLES: RolGastronomico[] = ['Mozo', 'Cocinero', 'Bachero', 'Manager', 'Bartender', 'Cajero', 'Delivery'];
const ESTADOS: EstadoEmpleado[] = ['Trabajando', 'Franco', 'Vacaciones', 'Licencia', 'Desvinculado'];

@Component({
  selector: 'app-empleado-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <!-- Header -->
        <header class="dialog-header">
          <h2 class="dialog-title">{{ dialogTitle() }}</h2>
          <p class="dialog-subtitle">Completa los datos del empleado.</p>
        </header>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
          <!-- Row: Nombre + DNI -->
          <div class="form-row">
            <div class="form-group form-group-flex">
              <label for="nombre" class="form-label">Nombre completo</label>
              <input id="nombre" type="text" formControlName="nombre" class="form-input"
                placeholder="Ej: María López" [class.form-input-error]="isFieldInvalid('nombre')" />
              @if (isFieldInvalid('nombre')) {
                <span class="form-error">El nombre es requerido</span>
              }
            </div>
            <div class="form-group form-group-flex">
              <label for="dni" class="form-label">DNI</label>
              <input id="dni" type="text" formControlName="dni" class="form-input"
                placeholder="Ej: 35.678.901" [class.form-input-error]="isFieldInvalid('dni')" />
              @if (isFieldInvalid('dni')) {
                <span class="form-error">El DNI es requerido</span>
              }
            </div>
          </div>

          <!-- Row: CUIL + Rol -->
          <div class="form-row">
            <div class="form-group form-group-flex">
              <label for="cuil" class="form-label">CUIL</label>
              <input id="cuil" type="text" formControlName="cuil" class="form-input"
                placeholder="Ej: 27-35678901-4" />
            </div>
            <div class="form-group form-group-flex">
              <label for="rol" class="form-label">Rol</label>
              <select id="rol" formControlName="rol" class="form-select"
                [class.form-input-error]="isFieldInvalid('rol')">
                <option value="">Seleccionar rol</option>
                @for (r of roles; track r) { <option [value]="r">{{ r }}</option> }
              </select>
              @if (isFieldInvalid('rol')) {
                <span class="form-error">El rol es requerido</span>
              }
            </div>
          </div>

          <!-- Row: Teléfono + Email -->
          <div class="form-row">
            <div class="form-group form-group-flex">
              <label for="telefono" class="form-label">Teléfono</label>
              <input id="telefono" type="text" formControlName="telefono" class="form-input"
                placeholder="Ej: 11-4567-8901" />
            </div>
            <div class="form-group form-group-flex">
              <label for="email" class="form-label">Email</label>
              <input id="email" type="email" formControlName="email" class="form-input"
                placeholder="Ej: nombre@mail.com" />
            </div>
          </div>

          <!-- Row: Contacto emergencia + Estado -->
          <div class="form-row">
            <div class="form-group form-group-flex">
              <label for="contactoEmergencia" class="form-label">Contacto de emergencia</label>
              <input id="contactoEmergencia" type="text" formControlName="contactoEmergencia" class="form-input"
                placeholder="Ej: 11-9876-5432" />
            </div>
            <div class="form-group form-group-flex">
              <label for="estado" class="form-label">Estado</label>
              <select id="estado" formControlName="estado" class="form-select">
                @for (e of estados; track e) { <option [value]="e">{{ e }}</option> }
              </select>
            </div>
          </div>

          <!-- Row: Sueldo + Hora extra -->
          <div class="form-row">
            <div class="form-group form-group-flex">
              <label for="sueldoBase" class="form-label">Sueldo base</label>
              <input id="sueldoBase" type="number" formControlName="sueldoBase" class="form-input"
                placeholder="Ej: 380000" />
            </div>
            <div class="form-group form-group-flex">
              <label for="valorHoraExtra" class="form-label">Valor hora extra</label>
              <input id="valorHoraExtra" type="number" formControlName="valorHoraExtra" class="form-input"
                placeholder="Ej: 3200" />
            </div>
          </div>

          <!-- Actions -->
          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || isSubmitting()">
              @if (isSubmitting()) { <span class="spinner spinner-sm"></span> }
              {{ submitButtonText() }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed; inset: 0; background-color: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px; animation: fadeIn 0.15s ease-out;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .dialog-container {
      background: white; border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto;
      animation: slideUp 0.2s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dialog-header { padding: 28px 28px 0; }
    .dialog-title { font-size: 22px; font-weight: 600; color: var(--text-heading, #0F172B); margin: 0 0 6px; }
    .dialog-subtitle { font-size: 14px; color: var(--slate-500); margin: 0; }

    .dialog-form { padding: 24px 28px 28px; }

    .form-row { display: flex; gap: 16px; }
    .form-group { margin-bottom: 20px; }
    .form-group-flex { flex: 1; }

    .form-label { display: block; font-size: 14px; font-weight: 600; color: var(--text-primary, #314158); margin-bottom: 8px; }

    .form-input, .form-select {
      width: 100%; padding: 12px 14px; font-size: 14px; font-family: inherit;
      color: var(--text-primary, #314158); background: white;
      border: 1px solid var(--slate-200, #E2E8F0); border-radius: 10px;
      transition: all 0.15s ease; box-sizing: border-box;
    }
    .form-input:focus, .form-select:focus {
      outline: none; border-color: var(--primary-orange, #F27920);
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }
    .form-input::placeholder { color: var(--slate-400); }
    .form-input-error { border-color: var(--danger-color, #EF4444); }
    .form-input-error:focus { border-color: var(--danger-color, #EF4444); box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }

    .form-select {
      cursor: pointer; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center; background-size: 16px;
      padding-right: 44px;
    }

    .form-error { display: block; margin-top: 6px; font-size: 12px; color: var(--danger-color, #EF4444); }

    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 12px; }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 24px; font-size: 14px; font-weight: 500; font-family: inherit;
      border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s ease;
    }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background-color: var(--text-heading, #0F172B); color: white; }
    .btn-primary:hover:not(:disabled) { background-color: var(--text-primary, #314158); }
    .btn-secondary { background-color: white; color: var(--text-primary, #314158); border: 1px solid var(--slate-200, #E2E8F0); }
    .btn-secondary:hover:not(:disabled) { background-color: var(--slate-50, #F8FAFC); }

    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    .spinner-sm { width: 14px; height: 14px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 520px) {
      .dialog-container { max-width: 100%; }
      .dialog-header, .dialog-form { padding-left: 20px; padding-right: 20px; }
      .form-row { flex-direction: column; gap: 0; }
    }
  `],
})
export class EmpleadoDialogComponent implements OnInit {
  readonly empleado = input<Empleado | null>(null);
  readonly guardar = output<Partial<Empleado>>();
  readonly cancelar = output<void>();

  private readonly fb = inject(FormBuilder);
  form!: FormGroup;

  readonly roles = ROLES;
  readonly estados = ESTADOS;
  readonly isSubmitting = signal(false);

  readonly isEditMode = computed(() => !!this.empleado());
  readonly dialogTitle = computed(() => this.isEditMode() ? 'Editar Empleado' : 'Nuevo Empleado');
  readonly submitButtonText = computed(() => this.isEditMode() ? 'Guardar' : 'Crear');

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required]],
      cuil: [''],
      rol: ['', [Validators.required]],
      telefono: [''],
      email: [''],
      contactoEmergencia: [''],
      estado: ['Trabajando'],
      sueldoBase: [0],
      valorHoraExtra: [0],
    });

    const emp = this.empleado();
    if (emp) {
      this.form.patchValue({
        nombre: emp.nombre,
        dni: emp.dni,
        cuil: emp.cuil,
        rol: emp.rol,
        telefono: emp.telefono,
        email: emp.email,
        contactoEmergencia: emp.contactoEmergencia,
        estado: emp.estado,
        sueldoBase: emp.sueldoBase,
        valorHoraExtra: emp.valorHoraExtra,
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.onCancel();
  }

  onCancel(): void { this.cancelar.emit(); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSubmitting.set(true);
    this.guardar.emit(this.form.value);
  }
}
