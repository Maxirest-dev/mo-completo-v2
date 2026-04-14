import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import {
  ListaPrecios,
  MetodoAceptacionOption,
  ConfiguracionPedidosYa
} from '../../models/marketplaces.models';

@Component({
  selector: 'app-paso2-configuracion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }
  `],
  template: `
    <div class="wizard-body">
      <!-- Progress bar -->
      <div class="wizard-progress">
        <div class="progress-step progress-step--completed"></div>
        <div class="progress-step progress-step--active"></div>
        <div class="progress-step"></div>
      </div>

      <h3 style="font-size: 16px; font-weight: 600; color: var(--gray-900); margin: 0 0 0.25rem 0;">
        Configuracion de la integracion
      </h3>
      <p style="font-size: 13px; color: var(--gray-500); margin: 0 0 1.5rem 0;">
        Configura como queres recibir los pedidos de Pedidos Ya
      </p>

      <!-- Lista de precios -->
      <div class="config-section">
        <label class="config-label">Lista de precios</label>
        <p class="config-sublabel">Selecciona la lista de precios que se sincronizara con Pedidos Ya</p>
        <select
          class="config-select"
          [value]="configuracion().listaPrecios?.id ?? ''"
          (change)="onListaPreciosChange($event)">
          <option value="" disabled>Seleccionar lista de precios...</option>
          @for (lista of listasPrecios(); track lista.id) {
            <option [value]="lista.id">{{ lista.nombre }} ({{ lista.productosSincronizados }} productos)</option>
          }
        </select>
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
  `
})
export class Paso2ConfiguracionComponent {
  listasPrecios = input.required<ListaPrecios[]>();
  metodosAceptacion = input.required<MetodoAceptacionOption[]>();
  configuracion = input.required<ConfiguracionPedidosYa>();
  configuracionValida = input.required<boolean>();

  listaPreciosChange = output<ListaPrecios>();
  metodoChange = output<MetodoAceptacionOption>();
  continuar = output<void>();
  volver = output<void>();

  onListaPreciosChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = Number(select.value);
    const lista = this.listasPrecios().find(l => l.id === id);
    if (lista) {
      this.listaPreciosChange.emit(lista);
    }
  }
}
