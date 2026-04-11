import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanoSalon, PlanoItem, PlanoItemTipo, MesaForma, ItemTamano, ParedOrientacion, PisoTipo, ToolbarItem } from '../../models/plano.model';
import { MOCK_PLANOS } from '../../data/mock-plano.data';

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { tipo: 'mesa', label: 'Mesa cuadrada', emoji: '⬜', forma: 'cuadrada' },
  { tipo: 'mesa', label: 'Mesa circular', emoji: '⚪', forma: 'circular' },
  { tipo: 'planta', label: 'Planta', emoji: '🌿' },
  { tipo: 'pared', label: 'Pared / Divisor', emoji: '🧱' },
  { tipo: 'barra', label: 'Barra', emoji: '🍸' },
  { tipo: 'entrada', label: 'Entrada', emoji: '🚪' },
  { tipo: 'bano', label: 'Banos', emoji: '🚻' },
  { tipo: 'caja', label: 'Caja', emoji: '💰' },
];

const ITEM_EMOJI: Record<PlanoItemTipo, string> = {
  mesa: '', planta: '🌿', pared: '🧱', barra: '🍸', entrada: '🚪', bano: '🚻', caja: '💰',
};

@Component({
  selector: 'app-plano-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="editor-layout">
      <!-- Header -->
      <div class="editor-header">
        <div class="editor-header-left">
          <button class="back-btn" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div class="editor-header-info">
            <h1 class="editor-title">Plano del Salon — {{ plano()?.nombre }}</h1>
            <p class="editor-subtitle">Disena la distribucion de mesas y elementos del salon</p>
          </div>
        </div>
        <div class="editor-header-right">
          <span class="stat-pill">{{ mesaCount() }} mesas</span>
          <span class="stat-pill">{{ totalComensales() }} comensales max</span>
          <div class="piso-selector">
            <span class="piso-label">Piso</span>
            <div class="piso-options">
              <button class="piso-btn" [class.piso-btn--active]="currentPiso() === 'ninguno'" (click)="setPiso('ninguno')">
                <span class="piso-preview piso-preview--ninguno"></span>
              </button>
              <button class="piso-btn" [class.piso-btn--active]="currentPiso() === 'madera'" (click)="setPiso('madera')" title="Madera">
                <span class="piso-preview piso-preview--madera"></span>
              </button>
              <button class="piso-btn" [class.piso-btn--active]="currentPiso() === 'piedra'" (click)="setPiso('piedra')" title="Piedra">
                <span class="piso-preview piso-preview--piedra"></span>
              </button>
              <button class="piso-btn" [class.piso-btn--active]="currentPiso() === 'porcelanato'" (click)="setPiso('porcelanato')" title="Porcelanato">
                <span class="piso-preview piso-preview--porcelanato"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="editor-body">
        <!-- Toolbar -->
        <aside class="toolbar">
          <h3 class="toolbar-title">Elementos</h3>
          <div class="toolbar-items">
            @for (item of toolbarItems; track item.label) {
              <button
                class="toolbar-item"
                [class.toolbar-item--active]="activeTool()?.label === item.label"
                (click)="selectTool(item)"
              >
                <span class="toolbar-item-emoji">{{ item.emoji }}</span>
                <span class="toolbar-item-label">{{ item.label }}</span>
              </button>
            }
          </div>
        </aside>

        <!-- Grid Canvas -->
        <div class="canvas-outer">
          <div class="zoom-controls" (click)="$event.stopPropagation()">
            <button class="zoom-btn" (click)="zoomOut()" [disabled]="zoom() <= 40" title="Alejar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
              </svg>
            </button>
            <span class="zoom-value">{{ zoom() }}%</span>
            <button class="zoom-btn" (click)="zoomIn()" [disabled]="zoom() >= 150" title="Acercar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            <button class="zoom-btn zoom-btn--fit" (click)="zoomFit()" title="Ajustar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>
          </div>
          <div class="canvas-wrapper" (click)="selectedItem.set(null); activeTool.set(null)">
          <div
            class="canvas-grid"
            [style.grid-template-rows]="'repeat(' + gridRows() + ', 1fr)'"
            [style.grid-template-columns]="'repeat(' + gridCols() + ', 1fr)'"
            [style.transform]="'scale(' + zoom() / 100 + ')'"
            [style.transform-origin]="'top center'"
          >
            <!-- Background cells -->
            @for (cell of gridCells(); track cell.key) {
              <div
                class="grid-cell"
                [class.grid-cell--hover]="activeTool()"
                [class.grid-cell--drop-target]="isDragTarget(cell.row, cell.col)"
                [class]="'grid-cell piso--' + currentPiso()"
                [style.grid-row]="cell.row + 1"
                [style.grid-column]="cell.col + 1"
                (click)="onCellClick(cell.row, cell.col); $event.stopPropagation()"
                (dragover)="onDragOver($event, cell.row, cell.col)"
                (dragleave)="dragOverCell.set(null)"
                (drop)="onDrop($event, cell.row, cell.col)"
              ></div>
            }

            <!-- Placed items -->
            @for (item of plano()?.items ?? []; track item.id) {
              <div
                class="placed-item"
                [class.placed-item--selected]="selectedItem()?.id === item.id"
                [class.placed-item--mesa]="item.tipo === 'mesa'"
                [class.placed-item--circular]="item.tipo === 'mesa' && item.forma === 'circular'"
                [class.placed-item--pequeno]="item.tamano === 'pequeno'"
                [class.placed-item--dragging]="draggingItem()?.id === item.id"
                [class]="'placed-item--' + item.tipo"
                [style.grid-row]="(item.row + 1) + ' / span ' + item.rowSpan"
                [style.grid-column]="(item.col + 1) + ' / span ' + item.colSpan"
                draggable="true"
                (dragstart)="onDragStart($event, item)"
                (dragend)="onDragEnd()"
                (click)="selectItem(item); $event.stopPropagation()"
              >
                @switch (item.tipo) {
                  @case ('mesa') {
                    <span class="mesa-numero">{{ item.numero }}</span>
                    @if (item.comensalesMax) {
                      <span class="mesa-cap">{{ item.comensalesMax }}p</span>
                    }
                  }
                  @case ('planta') {
                    <div class="planta-maceta">
                      <div class="planta-hojas"></div>
                      <div class="planta-pot"></div>
                    </div>
                  }
                  @case ('pared') {
                    @if (item.orientacion === 'curva') {
                      <div class="pared-curva" [style.transform]="'rotate(' + (item.curvaRotacion ?? 0) + 'deg)'"></div>
                    } @else {
                      <div class="pared-line" [class.pared-line--vertical]="item.orientacion === 'vertical'"></div>
                    }
                  }
                  @case ('barra') {
                    <div class="barra-counter">
                      <span class="barra-icon">🍸</span>
                      <div class="barra-surface"></div>
                    </div>
                  }
                  @case ('entrada') {
                    <div class="entrada-frame">
                      <svg viewBox="0 0 32 32" fill="none" class="entrada-door-icon">
                        <rect x="6" y="2" width="20" height="28" rx="2" stroke="#78716C" stroke-width="2" fill="#FAFAF9" />
                        <rect x="9" y="5" width="14" height="10" rx="1" stroke="#A8A29E" stroke-width="1" fill="none" />
                        <rect x="9" y="17" width="14" height="10" rx="1" stroke="#A8A29E" stroke-width="1" fill="none" />
                        <circle cx="22" cy="16" r="1.5" fill="#A8A29E" />
                      </svg>
                    </div>
                  }
                  @case ('bano') {
                    <div class="bano-sign">
                      <svg viewBox="0 0 36 28" fill="none" class="bano-icon">
                        <!-- Persona izquierda (falda) -->
                        <circle cx="10" cy="5.5" r="3" fill="#0284C7" />
                        <path d="M5 13h10l-1.5 10h-2l-.8-6h-.4l-.8 6h-2L5 13Z" fill="#0284C7" />
                        <!-- Divisor -->
                        <line x1="18" y1="2" x2="18" y2="26" stroke="#7DD3FC" stroke-width="1" stroke-dasharray="2 2" />
                        <!-- Persona derecha (pantalon) -->
                        <circle cx="26" cy="5.5" r="3" fill="#0284C7" />
                        <rect x="22.5" y="12" width="7" height="6" rx="1" fill="#0284C7" />
                        <rect x="23" y="17.5" width="2.5" height="6" rx="1" fill="#0284C7" />
                        <rect x="26.5" y="17.5" width="2.5" height="6" rx="1" fill="#0284C7" />
                      </svg>
                    </div>
                  }
                  @case ('caja') {
                    <div class="caja-register">
                      <div class="caja-screen"></div>
                      <div class="caja-body"></div>
                    </div>
                  }
                }
              </div>
            }
          </div>
          </div>
        </div>

        <!-- Properties Panel -->
        <aside class="props-panel">
          @if (selectedItem(); as sel) {
            <h3 class="props-title">Propiedades</h3>

            @if (sel.tipo === 'mesa') {
              <div class="prop-group">
                <label class="prop-label">Numero de mesa</label>
                <input class="prop-input" type="number" [ngModel]="sel.numero" (ngModelChange)="updateProp('numero', $event)" />
              </div>
              <div class="prop-group">
                <label class="prop-label">Forma</label>
                <div class="prop-toggle">
                  <button class="prop-toggle-btn" [class.active]="sel.forma === 'cuadrada'" (click)="updateProp('forma', 'cuadrada')">⬜ Cuadrada</button>
                  <button class="prop-toggle-btn" [class.active]="sel.forma === 'circular'" (click)="updateProp('forma', 'circular')">⚪ Circular</button>
                </div>
              </div>
              <div class="prop-group">
                <label class="prop-label">Tamano</label>
                <div class="prop-toggle">
                  <button class="prop-toggle-btn" [class.active]="sel.tamano === 'pequeno'" (click)="updateProp('tamano', 'pequeno')">Pequeno</button>
                  <button class="prop-toggle-btn" [class.active]="sel.tamano === 'grande'" (click)="updateProp('tamano', 'grande')">Grande</button>
                </div>
              </div>
              <div class="prop-group">
                <label class="prop-label">Comensales max <span class="prop-hint">(opcional)</span></label>
                <input class="prop-input" type="number" min="0" [ngModel]="sel.comensalesMax ?? null" (ngModelChange)="updateProp('comensalesMax', $event || undefined)" placeholder="Sin limite" />
              </div>
              <div class="prop-group">
                <label class="prop-label">Ocupar celdas</label>
                <div class="prop-span-row">
                  <div class="prop-span-field">
                    <span class="prop-span-label">Ancho</span>
                    <input class="prop-input prop-input--sm" type="number" min="1" max="4" [ngModel]="sel.colSpan" (ngModelChange)="updateProp('colSpan', $event)" />
                  </div>
                  <span class="prop-span-x">x</span>
                  <div class="prop-span-field">
                    <span class="prop-span-label">Alto</span>
                    <input class="prop-input prop-input--sm" type="number" min="1" max="4" [ngModel]="sel.rowSpan" (ngModelChange)="updateProp('rowSpan', $event)" />
                  </div>
                </div>
              </div>
            } @else {
              <div class="prop-group">
                <label class="prop-label">Etiqueta</label>
                <input class="prop-input" type="text" [ngModel]="sel.label" (ngModelChange)="updateProp('label', $event)" />
              </div>
              @if (sel.tipo === 'pared') {
                <div class="prop-group">
                  <label class="prop-label">Orientacion</label>
                  <div class="prop-toggle prop-toggle--col">
                    <button class="prop-toggle-btn" [class.active]="sel.orientacion === 'horizontal' || !sel.orientacion" (click)="updateProp('orientacion', 'horizontal')">━ Horizontal</button>
                    <button class="prop-toggle-btn" [class.active]="sel.orientacion === 'vertical'" (click)="updateProp('orientacion', 'vertical')">┃ Vertical</button>
                    <button class="prop-toggle-btn" [class.active]="sel.orientacion === 'curva'" (click)="updateProp('orientacion', 'curva'); updateProp('curvaRotacion', 0)">╮ Curva</button>
                  </div>
                </div>
                @if (sel.orientacion === 'curva') {
                  <div class="prop-group">
                    <label class="prop-label">Rotacion</label>
                    <div class="prop-toggle">
                      <button class="prop-toggle-btn" [class.active]="(sel.curvaRotacion ?? 0) === 0" (click)="updateProp('curvaRotacion', 0)">╮</button>
                      <button class="prop-toggle-btn" [class.active]="sel.curvaRotacion === 90" (click)="updateProp('curvaRotacion', 90)">╭</button>
                      <button class="prop-toggle-btn" [class.active]="sel.curvaRotacion === 180" (click)="updateProp('curvaRotacion', 180)">╰</button>
                      <button class="prop-toggle-btn" [class.active]="sel.curvaRotacion === 270" (click)="updateProp('curvaRotacion', 270)">╯</button>
                    </div>
                  </div>
                }
              }
              <div class="prop-group">
                <label class="prop-label">Ocupar celdas</label>
                <div class="prop-span-row">
                  <div class="prop-span-field">
                    <span class="prop-span-label">Ancho</span>
                    <input class="prop-input prop-input--sm" type="number" min="1" max="6" [ngModel]="sel.colSpan" (ngModelChange)="updateProp('colSpan', $event)" />
                  </div>
                  <span class="prop-span-x">x</span>
                  <div class="prop-span-field">
                    <span class="prop-span-label">Alto</span>
                    <input class="prop-input prop-input--sm" type="number" min="1" max="6" [ngModel]="sel.rowSpan" (ngModelChange)="updateProp('rowSpan', $event)" />
                  </div>
                </div>
              </div>
            }
          } @else {
            <div class="props-empty">
              <span class="props-empty-icon">👆</span>
              <p class="props-empty-text">Selecciona un elemento del plano para editar sus propiedades</p>
            </div>
          }
        </aside>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }

    .editor-layout {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 140px);
      margin: -32px;
      padding-top: 24px;
    }

    /* Header */
    .editor-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 0 0 16px;
      margin: 0 16px;
      flex-shrink: 0;
    }

    .editor-header-left {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .back-btn {
      display: flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border-radius: 8px;
      border: 1px solid var(--border-color); background: var(--bg-primary);
      color: var(--text-secondary); cursor: pointer;
      transition: all 0.15s ease; flex-shrink: 0; margin-top: 2px;
    }
    .back-btn:hover { border-color: var(--slate-300); color: var(--text-heading); }

    .editor-header-info { display: flex; flex-direction: column; gap: 2px; }
    .editor-title { font-size: 22px; font-weight: 700; color: var(--text-heading); margin: 0; }
    .editor-subtitle { font-size: 14px; color: var(--text-secondary); margin: 0; }

    .editor-header-right { display: flex; align-items: center; gap: 10px; }
    .stat-pill {
      padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;
      background: var(--slate-100); color: var(--slate-600);
    }

    .piso-selector {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: 4px;
      padding-left: 12px;
      border-left: 1px solid var(--border-color);
    }

    .piso-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .piso-options { display: flex; gap: 6px; }

    .piso-btn {
      padding: 3px;
      border: 2px solid transparent;
      border-radius: 8px;
      background: none;
      cursor: pointer;
      transition: border-color 0.15s ease;
    }

    .piso-btn:hover { border-color: var(--slate-300); }
    .piso-btn--active { border-color: var(--primary-blue, #1155CC); }

    .piso-preview {
      display: block;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      border: 1px solid var(--border-color);
    }

    .piso-preview--ninguno { background: #FFFFFF; }

    .piso-preview--madera {
      background:
        repeating-linear-gradient(
          90deg,
          #DEB887 0px, #D2A679 3px, #C4975A 5px, #DEB887 7px,
          #CDAA7D 10px, #D2A679 13px, #DEB887 14px
        );
    }

    .piso-preview--piedra {
      background: #D6D3D1;
      background-image:
        radial-gradient(ellipse at 20% 50%, rgba(0,0,0,0.04) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 30%, rgba(0,0,0,0.03) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 80%, rgba(255,255,255,0.06) 0%, transparent 50%);
    }

    .piso-preview--porcelanato {
      background: #E8E5E0;
      background-image:
        linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
      background-size: 14px 14px;
    }

    /* Body */
    .editor-body {
      display: flex;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    /* Toolbar */
    .toolbar {
      width: 200px;
      flex-shrink: 0;
      padding: 16px;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      margin: 16px 0 16px 16px;
    }

    .toolbar-title {
      font-size: 13px; font-weight: 600; color: var(--text-secondary);
      text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px;
    }

    .toolbar-items { display: flex; flex-direction: column; gap: 4px; }

    .toolbar-item {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 12px; border-radius: 8px; border: 1px solid transparent;
      background: transparent; font-family: inherit; font-size: 13px;
      color: var(--text-primary); cursor: pointer;
      transition: all 0.12s ease; text-align: left;
    }
    .toolbar-item:hover { background: var(--slate-50); }
    .toolbar-item--active {
      background: rgba(17, 85, 204, 0.06);
      border-color: var(--primary-blue, #1155CC);
      color: var(--primary-blue, #1155CC);
    }

    .toolbar-item-emoji { font-size: 18px; width: 24px; text-align: center; }
    .toolbar-item-label { font-weight: 500; }

    /* Canvas */
    .canvas-wrapper {
      width: 100%;
      height: 100%;
      padding: 24px 16px 16px;
      overflow: auto;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }


    .zoom-controls {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      box-shadow: var(--shadow-sm);
      z-index: 5;
    }

    .zoom-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.12s ease;
    }

    .zoom-btn:hover:not(:disabled) { background: var(--slate-100); color: var(--text-heading); }
    .zoom-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    .zoom-btn--fit { margin-left: 2px; border-left: 1px solid var(--divider-color); padding-left: 2px; border-radius: 0 6px 6px 0; }

    .zoom-value {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
      min-width: 34px;
      text-align: center;
    }

    .canvas-outer {
      flex: 1;
      position: relative;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-sm);
      margin: 16px 8px;
      overflow: hidden;
    }

    .canvas-grid {
      display: grid;
      gap: 2px;
      width: 100%;
      max-width: 780px;
      aspect-ratio: 12 / 10;
      background: var(--slate-200, #E2E8F0);
      border-radius: 12px;
      padding: 2px;
      position: relative;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .grid-cell {
      background: var(--bg-primary);
      border-radius: 4px;
      min-height: 0;
      transition: background 0.1s ease;
    }
    .grid-cell--hover { cursor: crosshair; }
    .grid-cell--hover:hover { background: rgba(17, 85, 204, 0.08) !important; }
    .grid-cell--drop-target { background: rgba(0, 164, 61, 0.12) !important; outline: 2px dashed rgba(0, 164, 61, 0.4); outline-offset: -2px; }

    /* Floor textures */
    .piso--madera {
      background:
        repeating-linear-gradient(
          90deg,
          #DEB887 0px, #D2A679 4px, #C4975A 7px, #DEB887 10px,
          #CDAA7D 14px, #D2A679 18px, #DEB887 20px
        );
      background-size: 20px 100%;
    }

    .piso--piedra {
      background: #D6D3D1;
      background-image:
        radial-gradient(ellipse at 25% 40%, rgba(0,0,0,0.04) 0%, transparent 70%),
        radial-gradient(ellipse at 75% 60%, rgba(0,0,0,0.03) 0%, transparent 60%),
        radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.08) 0%, transparent 50%);
    }

    .piso--porcelanato {
      background: #E8E5E0;
      background-image:
        linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
      background-size: 50% 50%;
    }

    /* Placed items */
    .placed-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      cursor: pointer;
      transition: box-shadow 0.15s ease, transform 0.1s ease;
      z-index: 1;
      gap: 2px;
      padding: 4px;
      min-height: 0;
      overflow: hidden;
    }

    .placed-item { cursor: grab; }
    .placed-item:active { cursor: grabbing; }
    .placed-item:hover { transform: scale(1.03); }
    .placed-item--dragging { opacity: 0.4; }

    .placed-item--selected {
      box-shadow: 0 0 0 2px var(--primary-blue, #1155CC), 0 2px 8px rgba(17, 85, 204, 0.2);
      z-index: 2;
    }

    /* Mesa styles */
    .placed-item--mesa {
      background: #00A43D;
      color: #FFFFFF;
      border-radius: 8px;
    }

    .placed-item--mesa.placed-item--circular { border-radius: 50%; }

    .placed-item--mesa.placed-item--pequeno {
      width: 65%;
      height: 65%;
      margin: auto;
    }

    .mesa-numero { font-size: 16px; font-weight: 700; line-height: 1; }
    .mesa-cap { font-size: 9px; font-weight: 500; opacity: 0.7; line-height: 1; }

    /* === Planta === */
    .placed-item--planta {
      background: transparent;
      border: none;
    }

    .planta-maceta {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
      width: 100%;
    }

    .planta-hojas {
      width: 60%;
      height: 50%;
      background: radial-gradient(ellipse at center, #4ADE80 0%, #16A34A 60%, transparent 70%);
      border-radius: 50%;
      position: relative;
    }

    .planta-hojas::before,
    .planta-hojas::after {
      content: '';
      position: absolute;
      width: 80%;
      height: 80%;
      border-radius: 50%;
      background: radial-gradient(ellipse, #4ADE80 0%, #22C55E 70%, transparent 75%);
    }

    .planta-hojas::before { top: -25%; left: -15%; }
    .planta-hojas::after { top: -20%; right: -15%; }

    .planta-pot {
      width: 35%;
      height: 22%;
      background: #A1887F;
      border-radius: 0 0 4px 4px;
      position: relative;
    }

    .planta-pot::before {
      content: '';
      position: absolute;
      top: -3px;
      left: -15%;
      width: 130%;
      height: 5px;
      background: #8D6E63;
      border-radius: 2px;
    }

    /* === Pared === */
    .placed-item--pared {
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .pared-line {
      width: 100%;
      height: 6px;
      background: linear-gradient(90deg, #78716C, #57534E, #78716C);
      border-radius: 3px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.15);
      position: relative;
    }

    .pared-line::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(255,255,255,0.2);
      border-radius: 3px 3px 0 0;
    }

    .pared-line--vertical {
      width: 6px;
      height: 100%;
      background: linear-gradient(180deg, #78716C, #57534E, #78716C);
    }

    .pared-line--vertical::before {
      bottom: 0;
      width: 2px;
      height: 100%;
      right: auto;
    }

    .pared-curva {
      width: 100%;
      height: 100%;
      position: relative;
    }

    /* Horizontal arm: centered vertically, from center to right edge */
    .pared-curva::before {
      content: '';
      position: absolute;
      top: calc(50% - 3px);
      left: 50%;
      width: 50%;
      height: 6px;
      background: linear-gradient(90deg, #57534E, #78716C);
      border-radius: 0 3px 3px 0;
    }

    /* Vertical arm: centered horizontally, from center to bottom edge */
    .pared-curva::after {
      content: '';
      position: absolute;
      top: 50%;
      left: calc(50% - 3px);
      width: 6px;
      height: 50%;
      background: linear-gradient(180deg, #57534E, #78716C);
      border-radius: 0 0 3px 3px;
    }

    /* === Barra === */
    .placed-item--barra {
      background: transparent;
      border: none;
      padding: 0;
    }

    .barra-counter {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .barra-surface {
      width: 88%;
      height: 28%;
      background: linear-gradient(180deg, #78716C 0%, #57534E 100%);
      border-radius: 3px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      position: relative;
    }

    .barra-surface::before {
      content: '';
      position: absolute;
      top: 1px;
      left: 3px;
      right: 3px;
      height: 1px;
      background: rgba(255,255,255,0.15);
      border-radius: 1px;
    }

    .barra-icon {
      font-size: 20px;
      margin-bottom: 3px;
      filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
    }

    /* === Entrada === */
    .placed-item--entrada {
      background: rgba(245, 158, 11, 0.06);
      border: 1px dashed rgba(245, 158, 11, 0.35);
      border-radius: 6px;
    }

    .entrada-frame {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .entrada-door-icon {
      width: 60%;
      height: 75%;
    }

    /* === Bano === */
    .placed-item--bano {
      background: #E0F2FE;
      border: 1px solid #7DD3FC;
      border-radius: 6px;
    }

    .bano-sign {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .bano-icon {
      width: 80%;
      height: 60%;
      color: #0284C7;
    }

    /* === Caja === */
    .placed-item--caja {
      background: transparent;
      border: none;
      padding: 0;
    }

    .caja-register {
      width: 48px;
      height: 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
    }

    .caja-screen {
      width: 28px;
      height: 12px;
      background: #86EFAC;
      border: 2px solid #57534E;
      border-radius: 3px;
    }

    .caja-body {
      width: 36px;
      height: 16px;
      background: linear-gradient(180deg, #78716C 0%, #57534E 100%);
      border-radius: 3px;
      position: relative;
    }

    .caja-body::before {
      content: '';
      position: absolute;
      bottom: 3px;
      left: 10%;
      width: 80%;
      height: 3px;
      background: rgba(255,255,255,0.15);
      border-radius: 1px;
    }

    /* Properties Panel */
    .props-panel {
      width: 240px;
      flex-shrink: 0;
      padding: 20px;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-sm);
      overflow-y: auto;
      margin: 16px 16px 16px 8px;
    }

    .props-panel::-webkit-scrollbar { width: 4px; }
    .props-panel::-webkit-scrollbar-track { background: transparent; }
    .props-panel::-webkit-scrollbar-thumb { background: var(--slate-200, #E2E8F0); border-radius: 10px; }
    .props-panel::-webkit-scrollbar-thumb:hover { background: var(--slate-300, #CBD5E1); }

    .props-title {
      font-size: 14px; font-weight: 600; color: var(--text-heading);
      margin: 0 0 16px; padding-bottom: 12px;
      border-bottom: 1px solid var(--divider-color);
    }

    .prop-group { margin-bottom: 16px; }

    .prop-label {
      display: block; font-size: 12px; font-weight: 500;
      color: var(--text-secondary); margin-bottom: 6px;
    }

    .prop-hint { font-weight: 400; color: var(--slate-400); }

    .prop-input {
      width: 100%; padding: 7px 10px; border-radius: 6px;
      border: 1px solid var(--border-color); font-family: inherit;
      font-size: 13px; color: var(--text-primary); background: var(--bg-primary);
      transition: border-color 0.15s ease;
      box-sizing: border-box;
    }
    .prop-input:focus { outline: none; border-color: var(--primary-blue, #1155CC); }
    .prop-input--sm { width: 60px; text-align: center; }

    .prop-toggle { display: flex; gap: 6px; }
    .prop-toggle--col { flex-direction: column; }

    .prop-toggle-btn {
      flex: 1; padding: 6px 8px; border-radius: 6px;
      border: 1px solid var(--border-color); background: var(--bg-primary);
      font-family: inherit; font-size: 12px; font-weight: 500;
      color: var(--text-secondary); cursor: pointer;
      transition: all 0.12s ease;
    }
    .prop-toggle-btn:hover { border-color: var(--slate-300); }
    .prop-toggle-btn.active {
      background: var(--slate-900); color: white; border-color: var(--slate-900);
    }

    .prop-span-row { display: flex; align-items: center; gap: 8px; }
    .prop-span-field { display: flex; flex-direction: column; gap: 3px; align-items: center; }
    .prop-span-label { font-size: 10px; color: var(--slate-400); }
    .prop-span-x { font-size: 12px; color: var(--slate-400); font-weight: 500; margin-top: 14px; }

    .props-empty {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 32px 8px; text-align: center;
      height: 100%;
    }
    .props-empty-icon { font-size: 32px; margin-bottom: 12px; }
    .props-empty-text { font-size: 13px; color: var(--slate-400); margin: 0; line-height: 1.5; }

    @media (max-width: 1024px) {
      .toolbar { width: 160px; }
      .props-panel { width: 200px; }
    }
  `],
})
export class PlanoEditorComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly toolbarItems = TOOLBAR_ITEMS;

  plano = signal<PlanoSalon | null>(null);
  activeTool = signal<ToolbarItem | null>(null);
  selectedItem = signal<PlanoItem | null>(null);
  currentPiso = signal<PisoTipo>('ninguno');
  zoom = signal(80);
  draggingItem = signal<PlanoItem | null>(null);
  dragOverCell = signal<{ row: number; col: number; key: string } | null>(null);

  gridRows = computed(() => this.plano()?.gridRows ?? 10);
  gridCols = computed(() => this.plano()?.gridCols ?? 12);

  gridCells = computed(() => {
    const rows = this.gridRows();
    const cols = this.gridCols();
    const cells: { row: number; col: number; key: string }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({ row: r, col: c, key: `${r}-${c}` });
      }
    }
    return cells;
  });

  mesaCount = computed(() =>
    (this.plano()?.items ?? []).filter(i => i.tipo === 'mesa').length
  );

  totalComensales = computed(() =>
    (this.plano()?.items ?? [])
      .filter(i => i.tipo === 'mesa' && i.comensalesMax)
      .reduce((sum, i) => sum + (i.comensalesMax ?? 0), 0)
  );

  ngOnInit(): void {
    const canalId = Number(this.route.snapshot.paramMap.get('id'));
    const existing = MOCK_PLANOS.find(p => p.canalId === canalId);
    if (existing) {
      this.plano.set({ ...existing, items: existing.items.map(i => ({ ...i })) });
      this.currentPiso.set(existing.piso ?? 'ninguno');
    } else {
      this.plano.set({
        id: Date.now(),
        canalId,
        nombre: 'Nuevo salon',
        gridRows: 10,
        gridCols: 12,
        piso: 'ninguno',
        items: [],
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/pdv/configuraciones']);
  }

  zoomIn(): void {
    this.zoom.update(z => Math.min(150, z + 10));
  }

  zoomOut(): void {
    this.zoom.update(z => Math.max(40, z - 10));
  }

  zoomFit(): void {
    this.zoom.set(70);
  }

  setPiso(piso: PisoTipo): void {
    this.currentPiso.set(piso);
    const plano = this.plano();
    if (plano) {
      this.plano.set({ ...plano, piso });
    }
  }

  onDragStart(event: DragEvent, item: PlanoItem): void {
    this.draggingItem.set(item);
    this.selectedItem.set(item);
    this.activeTool.set(null);
    event.dataTransfer?.setData('text/plain', item.id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd(): void {
    this.draggingItem.set(null);
    this.dragOverCell.set(null);
  }

  onDragOver(event: DragEvent, row: number, col: number): void {
    if (!this.draggingItem()) return;
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    const current = this.dragOverCell();
    if (!current || current.row !== row || current.col !== col) {
      this.dragOverCell.set({ row, col, key: `${row}-${col}` });
    }
  }

  isDragTarget(cellRow: number, cellCol: number): boolean {
    const over = this.dragOverCell();
    const item = this.draggingItem();
    if (!over || !item) return false;
    return cellRow >= over.row && cellRow < over.row + item.rowSpan &&
           cellCol >= over.col && cellCol < over.col + item.colSpan;
  }

  onDrop(event: DragEvent, row: number, col: number): void {
    event.preventDefault();
    const item = this.draggingItem();
    const plano = this.plano();
    if (!item || !plano) return;

    const canPlace = !plano.items.some(i =>
      i.id !== item.id &&
      row < i.row + i.rowSpan && row + item.rowSpan > i.row &&
      col < i.col + i.colSpan && col + item.colSpan > i.col
    );

    if (canPlace && row + item.rowSpan <= this.gridRows() && col + item.colSpan <= this.gridCols()) {
      const updated = { ...item, row, col };
      this.plano.set({
        ...plano,
        items: plano.items.map(i => i.id === item.id ? updated : i),
      });
      this.selectedItem.set(updated);
    }

    this.draggingItem.set(null);
    this.dragOverCell.set(null);
  }

  selectTool(tool: ToolbarItem): void {
    if (this.activeTool()?.label === tool.label) {
      this.activeTool.set(null);
    } else {
      this.activeTool.set(tool);
      this.selectedItem.set(null);
    }
  }

  selectItem(item: PlanoItem): void {
    this.selectedItem.set(item);
    this.activeTool.set(null);
  }

  onCellClick(row: number, col: number): void {
    const tool = this.activeTool();
    if (!tool) {
      this.selectedItem.set(null);
      return;
    }

    const plano = this.plano();
    if (!plano) return;

    if (this.isCellOccupied(row, col)) return;

    const id = `${tool.tipo[0]}${Date.now()}`;
    const newItem: PlanoItem = {
      id,
      tipo: tool.tipo,
      row,
      col,
      rowSpan: 1,
      colSpan: 1,
    };

    if (tool.tipo === 'mesa') {
      newItem.forma = tool.forma ?? 'cuadrada';
      newItem.tamano = 'grande';
      newItem.numero = this.nextMesaNumber();
    } else {
      newItem.label = tool.label;
      if (tool.tipo === 'pared') {
        newItem.orientacion = 'horizontal';
        newItem.curvaRotacion = 0;
      }
    }

    this.plano.set({ ...plano, items: [...plano.items, newItem] });
    this.selectedItem.set(newItem);
  }

  deleteSelected(): void {
    const sel = this.selectedItem();
    const plano = this.plano();
    if (!sel || !plano) return;

    this.plano.set({ ...plano, items: plano.items.filter(i => i.id !== sel.id) });
    this.selectedItem.set(null);
  }

  updateProp(key: string, value: any): void {
    const sel = this.selectedItem();
    const plano = this.plano();
    if (!sel || !plano) return;

    const updated = { ...sel, [key]: value };
    this.plano.set({
      ...plano,
      items: plano.items.map(i => i.id === sel.id ? updated : i),
    });
    this.selectedItem.set(updated);
  }

  getEmoji(tipo: PlanoItemTipo): string {
    return ITEM_EMOJI[tipo] ?? '📦';
  }

  private nextMesaNumber(): number {
    const mesas = (this.plano()?.items ?? []).filter(i => i.tipo === 'mesa');
    if (mesas.length === 0) return 1;
    return Math.max(...mesas.map(m => m.numero ?? 0)) + 1;
  }

  private isCellOccupied(row: number, col: number): boolean {
    return (this.plano()?.items ?? []).some(item =>
      row >= item.row && row < item.row + item.rowSpan &&
      col >= item.col && col < item.col + item.colSpan
    );
  }
}
