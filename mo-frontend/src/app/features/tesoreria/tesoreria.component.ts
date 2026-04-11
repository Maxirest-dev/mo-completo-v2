import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastContainerComponent, NotificationService } from '@mro/shared-ui';
import { TesoreriaTabNavComponent } from './components/tab-nav/tab-nav.component';
import { DisponibilidadesComponent } from './components/disponibilidades/disponibilidades.component';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { ConciliacionComponent } from './components/conciliacion/conciliacion.component';
import { AgendaPagosComponent } from './components/agenda-pagos/agenda-pagos.component';
import { CashFlowComponent } from './components/cash-flow/cash-flow.component';
import {
  TabTesoreria, FiltroTesoreria, PeriodoPreset,
  CuentaDisponibilidad, SaldoConsolidado, EvolucionMes, DistribucionCuenta,
  Movimiento,
  KpiConciliacion, CuponPendiente, ResumenApp,
  KpiAgenda, FacturaPendiente,
  KpiCashFlow, ProyeccionDiaria, AlertaCashFlow, HorizonteProyeccion,
} from './models';
import {
  MOCK_CUENTAS, MOCK_SALDO_CONSOLIDADO, MOCK_EVOLUCION, MOCK_DISTRIBUCION,
  MOCK_MOVIMIENTOS,
  MOCK_KPI_CONCILIACION, MOCK_CUPONES, MOCK_APPS_RESUMEN,
  MOCK_KPI_AGENDA, MOCK_FACTURAS_PENDIENTES,
  MOCK_KPI_CASHFLOW, MOCK_PROYECCION_DIARIA, MOCK_ALERTAS_CASHFLOW,
} from './data/mock-tesoreria.data';

@Component({
  selector: 'app-tesoreria',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ToastContainerComponent,
    TesoreriaTabNavComponent,
    DisponibilidadesComponent, MovimientosComponent,
    ConciliacionComponent, AgendaPagosComponent, CashFlowComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-toast-container />

    @if (loading()) {
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <p class="loading-text">Cargando datos...</p>
      </div>
    } @else if (error()) {
      <div class="error-state">
        <span class="error-icon" aria-hidden="true">⚠️</span>
        <p class="error-text">{{ error() }}</p>
        <button class="btn-retry" (click)="reload()" type="button">Reintentar</button>
      </div>
    } @else {
      <!-- Header -->
      <header class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Tesorería</h1>
          <p class="page-subtitle">{{ filtro().fechaDesde }} — {{ filtro().fechaHasta }}</p>
        </div>
        <app-tesoreria-tab-nav
          [tabActivo]="tabActivo()"
          (tabChange)="tabActivo.set($event)"
        />
      </header>
      <div class="page-divider"></div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-left">
          <div class="filter-group">
            <label class="filter-label">Periodo</label>
            <div class="date-range">
              <input type="date" class="date-input"
                [ngModel]="filtro().fechaDesde"
                (ngModelChange)="onFiltroChange({ fechaDesde: $event, periodo: 'personalizado' })"
                aria-label="Fecha desde" />
              <span class="date-separator">—</span>
              <input type="date" class="date-input"
                [ngModel]="filtro().fechaHasta"
                (ngModelChange)="onFiltroChange({ fechaHasta: $event, periodo: 'personalizado' })"
                aria-label="Fecha hasta" />
            </div>
          </div>
          <div class="filter-group">
            <label class="filter-label">Rango</label>
            <select class="filter-input"
              [ngModel]="filtro().periodo"
              (ngModelChange)="onPresetChange($event)"
              aria-label="Seleccionar rango">
              @for (p of presets; track p.key) {
                <option [value]="p.key">{{ p.label }}</option>
              }
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Turno</label>
            <select class="filter-input"
              [ngModel]="filtro().turno"
              (ngModelChange)="onFiltroChange({ turno: $event })"
              aria-label="Seleccionar turno">
              <option value="todos">Todos los turnos</option>
              <option value="manana">Mañana</option>
              <option value="tarde">Tarde</option>
              <option value="noche">Noche</option>
            </select>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-export" type="button" (click)="onDescargar()" aria-label="Descargar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Descargar
          </button>
          <button class="btn-export" type="button" (click)="onImprimir()" aria-label="Imprimir">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12Zm-2.25 0h.008v.008H16.5V12Z" />
            </svg>
            Imprimir
          </button>
          <button class="btn-export" type="button" (click)="onEnviar()" aria-label="Enviar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            Enviar
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      @for (tab of [tabActivo()]; track tab) {
      <div class="tab-content" role="tabpanel"
        [id]="'tabpanel-' + tabActivo()"
        [attr.aria-labelledby]="'tab-' + tabActivo()">
        @switch (tabActivo()) {
          @case ('disponibilidades') {
            <app-disponibilidades
              [cuentas]="cuentas()"
              [saldoConsolidado]="saldoConsolidado()"
              [evolucion]="evolucion()"
              [distribucion]="distribucion()"
            />
          }
          @case ('movimientos') {
            <app-movimientos [movimientos]="movimientos()" />
          }
          @case ('conciliacion') {
            <app-conciliacion
              [kpis]="kpiConciliacion()"
              [cupones]="cupones()"
              [appsResumen]="appsResumen()"
            />
          }
          @case ('agenda') {
            <app-agenda-pagos
              [kpis]="kpiAgenda()"
              [facturas]="facturasPendientes()"
            />
          }
          @case ('cashflow') {
            <app-cash-flow
              [kpis]="kpiCashFlow()"
              [proyeccion]="proyeccionDiaria()"
              [alertas]="alertasCashFlow()"
              [horizonte]="horizonte()"
              (horizonteChange)="horizonte.set($event)"
            />
          }
        }
      </div>
      }
    }
  `,
  styles: [`
    :host { display: block; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
    }
    .page-header-left { display: flex; flex-direction: column; gap: 2px; }
    .page-title {
      font-size: 26px; font-weight: 700;
      color: var(--slate-900, #0F172B);
      margin: 0; letter-spacing: -0.01em;
    }
    .page-subtitle { font-size: 14px; color: var(--slate-400, #90A1B9); margin: 0; }
    .page-divider { height: 1px; background: var(--slate-200, #E2E8F0); margin: 16px 0 0; }

    /* Filter Bar */
    .filter-bar {
      display: flex; justify-content: space-between; align-items: flex-end;
      padding: 12px 0; gap: 16px; flex-wrap: wrap;
    }
    .filter-left { display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
    .header-actions { display: flex; gap: 8px; }
    .filter-group { display: flex; flex-direction: column; gap: 6px; }
    .filter-label {
      font-family: 'Inter', sans-serif; font-size: 13px;
      font-weight: 500; color: var(--slate-700, #314158);
    }

    .date-range {
      display: flex; align-items: center;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md, 10px);
      background: white; overflow: hidden;
      transition: border-color 0.2s ease;
    }
    .date-range:focus-within {
      border-color: var(--primary-orange, #F27920);
      box-shadow: 0 0 0 3px rgba(242, 121, 32, 0.1);
    }
    .date-input {
      font-family: 'Inter', sans-serif; font-size: 14px;
      padding: 10px 12px; border: none; background: white;
      color: var(--slate-700, #314158); outline: none;
    }
    .date-input:focus { background: var(--primary-orange-light, #FFF7ED); }
    .date-separator { font-size: 13px; color: var(--slate-400, #90A1B9); padding: 0 4px; }

    .filter-input {
      font-family: 'Inter', sans-serif; font-size: 14px;
      padding: 10px 36px 10px 16px;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md, 10px);
      background: white; color: var(--slate-700, #314158);
      outline: none; appearance: none; cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      transition: all 0.2s ease; min-width: 140px;
    }
    .filter-input:focus {
      border-color: var(--primary-orange, #F27920);
      box-shadow: 0 0 0 3px rgba(242, 121, 32, 0.1);
    }

    .btn-export {
      display: flex; align-items: center; gap: 6px;
      font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
      padding: 10px 16px;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md, 10px);
      background: white; color: var(--slate-700, #314158);
      cursor: pointer; transition: all 0.2s ease;
    }
    .btn-export:hover {
      background: var(--slate-50, #F8FAFC);
      border-color: var(--slate-300, #CBD5E1);
    }
    .btn-icon { width: 16px; height: 16px; }

    .tab-content { animation: tabFadeIn 0.3s ease; }
    @keyframes tabFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .loading-overlay {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; min-height: 400px; gap: 16px;
    }
    .loading-spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--slate-200, #E2E8F0);
      border-top-color: var(--primary-orange, #F27920);
      border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-text { font-family: 'Inter', sans-serif; font-size: 14px; color: var(--slate-400, #90A1B9); margin: 0; }

    .error-state {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; min-height: 400px; gap: 12px;
    }
    .error-icon { font-size: 40px; }
    .error-text { font-family: 'Inter', sans-serif; font-size: 14px; color: var(--slate-500, #6B7280); margin: 0; }
    .btn-retry {
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
      padding: 8px 20px;
      border: 1px solid var(--primary-orange, #F27920);
      border-radius: 8px; background: var(--primary-orange, #F27920);
      color: #fff; cursor: pointer; transition: all 0.15s ease;
    }
    .btn-retry:hover { opacity: 0.9; }
  `],
})
export class TesoreriaComponent implements OnInit {
  private readonly notifications = inject(NotificationService);

  readonly tabActivo = signal<TabTesoreria>('disponibilidades');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly horizonte = signal<number>(7);

  readonly filtro = signal<FiltroTesoreria>({
    periodo: 'mes',
    fechaDesde: this.getDefaultFechaDesde(),
    fechaHasta: this.getDefaultFechaHasta(),
    turno: 'todos',
  });

  readonly presets = [
    { key: 'hoy', label: 'Hoy' },
    { key: 'semana', label: 'Semana' },
    { key: 'mes', label: 'Mes' },
    { key: 'anio', label: 'Año' },
    { key: 'personalizado', label: 'Custom' },
  ];

  // Disponibilidades
  readonly cuentas = signal<CuentaDisponibilidad[]>([]);
  readonly saldoConsolidado = signal<SaldoConsolidado>(MOCK_SALDO_CONSOLIDADO);
  readonly evolucion = signal<EvolucionMes[]>([]);
  readonly distribucion = signal<DistribucionCuenta[]>([]);

  // Movimientos
  readonly movimientos = signal<Movimiento[]>([]);

  // Conciliacion
  readonly kpiConciliacion = signal<KpiConciliacion[]>([]);
  readonly cupones = signal<CuponPendiente[]>([]);
  readonly appsResumen = signal<ResumenApp[]>([]);

  // Agenda
  readonly kpiAgenda = signal<KpiAgenda[]>([]);
  readonly facturasPendientes = signal<FacturaPendiente[]>([]);

  // Cash Flow
  readonly kpiCashFlow = signal<KpiCashFlow[]>([]);
  readonly proyeccionDiaria = signal<ProyeccionDiaria[]>([]);
  readonly alertasCashFlow = signal<AlertaCashFlow[]>([]);

  ngOnInit(): void { this.loadData(); }

  reload(): void {
    this.error.set(null);
    this.loading.set(true);
    this.loadData();
  }

  onFiltroChange(partial: Partial<FiltroTesoreria>): void {
    this.filtro.update(f => ({ ...f, ...partial }));
    this.loading.set(true);
    this.loadData();
  }

  onPresetChange(preset: PeriodoPreset): void {
    const hoy = new Date();
    let fechaDesde: string;
    const fechaHasta = hoy.toISOString().slice(0, 10);
    switch (preset) {
      case 'hoy': fechaDesde = fechaHasta; break;
      case 'semana': { const d = new Date(hoy); d.setDate(d.getDate() - d.getDay() + 1); fechaDesde = d.toISOString().slice(0, 10); break; }
      case 'mes': fechaDesde = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10); break;
      case 'anio': fechaDesde = new Date(hoy.getFullYear(), 0, 1).toISOString().slice(0, 10); break;
      default: fechaDesde = this.filtro().fechaDesde;
    }
    this.filtro.update(f => ({ ...f, periodo: preset, fechaDesde, fechaHasta }));
    this.loading.set(true);
    this.loadData();
  }

  onDescargar(): void { this.notifications.show('Descargando...', 'info'); }
  onImprimir(): void { window.print(); }
  onEnviar(): void { this.notifications.show('Funcionalidad de envío por mail en desarrollo', 'info'); }

  private loadData(): void {
    setTimeout(() => {
      this.cuentas.set(MOCK_CUENTAS);
      this.saldoConsolidado.set(MOCK_SALDO_CONSOLIDADO);
      this.evolucion.set(MOCK_EVOLUCION);
      this.distribucion.set(MOCK_DISTRIBUCION);
      this.movimientos.set(MOCK_MOVIMIENTOS);
      this.kpiConciliacion.set(MOCK_KPI_CONCILIACION);
      this.cupones.set(MOCK_CUPONES);
      this.appsResumen.set(MOCK_APPS_RESUMEN);
      this.kpiAgenda.set(MOCK_KPI_AGENDA);
      this.facturasPendientes.set(MOCK_FACTURAS_PENDIENTES);
      this.kpiCashFlow.set(MOCK_KPI_CASHFLOW);
      this.proyeccionDiaria.set(MOCK_PROYECCION_DIARIA);
      this.alertasCashFlow.set(MOCK_ALERTAS_CASHFLOW);
      this.loading.set(false);
    }, 500);
  }

  private getDefaultFechaDesde(): string {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  }

  private getDefaultFechaHasta(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
