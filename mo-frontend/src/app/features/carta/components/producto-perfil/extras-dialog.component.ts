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
import { ExtraItem, ExtrasFormData, PizzaConfig, PizzaTamano } from '../../models/producto-perfil.model';
import { MOCK_CATEGORIAS } from '../../data/mock-categorias.data';
import { ProductoGridRow, CategoriaGridRow } from '../../models/categoria-grid.model';

interface EditableExtraItem extends ExtraItem {
  editing: boolean;
}

interface PasoProducto {
  id: number;
  nombre: string;
  precio: number;
  habilitado: boolean;
}

interface PasoOpcional {
  id: number;
  categoriaId: number | null;
  categoriaNombre: string;
  productos: PasoProducto[];
  confirmado: boolean;
}

@Component({
  selector: 'app-extras-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <h2 class="dialog-title">{{ isComboOrMenu ? 'Configuracion' : isPizza ? 'Configuracion' : 'Extras y Adicionales' }}</h2>
          <p class="dialog-subtitle">{{ isPizza ? 'Configura los tamanos y opciones de esta pizza.' : isComboOrMenu ? 'Gestiona los productos fijos y pasos opcionales de este producto.' : 'Gestiona los extras y adicionales disponibles para este producto.' }}</p>
        </header>

        @if (isPizza) {
          <!-- PIZZA CONFIG -->
          <div class="dialog-body">
            <div class="section">
              <div class="section-header section-header-orange">
                <div class="section-title-row">
                  <h3 class="section-title">TAMANOS</h3>
                  <span class="section-count">{{ pizzaTamanos().length }}</span>
                </div>
                <button class="add-btn" (click)="addPizzaTamano()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                  </svg>
                  Agregar
                </button>
              </div>
              <div class="section-body">
                @for (tam of pizzaTamanos(); track tam.id) {
                  @if (editingTamanoId() === tam.id) {
                    <div class="fijo-editing-inline">
                      <input class="inline-input" [(ngModel)]="tam.nombre" placeholder="Nombre (ej: Grande)" style="flex:1"/>
                      <input class="inline-input inline-input-sm" type="number" [(ngModel)]="tam.precio" placeholder="$" min="0"/>
                      <input class="inline-input inline-input-xs" type="number" [(ngModel)]="tam.porciones" placeholder="Porc." min="1"/>
                      <button class="action-btn action-save" [disabled]="!tam.nombre.trim()" (click)="confirmTamano()">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                        </svg>
                      </button>
                      <button class="action-btn action-delete" (click)="removeTamano(tam.id)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  } @else {
                    <div class="paso-row">
                      <span class="pizza-icon-sm">🍕</span>
                      <span class="fijo-row-name">{{ tam.nombre }}</span>
                      <span class="fijo-row-qty">{{ tam.porciones }} porc.</span>
                      <span class="fijo-row-price">{{ formatPrice(tam.precio) }}</span>
                      <button class="action-btn action-edit" (click)="editingTamanoId.set(tam.id)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="action-btn action-delete" (click)="removeTamano(tam.id)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                        </svg>
                      </button>
                    </div>
                  }
                } @empty {
                  <div class="empty-state">Sin tamanos configurados</div>
                }
              </div>
            </div>

            <div class="section">
              <div class="section-header section-header-green">
                <div class="section-title-row">
                  <h3 class="section-title">MITAD Y MITAD</h3>
                </div>
                <label class="mitad-toggle-btn">
                  <input type="checkbox" class="mitad-toggle-check" [ngModel]="pizzaPermiteMitad()" (ngModelChange)="pizzaPermiteMitad.set($event)" />
                  <span class="mitad-toggle-slider"></span>
                </label>
              </div>
              <div class="section-body">
                <div class="mitad-desc">
                  @if (pizzaPermiteMitad()) {
                    <span class="mitad-status mitad-status--on">Habilitado</span>
                    <span>El cliente podra elegir mitad de este sabor combinado con otro. Se toma el precio del sabor mas caro.</span>
                  } @else {
                    <span class="mitad-status mitad-status--off">Deshabilitado</span>
                    <span>Esta pizza solo se vende entera, no permite combinacion con otros sabores.</span>
                  }
                </div>
              </div>
            </div>
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
            <button type="button" class="btn btn-primary" (click)="onSubmitPizza()">Guardar</button>
          </div>
        } @else {

        <div class="dialog-body">
          @if (isComboOrMenu) {
          <!-- COMBO/MENU: Productos Fijos -->
          <div class="section">
            <div class="section-header section-header-orange">
              <div class="section-title-row">
                <h3 class="section-title">PRODUCTOS FIJOS</h3>
                <span class="section-count">{{ extrasItems().length }}</span>
              </div>
              <button class="add-btn" (click)="addItem('extras')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
                Agregar
              </button>
            </div>
            <div class="section-body">
            <div class="fijos-list">
              @for (item of extrasItems(); track item.id) {
                @if (!item.editing) {
                  <div class="paso-row">
                    <span class="fijo-dot"></span>
                    <span class="fijo-row-name">{{ item.nombre }}</span>
                    <span class="fijo-row-price">{{ formatPrice(item.precio) }}</span>
                    <span class="fijo-row-qty">x{{ item.cantidadMax }}</span>
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
                  </div>
                }
              }
              @for (item of extrasItems(); track item.id) {
                @if (item.editing) {
                  <div class="fijo-editing-inline">
                    <div class="autocomplete-wrapper fijo-inline-name">
                      <input class="inline-input" [(ngModel)]="item.nombre" placeholder="Buscar producto..." (input)="onSearchInput(item.nombre)" (focus)="activeItemId.set(item.id); onSearchInput(item.nombre)" />
                      @if (suggestions().length > 0 && activeItemId() === item.id) {
                        <div class="autocomplete-dropdown">
                          @for (sug of suggestions(); track sug.id) {
                            <button class="autocomplete-option" (click)="selectSuggestion(item, sug); $event.stopPropagation()">
                              <span class="autocomplete-name">{{ sug.nombre }}</span>
                              <span class="autocomplete-price">{{ formatPrice(sug.precio) }}</span>
                            </button>
                          }
                        </div>
                      }
                    </div>
                    <input class="inline-input inline-input-sm" type="number" [(ngModel)]="item.precio" placeholder="$" min="0"/>
                    <input class="inline-input inline-input-xs" type="number" [(ngModel)]="item.cantidadMax" placeholder="1" min="1"/>
                    <button class="action-btn action-save" [disabled]="!item.nombre.trim()" (click)="confirmEdit(item)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                    </button>
                    <button class="action-btn action-delete" (click)="removeItem('extras', item.id)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                }
              }
              @if (extrasItems().length === 0) {
                <div class="empty-state">Sin productos fijos configurados</div>
              }
            </div>
            </div>
          </div>

          <!-- COMBO/MENU: Pasos Opcionales -->
          <div class="section">
            <div class="section-header section-header-green">
              <div class="section-title-row">
                <h3 class="section-title">PASOS OPCIONALES</h3>
                <span class="section-count">{{ pasos().length }}</span>
              </div>
              <button class="add-btn" (click)="addPaso()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
                Agregar paso
              </button>
            </div>

            <div class="section-body">
            @if (pasos().length > 0) {
              <div class="pasos-list">
                @for (paso of pasos(); track paso.id; let i = $index) {
                  @if (paso.confirmado) {
                    <!-- Paso confirmado: fila compacta -->
                    <div
                      class="paso-row"
                      [class.paso-row--dragging]="draggingPasoId() === paso.id"
                      [class.paso-row--drag-over]="dragOverPasoId() === paso.id && draggingPasoId() !== paso.id"
                      draggable="true"
                      (dragstart)="onPasoDragStart($event, paso.id)"
                      (dragend)="onPasoDragEnd()"
                      (dragover)="onPasoDragOver($event, paso.id)"
                      (drop)="onPasoDrop($event, paso.id)"
                    >
                      <span class="paso-drag-handle">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                        </svg>
                      </span>
                      <span class="paso-num">{{ i + 1 }}</span>
                      <span class="paso-row-cat">{{ paso.categoriaNombre }}</span>
                      <span class="paso-row-count">{{ getPasoHabilitados(paso) }} productos</span>
                      <button class="action-btn action-edit" (click)="editPaso(paso.id)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="action-btn action-delete" (click)="removePaso(paso.id)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                        </svg>
                      </button>
                    </div>
                  } @else {
                    <!-- Paso en edicion: expandido -->
                    <div class="paso-card">
                      <div class="paso-card-header">
                        <span class="paso-num-badge">Paso {{ i + 1 }}</span>
                        @if (!paso.categoriaId) {
                          <select class="paso-cat-select" (change)="onPasoCategoriaChange(paso, $event)">
                            <option value="">Seleccionar categoria...</option>
                            @for (cat of categorias; track cat.id) {
                              <option [value]="cat.id">{{ cat.icono }} {{ cat.nombre }} ({{ cat.productos.length }})</option>
                            }
                          </select>
                        } @else {
                          <span class="paso-cat-badge">{{ paso.categoriaNombre }}</span>
                        }
                        <button class="action-btn action-delete paso-delete" (click)="removePaso(paso.id)">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                      @if (paso.categoriaId && paso.productos.length > 0) {
                        <div class="paso-productos">
                          @for (prod of paso.productos; track prod.id) {
                            <label class="paso-producto-item" [class.paso-producto-item--disabled]="!prod.habilitado">
                              <input type="checkbox" class="paso-check" [checked]="prod.habilitado" (change)="togglePasoProducto(paso.id, prod.id)" />
                              <span class="paso-prod-name">{{ prod.nombre }}</span>
                              <span class="paso-prod-price">{{ formatPrice(prod.precio) }}</span>
                            </label>
                          }
                        </div>
                        <div class="paso-card-footer">
                          <span class="paso-footer-count">{{ getPasoHabilitados(paso) }} de {{ paso.productos.length }} seleccionados</span>
                          <button class="paso-confirm-btn" [disabled]="getPasoHabilitados(paso) === 0" (click)="confirmPaso(paso.id)">Confirmar paso</button>
                        </div>
                      }
                    </div>
                  }
                }
              </div>
            } @else {
              <div class="empty-state">Sin pasos opcionales configurados</div>
            }
            </div>
          </div>

          } @else {
          <!-- PRODUCTO NORMAL: Extras & Adicionales con tabla simple -->
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
            <div class="section-body">
              @if (extrasItems().length > 0) {
                <table class="items-table">
                  <thead><tr><th class="col-name">NOMBRE</th><th class="col-price">PRECIO</th><th class="col-qty">CANT.</th><th class="col-actions">ACCIONES</th></tr></thead>
                  <tbody>
                    @for (item of extrasItems(); track item.id) {
                      <tr>
                        @if (item.editing) {
                          <td class="col-name"><input class="inline-input" [(ngModel)]="item.nombre" placeholder="Nombre del extra"/></td>
                          <td class="col-price"><input class="inline-input inline-input-sm" type="number" [(ngModel)]="item.precio" placeholder="0" min="0"/></td>
                          <td class="col-qty"><input class="inline-input inline-input-xs" type="number" [(ngModel)]="item.cantidadMax" placeholder="1" min="1"/></td>
                          <td class="col-actions">
                            <button class="action-btn action-save" (click)="confirmEdit(item)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg></button>
                            <button class="action-btn action-delete" (click)="removeItem('extras', item.id)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg></button>
                          </td>
                        } @else {
                          <td class="col-name">{{ item.nombre }}</td>
                          <td class="col-price">{{ formatPrice(item.precio) }}</td>
                          <td class="col-qty">{{ item.cantidadMax }}</td>
                          <td class="col-actions">
                            <button class="action-btn action-edit" (click)="startEdit(item)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                            <button class="action-btn action-delete" (click)="removeItem('extras', item.id)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg></button>
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
          </div>

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
            <div class="section-body">
              @if (adicionalesItems().length > 0) {
                <table class="items-table">
                  <thead><tr><th class="col-name">NOMBRE</th><th class="col-price">PRECIO</th><th class="col-qty">CANT.</th><th class="col-actions">ACCIONES</th></tr></thead>
                  <tbody>
                    @for (item of adicionalesItems(); track item.id) {
                      <tr>
                        @if (item.editing) {
                          <td class="col-name"><input class="inline-input" [(ngModel)]="item.nombre" placeholder="Nombre del adicional"/></td>
                          <td class="col-price"><input class="inline-input inline-input-sm" type="number" [(ngModel)]="item.precio" placeholder="0" min="0"/></td>
                          <td class="col-qty"><input class="inline-input inline-input-xs" type="number" [(ngModel)]="item.cantidadMax" placeholder="1" min="1"/></td>
                          <td class="col-actions">
                            <button class="action-btn action-save" (click)="confirmEdit(item)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg></button>
                            <button class="action-btn action-delete" (click)="removeItem('adicionales', item.id)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg></button>
                          </td>
                        } @else {
                          <td class="col-name">{{ item.nombre }}</td>
                          <td class="col-price">{{ formatPrice(item.precio) }}</td>
                          <td class="col-qty">{{ item.cantidadMax }}</td>
                          <td class="col-actions">
                            <button class="action-btn action-edit" (click)="startEdit(item)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                            <button class="action-btn action-delete" (click)="removeItem('adicionales', item.id)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg></button>
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
          }
        </div>

        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
          <button type="button" class="btn btn-primary" (click)="onSubmit()">Guardar</button>
        </div>
        }
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
      padding: 12px 16px; border-radius: 10px 10px 0 0;
    }
    .section-header-orange { background: #FFF7ED; border: 1px solid #FED7AA; }
    .section-header-green { background: #F0FDF4; border: 1px solid #BBF7D0; }

    .section-body {
      border: 1px solid var(--slate-200);
      border-top: none;
      border-radius: 0 0 10px 10px;
      padding: 0 16px 12px;
    }

    .section-header-orange + .section-body { border-color: #FED7AA; }
    .section-header-green + .section-body { border-color: #BBF7D0; }

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
    /* Productos fijos */
    .fijos-list {
      padding: 0;
    }

    .fijo-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--primary-orange);
      flex-shrink: 0;
    }

    .fijo-row-name {
      flex: 1;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-heading);
    }

    .fijo-row-price {
      font-size: 13px;
      font-weight: 500;
      color: var(--slate-500);
      flex-shrink: 0;
    }

    .fijo-row-qty {
      font-size: 12px;
      font-weight: 600;
      color: var(--slate-400);
      background: var(--slate-100);
      padding: 1px 8px;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .fijo-editing-inline {
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid var(--slate-100);
      padding: 10px 0;
    }

    .fijo-inline-name {
      flex: 1;
      min-width: 0;
    }

    /* Pasos opcionales */
    .pasos-list {
      display: flex;
      flex-direction: column;
      gap: 0;
      padding: 4px 0 0;
    }

    .paso-card {
      border-top: 1px solid var(--slate-100);
      padding-top: 12px;
    }

    .paso-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 0 8px;
    }

    /* Paso confirmado: compact row */
    .paso-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid var(--slate-100);
    }

    .paso-row:last-child { border-bottom: none; }

    .paso-drag-handle {
      cursor: grab;
      color: var(--slate-300);
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .paso-drag-handle:active { cursor: grabbing; }

    .paso-row--dragging { opacity: 0.4; }

    .paso-row--drag-over {
      border-top: 2px solid var(--success-color, #00A43D);
      padding-top: 8px;
    }

    .paso-num {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: white;
      background: var(--success-color, #00A43D);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .paso-row-cat {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-heading);
    }

    .paso-row-count {
      font-size: 12px;
      color: var(--slate-400);
      margin-right: auto;
    }

    .paso-num-badge {
      font-size: 12px;
      font-weight: 700;
      color: white;
      background: var(--success-color, #00A43D);
      padding: 2px 10px;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .paso-cat-select {
      flex: 1;
      padding: 6px 28px 6px 10px;
      font-size: 13px;
      font-family: inherit;
      border: 1px solid var(--slate-200);
      border-radius: 6px;
      background: white;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
      background-size: 14px;
    }

    .paso-cat-badge {
      flex: 1;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-heading);
    }

    .paso-delete { margin-left: auto; }

    .paso-productos {
      display: flex;
      flex-direction: column;
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid var(--slate-100);
      border-radius: 8px;
    }

    .paso-productos::-webkit-scrollbar { width: 4px; }
    .paso-productos::-webkit-scrollbar-track { background: transparent; }
    .paso-productos::-webkit-scrollbar-thumb { background: var(--slate-200); border-radius: 10px; }

    .paso-producto-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px;
      cursor: pointer;
      transition: background 0.1s ease;
      border-bottom: 1px solid var(--slate-100);
    }

    .paso-producto-item:last-child { border-bottom: none; }
    .paso-producto-item:hover { background: var(--slate-50); }

    .paso-producto-item--disabled {
      opacity: 0.45;
    }

    .paso-check {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      accent-color: var(--success-color, #00A43D);
      cursor: pointer;
      flex-shrink: 0;
    }

    .paso-prod-name {
      flex: 1;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-heading);
    }

    .paso-prod-price {
      font-size: 12px;
      color: var(--slate-400);
      flex-shrink: 0;
    }

    .paso-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0 0;
    }

    .paso-footer-count {
      font-size: 11px;
      font-weight: 500;
      color: var(--slate-500);
    }

    .paso-confirm-btn {
      padding: 5px 14px;
      font-size: 12px;
      font-weight: 600;
      font-family: inherit;
      color: white;
      background: var(--success-color, #00A43D);
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: opacity 0.15s ease;
    }

    .paso-confirm-btn:hover:not(:disabled) { opacity: 0.85; }
    .paso-confirm-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* Pizza */
    .pizza-icon-sm { font-size: 14px; flex-shrink: 0; }

    .mitad-toggle-btn {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
    }

    .mitad-toggle-check {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .mitad-toggle-slider {
      width: 36px;
      height: 20px;
      background: var(--slate-300);
      border-radius: 10px;
      position: relative;
      transition: background 0.2s ease;
    }

    .mitad-toggle-slider::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      transition: transform 0.2s ease;
    }

    .mitad-toggle-check:checked + .mitad-toggle-slider {
      background: var(--success-color, #00A43D);
    }

    .mitad-toggle-check:checked + .mitad-toggle-slider::before {
      transform: translateX(16px);
    }

    .mitad-desc {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0 4px;
      font-size: 13px;
      color: var(--slate-500);
      line-height: 1.5;
    }

    .mitad-status {
      font-size: 12px;
      font-weight: 600;
      padding: 2px 10px;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .mitad-status--on {
      background: var(--success-bg);
      color: var(--success-color);
    }

    .mitad-status--off {
      background: var(--slate-100);
      color: var(--slate-500);
    }

    .autocomplete-wrapper {
      position: relative;
    }

    .autocomplete-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      z-index: 10;
      max-height: 180px;
      overflow-y: auto;
      margin-top: 4px;
    }

    .autocomplete-dropdown::-webkit-scrollbar { width: 4px; }
    .autocomplete-dropdown::-webkit-scrollbar-track { background: transparent; }
    .autocomplete-dropdown::-webkit-scrollbar-thumb { background: var(--slate-200); border-radius: 10px; }

    .autocomplete-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 8px 12px;
      font-size: 13px;
      font-family: inherit;
      border: none;
      background: none;
      cursor: pointer;
      transition: background 0.1s ease;
      text-align: left;
    }

    .autocomplete-option:hover { background: var(--slate-50); }

    .autocomplete-name {
      font-weight: 500;
      color: var(--text-heading);
    }

    .autocomplete-price {
      font-size: 12px;
      color: var(--slate-400);
      flex-shrink: 0;
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
  @Input() isPizza = false;
  @Input() isComboOrMenu = false;
  @Input() pizzaConfig?: PizzaConfig;
  @Output() guardar = new EventEmitter<ExtrasFormData>();
  @Output() guardarPizza = new EventEmitter<PizzaConfig>();
  @Output() cancelar = new EventEmitter<void>();

  extrasItems = signal<EditableExtraItem[]>([]);
  adicionalesItems = signal<EditableExtraItem[]>([]);
  pasos = signal<PasoOpcional[]>([]);
  suggestions = signal<ProductoGridRow[]>([]);
  activeItemId = signal<number | null>(null);

  draggingPasoId = signal<number | null>(null);
  dragOverPasoId = signal<number | null>(null);

  pizzaTamanos = signal<PizzaTamano[]>([]);
  pizzaPermiteMitad = signal(false);
  editingTamanoId = signal<number | null>(null);
  private nextTamanoId = 100;

  readonly categorias: CategoriaGridRow[] = MOCK_CATEGORIAS;
  private allProductos: ProductoGridRow[] = MOCK_CATEGORIAS.flatMap(c => c.productos);
  private nextId = 1000;
  private nextPasoId = 1;

  ngOnInit(): void {
    this.extrasItems.set(this.extras.map(e => ({ ...e, editing: false })));
    this.adicionalesItems.set(this.adicionales.map(a => ({ ...a, editing: false })));
    if (this.pizzaConfig) {
      this.pizzaTamanos.set(this.pizzaConfig.tamanos.map(t => ({ ...t })));
      this.pizzaPermiteMitad.set(this.pizzaConfig.permiteMitad);
    }
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
      this.activeItemId.set(newItem.id);
      this.extrasItems.update(items => [...items, newItem]);
    } else {
      this.adicionalesItems.update(items => [...items, newItem]);
    }
  }

  onSearchInput(query: string): void {
    const term = query.toLowerCase().trim();
    if (term.length < 1) {
      this.suggestions.set(this.allProductos.slice(0, 8));
      return;
    }
    this.suggestions.set(
      this.allProductos
        .filter(p => p.nombre.toLowerCase().includes(term))
        .slice(0, 8)
    );
  }

  selectSuggestion(item: EditableExtraItem, prod: ProductoGridRow): void {
    item.nombre = prod.nombre;
    item.precio = prod.precio;
    this.suggestions.set([]);
    this.activeItemId.set(null);
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
    this.suggestions.set([]);
    this.activeItemId.set(null);
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

  addPaso(): void {
    const newPaso: PasoOpcional = {
      id: this.nextPasoId++,
      categoriaId: null,
      categoriaNombre: '',
      productos: [],
      confirmado: false,
    };
    this.pasos.update(p => [...p, newPaso]);
  }

  confirmPaso(pasoId: number): void {
    this.pasos.update(pasos => pasos.map(p => {
      if (p.id !== pasoId) return p;
      return { ...p, productos: p.productos.filter(prod => prod.habilitado), confirmado: true };
    }));
  }

  editPaso(pasoId: number): void {
    const paso = this.pasos().find(p => p.id === pasoId);
    if (!paso || !paso.categoriaId) return;
    const cat = this.categorias.find(c => c.id === paso.categoriaId);
    if (!cat) return;
    const habilitadoIds = new Set(paso.productos.map(p => p.id));
    const fullProductos = cat.productos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      habilitado: habilitadoIds.has(p.id),
    }));
    this.pasos.update(pasos => pasos.map(p =>
      p.id === pasoId ? { ...p, productos: fullProductos, confirmado: false } : p
    ));
  }

  onPasoCategoriaChange(paso: PasoOpcional, event: Event): void {
    const catId = Number((event.target as HTMLSelectElement).value);
    const cat = this.categorias.find(c => c.id === catId);
    if (!cat) return;
    paso.categoriaId = catId;
    paso.categoriaNombre = cat.nombre;
    paso.productos = cat.productos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      habilitado: true,
    }));
    this.pasos.update(p => [...p]);
  }

  togglePasoProducto(pasoId: number, prodId: number): void {
    this.pasos.update(pasos => pasos.map(p => {
      if (p.id !== pasoId) return p;
      return {
        ...p,
        productos: p.productos.map(prod =>
          prod.id === prodId ? { ...prod, habilitado: !prod.habilitado } : prod
        ),
      };
    }));
  }

  removePaso(pasoId: number): void {
    this.pasos.update(p => p.filter(paso => paso.id !== pasoId));
  }

  getPasoCategoriaName(catId: number): string {
    return this.categorias.find(c => c.id === catId)?.nombre ?? '';
  }

  getPasoHabilitados(paso: PasoOpcional): number {
    return paso.productos.filter(p => p.habilitado).length;
  }

  addPizzaTamano(): void {
    const newTam: PizzaTamano = { id: this.nextTamanoId++, nombre: '', precio: 0, porciones: 4 };
    this.pizzaTamanos.update(t => [...t, newTam]);
    this.editingTamanoId.set(newTam.id);
  }

  confirmTamano(): void {
    this.editingTamanoId.set(null);
    this.pizzaTamanos.update(t => [...t]);
  }

  removeTamano(id: number): void {
    this.pizzaTamanos.update(t => t.filter(tam => tam.id !== id));
    if (this.editingTamanoId() === id) this.editingTamanoId.set(null);
  }

  onSubmitPizza(): void {
    const config: PizzaConfig = {
      tamanos: this.pizzaTamanos().filter(t => t.nombre.trim()),
      sabores: this.pizzaConfig?.sabores ?? [],
      permiteMitad: this.pizzaPermiteMitad(),
    };
    this.guardarPizza.emit(config);
  }

  onPasoDragStart(event: DragEvent, pasoId: number): void {
    this.draggingPasoId.set(pasoId);
    event.dataTransfer?.setData('text/plain', String(pasoId));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  onPasoDragEnd(): void {
    this.draggingPasoId.set(null);
    this.dragOverPasoId.set(null);
  }

  onPasoDragOver(event: DragEvent, pasoId: number): void {
    if (!this.draggingPasoId()) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this.dragOverPasoId.set(pasoId);
  }

  onPasoDrop(event: DragEvent, targetId: number): void {
    event.preventDefault();
    const sourceId = this.draggingPasoId();
    if (!sourceId || sourceId === targetId) {
      this.draggingPasoId.set(null);
      this.dragOverPasoId.set(null);
      return;
    }
    this.pasos.update(pasos => {
      const list = [...pasos];
      const fromIdx = list.findIndex(p => p.id === sourceId);
      const toIdx = list.findIndex(p => p.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return list;
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      return list;
    });
    this.draggingPasoId.set(null);
    this.dragOverPasoId.set(null);
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
