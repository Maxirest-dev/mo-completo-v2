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
      gap: 4px;
      flex-wrap: wrap;
    }

    .tab-btn {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      padding: 10px 16px;
      border: none;
      border-bottom: 2px solid transparent;
      border-radius: var(--radius-sm, 8px) var(--radius-sm, 8px) 0 0;
      background: transparent;
      color: var(--slate-400, #90A1B9);
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .tab-btn:hover:not(.tab-active) {
      color: var(--slate-700, #314158);
      background-color: var(--slate-100, #F1F5F9);
    }

    .tab-active {
      color: var(--primary-orange, #F27920);
      border-bottom-color: var(--primary-orange, #F27920);
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
