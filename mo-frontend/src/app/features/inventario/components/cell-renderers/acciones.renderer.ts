import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-acciones-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="acciones-cell">
      <button class="btn-action-edit" (click)="onEdit()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      @if (isActivo) {
        <button class="btn-action-toggle" (click)="onToggle()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
          </svg>
        </button>
      } @else {
        <button class="btn-action-activate" (click)="onToggle()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
          </svg>
        </button>
      }
    </div>
  `,
  styles: [`
    .acciones-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      justify-content: flex-end;
    }

    .btn-action-edit,
    .btn-action-toggle,
    .btn-action-activate {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      background: transparent;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      color: #6B7280;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-action-edit:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
    }

    .btn-action-toggle:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
    }

    .btn-action-activate {
      color: #10B981;
      border-color: #D1FAE5;
    }

    .btn-action-activate:hover {
      background: #D1FAE5;
      color: #059669;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccionesRendererComponent implements ICellRendererAngularComp {
  isActivo = true;
  private params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.isActivo = params.data?.activo ?? true;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.isActivo = params.data?.activo ?? true;
    return true;
  }

  onEdit(): void {
    if (this.params.context?.onEdit) {
      this.params.context.onEdit(this.params.data);
    }
  }

  onToggle(): void {
    if (this.params.context?.onToggle) {
      this.params.context.onToggle(this.params.data);
    }
  }
}
