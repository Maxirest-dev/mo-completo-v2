import {
  Component,
  ChangeDetectionStrategy,
  Input,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InsumoPerfil, Ingrediente, PasoElaboracion } from '../../models/insumo-perfil.model';
import { MOCK_INSUMO_PERFIL } from '../../data/mock-insumo-perfil.data';
import { MOCK_DEPOSITOS } from '../../data/mock-inventario.data';
import { IngredientesDialogComponent, IngredientesFormData } from './ingredientes-dialog.component';
import { ElaboracionDialogComponent, ElaboracionFormData } from './elaboracion-dialog.component';
import { NotificationService } from '@mro/shared-ui';

type EditField = 'tipoInsumo' | 'deposito' | 'unidad' | 'codigo' | 'precio' | 'stock' | null;

@Component({
  selector: 'app-insumo-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, IngredientesDialogComponent, ElaboracionDialogComponent],
  template: `
    <div class="perfil-container">
      <!-- Back button -->
      <button class="back-btn" (click)="goBack()" title="Volver">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>

      @if (loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
        </div>
      } @else if (insumo(); as ins) {
        <!-- Top Row: 3 columns -->
        <div class="top-row">
          <!-- Col 1: Image -->
          <div class="image-card">
            @if (ins.imagen) {
              <img [src]="ins.imagen" [alt]="ins.nombre" class="product-image"/>
            } @else {
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--slate-300)" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"/>
              </svg>
              <span class="image-text">Sin imagen</span>
            }
          </div>

          <!-- Col 2: Name + Description -->
          <div class="info-card">
            <div class="info-name-row">
              <h1 class="info-nombre">{{ ins.nombre }}</h1>
              <span class="status-badge" [class.status-inactive]="!ins.activo">
                <span class="status-dot"></span>
                {{ ins.activo ? 'Activo' : 'Inactivo' }}
              </span>
              <button class="btn-edit-icon" aria-label="Editar nombre">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
            <div class="info-desc-section">
              <div class="info-desc-header">
                <label class="section-label">DESCRIPCION</label>
              </div>
              <p class="info-description">Insumo {{ ins.tipoInsumo === 'ELABORADO' ? 'elaborado' : 'comprado' }} - {{ ins.depositoNombre }} - {{ ins.unidadMedida }}</p>
            </div>
          </div>

          <!-- Col 3: CTA Cards 2x3 -->
          <div class="cta-grid">
            @for (cta of ctaCards(); track cta.field) {
              <div class="cta-card" [class.cta-card-editing]="editingField() === cta.field" (click)="openEdit(cta.field)">
                <div class="cta-header">
                  <div class="cta-icon-label">
                    <span class="cta-dot" [style.background]="cta.color"></span>
                    <span class="cta-label">{{ cta.label }}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cta-edit-icon">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                @if (editingField() === cta.field && cta.field !== 'stock') {
                  <!-- Inline edit -->
                  <div class="cta-inline-edit" (click)="$event.stopPropagation()">
                    @switch (cta.field) {
                      @case ('tipoInsumo') {
                        <select class="inline-input" [(ngModel)]="editVal" (change)="saveEdit()">
                          <option value="COMPRADO">Comprado</option>
                          <option value="ELABORADO">Elaborado</option>
                        </select>
                      }
                      @case ('deposito') {
                        <select class="inline-input" [(ngModel)]="editVal" (change)="saveEdit()">
                          @for (dep of depositoOptions; track dep.id) {
                            <option [value]="dep.nombre">{{ dep.nombre }}</option>
                          }
                        </select>
                      }
                      @case ('unidad') {
                        <select class="inline-input" [(ngModel)]="editVal" (change)="saveEdit()">
                          <option value="kg">Kilogramos (kg)</option>
                          <option value="lt">Litros (lt)</option>
                          <option value="unidad">Unidad</option>
                          <option value="paquete">Paquete</option>
                        </select>
                      }
                      @case ('codigo') {
                        <input class="inline-input inline-input-with-btn" type="text" [(ngModel)]="editVal" placeholder="Ej: VER-001" (keydown.enter)="saveEdit()" (keydown.escape)="closeEdit()"/>
                        <button class="cta-save-btn" (click)="saveEdit()">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                          </svg>
                        </button>
                      }
                      @case ('precio') {
                        <input class="inline-input inline-input-with-btn" type="number" [(ngModel)]="editVal" placeholder="0" min="0" (keydown.enter)="saveEdit()" (keydown.escape)="closeEdit()"/>
                        <button class="cta-save-btn" (click)="saveEdit()">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                          </svg>
                        </button>
                      }
                    }
                  </div>
                } @else {
                  <span class="cta-value" [class.cta-value-price]="cta.field === 'precio'" [ngClass]="{
                    'stock-normal': cta.field === 'stock' && ins.estadoStock === 'NORMAL',
                    'stock-bajo': cta.field === 'stock' && ins.estadoStock === 'BAJO',
                    'stock-critico': cta.field === 'stock' && ins.estadoStock === 'CRITICO'
                  }">{{ cta.value }}</span>
                }
              </div>
            }
          </div>
        </div>

        <!-- Stock Dialog (only for stock, which has 2 fields) -->
        @if (editingField() === 'stock') {
          <div class="edit-backdrop" (click)="closeEdit()">
            <div class="edit-dialog" (click)="$event.stopPropagation()">
              <header class="edit-header">
                <h2 class="edit-title">Stock</h2>
              </header>
              <div class="edit-body">
                <div class="edit-stock-row">
                  <div class="edit-stock-field">
                    <label class="edit-stock-label">Stock actual</label>
                    <input class="edit-input" type="number" [(ngModel)]="editVal" placeholder="0" min="0"/>
                  </div>
                  <div class="edit-stock-field">
                    <label class="edit-stock-label">Stock minimo</label>
                    <input class="edit-input" type="number" [(ngModel)]="editVal2" placeholder="0" min="0"/>
                  </div>
                </div>
              </div>
              <div class="edit-actions">
                <button class="btn btn-secondary" (click)="closeEdit()">Cancelar</button>
                <button class="btn btn-primary" (click)="saveEdit()">Guardar</button>
              </div>
            </div>
          </div>
        }

        <!-- Transformacion Dialog -->
        @if (showTransformacionDialog()) {
          <div class="edit-backdrop" (click)="showTransformacionDialog.set(false)">
            <div class="edit-dialog" (click)="$event.stopPropagation()">
              <header class="edit-header">
                <h2 class="edit-title">{{ editingTransformacionId ? 'Editar transformacion' : 'Nueva transformacion' }}</h2>
                <p class="edit-subtitle">Define como se transforma {{ ins.nombre }} y el resultado obtenido.</p>
              </header>
              <div class="edit-body">
                <div class="edit-field">
                  <label class="edit-field-label">Cantidad de {{ ins.nombre }} a usar</label>
                  <div class="edit-field-row">
                    <input class="edit-input edit-input-short" type="number" [(ngModel)]="newT.origenCantidad" placeholder="1" min="1"/>
                    <span class="edit-field-hint">{{ ins.unidadMedida }}</span>
                  </div>
                </div>
                <div class="edit-field">
                  <label class="edit-field-label">Tipo de transformacion</label>
                  <input class="edit-input" type="text" [(ngModel)]="newT.tipoTransformacion" placeholder="Ej: rebanar, cortar, empanar, procesar..."/>
                </div>
                <div class="edit-field">
                  <label class="edit-field-label">Resultado</label>
                  <input class="edit-input" type="text" [(ngModel)]="newT.resultado" placeholder="Ej: rebanadas de tomate"/>
                </div>
                <div class="edit-field-grid">
                  <div class="edit-field">
                    <label class="edit-field-label">Cantidad resultado</label>
                    <input class="edit-input" type="number" [(ngModel)]="newT.resultadoCantidad" placeholder="1" min="1"/>
                  </div>
                  <div class="edit-field">
                    <label class="edit-field-label">Unidad</label>
                    <select class="edit-input" [(ngModel)]="newT.resultadoUnidad">
                      <option value="unidades">Unidades</option>
                      <option value="kg">Kilogramos (kg)</option>
                      <option value="gr">Gramos (gr)</option>
                      <option value="lt">Litros (lt)</option>
                      <option value="ml">Mililitros (ml)</option>
                      <option value="porciones">Porciones</option>
                      <option value="fetas">Fetas</option>
                      <option value="rodajas">Rodajas</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="edit-actions">
                <button class="btn btn-secondary" (click)="showTransformacionDialog.set(false)">Cancelar</button>
                <button class="btn btn-primary" (click)="saveTransformacion()" [disabled]="!newT.tipoTransformacion?.trim() || !newT.resultado?.trim()">{{ editingTransformacionId ? 'Guardar' : 'Agregar' }}</button>
              </div>
            </div>
          </div>
        }

        <!-- Content Section - conditional on tipo -->
        @if (ins.tipoInsumo === 'COMPRADO') {
          <!-- Transformaciones (full width) -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-title-group">
                <svg class="section-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                </svg>
                <h2 class="section-title">Transformaciones</h2>
                <span class="section-subtitle">Como se puede procesar este insumo</span>
              </div>
              <button class="btn-add" (click)="openTransformacionDialog()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
                Agregar transformacion
              </button>
            </div>
            @if (ins.transformaciones.length > 0) {
              <div class="transformaciones-list">
                @for (t of ins.transformaciones; track t.id) {
                  <div class="transformacion-row">
                    <span class="t-origen">{{ t.origenCantidad }} {{ t.origen }}</span>
                    <svg class="t-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                    </svg>
                    <span class="t-tipo-badge">{{ t.tipoTransformacion }}</span>
                    <svg class="t-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                    </svg>
                    <span class="t-resultado">{{ t.resultado }}</span>
                    <span class="t-cantidad">({{ t.resultadoCantidad }} {{ t.resultadoUnidad }})</span>
                    <div class="t-actions">
                      <button class="t-edit" (click)="editTransformacion(t)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="t-remove" (click)="removeTransformacion(t.id)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-section">
                <p>No hay transformaciones registradas para este insumo</p>
              </div>
            }

          </div>
        } @else {
          <!-- ELABORADO: Ingredientes + Elaboracion in 2 cols -->
          <div class="bottom-grid">
            <!-- Ingredientes -->
            <div class="detail-card">
              <div class="detail-card-header">
                <h3 class="detail-card-title">INGREDIENTES</h3>
                <div class="detail-card-actions">
                  @if (ins.pesoTotal) {
                    <span class="detail-card-extra">{{ formatPrice(ins.precio) }}</span>
                  }
                  <button class="icon-btn" (click)="activeDialog.set('ingredientes')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </div>
              </div>
              @if (ins.ingredientes.length > 0) {
                <ul class="ingredientes-list-elab">
                  @for (ing of ingredientesVisibles(); track ing.id) {
                    <li class="ingrediente-item">
                      <span class="ingrediente-dot"></span>
                      <span class="ingrediente-name">{{ ing.nombre }} {{ ing.cantidad }}{{ ing.unidad }}</span>
                    </li>
                  }
                </ul>
                @if (ins.pesoTotal) {
                  <div class="peso-total">{{ ins.pesoTotal }}</div>
                }
                @if (ins.ingredientes.length > 5) {
                  <div class="ver-mas-row">
                    <button class="ver-mas-btn" (click)="toggleIngredientes()">
                      {{ showAllIngredientes() ? 'Ver menos' : 'Ver mas' }}
                    </button>
                  </div>
                }
              } @else {
                <div class="empty-section"><p>Sin ingredientes</p></div>
              }
            </div>

            <!-- Elaboracion paso a paso -->
            <div class="detail-card">
              <div class="detail-card-header">
                <h3 class="detail-card-title">ELABORACION PASO A PASO</h3>
                <div class="detail-card-actions">
                  @if (ins.tiempoElaboracion) {
                    <span class="detail-card-extra">{{ ins.tiempoElaboracion }}</span>
                  }
                  <button class="icon-btn" (click)="activeDialog.set('elaboracion')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </div>
              </div>
              @if (ins.elaboracion.length > 0) {
                <ol class="elaboracion-list">
                  @for (paso of ins.elaboracion; track paso.numero) {
                    <li class="elaboracion-item">
                      <span class="elaboracion-desc">{{ paso.numero }}- {{ paso.descripcion }}</span>
                    </li>
                  }
                </ol>
              } @else {
                <div class="empty-section"><p>Sin pasos de elaboracion</p></div>
              }
            </div>
          </div>
        }

        <!-- Ingredientes Dialog -->
        @if (activeDialog() === 'ingredientes') {
          <app-ingredientes-dialog
            [ingredientes]="ins.ingredientes"
            (guardar)="onGuardarIngredientes($event)"
            (cancelar)="activeDialog.set(null)"
          />
        }

        <!-- Elaboracion Dialog -->
        @if (activeDialog() === 'elaboracion') {
          <app-elaboracion-dialog
            [elaboracion]="ins.elaboracion"
            (guardar)="onGuardarElaboracion($event)"
            (cancelar)="activeDialog.set(null)"
          />
        }

        <!-- CTA Bar -->
        <div class="cta-bar">
          <button class="btn btn-primary">Guardar cambios</button>
        </div>
      } @else {
        <!-- Not Found -->
        <div class="not-found-card">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="nf-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>
          </svg>
          <h2 class="nf-title">Insumo no encontrado</h2>
          <p class="nf-desc">No se encontro un insumo con el ID #{{ id }}</p>
          <button class="btn btn-primary" (click)="goBack()">Volver al inventario</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .perfil-container {
      max-width: 1300px;
      margin: 0 auto;
      padding-bottom: 32px;
    }

    /* Breadcrumb */
    .back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--slate-200);
      background: white;
      color: var(--slate-700);
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
      margin-bottom: 24px;
    }
    .back-btn:hover { background: var(--slate-50); border-color: var(--slate-300); }

    /* Loading */
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 80px 0;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--slate-200);
      border-top-color: var(--primary-orange);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ===== Top Row — 3 columns ===== */
    .top-row {
      display: grid;
      grid-template-columns: 220px 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    /* Col 1: Image card */
    .image-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      min-height: 220px;
    }

    .product-image { width: 100%; height: 100%; object-fit: cover; }
    .image-text {
      font-size: 14px;
      color: var(--slate-300);
      font-weight: 500;
    }

    /* Col 2: Info card */
    .info-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
    }

    .info-name-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 20px;
      background: var(--success-bg);
      color: var(--success-text);
      flex-shrink: 0;
    }

    .status-dot {
      width: 7px; height: 7px; border-radius: 50%; background: var(--success-color);
    }

    .status-inactive { background: var(--slate-100); color: var(--slate-500); }
    .status-inactive .status-dot { background: var(--slate-400); }

    .info-nombre {
      font-size: 22px; font-weight: 700; color: var(--text-heading); margin: 0; flex: 1;
    }

    .btn-edit-icon {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; padding: 0; background: transparent;
      border: none; color: var(--slate-400); cursor: pointer; border-radius: 6px;
      transition: all 0.15s; flex-shrink: 0;
    }
    .btn-edit-icon:hover { color: var(--slate-500); background: var(--slate-100); }

    .info-desc-section { border-top: 1px solid var(--slate-100); padding-top: 16px; }
    .info-desc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .section-label {
      font-size: 11px; font-weight: 600; color: var(--slate-400);
      letter-spacing: 0.04em; text-transform: uppercase;
    }
    .info-description { font-size: 14px; color: var(--slate-500); margin: 0; line-height: 1.5; }

    /* Col 3: CTA grid */
    .cta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(3, 1fr);
      gap: 10px;
    }

    .cta-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 14px 16px;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .cta-card:hover { border-color: var(--slate-300); background: #FAFAFA; }

    .cta-header {
      display: flex; align-items: center; justify-content: space-between;
    }
    .cta-icon-label { display: flex; align-items: center; gap: 6px; }
    .cta-icon { flex-shrink: 0; }
    .cta-label { font-size: 12px; font-weight: 600; color: var(--slate-500); }
    .cta-edit-icon { color: var(--slate-300); transition: color 0.15s; }
    .cta-card:hover .cta-edit-icon { color: var(--slate-400); }

    .cta-value {
      font-size: 16px; font-weight: 700; color: var(--text-heading);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .cta-value-price { color: #059669; }
    .cta-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .cta-card-editing { border-color: var(--primary-orange); background: #FFFBF5; }
    .cta-save-btn {
      display: flex; align-items: center; justify-content: center;
      width: 24px; height: 24px; padding: 0;
      background: #059669; color: white; border: none;
      border-radius: 6px; cursor: pointer; transition: background 0.15s;
    }
    .cta-save-btn:hover { background: #047857; }
    .cta-inline-edit { width: 100%; display: flex; align-items: center; gap: 6px; }
    .inline-input-with-btn { flex: 1; min-width: 0; }
    .inline-input {
      width: 100%; padding: 6px 10px; font-size: 14px; font-weight: 600;
      font-family: inherit; color: var(--text-heading); background: white;
      border: 1px solid var(--slate-200); border-radius: 6px; transition: all 0.15s;
    }
    .inline-input:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 2px rgba(249,115,22,0.1); }
    select.inline-input { cursor: pointer; appearance: auto; }

    /* Edit dialog */
    .edit-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px;
    }
    .edit-dialog {
      background: white; border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      width: 100%; max-width: 400px;
    }
    .edit-header { padding: 24px 24px 0; }
    .edit-title { font-size: 18px; font-weight: 600; color: var(--text-heading); margin: 0; }
    .edit-body { padding: 20px 24px; }
    .edit-input {
      width: 100%; padding: 12px 14px; font-size: 14px; font-family: inherit;
      color: var(--text-primary); background: white; border: 1px solid var(--slate-200);
      border-radius: 10px; transition: all 0.15s;
    }
    .edit-input:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
    .edit-input-prefix-wrap { position: relative; display: flex; align-items: center; }
    .edit-prefix {
      position: absolute; left: 14px; color: var(--slate-500);
      font-size: 14px; font-weight: 500; pointer-events: none;
    }
    .edit-input.has-prefix { padding-left: 30px; }
    .edit-stock-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .edit-stock-field { display: flex; flex-direction: column; gap: 6px; }
    .edit-stock-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .edit-actions {
      display: flex; justify-content: flex-end; gap: 12px; padding: 0 24px 24px;
    }
    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 10px 20px; font-size: 14px; font-weight: 500; font-family: inherit;
      border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s;
    }
    .btn-primary { background: var(--text-heading); color: white; }
    .btn-primary:hover { background: var(--text-primary); }
    .btn-secondary { background: white; color: var(--text-primary); border: 1px solid var(--slate-200); }
    .btn-secondary:hover { background: var(--slate-50); }

    .data-card-header {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .data-card-icon {
      flex-shrink: 0;
    }

    .icon-green { color: var(--success-color); }
    .icon-orange { color: var(--primary-orange); }
    .icon-blue { color: #3B82F6; }
    .icon-purple { color: #7C3AED; }
    .icon-red { color: var(--danger-color); }

    .data-card-label {
      font-size: 12px;
      color: var(--slate-400);
      font-weight: 500;
    }

    .data-card-value {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-heading);
      padding-left: 22px;
    }

    .stock-normal { color: var(--text-heading); }
    .stock-bajo { color: var(--warning-color); }
    .stock-critico { color: var(--danger-color); }

    /* ===== Section Card ===== */
    .section-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 14px;
      overflow: hidden;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      gap: 16px;
    }

    .section-header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-icon {
      color: var(--text-primary);
      flex-shrink: 0;
    }

    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-heading);
      margin: 0;
      letter-spacing: 0.02em;
    }

    .section-subtitle {
      font-size: 14px;
      color: var(--slate-400);
      font-weight: 400;
    }

    .section-meta {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-heading);
    }

    .btn-add {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      color: #FF8800;
      background: #FFFFFF;
      border: 1px solid #FF8800;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .btn-add:hover {
      background: #FFF7ED;
    }

    /* ===== Transformaciones ===== */
    .transformaciones-list {
      padding: 0 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .transformacion-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      background: var(--slate-100);
      border-radius: 10px;
      font-size: 14px;
    }

    .t-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: auto;
      flex-shrink: 0;
    }

    .t-origen {
      font-weight: 600;
      color: var(--text-heading);
    }

    .t-arrow {
      color: var(--slate-400);
      flex-shrink: 0;
    }

    .t-resultado {
      font-weight: 600;
      color: var(--text-heading);
    }

    .t-cantidad {
      color: var(--primary-orange);
      font-weight: 500;
    }

    .t-tipo-badge {
      display: inline-flex; padding: 3px 10px; font-size: 12px; font-weight: 600;
      background: #FFF7ED; color: var(--primary-orange-hover); border: 1px solid #FDBA74;
      border-radius: 6px; text-transform: capitalize;
    }

    .t-edit, .t-remove {
      display: flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; padding: 0;
      background: white; border: 1px solid var(--slate-200); color: var(--slate-500); cursor: pointer;
      border-radius: 6px; transition: all 0.15s; flex-shrink: 0;
    }
    .t-edit:hover { color: var(--text-primary); border-color: var(--slate-300); background: var(--slate-50); }
    .t-remove:hover { color: var(--danger-color); border-color: #FECACA; background: #FEF2F2; }

    /* Dialog extra fields */
    .edit-subtitle { font-size: 13px; color: var(--slate-500); margin: 6px 0 0; }
    .edit-field { margin-bottom: 16px; }
    .edit-field:last-child { margin-bottom: 0; }
    .edit-field-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
    .edit-field-row { display: flex; align-items: center; gap: 10px; }
    .edit-input-short { width: 80px; }
    .edit-field-hint { font-size: 13px; color: var(--slate-400); }
    .edit-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    /* ===== Bottom Grid (2 columns) ===== */
    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .detail-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 24px;
    }
    .detail-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .detail-card-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin: 0;
    }
    .detail-card-extra {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
    }
    .detail-card-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; padding: 0;
      background: transparent; border: none; color: var(--slate-400);
      cursor: pointer; border-radius: 6px; transition: all 0.15s;
    }
    .icon-btn:hover { color: var(--slate-500); background: var(--slate-100); }

    /* Ingredientes list */
    .ingredientes-list-elab {
      list-style: none; padding: 0; margin: 0;
    }
    .ingrediente-item {
      display: flex; align-items: center; gap: 10px; padding: 8px 0;
    }
    .ingrediente-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--primary-orange); flex-shrink: 0;
    }
    .ingrediente-name {
      font-size: 14px; font-weight: 500; color: var(--text-heading);
    }
    .peso-total {
      margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--slate-100);
      font-size: 14px; font-weight: 600; color: var(--slate-500);
    }
    .ver-mas-row {
      display: flex; justify-content: flex-end; margin-top: 12px;
    }
    .ver-mas-btn {
      padding: 0; font-size: 13px; font-weight: 500; font-family: inherit;
      color: var(--primary-orange); background: none; border: none;
      cursor: pointer; transition: color 0.15s;
    }
    .ver-mas-btn:hover { color: var(--primary-orange-hover); }

    /* Elaboracion list */
    .elaboracion-list {
      list-style: none; padding: 0; margin: 0;
    }
    .elaboracion-item {
      padding: 8px 0;
    }
    .elaboracion-desc {
      font-size: 14px; color: var(--text-primary); line-height: 1.6;
    }

    .paso-desc {
      color: var(--text-primary);
      line-height: 1.6;
    }

    /* ===== Empty Section ===== */
    .empty-section {
      padding: 32px 24px;
      text-align: center;
    }

    .empty-section p {
      font-size: 14px;
      color: var(--slate-400);
      margin: 0;
    }

    /* ===== CTA Bar ===== */
    .cta-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 32px;
    }

    /* ===== Buttons ===== */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 32px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-primary {
      background-color: var(--text-heading);
      color: white;
    }

    .btn-primary:hover {
      background-color: var(--text-primary);
    }

    /* ===== Not Found ===== */
    .not-found-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 80px 40px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .nf-icon { color: var(--primary-orange); margin-bottom: 8px; }

    .nf-title {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-heading);
      margin: 0;
    }

    .nf-desc {
      font-size: 14px;
      color: var(--slate-500);
      margin: 0 0 16px;
    }

    /* ===== Animations ===== */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .top-row,
    .section-card,
    .bottom-grid,
    .cta-bar {
      animation: fadeIn 0.2s ease;
    }

    /* ===== Responsive ===== */
    @media (max-width: 1024px) {
      .top-row {
        grid-template-columns: 180px 1fr;
      }

      .data-grid {
        grid-column: 1 / -1;
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .top-row {
        grid-template-columns: 1fr;
      }

      .image-card {
        min-height: 140px;
      }

      .data-grid {
        grid-template-columns: 1fr 1fr;
      }

      .info-nombre {
        font-size: 18px;
      }

      .bottom-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .section-subtitle {
        display: none;
      }

      .transformacion-row {
        flex-wrap: wrap;
        gap: 6px;
      }

      .cta-bar {
        justify-content: center;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsumoPerfilComponent implements OnInit {
  @Input() id!: string;

  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly loading = signal(true);
  readonly insumo = signal<InsumoPerfil | null>(null);
  readonly showAllIngredientes = signal(false);
  readonly editingField = signal<EditField>(null);
  readonly activeDialog = signal<'ingredientes' | 'elaboracion' | null>(null);
  editVal: any = '';
  editVal2: any = '';

  depositoOptions = MOCK_DEPOSITOS.map(d => ({ id: d.id, nombre: d.nombre }));

  showTransformacionDialog = signal(false);
  editingTransformacionId: number | null = null;
  newT = { origenCantidad: 1, tipoTransformacion: '', resultado: '', resultadoCantidad: 1, resultadoUnidad: 'unidades' };

  readonly ingredientesVisibles = computed(() => {
    const ins = this.insumo();
    if (!ins) return [];
    if (this.showAllIngredientes()) return ins.ingredientes;
    return ins.ingredientes.slice(0, 5);
  });

  readonly ctaCards = computed(() => {
    const ins = this.insumo();
    if (!ins) return [];
    return [
      { field: 'tipoInsumo' as EditField, label: 'Tipo insumo', color: 'var(--primary-orange)', value: ins.tipoInsumo },
      { field: 'deposito' as EditField, label: 'Deposito', color: '#3B82F6', value: ins.depositoNombre },
      { field: 'unidad' as EditField, label: 'Unidad', color: '#8B5CF6', value: ins.unidadMedida },
      { field: 'codigo' as EditField, label: 'Codigo', color: 'var(--primary-orange)', value: ins.codigo || '-' },
      { field: 'precio' as EditField, label: 'Precio', color: 'var(--success-color)', value: this.formatPrice(ins.precio) },
      { field: 'stock' as EditField, label: 'Stock', color: 'var(--danger-color)', value: `${ins.stockActual} / ${ins.stockMinimo} min` },
    ];
  });

  readonly editTitle = computed(() => {
    const titles: Record<string, string> = {
      tipoInsumo: 'Tipo de insumo',
      deposito: 'Deposito',
      unidad: 'Unidad de medida',
      codigo: 'Codigo',
      precio: 'Precio',
      stock: 'Stock',
    };
    return titles[this.editingField() ?? ''] ?? '';
  });

  ngOnInit(): void {
    setTimeout(() => {
      const numId = Number(this.id);
      const data = MOCK_INSUMO_PERFIL[numId] ?? null;
      this.insumo.set(data);
      this.loading.set(false);
    }, 400);
  }

  goBack(): void {
    this.router.navigate(['/inventario']);
  }

  formatPrice(price: number | null): string {
    if (price == null) return '-';
    return '$' + price.toLocaleString('es-AR');
  }

  onGuardarIngredientes(data: IngredientesFormData): void {
    const ins = this.insumo();
    if (!ins) return;
    this.insumo.set({ ...ins, ingredientes: data.ingredientes });
    this.activeDialog.set(null);
    this.notificationService.success('Ingredientes actualizados');
  }

  onGuardarElaboracion(data: ElaboracionFormData): void {
    const ins = this.insumo();
    if (!ins) return;
    this.insumo.set({ ...ins, elaboracion: data.elaboracion });
    this.activeDialog.set(null);
    this.notificationService.success('Elaboracion actualizada');
  }

  toggleIngredientes(): void {
    this.showAllIngredientes.set(!this.showAllIngredientes());
  }

  openTransformacionDialog(): void {
    this.editingTransformacionId = null;
    this.newT = { origenCantidad: 1, tipoTransformacion: '', resultado: '', resultadoCantidad: 1, resultadoUnidad: 'unidades' };
    this.showTransformacionDialog.set(true);
  }

  editTransformacion(t: any): void {
    this.editingTransformacionId = t.id;
    this.newT = {
      origenCantidad: t.origenCantidad,
      tipoTransformacion: t.tipoTransformacion,
      resultado: t.resultado,
      resultadoCantidad: t.resultadoCantidad,
      resultadoUnidad: t.resultadoUnidad,
    };
    this.showTransformacionDialog.set(true);
  }

  saveTransformacion(): void {
    const ins = this.insumo();
    if (!ins || !this.newT.tipoTransformacion?.trim() || !this.newT.resultado?.trim()) return;

    if (this.editingTransformacionId) {
      const updated = ins.transformaciones.map(t =>
        t.id === this.editingTransformacionId
          ? { ...t, origenCantidad: this.newT.origenCantidad || 1, tipoTransformacion: this.newT.tipoTransformacion.trim(), resultado: this.newT.resultado.trim(), resultadoCantidad: this.newT.resultadoCantidad || 1, resultadoUnidad: this.newT.resultadoUnidad || 'unidades' }
          : t
      );
      this.insumo.set({ ...ins, transformaciones: updated });
      this.notificationService.success('Transformacion actualizada');
    } else {
      const newId = Math.max(0, ...ins.transformaciones.map(t => t.id)) + 1;
      const t = {
        id: newId,
        origen: ins.nombre.toLowerCase(),
        origenCantidad: this.newT.origenCantidad || 1,
        tipoTransformacion: this.newT.tipoTransformacion.trim(),
        resultado: this.newT.resultado.trim(),
        resultadoCantidad: this.newT.resultadoCantidad || 1,
        resultadoUnidad: this.newT.resultadoUnidad || 'unidades',
      };
      this.insumo.set({ ...ins, transformaciones: [...ins.transformaciones, t] });
      this.notificationService.success('Transformacion agregada');
    }

    this.editingTransformacionId = null;
    this.newT = { origenCantidad: 1, tipoTransformacion: '', resultado: '', resultadoCantidad: 1, resultadoUnidad: 'unidades' };
    this.showTransformacionDialog.set(false);
  }

  removeTransformacion(id: number): void {
    const ins = this.insumo();
    if (!ins) return;
    this.insumo.set({ ...ins, transformaciones: ins.transformaciones.filter(t => t.id !== id) });
    this.notificationService.success('Transformacion eliminada');
  }

  openEdit(field: EditField): void {
    const ins = this.insumo();
    if (!ins || !field) return;

    switch (field) {
      case 'tipoInsumo': this.editVal = ins.tipoInsumo; break;
      case 'deposito': this.editVal = ins.depositoNombre; break;
      case 'unidad': this.editVal = ins.unidadMedida; break;
      case 'codigo': this.editVal = ins.codigo || ''; break;
      case 'precio': this.editVal = ins.precio; break;
      case 'stock': this.editVal = ins.stockActual; this.editVal2 = ins.stockMinimo; break;
    }
    this.editingField.set(field);
  }

  closeEdit(): void {
    this.editingField.set(null);
  }

  saveEdit(): void {
    const ins = this.insumo();
    if (!ins) return;

    const field = this.editingField();
    let updated = { ...ins };

    switch (field) {
      case 'tipoInsumo':
        updated.tipoInsumo = this.editVal;
        break;
      case 'deposito':
        updated.depositoNombre = this.editVal;
        break;
      case 'unidad':
        updated.unidadMedida = this.editVal;
        break;
      case 'codigo':
        updated.codigo = this.editVal?.trim() || null;
        break;
      case 'precio':
        updated.precio = Number(this.editVal) || null;
        break;
      case 'stock':
        updated.stockActual = Number(this.editVal) || 0;
        updated.stockMinimo = Number(this.editVal2) || 0;
        if (updated.stockActual === 0) {
          updated.estadoStock = 'CRITICO';
        } else if (updated.stockActual <= updated.stockMinimo) {
          updated.estadoStock = 'BAJO';
        } else {
          updated.estadoStock = 'NORMAL';
        }
        break;
    }

    this.insumo.set(updated);
    this.closeEdit();
    this.notificationService.success(`${this.editTitle()} actualizado`);
  }
}
