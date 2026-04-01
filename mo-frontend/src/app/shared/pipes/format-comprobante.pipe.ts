import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatComprobante',
  standalone: true
})
export class FormatComprobantePipe implements PipeTransform {
  transform(puntoVenta: string, numero: string): string {
    const pv = puntoVenta.padStart(3, '0');
    const nro = numero.padStart(10, '0');
    return `${pv}-${nro}`;
  }
}
