import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastContainerComponent } from '@mro/shared-ui';
import { VentasHeaderComponent } from './components/ventas-header/ventas-header.component';
import { TabNavComponent } from './components/tab-nav/tab-nav.component';
import { ResumenCardsComponent } from './components/resumen-cards/resumen-cards.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ArticulosComponent } from './components/articulos/articulos.component';
import { FormasCobroComponent } from './components/formas-cobro/formas-cobro.component';
import { ComprobantesComponent } from './components/comprobantes/comprobantes.component';
import { ConceptosComponent } from './components/conceptos/conceptos.component';
import {
  TabVentas, FiltroVentas, VentaResumen,
  FormaCobro, ComprobanteVenta, ArticuloVenta,
  ConceptoVenta, CategoriaVenta, MovimientoHora,
} from './models';
import {
  MOCK_RESUMEN_VENTAS, MOCK_RESUMEN_FORMAS, MOCK_RESUMEN_OTROS,
  MOCK_FORMAS_COBRO, MOCK_ARTICULOS, MOCK_COMPROBANTES,
  MOCK_CONCEPTOS, MOCK_CATEGORIAS, MOCK_MOVIMIENTOS_HORA,
  MOCK_VENTAS_COMPROBANTES, filterByTurno,
} from './data/mock-ventas.data';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastContainerComponent,
    VentasHeaderComponent,
    TabNavComponent,
    ResumenCardsComponent,
    DashboardComponent,
    ArticulosComponent,
    FormasCobroComponent,
    ComprobantesComponent,
    ConceptosComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-toast-container />

    @if (loading()) {
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <p class="loading-text">Cargando datos...</p>
      </div>
    } @else {
      <!-- Header: Titulo + Date range subtitle -->
      <header class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Ventas</h1>
          <p class="page-subtitle">{{ filtro().fechaDesde }} — {{ filtro().fechaHasta }}</p>
        </div>
        <app-tab-nav
          [tabActivo]="tabActivo()"
          (tabChange)="tabActivo.set($event)"
        />
      </header>
      <div class="page-divider"></div>

      <!-- Filtros -->
      <app-ventas-header
        [filtro]="filtro()"
        (filtroChange)="onFiltroChange($event)"
      />

      <app-resumen-cards
        [ventasResumen]="ventasResumen()"
        [formasResumen]="formasResumen()"
        [otrosResumen]="otrosResumen()"
      />

      @for (tab of [tabActivo()]; track tab) {
      <div class="tab-content">
        @switch (tabActivo()) {
          @case ('dashboard') {
            <app-dashboard
              [formasCobro]="formasCobro()"
              [comprobantes]="comprobantes()"
              [articulos]="articulos()"
              [categorias]="categorias()"
              [movimientos]="movimientosFiltrados()"
              (tabChange)="tabActivo.set($event)"
            />
          }
          @case ('formasCobro') {
            <app-formas-cobro
              [formasCobro]="formasCobro()"
            />
          }
          @case ('conceptos') {
            <app-conceptos
              [conceptos]="conceptos()"
            />
          }
          @case ('comprobantes') {
            <app-comprobantes
              [comprobantes]="comprobantes()"
              [ventas]="ventasComprobantes()"
            />
          }
          @case ('articulos') {
            <app-articulos
              [articulos]="articulos()"
              [categorias]="categorias()"
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
    .page-title {
      font-size: 26px;
      font-weight: 700;
      color: var(--slate-900, #0F172B);
      margin: 0 0 4px;
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
      margin: 16px 0 20px;
    }

    .tab-content {
      animation: tabFadeIn 0.3s ease;
    }

    @keyframes tabFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

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
  `],
})
export class VentasComponent implements OnInit {
  readonly tabActivo = signal<TabVentas>('dashboard');
  readonly loading = signal(true);

  readonly filtro = signal<FiltroVentas>({
    fechaDesde: this.getDefaultFechaDesde(),
    fechaHasta: this.getDefaultFechaHasta(),
    turno: 'todos',
  });

  readonly ventasResumen = signal<VentaResumen>(MOCK_RESUMEN_VENTAS);
  readonly formasResumen = signal<VentaResumen>(MOCK_RESUMEN_FORMAS);
  readonly otrosResumen = signal<VentaResumen>(MOCK_RESUMEN_OTROS);
  readonly formasCobro = signal<FormaCobro[]>([]);
  readonly articulos = signal<ArticuloVenta[]>([]);
  readonly comprobantes = signal<ComprobanteVenta[]>([]);
  readonly ventasComprobantes = signal<any[]>([]);
  readonly conceptos = signal<ConceptoVenta[]>([]);
  readonly categorias = signal<CategoriaVenta[]>([]);
  readonly movimientos = signal<MovimientoHora[]>([]);

  movimientosFiltrados(): MovimientoHora[] {
    return filterByTurno(this.movimientos(), this.filtro().turno);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.formasCobro.set(MOCK_FORMAS_COBRO);
      this.articulos.set(MOCK_ARTICULOS);
      this.comprobantes.set(MOCK_COMPROBANTES);
      this.ventasComprobantes.set(MOCK_VENTAS_COMPROBANTES);
      this.conceptos.set(MOCK_CONCEPTOS);
      this.categorias.set(MOCK_CATEGORIAS);
      this.movimientos.set(MOCK_MOVIMIENTOS_HORA);
      this.loading.set(false);
    }, 500);
  }

  onFiltroChange(filtro: FiltroVentas): void {
    this.filtro.set(filtro);
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
