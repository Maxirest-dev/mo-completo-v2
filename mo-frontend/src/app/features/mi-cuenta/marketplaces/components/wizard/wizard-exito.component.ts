import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ResultadoActivacion } from '../../models/marketplaces.models';

@Component({
  selector: 'app-wizard-exito',
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
      <div class="exito-container">
        <div class="exito-check">&#10003;</div>
        <h3 class="exito-titulo">Integracion activada con exito</h3>
        <p class="exito-subtitulo">
          Tu restaurante ya esta conectado con Pedidos Ya.
          Los pedidos comenzaran a llegar a tu sistema.
        </p>

        @if (resultado()) {
          <ul class="exito-checks">
            @if (resultado()!.sincronizacionIniciada) {
              <li>
                <span class="check-icon">&#10003;</span>
                Sincronizacion de menu iniciada
              </li>
            }
            @if (resultado()!.menuPublicado) {
              <li>
                <span class="check-icon">&#10003;</span>
                Menu publicado en Pedidos Ya
              </li>
            }
            @if (resultado()!.sistemaListo) {
              <li>
                <span class="check-icon">&#10003;</span>
                Sistema listo para recibir pedidos
              </li>
            }
          </ul>
        }

        <div class="exito-actions">
          <button class="btn-ghost" (click)="volverInicio.emit()">Volver al inicio</button>
          <button class="btn-purple" (click)="verPanel.emit()">Ver panel de Pedidos Ya</button>
        </div>
      </div>
    </div>
  `
})
export class WizardExitoComponent {
  resultado = input.required<ResultadoActivacion | null>();
  volverInicio = output<void>();
  verPanel = output<void>();
}
