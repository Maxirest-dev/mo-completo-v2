import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { EstadoCategoria, EstadoProducto } from '../../models/categoria-grid.model';

type EstadoType = EstadoCategoria | EstadoProducto;

interface EstadoConfig {
  label: string;
  dotClass: string;
  badgeClass: string;
}

const ESTADO_CONFIG: Record<string, EstadoConfig> = {
  'DISPONIBLE': {
    label: 'Disponible',
    dotClass: 'dot-success',
    badgeClass: 'badge-success'
  },
  'STOCK_MEDIO': {
    label: 'Stock medio',
    dotClass: 'dot-warning',
    badgeClass: 'badge-warning'
  },
  'SIN_STOCK': {
    label: 'Sin stock',
    dotClass: 'dot-danger',
    badgeClass: 'badge-danger'
  },
  'INACTIVO': {
    label: 'Inactivo',
    dotClass: 'dot-inactive',
    badgeClass: 'badge-inactive'
  },
  'ACTIVO': {
    label: 'Activo',
    dotClass: 'dot-success',
    badgeClass: 'badge-success'
  }
};

@Component({
  selector: 'app-estado-badge-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="estado-cell">
      <span class="badge" [ngClass]="badgeClass">
        <span class="dot" [ngClass]="dotClass"></span>
        {{ label }}
      </span>
    </div>
  `,
  styles: [`
    .estado-cell {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 9999px;
      white-space: nowrap;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* Disponible - Green like reference */
    .badge-success {
      background-color: #D1FAE5;
      color: #065F46;
    }

    .dot-success {
      background-color: #10B981;
    }

    /* Stock medio - Amber/Yellow like reference */
    .badge-warning {
      background-color: #FEF3C7;
      color: #92400E;
    }

    .dot-warning {
      background-color: #F59E0B;
    }

    /* Sin stock - Red */
    .badge-danger {
      background-color: #FEE2E2;
      color: #991B1B;
    }

    .dot-danger {
      background-color: #EF4444;
    }

    /* Inactivo - Gray */
    .badge-inactive {
      background-color: #F3F4F6;
      color: #4B5563;
    }

    .dot-inactive {
      background-color: #6B7280;
    }
  `]
})
export class EstadoBadgeRendererComponent implements ICellRendererAngularComp {
  label = '';
  dotClass = '';
  badgeClass = '';

  agInit(params: ICellRendererParams): void {
    this.updateValues(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.updateValues(params);
    return true;
  }

  private updateValues(params: ICellRendererParams): void {
    const estado = params.value as EstadoType;
    const config = ESTADO_CONFIG[estado] || ESTADO_CONFIG['INACTIVO'];

    this.label = config.label;
    this.dotClass = config.dotClass;
    this.badgeClass = config.badgeClass;
  }
}
