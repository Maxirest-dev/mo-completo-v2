export interface VentaResumen {
  total: number;
  operaciones: number;
  promedio: number;
  variacion: number;
}

export interface ArticuloVenta {
  cod: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  precioUnit: number;
  subtotal: number;
  descuento: number;
  total: number;
  estado: 'Activo' | 'Inactivo';
}

export interface FormaCobro {
  nombre: string;
  total: number;
  porcentaje: number;
  operaciones: number;
  color: string;
  estado: 'Activo' | 'Inactivo';
}

export interface ComprobanteVenta {
  tipo: string;
  total: number;
  operaciones: number;
  promedio: number;
  color: string;
}

export interface ConceptoVenta {
  cod: string;
  forma: string;
  vuelto: number;
  subtotal: number;
  descuento: number;
  total: number;
  volumen: number;
  descuentoPct: number;
  adherencia: string;
}

export interface CategoriaVenta {
  nombre: string;
  total: number;
  color: string;
}

export interface MovimientoHora {
  hora: number;
  salon: number;
  delivery: number;
  takeaway: number;
}

export interface VentaComprobante {
  numero: string;
  tipo: string;
  fecha: string;
  cliente: string;
  formaCobro: string;
  subtotal: number;
  descuento: number;
  total: number;
}

export type TabVentas = 'dashboard' | 'articulos' | 'formasCobro' | 'comprobantes' | 'conceptos';

export interface FiltroVentas {
  fechaDesde: string;
  fechaHasta: string;
  turno: 'todos' | 'manana' | 'tarde' | 'noche';
}
