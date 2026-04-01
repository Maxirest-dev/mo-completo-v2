import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-compras-placeholder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="placeholder-container">
      <div class="placeholder-card">
        <div class="placeholder-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" width="64" height="64">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </div>
        <h1 class="placeholder-title">Gestion de Compras</h1>
        <p class="placeholder-subtitle">Esta seccion se encuentra en desarrollo</p>
        <div class="placeholder-features">
          <div class="feature-item">
            <span class="feature-dot"></span>
            <span>Ordenes de compra</span>
          </div>
          <div class="feature-item">
            <span class="feature-dot"></span>
            <span>Proveedores</span>
          </div>
          <div class="feature-item">
            <span class="feature-dot"></span>
            <span>Rubros y conceptos de gasto</span>
          </div>
          <div class="feature-item">
            <span class="feature-dot"></span>
            <span>Proyeccion de pagos</span>
          </div>
        </div>
        <span class="placeholder-badge">Proximamente</span>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-container {
      display: flex; align-items: center; justify-content: center; min-height: 500px;
    }
    .placeholder-card {
      display: flex; flex-direction: column; align-items: center; gap: 16px;
      background: white; border: 1px solid var(--slate-200); border-radius: 16px;
      padding: 48px 64px; text-align: center; max-width: 440px;
    }
    .placeholder-icon { color: var(--slate-300); }
    .placeholder-title {
      font-size: 24px; font-weight: 700; color: var(--text-heading); margin: 0;
    }
    .placeholder-subtitle {
      font-size: 14px; color: var(--slate-400); margin: 0;
    }
    .placeholder-features {
      display: flex; flex-direction: column; gap: 10px; align-items: flex-start;
      padding: 16px 0; width: 100%;
    }
    .feature-item {
      display: flex; align-items: center; gap: 10px;
      font-size: 14px; color: var(--slate-500);
    }
    .feature-dot {
      width: 6px; height: 6px; border-radius: 50%; background: var(--primary-orange); flex-shrink: 0;
    }
    .placeholder-badge {
      display: inline-flex; padding: 6px 20px; font-size: 13px; font-weight: 600;
      color: var(--primary-orange); background: #FFF7ED; border: 1px solid #FDBA74;
      border-radius: var(--radius-md);
    }
  `],
})
export class ComprasPlaceholderComponent {}
