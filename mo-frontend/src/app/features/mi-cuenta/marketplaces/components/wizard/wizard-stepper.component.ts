import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-wizard-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pos-stepper">
      @for (label of steps(); track $index; let i = $index; let last = $last) {
        <div
          class="pos-step"
          [class.pos-step--active]="i === activeIndex()"
          [class.pos-step--done]="i < activeIndex()">
          <span class="pos-step-dot">{{ i + 1 }}</span>
          <span class="pos-step-label">{{ label }}</span>
        </div>
        @if (!last) {
          <span class="pos-step-line"></span>
        }
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .pos-stepper {
      display: flex; align-items: center; justify-content: center;
      gap: 0; padding: 24px 32px 0;
    }
    .pos-step { display: flex; align-items: center; gap: 8px; opacity: 0.4; }
    .pos-step--active { opacity: 1; }
    .pos-step--done { opacity: 0.7; }
    .pos-step-dot {
      width: 26px; height: 26px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700;
      background: var(--slate-200, #E2E8F0); color: var(--slate-500, #64748B);
    }
    .pos-step--active .pos-step-dot { background: var(--primary-blue, #1155CC); color: white; }
    .pos-step--done .pos-step-dot { background: var(--primary-blue, #1155CC); color: white; }
    .pos-step-label { font-size: 13px; font-weight: 500; color: var(--text-secondary, #64748B); }
    .pos-step--active .pos-step-label { color: var(--text-heading, #0F172B); }
    .pos-step-line { width: 32px; height: 2px; background: var(--slate-200, #E2E8F0); margin: 0 10px; }
  `]
})
export class WizardStepperComponent {
  steps = input.required<string[]>();
  activeIndex = input.required<number>();
}
