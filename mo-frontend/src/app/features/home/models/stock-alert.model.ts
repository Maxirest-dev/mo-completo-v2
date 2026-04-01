export interface StockAlert {
  insumoId: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  porcentaje: number;
  estado: StockAlertEstado;
  unidad: string;
  depositoNombre?: string;
}

export type StockAlertEstado = 'CRITICO' | 'BAJO' | 'NORMAL';
