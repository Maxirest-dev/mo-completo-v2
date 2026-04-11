import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabPersonal } from '../../models';

interface TabItem { key: TabPersonal; label: string; }

@Component({
  selector: 'app-personal-tab-nav',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="tab-nav" role="tablist" aria-label="Secciones de personal">
      @for (tab of tabs; track tab.key) {
        <button class="tab-btn" role="tab"
          [class.tab-active]="tabActivo() === tab.key"
          [attr.aria-selected]="tabActivo() === tab.key"
          [attr.aria-controls]="'tabpanel-' + tab.key"
          [id]="'tab-' + tab.key"
          (click)="tabChange.emit(tab.key)" type="button"
        >{{ tab.label }}</button>
      }
    </nav>
  `,
  styles: [`
    .tab-nav { display: flex; gap: 4px; flex-wrap: wrap; }
    .tab-btn {
      font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
      padding: 10px 16px; border: none; border-bottom: 2px solid transparent;
      border-radius: 8px 8px 0 0; background: transparent;
      color: var(--slate-400, #90A1B9); cursor: pointer;
      transition: all 0.2s ease; white-space: nowrap;
    }
    .tab-btn:hover:not(.tab-active) { color: var(--slate-700, #314158); background-color: var(--slate-100, #F1F5F9); }
    .tab-active { color: var(--primary-orange, #F27920); border-bottom-color: var(--primary-orange, #F27920); }
  `],
})
export class PersonalTabNavComponent {
  readonly tabActivo = input.required<TabPersonal>();
  readonly tabChange = output<TabPersonal>();
  readonly tabs: TabItem[] = [
    { key: 'staff', label: 'Staff' },
    { key: 'fichaje', label: 'Fichaje' },
    { key: 'tareas', label: 'Tareas' },
    { key: 'liquidacion', label: 'Liquidación' },
    { key: 'mas', label: 'Más' },
  ];
}
