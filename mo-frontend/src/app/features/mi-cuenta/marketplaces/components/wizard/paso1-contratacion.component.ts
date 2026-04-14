import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MroCurrencyPipe } from '../../../../balances/pipes/currency.pipe';
import { Solucion } from '../../models/marketplaces.models';

@Component({
  selector: 'app-paso1-contratacion',
  standalone: true,
  imports: [MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Stepper -->
    <div class="pos-stepper">
      <div class="pos-step pos-step--active">
        <span class="pos-step-dot">1</span>
        <span class="pos-step-label">Información</span>
      </div>
      <span class="pos-step-line"></span>
      <div class="pos-step">
        <span class="pos-step-dot">2</span>
        <span class="pos-step-label">Configuración</span>
      </div>
      <span class="pos-step-line"></span>
      <div class="pos-step">
        <span class="pos-step-dot">3</span>
        <span class="pos-step-label">Confirmación</span>
      </div>
    </div>

    <!-- Hero -->
    <div class="pos-step-body">
      <div class="pos-hero-icon" [style.background]="solucion().iconColor">
        {{ solucion().iconText }}
      </div>
      <h2 class="pos-hero-title">{{ solucion().nombre }}</h2>
      <p class="pos-hero-desc">{{ solucion().descripcionLarga || solucion().descripcion }}</p>

      <!-- Price block -->
      <div class="pos-price-block">
        <span class="pos-price-label">Costo mensual por integración</span>
        <div class="pos-price-row">
          <span class="pos-price-currency">$</span>
          <span class="pos-price-amount">{{ formatPrice(solucion().precioMensual) }}</span>
          <span class="pos-price-period">/mes</span>
        </div>
      </div>

      <!-- Features -->
      @if (solucion().features?.length) {
        <div class="pos-features">
          @for (feature of solucion().features; track feature; let i = $index) {
            <div class="pos-feature">
              <span class="pos-feature-icon" aria-hidden="true">{{ featureIcons[i] || '✓' }}</span>
              <div class="pos-feature-text">
                <span class="pos-feature-title">{{ feature }}</span>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Footer -->
    <div class="dialog-sm-actions">
      <button class="btn btn-secondary" type="button" (click)="cancelar.emit()">Cancelar</button>
      <button class="btn btn-primary" type="button" (click)="contratar.emit()">Continuar</button>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; flex: 1; min-height: 0; }

    /* Stepper */
    .pos-stepper {
      display: flex; align-items: center; justify-content: center;
      gap: 0; padding: 24px 32px 0;
    }
    .pos-step { display: flex; align-items: center; gap: 8px; opacity: 0.4; }
    .pos-step--active { opacity: 1; }
    .pos-step--done { opacity: 0.7; }
    .pos-step-dot {
      width: 26px; height: 26px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700;
      background: var(--slate-200, #E2E8F0); color: var(--slate-500, #64748B);
    }
    .pos-step--active .pos-step-dot { background: var(--primary-blue, #1155CC); color: white; }
    .pos-step-label { font-size: 13px; font-weight: 500; color: var(--text-secondary, #64748B); }
    .pos-step--active .pos-step-label { color: var(--text-heading, #0F172B); }
    .pos-step-line { width: 40px; height: 2px; background: var(--slate-200, #E2E8F0); margin: 0 12px; }

    /* Hero */
    .pos-step-body { padding: 24px 32px 0; }
    .pos-hero-icon {
      display: flex; align-items: center; justify-content: center;
      width: 64px; height: 64px; border-radius: 16px;
      color: white; margin: 0 auto 16px; font-size: 28px; font-weight: 800;
    }
    .pos-hero-title {
      font-size: 20px; font-weight: 700; color: var(--text-heading, #0F172B);
      margin: 0 0 6px; text-align: center;
    }
    .pos-hero-desc {
      font-size: 14px; color: var(--text-secondary, #64748B);
      margin: 0 0 24px; line-height: 1.55; text-align: center;
    }

    /* Price */
    .pos-price-block {
      text-align: center; padding: 20px;
      background: var(--slate-50, #F8FAFC);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: 12px; margin-bottom: 24px;
    }
    .pos-price-label { font-size: 12px; font-weight: 500; color: var(--text-secondary, #64748B); display: block; margin-bottom: 6px; }
    .pos-price-row { display: flex; align-items: baseline; justify-content: center; gap: 2px; }
    .pos-price-currency { font-size: 18px; font-weight: 600; color: var(--text-heading, #0F172B); }
    .pos-price-amount { font-size: 36px; font-weight: 800; color: var(--text-heading, #0F172B); line-height: 1; letter-spacing: -0.02em; }
    .pos-price-period { font-size: 14px; color: var(--text-secondary, #64748B); margin-left: 2px; }

    /* Features */
    .pos-features { display: flex; flex-direction: column; gap: 14px; }
    .pos-feature { display: flex; align-items: flex-start; gap: 12px; }
    .pos-feature-icon { font-size: 18px; line-height: 1; flex-shrink: 0; width: 24px; text-align: center; margin-top: 1px; }
    .pos-feature-title { font-size: 13px; font-weight: 600; color: var(--text-heading, #0F172B); }

    /* Footer */
    .dialog-sm-actions {
      display: flex; justify-content: flex-end; gap: 12px; padding: 20px 32px 28px;
    }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 12px;
      padding: 8px 16px; font-size: 14px; font-weight: 500; font-family: inherit;
      border-radius: 8px; border: none; cursor: pointer; transition: all 0.15s ease;
    }
    .btn-primary { background: var(--primary-orange, #F18800); color: white; }
    .btn-primary:hover { background: var(--primary-orange-hover, #D97800); }
    .btn-secondary { background: white; color: var(--text-primary, #314158); border: 1px solid var(--border-color, #E2E8F0); }
    .btn-secondary:hover { background: var(--slate-50, #F8FAFC); }
  `],
})
export class Paso1ContratacionComponent {
  solucion = input.required<Solucion>();
  contratar = output<void>();
  cancelar = output<void>();

  readonly featureIcons = ['⚡', '📋', '🔄', '📊', '⏰', '🎁'];

  formatPrice(value: number): string {
    return value.toLocaleString('es-AR');
  }
}
