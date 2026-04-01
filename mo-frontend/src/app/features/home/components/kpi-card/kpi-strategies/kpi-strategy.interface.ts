import { KpiVariacion } from '../../../models/kpi.model';

export interface KpiComparisonBadge {
  text: string;
  cssClass: string;
}

export interface KpiRenderStrategy {
  formatValue(value: number): string;
  getTemplateId(): 'sparkline' | 'heatbar' | 'gauge' | 'trend-arrow';
  getCssClass(): string;
  getComparisonBadge(variacion: KpiVariacion): KpiComparisonBadge | null;
}
