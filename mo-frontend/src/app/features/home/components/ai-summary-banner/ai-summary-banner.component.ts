import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
} from '@angular/core';
import { AiSummary, AiHighlight } from '../../models';

@Component({
  selector: 'app-ai-summary-banner',
  standalone: true,
  template: `
    @if (loading()) {
      <div class="ai-banner ai-banner--loading">
        <div class="skeleton-icon"></div>
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-text"></div>
          <div class="skeleton-line skeleton-text short"></div>
        </div>
      </div>
    } @else if (summary()) {
      <div class="ai-banner" [class.ai-banner--expanded]="expanded()">
        <div class="ai-banner__main">
          <div class="ai-banner__icon" aria-hidden="true">
            <svg
              class="sparkle-svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#a78bfa" />
                  <stop offset="100%" stop-color="#7c3aed" />
                </linearGradient>
              </defs>
              <path
                d="M13 0 L15.5 10.5 L26 13 L15.5 15.5 L13 26 L10.5 15.5 L0 13 L10.5 10.5 Z"
                fill="url(#sparkleGrad)"
              />
            </svg>
          </div>

          <div class="ai-banner__body">
            <h2 class="ai-banner__title">Resumen Inteligente del Día</h2>
            <p class="ai-banner__text">{{ summary()!.texto }}</p>

            @if (hasHighlights()) {
              <div class="ai-banner__highlights">
                @for (highlight of summary()!.highlights; track highlight.texto) {
                  <span
                    class="highlight-tag"
                    [class.highlight-tag--positivo]="highlight.tipo === 'positivo'"
                    [class.highlight-tag--negativo]="highlight.tipo === 'negativo'"
                    [class.highlight-tag--neutro]="highlight.tipo === 'neutro'"
                  >
                    @if (highlight.tipo === 'positivo') {
                      <span class="highlight-dot highlight-dot--positivo"></span>
                    } @else if (highlight.tipo === 'negativo') {
                      <span class="highlight-dot highlight-dot--negativo"></span>
                    } @else {
                      <span class="highlight-dot highlight-dot--neutro"></span>
                    }
                    {{ highlight.texto }}
                  </span>
                }
              </div>
            }
          </div>

          <button
            class="ai-banner__toggle"
            type="button"
            (click)="toggleExpanded()"
            [attr.aria-expanded]="expanded()"
            aria-controls="ai-details"
          >
            {{ expanded() ? 'Ocultar' : 'Ver detalles' }}
            <svg
              class="toggle-chevron"
              [class.toggle-chevron--up]="expanded()"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        @if (expanded() && summary()!.detalles) {
          <div class="ai-banner__details" id="ai-details">
            <div class="details-separator"></div>
            <p class="details-text">{{ summary()!.detalles }}</p>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    /* ── Banner Base ── */
    .ai-banner {
      background: linear-gradient(135deg, #f0fdf4 0%, #faf5ff 40%, #ffffff 100%);
      border: 1px solid var(--gray-200, #E5E7EB);
      border-radius: var(--radius-lg, 12px);
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
      overflow: hidden;
      transition: box-shadow 0.2s ease;
    }

    .ai-banner:hover {
      box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
    }

    /* ── Main Layout ── */
    .ai-banner__main {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px 24px;
    }

    /* ── AI Icon ── */
    .ai-banner__icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full, 9999px);
      background: linear-gradient(135deg, #c4b5fd 0%, #7c3aed 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse-glow 3s ease-in-out infinite;
    }

    .sparkle-svg {
      filter: drop-shadow(0 0 3px rgba(167, 139, 250, 0.4));
    }

    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.15);
      }
      50% {
        box-shadow: 0 0 12px 4px rgba(124, 58, 237, 0.2);
      }
    }

    /* ── Body ── */
    .ai-banner__body {
      flex: 1;
      min-width: 0;
    }

    .ai-banner__title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900, #111827);
      margin: 0 0 6px 0;
      line-height: 1.3;
    }

    .ai-banner__text {
      font-size: 14px;
      color: var(--gray-600, #4B5563);
      margin: 0 0 10px 0;
      line-height: 1.55;
    }

    /* ── Highlight Tags ── */
    .ai-banner__highlights {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }

    .highlight-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: var(--radius-full, 9999px);
      line-height: 1.4;
    }

    .highlight-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .highlight-tag--positivo {
      background: var(--success-bg, #D1FAE5);
      color: var(--success-text, #065F46);
    }
    .highlight-dot--positivo {
      background: var(--success-color, #10B981);
    }

    .highlight-tag--negativo {
      background: var(--danger-bg, #FEE2E2);
      color: var(--danger-text, #991B1B);
    }
    .highlight-dot--negativo {
      background: var(--danger-color, #EF4444);
    }

    .highlight-tag--neutro {
      background: var(--gray-100, #F3F4F6);
      color: var(--gray-600, #4B5563);
    }
    .highlight-dot--neutro {
      background: var(--gray-400, #9CA3AF);
    }

    /* ── Toggle Button ── */
    .ai-banner__toggle {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-color, #F97316);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: var(--radius-sm, 6px);
      transition: background 0.15s ease, color 0.15s ease;
      white-space: nowrap;
      margin-top: 2px;
    }

    .ai-banner__toggle:hover {
      background: var(--primary-orange-light, #FFF7ED);
      color: var(--primary-hover, #EA580C);
    }

    .toggle-chevron {
      transition: transform 0.2s ease;
    }

    .toggle-chevron--up {
      transform: rotate(180deg);
    }

    /* ── Expanded Details ── */
    .ai-banner__details {
      padding: 0 24px 20px;
      animation: slide-down 0.2s ease-out;
    }

    .details-separator {
      height: 1px;
      background: var(--gray-200, #E5E7EB);
      margin-bottom: 16px;
    }

    .details-text {
      font-size: 14px;
      color: var(--gray-600, #4B5563);
      line-height: 1.65;
      margin: 0;
    }

    @keyframes slide-down {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ── Loading Skeleton ── */
    .ai-banner--loading {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px 24px;
      background: linear-gradient(135deg, #f0fdf4 0%, #faf5ff 40%, #ffffff 100%);
      border: 1px solid var(--gray-200, #E5E7EB);
      border-radius: var(--radius-lg, 12px);
    }

    .skeleton-icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--gray-200, #E5E7EB);
      animation: shimmer 1.5s ease-in-out infinite;
    }

    .skeleton-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .skeleton-line {
      border-radius: 4px;
      animation: shimmer 1.5s ease-in-out infinite;
    }

    .skeleton-title {
      width: 240px;
      height: 20px;
      background: var(--gray-200, #E5E7EB);
    }

    .skeleton-text {
      width: 100%;
      height: 14px;
      background: var(--gray-100, #F3F4F6);
    }

    .skeleton-text.short {
      width: 60%;
    }

    @keyframes shimmer {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.4;
      }
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .ai-banner__main {
        flex-wrap: wrap;
        padding: 16px;
        gap: 12px;
      }

      .ai-banner__icon {
        width: 40px;
        height: 40px;
      }

      .ai-banner__title {
        font-size: 16px;
      }

      .ai-banner__toggle {
        width: 100%;
        justify-content: center;
        margin-top: 4px;
      }

      .ai-banner__details {
        padding: 0 16px 16px;
      }

      .ai-banner__highlights {
        gap: 6px;
      }

      .highlight-tag {
        font-size: 11px;
        padding: 3px 8px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiSummaryBannerComponent {

  /** The AI-generated summary data */
  summary = input.required<AiSummary | null>();

  /** Whether the component is in a loading state */
  loading = input(false);

  /** Internal toggle for expanded details view */
  expanded = signal(false);

  /** Whether highlights exist in the summary */
  hasHighlights = computed(() => (this.summary()?.highlights?.length ?? 0) > 0);

  /** Toggle the expanded details section */
  toggleExpanded(): void {
    this.expanded.update(v => !v);
  }
}
