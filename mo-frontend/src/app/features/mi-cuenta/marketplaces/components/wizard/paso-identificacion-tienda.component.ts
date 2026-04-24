import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { IdentificacionTienda, Sucursal, TipoIdentificacionTienda } from '../../models/marketplaces.models';
import { WizardStepperComponent } from './wizard-stepper.component';

@Component({
  selector: 'app-paso-identificacion-tienda',
  standalone: true,
  imports: [WizardStepperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-wizard-stepper [steps]="stepLabels" [activeIndex]="1" />

    <!-- Body -->
    <div class="paso-body">
      <h3 class="paso-heading">Identificá tu tienda en Pedidos Ya</h3>
      <p class="paso-subheading">Seleccioná la sucursal que operará con Pedidos Ya y vinculá o creá su tienda.</p>

      <!-- Selector de sucursal -->
      <div class="sucursal-section">
        <label for="sucursal" class="sucursal-label">Sucursal a contratar</label>
        <select
          id="sucursal"
          class="sucursal-select"
          [value]="identificacion().sucursal?.id ?? ''"
          (change)="onSucursalChange($event)">
          <option value="" disabled>Seleccioná una sucursal...</option>
          @for (s of sucursales(); track s.id) {
            <option [value]="s.id">{{ s.codigo }} · {{ s.nombre }}</option>
          }
        </select>
      </div>

      <div
        class="option-cards"
        [class.option-cards--disabled]="identificacion().sucursal === null">
        <!-- Opción: tienda existente -->
        <div
          class="option-card"
          [class.option-card--selected]="identificacion().tipo === 'existente'"
          (click)="onSelectTipo('existente')">
          <div class="option-indicator"></div>
          <div class="option-content">
            <div class="option-title">Ya tengo una tienda</div>
            <div class="option-description">Vinculá tu tienda actual ingresando su ID.</div>
          </div>
        </div>

        <!-- Opción: crear tienda nueva -->
        <div
          class="option-card"
          [class.option-card--selected]="identificacion().tipo === 'nueva'"
          (click)="onSelectTipo('nueva')">
          <div class="option-indicator"></div>
          <div class="option-content">
            <div class="option-title">Creala ahora</div>
            <div class="option-description">Generamos una tienda nueva con tu catálogo de Maxirest.</div>
          </div>
        </div>
      </div>

      <!-- Extra: input + warning cuando eligió tienda existente -->
      @if (identificacion().tipo === 'existente') {
        <div class="option-extra-panel">
          <label for="id-tienda" class="input-label">ID de tienda en Pedidos Ya</label>
          <input
            id="id-tienda"
            type="text"
            class="id-input"
            placeholder="Ej: 1234567"
            [value]="identificacion().idTienda"
            (input)="onIdTiendaInput($event)" />

          <div class="warning-inline">
            <span class="warning-inline-icon">&#9888;</span>
            <div class="warning-inline-text">
              <strong>Atención:</strong> al finalizar la contratación, el catálogo actual de tu tienda en Pedidos Ya será reemplazado por el catálogo configurado en Maxirest.
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Footer -->
    <div class="dialog-sm-actions">
      <button class="btn btn-secondary" type="button" (click)="volver.emit()">Volver</button>
      <button
        class="btn btn-primary"
        type="button"
        [disabled]="!identificacionValida()"
        (click)="continuar.emit()">
        Continuar
      </button>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; flex: 1; min-height: 0; }

    /* Body */
    .paso-body { padding: 24px 32px 0; flex: 1; overflow-y: auto; }
    .paso-heading {
      font-size: 18px; font-weight: 700; color: var(--text-heading, #0F172B);
      margin: 0 0 6px; text-align: center;
    }
    .paso-subheading {
      font-size: 13px; color: var(--text-secondary, #64748B);
      margin: 0 0 24px; line-height: 1.55; text-align: center;
    }

    /* Sucursal selector */
    .sucursal-section {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-color, #E2E8F0);
    }
    .sucursal-label {
      display: block;
      font-size: 13px; font-weight: 600;
      color: var(--text-heading, #0F172B);
      margin-bottom: 8px;
    }
    .sucursal-select {
      width: 100%;
      padding: 9px 12px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-heading, #0F172B);
      background: white;
      border: 1px solid var(--slate-300, #CBD5E1);
      border-radius: 8px;
      outline: none;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3e%3cpath d='m6 9 6 6 6-6'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .sucursal-select:focus {
      border-color: var(--primary-orange, #F18800);
      box-shadow: 0 0 0 3px rgba(241, 136, 0, 0.15);
    }

    /* Option cards */
    .option-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      align-items: stretch;
      transition: opacity 0.15s ease;
    }
    .option-cards--disabled { opacity: 0.5; pointer-events: none; }

    .option-card {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 16px;
      background: white;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .option-card:hover {
      border-color: var(--slate-300, #CBD5E1);
      background: var(--slate-50, #F8FAFC);
    }
    .option-card--selected {
      border-color: var(--primary-orange, #F18800);
      background: #FFF7ED;
    }
    .option-card--selected:hover { background: #FFF7ED; }

    .option-indicator {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--slate-300, #CBD5E1);
      background: white;
      flex-shrink: 0; margin-top: 2px;
      position: relative;
    }
    .option-card--selected .option-indicator {
      border-color: var(--primary-orange, #F18800);
    }
    .option-card--selected .option-indicator::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--primary-orange, #F18800);
    }

    .option-content { flex: 1; min-width: 0; }
    .option-title {
      font-size: 14px; font-weight: 600;
      color: var(--text-heading, #0F172B);
      margin-bottom: 4px;
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    }
    .option-description {
      font-size: 13px; color: var(--text-secondary, #64748B);
      line-height: 1.5;
    }
    .badge-recomendado {
      font-size: 10px; font-weight: 600;
      color: var(--accent-orange, #F18800);
      background: #FFF7ED;
      border: 1px solid #FED7AA;
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    /* Input + warning panel (debajo de las cards) */
    .option-extra-panel {
      margin-top: 16px;
      padding: 16px;
      background: var(--slate-50, #F8FAFC);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: 12px;
    }
    .input-label {
      display: block;
      font-size: 12px; font-weight: 600;
      color: var(--text-heading, #0F172B);
      margin-bottom: 6px;
    }
    .id-input {
      width: 100%;
      padding: 9px 12px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-heading, #0F172B);
      background: white;
      border: 1px solid var(--slate-300, #CBD5E1);
      border-radius: 8px;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .id-input:focus {
      border-color: var(--primary-orange, #F18800);
      box-shadow: 0 0 0 3px rgba(241, 136, 0, 0.15);
    }

    .warning-inline {
      display: flex; gap: 10px;
      margin-top: 12px;
      padding: 12px;
      background: #FEF3C7;
      border: 1px solid #FDE68A;
      border-radius: 8px;
    }
    .warning-inline-icon {
      font-size: 16px;
      color: #B45309;
      flex-shrink: 0;
      line-height: 1.4;
    }
    .warning-inline-text {
      font-size: 12px; color: #78350F; line-height: 1.5;
    }
    .warning-inline-text strong { color: #78350F; font-weight: 700; }

    /* Footer (coincide con paso 1) */
    .dialog-sm-actions {
      display: flex; justify-content: flex-end; gap: 12px; padding: 20px 32px 28px;
    }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 12px;
      padding: 8px 16px; font-size: 14px; font-weight: 500; font-family: inherit;
      border-radius: 8px; border: none; cursor: pointer; transition: all 0.15s ease;
    }
    .btn-primary { background: var(--primary-orange, #F18800); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--primary-orange-hover, #D97800); }
    .btn-primary:disabled { background: var(--slate-200, #E2E8F0); color: var(--slate-400, #94A3B8); cursor: not-allowed; }
    .btn-secondary { background: white; color: var(--text-primary, #314158); border: 1px solid var(--border-color, #E2E8F0); }
    .btn-secondary:hover { background: var(--slate-50, #F8FAFC); }
  `],
})
export class PasoIdentificacionTiendaComponent {
  identificacion = input.required<IdentificacionTienda>();
  identificacionValida = input.required<boolean>();
  sucursales = input.required<Sucursal[]>();

  readonly stepLabels = ['Información', 'Tienda', 'Configuración', 'Confirmación'];

  sucursalChange = output<Sucursal>();
  tipoChange = output<TipoIdentificacionTienda>();
  idTiendaChange = output<string>();
  continuar = output<void>();
  volver = output<void>();

  onSelectTipo(tipo: TipoIdentificacionTienda): void {
    if (this.identificacion().sucursal === null) return;
    this.tipoChange.emit(tipo);
  }

  onIdTiendaInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.idTiendaChange.emit(input.value);
  }

  onSucursalChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const sucursal = this.sucursales().find(s => s.id === select.value);
    if (sucursal) this.sucursalChange.emit(sucursal);
  }
}
