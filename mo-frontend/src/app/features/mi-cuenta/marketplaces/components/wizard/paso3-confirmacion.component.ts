import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MroCurrencyPipe } from '../../../../balances/pipes/currency.pipe';
import {
  Solucion,
  ConfiguracionPedidosYa,
  DatosFacturacion
} from '../../models/marketplaces.models';
import { WizardStepperComponent } from './wizard-stepper.component';

@Component({
  selector: 'app-paso3-confirmacion',
  standalone: true,
  imports: [MroCurrencyPipe, WizardStepperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-wizard-stepper [steps]="stepLabels" [activeIndex]="3" />

    <div class="wizard-body">
      <h3 class="confirm-heading">Confirmar activación</h3>
      <p class="confirm-subheading">Revisá los detalles de tu integración antes de activar</p>

      <!-- Config summary card (check-in style) -->
      <div class="confirm-config-list">
        <!-- Header -->
        <div class="confirm-config-header">
          <div class="confirm-config-header-left">
            <span class="confirm-config-header-name">{{ solucion().nombre }}</span>
            <span class="confirm-config-header-plan">Integración</span>
          </div>
          <span class="confirm-config-header-trial">{{ solucion().precioMensual | mroCurrency }}/mes</span>
        </div>

        <!-- Row: Lista de precios -->
        <div class="confirm-config-row">
          <span class="confirm-config-icon" aria-hidden="true">📋</span>
          <span class="confirm-config-title">Lista de precios</span>
          <span class="confirm-config-detail">{{ configuracion().listaPrecios?.nombre }} · {{ configuracion().listaPrecios?.productosSincronizados }} productos</span>
        </div>

        <!-- Row: Método de aceptación -->
        <div class="confirm-config-row">
          <span class="confirm-config-icon" aria-hidden="true">⚡</span>
          <span class="confirm-config-title">Aceptación</span>
          <span class="confirm-config-detail">{{ configuracion().metodoAceptacion?.nombre }} · {{ configuracion().metodoAceptacion?.tiempoRespuesta }}</span>
        </div>
      </div>

      <!-- Editar link -->
      <div class="confirm-edit-row">
        <button class="btn-editar" (click)="editar.emit()">Editar configuración</button>
      </div>

      <!-- Facturación -->
      @if (datosFacturacion()) {
        <div class="facturacion-box">
          <div class="facturacion-title">Facturación</div>
          <div class="facturacion-row">
            <span class="facturacion-label">Método de pago</span>
            <span class="facturacion-valor">{{ datosFacturacion()!.metodoPago }}</span>
          </div>
          <div class="facturacion-row">
            <span class="facturacion-label">Próximo cargo</span>
            <span class="facturacion-valor">{{ datosFacturacion()!.proximoCargo }}</span>
          </div>
          <div class="facturacion-row">
            <span class="facturacion-label">Monto mensual</span>
            <span class="facturacion-valor">{{ solucion().precioMensual | mroCurrency }} + IVA</span>
          </div>
        </div>
      }

      <!-- Términos -->
      <div class="terminos-check">
        <input type="checkbox" id="terminos"
          [checked]="configuracion().terminosAceptados"
          (change)="onTerminosChange($event)" />
        <label for="terminos">
          Acepto los <a href="javascript:void(0)">términos y condiciones</a> del servicio de
          integración con {{ solucion().nombre }} y autorizo el débito automático mensual.
        </label>
      </div>
    </div>

    <div class="wizard-footer">
      <button class="btn-ghost" (click)="cancelar.emit()">Cancelar</button>
      <button class="btn-activar" [disabled]="!puedeActivar()" (click)="activar.emit()">
        Activar integración
      </button>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; flex: 1; min-height: 0; }

    .confirm-heading { font-size: 16px; font-weight: 600; color: var(--gray-900, #0F172B); margin: 0 0 4px; }
    .confirm-subheading { font-size: 13px; color: var(--gray-500, #64748B); margin: 0 0 24px; }

    /* Config summary card (check-in style) */
    .confirm-config-list {
      background: var(--slate-50, #F8FCFF);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: 12px;
      overflow: hidden;
      text-align: left;
    }

    .confirm-config-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: var(--slate-100, #EEF2F7);
      border-bottom: 1px solid var(--border-color, #E2E8F0);
    }

    .confirm-config-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .confirm-config-header-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-heading, #0F172B);
    }

    .confirm-config-header-plan {
      font-size: 11px;
      font-weight: 500;
      color: var(--slate-500, #64748B);
      padding: 2px 8px;
      background: white;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: 4px;
    }

    .confirm-config-header-trial {
      font-size: 11px;
      font-weight: 600;
      color: var(--accent-orange, #F18800);
      padding: 3px 10px;
      background: #FFF7ED;
      border-radius: 9999px;
    }

    .confirm-config-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
    }

    .confirm-config-row + .confirm-config-row {
      border-top: 1px solid var(--divider-color, #F1F5F9);
    }

    .confirm-config-icon { font-size: 18px; flex-shrink: 0; }

    .confirm-config-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-heading, #0F172B);
      min-width: 100px;
    }

    .confirm-config-detail {
      font-size: 12px;
      color: var(--slate-400, #94A3B8);
      margin-left: auto;
    }

    /* Edit link */
    .confirm-edit-row {
      display: flex;
      justify-content: flex-end;
      margin: 8px 0 16px;
    }

    .btn-editar {
      background: none;
      border: none;
      color: #7C3AED;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }

    .btn-editar:hover { color: #6D28D9; text-decoration: underline; }
  `],
})
export class Paso3ConfirmacionComponent {
  solucion = input.required<Solucion>();
  configuracion = input.required<ConfiguracionPedidosYa>();
  datosFacturacion = input.required<DatosFacturacion | null>();
  puedeActivar = input.required<boolean>();

  readonly stepLabels = ['Información', 'Tienda', 'Configuración', 'Confirmación'];

  editar = output<void>();
  activar = output<void>();
  cancelar = output<void>();
  terminosChange = output<boolean>();

  onTerminosChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.terminosChange.emit(checkbox.checked);
  }
}
