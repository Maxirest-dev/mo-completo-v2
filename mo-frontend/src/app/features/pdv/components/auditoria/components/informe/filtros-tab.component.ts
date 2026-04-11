import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroTab } from '../../models/auditoria.models';

@Component({
  selector: 'app-filtros-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-pills">
      @for (filtro of filtros(); track filtro.id) {
        <button
          class="filter-pill"
          [class.filter-pill-active]="filtro.id === filtroActivo()"
          (click)="filtroChange.emit(filtro.id)">
          {{ filtro.label }} ({{ filtro.count }})
        </button>
      }
    </div>
  `,
  styles: []
})
export class FiltrosTabComponent {
  filtros = input.required<FiltroTab[]>();
  filtroActivo = input.required<string>();
  filtroChange = output<string>();
}
