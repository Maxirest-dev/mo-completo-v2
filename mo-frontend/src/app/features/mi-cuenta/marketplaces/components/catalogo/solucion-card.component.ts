import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MroCurrencyPipe } from '../../../../balances/pipes/currency.pipe';
import { Solucion } from '../../models/marketplaces.models';

@Component({
  selector: 'app-solucion-card',
  standalone: true,
  imports: [MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="solucion-card">
      <div class="solucion-card__header">
        <div class="solucion-icon" [style.background]="solucion().iconColor + '15'" [style.color]="solucion().iconColor">
          {{ solucion().iconText }}
        </div>
        <span class="badge-estado"
              [class.badge-estado--activo]="solucion().estado === 'Activo'"
              [class.badge-estado--disponible]="solucion().estado === 'Disponible'"
              [class.badge-estado--inactivo]="solucion().estado === 'Inactivo'">
          <span class="badge-dot"></span>
          {{ solucion().estado }}
        </span>
      </div>

      <h4 class="solucion-card__nombre">{{ solucion().nombre }}</h4>
      <p class="solucion-card__descripcion">{{ solucion().descripcion }}</p>

      <div class="solucion-card__footer">
        <div class="solucion-precio">
          {{ solucion().precioMensual | mroCurrency }}
          <span class="precio-periodo">/mes</span>
        </div>
        <button
          class="btn-solucion"
          [class.btn-solucion--primary]="solucion().tieneWizard && solucion().estado === 'Disponible'"
          (click)="conocerMas.emit(solucion())">
          Conocer mas
        </button>
      </div>
    </div>
  `
})
export class SolucionCardComponent {
  solucion = input.required<Solucion>();
  conocerMas = output<Solucion>();
}
