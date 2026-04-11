import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alerta } from '../../models';

@Component({
  selector: 'app-alertas-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visibleAlertas().length > 0) {
      <div class="alertas-container" role="alert">
        @for (alerta of visibleAlertas(); track alerta.titulo) {
          <div class="alerta" [class]="'alerta alerta-' + alerta.severidad">
            <div class="alerta-icon">
              @switch (alerta.tipo) {
                @case ('food-cost') { 📊 }
                @case ('factura-vencida') { ⚠️ }
                @case ('merma') { 📉 }
                @case ('liquidez') { 💰 }
              }
            </div>
            <div class="alerta-content">
              <span class="alerta-titulo">{{ alerta.titulo }}</span>
              <span class="alerta-desc">{{ alerta.descripcion }}</span>
            </div>
            @if (alerta.valor) {
              <div class="alerta-values">
                <span class="alerta-valor">{{ alerta.valor }}</span>
                @if (alerta.umbral) {
                  <span class="alerta-umbral">Umbral: {{ alerta.umbral }}</span>
                }
              </div>
            }
            <button
              class="alerta-dismiss"
              (click)="dismiss(alerta)"
              type="button"
              [attr.aria-label]="'Descartar alerta: ' + alerta.titulo"
            >✕</button>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .alertas-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    .alerta {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .alerta-critica {
      background: #FEF2F2;
      border-color: #FECACA;
    }

    .alerta-alta {
      background: #FFF7ED;
      border-color: #FED7AA;
    }

    .alerta-media {
      background: #FEF3C7;
      border-color: #FDE68A;
    }

    .alerta-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    .alerta-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }

    .alerta-titulo {
      font-size: 13px;
      font-weight: 600;
      color: var(--slate-900, #111827);
    }

    .alerta-desc {
      font-size: 12px;
      color: var(--slate-600, #4B5563);
    }

    .alerta-values {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      flex-shrink: 0;
    }

    .alerta-valor {
      font-size: 16px;
      font-weight: 700;
      color: #EF4444;
    }

    .alerta-umbral {
      font-size: 10px;
      color: var(--slate-500, #6B7280);
    }

    .alerta-dismiss {
      font-size: 14px;
      color: var(--slate-400, #9CA3AF);
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      line-height: 1;
      border-radius: 4px;
      transition: all 0.15s;
      flex-shrink: 0;
    }

    .alerta-dismiss:hover {
      color: var(--slate-700, #374151);
      background: rgba(0,0,0,0.05);
    }
  `],
})
export class AlertasDashboardComponent {
  readonly alertas = input.required<Alerta[]>();
  readonly dismissed = signal<Set<string>>(new Set());

  visibleAlertas(): Alerta[] {
    const d = this.dismissed();
    return this.alertas().filter(a => !d.has(a.titulo));
  }

  dismiss(alerta: Alerta): void {
    this.dismissed.update(set => {
      const next = new Set(set);
      next.add(alerta.titulo);
      return next;
    });
  }
}
