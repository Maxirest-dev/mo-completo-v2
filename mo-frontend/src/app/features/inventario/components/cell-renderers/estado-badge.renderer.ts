import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-estado-badge-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="estado-badge" [class]="badgeClass">
      <span class="estado-dot"></span>
      {{ label }}
    </span>
  `,
  styles: [`
    .estado-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      font-size: 12px;
      font-weight: 500;
      border-radius: var(--radius-md);
      white-space: nowrap;
    }

    .estado-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .estado-normal { background: var(--success-bg); color: var(--success-text); }
    .estado-normal .estado-dot { background: var(--success-color); }

    .estado-bajo { background: var(--warning-bg); color: #92400E; }
    .estado-bajo .estado-dot { background: var(--warning-color); }

    .estado-critico { background: var(--danger-bg); color: var(--danger-text); }
    .estado-critico .estado-dot { background: var(--danger-color); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadoBadgeRendererComponent implements ICellRendererAngularComp {
  badgeClass = '';
  label = '';

  agInit(params: ICellRendererParams): void {
    this.updateValues(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.updateValues(params);
    return true;
  }

  private updateValues(params: ICellRendererParams): void {
    const value = params.value as string;
    switch (value) {
      case 'NORMAL':
        this.badgeClass = 'estado-badge estado-normal';
        this.label = 'Normal';
        break;
      case 'BAJO':
        this.badgeClass = 'estado-badge estado-bajo';
        this.label = 'Bajo';
        break;
      case 'CRITICO':
        this.badgeClass = 'estado-badge estado-critico';
        this.label = 'Critico';
        break;
      default:
        this.badgeClass = 'estado-badge estado-normal';
        this.label = value || '';
    }
  }
}
