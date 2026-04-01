export interface TopVenta {
  posicion: number;
  productoId: string;
  nombre: string;
  imagen: string | null;
  cantidadPedidos: number;
  montoTotal?: number;
  tendencia: TopVentaTendencia;
  variacionPct?: number;
}

export type TopVentaTendencia = 'SUBE' | 'BAJA' | 'ESTABLE';
