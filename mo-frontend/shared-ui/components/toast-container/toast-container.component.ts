import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div
          class="toast"
          [class.toast-success]="notification.type === 'success'"
          [class.toast-error]="notification.type === 'error'"
          [class.toast-warning]="notification.type === 'warning'"
          [class.toast-info]="notification.type === 'info'"
        >
          <div class="toast-icon">
            @switch (notification.type) {
              @case ('success') {
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              }
              @case ('error') {
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              }
              @case ('warning') {
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              }
              @case ('info') {
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
              }
            }
          </div>
          <span class="toast-message">{{ notification.message }}</span>
          <button
            class="toast-close"
            (click)="notificationService.remove(notification.id)"
            aria-label="Cerrar notificacion"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: white;
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-lg);
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-success {
      border-left-color: var(--success-color, #00A43D);
    }

    .toast-success .toast-icon {
      color: var(--success-color, #00A43D);
    }

    .toast-error {
      border-left-color: #EF4444;
    }

    .toast-error .toast-icon {
      color: #EF4444;
    }

    .toast-warning {
      border-left-color: #F59E0B;
    }

    .toast-warning .toast-icon {
      color: #F59E0B;
    }

    .toast-info {
      border-left-color: #3B82F6;
    }

    .toast-info .toast-icon {
      color: #3B82F6;
    }

    .toast-icon {
      flex-shrink: 0;
    }

    .toast-icon svg {
      width: 20px;
      height: 20px;
    }

    .toast-message {
      flex: 1;
      font-size: 14px;
      color: var(--gray-700);
      line-height: 1.4;
    }

    .toast-close {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--gray-400);
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.15s ease;
    }

    .toast-close:hover {
      background: var(--gray-100);
      color: var(--gray-600);
    }

    .toast-close svg {
      width: 16px;
      height: 16px;
    }
  `]
})
export class ToastContainerComponent {
  protected notificationService = inject(NotificationService);
}
