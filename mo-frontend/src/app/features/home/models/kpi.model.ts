export interface KpiData {
  id: string;
  titulo: string;
  valor: number;
  unidad: KpiUnidad;
  tipo: KpiTipo;
  variacion: KpiVariacion;
  metadata?: Record<string, unknown>;
}

export interface KpiVariacion {
  valor: number;
  direccion: KpiDireccion;
  periodo: string;
  valorAnterior?: number;
}

export type KpiUnidad = 'ARS' | 'PORCENTAJE' | 'CANTIDAD' | 'GAUGE';

export type KpiTipo = 'currency' | 'percentage' | 'gauge' | 'number';

export type KpiDireccion = 'up' | 'down' | 'neutral';

export interface KpisDashboard {
  turnoId: string;
  turnoNombre: string;
  timestamp: string;
  kpis: KpiData[];
}
