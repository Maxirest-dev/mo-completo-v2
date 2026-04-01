import { KpiVariacion } from '../../../models/kpi.model';
import { KpiComparisonBadge, KpiRenderStrategy } from './kpi-strategy.interface';

export class CurrencyKpiStrategy implements KpiRenderStrategy {

  private readonly templateId: 'sparkline' | 'trend-arrow';

  constructor(templateId: 'sparkline' | 'trend-arrow' = 'sparkline') {
    this.templateId = templateId;
  }

  formatValue(value: number): string {
    const intPart = Math.round(value).toString();
    const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$${formatted}`;
  }

  getTemplateId(): 'sparkline' | 'trend-arrow' {
    return this.templateId;
  }

  getCssClass(): string {
    return 'kpi-currency';
  }

  getComparisonBadge(variacion: KpiVariacion): KpiComparisonBadge | null {
    if (!variacion) return null;

    const isPositive = variacion.direccion === 'up';
    const sign = isPositive ? '+' : '-';
    const text = `${sign}${Math.abs(variacion.valor)}% ${variacion.periodo}`;
    const cssClass = isPositive ? 'badge-positive' : 'badge-negative';

    return { text, cssClass };
  }
}
