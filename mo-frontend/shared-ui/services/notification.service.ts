import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notifications = signal<Notification[]>([]);
  notifications = this._notifications.asReadonly();

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  show(message: string, type: Notification['type'] = 'info', duration = 4000): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      duration,
    };

    this._notifications.update((notifications: Notification[]) => [...notifications, notification]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }

    // Also log to console for debugging
    const logMethod = type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'log';
    console[logMethod](`[${type.toUpperCase()}] ${message}`);
  }

  success(message: string, duration = 4000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 4000): void {
    this.show(message, 'info', duration);
  }

  remove(id: string): void {
    this._notifications.update((notifications: Notification[]) =>
      notifications.filter((n: Notification) => n.id !== id)
    );
  }

  clear(): void {
    this._notifications.set([]);
  }
}
