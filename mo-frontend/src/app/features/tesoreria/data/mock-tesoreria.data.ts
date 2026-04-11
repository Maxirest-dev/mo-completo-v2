import {
  CuentaDisponibilidad, SaldoConsolidado, EvolucionMes, DistribucionCuenta,
  Movimiento,
  KpiConciliacion, CuponPendiente, ResumenApp,
  KpiAgenda, FacturaPendiente,
  KpiCashFlow, ProyeccionDiaria, AlertaCashFlow,
} from '../models';

// ==============================
// DISPONIBILIDADES
// ==============================

export const MOCK_CUENTAS: CuentaDisponibilidad[] = [
  { nombre: 'Caja Salón', saldo: 284500, trend: 5.2, trendLabel: '↑ 5.2%', color: '#22C55E' },
  { nombre: 'Caja Administración', saldo: 560700, trend: -2.1, trendLabel: '↓ 2.1%', color: '#3B82F6' },
  { nombre: 'Bancos', saldo: 2156800, trend: 8.4, trendLabel: '↑ 8.4%', color: '#8B5CF6' },
  { nombre: 'Billeteras Virtuales', saldo: 198300, trend: 15.3, trendLabel: '↑ 15.3%', color: '#F97316' },
];

export const MOCK_SALDO_CONSOLIDADO: SaldoConsolidado = {
  total: 3200300,
  cuentas: [
    { nombre: 'Caja Salón', monto: 284500, porcentaje: 8.9, color: '#22C55E' },
    { nombre: 'Caja Admin', monto: 560700, porcentaje: 17.5, color: '#3B82F6' },
    { nombre: 'Bancos', monto: 2156800, porcentaje: 67.4, color: '#8B5CF6' },
    { nombre: 'Billeteras', monto: 198300, porcentaje: 6.2, color: '#F97316' },
  ],
};

export const MOCK_EVOLUCION: EvolucionMes[] = [
  { mes: 'Oct', cajaSalon: 220000, cajaAdmin: 480000, bancos: 1800000, billeteras: 150000 },
  { mes: 'Nov', cajaSalon: 250000, cajaAdmin: 510000, bancos: 1900000, billeteras: 165000 },
  { mes: 'Dic', cajaSalon: 310000, cajaAdmin: 590000, bancos: 2100000, billeteras: 180000 },
  { mes: 'Ene', cajaSalon: 270000, cajaAdmin: 540000, bancos: 2000000, billeteras: 170000 },
  { mes: 'Feb', cajaSalon: 290000, cajaAdmin: 550000, bancos: 2080000, billeteras: 185000 },
  { mes: 'Mar', cajaSalon: 284500, cajaAdmin: 560700, bancos: 2156800, billeteras: 198300 },
];

export const MOCK_DISTRIBUCION: DistribucionCuenta[] = [
  { nombre: 'Caja Salón', monto: 284500, porcentaje: 8.9, color: '#22C55E' },
  { nombre: 'Caja Admin', monto: 560700, porcentaje: 17.5, color: '#3B82F6' },
  { nombre: 'Bancos', monto: 2156800, porcentaje: 67.4, color: '#8B5CF6' },
  { nombre: 'Billeteras', monto: 198300, porcentaje: 6.2, color: '#F97316' },
];

// ==============================
// MOVIMIENTOS
// ==============================

export const MOCK_MOVIMIENTOS: Movimiento[] = [
  { id: 'mov-001', fecha: '11/04/2026', cuenta: 'Caja Salón', categoria: 'Ventas/Cobros', descripcion: 'Ingreso de caja cierre salón diurno', referencia: '', monto: 185400, tipo: 'Ingreso', estado: 'Confirmado' },
  { id: 'mov-002', fecha: '10/04/2026', cuenta: 'Banco Galicia', categoria: 'Proveedores', descripcion: 'Pago fact. proveedor ABC Carnes', referencia: '', monto: -142500, tipo: 'Egreso', estado: 'Confirmado' },
  { id: 'mov-003', fecha: '09/04/2026', cuenta: 'Caja Admin', categoria: 'Servicios', descripcion: 'Pago servicio luz abril', referencia: 'Ref: Edenor', monto: -28300, tipo: 'Egreso', estado: 'Confirmado' },
  { id: 'mov-004', fecha: '08/04/2026', cuenta: 'MercadoPago', categoria: 'Ventas/Cobros', descripcion: 'Acreditación MercadoPago lote #4521', referencia: '', monto: 67200, tipo: 'Ingreso', estado: 'Pendiente' },
  { id: 'mov-005', fecha: '07/04/2026', cuenta: 'Caja Salón', categoria: 'Retiro Socios', descripcion: 'Retiro socio gerente semanal', referencia: '', monto: -50000, tipo: 'Egreso', estado: 'Confirmado' },
  { id: 'mov-006', fecha: '05/04/2026', cuenta: 'Banco Nación', categoria: 'Sueldos', descripcion: 'Depósito sueldos marzo personal', referencia: '', monto: -415000, tipo: 'Egreso', estado: 'Confirmado' },
  { id: 'mov-007', fecha: '04/04/2026', cuenta: 'Caja Admin', categoria: 'Transferencia', descripcion: 'Transferencia interna Caja Salón → Admin', referencia: '', monto: 120000, tipo: 'Transferencia', estado: 'Confirmado' },
];

// ==============================
// CONCILIACION
// ==============================

export const MOCK_KPI_CONCILIACION: KpiConciliacion[] = [
  { label: 'Pendientes Cupones', value: 487200, subtitle: '34 cupones', trend: -12, trendLabel: '↓ 12%' },
  { label: 'Pendientes Apps Delivery', value: 312500, subtitle: '3 plataformas', trend: 8, trendLabel: '↑ 8%' },
  { label: 'Conciliado del mes', value: 2845600, subtitle: '186 operaciones', trend: 22, trendLabel: '↑ 22%' },
];

export const MOCK_CUPONES: CuponPendiente[] = [
  { id: 'cup-001', fecha: '10/04', medioPago: 'Visa Débito', lote: '845 VIP', bruto: 86147, comision: 1.5, neto: 84855, estado: 'Pendiente', fechaAcreditacion: '15/04' },
  { id: 'cup-002', fecha: '09/04', medioPago: 'Mastercard', lote: '420V', bruto: 113400, comision: 2.8, neto: 110225, estado: 'Acreditado', fechaAcreditacion: '14/04' },
  { id: 'cup-003', fecha: '08/04', medioPago: 'Visa Crédito', lote: '312', bruto: 95200, comision: 3.5, neto: 91868, estado: 'Pendiente', fechaAcreditacion: '18/04' },
  { id: 'cup-004', fecha: '07/04', medioPago: 'AMEX', lote: '156', bruto: 67450, comision: 4.2, neto: 64618, estado: 'Pendiente', fechaAcreditacion: '17/04' },
];

export const MOCK_APPS_RESUMEN: ResumenApp[] = [
  { plataforma: 'Rappi', monto: 142300, detalle: 'Acum. desde 01/04', estado: 'Pendiente' },
  { plataforma: 'PedidosYa', monto: 98750, detalle: 'Acum. desde 05/04', estado: 'En proceso' },
  { plataforma: 'MercadoPago', monto: 71450, detalle: 'Liquidación parcial', estado: 'Acreditado' },
];

// ==============================
// AGENDA DE PAGOS
// ==============================

export const MOCK_KPI_AGENDA: KpiAgenda[] = [
  { label: 'Total Pendiente', value: 1234500, subtitle: '12 facturas pendientes', color: '#1155CC', bgColor: '#EFF6FF' },
  { label: 'Vence esta semana', value: 456800, subtitle: '4 fact. Prov. Galicia, CUIT', color: '#F97316', bgColor: '#FFF7ED' },
  { label: 'Pagados este mes', value: 2678300, subtitle: '18 facturas pagadas', color: '#22C55E', bgColor: '#F0FDF4' },
];

export const MOCK_FACTURAS_PENDIENTES: FacturaPendiente[] = [
  { id: 'fp-001', proveedor: 'Distribuidora Sur S.A.', nroFactura: 'A 0001-00012845', fechaVencimiento: '15/04/2026', monto: 245000, estado: 'Vencida' },
  { id: 'fp-002', proveedor: 'Frigorífico Norte', nroFactura: 'A 0002-00089234', fechaVencimiento: '18/04/2026', monto: 186400, estado: 'Pendiente' },
  { id: 'fp-003', proveedor: 'Bebidas Express', nroFactura: 'B 0001-00045678', fechaVencimiento: '20/04/2026', monto: 104300, estado: 'Pendiente' },
  { id: 'fp-004', proveedor: 'Verdulería Central', nroFactura: 'A 0001-00023456', fechaVencimiento: '22/04/2026', monto: 110000, estado: 'Pendiente' },
  { id: 'fp-005', proveedor: 'Lácteos del Plata', nroFactura: 'A 0003-00056789', fechaVencimiento: '25/04/2026', monto: 168800, estado: 'Pendiente' },
  { id: 'fp-006', proveedor: 'Pan Nacional SRL', nroFactura: 'B 0001-00067891', fechaVencimiento: '28/04/2026', monto: 81200, estado: 'Pendiente' },
];

// ==============================
// CASH FLOW
// ==============================

export const MOCK_KPI_CASHFLOW: KpiCashFlow[] = [
  { label: 'Saldo inicial hoy', value: 3200300, operador: '+' },
  { label: 'Cobros esperados', value: 487200, operador: '+' },
  { label: 'Pagos programados', value: 1234500, operador: '-' },
  { label: 'Saldo estimado 7 días', value: 2453000, operador: '=', color: '#22C55E', bgColor: '#ECFDF5' },
];

export const MOCK_PROYECCION_DIARIA: ProyeccionDiaria[] = [
  { fecha: '11/04 (Hoy)', detalle: 'Saldo Inicial', entradas: null, salidas: null, saldoAcumulado: 3200300 },
  { fecha: '12/04', detalle: 'Pago Distribuidora Sur', entradas: null, salidas: 245000, saldoAcumulado: 2955300 },
  { fecha: '13/04', detalle: 'Acreditación Visa lote #845', entradas: 84855, salidas: null, saldoAcumulado: 3040155 },
  { fecha: '14/04', detalle: 'Pago servicios (luz, gas, internet)', entradas: null, salidas: 52300, saldoAcumulado: 2987855 },
  { fecha: '15/04', detalle: 'Cobro Rappi + PedidosYa', entradas: 241050, salidas: null, saldoAcumulado: 3228905 },
  { fecha: '16/04', detalle: 'Pago sueldos quincena', entradas: null, salidas: 415000, saldoAcumulado: 2813905 },
  { fecha: '17/04', detalle: 'Acreditación AMEX lote #156', entradas: 64618, salidas: null, saldoAcumulado: 2878523 },
  { fecha: '18/04', detalle: 'Ajuste estimado acumulado', entradas: 856400, salidas: 1281923, saldoAcumulado: 2453000, esAlerta: false },
];

export const MOCK_ALERTAS_CASHFLOW: AlertaCashFlow[] = [
  { tipo: 'liquidez', severidad: 'info', titulo: 'Liquidez estable', descripcion: 'El saldo proyectado a 7 días se mantiene por encima del mínimo operativo ($500.000).' },
  { tipo: 'factura', severidad: 'alta', titulo: '3 facturas vencen esta semana', descripcion: 'Distribuidora Sur, Frigorífico Norte y Bebidas Express suman $535.700 en vencimientos.' },
  { tipo: 'cobro', severidad: 'media', titulo: 'Pendiente de acreditación', descripcion: '4 cupones de tarjeta por $342.566 pendientes de cobro entre el 15 y 18 de abril.' },
  { tipo: 'pendiente', severidad: 'alta', titulo: 'Cobros pendientes apps', descripcion: 'Rappi y PedidosYa acumulan $241.050 sin liquidar desde hace más de 5 días.' },
];
