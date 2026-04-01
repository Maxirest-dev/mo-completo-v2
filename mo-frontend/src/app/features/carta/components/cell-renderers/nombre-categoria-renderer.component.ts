import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CategoriaGridRow } from '../../models/categoria-grid.model';

@Component({
  selector: 'app-nombre-categoria-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="nombre-cell">
      <div class="icono-wrapper" [style.background-color]="iconoColor">
        <span class="icono">{{ icono }}</span>
      </div>
      <div class="text-content">
        <span class="nombre">{{ nombre }}</span>
        <span class="descripcion">{{ descripcion }}</span>
      </div>
    </div>
  `,
  styles: [`
    .nombre-cell {
      display: flex;
      align-items: center;
      gap: 14px;
      height: 100%;
      padding: 8px 0;
    }

    .icono-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icono {
      font-size: 22px;
      line-height: 1;
    }

    .text-content {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .nombre {
      font-weight: 600;
      color: var(--slate-900);
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .descripcion {
      font-size: 13px;
      color: var(--slate-500);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class NombreCategoriaRendererComponent implements ICellRendererAngularComp {
  nombre = '';
  descripcion = '';
  icono = '';
  iconoColor = 'var(--primary-orange)';

  agInit(params: ICellRendererParams<CategoriaGridRow>): void {
    this.updateValues(params);
  }

  refresh(params: ICellRendererParams<CategoriaGridRow>): boolean {
    this.updateValues(params);
    return true;
  }

  private updateValues(params: ICellRendererParams<CategoriaGridRow>): void {
    if (params.data) {
      this.nombre = params.data.nombre || '';
      this.descripcion = params.data.descripcion || '';
      this.icono = params.data.icono || '📦';
      this.iconoColor = params.data.iconoColor || 'var(--primary-orange)';
    }
  }
}
