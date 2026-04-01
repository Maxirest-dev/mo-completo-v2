import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasFacade } from '../../state/compras.facade';

@Component({
  selector: 'app-rubros-grid',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid-table">
      <div class="grid-header">
        <div class="grid-col grid-col--nombre">Nombre</div>
        <div class="grid-col grid-col--acciones">Acciones</div>
      </div>
      @for (rubro of facade.rubros(); track rubro.id) {
        <div class="grid-row">
          <div class="grid-col grid-col--nombre">{{ rubro.nombre }}</div>
          <div class="grid-col grid-col--acciones">
            <button class="btn-action" (click)="editarClick.emit(rubro.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
          </div>
        </div>
      } @empty {
        <div class="grid-empty">No hay rubros creados</div>
      }
    </div>
  `,
  styles: [`
    .grid-table {
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: white;
    }

    .grid-header {
      display: flex;
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      padding: 10px 16px;
      font-size: 12px;
      font-weight: 600;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .grid-row {
      display: flex;
      padding: 12px 16px;
      border-bottom: 1px solid var(--gray-100);
      align-items: center;
      font-size: 14px;
      color: var(--gray-700);

      &:last-child { border-bottom: none; }
      &:hover { background: var(--gray-50); }
    }

    .grid-col--nombre { flex: 1; }
    .grid-col--acciones { width: 120px; text-align: right; }

    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      font-size: 12px;
      font-family: inherit;
      font-weight: 500;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      background: white;
      color: var(--gray-600);
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: var(--gray-50);
        border-color: var(--gray-300);
      }
    }

    .grid-empty {
      padding: 24px;
      text-align: center;
      color: var(--gray-400);
      font-size: 14px;
    }
  `]
})
export class RubrosGridComponent {
  facade = inject(ComprasFacade);
  editarClick = output<number>();
}
