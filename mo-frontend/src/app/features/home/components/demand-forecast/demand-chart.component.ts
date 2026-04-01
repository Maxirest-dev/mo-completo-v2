import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { DemandForecast, DemandSeries } from '../../models';

interface ChartDataPoint {
  hora: string;
  semanaPasada: number | null;
  ventasHoy: number | null;
  prediccionIA: number | null;
}

@Component({
  selector: 'app-demand-chart',
  standalone: true,
  imports: [AgCharts],
  template: `
    <div class="demand-chart-wrapper">
      <ag-charts [options]="chartOptions()" />
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .demand-chart-wrapper {
      width: 100%;
      height: 250px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemandChartComponent {
  forecast = input.required<DemandForecast | null>();

  chartOptions = computed(() => {
    const forecast = this.forecast();
    const data = this.transformData(forecast);

    return {
      data,
      height: 250,
      padding: { top: 16, right: 16, bottom: 8, left: 8 },
      background: { visible: false },
      series: [
        {
          type: 'area',
          xKey: 'hora',
          yKey: 'semanaPasada',
          yName: 'Semana Pasada',
          stroke: '#90A1B9',
          strokeWidth: 2,
          lineDash: [5, 5],
          fill: 'transparent',
          fillOpacity: 0,
          marker: { enabled: false },
          tooltip: {
            renderer: (params: any) => ({
              content: `$${params.datum.semanaPasada?.toLocaleString('es-AR') ?? '—'}`,
              title: params.datum.hora,
            }),
          },
        },
        {
          type: 'area',
          xKey: 'hora',
          yKey: 'ventasHoy',
          yName: 'Ventas Hoy',
          stroke: '#F27920',
          strokeWidth: 2.5,
          fill: '#F27920',
          fillOpacity: 0.08,
          marker: { enabled: false },
          tooltip: {
            renderer: (params: any) => ({
              content: `$${params.datum.ventasHoy?.toLocaleString('es-AR') ?? '—'}`,
              title: params.datum.hora,
            }),
          },
          connectMissingData: false,
        },
        {
          type: 'area',
          xKey: 'hora',
          yKey: 'prediccionIA',
          yName: 'Prediccion IA',
          stroke: '#314158',
          strokeWidth: 2,
          fill: '#314158',
          fillOpacity: 0.08,
          marker: { enabled: false },
          tooltip: {
            renderer: (params: any) => ({
              content: `$${params.datum.prediccionIA?.toLocaleString('es-AR') ?? '—'}`,
              title: params.datum.hora,
            }),
          },
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          label: {
            color: '#90A1B9',
            fontSize: 11,
          },
          line: { color: '#E2E8F0' },
          gridLine: { enabled: false },
        },
        {
          type: 'number',
          position: 'left',
          label: {
            color: '#90A1B9',
            fontSize: 11,
            formatter: (params: any) => {
              const val = params.value;
              if (val >= 1000) {
                return `$${(val / 1000).toFixed(0)}k`;
              }
              return `$${val}`;
            },
          },
          line: { enabled: false },
          gridLine: {
            style: [{ stroke: '#F1F5F9', lineDash: [4, 4] }],
          },
        },
      ],
      legend: {
        position: 'top',
        spacing: 24,
        item: {
          marker: { size: 8 },
          label: {
            color: '#64748B',
            fontSize: 12,
          },
        },
      },
    } as unknown as AgChartOptions;
  });

  private transformData(forecast: DemandForecast | null): ChartDataPoint[] {
    if (!forecast || !forecast.series.length) {
      return [];
    }

    const semanaPasada = this.findSeries(forecast.series, 'Semana Pasada');
    const ventasHoy = this.findSeries(forecast.series, 'Ventas Hoy');
    const prediccionIA = this.findSeries(forecast.series, 'Prediccion IA');

    const horas = semanaPasada?.datos ?? ventasHoy?.datos ?? prediccionIA?.datos ?? [];

    return horas.map((_, i) => ({
      hora: horas[i].hora,
      semanaPasada: semanaPasada?.datos[i]?.valor ?? null,
      ventasHoy: this.getActiveValue(ventasHoy?.datos[i]?.valor ?? null),
      prediccionIA: prediccionIA?.datos[i]?.valor ?? null,
    }));
  }

  private findSeries(series: DemandSeries[], nombre: string): DemandSeries | undefined {
    return series.find(s => s.nombre === nombre);
  }

  /** Filter out zero values for "Ventas Hoy" so the line stops at current time */
  private getActiveValue(valor: number | null): number | null {
    if (valor === null || valor === 0) {
      return null;
    }
    return valor;
  }
}
