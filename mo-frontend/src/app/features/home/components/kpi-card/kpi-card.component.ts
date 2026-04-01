import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';

import { KpiData } from '../../models/kpi.model';
import { KpiRenderStrategy, KpiComparisonBadge } from './kpi-strategies';
import { TrendIndicatorComponent } from '@mro/shared-ui';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [TrendIndicatorComponent],
  template: `
    <div class="kpi-card" [class]="strategy().getCssClass()">
      <h3 class="kpi-title">{{ data().titulo }}</h3>
      <span class="kpi-value">{{ formattedValue() }}</span>

      @switch (templateId()) {
        @case ('sparkline') {
          <div class="sparkline-container">
            <svg class="sparkline" viewBox="0 0 120 32" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--sparkline-color, #6366F1)" stop-opacity="0.2"/>
                  <stop offset="100%" stop-color="var(--sparkline-color, #6366F1)" stop-opacity="0.02"/>
                </linearGradient>
              </defs>
              <path
                d="M0,28 L10,24 L20,26 L30,20 L40,22 L50,16 L60,18 L70,12 L80,14 L90,8 L100,10 L110,4 L120,6"
                fill="none"
                stroke="var(--sparkline-color, #6366F1)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M0,28 L10,24 L20,26 L30,20 L40,22 L50,16 L60,18 L70,12 L80,14 L90,8 L100,10 L110,4 L120,6 L120,32 L0,32 Z"
                fill="url(#sparkFill)"
              />
            </svg>
          </div>
        }
        @case ('heatbar') {
          <div class="heatbar-container">
            <div class="heatbar-track">
              <div class="heatbar-fill" [style.width.%]="heatbarWidth()"></div>
              <div class="heatbar-segments">
                @for (i of heatbarSegments; track i) {
                  <div class="heatbar-segment"></div>
                }
              </div>
            </div>
          </div>
        }
        @case ('gauge') {
          <div class="gauge-container">
            <svg class="gauge-svg" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#10B981"/>
                  <stop offset="40%" stop-color="#FBBF24"/>
                  <stop offset="70%" stop-color="#F97316"/>
                  <stop offset="100%" stop-color="#7C3AED"/>
                </linearGradient>
              </defs>
              <!-- Background track -->
              <circle
                class="gauge-bg"
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#E5E7EB"
                stroke-width="8"
                stroke-dasharray="226.2 251.3"
                stroke-dashoffset="-12.6"
                stroke-linecap="round"
                transform="rotate(135, 50, 50)"
              />
              <!-- Filled arc -->
              <circle
                class="gauge-fill"
                cx="50" cy="50" r="40"
                fill="none"
                stroke="url(#gaugeGrad)"
                stroke-width="8"
                [attr.stroke-dasharray]="gaugeDashArray()"
                stroke-dashoffset="-12.6"
                stroke-linecap="round"
                transform="rotate(135, 50, 50)"
              />
              <!-- Center value text -->
              <text
                x="50" y="54"
                text-anchor="middle"
                class="gauge-text"
                font-size="18"
                font-weight="700"
                fill="#1F2937"
              >
                {{ formattedValue() }}
              </text>
            </svg>
          </div>
        }
        @case ('trend-arrow') {
          <div class="trend-container">
            <app-trend-indicator
              [valor]="data().variacion.valor"
              [direccion]="data().variacion.direccion"
              [periodo]="data().variacion.periodo"
            />
          </div>
        }
      }

      @if (badge(); as b) {
        <span class="kpi-badge" [class]="b.cssClass">{{ b.text }}</span>
      }
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex: 1;
      min-height: 0;
    }

    .kpi-card {
      background: #FFFFFF;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      transition: box-shadow 0.2s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
      }
    }

    .kpi-title {
      margin: 0;
      font-size: 13px;
      font-weight: 500;
      color: #6B7280;
      letter-spacing: 0.01em;
      line-height: 1.2;
    }

    .kpi-value {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    // --- Sparkline ---
    .sparkline-container {
      flex: 1;
      min-height: 32px;
      margin-top: 4px;
    }

    .sparkline {
      width: 100%;
      height: 32px;
      display: block;
    }

    // --- Heatbar ---
    .heatbar-container {
      margin-top: 8px;
    }

    .heatbar-track {
      position: relative;
      height: 10px;
      border-radius: 5px;
      background: #F3F4F6;
      overflow: hidden;
    }

    .heatbar-fill {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 5px;
      background: linear-gradient(90deg, #10B981 0%, #FBBF24 50%, #EF4444 100%);
      transition: width 0.6s ease;
    }

    .heatbar-segments {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      gap: 2px;
    }

    .heatbar-segment {
      flex: 1;
      background: transparent;
      border-right: 2px solid rgba(255, 255, 255, 0.5);

      &:last-child {
        border-right: none;
      }
    }

    // --- Gauge ---
    .gauge-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      min-height: 80px;
      margin-top: -4px;
    }

    .gauge-svg {
      width: 100px;
      height: 100px;
    }

    .gauge-text {
      font-family: inherit;
    }

    // --- Trend Arrow ---
    .trend-container {
      margin-top: 8px;
    }

    // --- Badge ---
    .kpi-badge {
      display: inline-block;
      font-size: 12px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 4px;
      margin-top: auto;
      width: fit-content;
    }

    .badge-positive {
      color: #059669;
      background: #ECFDF5;
    }

    .badge-negative {
      color: #DC2626;
      background: #FEF2F2;
    }

    .badge-warning {
      color: #D97706;
      background: #FFFBEB;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {

  data = input.required<KpiData>();
  strategy = input.required<KpiRenderStrategy>();

  formattedValue = computed(() => this.strategy().formatValue(this.data().valor));

  templateId = computed(() => this.strategy().getTemplateId());

  badge = computed<KpiComparisonBadge | null>(() =>
    this.strategy().getComparisonBadge(this.data().variacion)
  );

  /**
   * Heatbar fill width: maps the KPI value (0-100 range) to percentage width.
   * For food cost, a higher value fills more of the bar.
   */
  heatbarWidth = computed(() => {
    const val = this.data().valor;
    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, (val / 50) * 100));
  });

  /**
   * Gauge arc: 270-degree arc (3/4 circle).
   * Total arc circumference for r=40: 2 * PI * 40 = 251.3
   * 270 degrees = 75% of circumference = 251.3 * 0.75 = 188.5 (visible arc)
   * Remaining gap = 251.3 * 0.25 = 62.8
   */
  gaugeDashArray = computed(() => {
    const percentage = Math.max(0, Math.min(100, this.data().valor));
    const totalArc = 251.3 * 0.9; // ~270 degrees of the circle
    const filled = (percentage / 100) * totalArc;
    const gap = 251.3 - filled;
    return `${filled} ${gap}`;
  });

  /** 12 segments for the heatbar visual dividers */
  readonly heatbarSegments = Array.from({ length: 12 }, (_, i) => i);
}
