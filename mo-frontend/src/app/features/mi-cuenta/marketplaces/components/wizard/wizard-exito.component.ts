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
          Tu restaurante ya esta conectado con Pedidos Ya.<br>
          Los pedidos comenzaran a llegar a tu sistema.
        </p>

        <div class="exito-actions">
          <button class="btn-ghost" (click)="cerrar.emit()">Cerrar</button>
          <button class="btn-purple" (click)="configurarCatalogo.emit()">Configurar catálogo</button>
        </div>
      </div>
    </div>
  `
})
export class WizardExitoComponent {
  resultado = input.required<ResultadoActivacion | null>();
  cerrar = output<void>();
  configurarCatalogo = output<void>();
}
