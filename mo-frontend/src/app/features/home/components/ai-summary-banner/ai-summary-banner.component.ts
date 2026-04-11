import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
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
                  <stop offset="0%" stop-color="#FFD6A7" />
                  <stop offset="100%" stop-color="#F27920" />
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
                    class="highlight-tag highlight-tag--clickable"
                    [class.highlight-tag--positivo]="highlight.tipo === 'positivo'"
                    [class.highlight-tag--negativo]="highlight.tipo === 'negativo'"
                    [class.highlight-tag--neutro]="highlight.tipo === 'neutro'"
                    (click)="navigateHighlight(highlight)"
                    role="link"
                    tabindex="0"
                  >
                    @if (highlight.tipo === 'positivo') {
                      <span class="highlight-dot highlight-dot--positivo"></span>
                    } @else if (highlight.tipo === 'negativo') {
                      <span class="highlight-dot highlight-dot--negativo"></span>
                    } @else {
                      <span class="highlight-dot highlight-dot--neutro"></span>
                    }
                    {{ highlight.texto }}
                    <svg class="highlight-arrow" width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
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
      background: linear-gradient(135deg, var(--slate-50, #F8FAFC) 0%, var(--primary-orange-light, #FFF7ED) 50%, var(--bg-primary, #FFFFFF) 100%);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      transition: box-shadow 0.2s ease;
    }

    .ai-banner:hover {
      box-shadow: var(--shadow-md);
    }

    /* ── Main Layout ── */
    .ai-banner__main {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md, 16px);
      padding: 20px 24px;
    }

    /* ── AI Icon ── */
    .ai-banner__icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full, 9999px);
      background: linear-gradient(135deg, var(--primary-orange-lighter, #FFD6A7) 0%, var(--primary-orange, #F27920) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse-glow 3s ease-in-out infinite;
    }

    .sparkle-svg {
      filter: drop-shadow(0 0 3px rgba(242, 121, 32, 0.4));
    }

    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(242, 121, 32, 0.15);
      }
      50% {
        box-shadow: 0 0 12px 4px rgba(242, 121, 32, 0.2);
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
      color: var(--slate-900, #0F172B);
      margin: 0 0 6px 0;
      line-height: 1.3;
    }

    .ai-banner__text {
      font-size: 14px;
      color: var(--slate-600, #45556C);
      margin: 0 0 10px 0;
      line-height: 1.55;
    }

    /* ── Highlight Tags ── */
    .ai-banner__highlights {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm, 8px);
      margin-top: var(--spacing-xs, 4px);
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

    .highlight-tag--clickable {
      cursor: pointer;
      transition: filter 0.15s ease, transform 0.1s ease;
    }

    .highlight-tag--clickable:hover {
      filter: brightness(0.95);
      transform: translateY(-1px);
    }

    .highlight-arrow {
      opacity: 0;
      transition: opacity 0.15s ease;
      flex-shrink: 0;
    }

    .highlight-tag--clickable:hover .highlight-arrow {
      opacity: 1;
    }

    .highlight-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .highlight-tag--positivo {
      background: var(--success-bg, #ECFDF5);
      color: var(--success-text, #00A43D);
    }
    .highlight-dot--positivo {
      background: var(--success-color, #00A43D);
    }

    .highlight-tag--negativo {
      background: var(--danger-bg, #FEF2F2);
      color: var(--danger-text, #DC2626);
    }
    .highlight-dot--negativo {
      background: var(--danger-color, #EF4444);
    }

    .highlight-tag--neutro {
      background: var(--slate-100, #F1F5F9);
      color: var(--slate-600, #45556C);
    }
    .highlight-dot--neutro {
      background: var(--slate-400, #90A1B9);
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
      color: var(--primary-orange, #F27920);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: var(--radius-sm, 8px);
      transition: background 0.15s ease, color 0.15s ease;
      white-space: nowrap;
      margin-top: 2px;
    }

    .ai-banner__toggle:hover {
      background: var(--primary-orange-light, #FFF7ED);
      color: var(--primary-orange-hover, #E06A10);
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
      background: var(--border-color, #E2E8F0);
      margin-bottom: var(--spacing-md, 16px);
    }

    .details-text {
      font-size: 14px;
      color: var(--slate-600, #45556C);
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
      gap: var(--spacing-md, 16px);
      padding: 20px 24px;
      background: linear-gradient(135deg, var(--slate-50, #F8FAFC) 0%, var(--primary-orange-light, #FFF7ED) 50%, var(--bg-primary, #FFFFFF) 100%);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-lg, 14px);
    }

    .skeleton-icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--slate-200, #E2E8F0);
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
      background: var(--slate-200, #E2E8F0);
    }

    .skeleton-text {
      width: 100%;
      height: 14px;
      background: var(--slate-100, #F1F5F9);
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
        padding: var(--spacing-md, 16px);
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
  private readonly router = inject(Router);

  summary = input.required<AiSummary | null>();
  loading = input(false);
  expanded = signal(false);

  hasHighlights = computed(() => (this.summary()?.highlights?.length ?? 0) > 0);

  toggleExpanded(): void {
    this.expanded.update(v => !v);
  }

  navigateHighlight(highlight: AiHighlight): void {
    const text = highlight.texto.toLowerCase();
    if (text.includes('demanda') || text.includes('ventas') || text.includes('venta')) {
      this.router.navigateByUrl('/ventas');
    } else if (text.includes('precio') || text.includes('proveedor') || text.includes('costo') || text.includes('lácteo')) {
      this.router.navigateByUrl('/compras');
    } else if (text.includes('stock') || text.includes('insumo')) {
      this.router.navigateByUrl('/inventario');
    } else if (text.includes('produccion') || text.includes('partida') || text.includes('reforzar')) {
      this.router.navigateByUrl('/produccion');
    } else if (text.includes('menu') || text.includes('carta') || text.includes('producto')) {
      this.router.navigateByUrl('/carta');
    } else {
      this.router.navigateByUrl('/ventas');
    }
  }
}
