import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastContainerComponent, NotificationService } from '@mro/shared-ui';
import { PreciosDialogComponent } from './precios-dialog.component';
import { CodigosDialogComponent } from './codigos-dialog.component';
import { DetalleDialogComponent } from './detalle-dialog.component';
import { EstacionDialogComponent } from './estacion-dialog.component';
import { CalendarioDialogComponent } from './calendario-dialog.component';
import { ExtrasDialogComponent } from './extras-dialog.component';
import { IngredientesDialogComponent } from './ingredientes-dialog.component';
import { ElaboracionDialogComponent } from './elaboracion-dialog.component';
import { ProductoPerfil, PreciosFormData, CodigosFormData, DetalleFormData, EstacionFormData, CalendarioFormData, ExtrasFormData, IngredientesFormData, ElaboracionFormData, PrecioStrategy, PizzaConfig } from '../../models/producto-perfil.model';
import { getProductoPerfil, ESTACIONES_DISPONIBLES } from '../../data/mock-producto-perfil.data';

type DialogType = 'precios' | 'codigos' | 'detalle' | 'estacion' | 'calendario' | 'extras' | 'ingredientes' | 'elaboracion' | null;

@Component({
  selector: 'app-producto-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastContainerComponent,
    PreciosDialogComponent,
    CodigosDialogComponent,
    DetalleDialogComponent,
    EstacionDialogComponent,
    CalendarioDialogComponent,
    ExtrasDialogComponent,
    IngredientesDialogComponent,
    ElaboracionDialogComponent,
  ],
  template: `
    <div class="perfil-container">
      @if (producto()) {
        <!-- Back button -->
        <button class="back-btn" (click)="goBack()" title="Volver">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>

        <!-- Top Row: 3 columns -->
        <div class="top-row">
          <!-- Col 1: Image -->
          <div class="image-card" (click)="fileInput.click()">
            <input
              #fileInput
              type="file"
              accept="image/*"
              class="file-input-hidden"
              (change)="onImageSelected($event)"
            />
            @if (imagenPreview() || producto()!.imagen) {
              <img [src]="imagenPreview() || producto()!.imagen" [alt]="producto()!.nombre" class="product-image"/>
              <div class="image-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"/>
                </svg>
                <span>Cambiar imagen</span>
              </div>
            } @else {
              <div class="image-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"/>
                </svg>
                <span>Subir imagen</span>
              </div>
            }
          </div>

          <!-- Col 2: Name + Description -->
          <div class="info-card">
            <!-- Name row -->
            <div class="info-name-row">
              <h1 class="product-name">{{ producto()!.nombre }}</h1>
              <span class="status-badge" [class.status-active]="producto()!.activo" [class.status-inactive]="!producto()!.activo">
                <span class="status-dot"></span>
                {{ producto()!.activo ? 'Activo' : 'Inactivo' }}
              </span>
              <button class="icon-btn" (click)="showEnDesarrollo()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
            <!-- Description -->
            <div class="info-desc-section">
              <div class="info-desc-header">
                <label class="section-label">DESCRIPCION</label>
                <button class="icon-btn" (click)="showEnDesarrollo()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>
              <p class="product-description">{{ producto()!.descripcion }}</p>
            </div>
          </div>

          <!-- Col 3: CTA Cards 2x3 -->
          <div class="cta-grid">
            <!-- Salon -->
            <div class="cta-card" (click)="openDialog('precios')">
              <div class="cta-header">
                <div class="cta-icon-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" stroke-width="2" class="cta-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                  <span class="cta-label">Salon</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cta-edit-icon">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <span class="cta-value cta-value-price">{{ isPizza() ? pizzaPriceRange() : formatPrice(producto()!.precioSalon) }}</span>
            </div>

            <!-- Codigo -->
            <div class="cta-card" (click)="openDialog('codigos')">
              <div class="cta-header">
                <div class="cta-icon-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" stroke-width="2" class="cta-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z"/>
                  </svg>
                  <span class="cta-label">Codigo</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cta-edit-icon">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <span class="cta-value">{{ producto()!.codigoProducto }}</span>
            </div>

            <!-- Detalle -->
            <div class="cta-card" (click)="openDialog('detalle')">
              <div class="cta-header">
                <div class="cta-icon-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" class="cta-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                  </svg>
                  <span class="cta-label">Detalle</span>
                </div>
              </div>
              <span class="cta-value cta-value-small">{{ producto()!.categoriaNombre }}</span>
            </div>

            <!-- Estacion -->
            <div class="cta-card" (click)="openDialog('estacion')">
              <div class="cta-header">
                <div class="cta-icon-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger-color)" stroke-width="2" class="cta-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"/>
                  </svg>
                  <span class="cta-label">Estacion</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cta-edit-icon">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <span class="cta-value" [class.cta-value-muted]="!estacionLabel()">{{ estacionLabel() || 'Sin asignar' }}</span>
            </div>

            <!-- Calendario -->
            <div class="cta-card" (click)="openDialog('calendario')">
              <div class="cta-header">
                <div class="cta-icon-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" stroke-width="2" class="cta-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
                  </svg>
                  <span class="cta-label">Calendario</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cta-edit-icon">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <span class="cta-value cta-value-small">{{ calendarioLabel() }}</span>
            </div>

            <!-- Extras / Configuracion (combo) -->
            <div class="cta-card" (click)="openDialog('extras')">
              <div class="cta-header">
                <div class="cta-icon-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" stroke-width="2" class="cta-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                  </svg>
                  <span class="cta-label">{{ isSpecialProduct() ? 'Configuracion' : '+ Extras' }}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cta-edit-icon">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              @if (isSpecialProduct()) {
                <span class="cta-value cta-value-small">{{ specialConfigLabel() }}</span>
              } @else {
                <span class="cta-value" [class.cta-value-muted]="extrasCount() === 0">{{ extrasCount() > 0 ? extrasCount() + ' item' + (extrasCount() > 1 ? 's' : '') : 'Sin extras' }}</span>
              }
            </div>
          </div>
        </div>

        <!-- Bottom Row -->
        @if (isComboOrMenu()) {
        <!-- Combo/Menu: Ingredientes & Elaboracion disabled -->
        <div class="bottom-grid">
          <div class="detail-card detail-card--disabled">
            <div class="detail-card-header">
              <h3 class="detail-card-title">INGREDIENTES</h3>
              <span class="disabled-hint">No aplica para agrupadores</span>
            </div>
            <div class="disabled-content">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
              <p>Los ingredientes se definen en cada producto individual del combo</p>
            </div>
          </div>

          <div class="detail-card detail-card--disabled">
            <div class="detail-card-header">
              <h3 class="detail-card-title">ELABORACION PASO A PASO</h3>
              <span class="disabled-hint">No aplica para agrupadores</span>
            </div>
            <div class="disabled-content">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
              <p>La elaboracion se define en cada producto individual del combo</p>
            </div>
          </div>
        </div>
        } @else if (isPizza()) {
        <!-- Pizza: Ingredientes & Elaboracion disabled -->
        <div class="bottom-grid">
          <div class="detail-card detail-card--disabled">
            <div class="detail-card-header">
              <h3 class="detail-card-title">INGREDIENTES</h3>
              <span class="disabled-hint">No aplica para pizzas</span>
            </div>
            <div class="disabled-content">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
              <p>Los ingredientes se definen en cada sabor individual de la pizza</p>
            </div>
          </div>

          <div class="detail-card detail-card--disabled">
            <div class="detail-card-header">
              <h3 class="detail-card-title">ELABORACION PASO A PASO</h3>
              <span class="disabled-hint">No aplica para pizzas</span>
            </div>
            <div class="disabled-content">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
              <p>La elaboracion se define en cada sabor individual de la pizza</p>
            </div>
          </div>
        </div>
        } @else {
        <!-- Plato normal: Ingredientes & Elaboracion -->
        <div class="bottom-grid">
          <div class="detail-card">
            <div class="detail-card-header">
              <h3 class="detail-card-title">INGREDIENTES</h3>
              <div class="detail-card-actions">
                @if (producto()!.pesoTotal) {
                  <span class="detail-card-extra">{{ formatPrice(producto()!.precioMostrador) }}</span>
                }
                <button class="icon-btn" (click)="openDialog('ingredientes')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>
            </div>
            <ul class="ingredientes-list">
              @for (ing of displayedIngredientes(); track ing.nombre) {
                <li class="ingrediente-item">
                  <span class="ingrediente-dot"></span>
                  <span class="ingrediente-name">{{ ing.nombre }}{{ ing.cantidad ? ' ' + ing.cantidad : '' }}</span>
                </li>
              }
            </ul>
            @if (producto()!.pesoTotal) {
              <div class="peso-total">{{ producto()!.pesoTotal }}</div>
            }
            @if (producto()!.ingredientes.length > 5) {
              <div class="ver-mas-row">
                <button class="ver-mas-btn" (click)="toggleIngredientes()">
                  {{ showAllIngredientes() ? 'Ver menos' : 'Ver mas' }}
                </button>
              </div>
            }
          </div>

          <div class="detail-card">
            <div class="detail-card-header">
              <h3 class="detail-card-title">ELABORACION PASO A PASO</h3>
              <button class="icon-btn" (click)="openDialog('elaboracion')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
            <ol class="elaboracion-list">
              @for (paso of displayedElaboracion(); track paso.paso) {
                <li class="elaboracion-item">
                  <span class="elaboracion-desc">{{ paso.paso }}- {{ paso.descripcion }}</span>
                </li>
              }
            </ol>
            @if (producto()!.elaboracion.length > 4) {
              <div class="ver-mas-row">
                <button class="ver-mas-btn" (click)="toggleElaboracion()">
                  {{ showAllElaboracion() ? 'Ver menos' : 'Ver mas' }}
                </button>
              </div>
            }
          </div>
        </div>
        }

        <!-- Footer -->
        <footer class="perfil-footer">
          <button class="btn btn-primary" [disabled]="isSaving()" (click)="onGuardarCambios()">
            @if (isSaving()) {
              <span class="spinner spinner-sm"></span>
            }
            Guardar cambios
          </button>
        </footer>
      } @else {
        <div class="not-found">
          <h2>Producto no encontrado</h2>
          <p>El producto solicitado no existe o fue eliminado.</p>
          <button class="btn btn-primary" (click)="goBack()">Volver a la carta</button>
        </div>
      }
    </div>

    <!-- Dialogs -->
    @if (activeDialog() === 'precios' && producto()) {
      <app-precios-dialog
        [precioSalon]="producto()!.precioSalon"
        [precioDelivery]="producto()!.precioDelivery"
        [precioMostrador]="producto()!.precioMostrador"
        [isCombo]="isComboOrMenu()"
        [isPizzaMode]="isPizza()"
        [pizzaTamanos]="producto()!.pizzaConfig?.tamanos ?? []"
        [precioStrategy]="producto()!.precioStrategy ?? 'manual'"
        [precioSuma]="comboPrecioSuma()"
        [precioMayor]="comboPrecioMayor()"
        (guardar)="onGuardarPrecios($event)"
        (cancelar)="closeDialog()"
      />
    }

    @if (activeDialog() === 'codigos' && producto()) {
      <app-codigos-dialog
        [codigoProducto]="producto()!.codigoProducto"
        [codigosBusqueda]="producto()!.codigosBusqueda"
        [codigoBarras]="producto()!.codigoBarras"
        [sku]="producto()!.sku"
        (guardar)="onGuardarCodigos($event)"
        (cancelar)="closeDialog()"
      />
    }

    @if (activeDialog() === 'detalle' && producto()) {
      <app-detalle-dialog
        [categoriaId]="producto()!.categoriaId"
        [rindeParaPersonas]="producto()!.rindeParaPersonas"
        [tipo]="producto()!.tipo"
        (guardar)="onGuardarDetalle($event)"
        (cancelar)="closeDialog()"
      />
    }

    @if (activeDialog() === 'estacion' && producto()) {
      <app-estacion-dialog
        [estacionesSeleccionadas]="producto()!.estaciones"
        (guardar)="onGuardarEstacion($event)"
        (cancelar)="closeDialog()"
      />
    }

    @if (activeDialog() === 'calendario' && producto()) {
      <app-calendario-dialog
        [calendario]="producto()!.calendario"
        (guardar)="onGuardarCalendario($event)"
        (cancelar)="closeDialog()"
      />
    }

    @if (activeDialog() === 'extras' && producto()) {
      <app-extras-dialog
        [extras]="producto()!.extras"
        [adicionales]="producto()!.adicionales"
        [isPizza]="isPizza()"
        [isComboOrMenu]="isComboOrMenu()"
        [pizzaConfig]="producto()!.pizzaConfig"
        (guardar)="onGuardarExtras($event)"
        (guardarPizza)="onGuardarPizzaConfig($event)"
        (cancelar)="closeDialog()"
      />
    }

    @if (activeDialog() === 'ingredientes' && producto()) {
      <app-ingredientes-dialog
        [ingredientes]="producto()!.ingredientes"
        (guardar)="onGuardarIngredientes($event)"
        (cancelar)="closeDialog()"
      />
    }

    @if (activeDialog() === 'elaboracion' && producto()) {
      <app-elaboracion-dialog
        [elaboracion]="producto()!.elaboracion"
        (guardar)="onGuardarElaboracion($event)"
        (cancelar)="closeDialog()"
      />
    }

    <app-toast-container />
  `,
  styles: [`
    .perfil-container {
      max-width: 1300px;
      margin: 0 auto;
      padding-bottom: 32px;
    }

    /* ---- Breadcrumb ---- */
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

    /* ---- Top Row: 3 columns ---- */
    .top-row {
      display: grid;
      grid-template-columns: 220px 1fr 340px;
      gap: 20px;
      margin-bottom: 24px;
      align-items: start;
    }

    /* Col 1: Image */
    .image-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      overflow: hidden;
      width: 220px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
    }
    .file-input-hidden {
      display: none;
    }
    .product-image { width: 100%; height: 100%; object-fit: cover; }
    .image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      opacity: 0;
      transition: opacity 0.2s;
      color: white;
      font-size: 13px;
      font-weight: 500;
    }
    .image-card:hover .image-overlay { opacity: 1; }
    .image-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: var(--slate-300);
      font-size: 13px;
    }

    /* Col 2: Info card */
    .info-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 24px;
      min-height: 200px;
      display: flex;
      flex-direction: column;
    }

    .info-name-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--slate-100);
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      font-size: 13px;
      font-weight: 500;
      border-radius: var(--radius-md);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; }
    .status-active { background: var(--success-bg); color: var(--success-text); }
    .status-active .status-dot { background: var(--success-color); }
    .status-inactive { background: var(--slate-100); color: var(--slate-600); }
    .status-inactive .status-dot { background: var(--slate-500); }

    .product-name {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-heading);
      margin: 0;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      background: transparent;
      border: none;
      color: var(--slate-300);
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.15s;
      flex-shrink: 0;
    }
    .icon-btn:hover { color: var(--text-primary); background: var(--slate-100); }

    .info-desc-section { flex: 1; }
    .info-desc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .section-label {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin: 0;
    }
    .product-description {
      font-size: 14px;
      color: var(--slate-500);
      line-height: 1.6;
      margin: 0;
    }

    /* Col 3: CTA Grid */
    .cta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      align-content: start;
    }

    .cta-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 14px 16px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .cta-card:hover {
      border-color: var(--primary-orange);
      box-shadow: 0 2px 8px rgba(249, 115, 22, 0.1);
    }
    .cta-card-placeholder:hover { border-color: var(--slate-200); box-shadow: none; }

    .cta-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .cta-icon-label {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .cta-icon { flex-shrink: 0; }
    .cta-label { font-size: 13px; font-weight: 600; color: var(--slate-500); }
    .cta-edit-icon { color: var(--slate-300); transition: color 0.15s; flex-shrink: 0; }
    .cta-card:hover .cta-edit-icon { color: var(--primary-orange); }

    .cta-value {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: var(--text-heading);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cta-value-price { color: var(--text-heading); }
    .cta-value-small { font-size: 14px; font-weight: 600; }
    .cta-value-muted { color: var(--slate-400); font-weight: 500; font-size: 13px; }

    /* ---- Bottom Grid ---- */
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

    /* Ingredientes */
    .ingredientes-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .ingrediente-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
    }
    .ingrediente-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--primary-orange);
      flex-shrink: 0;
    }
    .ingrediente-name {
      font-size: 14px;
      color: var(--text-primary);
    }
    .peso-total {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--slate-100);
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Elaboracion */
    .elaboracion-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .elaboracion-item {
      padding: 8px 0;
    }
    .elaboracion-desc {
      font-size: 14px;
      color: var(--text-primary);
      line-height: 1.6;
    }

    .ver-mas-row {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
    }
    .ver-mas-btn {
      padding: 0;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-orange);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: color 0.15s;
    }
    .ver-mas-btn:hover { color: var(--primary-orange-hover); }

    /* ---- Disabled cards ---- */
    .detail-card--disabled {
      opacity: 0.45;
      pointer-events: none;
      user-select: none;
    }

    .disabled-hint {
      font-size: 11px;
      font-weight: 500;
      color: var(--slate-400);
      background: var(--slate-100);
      padding: 2px 8px;
      border-radius: 8px;
    }

    .disabled-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      gap: 8px;
      text-align: center;
      color: var(--slate-400);
    }

    .disabled-content p {
      font-size: 13px;
      margin: 0;
      line-height: 1.5;
    }

    /* ---- Combo/Menu styles ---- */
    .combo-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .combo-list--nested { margin-top: 8px; }

    .combo-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
    }

    .combo-item:last-child { border-bottom: none; }

    .combo-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .combo-dot--fijo { background: var(--primary-blue, #1155CC); }
    .combo-dot--opcional { background: var(--primary-orange, #F27920); }

    .combo-name {
      flex: 1;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-heading);
    }

    .combo-price {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      white-space: nowrap;
    }


    .combo-steps {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .combo-step-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--divider-color);
    }

    .combo-step-num {
      font-size: 11px;
      font-weight: 700;
      color: white;
      background: var(--primary-orange);
      padding: 2px 8px;
      border-radius: 10px;
    }

    .combo-step-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-heading);
      flex: 1;
    }

    .combo-step-rule {
      font-size: 11px;
      color: var(--text-secondary);
      background: var(--slate-100);
      padding: 2px 8px;
      border-radius: 10px;
    }

    /* ---- Pizza styles ---- */
    .pizza-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .pizza-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color);
    }

    .pizza-item:last-child { border-bottom: none; }

    .pizza-icon { font-size: 18px; flex-shrink: 0; }

    .pizza-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-heading);
    }

    .pizza-detail {
      font-size: 12px;
      color: var(--slate-400);
      flex: 1;
    }

    .pizza-price {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-heading);
    }

    .mitad-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: default;
    }

    .mitad-check {
      width: 16px;
      height: 16px;
      accent-color: var(--success-color);
    }

    .mitad-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--success-color);
    }

    .sabores-table-wrapper {
      overflow-x: auto;
    }

    .sabores-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .sabores-table thead { border-bottom: 1px solid var(--divider-color); }

    .sabor-th-name {
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-500);
      padding: 8px 0;
    }

    .sabor-th-price {
      text-align: right;
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-500);
      padding: 8px 12px;
    }

    .sabor-td-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: var(--text-heading);
      padding: 8px 0;
    }

    .sabor-td-price {
      text-align: right;
      font-weight: 500;
      color: var(--text-secondary);
      padding: 8px 12px;
    }

    .sabor-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--slate-300);
      flex-shrink: 0;
    }

    .sabor-dot--active { background: var(--success-color); }

    .sabor-disabled { opacity: 0.4; }

    .sabores-table tbody tr {
      border-bottom: 1px solid var(--divider-color);
    }

    .sabores-table tbody tr:last-child { border-bottom: none; }

    .mitad-info {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 12px;
      padding: 8px 12px;
      background: var(--slate-50);
      border-radius: 8px;
      font-size: 12px;
      color: var(--slate-500);
    }

    .empty-detail {
      font-size: 13px;
      color: var(--text-secondary);
      margin: 8px 0 0;
    }

    /* ---- Footer ---- */
    .perfil-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 28px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background-color: var(--text-heading); color: white; }
    .btn-primary:hover:not(:disabled) { background-color: var(--text-primary); }
    .btn-secondary { background-color: white; color: var(--text-primary); border: 1px solid var(--slate-200); }
    .btn-secondary:hover:not(:disabled) { background-color: var(--slate-50); }

    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    .spinner-sm { width: 14px; height: 14px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Not Found */
    .not-found {
      text-align: center;
      padding: 80px 24px;
    }
    .not-found h2 { font-size: 22px; color: var(--text-heading); margin: 0 0 8px 0; }
    .not-found p { font-size: 14px; color: var(--slate-500); margin: 0 0 24px 0; }

    /* ---- Responsive ---- */
    @media (max-width: 1100px) {
      .top-row {
        grid-template-columns: 200px 1fr 280px;
      }
    }

    @media (max-width: 900px) {
      .top-row {
        grid-template-columns: 1fr 1fr;
      }
      .image-card {
        width: 100%;
        grid-column: 1 / -1;
        height: 200px;
      }
      .cta-grid { grid-template-columns: 1fr 1fr; }
      .bottom-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 600px) {
      .top-row { grid-template-columns: 1fr; }
      .cta-grid { grid-template-columns: 1fr 1fr; }
      .back-btn { font-size: 13px; }
      .product-name { font-size: 18px; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoPerfilComponent implements OnInit {
  @Input() id!: string;

  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  producto = signal<ProductoPerfil | null>(null);
  activeDialog = signal<DialogType>(null);
  isSaving = signal(false);
  imagenPreview = signal<string | null>(null);
  showAllIngredientes = signal(false);
  showAllElaboracion = signal(false);

  tipoLabel = computed(() => {
    const tipos: Record<string, string> = {
      entrada: 'Entrada',
      plato: 'Plato principal',
      postre: 'Postre',
      bebida: 'Bebida',
      guarnicion: 'Guarnicion',
    };
    return tipos[this.producto()?.tipo || ''] || this.producto()?.tipo || '';
  });

  displayedIngredientes = computed(() => {
    const all = this.producto()?.ingredientes || [];
    return this.showAllIngredientes() ? all : all.slice(0, 5);
  });

  displayedElaboracion = computed(() => {
    const all = this.producto()?.elaboracion || [];
    return this.showAllElaboracion() ? all : all.slice(0, 4);
  });

  estacionLabel = computed(() => {
    const p = this.producto();
    if (!p || !p.estaciones || p.estaciones.length === 0) return '';
    const nombres = p.estaciones
      .map(id => ESTACIONES_DISPONIBLES.find(e => e.id === id)?.nombre)
      .filter(Boolean);
    return nombres.join(', ');
  });

  calendarioLabel = computed(() => {
    const p = this.producto();
    if (!p || !p.calendario) return 'Siempre';
    let active = 0;
    let total = 0;
    for (const canal of p.calendario) {
      for (const dia of canal.dias) {
        for (const turno of dia.turnos) {
          total++;
          if (turno.activo) active++;
        }
      }
    }
    if (active === total) return 'Siempre';
    if (active === 0) return 'Inactivo';
    return active + '/' + total + ' turnos';
  });

  extrasCount = computed(() => {
    const p = this.producto();
    if (!p) return 0;
    return (p.extras?.length || 0) + (p.adicionales?.length || 0);
  });

  isComboOrMenu = computed(() => {
    const tipo = this.producto()?.tipo;
    return tipo === 'combo' || tipo === 'menu';
  });

  isPizza = computed(() => this.producto()?.tipo === 'pizza');

  pizzaPriceRange = computed(() => {
    const tamanos = this.producto()?.pizzaConfig?.tamanos ?? [];
    if (tamanos.length === 0) return 'Sin precios';
    const precios = tamanos.map(t => t.precio);
    const min = Math.min(...precios);
    const max = Math.max(...precios);
    if (min === max) return this.formatPrice(min);
    return `${this.formatPrice(min)} - ${this.formatPrice(max)}`;
  });

  isSpecialProduct = computed(() => this.isComboOrMenu() || this.isPizza());

  comboPrecioSuma = computed(() => {
    const p = this.producto();
    if (!p) return 0;
    const fijos = (p.productosFijos ?? []).reduce((s, f) => s + f.precio, 0);
    const pasos = (p.pasos ?? []).reduce((s, paso) => {
      const max = paso.opciones.length ? Math.max(...paso.opciones.map(o => o.precio)) : 0;
      return s + max;
    }, 0);
    return fijos + pasos;
  });

  comboPrecioMayor = computed(() => {
    const p = this.producto();
    if (!p) return 0;
    const allPrices = [
      ...(p.productosFijos ?? []).map(f => f.precio),
      ...(p.pasos ?? []).flatMap(paso => paso.opciones.map(o => o.precio)),
    ];
    return allPrices.length ? Math.max(...allPrices) : 0;
  });

  specialConfigLabel = computed(() => {
    const p = this.producto();
    if (!p) return '';
    if (p.tipo === 'pizza' && p.pizzaConfig) {
      const t = p.pizzaConfig.tamanos.length;
      return `${t} tamano${t !== 1 ? 's' : ''}`;
    }
    return this.comboConfigLabel();
  });

  comboConfigLabel = computed(() => {
    const p = this.producto();
    if (!p) return '';
    const fijos = p.productosFijos?.length ?? 0;
    const pasos = p.pasos?.length ?? 0;
    return `${fijos} fijo${fijos !== 1 ? 's' : ''} · ${pasos} paso${pasos !== 1 ? 's' : ''}`;
  });


  ngOnInit(): void {
    this.loadProducto();
  }

  private loadProducto(): void {
    const numericId = Number(this.id);
    if (isNaN(numericId)) {
      this.producto.set(null);
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      const data = getProductoPerfil(numericId);
      if (data) {
        this.producto.set({ ...data });
      } else {
        this.producto.set(null);
      }
    }, 200);
  }

  goBack(): void {
    this.router.navigate(['/carta']);
  }

  formatPrice(price: number | null): string {
    if (price == null) return '-';
    return '$' + price.toLocaleString('es-AR');
  }

  openDialog(type: DialogType): void {
    this.activeDialog.set(type);
  }

  closeDialog(): void {
    this.activeDialog.set(null);
  }

  showEnDesarrollo(): void {
    this.notificationService.info('Funcion en desarrollo');
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.notificationService.error('El archivo debe ser una imagen');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreview.set(reader.result as string);
      this.notificationService.success('Imagen actualizada');
    };
    reader.readAsDataURL(file);
  }

  toggleIngredientes(): void {
    this.showAllIngredientes.update(v => !v);
  }

  toggleElaboracion(): void {
    this.showAllElaboracion.update(v => !v);
  }

  // Dialog save handlers
  onGuardarPrecios(data: PreciosFormData & { precioStrategy?: PrecioStrategy }): void {
    this.producto.update(p => p ? { ...p, ...data } : p);
    this.closeDialog();
    this.notificationService.success('Precios actualizados');
  }

  onGuardarCodigos(data: CodigosFormData): void {
    this.producto.update(p => p ? { ...p, ...data } : p);
    this.closeDialog();
    this.notificationService.success('Codigos actualizados');
  }

  onGuardarDetalle(data: DetalleFormData): void {
    // Find category name from the categoriaId
    const categorias: Record<number, string> = {
      1: 'Entradas calientes', 2: 'Principal', 3: 'Parrilla', 4: 'Tacos',
      5: 'Hamburguesas', 6: 'Pastas', 7: 'Bebidas', 8: 'Postres',
    };
    this.producto.update(p => p ? {
      ...p,
      ...data,
      categoriaNombre: categorias[data.categoriaId] || p.categoriaNombre,
    } : p);
    this.closeDialog();
    this.notificationService.success('Detalle actualizado');
  }

  onGuardarEstacion(data: EstacionFormData): void {
    const nombres = data.estaciones
      .map(id => ESTACIONES_DISPONIBLES.find(e => e.id === id)?.nombre)
      .filter(Boolean);
    this.producto.update(p => p ? {
      ...p,
      estaciones: data.estaciones,
      estacion: nombres.join(', ') || null,
    } : p);
    this.closeDialog();
    this.notificationService.success('Estaciones actualizadas');
  }

  onGuardarCalendario(data: CalendarioFormData): void {
    this.producto.update(p => p ? { ...p, calendario: data.calendario } : p);
    this.closeDialog();
    this.notificationService.success('Calendario actualizado');
  }

  onGuardarExtras(data: ExtrasFormData): void {
    this.producto.update(p => p ? { ...p, extras: data.extras, adicionales: data.adicionales } : p);
    this.closeDialog();
    this.notificationService.success('Extras actualizados');
  }

  onGuardarPizzaConfig(config: PizzaConfig): void {
    this.producto.update(p => p ? { ...p, pizzaConfig: config } : p);
    this.closeDialog();
    this.notificationService.success('Configuracion de pizza actualizada');
  }

  onGuardarIngredientes(data: IngredientesFormData): void {
    this.producto.update(p => p ? { ...p, ingredientes: data.ingredientes } : p);
    this.closeDialog();
    this.notificationService.success('Ingredientes actualizados');
  }

  onGuardarElaboracion(data: ElaboracionFormData): void {
    this.producto.update(p => p ? { ...p, elaboracion: data.elaboracion } : p);
    this.closeDialog();
    this.notificationService.success('Elaboracion actualizada');
  }

  onGuardarCambios(): void {
    this.isSaving.set(true);
    setTimeout(() => {
      this.isSaving.set(false);
      this.notificationService.success('Cambios guardados correctamente');
    }, 1000);
  }
}
