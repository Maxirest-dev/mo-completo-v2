import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
} from '@angular/core';
import { RentabilityAlert, RentabilityAlertSeveridad } from '../../models';
import { DashboardPanelComponent } from '../dashboard-panel';

@Component({
  selector: 'app-rentability-alerts',
  standalone: true,
  imports: [DashboardPanelComponent],
  template: `
    <app-dashboard-panel
      titulo="Alertas de Rentabilidad (BI + IA)"
      icono="🔔"
      [loading]="loading()"
      panelClass="rentability-panel"
    >
      <div class="rentability-alerts">
        @if (visibleAlerts().length === 0) {
          <div class="empty-state">
            <span class="empty-icon" aria-hidden="true">&#10003;</span>
            <p class="empty-text">No hay alertas de rentabilidad activas</p>
          </div>
        } @else {
          @for (alert of visibleAlerts(); track alert.id; let last = $last) {
            <article
              class="alert-item"
              [class.alert-item--critical]="alert.severidad === 'CRITICAL'"
              [class.alert-item--warning]="alert.severidad === 'WARNING'"
              [class.alert-item--info]="alert.severidad === 'INFO'"
            >
              <div class="alert-icon" aria-hidden="true">
                {{ severityIcon(alert.severidad) }}
              </div>
              <div class="alert-content">
                <h3 class="alert-title">{{ alert.titulo }}</h3>
                <p class="alert-description">{{ alert.descripcion }}</p>
                <p class="alert-suggestion">
                  <span class="suggestion-prefix">IA sugiere:</span>
                  {{ stripIaSugiere(alert.sugerencia) }}
                </p>
              </div>
            </article>
            @if (!last) {
              <hr class="alert-separator" />
            }
          }

          @if (hasMore()) {
            <button
              type="button"
              class="ver-mas-btn"
              (click)="toggleShowAll()"
            >
              {{ showAll() ? 'Ver menos' : 'Ver mas (' + remainingCount() + ' alertas)' }}
              <svg
                class="ver-mas-chevron"
                [class.ver-mas-chevron--up]="showAll()"
                width="14"
                height="14"
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
          }
        }
      </div>
    </app-dashboard-panel>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* ── Alert List ── */
    .rentability-alerts {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* ── Alert Item ── */
    .alert-item {
      display: flex;
      gap: 12px;
      padding: 12px 0;
      border-left: 3px solid transparent;
      padding-left: 12px;
      border-radius: 4px;
    }

    .alert-item--critical {
      border-left-color: var(--danger-color, #EF4444);
    }

    .alert-item--warning {
      border-left-color: var(--warning-color, #F59E0B);
    }

    .alert-item--info {
      border-left-color: var(--primary-orange, #F27920);
    }

    /* ── Icon ── */
    .alert-icon {
      flex-shrink: 0;
      font-size: 20px;
      line-height: 1.4;
      width: 28px;
      text-align: center;
    }

    /* ── Content ── */
    .alert-content {
      flex: 1;
      min-width: 0;
    }

    .alert-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--slate-900, #0F172B);
      margin: 0 0 4px 0;
      line-height: 1.35;
    }

    .alert-description {
      font-size: 13px;
      color: var(--slate-600, #45556C);
      margin: 0 0 6px 0;
      line-height: 1.55;
    }

    .alert-suggestion {
      font-size: 13px;
      font-style: italic;
      color: var(--slate-500, #64748B);
      margin: 0;
      line-height: 1.55;
    }

    .suggestion-prefix {
      font-weight: 600;
      font-style: italic;
      color: var(--primary-orange, #F27920);
    }

    /* ── Separator ── */
    .alert-separator {
      border: none;
      height: 1px;
      background: var(--divider-color, #F1F5F9);
      margin: 0;
    }

    /* ── Empty State ── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px;
      gap: var(--spacing-sm, 8px);
    }

    .empty-icon {
      font-size: 28px;
      color: var(--success-color, #00A43D);
    }

    .empty-text {
      font-size: 14px;
      color: var(--slate-400, #90A1B9);
      margin: 0;
    }

    /* ── Ver Mas Button ── */
    .ver-mas-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      background: none;
      border: none;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-orange, #F27920);
      cursor: pointer;
      padding: 10px 8px 2px;
      border-radius: var(--radius-sm, 8px);
      transition: background 0.15s ease, color 0.15s ease;
      width: 100%;
    }

    .ver-mas-btn:hover {
      background: var(--primary-orange-light, #FFF7ED);
      color: var(--primary-orange-hover, #E06A10);
    }

    .ver-mas-chevron {
      transition: transform 0.2s ease;
    }

    .ver-mas-chevron--up {
      transform: rotate(180deg);
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .alert-item {
        gap: 8px;
        padding-left: 8px;
      }

      .alert-icon {
        font-size: 18px;
        width: 24px;
      }

      .alert-title {
        font-size: 14px;
      }

      .alert-description,
      .alert-suggestion {
        font-size: 12px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RentabilityAlertsComponent {

  /** List of rentability alerts from BI + IA engine */
  alerts = input.required<RentabilityAlert[]>();

  /** Whether the component is in a loading state */
  loading = input(false);

  /** Maximum alerts to show before "Ver mas" */
  private readonly MAX_VISIBLE = 3;

  /** Toggle to show all alerts */
  showAll = signal(false);

  /** Whether there are more alerts than the visible limit */
  hasMore = computed(() => this.alerts().length > this.MAX_VISIBLE);

  /** Number of remaining hidden alerts */
  remainingCount = computed(() => Math.max(0, this.alerts().length - this.MAX_VISIBLE));

  /** The alerts to display (limited or all) */
  visibleAlerts = computed(() => {
    const all = this.alerts();
    return this.showAll() ? all : all.slice(0, this.MAX_VISIBLE);
  });

  /** Map severity to a visual icon */
  severityIcon(severidad: RentabilityAlertSeveridad): string {
    const icons: Record<RentabilityAlertSeveridad, string> = {
      CRITICAL: '\u26A0\uFE0F',
      WARNING: '\uD83D\uDFE1',
      INFO: '\uD83D\uDCA1',
    };
    return icons[severidad];
  }

  /** Strip the "IA sugiere:" prefix if present, since we render it separately */
  stripIaSugiere(sugerencia: string): string {
    return sugerencia.replace(/^IA sugiere:\s*/i, '');
  }

  /** Toggle show all alerts */
  toggleShowAll(): void {
    this.showAll.update(v => !v);
  }
}
