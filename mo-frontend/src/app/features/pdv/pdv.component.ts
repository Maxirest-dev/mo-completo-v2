import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { TurnoKpisComponent } from './components/turno-kpis/turno-kpis.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { EstadoCajaComponent } from './components/estado-caja/estado-caja.component';
import { FinesTurnoComponent } from './components/fines-turno/fines-turno.component';
import { AccesosRapidosComponent } from './components/accesos-rapidos/accesos-rapidos.component';
import { CierreTurnoDialogComponent } from './components/cierre-turno-dialog/cierre-turno-dialog.component';
import {
  ViewMode,
  TurnoActual,
  EstadoCaja,
  FormaCobrotTurno,
  FinTurno,
  CierreTurnoData,
} from './models';
import {
  MOCK_TURNO_ACTUAL,
  MOCK_ESTADO_CAJA,
  MOCK_FORMAS_COBRO,
  MOCK_FINES_TURNO,
  MOCK_CIERRE_TURNO,
} from './data/mock-pdv.data';

@Component({
  selector: 'app-pdv',
  standalone: true,
  imports: [
    TurnoKpisComponent,
    EstadisticasComponent,
    EstadoCajaComponent,
    FinesTurnoComponent,
    AccesosRapidosComponent,
    CierreTurnoDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="text-title">Turno actual y fines de turno</h1>
        <p class="text-subtitle">Gestion del turno activo y visualizacion del historial de cierres</p>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="pdv-layout">
      <!-- Left Column -->
      <div class="pdv-left">
        <app-turno-kpis
          [turno]="turnoActual()"
          [viewMode]="viewMode()"
          (viewModeChange)="viewMode.set($event)"
        />
        <app-estadisticas [formasCobro]="formasCobro()" />
        <app-estado-caja [estadoCaja]="estadoCaja()" />
      </div>

      <!-- Right Column -->
      <div class="pdv-right">
        <app-fines-turno [finesTurno]="finesTurno()" (fechaSelect)="onFechaSelect($event)" />
        <app-accesos-rapidos (navigateTo)="onNavigate($event)" />
      </div>
    </div>

    <!-- Cierre Turno Dialog -->
    @if (showCierreDialog()) {
      <app-cierre-turno-dialog
        [cierreTurno]="cierreTurnoData()"
        (cerrar)="showCierreDialog.set(false)"
        (finalizar)="onFinalizar()"
      />
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--spacing-xl);
    }

    .page-header-left {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .text-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-heading);
      margin: 0;
    }

    .text-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
    }

    .pdv-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: var(--spacing-lg);
      align-items: start;
    }

    .pdv-left {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .pdv-right {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    @media (max-width: 1200px) {
      .pdv-layout {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: var(--spacing-md);
      }
    }
  `],
})
export class PdvComponent {
  private readonly router = inject(Router);

  viewMode = signal<ViewMode>('pesos');
  showCierreDialog = signal(false);

  turnoActual = signal<TurnoActual>(MOCK_TURNO_ACTUAL);
  estadoCaja = signal<EstadoCaja>(MOCK_ESTADO_CAJA);
  formasCobro = signal<FormaCobrotTurno[]>(MOCK_FORMAS_COBRO);
  finesTurno = signal<FinTurno[]>(MOCK_FINES_TURNO);
  cierreTurnoData = signal<CierreTurnoData>(MOCK_CIERRE_TURNO);

  onNavigate(target: string): void {
    if (target === 'alta-arca') {
      this.router.navigate(['/pdv/alta-arca']);
    } else if (target === 'configuraciones') {
      this.router.navigate(['/pdv/configuraciones']);
    }
  }

  onFechaSelect(fecha: string): void {
    // Find the fin de turno for this date and show the dialog
    this.showCierreDialog.set(true);
  }

  onFinalizar(): void {
    this.showCierreDialog.set(false);
  }
}
