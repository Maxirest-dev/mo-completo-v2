import { KpiVariacion } from '../../../models/kpi.model';
import { KpiComparisonBadge, KpiRenderStrategy } from './kpi-strategy.interface';

export class PercentageKpiStrategy implements KpiRenderStrategy {

  formatValue(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  getTemplateId(): 'heatbar' {
    return 'heatbar';
  }

  getCssClass(): string {
    return 'kpi-percentage';
  }

  getComparisonBadge(variacion: KpiVariacion): KpiComparisonBadge | null {
    if (!variacion) return null;

    const value = variacion.valor;

    // Food Cost thresholds: <30% is on target, >=35% is out of range
    if (value < 30) {
      return { text: 'En objetivo', cssClass: 'badge-positive' };
    }
    if (value >= 35) {
      return { text: 'Fuera de rango', cssClass: 'badge-negative' };
    }

    // Between 30-35%: warning zone
    return { text: 'Precaucion', cssClass: 'badge-warning' };
  }
}
