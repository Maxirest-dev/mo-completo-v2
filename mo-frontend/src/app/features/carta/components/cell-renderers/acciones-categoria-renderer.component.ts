import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CategoriaGridRow, GridActionEvent } from '../../models/categoria-grid.model';

@Component({
  selector: 'app-acciones-categoria-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="acciones-cell">
      <button class="btn-action btn-edit" (click)="onEdit($event)" title="Editar categoria">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        Editar
      </button>

      @if (isActivo()) {
        <button
          class="btn-action btn-deactivate"
          (click)="onDeactivate($event)"
          title="Desactivar categoria"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Desactivar
        </button>
      } @else {
        <button
          class="btn-action btn-activate"
          (click)="onActivate($event)"
          title="Activar categoria"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Activar
        </button>
      }

      <button class="btn-more" (click)="onMore($event)" title="Mas opciones">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .acciones-cell {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      height: 100%;
      padding-right: 8px;
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 6px;
      border: 1px solid var(--gray-200);
      background: white;
      color: var(--gray-700);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-action:hover {
      background: var(--gray-50);
      border-color: var(--gray-300);
    }

    .btn-action svg {
      width: 16px;
      height: 16px;
    }

    .btn-deactivate {
      color: #DC2626;
      border-color: #FECACA;
    }

    .btn-deactivate:hover {
      background: #FEF2F2;
      border-color: #FCA5A5;
    }

    .btn-activate {
      color: #059669;
      border-color: #A7F3D0;
    }

    .btn-activate:hover {
      background: #ECFDF5;
      border-color: #6EE7B7;
    }

    .btn-more {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--gray-500);
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.15s ease;
    }

    .btn-more:hover {
      background: var(--gray-100);
      color: var(--gray-700);
    }

    .btn-more svg {
      width: 20px;
      height: 20px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccionesCategoriaRendererComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams<CategoriaGridRow>;
  isActivo = signal(true);

  agInit(params: ICellRendererParams<CategoriaGridRow>): void {
    this.params = params;
    this.updateState();
  }

  refresh(params: ICellRendererParams<CategoriaGridRow>): boolean {
    this.params = params;
    this.updateState();
    return true;
  }

  private updateState(): void {
    if (this.params.data) {
      // Consider active if activo is true AND estado is not INACTIVO
      const data = this.params.data;
      this.isActivo.set(data.activo && data.estado !== 'INACTIVO');
    }
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    if (this.params.data && this.params.context?.onAction) {
      const actionEvent: GridActionEvent = {
        action: 'edit',
        type: 'categoria',
        data: this.params.data
      };
      this.params.context.onAction(actionEvent);
    }
  }

  onDeactivate(event: Event): void {
    event.stopPropagation();
    if (this.params.data && this.params.context?.onAction) {
      const actionEvent: GridActionEvent = {
        action: 'deactivate',
        type: 'categoria',
        data: this.params.data
      };
      this.params.context.onAction(actionEvent);
    }
  }

  onActivate(event: Event): void {
    event.stopPropagation();
    if (this.params.data && this.params.context?.onAction) {
      const actionEvent: GridActionEvent = {
        action: 'activate',
        type: 'categoria',
        data: this.params.data
      };
      this.params.context.onAction(actionEvent);
    }
  }

  onMore(event: Event): void {
    event.stopPropagation();
    // Future: Show dropdown menu with more options
    console.log('More options for:', this.params.data?.nombre);
  }
}
