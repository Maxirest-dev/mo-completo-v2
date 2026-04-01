import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { ProgressBarComponent } from '@mro/shared-ui';
import { StockAlert, StockAlertEstado } from '../../models';

@Component({
  selector: 'app-stock-alert-item',
  standalone: true,
  imports: [ProgressBarComponent],
  template: `
    <div class="alert-item">
      <div class="alert-info">
        <span class="alert-nombre">{{ alert().nombre }}</span>
        <span class="alert-deposito">{{ alert().depositoNombre }}</span>
      </div>

      <div class="alert-progress">
        <app-progress-bar [porcentaje]="alert().porcentaje" [showLabel]="false" />
      </div>

      <span class="alert-badge" [class]="badgeClass()">
        {{ alert().porcentaje }}%
      </span>

      @if (alert().estado === 'CRITICO') {
        <button class="btn-pedir" title="Crear pedido de reposicion">
          Pedir+
        </button>
      }
    </div>
  `,
  styles: [`
    .alert-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      min-height: 40px;
      border-bottom: 1px solid var(--divider-color, #F1F5F9);
    }

    .alert-item:last-child {
      border-bottom: none;
    }

    .alert-info {
      flex: 0 0 130px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .alert-nombre {
      font-size: 13px;
      font-weight: 600;
      color: var(--slate-700, #314158);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .alert-deposito {
      font-size: 11px;
      color: var(--slate-400, #90A1B9);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .alert-progress {
      flex: 1;
      min-width: 60px;
    }

    .alert-badge {
      flex-shrink: 0;
      font-size: 12px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: var(--radius-sm, 8px);
      min-width: 42px;
      text-align: center;
    }

    .badge-critico {
      background: var(--danger-color, #EF4444);
      color: #FFFFFF;
    }

    .badge-bajo {
      background: var(--warning-color, #F59E0B);
      color: #FFFFFF;
    }

    .badge-normal {
      background: var(--success-color, #00A43D);
      color: #FFFFFF;
    }

    .btn-pedir {
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border: 1px solid var(--danger-color, #EF4444);
      border-radius: var(--radius-sm, 8px);
      background: transparent;
      color: var(--danger-color, #EF4444);
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .btn-pedir:hover {
      background: var(--danger-color, #EF4444);
      color: #FFFFFF;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockAlertItemComponent {
  alert = input.required<StockAlert>();

  protected badgeClass = computed(() => {
    const estado: StockAlertEstado = this.alert().estado;
    const map: Record<StockAlertEstado, string> = {
      CRITICO: 'alert-badge badge-critico',
      BAJO: 'alert-badge badge-bajo',
      NORMAL: 'alert-badge badge-normal',
    };
    return map[estado];
  });
}
