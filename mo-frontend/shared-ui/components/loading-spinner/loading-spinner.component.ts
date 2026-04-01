import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-container" [class]="sizeClass()">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .spinner {
      border: 3px solid #E5E7EB;
      border-top-color: #6366F1;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .size-sm .spinner {
      width: 20px;
      height: 20px;
    }

    .size-md .spinner {
      width: 32px;
      height: 32px;
    }

    .size-lg .spinner {
      width: 48px;
      height: 48px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {
  size = input<'sm' | 'md' | 'lg'>('md');

  protected sizeClass = computed(() => `spinner-container size-${this.size()}`);
}
