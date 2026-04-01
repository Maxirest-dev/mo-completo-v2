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
import { FormsModule } from '@angular/forms';
import { PasoElaboracion, ElaboracionFormData } from '../../models/producto-perfil.model';

interface EditablePaso extends PasoElaboracion {
  editing: boolean;
}

@Component({
  selector: 'app-elaboracion-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <!-- Header -->
        <header class="dialog-header">
          <div>
            <h2 class="dialog-title">ELABORACION PASO A PASO</h2>
            <p class="dialog-subtitle">Visualiza y edita contenido multimedia de cada paso</p>
          </div>
          <button class="add-btn" (click)="addPaso()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            Agregar
          </button>
        </header>

        <div class="dialog-body">
          <!-- Table header -->
          @if (pasos().length > 0) {
            <div class="table-header">
              <span class="th-paso">PASO</span>
              <span class="th-desc">DESCRIPCION</span>
              <span class="th-actions">ACCIONES</span>
            </div>
          }

          <!-- Steps list -->
          <div class="steps-list">
            @for (paso of pasos(); track paso.paso; let i = $index) {
              <div class="step-row">
                <!-- Drag handle -->
                <div class="drag-handle">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--slate-300)" stroke-width="2">
                    <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
                    <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                  </svg>
                </div>

                <!-- Step number -->
                <div class="step-number">{{ paso.paso }}</div>

                <!-- Description -->
                @if (paso.editing) {
                  <div class="step-desc step-desc-editing">
                    <input
                      class="step-input"
                      type="text"
                      [(ngModel)]="paso.descripcion"
                      (keydown.enter)="confirmEdit(paso)"
                      autofocus
                    />
                  </div>
                } @else {
                  <div class="step-desc">
                    <span class="step-text">{{ paso.descripcion }}</span>
                  </div>
                }

                <!-- Actions -->
                <div class="step-actions">
                  <button class="action-btn action-multimedia" (click)="onMultimedia()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"/>
                    </svg>
                    Multimedia
                  </button>

                  @if (paso.editing) {
                    <button class="action-btn action-save" (click)="confirmEdit(paso)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Guardar
                    </button>
                    <button class="action-btn action-cancel" (click)="cancelEdit(paso, i)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                      </svg>
                      Cancelar
                    </button>
                  } @else {
                    <button class="action-btn action-edit" (click)="startEdit(paso)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Editar
                    </button>
                    <button class="action-btn action-delete" (click)="removePaso(i)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                      </svg>
                      Eliminar
                    </button>
                  }
                </div>
              </div>
            }
          </div>

          @if (pasos().length === 0) {
            <div class="empty-state">Sin pasos de elaboracion. Haz click en "Agregar" para crear uno.</div>
          }
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
      position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px; animation: fadeIn 0.15s ease-out;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .dialog-container {
      background: white; border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 100%; max-width: 1000px; max-height: 90vh; overflow-y: auto;
      animation: slideUp 0.2s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Header */
    .dialog-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 28px 28px 20px;
    }
    .dialog-title {
      font-size: 18px; font-weight: 700; color: var(--text-heading);
      text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 4px 0;
    }
    .dialog-subtitle { font-size: 14px; color: var(--slate-500); margin: 0; }

    .add-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 20px; font-size: 14px; font-weight: 500; font-family: inherit;
      color: var(--text-primary); background: white; border: 1px solid var(--slate-200);
      border-radius: 10px; cursor: pointer; transition: all 0.15s;
      flex-shrink: 0;
    }
    .add-btn:hover { border-color: var(--primary-orange); color: var(--primary-orange); }

    .dialog-body { padding: 0 28px 16px; }

    /* Table header */
    .table-header {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 0; border-bottom: 1px solid var(--slate-200);
      font-size: 11px; font-weight: 700; color: var(--slate-400);
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .th-paso { width: 70px; padding-left: 36px; }
    .th-desc { flex: 1; }
    .th-actions { width: 320px; text-align: right; }

    /* Steps list */
    .steps-list { }
    .step-row {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 0;
      border-bottom: 1px solid var(--slate-100);
    }
    .step-row:last-child { border-bottom: none; }

    .drag-handle {
      width: 20px; flex-shrink: 0;
      cursor: grab; display: flex; align-items: center; justify-content: center;
    }

    .step-number {
      width: 32px; height: 32px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: var(--text-primary);
      background: var(--slate-100); border-radius: 8px;
    }

    .step-desc {
      flex: 1; min-width: 0;
    }
    .step-text {
      font-size: 14px; color: var(--text-primary); line-height: 1.5;
    }
    .step-desc-editing { }
    .step-input {
      width: 100%; padding: 10px 14px; font-size: 14px; font-family: inherit;
      color: var(--text-primary); background: white; border: 2px solid var(--success-color);
      border-radius: 10px; transition: all 0.15s;
    }
    .step-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); }

    /* Actions */
    .step-actions {
      display: flex; gap: 6px; flex-shrink: 0;
    }
    .action-btn {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 6px 12px; font-size: 12px; font-weight: 500; font-family: inherit;
      border-radius: 8px; border: 1px solid var(--slate-200); cursor: pointer;
      transition: all 0.15s; background: white; color: var(--text-primary);
    }
    .action-multimedia { color: var(--slate-500); }
    .action-multimedia:hover { border-color: var(--slate-400); }
    .action-edit { color: var(--text-primary); }
    .action-edit:hover { border-color: var(--primary-orange); color: var(--primary-orange); }
    .action-save {
      background: var(--success-color); color: white; border-color: var(--success-color);
    }
    .action-save:hover { background: #059669; border-color: #059669; }
    .action-delete { color: var(--slate-500); }
    .action-delete:hover { border-color: var(--danger-color); color: var(--danger-color); }
    .action-cancel { color: var(--slate-500); }
    .action-cancel:hover { border-color: var(--danger-color); color: var(--danger-color); }

    .empty-state {
      padding: 40px; text-align: center;
      font-size: 14px; color: var(--slate-400);
    }

    .dialog-actions {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 16px 28px 28px;
    }

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

    @media (max-width: 800px) {
      .step-actions { flex-wrap: wrap; }
      .th-actions { display: none; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElaboracionDialogComponent implements OnInit {
  @Input() elaboracion: PasoElaboracion[] = [];
  @Output() guardar = new EventEmitter<ElaboracionFormData>();
  @Output() cancelar = new EventEmitter<void>();

  pasos = signal<EditablePaso[]>([]);
  private originalDescriptions = new Map<number, string>();

  ngOnInit(): void {
    this.pasos.set(this.elaboracion.map(p => ({ ...p, editing: false })));
  }

  addPaso(): void {
    const nextNum = this.pasos().length + 1;
    const newPaso: EditablePaso = {
      paso: nextNum,
      descripcion: '',
      editing: true,
    };
    this.pasos.update(list => [...list, newPaso]);
  }

  startEdit(paso: EditablePaso): void {
    this.originalDescriptions.set(paso.paso, paso.descripcion);
    paso.editing = true;
    this.pasos.update(list => [...list]);
  }

  confirmEdit(paso: EditablePaso): void {
    if (!paso.descripcion.trim()) return;
    paso.editing = false;
    this.originalDescriptions.delete(paso.paso);
    this.pasos.update(list => [...list]);
  }

  cancelEdit(paso: EditablePaso, index: number): void {
    const original = this.originalDescriptions.get(paso.paso);
    if (original !== undefined) {
      paso.descripcion = original;
      paso.editing = false;
      this.originalDescriptions.delete(paso.paso);
      this.pasos.update(list => [...list]);
    } else {
      // It was a new paso with no original - remove it
      this.removePaso(index);
    }
  }

  removePaso(index: number): void {
    this.pasos.update(list => {
      const next = list.filter((_, i) => i !== index);
      // Renumber
      return next.map((p, i) => ({ ...p, paso: i + 1 }));
    });
  }

  onMultimedia(): void {
    // Placeholder - not functional yet
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
    const elaboracion = this.pasos()
      .filter(p => p.descripcion.trim())
      .map(({ editing, ...rest }) => rest);
    this.guardar.emit({ elaboracion });
  }
}
