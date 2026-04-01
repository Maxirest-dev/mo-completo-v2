import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CategoriaGridRow } from '../../models/categoria-grid.model';

@Component({
  selector: 'app-productos-count-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="productos-cell">
      <span class="count" [class.highlight]="count > 20">{{ count }}</span>
      <span class="label">unidades</span>
    </div>
  `,
  styles: [`
    .productos-cell {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      gap: 3px;
    }

    .count {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary);
    }

    /* Highlight numbers in blue when count > 20 like reference */
    .count.highlight {
      color: #2563EB;
    }

    .label {
      font-size: 13px;
      color: var(--slate-500);
    }
  `]
})
export class ProductosCountRendererComponent implements ICellRendererAngularComp {
  count = 0;

  agInit(params: ICellRendererParams<CategoriaGridRow>): void {
    this.updateValues(params);
  }

  refresh(params: ICellRendererParams<CategoriaGridRow>): boolean {
    this.updateValues(params);
    return true;
  }

  private updateValues(params: ICellRendererParams<CategoriaGridRow>): void {
    if (params.data) {
      this.count = params.data.productosCount || 0;
    }
  }
}
