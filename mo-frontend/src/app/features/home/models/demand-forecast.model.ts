export interface DemandForecast {
  fecha: string;
  series: DemandSeries[];
}

export interface DemandSeries {
  nombre: DemandSeriesNombre;
  datos: DemandPoint[];
  estilo: DemandSeriesEstilo;
}

export interface DemandPoint {
  hora: string;
  valor: number;
}

export type DemandSeriesNombre = 'Semana Pasada' | 'Ventas Hoy' | 'Prediccion IA';

export type DemandSeriesEstilo = 'solid' | 'dashed' | 'area';
