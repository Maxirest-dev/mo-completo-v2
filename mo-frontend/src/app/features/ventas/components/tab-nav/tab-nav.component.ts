import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabVentas } from '../../models';

interface TabItem {
  key: TabVentas;
  label: string;
}

@Component({
  selector: 'app-tab-nav',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="tab-nav">
      @for (tab of tabs; track tab.key) {
        <button
          class="tab-btn"
          [class.tab-active]="tabActivo() === tab.key"
          (click)="tabChange.emit(tab.key)"
          type="button"
        >
          {{ tab.label }}
        </button>
      }
    </nav>
  `,
  styles: [`
    .tab-nav {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .tab-btn {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 20px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      background: white;
      color: #6B7280;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .tab-btn:hover:not(.tab-active) {
      background: #F9FAFB;
      color: #374151;
    }

    .tab-active {
      background: #1F2937;
      color: white;
      border-color: #1F2937;
    }
  `],
})
export class TabNavComponent {
  readonly tabActivo = input.required<TabVentas>();
  readonly tabChange = output<TabVentas>();

  readonly tabs: TabItem[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'formasCobro', label: 'Formas de cobro' },
    { key: 'conceptos', label: 'Conceptos' },
    { key: 'comprobantes', label: 'Comprobantes' },
    { key: 'articulos', label: 'Articulos' },
  ];
}
