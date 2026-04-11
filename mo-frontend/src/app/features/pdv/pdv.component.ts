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
import { FinesTurnoComponent } from './components/fines-turno/fines-turno.component';
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
    FinesTurnoComponent,
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
      <div class="page-header-actions">
        <button class="header-btn" (click)="onNavigate('configuraciones')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          Configuraciones
        </button>
        <button class="header-btn" (click)="onNavigate('auditoria')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
          Auditoria
        </button>
        <button class="header-btn" (click)="onNavigate('alta-arca')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Facturacion Electronica
          <span class="status-indicator" [class.status-indicator--ok]="arcaActivo()" [class.status-indicator--error]="!arcaActivo()">
            <span class="status-dot"></span>
            <span class="status-tooltip">{{ arcaActivo() ? 'ARCA operativo' : 'ARCA fuera de servicio' }}</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="pdv-layout">
      <!-- Left Column -->
      <div class="pdv-left">
        <app-turno-kpis
          [turno]="turnoActual()"
          [estadoCaja]="estadoCaja()"
          [viewMode]="viewMode()"
          (viewModeChange)="viewMode.set($event)"
        />
        <app-estadisticas [formasCobro]="formasCobro()" />
      </div>

      <!-- Right Column -->
      <div class="pdv-right">
        <app-fines-turno [finesTurno]="finesTurno()" (fechaSelect)="onFechaSelect($event)" />
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
      flex-shrink: 0;
    }

    .page-header-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .header-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      border-radius: var(--radius-md);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .header-btn:hover {
      border-color: var(--slate-300);
      box-shadow: var(--shadow-md);
      color: var(--text-heading);
    }

    .header-btn svg {
      color: var(--slate-400);
    }

    .status-indicator {
      position: relative;
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }

    .status-indicator .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-indicator--ok .status-dot {
      background: var(--success-color, #00A43D);
      box-shadow: 0 0 0 3px rgba(0, 164, 61, 0.15);
    }

    .status-indicator--error .status-dot {
      background: var(--danger-color, #EF4444);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
      animation: pulse-error 2s ease-in-out infinite;
    }

    .status-tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      padding: 5px 10px;
      font-size: 11px;
      font-weight: 500;
      white-space: nowrap;
      border-radius: 6px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s ease;
    }

    .status-indicator--ok .status-tooltip {
      background: var(--success-color, #00A43D);
      color: #FFFFFF;
    }

    .status-indicator--error .status-tooltip {
      background: var(--danger-color, #EF4444);
      color: #FFFFFF;
    }

    .status-indicator:hover .status-tooltip {
      opacity: 1;
    }

    @keyframes pulse-error {
      0%, 100% { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15); }
      50% { box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.25); }
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

      .header-btn {
        padding: 8px 12px;
        font-size: 13px;
      }
    }
  `],
})
export class PdvComponent {
  private readonly router = inject(Router);

  viewMode = signal<ViewMode>('pesos');
  showCierreDialog = signal(false);
  arcaActivo = signal(true);

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
    } else if (target === 'auditoria') {
      this.router.navigate(['/pdv/auditoria']);
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
