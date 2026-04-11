// === SHARED ===
export type TabTesoreria = 'disponibilidades' | 'movimientos' | 'conciliacion' | 'agenda' | 'cashflow';

export type PeriodoPreset = 'hoy' | 'semana' | 'mes' | 'anio' | 'personalizado';

export interface FiltroTesoreria {
  periodo: PeriodoPreset;
  fechaDesde: string;
  fechaHasta: string;
  categoria: string;
}

// === DISPONIBILIDADES ===
export interface CuentaDisponibilidad {
  nombre: string;
  saldo: number;
  trend: number;
  trendLabel: string;
  color: string;
}

export interface SaldoConsolidado {
  total: number;
  cuentas: { nombre: string; monto: number; porcentaje: number; color: string }[];
}

export interface EvolucionMes {
  mes: string;
  cajaSalon: number;
  cajaAdmin: number;
  bancos: number;
  billeteras: number;
}

export interface DistribucionCuenta {
  nombre: string;
  monto: number;
  porcentaje: number;
  color: string;
}

// === MOVIMIENTOS ===
export interface Movimiento {
  id: string;
  fecha: string;
  cuenta: string;
  categoria: string;
  descripcion: string;
  referencia: string;
  monto: number;
  tipo: 'Ingreso' | 'Egreso' | 'Transferencia';
  estado: 'Confirmado' | 'Pendiente' | 'Anulado';
}

// === CONCILIACION ===
export interface KpiConciliacion {
  label: string;
  value: number;
  subtitle: string;
  trend: number;
  trendLabel: string;
}

export interface CuponPendiente {
  id: string;
  fecha: string;
  medioPago: string;
  lote: string;
  bruto: number;
  comision: number;
  neto: number;
  estado: 'Pendiente' | 'Acreditado' | 'Rechazado';
  fechaAcreditacion: string;
}

export interface ResumenApp {
  plataforma: string;
  monto: number;
  detalle: string;
  estado: 'Pendiente' | 'En proceso' | 'Acreditado';
}

// === AGENDA DE PAGOS ===
export interface KpiAgenda {
  label: string;
  value: number;
  subtitle: string;
  color: string;
  bgColor: string;
}

export interface FacturaPendiente {
  id: string;
  proveedor: string;
  nroFactura: string;
  fechaVencimiento: string;
  monto: number;
  estado: 'Pendiente' | 'Vencida' | 'Pagada' | 'Parcial';
  cuentaOrigen?: string;
}

// === CASH FLOW ===
export type HorizonteProyeccion = 7 | 15 | 30;

export interface KpiCashFlow {
  label: string;
  value: number;
  operador: '+' | '-' | '=';
  color?: string;
  bgColor?: string;
}

export interface ProyeccionDiaria {
  fecha: string;
  detalle: string;
  entradas: number | null;
  salidas: number | null;
  saldoAcumulado: number;
  esAlerta?: boolean;
}

export interface AlertaCashFlow {
  tipo: 'liquidez' | 'factura' | 'cobro' | 'pendiente';
  severidad: 'critica' | 'alta' | 'media' | 'info';
  titulo: string;
  descripcion: string;
}
