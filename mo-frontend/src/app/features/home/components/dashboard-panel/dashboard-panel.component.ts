import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '@mro/shared-ui';

@Component({
  selector: 'app-dashboard-panel',
  standalone: true,
  imports: [LoadingSpinnerComponent, RouterLink],
  template: `
    <div class="dashboard-panel" [class]="panelClass()">
      <header class="panel-header">
        @if (icono()) {
          <span class="panel-icon">{{ icono() }}</span>
        }
        <h2 class="panel-title">{{ titulo() }}</h2>
        <div class="panel-actions">
          <ng-content select="[panel-actions]" />
          @if (headerLink()) {
            <a class="panel-link" [routerLink]="headerLink()" [queryParams]="headerLinkParams()">
              Ver todo
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          }
        </div>
      </header>

      <div class="panel-body">
        @if (loading()) {
          <app-loading-spinner size="md" />
        } @else {
          <ng-content />
        }
      </div>

      <footer class="panel-footer">
        <ng-content select="[panel-footer]" />
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .dashboard-panel {
      background: var(--bg-primary, #FFFFFF);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: 100%;
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm, 8px);
      padding: 16px 25px 12px;
      border-bottom: 1px solid var(--divider-color, #F1F5F9);
    }

    .panel-icon {
      font-size: 18px;
      line-height: 1;
      flex-shrink: 0;
    }

    .panel-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--slate-900, #0F172B);
      margin: 0;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .panel-actions {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .panel-link {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-orange, #F27920);
      text-decoration: none;
      padding: 4px 8px;
      border-radius: var(--radius-sm, 8px);
      transition: background 0.15s ease, color 0.15s ease;
      white-space: nowrap;
    }

    .panel-link:hover {
      background: var(--primary-orange-light, #FFF7ED);
      color: var(--primary-orange-hover, #E06A10);
    }

    .panel-body {
      flex: 1;
      padding: 16px 25px;
      min-height: 0;
      overflow-y: auto;
    }

    .panel-footer:empty {
      display: none;
    }

    .panel-footer {
      padding: 12px 25px;
      border-top: 1px solid var(--divider-color, #F1F5F9);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPanelComponent {
  titulo = input.required<string>();
  icono = input<string>();
  loading = input(false);
  panelClass = input('');
  headerLink = input<string>();
  headerLinkParams = input<Record<string, string>>({});
}
