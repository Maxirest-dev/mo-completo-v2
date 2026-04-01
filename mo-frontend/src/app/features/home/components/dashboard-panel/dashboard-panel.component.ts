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
      background: #FFFFFF;
      border: 1px solid var(--gray-200, #E5E7EB);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: 100%;
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 20px 12px;
      border-bottom: 1px solid var(--gray-100, #F3F4F6);
    }

    .panel-icon {
      font-size: 18px;
      line-height: 1;
      flex-shrink: 0;
    }

    .panel-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-900, #111827);
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
      padding: 16px 20px;
      min-height: 0;
      overflow-y: auto;
    }

    .panel-footer:empty {
      display: none;
    }

    .panel-footer {
      padding: 12px 20px;
      border-top: 1px solid var(--gray-100, #F3F4F6);
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
