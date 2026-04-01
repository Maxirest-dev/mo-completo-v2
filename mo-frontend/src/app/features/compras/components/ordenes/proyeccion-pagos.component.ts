import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions, ModuleRegistry, AllCommunityModule } from 'ag-charts-community';
import { ProyeccionPagos } from '../../models/compras.models';
import { CurrencyArsPipe } from '@mro/shared-ui';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-proyeccion-pagos',
  standalone: true,
  imports: [CommonModule, AgCharts, CurrencyArsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="proyeccion-card">
      <div class="proyeccion-title">Proyección de Pagos</div>
      <div class="proyeccion-content">
        <div class="proyeccion-kpis">
          @if (data(); as proy) {
            <div class="kpi-item kpi-esta-semana">
              <div class="kpi-label">Esta Semana</div>
              <div class="kpi-value">{{ proy.estaSemana.monto | currencyArs }}</div>
              <div class="kpi-detail">{{ proy.estaSemana.cantidadFacturas }} facturas pendientes</div>
            </div>
            <div class="kpi-item kpi-prox-30">
              <div class="kpi-label">Próx 30 Días</div>
              <div class="kpi-value">{{ proy.proximos30Dias.monto | currencyArs }}</div>
              <div class="kpi-detail">{{ proy.proximos30Dias.cantidadFacturas }} facturas pendientes</div>
            </div>
            <div class="kpi-item kpi-vencidas">
              <div class="kpi-label">Vencidas</div>
              <div class="kpi-value">{{ proy.vencidas.monto | currencyArs }}</div>
              <div class="kpi-detail">{{ proy.vencidas.cantidadFacturas }} facturas</div>
            </div>
          }
        </div>
        <div class="proyeccion-chart">
          <ag-charts [options]="chartOptions()"></ag-charts>
        </div>
      </div>
    </div>
  `
})
export class ProyeccionPagosComponent {
  data = input.required<ProyeccionPagos | null>();

  private baseOptions: AgChartOptions = {
    width: 340,
    height: 140,
    data: [],
    series: [{
      type: 'donut',
      angleKey: 'value',
      legendItemKey: 'label',
      innerRadiusRatio: 0.6,
      outerRadiusRatio: 0.95,
      fills: ['#3B82F6', '#F59E0B', '#8B5CF6'],
      strokes: ['#3B82F6', '#F59E0B', '#8B5CF6'],
      calloutLabel: { enabled: false },
      sectorLabel: { enabled: false },
      tooltip: {
        renderer: (params: any) =>
          `${params.datum.label}: $${params.datum.value.toLocaleString('es-AR')} (${params.datum.pct}%)`
      }
    } as any],
    legend: {
      position: 'right',
      item: {
        label: {
          fontSize: 12,
          formatter: ({ itemId, value }: any) => value
        }
      }
    },
    padding: { top: 5, right: 5, bottom: 5, left: 5 },
    background: { visible: false }
  } as AgChartOptions;

  chartOptions = computed<AgChartOptions>(() => {
    const proy = this.data();
    if (!proy) return this.baseOptions;
    return {
      ...this.baseOptions,
      data: [
        { label: 'Esta semana', value: proy.estaSemana.monto, pct: proy.estaSemana.porcentaje },
        { label: 'Próximos 30 días', value: proy.proximos30Dias.monto, pct: proy.proximos30Dias.porcentaje },
        { label: 'Vencidas', value: proy.vencidas.monto, pct: proy.vencidas.porcentaje }
      ]
    };
  });
}
