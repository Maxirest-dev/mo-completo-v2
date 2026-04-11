import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnDestroy,
  AfterViewChecked,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ToastContainerComponent, NotificationService } from '@mro/shared-ui';
import { NuevaListaDialogComponent, NuevaListaFormData } from './nueva-lista-dialog.component';
import { MOCK_CATEGORIAS } from '../../data/mock-categorias.data';
import { CategoriaGridRow, ProductoGridRow } from '../../models/categoria-grid.model';

interface CategoriaPrecios extends CategoriaGridRow {
  masEditInput: string;
}

@Component({
  selector: 'app-actualizar-precios',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastContainerComponent, NuevaListaDialogComponent],
  template: `
    <div class="precios-container">
      <!-- Header -->
      <header class="page-header">
        <button class="back-btn" (click)="onBack()" title="Volver">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div class="header-info">
          <div class="header-title-row">
            <h1 class="page-title">Actualizar Precios</h1>
            <svg class="title-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
          </div>
          <p class="page-subtitle">Gestiona los precios de tus productos en todas las listas</p>
        </div>
      </header>

      <!-- Toolbar -->
      <div class="filter-toolbar">
        <div class="filter-tabs">
          <button
            type="button"
            class="filter-tab"
            [class.filter-tab-active]="vistaMode() === 'categorias'"
            (click)="vistaMode.set('categorias')"
          >
            Por categorias
          </button>
          <button
            type="button"
            class="filter-tab"
            [class.filter-tab-active]="vistaMode() === 'todo'"
            (click)="vistaMode.set('todo')"
          >
            Todo el menu ({{ allProductosCount() }})
          </button>
        </div>

        <div class="toolbar-right">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar..."
              class="search-input"
              [ngModel]="busquedaInterna()"
              (ngModelChange)="onBusquedaInput($event)"
            />
            @if (busquedaInterna()) {
              <button type="button" class="search-clear" (click)="clearSearch()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
              </button>
            }
          </div>

          <button type="button" class="btn-mass-global" (click)="openMassGlobalDialog()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            Edicion masiva
          </button>
          <button type="button" class="btn-nueva" (click)="onNuevaLista()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            Nueva Lista de precios
          </button>
        </div>
      </div>

      <!-- Table Card -->
      <div class="card">
        <div class="grid-container">
          @if (vistaMode() === 'todo') {
            <!-- Vista plana: todos los productos -->
            <table class="detail-table detail-table--full">
              <thead>
                <tr>
                  <th class="det-producto">PRODUCTO</th>
                  <th class="det-categoria">CATEGORIA</th>
                  <th class="det-default">DEFAULT</th>
                  <th class="det-takeaway">TAKE AWAY</th>
                  <th class="det-delivery">DELIVERY</th>
                </tr>
              </thead>
              <tbody>
                @for (prod of allProductosFlat(); track prod.id) {
                  <tr class="producto-row">
                    <td class="det-producto">{{ prod.nombre }}</td>
                    <td class="det-categoria">{{ prod.categoriaNombre }}</td>
                    <td class="det-default" (click)="$event.stopPropagation()">
                      @if (isEditingCell(prod.id, 'default')) {
                        <input type="text" class="precio-input" [value]="formatPrice(prod.precio)" (blur)="onCellBlur(prod, 'default', $event)" (keydown.enter)="onPrecioEnter($event)" (keydown.escape)="clearEditing()" #autoFocus />
                      } @else {
                        <span class="precio-clickable" (click)="startEditing(prod.id, 'default')">{{ formatPrice(prod.precio) }}</span>
                      }
                    </td>
                    <td class="det-takeaway" (click)="$event.stopPropagation()">
                      @if (isEditingCell(prod.id, 'takeaway')) {
                        <input type="text" class="precio-input" [value]="formatPrice(prod.precioTakeAway ?? prod.precio)" (blur)="onCellBlur(prod, 'takeaway', $event)" (keydown.enter)="onPrecioEnter($event)" (keydown.escape)="clearEditing()" #autoFocus />
                      } @else {
                        <span class="precio-cell">
                          <span class="precio-clickable" (click)="startEditing(prod.id, 'takeaway')">{{ formatPrice(prod.precioTakeAway ?? prod.precio) }}</span>
                          @if (getDiffPercent(prod.precio, prod.precioTakeAway) !== 0) {
                            <span class="badge-diff" [class.badge-positive]="getDiffPercent(prod.precio, prod.precioTakeAway) > 0" [class.badge-negative]="getDiffPercent(prod.precio, prod.precioTakeAway) < 0">
                              {{ getDiffPercent(prod.precio, prod.precioTakeAway) > 0 ? '+' : '' }}{{ getDiffPercent(prod.precio, prod.precioTakeAway).toFixed(1) }}%
                            </span>
                          }
                        </span>
                      }
                    </td>
                    <td class="det-delivery" (click)="$event.stopPropagation()">
                      @if (isEditingCell(prod.id, 'delivery')) {
                        <input type="text" class="precio-input" [value]="formatPrice(prod.precioDelivery ?? prod.precio)" (blur)="onCellBlur(prod, 'delivery', $event)" (keydown.enter)="onPrecioEnter($event)" (keydown.escape)="clearEditing()" #autoFocus />
                      } @else {
                        <span class="precio-cell">
                          <span class="precio-clickable" (click)="startEditing(prod.id, 'delivery')">{{ formatPrice(prod.precioDelivery ?? prod.precio) }}</span>
                          @if (getDiffPercent(prod.precio, prod.precioDelivery) !== 0) {
                            <span class="badge-diff" [class.badge-positive]="getDiffPercent(prod.precio, prod.precioDelivery) > 0" [class.badge-negative]="getDiffPercent(prod.precio, prod.precioDelivery) < 0">
                              {{ getDiffPercent(prod.precio, prod.precioDelivery) > 0 ? '+' : '' }}{{ getDiffPercent(prod.precio, prod.precioDelivery).toFixed(1) }}%
                            </span>
                          }
                        </span>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="empty-state-row">
                      <div class="empty-state">
                        <span class="empty-state-title">Sin productos</span>
                        <span class="empty-state-description">No se encontraron productos</span>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          } @else {
          <table class="master-table">
            <thead>
              <tr>
                <th class="col-chevron"></th>
                <th class="col-nombre">NOMBRE</th>
                <th class="col-productos">PRODUCTOS</th>
                <th class="col-categoria">CATEGORIA</th>
              </tr>
            </thead>
            <tbody>
              @for (cat of filteredCategorias(); track cat.id) {
                <tr class="master-row" [class.expanded]="isExpanded(cat.id)" (click)="toggleExpand(cat.id)">
                  <td class="col-chevron">
                    <span class="chevron" [class.chevron-open]="isExpanded(cat.id)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/>
                      </svg>
                    </span>
                  </td>
                  <td class="col-nombre">{{ cat.nombre }}</td>
                  <td class="col-productos">
                    <div class="productos-count">
                      <span class="count-number">{{ cat.productos.length }}</span>
                      <span class="count-label">unidades</span>
                    </div>
                  </td>
                  <td class="col-categoria">{{ cat.categoriaPadre || '-' }}</td>
                </tr>

                @if (isExpanded(cat.id)) {
                  <tr class="detail-row">
                    <td colspan="4">
                      <div class="detail-wrapper">
                        <table class="detail-table">
                          <thead>
                            <tr>
                              <th class="det-producto">PRODUCTO</th>
                              <th class="det-categoria">CATEGORIA</th>
                              <th class="det-default">DEFAULT</th>
                              <th class="det-takeaway">TAKE AWAY</th>
                              <th class="det-delivery">DELIVERY</th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (prod of cat.productos; track prod.id) {
                              <tr class="producto-row">
                                <td class="det-producto">{{ prod.nombre }}</td>
                                <td class="det-categoria">{{ cat.categoriaPadre || cat.nombre }}</td>
                                <td class="det-default" (click)="$event.stopPropagation()">
                                  @if (isEditingCell(prod.id, 'default')) {
                                    <input
                                      type="text"
                                      class="precio-input"
                                      [value]="formatPrice(prod.precio)"
                                      (blur)="onCellBlur(prod, 'default', $event)"
                                      (keydown.enter)="onPrecioEnter($event)"
                                      (keydown.escape)="clearEditing()"
                                      #autoFocus
                                    />
                                  } @else {
                                    <span class="precio-clickable" (click)="startEditing(prod.id, 'default')">{{ formatPrice(prod.precio) }}</span>
                                  }
                                </td>
                                <td class="det-takeaway" (click)="$event.stopPropagation()">
                                  @if (isEditingCell(prod.id, 'takeaway')) {
                                    <input
                                      type="text"
                                      class="precio-input"
                                      [value]="formatPrice(prod.precioTakeAway ?? prod.precio)"
                                      (blur)="onCellBlur(prod, 'takeaway', $event)"
                                      (keydown.enter)="onPrecioEnter($event)"
                                      (keydown.escape)="clearEditing()"
                                      #autoFocus
                                    />
                                  } @else {
                                    <span class="precio-cell">
                                      <span class="precio-clickable" (click)="startEditing(prod.id, 'takeaway')">{{ formatPrice(prod.precioTakeAway ?? prod.precio) }}</span>
                                      @if (getDiffPercent(prod.precio, prod.precioTakeAway) !== 0) {
                                        <span class="badge-diff" [class.badge-positive]="getDiffPercent(prod.precio, prod.precioTakeAway) > 0" [class.badge-negative]="getDiffPercent(prod.precio, prod.precioTakeAway) < 0">
                                          {{ getDiffPercent(prod.precio, prod.precioTakeAway) > 0 ? '+' : '' }}{{ getDiffPercent(prod.precio, prod.precioTakeAway).toFixed(1) }}%
                                        </span>
                                      }
                                    </span>
                                  }
                                </td>
                                <td class="det-delivery" (click)="$event.stopPropagation()">
                                  @if (isEditingCell(prod.id, 'delivery')) {
                                    <input
                                      type="text"
                                      class="precio-input"
                                      [value]="formatPrice(prod.precioDelivery ?? prod.precio)"
                                      (blur)="onCellBlur(prod, 'delivery', $event)"
                                      (keydown.enter)="onPrecioEnter($event)"
                                      (keydown.escape)="clearEditing()"
                                      #autoFocus
                                    />
                                  } @else {
                                    <span class="precio-cell">
                                      <span class="precio-clickable" (click)="startEditing(prod.id, 'delivery')">{{ formatPrice(prod.precioDelivery ?? prod.precio) }}</span>
                                      @if (getDiffPercent(prod.precio, prod.precioDelivery) !== 0) {
                                        <span class="badge-diff" [class.badge-positive]="getDiffPercent(prod.precio, prod.precioDelivery) > 0" [class.badge-negative]="getDiffPercent(prod.precio, prod.precioDelivery) < 0">
                                          {{ getDiffPercent(prod.precio, prod.precioDelivery) > 0 ? '+' : '' }}{{ getDiffPercent(prod.precio, prod.precioDelivery).toFixed(1) }}%
                                        </span>
                                      }
                                    </span>
                                  }
                                </td>
                              </tr>
                            } @empty {
                              <tr>
                                <td colspan="6" class="empty-productos">Sin productos en esta categoria</td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                }
              } @empty {
                <tr>
                  <td colspan="5" class="empty-state-row">
                    <div class="empty-state">
                      <span class="empty-state-title">Sin categorias</span>
                      <span class="empty-state-description">No se encontraron categorias con los filtros seleccionados</span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          }
        </div>
      </div>

    </div>

    @if (showNuevaListaDialog()) {
      <app-nueva-lista-dialog
        (guardar)="onNuevaListaGuardar($event)"
        (cancelar)="showNuevaListaDialog.set(false)"
      />
    }

    <!-- Mass Global Dialog -->
    @if (showMassGlobalDialog()) {
      <div class="dialog-backdrop" (click)="showMassGlobalDialog.set(false)">
        <div class="mass-global-dialog" (click)="$event.stopPropagation()">
          <header class="mg-header">
            <h2 class="mg-title">Edicion masiva general</h2>
            <p class="mg-subtitle">Aplica un ajuste de precio a todos los productos de toda la carta.</p>
          </header>

          <div class="mg-body">
            <!-- Categorias selector -->
            <div class="mg-section">
              <label class="mg-label">Categorias</label>
              <div class="mg-cat-header">
                <label class="mg-checkbox-label">
                  <input type="checkbox" [checked]="allCatsSelected()" (change)="toggleAllCats()"/>
                  <span>Todas las categorias</span>
                </label>
              </div>
              <div class="mg-cat-list">
                @for (cat of categorias(); track cat.id) {
                  <label class="mg-checkbox-label mg-cat-item">
                    <input type="checkbox" [checked]="isCatSelected(cat.id)" (change)="toggleCat(cat.id)"/>
                    <span>{{ cat.icono }} {{ cat.nombre }}</span>
                    <span class="mg-cat-count">{{ cat.productos.length }} items</span>
                  </label>
                }
              </div>
            </div>

            <!-- Tipo de ajuste -->
            <div class="mg-toggle-row">
              <button class="mg-toggle" [class.mg-toggle-active]="massGlobalTipo() === 'porcentaje'" (click)="massGlobalTipo.set('porcentaje')">
                <span>%</span> Porcentaje
              </button>
              <button class="mg-toggle" [class.mg-toggle-active]="massGlobalTipo() === 'importe'" (click)="massGlobalTipo.set('importe')">
                <span>$</span> Importe fijo
              </button>
            </div>

            <!-- Valor -->
            <div class="mg-input-group">
              <label class="mg-label">{{ massGlobalTipo() === 'porcentaje' ? 'Porcentaje de ajuste' : 'Importe de ajuste' }}</label>
              <div class="mg-input-wrapper">
                <span class="mg-input-prefix">{{ massGlobalTipo() === 'porcentaje' ? '%' : '$' }}</span>
                <input
                  type="number"
                  class="mg-input"
                  [placeholder]="massGlobalTipo() === 'porcentaje' ? 'Ej: 10, -5' : 'Ej: 1000, -500'"
                  [(ngModel)]="massGlobalValor"
                />
              </div>
              <span class="mg-hint">Usa valores negativos para reducir precios</span>
            </div>

            <!-- Resumen -->
            <div class="mg-summary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
              </svg>
              <span>Esto afectara a <strong>{{ selectedProductosCount() }} productos</strong> en <strong>{{ selectedCatsCount() }} categorias</strong></span>
            </div>
          </div>

          <div class="mg-actions">
            <button type="button" class="btn btn-secondary" (click)="showMassGlobalDialog.set(false)">Cancelar</button>
            <button type="button" class="btn btn-primary" (click)="onMassGlobalApply()" [disabled]="!massGlobalValor || selectedCatsCount() === 0">Aplicar</button>
          </div>
        </div>
      </div>
    }

    <app-toast-container />
  `,
  styles: [`
    .precios-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* ---- Header ---- */
    .page-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 32px;
    }

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
      margin-top: 2px;
    }
    .back-btn:hover { background: var(--slate-50); border-color: var(--slate-300); }

    .header-info { flex: 1; }

    .header-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .page-title {
      font-size: 26px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
      letter-spacing: -0.01em;
    }

    .title-icon { flex-shrink: 0; }

    .page-subtitle {
      font-size: 14px;
      color: var(--gray-500);
      margin: 6px 0 0 0;
    }

    /* ---- Toolbar ---- */
    .filter-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .filter-tabs {
      display: flex;
      gap: 8px;
      flex-wrap: nowrap;
    }

    .filter-tab {
      padding: 9px 18px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: var(--slate-500);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .filter-tab:hover {
      border-color: var(--slate-300);
      background: var(--slate-50);
    }
    .filter-tab-active {
      color: var(--primary-orange);
      border-color: var(--primary-orange);
      background: #FFF7ED;
    }
    .filter-tab-active:hover {
      background: #FFF7ED;
      border-color: var(--primary-orange);
    }

    /* Dropdown "Mas" */
    .filter-tab-dropdown {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .dropdown-chevron {
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }
    .dropdown-chevron-open {
      transform: rotate(180deg);
    }

    .dropdown-wrapper {
      position: relative;
    }

    .dropdown-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      min-width: 200px;
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      z-index: 10;
      padding: 4px;
      animation: dropdownIn 0.12s ease-out;
    }

    @keyframes dropdownIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 9px 14px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: var(--text-primary);
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.1s;
      text-align: left;
    }
    .dropdown-item:hover {
      background: var(--slate-50);
    }
    .dropdown-item-active {
      color: var(--primary-orange);
      background: #FFF7ED;
    }
    .dropdown-item-active:hover {
      background: #FFF7ED;
    }
    .dropdown-item-count {
      color: var(--slate-400);
      font-weight: 400;
      font-size: 13px;
    }
    .dropdown-item-active .dropdown-item-count {
      color: #FDBA74;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    /* Search */
    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      padding: 0 12px;
      min-width: 220px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .search-box:focus-within {
      border-color: var(--primary-orange);
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }
    .search-icon {
      width: 18px;
      height: 18px;
      color: var(--slate-400);
      flex-shrink: 0;
    }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 10px 10px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-primary);
      background: transparent;
      min-width: 140px;
    }
    .search-input::placeholder { color: var(--slate-400); }
    .search-clear {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
      background: var(--slate-100);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      color: var(--slate-500);
      transition: all 0.15s ease;
    }
    .search-clear:hover { background: var(--slate-200); color: var(--text-primary); }
    .search-clear svg { width: 12px; height: 12px; }

    /* Nueva lista button */
    .btn-nueva {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: white;
      background: var(--primary-orange);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      box-shadow: 0 1px 2px rgba(249, 115, 22, 0.2);
    }
    .btn-nueva:hover { background: var(--primary-orange-hover); }
    .btn-nueva:active { background: #C2410C; }
    .btn-nueva svg { width: 18px; height: 18px; }

    /* Mass global button */
    .btn-mass-global {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: white;
      background: var(--text-heading);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .btn-mass-global:hover { background: var(--text-primary); }
    .btn-mass-global svg { width: 18px; height: 18px; }

    /* Mass global dialog */
    .dialog-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px; animation: fadeIn 0.15s ease-out;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .mass-global-dialog {
      background: white; border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      width: 100%; max-width: 480px;
      animation: slideUp 0.2s ease-out;
    }
    @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    .mg-header { padding: 28px 28px 0; }
    .mg-title { font-size: 22px; font-weight: 600; color: var(--text-heading); margin: 0 0 6px; }
    .mg-subtitle { font-size: 14px; color: var(--slate-500); margin: 0; }
    .mg-body { padding: 24px 28px; }
    .mg-toggle-row { display: flex; gap: 8px; margin-bottom: 20px; }
    .mg-toggle {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 10px; font-size: 14px; font-weight: 500; font-family: inherit;
      color: var(--slate-500); background: white; border: 1px solid var(--slate-200);
      border-radius: 8px; cursor: pointer; transition: all 0.15s;
    }
    .mg-toggle span { font-weight: 700; }
    .mg-toggle:hover { border-color: var(--slate-300); }
    .mg-toggle-active { color: var(--primary-orange); border-color: var(--primary-orange); background: #FFF7ED; }
    .mg-label { display: block; font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
    .mg-input-wrapper { position: relative; display: flex; align-items: center; }
    .mg-input-prefix {
      position: absolute; left: 14px; color: var(--slate-500);
      font-size: 14px; font-weight: 500; pointer-events: none;
    }
    .mg-input {
      width: 100%; padding: 12px 14px 12px 30px; font-size: 14px; font-family: inherit;
      color: var(--text-primary); background: white; border: 1px solid var(--slate-200);
      border-radius: 10px; transition: all 0.15s;
    }
    .mg-input:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
    .mg-hint { display: block; margin-top: 6px; font-size: 12px; color: var(--slate-400); }
    .mg-section { margin-bottom: 20px; }
    .mg-cat-header {
      padding: 8px 0;
      border-bottom: 1px solid var(--slate-200);
      margin-bottom: 4px;
    }
    .mg-checkbox-label {
      display: flex; align-items: center; gap: 8px;
      font-size: 14px; color: var(--text-primary); cursor: pointer;
    }
    .mg-checkbox-label input[type="checkbox"] {
      width: 16px; height: 16px; accent-color: var(--primary-orange); cursor: pointer;
    }
    .mg-cat-list {
      max-height: 180px; overflow-y: auto;
      border: 1px solid var(--slate-200); border-radius: 8px;
      margin-top: 8px;
    }
    .mg-cat-item {
      padding: 8px 12px;
      border-bottom: 1px solid var(--slate-100);
      transition: background 0.1s;
    }
    .mg-cat-item:last-child { border-bottom: none; }
    .mg-cat-item:hover { background: var(--slate-50); }
    .mg-cat-count {
      margin-left: auto;
      font-size: 12px; color: var(--slate-400);
    }
    .mg-summary {
      display: flex; align-items: center; gap: 8px; margin-top: 20px;
      padding: 12px 14px; background: #FFFBF5; border: 1px solid #FED7AA;
      border-radius: 8px; font-size: 13px; color: #92400E;
    }
    .mg-actions {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 0 28px 28px;
    }
    .mg-actions .btn {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 12px 24px; font-size: 14px; font-weight: 500; font-family: inherit;
      border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s;
    }
    .mg-actions .btn-secondary { background: white; color: var(--text-primary); border: 1px solid var(--slate-200); }
    .mg-actions .btn-secondary:hover { background: var(--slate-50); }
    .mg-actions .btn-primary { background: var(--text-heading); color: white; }
    .mg-actions .btn-primary:hover:not(:disabled) { background: var(--text-primary); }
    .mg-actions .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ---- Card ---- */
    .card {
      overflow: hidden;
      background: white;
      border-radius: 12px;
      border: 1px solid var(--gray-200);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .grid-container {
      position: relative;
      width: 100%;
    }

    /* ---- Master table ---- */
    .master-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .master-table thead th {
      padding: 14px 16px;
      font-size: 12px;
      font-weight: 600;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      border-bottom: 1px solid var(--slate-200);
      background: white;
    }

    .col-chevron { width: 48px; }
    .col-codigo { width: 80px; }
    .col-nombre { width: 28%; }
    .col-productos { width: auto; }
    .productos-count { display: flex; flex-direction: column; }
    .count-number { font-weight: 600; font-size: 14px; color: var(--primary-orange); }
    .count-label { font-size: 12px; color: var(--slate-400); }
    .col-edicion { width: 240px; }

    /* ---- Master row ---- */
    .master-row {
      cursor: pointer;
      transition: background 0.15s;
    }
    .master-row:hover { background: #FAFAFA; }
    .master-row.expanded { background: #FAFAFA; }

    .master-row td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--slate-100);
      vertical-align: middle;
      font-size: 14px;
      color: var(--gray-700);
    }

    /* Chevron */
    .chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--slate-400);
      transition: transform 0.2s ease;
    }
    .chevron-open { transform: rotate(90deg); }

    /* Nombre cell */
    .nombre-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nombre-principal {
      font-weight: 600;
      color: var(--gray-900);
    }
    .nombre-padre {
      font-size: 12px;
      color: var(--slate-400);
    }

    /* Mass edit - compact group */
    .mass-edit-group {
      display: flex;
      align-items: center;
      gap: 4px;
      justify-content: flex-end;
    }

    .mass-edit-input {
      width: 140px;
      flex-shrink: 0;
      padding: 8px 12px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-primary);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 6px;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .mass-edit-input:focus {
      border-color: var(--primary-orange);
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }
    .mass-edit-input::placeholder { color: var(--slate-400); }

    .btn-mass {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      font-size: 15px;
      font-weight: 600;
      font-family: inherit;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      color: white;
    }

    .btn-mass-percent {
      background: #60A5FA;
    }
    .btn-mass-percent:hover { background: #3B82F6; }

    .btn-mass-fixed {
      background: var(--primary-orange);
    }
    .btn-mass-fixed:hover { background: var(--primary-orange-hover); }

    /* ---- Detail row ---- */
    .detail-row td {
      padding: 0;
      border-bottom: 1px solid var(--slate-100);
    }

    .detail-wrapper {
      padding: 0 16px 16px 16px;
      background: #FAFAFA;
    }

    .detail-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      overflow: hidden;
    }

    .detail-table--full {
      border: none;
      border-radius: 0;
    }

    .detail-table thead th {
      padding: 10px 16px;
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      background: var(--slate-100);
      border-bottom: 1px solid var(--slate-200);
    }

    .det-codigo { width: 10%; }
    .det-producto { width: 22%; }
    .det-categoria { width: 18%; }
    .det-default { width: 18%; }
    .det-takeaway { width: 16%; }
    .det-delivery { width: 16%; }

    .producto-row td {
      padding: 12px 16px;
      font-size: 14px;
      color: var(--gray-700);
      border-bottom: 1px solid var(--slate-100);
    }
    .producto-row:last-child td { border-bottom: none; }

    /* Precio input */
    .precio-input {
      width: 120px;
      padding: 6px 10px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-primary);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 6px;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .precio-input:focus {
      border-color: var(--primary-orange);
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }

    /* Click-to-edit precio */
    .precio-clickable {
      color: var(--gray-700);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid transparent;
      transition: all 0.15s;
    }
    .precio-clickable:hover {
      background: #FFF7ED;
      border-color: #FED7AA;
    }

    .precio-cell {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .badge-diff {
      display: inline-block;
      margin-left: 8px;
      padding: 2px 6px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 4px;
    }
    .badge-positive {
      color: var(--primary-orange);
      background: #FFF7ED;
    }
    .badge-negative {
      color: var(--danger-color);
      background: #FEF2F2;
    }

    .empty-productos {
      padding: 24px 16px;
      text-align: center;
      color: var(--slate-400);
      font-size: 13px;
    }

    .empty-state-row {
      padding: 48px 24px !important;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-state-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-700);
    }

    .empty-state-description {
      font-size: 14px;
      color: var(--slate-400);
    }

    /* ---- Footer hint ---- */
    .footer-hint {
      margin-top: 16px;
      padding: 14px 20px;
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: 12px;
      font-size: 14px;
      color: var(--slate-500);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .hint-label {
      font-weight: 600;
      color: var(--gray-900);
    }

    .hint-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      font-size: 12px;
      font-weight: 700;
      color: white;
      border-radius: 5px;
      vertical-align: middle;
      margin: 0 2px;
    }
    .hint-btn-percent { background: #60A5FA; }
    .hint-btn-fixed { background: var(--primary-orange); }

    /* ---- Responsive ---- */
    @media (max-width: 1024px) {
      .filter-toolbar {
        flex-wrap: wrap;
      }
      .filter-tabs { flex-wrap: wrap; }
    }

    @media (max-width: 768px) {
      .page-title { font-size: 22px; }
      .toolbar-right { justify-content: space-between; }
      .search-box { flex: 1; min-width: 0; }
    }

    @media (max-width: 480px) {
      .toolbar-right { flex-direction: column; align-items: stretch; width: 100%; }
      .search-box { width: 100%; }
      .btn-nueva { width: 100%; justify-content: center; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActualizarPreciosComponent implements OnDestroy, AfterViewChecked {
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  @ViewChildren('autoFocus') autoFocusInputs!: QueryList<ElementRef<HTMLInputElement>>;
  private pendingFocus = false;

  private readonly MAX_VISIBLE = 4;

  // Dialog state
  showNuevaListaDialog = signal(false);
  showMassGlobalDialog = signal(false);
  massGlobalTipo = signal<'porcentaje' | 'importe'>('porcentaje');
  massGlobalValor: number | null = null;
  selectedCatIds = signal<Set<number>>(new Set());

  allCatsSelected = computed(() => this.selectedCatIds().size === this.categorias().length);
  selectedCatsCount = computed(() => this.selectedCatIds().size);
  selectedProductosCount = computed(() =>
    this.categorias()
      .filter(c => this.selectedCatIds().has(c.id))
      .reduce((sum, c) => sum + c.productos.length, 0)
  );

  // Editing state
  editingCell = signal<{ prodId: number; field: string } | null>(null);

  // State
  categorias = signal<CategoriaPrecios[]>(
    MOCK_CATEGORIAS.map(c => ({ ...c, masEditInput: '' }))
  );
  filtroActivo = signal('todas');
  vistaMode = signal<'categorias' | 'todo'>('categorias');
  searchTerm = signal('');
  busquedaInterna = signal('');
  showDropdown = signal(false);
  private expandedRows = signal<Set<number>>(new Set());

  // Debounce
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Dynamic tabs based on categoriaPadre
  private allTabs = computed(() => {
    const all = this.categorias();
    const padres = [...new Set(all.map(c => c.categoriaPadre).filter(Boolean))] as string[];
    const tabList: { id: string; label: string; count: number }[] = [
      { id: 'todas', label: 'Todas', count: all.length },
    ];
    for (const padre of padres) {
      tabList.push({
        id: padre,
        label: padre,
        count: all.filter(c => c.categoriaPadre === padre).length,
      });
    }
    return tabList;
  });

  visibleTabs = computed(() => this.allTabs().slice(0, this.MAX_VISIBLE));

  dropdownTabs = computed(() => this.allTabs().slice(this.MAX_VISIBLE));

  dropdownLabel = computed(() => {
    const active = this.filtroActivo();
    const inDropdown = this.dropdownTabs().find(t => t.id === active);
    if (inDropdown) {
      return `${inDropdown.label} (${inDropdown.count})`;
    }
    return `Mas (${this.dropdownTabs().length})`;
  });

  isDropdownActive = computed(() =>
    this.dropdownTabs().some(t => t.id === this.filtroActivo())
  );

  // Computed filtered
  filteredCategorias = computed<CategoriaPrecios[]>(() => {
    const filter = this.filtroActivo();
    const search = this.searchTerm().toLowerCase().trim();
    let filtered = [...this.categorias()];

    if (filter !== 'todas') {
      filtered = filtered.filter(c => c.categoriaPadre === filter);
    }

    if (search) {
      filtered = filtered.filter(c =>
        c.nombre.toLowerCase().includes(search) ||
        (c.categoriaPadre?.toLowerCase().includes(search)) ||
        c.productos.some(p =>
          p.nombre.toLowerCase().includes(search) ||
          p.codigoBusqueda?.includes(search)
        )
      );
    }

    return filtered;
  });

  allProductosFlat = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const prods: (ProductoGridRow & { categoriaNombre: string })[] = [];
    for (const cat of this.categorias()) {
      for (const prod of cat.productos) {
        prods.push({ ...prod, categoriaNombre: cat.nombre });
      }
    }
    if (search) {
      return prods.filter(p =>
        p.nombre.toLowerCase().includes(search) ||
        p.categoriaNombre.toLowerCase().includes(search) ||
        p.codigoBusqueda?.includes(search)
      );
    }
    return prods;
  });

  allProductosCount = computed(() =>
    this.categorias().reduce((sum, c) => sum + c.productos.length, 0)
  );

  constructor() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(value => this.searchTerm.set(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDropdown(): void {
    this.showDropdown.update(v => !v);
  }

  onFiltroClick(filtro: string): void {
    if (filtro !== this.filtroActivo()) {
      this.filtroActivo.set(filtro);
    }
  }

  onBusquedaInput(value: string): void {
    this.busquedaInterna.set(value);
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.busquedaInterna.set('');
    this.searchSubject.next('');
  }

  isExpanded(id: number): boolean {
    return this.expandedRows().has(id);
  }

  toggleExpand(id: number): void {
    const current = new Set(this.expandedRows());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.expandedRows.set(current);
  }

  onMassEditInput(catId: number, value: string): void {
    this.categorias.update(list =>
      list.map(c => c.id === catId ? { ...c, masEditInput: value } : c)
    );
  }

  onMassEditPercent(cat: CategoriaPrecios): void {
    const val = parseFloat(cat.masEditInput);
    if (isNaN(val) || val === 0) return;

    const factor = 1 + val / 100;

    this.categorias.update(list =>
      list.map(c => {
        if (c.id !== cat.id) return c;
        return {
          ...c,
          masEditInput: '',
          productos: c.productos.map(p => ({
            ...p,
            precio: Math.max(0, Math.round(p.precio * factor)),
            precioTakeAway: p.precioTakeAway != null ? Math.max(0, Math.round(p.precioTakeAway * factor)) : null,
            precioDelivery: p.precioDelivery != null ? Math.max(0, Math.round(p.precioDelivery * factor)) : null,
          })),
        };
      })
    );

    this.notificationService.success(
      `Precios de "${cat.nombre}" actualizados ${val > 0 ? '+' : ''}${val}%`
    );
  }

  onMassEditFixed(cat: CategoriaPrecios): void {
    const val = parseFloat(cat.masEditInput);
    if (isNaN(val) || val === 0) return;

    this.categorias.update(list =>
      list.map(c => {
        if (c.id !== cat.id) return c;
        return {
          ...c,
          masEditInput: '',
          productos: c.productos.map(p => ({
            ...p,
            precio: Math.max(0, p.precio + val),
            precioTakeAway: p.precioTakeAway != null ? Math.max(0, p.precioTakeAway + val) : null,
            precioDelivery: p.precioDelivery != null ? Math.max(0, p.precioDelivery + val) : null,
          })),
        };
      })
    );

    this.notificationService.success(
      `Precios de "${cat.nombre}" actualizados ${val > 0 ? '+' : ''}$${Math.abs(val).toLocaleString('es-AR')}`
    );
  }

  // Click-to-edit methods
  isEditingCell(prodId: number, field: string): boolean {
    const e = this.editingCell();
    return e !== null && e.prodId === prodId && e.field === field;
  }

  startEditing(prodId: number, field: string): void {
    this.editingCell.set({ prodId, field });
    this.pendingFocus = true;
  }

  clearEditing(): void {
    this.editingCell.set(null);
  }

  ngAfterViewChecked(): void {
    if (this.pendingFocus && this.autoFocusInputs?.length > 0) {
      const input = this.autoFocusInputs.first.nativeElement;
      input.focus();
      input.select();
      this.pendingFocus = false;
    }
  }

  onCellBlur(prod: ProductoGridRow, field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/[^0-9]/g, '');
    const newPrecio = parseInt(raw, 10);

    const currentValue = field === 'default' ? prod.precio
      : field === 'takeaway' ? (prod.precioTakeAway ?? prod.precio)
      : (prod.precioDelivery ?? prod.precio);

    this.editingCell.set(null);

    if (isNaN(newPrecio) || newPrecio === currentValue) return;

    const fieldMap: Record<string, string> = {
      default: 'precio',
      takeaway: 'precioTakeAway',
      delivery: 'precioDelivery',
    };
    const propName = fieldMap[field];

    this.categorias.update(list =>
      list.map(c => ({
        ...c,
        productos: c.productos.map(p => {
          if (p.id !== prod.id) return p;
          return { ...p, [propName]: Math.max(0, newPrecio) };
        }),
      }))
    );

    const labelMap: Record<string, string> = {
      default: 'Default',
      takeaway: 'Take Away',
      delivery: 'Delivery',
    };
    this.notificationService.success(
      `${labelMap[field]} de "${prod.nombre}" actualizado a $${newPrecio.toLocaleString('es-AR')}`
    );
  }

  onPrecioEnter(event: Event): void {
    (event.target as HTMLInputElement).blur();
  }

  getDiffPercent(base: number, compare: number | null): number {
    if (compare == null || base === 0 || compare === base) return 0;
    return ((compare - base) / base) * 100;
  }

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-AR');
  }

  onNuevaLista(): void {
    this.showNuevaListaDialog.set(true);
  }

  openMassGlobalDialog(): void {
    this.selectedCatIds.set(new Set(this.categorias().map(c => c.id)));
    this.massGlobalValor = null;
    this.massGlobalTipo.set('porcentaje');
    this.showMassGlobalDialog.set(true);
  }

  isCatSelected(id: number): boolean {
    return this.selectedCatIds().has(id);
  }

  toggleCat(id: number): void {
    this.selectedCatIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  toggleAllCats(): void {
    if (this.allCatsSelected()) {
      this.selectedCatIds.set(new Set());
    } else {
      this.selectedCatIds.set(new Set(this.categorias().map(c => c.id)));
    }
  }

  onMassGlobalApply(): void {
    const val = this.massGlobalValor;
    if (!val || val === 0) return;

    const tipo = this.massGlobalTipo();
    const selected = this.selectedCatIds();

    this.categorias.update(list =>
      list.map(c => {
        if (!selected.has(c.id)) return c;
        return {
          ...c,
          masEditInput: '',
          productos: c.productos.map(p => {
            if (tipo === 'porcentaje') {
              const factor = 1 + val / 100;
              return {
                ...p,
                precio: Math.max(0, Math.round(p.precio * factor)),
                precioTakeAway: p.precioTakeAway != null ? Math.max(0, Math.round(p.precioTakeAway * factor)) : null,
                precioDelivery: p.precioDelivery != null ? Math.max(0, Math.round(p.precioDelivery * factor)) : null,
              };
            } else {
              return {
                ...p,
                precio: Math.max(0, p.precio + val),
                precioTakeAway: p.precioTakeAway != null ? Math.max(0, p.precioTakeAway + val) : null,
                precioDelivery: p.precioDelivery != null ? Math.max(0, p.precioDelivery + val) : null,
              };
            }
          }),
        };
      })
    );

    const count = selected.size;
    const label = tipo === 'porcentaje'
      ? `${val > 0 ? '+' : ''}${val}%`
      : `${val > 0 ? '+' : ''}$${Math.abs(val).toLocaleString('es-AR')}`;

    this.notificationService.success(
      count === this.categorias().length
        ? `Precios de toda la carta actualizados ${label}`
        : `Precios de ${count} categoria${count !== 1 ? 's' : ''} actualizados ${label}`
    );
    this.massGlobalValor = null;
    this.massGlobalTipo.set('porcentaje');
    this.selectedCatIds.set(new Set());
    this.showMassGlobalDialog.set(false);
  }

  onNuevaListaGuardar(data: NuevaListaFormData): void {
    const baseLabel = data.precioBase === 'default' ? 'Default'
      : data.precioBase === 'takeaway' ? 'Take Away' : 'Delivery';
    const ajusteLabel = data.tipoAjuste === 'porcentaje'
      ? `${data.valorAjuste}%`
      : `$${data.valorAjuste.toLocaleString('es-AR')}`;
    this.showNuevaListaDialog.set(false);
    this.notificationService.success(
      `Lista "${data.nombre}" creada (base: ${baseLabel}, ajuste: ${ajusteLabel})`
    );
  }

  onBack(): void {
    this.router.navigate(['/carta']);
  }
}
