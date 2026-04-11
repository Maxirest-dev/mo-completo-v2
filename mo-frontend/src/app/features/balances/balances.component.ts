import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastContainerComponent, NotificationService } from '@mro/shared-ui';
import { BalancesTabNavComponent } from './components/tab-nav/tab-nav.component';
import { BalancesFilterBarComponent } from './components/filter-bar/filter-bar.component';
import { AlertasDashboardComponent } from './components/alertas/alertas.component';
import { OperativosComponent } from './components/operativos/operativos.component';
import { EconomicosComponent } from './components/economicos/economicos.component';
import { FinancierosComponent } from './components/financieros/financieros.component';
import { FiscalesComponent } from './components/fiscales/fiscales.component';
import {
  TabBalances, FiltroBalances, Alerta,
  KpiOperativo, FoodCostMes, BalanceInventario, MermaItem, CuadranteMenu,
  PlRow, PuntoEquilibrio, ResultadoMes, GastoFijo,
  KpiFinanciero, FlujoCajaMes, PendienteApp, DeudaProveedor,
  KpiFiscal, SubdiarioIvaRow, MedioPago, PercepcionItem,
} from './models';
import {
  MOCK_ALERTAS,
  MOCK_KPI_OPERATIVOS, MOCK_FOOD_COST_MESES, MOCK_BALANCE_INVENTARIO, MOCK_TOP_MERMAS, MOCK_CUADRANTES_MENU,
  MOCK_PL_ROWS, MOCK_PL_RESULTADO, MOCK_PUNTO_EQUILIBRIO, MOCK_RESULTADO_MESES, MOCK_GASTOS_FIJOS,
  MOCK_KPI_FINANCIEROS, MOCK_FLUJO_CAJA, MOCK_PENDIENTES_APPS, MOCK_DEUDA_PROVEEDORES,
  MOCK_KPI_FISCALES, MOCK_SUBDIARIO_IVA_VENTAS, MOCK_SUBDIARIO_IVA_COMPRAS, MOCK_MEDIOS_PAGO, MOCK_PERCEPCIONES,
} from './data/mock-balances.data';

@Component({
  selector: 'app-balances',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastContainerComponent,
    BalancesTabNavComponent,
    BalancesFilterBarComponent,
    AlertasDashboardComponent,
    OperativosComponent,
    EconomicosComponent,
    FinancierosComponent,
    FiscalesComponent,
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
          <h1 class="page-title">Balances</h1>
          <p class="page-subtitle">{{ filtro().fechaDesde }} — {{ filtro().fechaHasta }}</p>
        </div>
        <app-balances-tab-nav
          [tabActivo]="tabActivo()"
          (tabChange)="tabActivo.set($event)"
        />
      </header>
      <div class="page-divider"></div>

      <!-- Filter Bar -->
      <app-balances-filter-bar
        [filtro]="filtro()"
        (filtroChange)="onFiltroChange($event)"
        (onDescargar)="onDescargar($event)"
        (onImprimir)="onImprimir()"
        (onEnviar)="onEnviar()"
      />

      <!-- Alertas -->
      <app-alertas-dashboard [alertas]="alertas()" />

      <!-- Tab Content -->
      @for (tab of [tabActivo()]; track tab) {
      <div
        class="tab-content"
        role="tabpanel"
        [id]="'tabpanel-' + tabActivo()"
        [attr.aria-labelledby]="'tab-' + tabActivo()"
      >
        @switch (tabActivo()) {
          @case ('operativos') {
            <app-operativos
              [kpis]="kpiOperativos()"
              [foodCostMeses]="foodCostMeses()"
              [balanceInventario]="balanceInventario()"
              [mermas]="topMermas()"
              [cuadrantes]="cuadrantesMenu()"
            />
          }
          @case ('economicos') {
            <app-economicos
              [plRows]="plRows()"
              [plResultado]="plResultado()"
              [puntoEquilibrio]="puntoEquilibrio()"
              [resultadoMeses]="resultadoMeses()"
              [gastosFijos]="gastosFijos()"
            />
          }
          @case ('financieros') {
            <app-financieros
              [kpis]="kpiFinancieros()"
              [flujoCaja]="flujoCaja()"
              [pendientes]="pendientesApps()"
              [deudas]="deudaProveedores()"
            />
          }
          @case ('fiscales') {
            <app-fiscales
              [kpis]="kpiFiscales()"
              [subdiarioVentas]="subdiarioIvaVentas()"
              [subdiarioCompras]="subdiarioIvaCompras()"
              [mediosPago]="mediosPago()"
              [percepciones]="percepciones()"
              (onExportar)="onExportarTabla($event)"
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
      font-size: 26px;
      font-weight: 700;
      color: var(--slate-900, #0F172B);
      margin: 0;
      letter-spacing: -0.01em;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--slate-400, #90A1B9);
      margin: 0;
    }

    .page-divider {
      height: 1px;
      background: var(--slate-200, #E2E8F0);
      margin: 16px 0 0;
    }

    /* Tab Content */
    .tab-content {
      animation: tabFadeIn 0.3s ease;
    }

    @keyframes tabFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Loading */
    .loading-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 16px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--slate-200, #E2E8F0);
      border-top-color: var(--primary-orange, #F27920);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-text {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: var(--slate-400, #90A1B9);
      margin: 0;
    }

    /* Error state */
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 12px;
    }

    .error-icon { font-size: 40px; }

    .error-text {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: var(--slate-500, #6B7280);
      margin: 0;
      text-align: center;
    }

    .btn-retry {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 20px;
      border: 1px solid var(--primary-orange, #F27920);
      border-radius: 8px;
      background: var(--primary-orange, #F27920);
      color: #fff;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-retry:hover { opacity: 0.9; }
  `],
})
export class BalancesComponent implements OnInit {
  private readonly notifications = inject(NotificationService);

  readonly tabActivo = signal<TabBalances>('operativos');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly filtro = signal<FiltroBalances>({
    periodo: 'mes',
    fechaDesde: this.getDefaultFechaDesde(),
    fechaHasta: this.getDefaultFechaHasta(),
    turno: 'todos',
    compararAnioAnterior: false,
  });

  // Alertas
  readonly alertas = signal<Alerta[]>([]);

  // Operativos
  readonly kpiOperativos = signal<KpiOperativo[]>([]);
  readonly foodCostMeses = signal<FoodCostMes[]>([]);
  readonly balanceInventario = signal<BalanceInventario>(MOCK_BALANCE_INVENTARIO);
  readonly topMermas = signal<MermaItem[]>([]);
  readonly cuadrantesMenu = signal<CuadranteMenu[]>([]);

  // Economicos
  readonly plRows = signal<PlRow[]>([]);
  readonly plResultado = signal<PlRow>(MOCK_PL_RESULTADO);
  readonly puntoEquilibrio = signal<PuntoEquilibrio>(MOCK_PUNTO_EQUILIBRIO);
  readonly resultadoMeses = signal<ResultadoMes[]>([]);
  readonly gastosFijos = signal<GastoFijo[]>([]);

  // Financieros
  readonly kpiFinancieros = signal<KpiFinanciero[]>([]);
  readonly flujoCaja = signal<FlujoCajaMes[]>([]);
  readonly pendientesApps = signal<PendienteApp[]>([]);
  readonly deudaProveedores = signal<DeudaProveedor[]>([]);

  // Fiscales
  readonly kpiFiscales = signal<KpiFiscal[]>([]);
  readonly subdiarioIvaVentas = signal<SubdiarioIvaRow[]>([]);
  readonly subdiarioIvaCompras = signal<SubdiarioIvaRow[]>([]);
  readonly mediosPago = signal<MedioPago[]>([]);
  readonly percepciones = signal<PercepcionItem[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  reload(): void {
    this.error.set(null);
    this.loading.set(true);
    this.loadData();
  }

  onFiltroChange(partial: Partial<FiltroBalances>): void {
    this.filtro.update(f => ({ ...f, ...partial }));
    this.loading.set(true);
    this.loadData();
  }

  onDescargar(formato: 'xlsx' | 'pdf'): void {
    const tab = this.tabActivo();
    this.notifications.show(`Descargando ${tab} en ${formato.toUpperCase()}...`, 'info');
  }

  onImprimir(): void {
    window.print();
  }

  onEnviar(): void {
    this.notifications.show('Funcionalidad de envío por mail en desarrollo', 'info');
  }

  onExportarTabla(event: { tabla: string; formato: 'xlsx' | 'pdf' }): void {
    this.notifications.show(`Exportando ${event.tabla} en ${event.formato.toUpperCase()}...`, 'info');
  }

  private loadData(): void {
    setTimeout(() => {
      // Alertas
      this.alertas.set(MOCK_ALERTAS);

      // Operativos
      this.kpiOperativos.set(MOCK_KPI_OPERATIVOS);
      this.foodCostMeses.set(MOCK_FOOD_COST_MESES);
      this.balanceInventario.set(MOCK_BALANCE_INVENTARIO);
      this.topMermas.set(MOCK_TOP_MERMAS);
      this.cuadrantesMenu.set(MOCK_CUADRANTES_MENU);

      // Economicos
      this.plRows.set(MOCK_PL_ROWS);
      this.plResultado.set(MOCK_PL_RESULTADO);
      this.puntoEquilibrio.set(MOCK_PUNTO_EQUILIBRIO);
      this.resultadoMeses.set(MOCK_RESULTADO_MESES);
      this.gastosFijos.set(MOCK_GASTOS_FIJOS);

      // Financieros
      this.kpiFinancieros.set(MOCK_KPI_FINANCIEROS);
      this.flujoCaja.set(MOCK_FLUJO_CAJA);
      this.pendientesApps.set(MOCK_PENDIENTES_APPS);
      this.deudaProveedores.set(MOCK_DEUDA_PROVEEDORES);

      // Fiscales
      this.kpiFiscales.set(MOCK_KPI_FISCALES);
      this.subdiarioIvaVentas.set(MOCK_SUBDIARIO_IVA_VENTAS);
      this.subdiarioIvaCompras.set(MOCK_SUBDIARIO_IVA_COMPRAS);
      this.mediosPago.set(MOCK_MEDIOS_PAGO);
      this.percepciones.set(MOCK_PERCEPCIONES);

      this.loading.set(false);
    }, 500);
  }

  private getDefaultFechaDesde(): string {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  }

  private getDefaultFechaHasta(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
