import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ingrediente } from '../../models/insumo-perfil.model';

export interface IngredientesFormData {
  ingredientes: Ingrediente[];
}

const UNIDADES = ['Un', 'Gr', 'Ml', 'Kg'];

@Component({
  selector: 'app-ingredientes-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <h2 class="dialog-title">INGREDIENTES</h2>
        </header>

        <div class="dialog-body">
          <!-- Ingredient list -->
          <div class="ingredients-list">
            @for (ing of items(); track $index; let i = $index) {
              <div class="ingredient-row">
                <div class="ing-info">
                  <span class="ing-dot"></span>
                  <span class="ing-name">{{ ing.nombre }}</span>
                </div>
                <span class="ing-qty">{{ ing.cantidad }} {{ ing.unidad }}</span>
                <div class="ing-actions">
                  <button class="action-btn" (click)="startEdit(i)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="action-btn action-delete" (click)="removeIngrediente(i)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            }
          </div>

          @if (items().length === 0) {
            <div class="empty-state">Sin ingredientes. Agrega uno usando el formulario de abajo.</div>
          }

          <!-- Add / Edit row -->
          <div class="add-row">
            <input class="add-input add-nombre" type="text" [(ngModel)]="formNombre" [placeholder]="editingIndex !== null ? 'Editando...' : 'Nombre del ingrediente...'"/>
            <input class="add-input add-cantidad" type="number" [(ngModel)]="formCantidad" placeholder="Cant." min="0"/>
            <select class="add-input add-unidad" [(ngModel)]="formUnidad">
              @for (u of unidades; track u) {
                <option [value]="u">{{ u }}</option>
              }
            </select>
            <button class="add-btn" (click)="saveIngrediente()" [disabled]="!formNombre.trim()">
              @if (editingIndex !== null) {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                </svg>
              } @else {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
              }
            </button>
          </div>
        </div>

        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
          <button type="button" class="btn btn-primary" (click)="onSubmit()">GUARDAR</button>
        </div>
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
      width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;
    }
    .dialog-header { padding: 28px 28px 0; }
    .dialog-title { font-size: 18px; font-weight: 700; color: #1F2937; margin: 0; letter-spacing: 0.04em; }
    .dialog-body { padding: 20px 28px; }

    .ingredients-list { }
    .ingredient-row {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 0; border-bottom: 1px solid #F3F4F6;
    }
    .ingredient-row:last-child { border-bottom: 1px solid #F3F4F6; }
    .ing-info { display: flex; align-items: center; gap: 10px; flex: 1; }
    .ing-dot { width: 7px; height: 7px; border-radius: 50%; background: #F97316; flex-shrink: 0; }
    .ing-name { font-size: 14px; font-weight: 500; color: #1F2937; }
    .ing-qty { font-size: 13px; color: #6B7280; font-weight: 500; white-space: nowrap; }
    .ing-actions { display: flex; gap: 4px; margin-left: 8px; }
    .action-btn {
      display: flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; padding: 0;
      background: white; border: 1px solid #E5E7EB; color: #6B7280;
      cursor: pointer; border-radius: 6px; transition: all 0.15s;
    }
    .action-btn:hover { color: #374151; border-color: #D1D5DB; }
    .action-delete:hover { color: #EF4444; border-color: #FECACA; }

    .empty-state { padding: 32px; text-align: center; font-size: 14px; color: #9CA3AF; }

    .add-row {
      display: flex; gap: 8px; align-items: center; padding: 16px 0;
    }
    .add-input {
      padding: 10px 12px; font-size: 14px; font-family: inherit;
      color: #374151; background: white; border: 1px solid #E5E7EB;
      border-radius: 10px; transition: all 0.15s;
    }
    .add-input:focus { outline: none; border-color: #F97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
    .add-nombre { flex: 1; min-width: 0; }
    .add-cantidad { width: 70px; text-align: center; }
    .add-unidad { width: 70px; text-align: center; }
    .add-btn {
      display: flex; align-items: center; justify-content: center;
      width: 38px; height: 38px; padding: 0; flex-shrink: 0;
      background: #F97316; color: white; border: none;
      border-radius: 10px; cursor: pointer; transition: background 0.15s;
    }
    .add-btn:hover { background: #EA580C; }
    .add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .dialog-actions {
      display: flex; justify-content: flex-end; gap: 12px; padding: 0 28px 28px;
    }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 24px; font-size: 14px; font-weight: 500; font-family: inherit;
      border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s;
    }
    .btn-primary { background: #1F2937; color: white; }
    .btn-primary:hover { background: #374151; }
    .btn-secondary { background: white; color: #374151; border: 1px solid #E5E7EB; }
    .btn-secondary:hover { background: #F9FAFB; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientesDialogComponent implements OnInit {
  @Input() ingredientes: Ingrediente[] = [];
  @Output() guardar = new EventEmitter<IngredientesFormData>();
  @Output() cancelar = new EventEmitter<void>();

  unidades = UNIDADES;
  items = signal<Ingrediente[]>([]);
  formNombre = '';
  formCantidad = 1;
  formUnidad = 'Gr';
  editingIndex: number | null = null;

  ngOnInit(): void {
    this.items.set(this.ingredientes.map(i => ({ ...i })));
  }

  saveIngrediente(): void {
    if (!this.formNombre.trim()) return;
    const ing: Ingrediente = {
      id: this.editingIndex !== null ? this.items()[this.editingIndex].id : Date.now(),
      nombre: this.formNombre.trim(),
      cantidad: this.formCantidad || 1,
      unidad: this.formUnidad,
    };
    if (this.editingIndex !== null) {
      this.items.update(list => list.map((item, i) => i === this.editingIndex ? ing : item));
      this.editingIndex = null;
    } else {
      this.items.update(list => [...list, ing]);
    }
    this.resetForm();
  }

  startEdit(index: number): void {
    const ing = this.items()[index];
    this.formNombre = ing.nombre;
    this.formCantidad = ing.cantidad;
    this.formUnidad = ing.unidad;
    this.editingIndex = index;
  }

  removeIngrediente(index: number): void {
    this.items.update(list => list.filter((_, i) => i !== index));
    if (this.editingIndex === index) {
      this.editingIndex = null;
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.formNombre = '';
    this.formCantidad = 1;
    this.formUnidad = 'Gr';
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.onCancel();
  }

  onCancel(): void { this.cancelar.emit(); }

  onSubmit(): void {
    this.guardar.emit({ ingredientes: this.items() });
  }
}
