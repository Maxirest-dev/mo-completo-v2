import { KpiVariacion } from '../../../models/kpi.model';
import { KpiComparisonBadge, KpiRenderStrategy } from './kpi-strategy.interface';

export class GaugeKpiStrategy implements KpiRenderStrategy {

  formatValue(value: number): string {
    return `${Math.round(value)}%`;
  }

  getTemplateId(): 'gauge' {
    return 'gauge';
  }

  getCssClass(): string {
    return 'kpi-gauge';
  }

  getComparisonBadge(_variacion: KpiVariacion): KpiComparisonBadge | null {
    // Gauge (Estado del Salon) does not show comparison badge
    return null;
  }
}
