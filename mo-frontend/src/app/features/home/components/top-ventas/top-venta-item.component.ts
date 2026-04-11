import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrendIndicatorComponent } from '@mro/shared-ui';
import { TopVenta, TopVentaTendencia } from '../../models';

const FOOD_EMOJI_MAP: Record<string, string> = {
  hamburguesa: '🍔',
  hamb: '🍔',
  pizza: '🍕',
  ensalada: '🥗',
  milanesa: '🥩',
  lomo: '🥪',
  pasta: '🍝',
  empanada: '🥟',
  pollo: '🍗',
  sushi: '🍣',
  taco: '🌮',
  cafe: '☕',
  postre: '🍰',
  helado: '🍨',
  cerveza: '🍺',
  vino: '🍷',
  agua: '💧',
  gaseosa: '🥤',
  papas: '🍟',
  sopa: '🍜',
};

const MEDAL_COLORS: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

const TENDENCIA_MAP: Record<TopVentaTendencia, 'up' | 'down' | 'neutral'> = {
  SUBE: 'up',
  BAJA: 'down',
  ESTABLE: 'neutral',
};

@Component({
  selector: 'app-top-venta-item',
  standalone: true,
  imports: [TrendIndicatorComponent, RouterLink],
  template: `
    <a class="venta-item" [routerLink]="['/carta/producto', venta().productoId]">
      <span class="venta-posicion" [style.background-color]="medalColor()">
        #{{ venta().posicion }}
      </span>

      <span class="venta-emoji">{{ foodEmoji() }}</span>

      <div class="venta-info">
        <span class="venta-nombre">{{ venta().nombre }}</span>
      </div>

      <span class="venta-cantidad">{{ venta().cantidadPedidos }} pedidos</span>

      <app-trend-indicator
        [valor]="venta().variacionPct ?? 0"
        [direccion]="trendDirection()"
      />
    </a>
  `,
  styles: [`
    .venta-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      min-height: 40px;
      border-bottom: 1px solid var(--divider-color, #F1F5F9);
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.15s ease;
      cursor: pointer;
      margin: 0 -8px;
      padding-left: 8px;
      padding-right: 8px;
    }

    .venta-item:last-child {
      border-bottom: none;
    }

    .venta-item:hover {
      background: var(--slate-50, #F8FAFC);
    }

    .venta-posicion {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: var(--radius-sm, 8px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .venta-emoji {
      flex-shrink: 0;
      font-size: 20px;
      line-height: 1;
      width: 24px;
      text-align: center;
    }

    .venta-info {
      flex: 1;
      min-width: 0;
    }

    .venta-nombre {
      font-size: 13px;
      font-weight: 600;
      color: var(--slate-700, #314158);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }

    .venta-cantidad {
      flex-shrink: 0;
      font-size: 12px;
      font-weight: 500;
      color: var(--slate-400, #90A1B9);
      white-space: nowrap;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopVentaItemComponent {
  venta = input.required<TopVenta>();

  protected foodEmoji = computed(() => {
    const nombre = this.venta().nombre.toLowerCase();
    for (const [keyword, emoji] of Object.entries(FOOD_EMOJI_MAP)) {
      if (nombre.includes(keyword)) {
        return emoji;
      }
    }
    return '🍽️';
  });

  protected medalColor = computed(() => {
    const pos = this.venta().posicion;
    return MEDAL_COLORS[pos] ?? 'var(--slate-400, #90A1B9)';
  });

  protected trendDirection = computed(
    (): 'up' | 'down' | 'neutral' => TENDENCIA_MAP[this.venta().tendencia]
  );
}
