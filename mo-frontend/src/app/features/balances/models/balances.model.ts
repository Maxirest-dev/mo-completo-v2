// === SHARED ===
export type TabBalances = 'operativos' | 'economicos' | 'financieros' | 'fiscales';

export type PeriodoPreset = 'hoy' | 'semana' | 'mes' | 'anio' | 'personalizado';

export interface FiltroBalances {
  periodo: PeriodoPreset;
  fechaDesde: string;
  fechaHasta: string;
  turno: 'todos' | 'manana' | 'tarde' | 'noche';
  compararAnioAnterior: boolean;
  sucursalId?: string;
}

export interface Alerta {
  tipo: 'food-cost' | 'factura-vencida' | 'merma' | 'liquidez';
  severidad: 'critica' | 'alta' | 'media';
  titulo: string;
  descripcion: string;
  valor?: string;
  umbral?: string;
}

// === OPERATIVOS ===
export interface KpiOperativo {
  label: string;
  value: number;
  format: 'percent' | 'currency' | 'number';
  subtitle: string;
  trend: number;
  trendLabel: string;
}

export interface FoodCostMes {
  mes: string;
  real: number;
  ideal: number;
}

export interface BalanceInventario {
  stockInicial: number;
  compras: number;
  ventas: number;
  stockTeorico: number;
  stockReal: number;
  diferencia: number;
  valorizacion: number;
}

export interface MermaItem {
  producto: string;
  cantidad: string;
  costo: string;
  estado: 'Alerta' | 'Aceptable';
}

export interface CuadranteMenu {
  nombre: string;
  emoji: string;
  color: string;
  bgColor: string;
  items: number;
  descripcion: string;
  platos: string[];
}

// === ECONOMICOS ===
export interface PlRow {
  label: string;
  value: number;
  color: string;
  percentage: number;
  trend?: number;
}

export interface PuntoEquilibrio {
  porcentaje: number;
  ventasActuales: number;
  puntoEquilibrio: number;
}

export interface ResultadoMes {
  mes: string;
  resultado: number;
}

export interface GastoFijo {
  nombre: string;
  monto: number;
  porcentaje: number;
  color: string;
}

// === FINANCIEROS ===
export interface KpiFinanciero {
  label: string;
  hoy: number;
  dias30: number;
  total: number;
  trend: number;
  trendLabel: string;
}

export interface FlujoCajaMes {
  mes: string;
  efectivo: number;
  tarjetas: number;
  transferencias: number;
  pagoProveedores: number;
  impuestos: number;
  retirosSocios: number;
}

export interface PendienteApp {
  plataforma: string;
  monto: number;
  estado: 'Pendiente' | 'En proceso' | 'Cancelado';
}

export interface DeudaProveedor {
  proveedor: string;
  detalle: string;
  monto: number;
  fechaVencimiento: string;
  vencida: boolean;
}

// === FISCALES ===
export interface KpiFiscal {
  label: string;
  value: number;
  subtitle: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface SubdiarioIvaRow {
  id: string;
  fecha: string;
  puntoVenta: string;
  numero: string;
  tipo: string;
  cuit: string;
  razonSocial: string;
  netoGravado: number;
  iva105: number;
  iva21: number;
  impInternos: number;
  total: number;
  percepciones: number;
}

export interface MedioPago {
  nombre: string;
  monto: number;
  porcentaje: number;
  color: string;
}

export interface PercepcionItem {
  concepto: string;
  monto: number;
}
