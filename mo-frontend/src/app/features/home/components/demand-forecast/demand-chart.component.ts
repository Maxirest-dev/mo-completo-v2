import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { DemandForecast, DemandSeries } from '../../models';

Chart.register(...registerables);

@Component({
  selector: 'app-demand-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="demand-chart-wrapper">
      <canvas baseChart
        [type]="'line'"
        [data]="chartData()"
        [options]="chartOptions"
      ></canvas>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .demand-chart-wrapper {
      width: 100%;
      height: 250px;
      position: relative;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemandChartComponent {
  forecast = input.required<DemandForecast | null>();

  readonly chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#64748B',
          font: { size: 12, family: 'Inter' },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed.y;
            return ` ${ctx.dataset.label}: $${val?.toLocaleString('es-AR') ?? '—'}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#90A1B9', font: { size: 11, family: 'Inter' } },
        border: { color: '#E2E8F0' },
      },
      y: {
        grid: { color: '#F1F5F9' },
        border: { display: false },
        ticks: {
          color: '#90A1B9',
          font: { size: 11, family: 'Inter' },
          callback: (val) => {
            const v = Number(val);
            return v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`;
          },
        },
      },
    },
  };

  chartData = computed(() => {
    const fc = this.forecast();
    if (!fc || !fc.series.length) {
      return { labels: [] as string[], datasets: [] as any[] };
    }

    const semanaPasada = this.findSeries(fc.series, 'Semana Pasada');
    const ventasHoy = this.findSeries(fc.series, 'Ventas Hoy');
    const prediccionIA = this.findSeries(fc.series, 'Prediccion IA');

    const labels = (semanaPasada ?? ventasHoy ?? prediccionIA)!.datos.map(d => d.hora);

    return {
      labels,
      datasets: [
        {
          label: 'Semana Pasada',
          data: semanaPasada?.datos.map(d => d.valor) ?? [],
          borderColor: '#90A1B9',
          borderWidth: 2,
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.3,
        },
        {
          label: 'Ventas Hoy',
          data: ventasHoy?.datos.map(d => d.valor === 0 ? null : d.valor) ?? [],
          borderColor: '#F27920',
          borderWidth: 2.5,
          backgroundColor: 'rgba(242, 121, 32, 0.08)',
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.3,
          spanGaps: false,
        },
        {
          label: 'Prediccion IA',
          data: prediccionIA?.datos.map(d => d.valor) ?? [],
          borderColor: '#314158',
          borderWidth: 2,
          backgroundColor: 'rgba(49, 65, 88, 0.08)',
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.3,
        },
      ],
    };
  });

  private findSeries(series: DemandSeries[], nombre: string): DemandSeries | undefined {
    return series.find(s => s.nombre === nombre);
  }
}
