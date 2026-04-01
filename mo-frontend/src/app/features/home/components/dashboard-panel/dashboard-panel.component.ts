import {
  Component,
  ChangeDetectionStrategy,
  input,
  contentChild,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import { LoadingSpinnerComponent } from '@mro/shared-ui';

@Component({
  selector: 'app-dashboard-panel',
  standalone: true,
  imports: [LoadingSpinnerComponent],
  template: `
    <div class="dashboard-panel" [class]="panelClass()">
      <header class="panel-header">
        @if (icono()) {
          <span class="panel-icon">{{ icono() }}</span>
        }
        <h2 class="panel-title">{{ titulo() }}</h2>
        <div class="panel-actions">
          <ng-content select="[panel-actions]" />
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
}
