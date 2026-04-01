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
import { ExtraItem, ExtrasFormData } from '../../models/producto-perfil.model';

interface EditableExtraItem extends ExtraItem {
  editing: boolean;
}

@Component({
  selector: 'app-extras-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <h2 class="dialog-title">Extras y Adicionales</h2>
          <p class="dialog-subtitle">Gestiona los extras y adicionales disponibles para este producto.</p>
        </header>

        <div class="dialog-body">
          <!-- EXTRAS Section -->
          <div class="section">
            <div class="section-header section-header-orange">
              <div class="section-title-row">
                <h3 class="section-title">EXTRAS</h3>
                <span class="section-count">{{ extrasItems().length }}</span>
              </div>
              <button class="add-btn" (click)="addItem('extras')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
                Agregar
              </button>
            </div>

            @if (extrasItems().length > 0) {
              <table class="items-table">
                <thead>
                  <tr>
                    <th class="col-handle"></th>
                    <th class="col-num">#</th>
                    <th class="col-name">NOMBRE</th>
                    <th class="col-price">PRECIO</th>
                    <th class="col-qty">CANT. MAX</th>
                    <th class="col-actions">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of extrasItems(); track item.id; let i = $index) {
                    <tr>
                      <td class="col-handle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--slate-300)" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                        </svg>
                      </td>
                      <td class="col-num">{{ i + 1 }}</td>
                      @if (item.editing) {
                        <td class="col-name">
                          <input class="inline-input" [(ngModel)]="item.nombre" placeholder="Nombre"/>
                        </td>
                        <td class="col-price">
                          <input class="inline-input inline-input-sm" type="number" [(ngModel)]="item.precio" placeholder="0" min="0"/>
                        </td>
                        <td class="col-qty">
                          <input class="inline-input inline-input-xs" type="number" [(ngModel)]="item.cantidadMax" placeholder="1" min="1"/>
                        </td>
                        <td class="col-actions">
                          <button class="action-btn action-save" (click)="confirmEdit(item)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                            </svg>
                          </button>
                          <button class="action-btn action-delete" (click)="removeItem('extras', item.id)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </td>
                      } @else {
                        <td class="col-name">{{ item.nombre }}</td>
                        <td class="col-price">{{ formatPrice(item.precio) }}</td>
                        <td class="col-qty">{{ item.cantidadMax }}</td>
                        <td class="col-actions">
                          <button class="action-btn action-edit" (click)="startEdit(item)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button class="action-btn action-delete" (click)="removeItem('extras', item.id)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                            </svg>
                          </button>
                        </td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <div class="empty-state">Sin extras configurados</div>
            }
          </div>

          <!-- ADICIONALES Section -->
          <div class="section">
            <div class="section-header section-header-green">
              <div class="section-title-row">
                <h3 class="section-title">ADICIONALES</h3>
                <span class="section-count">{{ adicionalesItems().length }}</span>
              </div>
              <button class="add-btn" (click)="addItem('adicionales')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
                Agregar
              </button>
            </div>

            @if (adicionalesItems().length > 0) {
              <table class="items-table">
                <thead>
                  <tr>
                    <th class="col-handle"></th>
                    <th class="col-num">#</th>
                    <th class="col-name">NOMBRE</th>
                    <th class="col-price">PRECIO</th>
                    <th class="col-qty">CANT. MAX</th>
                    <th class="col-actions">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of adicionalesItems(); track item.id; let i = $index) {
                    <tr>
                      <td class="col-handle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--slate-300)" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                        </svg>
                      </td>
                      <td class="col-num">{{ i + 1 }}</td>
                      @if (item.editing) {
                        <td class="col-name">
                          <input class="inline-input" [(ngModel)]="item.nombre" placeholder="Nombre"/>
                        </td>
                        <td class="col-price">
                          <input class="inline-input inline-input-sm" type="number" [(ngModel)]="item.precio" placeholder="0" min="0"/>
                        </td>
                        <td class="col-qty">
                          <input class="inline-input inline-input-xs" type="number" [(ngModel)]="item.cantidadMax" placeholder="1" min="1"/>
                        </td>
                        <td class="col-actions">
                          <button class="action-btn action-save" (click)="confirmEdit(item)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                            </svg>
                          </button>
                          <button class="action-btn action-delete" (click)="removeItem('adicionales', item.id)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </td>
                      } @else {
                        <td class="col-name">{{ item.nombre }}</td>
                        <td class="col-price">{{ formatPrice(item.precio) }}</td>
                        <td class="col-qty">{{ item.cantidadMax }}</td>
                        <td class="col-actions">
                          <button class="action-btn action-edit" (click)="startEdit(item)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button class="action-btn action-delete" (click)="removeItem('adicionales', item.id)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                            </svg>
                          </button>
                        </td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <div class="empty-state">Sin adicionales configurados</div>
            }
          </div>
        </div>

        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
          <button type="button" class="btn btn-primary" (click)="onSubmit()">Guardar</button>
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
      width: 100%; max-width: 900px; max-height: 90vh; overflow-y: auto;
      animation: slideUp 0.2s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dialog-header { padding: 28px 28px 0; }
    .dialog-title { font-size: 22px; font-weight: 600; color: var(--text-heading); margin: 0 0 6px 0; }
    .dialog-subtitle { font-size: 14px; color: var(--slate-500); margin: 0; }

    .dialog-body { padding: 24px 28px; }

    /* Section */
    .section { margin-bottom: 28px; }
    .section:last-child { margin-bottom: 0; }

    .section-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 16px; border-radius: 10px; margin-bottom: 12px;
    }
    .section-header-orange { background: #FFF7ED; border: 1px solid #FED7AA; }
    .section-header-green { background: #F0FDF4; border: 1px solid #BBF7D0; }

    .section-title-row { display: flex; align-items: center; gap: 10px; }
    .section-title {
      font-size: 13px; font-weight: 700; color: var(--text-primary);
      text-transform: uppercase; letter-spacing: 0.04em; margin: 0;
    }
    .section-count {
      display: inline-flex; align-items: center; justify-content: center;
      width: 22px; height: 22px; font-size: 12px; font-weight: 600;
      color: var(--slate-500); background: white; border-radius: 6px;
      border: 1px solid var(--slate-200);
    }

    .add-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; font-size: 13px; font-weight: 500; font-family: inherit;
      color: var(--text-primary); background: white; border: 1px solid var(--slate-200);
      border-radius: 8px; cursor: pointer; transition: all 0.15s;
    }
    .add-btn:hover { border-color: var(--primary-orange); color: var(--primary-orange); }

    /* Table */
    .items-table {
      width: 100%; border-collapse: collapse;
    }
    .items-table th {
      padding: 8px 10px; font-size: 11px; font-weight: 700;
      color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.05em;
      text-align: left; border-bottom: 1px solid var(--slate-200);
    }
    .items-table td {
      padding: 10px 10px; font-size: 14px; color: var(--text-primary);
      border-bottom: 1px solid var(--slate-100); vertical-align: middle;
    }
    .items-table tr:last-child td { border-bottom: none; }

    .col-handle { width: 30px; cursor: grab; }
    .col-num { width: 30px; color: var(--slate-400); font-size: 13px; }
    .col-name { min-width: 180px; }
    .col-price { width: 120px; }
    .col-qty { width: 90px; text-align: center; }
    .col-actions { width: 80px; text-align: center; }

    .inline-input {
      width: 100%; padding: 6px 10px; font-size: 13px; font-family: inherit;
      color: var(--text-primary); background: #FAFAFA; border: 1px solid var(--slate-200);
      border-radius: 6px; transition: all 0.15s;
    }
    .inline-input:focus { outline: none; border-color: var(--primary-orange); background: white; }
    .inline-input-sm { width: 90px; }
    .inline-input-xs { width: 60px; text-align: center; }

    /* Action buttons */
    .col-actions { white-space: nowrap; }
    .action-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; padding: 0; margin: 0 2px;
      border: none; border-radius: 6px; cursor: pointer; transition: all 0.15s;
      background: transparent;
    }
    .action-edit { color: var(--slate-400); }
    .action-edit:hover { color: var(--primary-orange); background: #FFF7ED; }
    .action-save { color: #22C55E; }
    .action-save:hover { background: #F0FDF4; }
    .action-delete { color: var(--slate-400); }
    .action-delete:hover { color: var(--danger-color); background: #FEF2F2; }

    .empty-state {
      padding: 24px; text-align: center;
      font-size: 14px; color: var(--slate-400);
      border: 1px dashed var(--slate-200); border-radius: 10px;
    }

    .dialog-actions {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 0 28px 28px;
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtrasDialogComponent implements OnInit {
  @Input() extras: ExtraItem[] = [];
  @Input() adicionales: ExtraItem[] = [];
  @Output() guardar = new EventEmitter<ExtrasFormData>();
  @Output() cancelar = new EventEmitter<void>();

  extrasItems = signal<EditableExtraItem[]>([]);
  adicionalesItems = signal<EditableExtraItem[]>([]);

  private nextId = 1000;

  ngOnInit(): void {
    this.extrasItems.set(this.extras.map(e => ({ ...e, editing: false })));
    this.adicionalesItems.set(this.adicionales.map(a => ({ ...a, editing: false })));
  }

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-AR');
  }

  addItem(section: 'extras' | 'adicionales'): void {
    const newItem: EditableExtraItem = {
      id: this.nextId++,
      nombre: '',
      precio: 0,
      cantidadMax: 1,
      editing: true,
    };
    if (section === 'extras') {
      this.extrasItems.update(items => [...items, newItem]);
    } else {
      this.adicionalesItems.update(items => [...items, newItem]);
    }
  }

  startEdit(item: EditableExtraItem): void {
    item.editing = true;
    // Force signal update
    this.extrasItems.update(items => [...items]);
    this.adicionalesItems.update(items => [...items]);
  }

  confirmEdit(item: EditableExtraItem): void {
    if (!item.nombre.trim()) return;
    item.editing = false;
    this.extrasItems.update(items => [...items]);
    this.adicionalesItems.update(items => [...items]);
  }

  removeItem(section: 'extras' | 'adicionales', id: number): void {
    if (section === 'extras') {
      this.extrasItems.update(items => items.filter(i => i.id !== id));
    } else {
      this.adicionalesItems.update(items => items.filter(i => i.id !== id));
    }
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
    // Strip editing flag
    const extras = this.extrasItems()
      .filter(i => i.nombre.trim())
      .map(({ editing, ...rest }) => rest);
    const adicionales = this.adicionalesItems()
      .filter(i => i.nombre.trim())
      .map(({ editing, ...rest }) => rest);
    this.guardar.emit({ extras, adicionales });
  }
}
