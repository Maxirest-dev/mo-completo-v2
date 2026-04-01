import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ConfirmDialogType = 'desactivar' | 'activar' | 'eliminar';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible()) {
      <div class="dialog-overlay" (click)="onOverlayClick($event)">
        <div class="dialog-container" role="dialog" aria-modal="true" [attr.aria-labelledby]="'dialog-title'">
          <div class="dialog-header">
            <div
              class="dialog-icon"
              [class.dialog-icon-warning]="tipo() === 'desactivar' || tipo() === 'eliminar'"
              [class.dialog-icon-success]="tipo() === 'activar'"
            >
              @if (tipo() === 'desactivar' || tipo() === 'eliminar') {
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              }
            </div>
          </div>

          <div class="dialog-body">
            <h3 id="dialog-title" class="dialog-title">{{ titulo() }}</h3>
            <p class="dialog-message">{{ mensaje() }}</p>
          </div>

          <div class="dialog-footer">
            <button
              type="button"
              class="btn btn-cancel"
              (click)="onCancelar()"
              [disabled]="isLoading()"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-confirm"
              [class.btn-danger]="tipo() === 'desactivar' || tipo() === 'eliminar'"
              [class.btn-success]="tipo() === 'activar'"
              (click)="onConfirmar()"
              [disabled]="isLoading()"
            >
              @if (isLoading()) {
                <span class="spinner-small"></span>
              }
              {{ getConfirmButtonText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .dialog-container {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 420px;
      margin: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                  0 10px 10px -5px rgba(0, 0, 0, 0.04);
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .dialog-header {
      display: flex;
      justify-content: center;
      padding: 24px 24px 0;
    }

    .dialog-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dialog-icon svg {
      width: 28px;
      height: 28px;
    }

    .dialog-icon-warning {
      background: #FEF3C7;
      color: #D97706;
    }

    .dialog-icon-success {
      background: #D1FAE5;
      color: #059669;
    }

    .dialog-body {
      padding: 16px 24px 24px;
      text-align: center;
    }

    .dialog-title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-800);
    }

    .dialog-message {
      margin: 0;
      font-size: 14px;
      color: var(--gray-600);
      line-height: 1.5;
    }

    .dialog-footer {
      display: flex;
      gap: 12px;
      padding: 0 24px 24px;
      justify-content: center;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
      min-width: 100px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-cancel {
      background: white;
      border: 1px solid var(--gray-300);
      color: var(--gray-700);
    }

    .btn-cancel:hover:not(:disabled) {
      background: var(--gray-50);
      border-color: var(--gray-400);
    }

    .btn-confirm {
      color: white;
    }

    .btn-danger {
      background: #DC2626;
    }

    .btn-danger:hover:not(:disabled) {
      background: #B91C1C;
    }

    .btn-success {
      background: #059669;
    }

    .btn-success:hover:not(:disabled) {
      background: #047857;
    }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  // Inputs
  titulo = input.required<string>();
  mensaje = input.required<string>();
  tipo = input<ConfirmDialogType>('desactivar');
  visible = input<boolean>(true);

  // Outputs
  confirmar = output<void>();
  cancelar = output<void>();

  // Internal state
  isLoading = signal(false);

  private escapeListener?: (e: KeyboardEvent) => void;

  ngOnInit(): void {
    // Listen for escape key
    this.escapeListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !this.isLoading()) {
        this.onCancelar();
      }
    };
    document.addEventListener('keydown', this.escapeListener);
  }

  ngOnDestroy(): void {
    if (this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener);
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-overlay') && !this.isLoading()) {
      this.onCancelar();
    }
  }

  onConfirmar(): void {
    this.isLoading.set(true);
    this.confirmar.emit();
  }

  onCancelar(): void {
    if (!this.isLoading()) {
      this.cancelar.emit();
    }
  }

  getConfirmButtonText(): string {
    switch (this.tipo()) {
      case 'activar':
        return 'Activar';
      case 'desactivar':
        return 'Desactivar';
      case 'eliminar':
        return 'Eliminar';
      default:
        return 'Confirmar';
    }
  }

  // Public method to reset loading state (called from parent)
  resetLoading(): void {
    this.isLoading.set(false);
  }
}
