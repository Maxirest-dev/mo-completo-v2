import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastContainerComponent, NotificationService } from '@mro/shared-ui';
import { TesoreriaTabNavComponent } from './components/tab-nav/tab-nav.component';
import { TesoreriaFilterBarComponent } from './components/filter-bar/filter-bar.component';
import { DisponibilidadesComponent } from './components/disponibilidades/disponibilidades.component';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { ConciliacionComponent } from './components/conciliacion/conciliacion.component';
import { AgendaPagosComponent } from './components/agenda-pagos/agenda-pagos.component';
import { CashFlowComponent } from './components/cash-flow/cash-flow.component';
import {
  TabTesoreria, FiltroTesoreria,
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
    TesoreriaTabNavComponent, TesoreriaFilterBarComponent,
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
      <app-tesoreria-filter-bar
        [filtro]="filtro()"
        [tabActivo]="tabActivo()"
        (filtroChange)="onFiltroChange($event)"
        (onDescargar)="onDescargar()"
        (onImprimir)="onImprimir()"
        (onEnviar)="onEnviar()"
        (cuentaChange)="onCuentaChange($event)"
        (categoriaChange)="onCategoriaChange($event)"
        (proveedorChange)="onProveedorChange($event)"
        (estadoChange)="onEstadoChange($event)"
        (horizonteChange)="horizonte.set($event)"
      />

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
              [filtroProveedor]="proveedorGlobal()"
              [filtroEstado]="estadoGlobal()"
              (onPagar)="onPagar($event)"
            />
          }
          @case ('cashflow') {
            <app-cash-flow
              [kpis]="kpiCashFlow()"
              [proyeccion]="proyeccionDiaria()"
              [alertas]="alertasCashFlow()"
              [horizonte]="horizonte()"
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
    categoria: '',
  });

  readonly cuentaGlobal = signal<string>('todas');
  readonly categoriaGlobal = signal<string>('');
  readonly proveedorGlobal = signal<string>('');
  readonly estadoGlobal = signal<string>('');

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

  onCuentaChange(cuenta: string): void {
    this.cuentaGlobal.set(cuenta);
    this.loading.set(true);
    this.loadData();
  }

  onCategoriaChange(categoria: string): void {
    this.categoriaGlobal.set(categoria);
    this.loading.set(true);
    this.loadData();
  }

  onProveedorChange(proveedor: string): void { this.proveedorGlobal.set(proveedor); }
  onEstadoChange(estado: string): void { this.estadoGlobal.set(estado); }
  onPagar(factura: FacturaPendiente): void { this.notifications.show(`Pagar factura ${factura.nroFactura} — en desarrollo`, 'info'); }
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
