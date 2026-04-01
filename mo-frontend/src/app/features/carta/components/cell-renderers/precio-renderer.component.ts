import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-precio-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="precio-cell">
      <span class="precio">{{ formattedPrice }}</span>
    </div>
  `,
  styles: [`
    .precio-cell {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .precio {
      font-weight: 500;
      font-size: 14px;
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
    }
  `]
})
export class PrecioRendererComponent implements ICellRendererAngularComp {
  formattedPrice = '';

  agInit(params: ICellRendererParams): void {
    this.updateValues(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.updateValues(params);
    return true;
  }

  private updateValues(params: ICellRendererParams): void {
    const value = params.value as number;
    if (value != null) {
      // Format as Colombian peso style: $45.000
      this.formattedPrice = '$' + value.toLocaleString('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    } else {
      this.formattedPrice = '-';
    }
  }
}
