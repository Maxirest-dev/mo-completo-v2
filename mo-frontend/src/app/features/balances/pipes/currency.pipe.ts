import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mroCurrency', standalone: true })
export class MroCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '—';
    if (value === 0) return '$0';
    if (value < 0) return '-$' + Math.abs(value).toLocaleString('es-AR');
    return '$' + value.toLocaleString('es-AR');
  }
}
