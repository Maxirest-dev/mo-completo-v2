import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DashboardPanelComponent } from '../dashboard-panel/dashboard-panel.component';
import { TopVentaItemComponent } from './top-venta-item.component';
import { TopVenta } from '../../models';

@Component({
  selector: 'app-top-ventas',
  standalone: true,
  imports: [DashboardPanelComponent, TopVentaItemComponent],
  template: `
    <app-dashboard-panel titulo="Top Ventas & Ganadores" icono="🏆" [loading]="loading()">
      @if (ventas().length === 0) {
        <div class="empty-state">
          <span class="empty-icon">📊</span>
          <p class="empty-text">Sin datos de ventas</p>
        </div>
      } @else {
        <div class="ventas-list">
          @for (venta of ventas(); track venta.productoId) {
            <app-top-venta-item [venta]="venta" />
          }
        </div>
      }
    </app-dashboard-panel>
  `,
  styles: [`
    .ventas-list {
      display: flex;
      flex-direction: column;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      gap: 8px;
    }

    .empty-icon {
      font-size: 28px;
    }

    .empty-text {
      font-size: 14px;
      color: var(--gray-400, #9CA3AF);
      margin: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopVentasComponent {
  ventas = input.required<TopVenta[]>();
  loading = input(false);
}
