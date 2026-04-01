import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  template: `
    <div class="progress-bar-container">
      <div class="progress-bar-track">
        <div class="progress-bar-fill" [class]="fillClass()" [style.width.%]="clampedValue()"></div>
      </div>
      @if (showLabel()) {
        <span class="progress-bar-label">{{ clampedValue() }}%</span>
      }
    </div>
  `,
  styles: [`
    .progress-bar-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .progress-bar-track {
      flex: 1;
      height: 6px;
      background: #E5E7EB;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.4s ease;
    }

    .fill-critico {
      background: #EF4444;
    }

    .fill-bajo {
      background: #F59E0B;
    }

    .fill-normal {
      background: #10B981;
    }

    .progress-bar-label {
      font-size: 12px;
      font-weight: 600;
      color: #6B7280;
      min-width: 36px;
      text-align: right;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  porcentaje = input<number>(0);
  showLabel = input(true);

  protected clampedValue = computed(() =>
    Math.max(0, Math.min(100, this.porcentaje()))
  );

  protected fillClass = computed(() => {
    const val = this.clampedValue();
    if (val <= 20) return 'progress-bar-fill fill-critico';
    if (val <= 50) return 'progress-bar-fill fill-bajo';
    return 'progress-bar-fill fill-normal';
  });
}
