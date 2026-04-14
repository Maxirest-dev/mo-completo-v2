import { Component, ChangeDetectionStrategy, inject, effect, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourService } from '../../services/tour.service';

@Component({
  selector: 'app-tour-overlay',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tour.tourActive()) {
      <div class="tour-backdrop" (click)="tour.endTour()">
        <!-- Spotlight hole + tooltip positioned via style -->
        @if (spotlightStyle()) {
          <div class="tour-spotlight" [style]="spotlightStyle()" (click)="$event.stopPropagation()"></div>
        }

        <div class="tour-tooltip" [style]="tooltipStyle()" (click)="$event.stopPropagation()">
          <div class="tour-tooltip-header">
            <span class="tour-tooltip-section">{{ tour.tourSectionName() }}</span>
            <span class="tour-tooltip-counter">{{ tour.currentStepIndex() + 1 }} / {{ tour.totalSteps() }}</span>
          </div>
          @if (tour.currentStep()) {
            <h4 class="tour-tooltip-title">{{ tour.currentStep()!.title }}</h4>
            <p class="tour-tooltip-content">{{ tour.currentStep()!.content }}</p>
          }
          <div class="tour-tooltip-actions">
            @if (tour.currentStepIndex() > 0) {
              <button class="tour-btn tour-btn-ghost" (click)="tour.prevStep()">Anterior</button>
            }
            <button class="tour-btn tour-btn-skip" (click)="tour.endTour()">Saltar tour</button>
            <button class="tour-btn tour-btn-next" (click)="tour.nextStep()">
              {{ tour.currentStepIndex() < tour.totalSteps() - 1 ? 'Siguiente' : 'Finalizar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .tour-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      z-index: 9998;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .tour-spotlight {
      position: fixed;
      z-index: 9999;
      border-radius: 8px;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
      background: transparent;
      transition: all 0.3s ease;
      pointer-events: none;
    }

    .tour-tooltip {
      position: fixed;
      z-index: 10000;
      background: white;
      border-radius: 14px;
      padding: 20px;
      width: 340px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
      animation: tooltipIn 0.25s ease;
    }

    @keyframes tooltipIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .tour-tooltip-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .tour-tooltip-section {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--primary-orange, #F18800);
    }

    .tour-tooltip-counter {
      font-size: 11px;
      font-weight: 500;
      color: var(--slate-400, #94A3B8);
    }

    .tour-tooltip-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-heading, #0F172B);
      margin: 0 0 6px;
    }

    .tour-tooltip-content {
      font-size: 14px;
      color: var(--slate-500, #64748B);
      line-height: 1.55;
      margin: 0 0 16px;
    }

    .tour-tooltip-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tour-btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: all 0.15s ease;
      border: none;
    }

    .tour-btn-next {
      background: var(--primary-orange, #F18800);
      color: white;
      margin-left: auto;
    }

    .tour-btn-next:hover { background: #D97800; }

    .tour-btn-ghost {
      background: white;
      color: var(--slate-700, #314158);
      border: 1px solid var(--slate-200, #E2E8F0);
    }

    .tour-btn-ghost:hover { background: var(--slate-50, #F8FAFC); }

    .tour-btn-skip {
      background: none;
      color: var(--slate-400, #94A3B8);
      font-weight: 500;
      padding: 8px 8px;
    }

    .tour-btn-skip:hover { color: var(--slate-600, #475569); }
  `],
})
export class TourOverlayComponent {
  readonly tour = inject(TourService);

  readonly spotlightStyle = signal<string | null>(null);
  readonly tooltipStyle = signal<string>('top: 50%; left: 50%; transform: translate(-50%, -50%)');

  constructor() {
    effect(() => {
      const step = this.tour.currentStep();
      if (!step) {
        this.spotlightStyle.set(null);
        return;
      }
      // Defer to next frame so DOM can settle
      requestAnimationFrame(() => this.positionElements(step.selector, step.position ?? 'bottom'));
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    const step = this.tour.currentStep();
    if (step) {
      this.positionElements(step.selector, step.position ?? 'bottom');
    }
  }

  private positionElements(selector: string, position: string): void {
    const selectors = selector.split(',').map(s => s.trim());
    let el: Element | null = null;

    for (const sel of selectors) {
      el = document.querySelector(sel);
      if (el) break;
    }

    if (!el) {
      // Element not found — center tooltip without spotlight
      this.spotlightStyle.set(null);
      this.tooltipStyle.set('top: 50%; left: 50%; transform: translate(-50%, -50%)');
      return;
    }

    const rect = el.getBoundingClientRect();
    const pad = 8;

    // Spotlight
    this.spotlightStyle.set(
      `top: ${rect.top - pad}px; left: ${rect.left - pad}px; width: ${rect.width + pad * 2}px; height: ${rect.height + pad * 2}px;`
    );

    // Tooltip position
    const tooltipW = 340;
    const tooltipH = 200; // approximate
    let top: number;
    let left: number;

    switch (position) {
      case 'top':
        top = rect.top - tooltipH - 16;
        left = rect.left + rect.width / 2 - tooltipW / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipH / 2;
        left = rect.left - tooltipW - 16;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipH / 2;
        left = rect.right + 16;
        break;
      default: // bottom
        top = rect.bottom + 16;
        left = rect.left + rect.width / 2 - tooltipW / 2;
    }

    // Keep in viewport
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipW - 16));
    top = Math.max(16, Math.min(top, window.innerHeight - tooltipH - 16));

    this.tooltipStyle.set(`top: ${top}px; left: ${left}px;`);
  }
}
