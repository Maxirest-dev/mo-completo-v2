export type EstadoDescuento = 'ACTIVA' | 'ON_HOLD';

export type DescuentoFiltroTipo = 'todas' | 'activas' | 'onHold';

export type TipoDescuento = 'porcentaje' | 'importe';

export interface DescuentoProducto {
  id: number;
  codigoBusqueda: string;
  nombre: string;
  precioOriginal: number;
  precioConDescuento: number;
}

export interface Descuento {
  id: number;
  codigo: number;
  nombre: string;
  tipoDescuento: TipoDescuento;
  cantidad: number;
  estado: EstadoDescuento;
  grupo: string;
  productos: DescuentoProducto[];
}

export interface DescuentoFilterContadores {
  todas: number;
  activas: number;
  onHold: number;
}

export interface DescuentoFormData {
  nombre: string;
  tipoDescuento: TipoDescuento;
  cantidad: number;
}
