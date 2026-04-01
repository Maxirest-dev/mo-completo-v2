import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-trend-indicator',
  standalone: true,
  template: `
    <span class="trend-indicator" [class]="trendClass()">
      <span class="trend-arrow">{{ arrow() }}</span>
      <span class="trend-value">{{ displayValue() }}</span>
      @if (periodo()) {
        <span class="trend-periodo">{{ periodo() }}</span>
      }
    </span>
  `,
  styles: [`
    .trend-indicator {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .trend-up {
      color: #059669;
      background: #ECFDF5;
    }

    .trend-down {
      color: #DC2626;
      background: #FEF2F2;
    }

    .trend-neutral {
      color: #6B7280;
      background: #F3F4F6;
    }

    .trend-arrow {
      font-size: 11px;
    }

    .trend-periodo {
      color: #9CA3AF;
      font-weight: 400;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendIndicatorComponent {
  valor = input<number>(0);
  direccion = input<'up' | 'down' | 'neutral'>('neutral');
  periodo = input<string>('');

  protected trendClass = computed(() => {
    const dir = this.direccion();
    return `trend-indicator trend-${dir}`;
  });

  protected arrow = computed(() => {
    switch (this.direccion()) {
      case 'up': return '\u2191';
      case 'down': return '\u2193';
      default: return '\u2192';
    }
  });

  protected displayValue = computed(() => {
    const val = this.valor();
    const abs = Math.abs(val);
    return `${abs}%`;
  });
}
