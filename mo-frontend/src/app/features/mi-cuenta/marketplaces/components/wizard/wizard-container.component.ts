import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MarketplacesFacade } from '../../state/marketplaces.facade';
import { Paso1ContratacionComponent } from './paso1-contratacion.component';
import { PasoIdentificacionTiendaComponent } from './paso-identificacion-tienda.component';
import { Paso2ConfiguracionComponent, NuevaListaPayload } from './paso2-configuracion.component';
import { Paso3ConfirmacionComponent } from './paso3-confirmacion.component';
import { WizardActivandoComponent } from './wizard-activando.component';
import { WizardExitoComponent } from './wizard-exito.component';
import { ListaPrecios, MetodoAceptacionOption, Sucursal, TipoIdentificacionTienda } from '../../models/marketplaces.models';

@Component({
  selector: 'app-wizard-container',
  standalone: true,
  imports: [
    Paso1ContratacionComponent,
    PasoIdentificacionTiendaComponent,
    Paso2ConfiguracionComponent,
    Paso3ConfirmacionComponent,
    WizardActivandoComponent,
    WizardExitoComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wizard-overlay" (click)="onOverlayClick($event)">
      <div
        class="wizard-modal"
        [class.wizard-modal--compact]="facade.estadoIntegracion() === 'exito'">
        <!-- Header (visible en pasos 1-3) -->
        @if (facade.estadoIntegracion() !== 'activando' && facade.estadoIntegracion() !== 'exito') {
          <div class="wizard-header">
            <h2 class="wizard-title">
              @switch (facade.estadoIntegracion()) {
                @case ('contratacion') { Contratar integracion }
                @case ('identificacion') { Identificar tienda }
                @case ('configuracion') { Configurar integracion }
                @case ('confirmacion') { Confirmar activacion }
              }
            </h2>
            <button class="wizard-close" (click)="facade.cerrarWizard()">&#10005;</button>
          </div>
        }

        <!-- Content based on state -->
        @switch (facade.estadoIntegracion()) {
          @case ('contratacion') {
            @if (facade.solucionSeleccionada()) {
              <app-paso1-contratacion
                [solucion]="facade.solucionSeleccionada()!"
                (contratar)="facade.avanzarAIdentificacion()"
                (cancelar)="facade.cerrarWizard()" />
            }
          }

          @case ('identificacion') {
            <app-paso-identificacion-tienda
              [identificacion]="facade.identificacion()"
              [identificacionValida]="facade.identificacionValida()"
              [sucursales]="facade.sucursales()"
              (sucursalChange)="onSucursalChange($event)"
              (tipoChange)="onTipoIdentificacionChange($event)"
              (idTiendaChange)="onIdTiendaChange($event)"
              (continuar)="facade.avanzarAConfiguracion()"
              (volver)="facade.volverAContratacion()" />
          }

          @case ('configuracion') {
            <app-paso2-configuracion
              [listasPrecios]="facade.listasPrecios()"
              [metodosAceptacion]="facade.metodosAceptacion()"
              [configuracion]="facade.configuracion()"
              [configuracionValida]="facade.configuracionValida()"
              (listaPreciosChange)="onListaPreciosChange($event)"
              (metodoChange)="onMetodoChange($event)"
              (crearLista)="onCrearLista($event)"
              (continuar)="facade.avanzarAConfirmacion()"
              (volver)="facade.volverAIdentificacion()" />
          }

          @case ('confirmacion') {
            @if (facade.solucionSeleccionada()) {
              <app-paso3-confirmacion
                [solucion]="facade.solucionSeleccionada()!"
                [configuracion]="facade.configuracion()"
                [datosFacturacion]="facade.datosFacturacion()"
                [puedeActivar]="facade.puedeActivar()"
                (editar)="facade.volverAConfiguracion()"
                (activar)="facade.activarIntegracion()"
                (cancelar)="facade.cerrarWizard()"
                (terminosChange)="facade.setTerminosAceptados($event)" />
            }
          }

          @case ('activando') {
            <app-wizard-activando />
          }

          @case ('exito') {
            <app-wizard-exito
              [resultado]="facade.resultadoActivacion()"
              (cerrar)="facade.cerrarWizard()"
              (configurarCatalogo)="onConfigurarCatalogo()" />
          }
        }
      </div>
    </div>
  `
})
export class WizardContainerComponent {
  readonly facade = inject(MarketplacesFacade);
  private router = inject(Router);

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('wizard-overlay')) {
      const estado = this.facade.estadoIntegracion();
      if (estado !== 'activando') {
        this.facade.cerrarWizard();
      }
    }
  }

  onListaPreciosChange(lista: ListaPrecios): void {
    this.facade.setListaPrecios(lista);
  }

  onMetodoChange(metodo: MetodoAceptacionOption): void {
    this.facade.setMetodoAceptacion(metodo);
  }

  onTipoIdentificacionChange(tipo: TipoIdentificacionTienda): void {
    this.facade.setTipoIdentificacion(tipo);
  }

  onIdTiendaChange(idTienda: string): void {
    this.facade.setIdTienda(idTienda);
  }

  onSucursalChange(sucursal: Sucursal): void {
    this.facade.setSucursal(sucursal);
  }

  onCrearLista(payload: NuevaListaPayload): void {
    this.facade.crearListaPrecios(payload.nombre, payload.basadaEnId);
  }

  onConfigurarCatalogo(): void {
    this.facade.cerrarWizard();
    this.router.navigate(['/carta']);
  }
}
