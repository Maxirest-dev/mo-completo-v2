// ============================================================
// Enums
// ============================================================

export type EstadoOrden = 'Pendiente' | 'Pedida' | 'Recibida' | 'Facturada' | 'Pagada';
export type TipoComprobante = 'Orden' | 'Factura';
export type TipoFactura = 'Factura A' | 'Factura B' | 'Factura C' | 'Ticket Fiscal';
export type EstadoInsumo = 'Activo' | 'Inactivo' | 'StockBajo' | 'SinStock';
export type AlicuotaIVA = 21 | 10.5 | 27 | 0;
export type DescuentoTipo = 'porcentaje' | 'monto';
export type CondicionPago = 'Contado' | '7 días' | '15 días' | '30 días' | '60 días';
export type CondicionIVA = 'Responsable Inscripto' | 'Monotributo' | 'Exento' | 'Consumidor Final';
export type VistaActiva = 'ordenes' | 'proveedores' | 'configuracion';
export type LineaItemTipo = 'insumo' | 'concepto';

// ============================================================
// Interfaces
// ============================================================

export type TipoProveedor = 'Carnes' | 'Lácteos' | 'Verduras' | 'Bebidas' | 'Panadería' | 'Limpieza' | 'Pescados' | 'Condimentos' | 'Aceites' | 'Descartables' | 'Harinas' | 'Congelados' | 'Papelería' | 'Distribuidora';

export interface Proveedor {
  id: number;
  codigo: string;
  nombre: string;
  razonSocial: string;
  cuit: string;
  email: string;
  telefono: string;
  direccion: string;
  condicionIVA: CondicionIVA;
  diasCredito: number;
  activo: boolean;
  tipo: TipoProveedor;
  pedidosRealizados: number;
  conceptoGastoId: number | null;
}

export interface CategoriaInsumo {
  id: number;
  nombre: string;
}

export interface Insumo {
  id: number;
  codigo: string;
  nombre: string;
  categoriaId: number;
  categoria: string;
  unidadMedida: string;
  stockActual: number;
  stockMinimo: number;
  estado: EstadoInsumo;
  precioUnitario: number;
}

export interface OrdenProducto {
  id: number;
  insumoId: number;
  insumo: string;
  unidadMedida: string;
  stockActual: number;
  estado: EstadoInsumo;
  unidades: number;
  precioUnitario: number;
  precioTotal: number;
  tipo: LineaItemTipo;
  conceptoId: number | null;
  concepto: string | null;
  rubroId: number | null;
  rubro: string | null;
  alicuotaIVA: AlicuotaIVA;
  descuento: number;
  impuestosInternos: number;
}

export interface RubroConceptoGasto {
  id: number;
  nombre: string;
}

export interface ConceptoGasto {
  id: number;
  rubroId: number;
  rubro: string;
  nombre: string;
  activo: boolean;
}

export interface OrdenCompra {
  id: number;
  numero: string;
  puntoVenta: string;
  numeroComprobante: string;
  proveedorId: number;
  proveedor: string;
  tipo: TipoComprobante;
  tipoFactura: TipoFactura | null;
  estado: EstadoOrden;
  fechaCreacion: string;
  fechaPedido: string | null;
  fechaRecepcion: string | null;
  fechaVencimiento: string | null;
  observaciones: string;
  productos: OrdenProducto[];
  cantidadProductos: number;
  subtotal: number;
  total: number;
  // Campos de factura argentina
  netoGravado: number | null;
  montoIVA: number | null;
  percepcionIIBB: number | null;
  percepcionIVA: number | null;
  descuentoTipo: DescuentoTipo | null;
  descuentoPorcentaje: number | null;
  descuentoMonto: number | null;
  condicionPago: CondicionPago | null;
}

export interface ProyeccionPagosItem {
  monto: number;
  cantidadFacturas: number;
  porcentaje: number;
}

export interface ProyeccionPagos {
  estaSemana: ProyeccionPagosItem;
  proximos30Dias: ProyeccionPagosItem;
  vencidas: ProyeccionPagosItem;
}

export interface ConteosPorEstado {
  todas: number;
  pendientes: number;
  pedidas: number;
  recibidas: number;
  facturadas: number;
  pagadas: number;
}

export interface ConteosInsumos {
  todos: number;
  activos: number;
  inactivos: number;
  stockBajo: number;
  sinStock: number;
}

// ============================================================
// Constants - Estado colors (para badges)
// ============================================================

export const ESTADO_ORDEN_COLORS: Record<EstadoOrden, { bg: string; text: string; dot: string }> = {
  'Pendiente':  { bg: 'var(--warning-bg)', text: '#92400E', dot: 'var(--warning-color)' },
  'Pedida':     { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  'Recibida':   { bg: 'var(--success-bg)', text: 'var(--success-text)', dot: 'var(--success-color)' },
  'Facturada':  { bg: '#EDE9FE', text: '#5B21B6', dot: '#8B5CF6' },
  'Pagada':     { bg: 'var(--success-bg)', text: 'var(--success-text)', dot: 'var(--success-color)' }
};

export const ESTADO_INSUMO_COLORS: Record<EstadoInsumo, { bg: string; text: string; dot: string }> = {
  'Activo':    { bg: 'var(--success-bg)', text: 'var(--success-text)', dot: 'var(--success-color)' },
  'Inactivo':  { bg: 'var(--slate-100)', text: 'var(--slate-600)', dot: 'var(--slate-500)' },
  'StockBajo': { bg: 'var(--warning-bg)', text: '#92400E', dot: 'var(--warning-color)' },
  'SinStock':  { bg: 'var(--danger-bg)', text: 'var(--danger-text)', dot: 'var(--danger-color)' }
};

// ============================================================
// Constants - Acciones por estado (que boton esta habilitado)
// ============================================================

export interface AccionEstado {
  label: string;
  siguienteEstado: EstadoOrden;
  habilitado: boolean;
}

export const ACCIONES_POR_ESTADO: Record<EstadoOrden, AccionEstado[]> = {
  'Pendiente': [
    { label: 'Pedido', siguienteEstado: 'Pedida', habilitado: true },
    { label: 'Recibo', siguienteEstado: 'Recibida', habilitado: false },
    { label: 'Factura', siguienteEstado: 'Facturada', habilitado: false },
    { label: 'Pagar', siguienteEstado: 'Pagada', habilitado: false }
  ],
  'Pedida': [
    { label: 'Pedido', siguienteEstado: 'Pedida', habilitado: false },
    { label: 'Recibo', siguienteEstado: 'Recibida', habilitado: true },
    { label: 'Factura', siguienteEstado: 'Facturada', habilitado: false },
    { label: 'Pagar', siguienteEstado: 'Pagada', habilitado: false }
  ],
  'Recibida': [
    { label: 'Pedido', siguienteEstado: 'Pedida', habilitado: false },
    { label: 'Recibo', siguienteEstado: 'Recibida', habilitado: false },
    { label: 'Factura', siguienteEstado: 'Facturada', habilitado: true },
    { label: 'Pagar', siguienteEstado: 'Pagada', habilitado: true }
  ],
  'Facturada': [
    { label: 'Pedido', siguienteEstado: 'Pedida', habilitado: true },
    { label: 'Recibo', siguienteEstado: 'Recibida', habilitado: true },
    { label: 'Factura', siguienteEstado: 'Facturada', habilitado: false },
    { label: 'Pagar', siguienteEstado: 'Pagada', habilitado: true }
  ],
  'Pagada': [
    { label: 'Pedido', siguienteEstado: 'Pedida', habilitado: false },
    { label: 'Recibo', siguienteEstado: 'Recibida', habilitado: false },
    { label: 'Factura', siguienteEstado: 'Facturada', habilitado: false },
    { label: 'Pagar', siguienteEstado: 'Pagada', habilitado: false }
  ]
};

// Filtros de estado para tabs
export const FILTROS_ESTADO: { label: string; value: EstadoOrden | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Pendientes', value: 'Pendiente' },
  { label: 'Pedidas', value: 'Pedida' },
  { label: 'Recibidas', value: 'Recibida' },
  { label: 'Facturadas', value: 'Facturada' },
  { label: 'Pagadas', value: 'Pagada' }
];

export const FILTROS_INSUMO: { label: string; value: EstadoInsumo | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Activos', value: 'Activo' },
  { label: 'Inactivos', value: 'Inactivo' },
  { label: 'Stock bajo', value: 'StockBajo' },
  { label: 'Sin stock', value: 'SinStock' }
];

export const ALICUOTAS_IVA: { value: AlicuotaIVA; label: string }[] = [
  { value: 21, label: '21%' },
  { value: 10.5, label: '10.5%' },
  { value: 27, label: '27%' },
  { value: 0, label: 'Exento (0%)' }
];

export const CONDICIONES_PAGO: { value: CondicionPago; label: string }[] = [
  { value: 'Contado', label: 'Contado' },
  { value: '7 días', label: '7 días' },
  { value: '15 días', label: '15 días' },
  { value: '30 días', label: '30 días' },
  { value: '60 días', label: '60 días' }
];

export type FiltroProveedor = 'todos' | 'activos' | 'inactivos';

export type FiltroConcepto = 'todos' | 'activos' | 'inactivos';

export interface ConteosProveedores {
  todos: number;
  activos: number;
  inactivos: number;
}

export interface ConteosConceptos {
  todos: number;
  activos: number;
  inactivos: number;
}

export const FILTROS_PROVEEDOR: { label: string; value: FiltroProveedor }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Activos', value: 'activos' },
  { label: 'Inactivos', value: 'inactivos' }
];

export const FILTROS_CONCEPTO: { label: string; value: FiltroConcepto }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Activos', value: 'activos' },
  { label: 'Inactivos', value: 'inactivos' }
];
