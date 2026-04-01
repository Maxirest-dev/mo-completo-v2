import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyArs',
  standalone: true
})
export class CurrencyArsPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace('ARS', '$').trim();
  }
}
