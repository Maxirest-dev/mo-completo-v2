import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-wizard-activando',
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
      <div class="activando-container">
        <div class="activando-spinner"></div>
        <h3 class="activando-titulo">Activando integracion...</h3>
        <p class="activando-subtitulo">
          Estamos configurando tu integracion con Pedidos Ya.
          Esto puede demorar unos segundos.
        </p>
      </div>
    </div>
  `
})
export class WizardActivandoComponent {}
