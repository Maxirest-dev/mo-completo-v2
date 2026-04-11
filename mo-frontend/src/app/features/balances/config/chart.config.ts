import { Chart, registerables, ChartOptions } from 'chart.js';

Chart.register(...registerables);

export function createBarOptions(overrides?: Partial<ChartOptions<'bar'>>): ChartOptions<'bar'> {
  const base: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Inter', size: 11 },
          color: '#6B7280',
          usePointStyle: true,
          pointStyleWidth: 8,
          padding: 16,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#9CA3AF' },
      },
      y: {
        grid: { color: '#F3F4F6' },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#9CA3AF' },
        beginAtZero: true,
      },
    },
  };

  if (!overrides) return base;

  return {
    ...base,
    ...overrides,
    plugins: { ...base.plugins, ...overrides.plugins },
    scales: {
      ...base.scales,
      ...overrides.scales,
    },
  };
}

export const DONUT_OPTIONS: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
};
