import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { PrepItem, PrepPrioridad } from '../../models';

@Component({
  selector: 'app-prep-list',
  standalone: true,
  template: `
    <ul class="prep-list">
      @for (item of items(); track item.id) {
        <li class="prep-item" [class.completed]="item.completado">
          <label class="prep-checkbox-label">
            <input
              type="checkbox"
              class="prep-checkbox"
              [checked]="item.completado"
              (change)="onToggle(item.id)"
            />
            <span class="checkmark"></span>
          </label>

          <div class="prep-content">
            <span class="prep-task" [class.strikethrough]="item.completado">
              {{ item.tarea }}
            </span>
            @if (item.horaLimite) {
              <span class="prep-time">
                <svg class="time-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M8 4.5V8L10.5 9.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
                {{ item.horaLimite }}
              </span>
            }
          </div>

          <span class="priority-badge" [class]="'priority-' + item.prioridad.toLowerCase()">
            {{ prioridadLabel(item.prioridad) }}
          </span>
        </li>
      }
    </ul>
  `,
  styles: [`
    :host {
      display: block;
    }

    .prep-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .prep-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid var(--gray-100, #F3F4F6);
      transition: opacity 0.2s ease;
    }

    .prep-item:last-child {
      border-bottom: none;
    }

    .prep-item.completed {
      opacity: 0.6;
    }

    .prep-checkbox-label {
      position: relative;
      display: flex;
      align-items: center;
      cursor: pointer;
      flex-shrink: 0;
    }

    .prep-checkbox {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .checkmark {
      width: 18px;
      height: 18px;
      border: 1.5px solid var(--gray-300, #D1D5DB);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      background: #FFFFFF;
    }

    .prep-checkbox:checked + .checkmark {
      background: #3B82F6;
      border-color: #3B82F6;
    }

    .prep-checkbox:checked + .checkmark::after {
      content: '';
      display: block;
      width: 5px;
      height: 9px;
      border: solid #FFFFFF;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      margin-top: -1px;
    }

    .prep-content {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .prep-task {
      font-size: 13px;
      color: var(--gray-800, #1F2937);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .prep-task.strikethrough {
      text-decoration: line-through;
      color: var(--gray-400, #9CA3AF);
    }

    .prep-time {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
      color: var(--gray-500, #6B7280);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .time-icon {
      width: 12px;
      height: 12px;
      color: var(--gray-400, #9CA3AF);
    }

    .priority-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      white-space: nowrap;
      flex-shrink: 0;
      text-transform: capitalize;
    }

    .priority-alta {
      background: #FEE2E2;
      color: #DC2626;
    }

    .priority-media {
      background: #FEF3C7;
      color: #D97706;
    }

    .priority-baja {
      background: #D1FAE5;
      color: #059669;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrepListComponent {
  items = input.required<PrepItem[]>();
  itemToggled = output<string>();

  onToggle(itemId: string): void {
    this.itemToggled.emit(itemId);
  }

  prioridadLabel(prioridad: PrepPrioridad): string {
    const labels: Record<PrepPrioridad, string> = {
      'ALTA': 'Alta',
      'MEDIA': 'Media',
      'BAJA': 'Baja',
    };
    return labels[prioridad];
  }
}
