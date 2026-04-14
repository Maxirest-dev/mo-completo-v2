import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MroCurrencyPipe } from '../../../../balances/pipes/currency.pipe';
import { ProductoHardware } from '../../models/marketplaces.models';

@Component({
  selector: 'app-producto-card',
  standalone: true,
  imports: [MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="producto-card" [style.background]="producto().color">
      <span class="producto-card__label">HARDWARE</span>
      <h3 class="producto-card__nombre">{{ producto().nombre }}</h3>
      <p class="producto-card__subtitulo">{{ producto().subtitulo }}</p>

      <div class="producto-card__footer">
        <div class="producto-precio">
          <span class="precio-valor">{{ producto().precioMensual | mroCurrency }}</span>
          <span class="precio-periodo">/mes</span>
          <span class="precio-iva">{{ producto().iva }}</span>
        </div>
        <button class="btn-conocer-mas" (click)="conocerMas.emit(producto())">
          Conocer mas
        </button>
      </div>
    </div>
  `
})
export class ProductoCardComponent {
  producto = input.required<ProductoHardware>();
  conocerMas = output<ProductoHardware>();
}
