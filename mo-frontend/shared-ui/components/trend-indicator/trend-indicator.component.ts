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
      color: var(--success-color, #00A43D);
      background: var(--success-bg, #ECFDF5);
    }

    .trend-down {
      color: var(--danger-text, #DC2626);
      background: var(--danger-bg, #FEF2F2);
    }

    .trend-neutral {
      color: var(--slate-500, #64748B);
      background: var(--slate-100, #F1F5F9);
    }

    .trend-arrow {
      font-size: 11px;
    }

    .trend-periodo {
      color: var(--text-secondary, #90A1B9);
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
