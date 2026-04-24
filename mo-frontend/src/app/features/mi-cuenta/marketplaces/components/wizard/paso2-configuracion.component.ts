import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import {
  ListaPrecios,
  MetodoAceptacionOption,
  ConfiguracionPedidosYa
} from '../../models/marketplaces.models';
import { WizardStepperComponent } from './wizard-stepper.component';

export interface NuevaListaPayload {
  nombre: string;
  basadaEnId: number;
}

@Component({
  selector: 'app-paso2-configuracion',
  standalone: true,
  imports: [WizardStepperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .lista-row {
      display: flex;
      align-items: stretch;
      gap: 8px;
    }
    .lista-row .config-select { flex: 1; }
    .btn-add {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      min-width: 42px;
      padding: 0;
      background: white;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: 8px;
      color: var(--primary-orange, #F18800);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-add:hover {
      background: #FFF7ED;
      border-color: var(--primary-orange, #F18800);
    }
    .btn-add svg { width: 18px; height: 18px; }

    /* Mini dialog crear lista (por encima del wizard) */
    .create-dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 43, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1100;
      padding: 24px;
      animation: fadeInOverlay 0.15s ease;
    }
    @keyframes fadeInOverlay {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .create-dialog {
      width: 100%;
      max-width: 420px;
      background: white;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(15, 23, 43, 0.18);
      overflow: hidden;
    }
    .create-dialog-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color, #E2E8F0);
      display: flex; align-items: center; justify-content: space-between;
    }
    .create-dialog-title {
      font-size: 15px; font-weight: 700;
      color: var(--text-heading, #0F172B);
      margin: 0;
    }
    .create-dialog-close {
      background: none; border: none; cursor: pointer;
      color: var(--text-secondary, #64748B);
      font-size: 18px; line-height: 1;
      padding: 0; width: 24px; height: 24px;
      display: flex; align-items: center; justify-content: center;
    }
    .create-dialog-body { padding: 18px 20px; }
    .create-field { margin-bottom: 14px; }
    .create-field:last-child { margin-bottom: 0; }
    .create-label {
      display: block;
      font-size: 13px; font-weight: 600;
      color: var(--text-heading, #0F172B);
      margin-bottom: 6px;
    }
    .create-input, .create-select {
      width: 100%;
      padding: 9px 12px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-heading, #0F172B);
      background: white;
      border: 1px solid var(--slate-300, #CBD5E1);
      border-radius: 8px;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .create-select {
      appearance: none; -webkit-appearance: none;
      padding-right: 36px;
      cursor: pointer;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3e%3cpath d='m6 9 6 6 6-6'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 12px center;
    }
    .create-input:focus, .create-select:focus {
      border-color: var(--primary-orange, #F18800);
      box-shadow: 0 0 0 3px rgba(241, 136, 0, 0.15);
    }
    .create-dialog-actions {
      display: flex; justify-content: flex-end; gap: 10px;
      padding: 14px 20px;
      background: var(--slate-50, #F8FAFC);
      border-top: 1px solid var(--border-color, #E2E8F0);
    }
    .btn-dialog {
      padding: 8px 16px; font-size: 13px; font-weight: 500; font-family: inherit;
      border-radius: 8px; border: none; cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-dialog-secondary {
      background: white; color: var(--text-primary, #314158);
      border: 1px solid var(--border-color, #E2E8F0);
    }
    .btn-dialog-secondary:hover { background: var(--slate-50, #F8FAFC); }
    .btn-dialog-primary {
      background: var(--primary-orange, #F18800); color: white;
    }
    .btn-dialog-primary:hover:not(:disabled) { background: var(--primary-orange-hover, #D97800); }
    .btn-dialog-primary:disabled {
      background: var(--slate-200, #E2E8F0);
      color: var(--slate-400, #94A3B8);
      cursor: not-allowed;
    }
  `],
  template: `
    <app-wizard-stepper [steps]="stepLabels" [activeIndex]="2" />

    <div class="wizard-body">
      <!-- Lista de precios -->
      <div class="config-section">
        <label class="config-label">Lista de precios</label>
        <p class="config-sublabel">Selecciona la lista de precios que se sincronizara con Pedidos Ya</p>
        <div class="lista-row">
          <select
            class="config-select"
            [value]="configuracion().listaPrecios?.id ?? ''"
            (change)="onListaPreciosChange($event)">
            <option value="" disabled>Seleccionar lista de precios...</option>
            @for (lista of listasPrecios(); track lista.id) {
              <option [value]="lista.id">{{ lista.nombre }} ({{ lista.productosSincronizados }} productos)</option>
            }
          </select>
          <button
            type="button"
            class="btn-add"
            title="Crear nueva lista de precios"
            aria-label="Crear nueva lista de precios"
            (click)="abrirCrearLista()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Metodo de aceptacion -->
      <div class="config-section">
        <label class="config-label">Metodo de aceptacion de pedidos</label>
        <p class="config-sublabel">Define como se procesaran los pedidos entrantes</p>
        <div class="radio-cards">
          @for (metodo of metodosAceptacion(); track metodo.id) {
            <div
              class="radio-card"
              [class.radio-card--selected]="configuracion().metodoAceptacion?.id === metodo.id"
              (click)="metodoChange.emit(metodo)">
              <div class="radio-indicator"></div>
              <div class="radio-content">
                <div class="radio-title">
                  {{ metodo.nombre }}
                  @if (metodo.recomendado) {
                    <span class="badge-recomendado">Recomendado</span>
                  }
                </div>
                <div class="radio-description">{{ metodo.descripcion }}</div>
                <div class="radio-meta">Tiempo de respuesta: {{ metodo.tiempoRespuesta }}</div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Warning card -->
      <div class="warning-card">
        <span class="warning-icon">&#9888;</span>
        <div class="warning-content">
          <div class="warning-title">Verificacion de menu</div>
          <div class="warning-text">
            Antes de activar la integracion, asegurate de que tu menu este actualizado en la lista de precios seleccionada.
            Los productos se sincronizaran automaticamente con Pedidos Ya.
          </div>
        </div>
      </div>
    </div>

    <div class="wizard-footer">
      <button class="btn-ghost" (click)="volver.emit()">Volver</button>
      <button
        class="btn-purple"
        [disabled]="!configuracionValida()"
        (click)="continuar.emit()">
        Continuar
      </button>
    </div>

    <!-- Dialog: crear nueva lista -->
    @if (showCreateDialog()) {
      <div class="create-dialog-overlay" (click)="onOverlayClick($event)">
        <div class="create-dialog">
          <div class="create-dialog-header">
            <h4 class="create-dialog-title">Nueva lista de precios</h4>
            <button type="button" class="create-dialog-close" (click)="cerrarCrearLista()" aria-label="Cerrar">&#10005;</button>
          </div>
          <div class="create-dialog-body">
            <div class="create-field">
              <label for="nueva-lista-nombre" class="create-label">Nombre de la lista</label>
              <input
                id="nueva-lista-nombre"
                type="text"
                class="create-input"
                placeholder="Ej: Lista Pedidos Ya"
                [value]="nuevaListaNombre()"
                (input)="onNombreInput($event)" />
            </div>
            <div class="create-field">
              <label for="nueva-lista-base" class="create-label">Precio base (copiar de una lista existente)</label>
              <select
                id="nueva-lista-base"
                class="create-select"
                [value]="nuevaListaBaseId() ?? ''"
                (change)="onBaseChange($event)">
                <option value="" disabled>Seleccionar lista base...</option>
                @for (lista of listasPrecios(); track lista.id) {
                  <option [value]="lista.id">{{ lista.nombre }}</option>
                }
              </select>
            </div>
          </div>
          <div class="create-dialog-actions">
            <button type="button" class="btn-dialog btn-dialog-secondary" (click)="cerrarCrearLista()">Cancelar</button>
            <button
              type="button"
              class="btn-dialog btn-dialog-primary"
              [disabled]="!puedeCrearLista()"
              (click)="confirmarCrearLista()">
              Crear lista
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class Paso2ConfiguracionComponent {
  listasPrecios = input.required<ListaPrecios[]>();
  metodosAceptacion = input.required<MetodoAceptacionOption[]>();
  configuracion = input.required<ConfiguracionPedidosYa>();
  configuracionValida = input.required<boolean>();

  readonly stepLabels = ['Información', 'Tienda', 'Configuración', 'Confirmación'];

  listaPreciosChange = output<ListaPrecios>();
  metodoChange = output<MetodoAceptacionOption>();
  crearLista = output<NuevaListaPayload>();
  continuar = output<void>();
  volver = output<void>();

  // UI local: dialog crear lista
  protected readonly showCreateDialog = signal(false);
  protected readonly nuevaListaNombre = signal('');
  protected readonly nuevaListaBaseId = signal<number | null>(null);
  protected readonly puedeCrearLista = computed(() =>
    this.nuevaListaNombre().trim().length > 0 && this.nuevaListaBaseId() !== null
  );

  onListaPreciosChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = Number(select.value);
    const lista = this.listasPrecios().find(l => l.id === id);
    if (lista) {
      this.listaPreciosChange.emit(lista);
    }
  }

  abrirCrearLista(): void {
    this.nuevaListaNombre.set('');
    this.nuevaListaBaseId.set(null);
    this.showCreateDialog.set(true);
  }

  cerrarCrearLista(): void {
    this.showCreateDialog.set(false);
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('create-dialog-overlay')) {
      this.cerrarCrearLista();
    }
  }

  onNombreInput(event: Event): void {
    this.nuevaListaNombre.set((event.target as HTMLInputElement).value);
  }

  onBaseChange(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);
    this.nuevaListaBaseId.set(Number.isFinite(id) ? id : null);
  }

  confirmarCrearLista(): void {
    if (!this.puedeCrearLista()) return;
    this.crearLista.emit({
      nombre: this.nuevaListaNombre().trim(),
      basadaEnId: this.nuevaListaBaseId()!
    });
    this.cerrarCrearLista();
  }
}
