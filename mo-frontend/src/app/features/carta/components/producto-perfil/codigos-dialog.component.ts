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
import { CodigosFormData } from '../../models/producto-perfil.model';

@Component({
  selector: 'app-codigos-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <h2 class="dialog-title">Editar Codigos</h2>
          <p class="dialog-subtitle">Gestiona los codigos de identificacion del producto.</p>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
          <div class="form-group">
            <label for="codigoProducto" class="form-label">Codigo producto</label>
            <input
              id="codigoProducto"
              type="text"
              formControlName="codigoProducto"
              class="form-input"
              placeholder="Ej: BURG22"
              [class.form-input-error]="isFieldInvalid('codigoProducto')"
            />
            @if (isFieldInvalid('codigoProducto')) {
              <span class="form-error">El codigo de producto es requerido</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label">Codigos de busqueda</label>
            <div class="tags-container">
              <div class="tags-list">
                @for (tag of tags(); track tag; let i = $index) {
                  <span class="tag">
                    {{ tag }}
                    <button type="button" class="tag-remove" (click)="removeTag(i)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </span>
                }
              </div>
              <input
                type="text"
                class="tag-input"
                placeholder="Escribe y presiona Enter..."
                (keydown.enter)="addTag($event)"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="codigoBarras" class="form-label">Codigo de barras</label>
            <input
              id="codigoBarras"
              type="text"
              formControlName="codigoBarras"
              class="form-input"
              placeholder="Ej: 7790001000101"
            />
          </div>

          <div class="form-group">
            <label for="sku" class="form-label">SKU</label>
            <input
              id="sku"
              type="text"
              formControlName="sku"
              class="form-input"
              placeholder="Ej: HAM-CLA-050"
            />
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
      width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto;
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
      width: 100%; padding: 12px 14px; font-size: 14px; font-family: inherit;
      color: var(--text-primary); background: white; border: 1px solid var(--slate-200);
      border-radius: 10px; transition: all 0.15s ease;
    }
    .form-input:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1); }
    .form-input::placeholder { color: var(--slate-400); }
    .form-input-error { border-color: var(--danger-color); }
    .form-error { display: block; margin-top: 6px; font-size: 12px; color: var(--danger-color); }

    /* Tags */
    .tags-container {
      border: 1px solid var(--slate-200);
      border-radius: 10px;
      padding: 8px 10px;
      transition: all 0.15s ease;
    }
    .tags-container:focus-within {
      border-color: var(--primary-orange);
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }
    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 4px;
    }
    .tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
      background: var(--slate-100);
      border-radius: 6px;
    }
    .tag-remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--slate-400);
      cursor: pointer;
      border-radius: 3px;
      transition: all 0.15s;
    }
    .tag-remove:hover { color: var(--danger-color); background: var(--danger-bg); }
    .tag-input {
      width: 100%;
      border: none;
      outline: none;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-primary);
      padding: 4px 4px;
    }
    .tag-input::placeholder { color: var(--slate-400); }

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
export class CodigosDialogComponent implements OnInit {
  @Input() codigoProducto = '';
  @Input() codigosBusqueda: string[] = [];
  @Input() codigoBarras: string | null = null;
  @Input() sku: string | null = null;
  @Output() guardar = new EventEmitter<CodigosFormData>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;
  tags = signal<string[]>([]);
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.tags.set([...this.codigosBusqueda]);
    this.form = this.fb.group({
      codigoProducto: [this.codigoProducto, [Validators.required]],
      codigoBarras: [this.codigoBarras || ''],
      sku: [this.sku || ''],
    });
  }

  addTag(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = input.value.trim().toLowerCase();
    if (value && !this.tags().includes(value)) {
      this.tags.update(t => [...t, value]);
    }
    input.value = '';
  }

  removeTag(index: number): void {
    this.tags.update(t => t.filter((_, i) => i !== index));
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
    const data: CodigosFormData = {
      codigoProducto: this.form.value.codigoProducto,
      codigosBusqueda: this.tags(),
      codigoBarras: this.form.value.codigoBarras || null,
      sku: this.form.value.sku || null,
    };
    this.guardar.emit(data);
  }

  resetSubmitting(): void {
    this.isSubmitting.set(false);
  }
}
