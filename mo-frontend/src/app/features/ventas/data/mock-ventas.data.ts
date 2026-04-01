import {
  VentaResumen, ArticuloVenta, FormaCobro, ComprobanteVenta,
  ConceptoVenta, CategoriaVenta, MovimientoHora, VentaComprobante,
} from '../models/ventas.model';

export const MOCK_RESUMEN_VENTAS: VentaResumen = {
  total: 1501089, operaciones: 35, promedio: 123045, variacion: 12.5,
};

export const MOCK_RESUMEN_FORMAS: VentaResumen = {
  total: 15000, operaciones: 3, promedio: 23045, variacion: -3.2,
};

export const MOCK_RESUMEN_OTROS: VentaResumen = {
  total: 1501089, operaciones: 35, promedio: 123045, variacion: 8.1,
};

export const MOCK_FORMAS_COBRO: FormaCobro[] = [
  { nombre: 'Efectivo', total: 523295, porcentaje: 34.9, operaciones: 12, color: '#3B82F6', estado: 'Activo' },
  { nombre: 'MercadoPago', total: 318076, porcentaje: 21.2, operaciones: 8, color: '#10B981', estado: 'Activo' },
  { nombre: 'Tarjeta', total: 245890, porcentaje: 16.4, operaciones: 5, color: '#F59E0B', estado: 'Activo' },
  { nombre: 'PedidosYa', total: 178432, porcentaje: 11.9, operaciones: 4, color: '#EF4444', estado: 'Activo' },
  { nombre: 'Cuenta corriente', total: 112500, porcentaje: 7.5, operaciones: 3, color: '#8B5CF6', estado: 'Activo' },
  { nombre: 'Rappipay', total: 74896, porcentaje: 5.0, operaciones: 2, color: '#EC4899', estado: 'Activo' },
  { nombre: 'Cheques', total: 48000, porcentaje: 3.1, operaciones: 1, color: '#06B6D4', estado: 'Inactivo' },
];

export const MOCK_ARTICULOS: ArticuloVenta[] = [
  { cod: 'TAB-01', nombre: 'Tabla 0', categoria: 'Entradas', cantidad: 45, precioUnit: 14500, subtotal: 652500, descuento: 0, total: 652500, estado: 'Activo' },
  { cod: 'BRV-01', nombre: 'Brevaje', categoria: 'Bebidas', cantidad: 38, precioUnit: 8500, subtotal: 323000, descuento: 12350, total: 310650, estado: 'Activo' },
  { cod: 'PIZ-03', nombre: 'Pizza MP3', categoria: 'Pizzas', cantidad: 32, precioUnit: 12000, subtotal: 384000, descuento: 0, total: 384000, estado: 'Activo' },
  { cod: 'GUA-01', nombre: 'Guatf', categoria: 'Carnes', cantidad: 28, precioUnit: 18500, subtotal: 518000, descuento: 25900, total: 492100, estado: 'Activo' },
  { cod: 'PLA-01', nombre: 'Plaster', categoria: 'Pastas', cantidad: 22, precioUnit: 13200, subtotal: 290400, descuento: 0, total: 290400, estado: 'Activo' },
  { cod: 'ZER-01', nombre: 'Zeretes', categoria: 'Postres', cantidad: 18, precioUnit: 9800, subtotal: 176400, descuento: 8820, total: 167580, estado: 'Activo' },
  { cod: 'LOM-01', nombre: 'Lomo a la Pimienta', categoria: 'Carnes', cantidad: 15, precioUnit: 22000, subtotal: 330000, descuento: 0, total: 330000, estado: 'Activo' },
  { cod: 'ENS-02', nombre: 'Ensalada Caesar', categoria: 'Entradas', cantidad: 12, precioUnit: 8900, subtotal: 106800, descuento: 5340, total: 101460, estado: 'Inactivo' },
];

export const MOCK_COMPROBANTES: ComprobanteVenta[] = [
  { tipo: 'Factura A', total: 317355, operaciones: 3, promedio: 105785, color: '#3B82F6' },
  { tipo: 'Factura B', total: 296000, operaciones: 3, promedio: 98667, color: '#8B5CF6' },
  { tipo: 'Ticket Fiscal', total: 182655, operaciones: 10, promedio: 91328, color: '#10B981' },
  { tipo: 'Nota de Credito', total: 172000, operaciones: 2, promedio: 86000, color: '#F59E0B' },
];

export const MOCK_CONCEPTOS: ConceptoVenta[] = [
  { cod: 'SAL', forma: 'Salon', vuelto: 0, subtotal: 845000, descuento: 42250, total: 802750, volumen: 412, descuentoPct: 5.0, adherencia: 'Normal' },
  { cod: 'BRV', forma: 'Brevaje', vuelto: 0, subtotal: 323000, descuento: 12350, total: 310650, volumen: 186, descuentoPct: 3.8, adherencia: 'Normal' },
  { cod: 'DLV', forma: 'Delivery', vuelto: 0, subtotal: 298500, descuento: 0, total: 298500, volumen: 95, descuentoPct: 0, adherencia: 'Alto' },
  { cod: 'TAK', forma: 'Take Away', vuelto: 0, subtotal: 156000, descuento: 7800, total: 148200, volumen: 72, descuentoPct: 5.0, adherencia: 'Bajo' },
  { cod: 'EVT', forma: 'Eventos', vuelto: 0, subtotal: 89000, descuento: 0, total: 89000, volumen: 3, descuentoPct: 0, adherencia: 'Normal' },
];

export const MOCK_CATEGORIAS: CategoriaVenta[] = [
  { nombre: 'Entradas', total: 753960, color: '#3B82F6' },
  { nombre: 'Carnes', total: 822100, color: '#10B981' },
  { nombre: 'Pizzas', total: 384000, color: '#F59E0B' },
  { nombre: 'Pastas', total: 290400, color: '#8B5CF6' },
  { nombre: 'Bebidas', total: 310650, color: '#EC4899' },
  { nombre: 'Postres', total: 167580, color: '#06B6D4' },
];

export const MOCK_MOVIMIENTOS_HORA: MovimientoHora[] = [
  { hora: 8, salon: 2, delivery: 0, takeaway: 1 },
  { hora: 9, salon: 5, delivery: 1, takeaway: 2 },
  { hora: 10, salon: 8, delivery: 2, takeaway: 3 },
  { hora: 11, salon: 15, delivery: 5, takeaway: 4 },
  { hora: 12, salon: 28, delivery: 12, takeaway: 8 },
  { hora: 13, salon: 35, delivery: 18, takeaway: 10 },
  { hora: 14, salon: 22, delivery: 10, takeaway: 6 },
  { hora: 15, salon: 12, delivery: 5, takeaway: 3 },
  { hora: 16, salon: 8, delivery: 3, takeaway: 2 },
  { hora: 17, salon: 10, delivery: 4, takeaway: 3 },
  { hora: 18, salon: 15, delivery: 6, takeaway: 4 },
  { hora: 19, salon: 25, delivery: 14, takeaway: 7 },
  { hora: 20, salon: 38, delivery: 22, takeaway: 12 },
  { hora: 21, salon: 42, delivery: 25, takeaway: 14 },
  { hora: 22, salon: 30, delivery: 15, takeaway: 8 },
  { hora: 23, salon: 15, delivery: 8, takeaway: 4 },
  { hora: 0, salon: 5, delivery: 2, takeaway: 1 },
];

// Turno filter helpers
export const MOCK_VENTAS_COMPROBANTES: VentaComprobante[] = [
  { numero: 'FA-0001-00234', tipo: 'Factura A', fecha: '2026-03-31', cliente: 'Restaurante El Sol', formaCobro: 'Efectivo', subtotal: 125000, descuento: 0, total: 125000 },
  { numero: 'FA-0001-00235', tipo: 'Factura A', fecha: '2026-03-31', cliente: 'Bar La Esquina', formaCobro: 'MercadoPago', subtotal: 98500, descuento: 4925, total: 93575 },
  { numero: 'FA-0001-00236', tipo: 'Factura A', fecha: '2026-03-30', cliente: 'Catering Eventos SA', formaCobro: 'Tarjeta', subtotal: 103700, descuento: 4920, total: 98780 },
  { numero: 'FB-0001-00412', tipo: 'Factura B', fecha: '2026-03-31', cliente: 'Consumidor Final', formaCobro: 'Efectivo', subtotal: 45800, descuento: 0, total: 45800 },
  { numero: 'FB-0001-00413', tipo: 'Factura B', fecha: '2026-03-31', cliente: 'Consumidor Final', formaCobro: 'MercadoPago', subtotal: 128000, descuento: 6400, total: 121600 },
  { numero: 'FB-0001-00414', tipo: 'Factura B', fecha: '2026-03-30', cliente: 'Consumidor Final', formaCobro: 'PedidosYa', subtotal: 135200, descuento: 6760, total: 128440 },
  { numero: 'TF-0001-00891', tipo: 'Ticket Fiscal', fecha: '2026-03-31', cliente: 'Consumidor Final', formaCobro: 'Efectivo', subtotal: 22400, descuento: 0, total: 22400 },
  { numero: 'TF-0001-00892', tipo: 'Ticket Fiscal', fecha: '2026-03-31', cliente: 'Consumidor Final', formaCobro: 'Tarjeta', subtotal: 18900, descuento: 0, total: 18900 },
  { numero: 'TF-0001-00893', tipo: 'Ticket Fiscal', fecha: '2026-03-30', cliente: 'Consumidor Final', formaCobro: 'Efectivo', subtotal: 35600, descuento: 1780, total: 33820 },
  { numero: 'TF-0001-00894', tipo: 'Ticket Fiscal', fecha: '2026-03-30', cliente: 'Consumidor Final', formaCobro: 'MercadoPago', subtotal: 28750, descuento: 0, total: 28750 },
  { numero: 'TF-0001-00895', tipo: 'Ticket Fiscal', fecha: '2026-03-29', cliente: 'Consumidor Final', formaCobro: 'Rappipay', subtotal: 42300, descuento: 2115, total: 40185 },
  { numero: 'TF-0001-00896', tipo: 'Ticket Fiscal', fecha: '2026-03-29', cliente: 'Consumidor Final', formaCobro: 'Efectivo', subtotal: 15800, descuento: 0, total: 15800 },
  { numero: 'TF-0001-00897', tipo: 'Ticket Fiscal', fecha: '2026-03-28', cliente: 'Consumidor Final', formaCobro: 'Tarjeta', subtotal: 24500, descuento: 1225, total: 23275 },
  { numero: 'NC-0001-00045', tipo: 'Nota de Credito', fecha: '2026-03-31', cliente: 'Bar La Esquina', formaCobro: 'MercadoPago', subtotal: 86000, descuento: 0, total: 86000 },
  { numero: 'NC-0001-00046', tipo: 'Nota de Credito', fecha: '2026-03-29', cliente: 'Consumidor Final', formaCobro: 'Efectivo', subtotal: 86000, descuento: 0, total: 86000 },
];

export function filterByTurno(data: MovimientoHora[], turno: string): MovimientoHora[] {
  if (turno === 'todos') return data;
  if (turno === 'manana') return data.filter(m => m.hora >= 6 && m.hora < 14);
  if (turno === 'tarde') return data.filter(m => m.hora >= 14 && m.hora < 22);
  if (turno === 'noche') return data.filter(m => m.hora >= 22 || m.hora < 6);
  return data;
}
