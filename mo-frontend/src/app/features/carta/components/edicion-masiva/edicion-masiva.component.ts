import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastContainerComponent, NotificationService } from '@mro/shared-ui';
import { EstacionDialogComponent } from '../producto-perfil/estacion-dialog.component';
import { CalendarioDialogComponent } from '../producto-perfil/calendario-dialog.component';
import { MOCK_CATEGORIAS } from '../../data/mock-categorias.data';
import { ESTACIONES_DISPONIBLES, getProductoPerfil } from '../../data/mock-producto-perfil.data';
import { CategoriaGridRow } from '../../models/categoria-grid.model';
import { Estacion, CalendarioData, EstacionFormData, CalendarioFormData } from '../../models/producto-perfil.model';

const CANALES = ['SALON', 'MOSTRADOR', 'DELIVERY', 'PEDIDOS YA'];
const CANALES_CON_TODOS = ['TODOS', ...CANALES];
const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
const TURNOS = ['Manana', 'Tarde', 'Noche'];

@Component({
  selector: 'app-edicion-masiva',
  standalone: true,
  imports: [CommonModule, ToastContainerComponent],
  template: `
    <div class="em-container">
      <!-- Header -->
      <header class="page-header">
        <button class="btn-back" (click)="onBack()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
          </svg>
        </button>
        <div class="header-info">
          <h1 class="page-title">Edicion masiva</h1>
          <p class="page-subtitle">Modifica calendario y estaciones de trabajo para multiples productos</p>
        </div>
      </header>

      <!-- Main content: 2 columns -->
      <div class="em-layout">
        <!-- Left: Product selection -->
        <div class="card em-left">
          <h3 class="section-title">Seleccionar productos</h3>
          <div class="select-all">
            <label class="checkbox-label">
              <input type="checkbox" [checked]="allSelected()" (change)="toggleAll()"/>
              <span class="select-all-text">Toda la carta</span>
            </label>
            <span class="selected-count">{{ selectedCount() }} seleccionados</span>
          </div>
          <div class="cat-list">
            @for (cat of categorias(); track cat.id) {
              <div class="cat-group">
                <label class="checkbox-label cat-header" (click)="$event.preventDefault(); toggleCat(cat.id)">
                  <input type="checkbox" [checked]="isCatFullySelected(cat.id)" [indeterminate]="isCatPartiallySelected(cat.id)"/>
                  <span class="cat-icon" [style.background]="cat.iconoColor">{{ cat.icono || '📦' }}</span>
                  <span class="cat-name">{{ cat.nombre }}</span>
                  <span class="cat-count">{{ cat.productos.length }}</span>
                  <button class="expand-btn" (click)="$event.preventDefault(); $event.stopPropagation(); toggleExpandCat(cat.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                      [style.transform]="isCatExpanded(cat.id) ? 'rotate(90deg)' : ''">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/>
                    </svg>
                  </button>
                </label>
                @if (isCatExpanded(cat.id)) {
                  <div class="prod-list">
                    @for (prod of cat.productos; track prod.id) {
                      <label class="checkbox-label prod-item">
                        <input type="checkbox" [checked]="isProdSelected(prod.id)" (change)="toggleProd(prod.id)"/>
                        <span>{{ prod.nombre }}</span>
                      </label>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Right: Configuration -->
        <div class="em-right">
          <!-- Estaciones -->
          <div class="card config-section">
            <h3 class="section-title">Estaciones de trabajo</h3>
            <p class="section-desc">Selecciona en que estaciones se preparan los productos.</p>
            <div class="estaciones-grid">
              @for (est of estaciones; track est.id) {
                <div
                  class="estacion-card"
                  [class.estacion-selected]="isEstacionSelected(est.id)"
                  (click)="toggleEstacion(est.id)"
                >
                  @if (isEstacionSelected(est.id)) {
                    <span class="estacion-check"></span>
                  }
                  <div class="estacion-icon">
                    @switch (est.icono) {
                      @case ('mostrador') {
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/>
                        </svg>
                      }
                      @case ('barra') {
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>
                        </svg>
                      }
                      @case ('cocina') {
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"/>
                        </svg>
                      }
                      @case ('parrilla') {
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 5.625v-.75ZM3.75 9.375c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 10.125v-.75ZM3.75 13.875c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125H4.875a1.125 1.125 0 0 1-1.125-1.125v-.75ZM6 18.75v2.25M12 18.75v2.25M18 18.75v2.25"/>
                        </svg>
                      }
                    }
                  </div>
                  <span class="estacion-name">{{ est.nombre }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Calendario -->
          <div class="card config-section">
            <div class="cal-header">
              <div>
                <h3 class="section-title">Calendario de disponibilidad</h3>
                <p class="section-desc">Configura los turnos en que los productos estan disponibles.</p>
              </div>
            </div>

            <!-- Canal tabs -->
            <div class="canal-tabs">
              @for (canal of canales; track canal) {
                <button
                  class="canal-tab"
                  [class.canal-tab-active]="canalActivo() === canal"
                  (click)="canalActivo.set(canal)"
                >
                  {{ canal }}
                </button>
              }
            </div>

            <!-- Quick actions -->
            <div class="quick-actions">
              <button class="quick-btn" (click)="calQuickAction('all')">Todos los dias</button>
              <button class="quick-btn" (click)="calQuickAction('weekdays')">Lunes a Viernes</button>
              <button class="quick-btn" (click)="calQuickAction('weekend')">Fin de semana</button>
              <button class="quick-btn quick-btn-clear" (click)="calQuickAction('clear')">Limpiar todo</button>
            </div>

            <!-- Days grid -->
            <div class="days-grid">
              @for (dia of dias; track dia; let diaIdx = $index) {
                <div class="day-card" [style.border-left-color]="getDayBorderColor(diaIdx)">
                  <div class="day-header">{{ dia }}</div>
                  <div class="turnos-list">
                    @for (turno of turnos; track turno; let turnoIdx = $index) {
                      <button
                        class="turno-toggle"
                        [class.turno-active]="isTurnoActive(diaIdx, turnoIdx)"
                        (click)="toggleTurno(diaIdx, turnoIdx)"
                      >
                        <span class="turno-dot" [class.turno-dot-active]="isTurnoActive(diaIdx, turnoIdx)"></span>
                        {{ turno }}
                      </button>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Legend -->
            <div class="legend">
              <div class="legend-item"><span class="legend-swatch" style="background:#22C55E"></span><span>3 turnos</span></div>
              <div class="legend-item"><span class="legend-swatch" style="background:#F97316"></span><span>2 turnos</span></div>
              <div class="legend-item"><span class="legend-swatch" style="background:#EAB308"></span><span>1 turno</span></div>
              <div class="legend-item"><span class="legend-swatch" style="background:#D1D5DB"></span><span>Inactivo</span></div>
            </div>
          </div>

          <!-- Footer -->
          <div class="em-footer">
            <div class="em-summary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
              </svg>
              <span>Se aplicara a <strong>{{ selectedCount() }} productos</strong></span>
            </div>
            <div class="em-actions">
              <button class="btn btn-secondary" (click)="onBack()">Cancelar</button>
              <button class="btn btn-primary" (click)="onApply()" [disabled]="selectedCount() === 0">Aplicar cambios</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-toast-container />
  `,
  styles: [`
    .em-container { max-width: 1400px; margin: 0 auto; }

    /* Header */
    .page-header {
      display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
    }
    .btn-back {
      display: flex; align-items: center; justify-content: center;
      width: 40px; height: 40px; border-radius: 10px; border: 1px solid #E5E7EB;
      background: white; cursor: pointer; color: #374151; transition: all 0.15s;
    }
    .btn-back:hover { background: #F9FAFB; border-color: #D1D5DB; }
    .page-title { font-size: 26px; font-weight: 600; color: var(--gray-900); margin: 0; }
    .page-subtitle { font-size: 14px; color: var(--gray-500); margin: 4px 0 0; }

    /* Layout */
    .em-layout {
      display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start;
    }

    .card {
      background: white; border-radius: 12px; border: 1px solid var(--gray-200);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08); padding: 20px;
    }

    .section-title { font-size: 16px; font-weight: 600; color: #1F2937; margin: 0 0 4px; }
    .section-desc { font-size: 13px; color: #6B7280; margin: 0 0 16px; }

    /* Left: Selection */
    .select-all {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 0; border-bottom: 1px solid #E5E7EB; margin-bottom: 4px;
    }
    .select-all-text { font-weight: 600; }
    .selected-count { font-size: 12px; color: #9CA3AF; }

    .checkbox-label {
      display: flex; align-items: center; gap: 8px;
      font-size: 14px; color: #374151; cursor: pointer;
    }
    .checkbox-label input[type="checkbox"] {
      width: 16px; height: 16px; accent-color: #F97316; cursor: pointer; flex-shrink: 0;
    }

    .cat-list { max-height: 500px; overflow-y: auto; margin-top: 4px; }
    .cat-group { border-bottom: 1px solid #F3F4F6; }
    .cat-group:last-child { border-bottom: none; }
    .cat-header { padding: 8px 0; }
    .cat-header:hover { background: #F9FAFB; border-radius: 6px; padding: 8px 6px; margin: 0 -6px; }
    .cat-icon {
      width: 24px; height: 24px; border-radius: 6px; display: flex;
      align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;
    }
    .cat-name { flex: 1; font-weight: 500; }
    .cat-count { font-size: 12px; color: #9CA3AF; }
    .expand-btn {
      background: none; border: none; cursor: pointer; color: #9CA3AF;
      display: flex; padding: 2px; transition: transform 0.2s;
    }
    .prod-list { padding: 0 0 6px 32px; }
    .prod-item { padding: 4px 0; font-size: 13px; color: #6B7280; }

    /* Right */
    .em-right { display: flex; flex-direction: column; gap: 24px; }
    .config-section { }

    /* Estaciones */
    .estaciones-grid { display: flex; gap: 16px; flex-wrap: wrap; }
    .estacion-card {
      position: relative; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 10px;
      width: 120px; height: 120px; border: 2px solid #E5E7EB;
      border-radius: 14px; cursor: pointer; transition: all 0.2s; background: white;
    }
    .estacion-card:hover { border-color: #F97316; background: #FFF7ED; }
    .estacion-selected { border-color: #F97316; background: #FFF7ED; box-shadow: 0 0 0 3px rgba(249,115,22,0.15); }
    .estacion-selected .estacion-icon { color: #F97316; }
    .estacion-selected .estacion-name { color: #EA580C; font-weight: 600; }
    .estacion-check {
      position: absolute; top: 8px; right: 8px;
      width: 10px; height: 10px; border-radius: 50%; background: #22C55E;
    }
    .estacion-icon { color: #6B7280; transition: color 0.2s; }
    .estacion-name { font-size: 13px; font-weight: 500; color: #374151; transition: all 0.2s; }

    /* Calendario */
    .cal-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .canal-tabs {
      display: flex; gap: 4px; margin-bottom: 16px;
      border-bottom: 1px solid #E5E7EB; padding-bottom: 0;
    }
    .canal-tab {
      padding: 10px 18px; font-size: 13px; font-weight: 500; font-family: inherit;
      color: #6B7280; background: transparent; border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer; transition: all 0.15s; margin-bottom: -1px;
    }
    .canal-tab:hover { color: #374151; }
    .canal-tab-active { color: #F97316; border-bottom-color: #F97316; font-weight: 600; }
    .quick-actions { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
    .quick-btn {
      padding: 6px 14px; font-size: 12px; font-weight: 500; font-family: inherit;
      color: #374151; background: #F3F4F6; border: 1px solid #E5E7EB;
      border-radius: 8px; cursor: pointer; transition: all 0.15s;
    }
    .quick-btn:hover { background: #E5E7EB; }
    .quick-btn-clear { color: #EF4444; border-color: #FECACA; background: #FEF2F2; }
    .quick-btn-clear:hover { background: #FEE2E2; }

    .days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; }
    .day-card {
      background: #FAFAFA; border: 1px solid #E5E7EB;
      border-left: 3px solid #D1D5DB; border-radius: 10px; overflow: hidden;
    }
    .day-header {
      padding: 10px 12px 6px; font-size: 12px; font-weight: 700;
      color: #374151; text-transform: uppercase; letter-spacing: 0.04em;
    }
    .turnos-list { display: flex; flex-direction: column; gap: 4px; padding: 4px 8px 10px; }
    .turno-toggle {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 8px; font-size: 12px; font-family: inherit;
      color: #9CA3AF; background: white; border: 1px solid #E5E7EB;
      border-radius: 6px; cursor: pointer; transition: all 0.15s; font-weight: 500;
    }
    .turno-toggle:hover { border-color: #F97316; }
    .turno-active { color: #374151; background: #FFF7ED; border-color: #FDBA74; }
    .turno-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #D1D5DB; flex-shrink: 0; transition: background 0.15s;
    }
    .turno-dot-active { background: #22C55E; }

    .legend {
      display: flex; gap: 20px; margin-top: 16px;
      padding-top: 12px; border-top: 1px solid #F3F4F6;
    }
    .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6B7280; }
    .legend-swatch { width: 10px; height: 10px; border-radius: 3px; }

    /* Footer */
    .em-footer {
      display: flex; align-items: center; justify-content: space-between;
      background: white; border-radius: 12px; border: 1px solid var(--gray-200);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08); padding: 16px 20px;
    }
    .em-summary {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: #92400E;
    }
    .em-actions { display: flex; gap: 12px; }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 24px; font-size: 14px; font-weight: 500; font-family: inherit;
      border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: #1F2937; color: white; }
    .btn-primary:hover:not(:disabled) { background: #374151; }
    .btn-secondary { background: white; color: #374151; border: 1px solid #E5E7EB; }
    .btn-secondary:hover { background: #F9FAFB; }

    @media (max-width: 1024px) {
      .em-layout { grid-template-columns: 1fr; }
      .days-grid { grid-template-columns: repeat(4, 1fr); }
    }
    @media (max-width: 600px) {
      .days-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdicionMasivaComponent {
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  categorias = signal<CategoriaGridRow[]>(MOCK_CATEGORIAS);
  estaciones = ESTACIONES_DISPONIBLES;
  canales = CANALES_CON_TODOS;
  dias = DIAS;
  turnos = TURNOS;
  canalActivo = signal('TODOS');

  // Selection
  selectedProdIds = signal<Set<number>>(new Set(
    MOCK_CATEGORIAS.flatMap(c => c.productos.map(p => p.id))
  ));
  expandedCats = signal<Set<number>>(new Set());
  selectedEstaciones = signal<Set<number>>(new Set());

  // Calendario state: per canal, per dia, per turno
  calData = signal<Record<string, boolean[][]>>(
    Object.fromEntries(CANALES.map(canal => [
      canal, DIAS.map(() => TURNOS.map(() => false))
    ]))
  );

  // View: merged or per-canal
  calViewData = computed(() => {
    const canal = this.canalActivo();
    const data = this.calData();
    if (canal === 'TODOS') {
      return DIAS.map((_, diaIdx) =>
        TURNOS.map((_, turnoIdx) =>
          CANALES.some(c => data[c]?.[diaIdx]?.[turnoIdx])
        )
      );
    }
    return data[canal] || DIAS.map(() => TURNOS.map(() => false));
  });

  selectedCount = computed(() => this.selectedProdIds().size);

  allSelected = computed(() => {
    const allProds = this.categorias().flatMap(c => c.productos);
    return allProds.length > 0 && this.selectedProdIds().size === allProds.length;
  });

  // Product selection
  toggleAll(): void {
    if (this.allSelected()) {
      this.selectedProdIds.set(new Set());
    } else {
      this.selectedProdIds.set(new Set(
        this.categorias().flatMap(c => c.productos.map(p => p.id))
      ));
    }
  }

  isCatFullySelected(catId: number): boolean {
    const cat = this.categorias().find(c => c.id === catId);
    if (!cat || cat.productos.length === 0) return false;
    return cat.productos.every(p => this.selectedProdIds().has(p.id));
  }

  isCatPartiallySelected(catId: number): boolean {
    const cat = this.categorias().find(c => c.id === catId);
    if (!cat) return false;
    const sel = this.selectedProdIds();
    const count = cat.productos.filter(p => sel.has(p.id)).length;
    return count > 0 && count < cat.productos.length;
  }

  toggleCat(catId: number): void {
    const cat = this.categorias().find(c => c.id === catId);
    if (!cat) return;
    const full = this.isCatFullySelected(catId);
    this.selectedProdIds.update(set => {
      const next = new Set(set);
      cat.productos.forEach(p => full ? next.delete(p.id) : next.add(p.id));
      return next;
    });
  }

  isProdSelected(prodId: number): boolean {
    return this.selectedProdIds().has(prodId);
  }

  toggleProd(prodId: number): void {
    this.selectedProdIds.update(set => {
      const next = new Set(set);
      next.has(prodId) ? next.delete(prodId) : next.add(prodId);
      return next;
    });
  }

  isCatExpanded(catId: number): boolean {
    return this.expandedCats().has(catId);
  }

  toggleExpandCat(catId: number): void {
    this.expandedCats.update(set => {
      const next = new Set(set);
      next.has(catId) ? next.delete(catId) : next.add(catId);
      return next;
    });
  }

  // Estaciones
  isEstacionSelected(id: number): boolean {
    return this.selectedEstaciones().has(id);
  }

  toggleEstacion(id: number): void {
    this.selectedEstaciones.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Calendario
  isTurnoActive(diaIdx: number, turnoIdx: number): boolean {
    return this.calViewData()[diaIdx]?.[turnoIdx] ?? false;
  }

  getDayBorderColor(diaIdx: number): string {
    const row = this.calViewData()[diaIdx];
    if (!row) return '#D1D5DB';
    const count = row.filter(v => v).length;
    if (count === 3) return '#22C55E';
    if (count === 2) return '#F97316';
    if (count === 1) return '#EAB308';
    return '#D1D5DB';
  }

  toggleTurno(diaIdx: number, turnoIdx: number): void {
    const canal = this.canalActivo();
    this.calData.update(data => {
      const next: Record<string, boolean[][]> = {};
      for (const c of CANALES) {
        next[c] = data[c].map(row => [...row]);
      }
      if (canal === 'TODOS') {
        const currentlyActive = CANALES.some(c => next[c][diaIdx][turnoIdx]);
        for (const c of CANALES) {
          next[c][diaIdx][turnoIdx] = !currentlyActive;
        }
      } else {
        next[canal][diaIdx][turnoIdx] = !next[canal][diaIdx][turnoIdx];
      }
      return next;
    });
  }

  calQuickAction(action: string): void {
    const canal = this.canalActivo();
    this.calData.update(data => {
      const next: Record<string, boolean[][]> = {};
      for (const c of CANALES) {
        next[c] = data[c].map(row => [...row]);
      }
      const apply = (c: string) => {
        next[c] = DIAS.map((_, diaIdx) =>
          TURNOS.map(() => {
            if (action === 'all') return true;
            if (action === 'clear') return false;
            if (action === 'weekdays') return diaIdx < 5;
            if (action === 'weekend') return diaIdx >= 5;
            return false;
          })
        );
      };
      if (canal === 'TODOS') {
        CANALES.forEach(apply);
      } else {
        apply(canal);
      }
      return next;
    });
  }

  // Actions
  onBack(): void {
    this.router.navigate(['/carta']);
  }

  onApply(): void {
    const count = this.selectedCount();
    const estNames = this.estaciones
      .filter(e => this.selectedEstaciones().has(e.id))
      .map(e => e.nombre);
    const turnosActivos = Object.values(this.calData()).flat().flat().filter(v => v).length;

    const parts: string[] = [];
    if (estNames.length > 0) parts.push(`estaciones: ${estNames.join(', ')}`);
    if (turnosActivos > 0) parts.push(`${turnosActivos} turnos activados`);

    this.notificationService.success(
      `Edicion masiva aplicada a ${count} producto${count !== 1 ? 's' : ''}${parts.length ? ' (' + parts.join(' | ') + ')' : ''}`
    );
    this.router.navigate(['/carta']);
  }
}
