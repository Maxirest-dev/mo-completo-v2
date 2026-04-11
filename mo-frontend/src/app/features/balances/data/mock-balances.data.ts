import {
  KpiOperativo, FoodCostMes, BalanceInventario, MermaItem, CuadranteMenu,
  PlRow, PuntoEquilibrio, ResultadoMes, GastoFijo,
  KpiFinanciero, FlujoCajaMes, PendienteApp, DeudaProveedor,
  KpiFiscal, SubdiarioIvaRow, MedioPago, PercepcionItem, Alerta,
} from '../models';

// ==============================
// ALERTAS
// ==============================

export const MOCK_ALERTAS: Alerta[] = [
  {
    tipo: 'food-cost',
    severidad: 'critica',
    titulo: 'Food Cost por encima del umbral',
    descripcion: 'El Food Cost Real (28.5%) supera al Teórico (25.0%) en más de 3 puntos porcentuales.',
    valor: '28.5%',
    umbral: '25.0% + 3pp',
  },
  {
    tipo: 'factura-vencida',
    severidad: 'alta',
    titulo: '2 facturas de proveedores vencidas',
    descripcion: 'Distribuidora Sur y Bebidas Express tienen facturas vencidas sin pagar.',
  },
];

// ==============================
// OPERATIVOS
// ==============================

export const MOCK_KPI_OPERATIVOS: KpiOperativo[] = [
  {
    label: 'Food Cost Real',
    value: 28.5,
    format: 'percent',
    subtitle: 'vs Teórico: 25.0%',
    trend: -4.5,
    trendLabel: '↓ 4.5pp',
  },
  {
    label: 'Mermas del Período',
    value: 45200,
    format: 'currency',
    subtitle: '32 items, 6 con alerta',
    trend: 12,
    trendLabel: '↑ 12%',
  },
  {
    label: 'Rotación Stock',
    value: 892340,
    format: 'currency',
    subtitle: '156 items en stock',
    trend: -3.1,
    trendLabel: '↓ 3.1%',
  },
];

export const MOCK_FOOD_COST_MESES: FoodCostMes[] = [
  { mes: 'Oct', real: 30.2, ideal: 25.0 },
  { mes: 'Nov', real: 31.5, ideal: 25.0 },
  { mes: 'Dic', real: 29.8, ideal: 25.0 },
  { mes: 'Ene', real: 32.1, ideal: 25.0 },
  { mes: 'Feb', real: 28.5, ideal: 25.0 },
  { mes: 'Mar', real: 28.5, ideal: 25.0 },
];

export const MOCK_BALANCE_INVENTARIO: BalanceInventario = {
  stockInicial: 1250000,
  compras: 890000,
  ventas: 1247660,
  stockTeorico: 892340,
  stockReal: 847140,
  diferencia: -45200,
  valorizacion: 847140,
};

export const MOCK_TOP_MERMAS: MermaItem[] = [
  { producto: 'Lomo', cantidad: '8 kg', costo: '$14.400', estado: 'Alerta' },
  { producto: 'Salmón', cantidad: '4 kg', costo: '$18.000', estado: 'Alerta' },
  { producto: 'Langostinos', cantidad: '3 kg', costo: '$9.200', estado: 'Aceptable' },
  { producto: 'Pollo', cantidad: '12 kg', costo: '$4.800', estado: 'Aceptable' },
  { producto: 'Verduras', cantidad: '8 kg', costo: '$1.200', estado: 'Aceptable' },
];

export const MOCK_CUADRANTES_MENU: CuadranteMenu[] = [
  { nombre: 'Estrellas', emoji: '⭐', color: '#F59E0B', bgColor: '#FFFBEB', items: 12, descripcion: 'Alta popularidad / alta rentab.', platos: ['Bife de chorizo', 'Milanesa napolitana', 'Pasta del día', 'Ensalada Caesar'] },
  { nombre: 'Vacas Lecheras', emoji: '🐄', color: '#3B82F6', bgColor: '#EFF6FF', items: 8, descripcion: 'Alta popularidad / baja rentab.', platos: ['Pizza muzzarella', 'Papas fritas', 'Gaseosa', 'Café'] },
  { nombre: 'Enigmas', emoji: '❓', color: '#8B5CF6', bgColor: '#F5F3FF', items: 15, descripcion: 'Baja popularidad / alta rentab.', platos: ['Salmón grillé', 'Risotto de hongos', 'Tarta de queso', 'Vino premium'] },
  { nombre: 'Perros', emoji: '🐕', color: '#EF4444', bgColor: '#FEF2F2', items: 5, descripcion: 'Baja popularidad / baja rentab.', platos: ['Ensalada de frutas', 'Tostado', 'Agua saborizada'] },
];

// ==============================
// ECONOMICOS
// ==============================

export const MOCK_PL_ROWS: PlRow[] = [
  { label: 'Facturación', value: 4235000, color: '#22C55E', percentage: 100, trend: 8.2 },
  { label: 'COGS', value: 1212000, color: '#F97316', percentage: 28.6 },
  { label: 'Gastos Fijos', value: 1750000, color: '#EF4444', percentage: 41.3 },
  { label: 'Gastos Variables', value: 361000, color: '#A855F7', percentage: 8.5 },
];

export const MOCK_PL_RESULTADO: PlRow = {
  label: 'Resultado Neto',
  value: 912000,
  color: '#1155CC',
  percentage: 21.5,
  trend: 2.4,
};

export const MOCK_PUNTO_EQUILIBRIO: PuntoEquilibrio = {
  porcentaje: 151.8,
  ventasActuales: 4235000,
  puntoEquilibrio: 2790000,
};

export const MOCK_RESULTADO_MESES: ResultadoMes[] = [
  { mes: 'Oct', resultado: 680000 },
  { mes: 'Nov', resultado: 720000 },
  { mes: 'Dic', resultado: 850000 },
  { mes: 'Ene', resultado: 790000 },
  { mes: 'Feb', resultado: 880000 },
  { mes: 'Mar', resultado: 912000 },
];

export const MOCK_GASTOS_FIJOS: GastoFijo[] = [
  { nombre: 'Alquiler', monto: 580000, porcentaje: 33.1, color: '#3B82F6' },
  { nombre: 'Sueldos', monto: 715000, porcentaje: 40.9, color: '#F97316' },
  { nombre: 'Servicios', monto: 145000, porcentaje: 8.3, color: '#22C55E' },
  { nombre: 'Marketing', monto: 160000, porcentaje: 9.1, color: '#A855F7' },
  { nombre: 'Otros', monto: 150000, porcentaje: 8.6, color: '#6B7280' },
];

// ==============================
// FINANCIEROS
// ==============================

export const MOCK_KPI_FINANCIEROS: KpiFinanciero[] = [
  { label: 'Saldo Disponible', hoy: 845200, dias30: 2156800, total: 3002000, trend: 14.5, trendLabel: '↑ 14.5%' },
  { label: 'Cuentas por Cobrar', hoy: 312500, dias30: 87300, total: 399800, trend: -8, trendLabel: '↓ 4 pendientes' },
  { label: 'Cuentas por Pagar', hoy: 678900, dias30: 234100, total: 913000, trend: 18.3, trendLabel: '↑ 18.3%' },
];

export const MOCK_FLUJO_CAJA: FlujoCajaMes[] = [
  { mes: 'Oct', efectivo: 1520000, tarjetas: 1330000, transferencias: 950000, pagoProveedores: 2100000, impuestos: 640000, retirosSocios: 460000 },
  { mes: 'Nov', efectivo: 1580000, tarjetas: 1390000, transferencias: 980000, pagoProveedores: 2200000, impuestos: 650000, retirosSocios: 500000 },
  { mes: 'Dic', efectivo: 1800000, tarjetas: 1600000, transferencias: 1100000, pagoProveedores: 2350000, impuestos: 700000, retirosSocios: 550000 },
  { mes: 'Ene', efectivo: 1640000, tarjetas: 1460000, transferencias: 1000000, pagoProveedores: 2280000, impuestos: 680000, retirosSocios: 540000 },
  { mes: 'Feb', efectivo: 1720000, tarjetas: 1500000, transferencias: 1080000, pagoProveedores: 2200000, impuestos: 700000, retirosSocios: 500000 },
  { mes: 'Mar', efectivo: 1694000, tarjetas: 1480000, transferencias: 1061000, pagoProveedores: 2150000, impuestos: 693000, retirosSocios: 480000 },
];

export const MOCK_PENDIENTES_APPS: PendienteApp[] = [
  { plataforma: 'PedidosYa', monto: 182300, estado: 'Pendiente' },
  { plataforma: 'Rappi', monto: 98700, estado: 'En proceso' },
  { plataforma: 'MercadoPago', monto: 25400, estado: 'Cancelado' },
];

export const MOCK_DEUDA_PROVEEDORES: DeudaProveedor[] = [
  { proveedor: 'Distribuidora Sur', detalle: 'Fact. A 0003-00012845', monto: 245000, fechaVencimiento: '2026-03-28', vencida: true },
  { proveedor: 'Frigorífico Norte', detalle: 'Fact. A 0001-00089234', monto: 186400, fechaVencimiento: '2026-04-20', vencida: false },
  { proveedor: 'Bebidas Express', detalle: 'Fact. A 0002-00045678', monto: 104300, fechaVencimiento: '2026-04-01', vencida: true },
  { proveedor: 'Verdulería Central', detalle: 'Fact. B 0001-00023456', monto: 110000, fechaVencimiento: '2026-04-25', vencida: false },
];

// ==============================
// FISCALES
// ==============================

export const MOCK_KPI_FISCALES: KpiFiscal[] = [
  {
    label: 'IVA Ventas (Débito Fiscal)',
    value: 630210,
    subtitle: 'Total débito fiscal período',
    icon: '📤',
    color: '#22C55E',
    bgColor: '#F0FDF4',
  },
  {
    label: 'IVA Compras (Crédito Fiscal)',
    value: 254730,
    subtitle: 'Total crédito fiscal período',
    icon: '📥',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
  },
  {
    label: 'Posición IVA (Saldo a Pagar)',
    value: 375480,
    subtitle: 'Débito - Crédito fiscal',
    icon: '🏦',
    color: '#F97316',
    bgColor: '#FFF7ED',
  },
];

export const MOCK_SUBDIARIO_IVA_VENTAS: SubdiarioIvaRow[] = [
  { id: 'sv-001', fecha: '11/04/2026', puntoVenta: '0003', numero: '00012456', tipo: 'Factura B', cuit: '27-15463874-4', razonSocial: 'Consumidor Final', netoGravado: 4500, iva105: 0, iva21: 945, impInternos: 0, total: 5445, percepciones: 0 },
  { id: 'sv-002', fecha: '11/04/2026', puntoVenta: '0003', numero: '00012457', tipo: 'Factura A', cuit: '30-71234567-8', razonSocial: 'Corp. Gastro SRL', netoGravado: 12500, iva105: 0, iva21: 2625, impInternos: 0, total: 15125, percepciones: 83 },
  { id: 'sv-003', fecha: '10/04/2026', puntoVenta: '0003', numero: '00000045', tipo: 'Nota Crédito A', cuit: '30-71234567-8', razonSocial: 'Corp. Gastro SRL', netoGravado: -2500, iva105: 0, iva21: -525, impInternos: 0, total: -3025, percepciones: 0 },
  { id: 'sv-004', fecha: '10/04/2026', puntoVenta: '0003', numero: '00012455', tipo: 'Factura B', cuit: '20-30723445-3', razonSocial: 'Distribuidora ABC', netoGravado: 8750, iva105: 919, iva21: 919, impInternos: 48, total: 10636, percepciones: 48 },
  { id: 'sv-005', fecha: '09/04/2026', puntoVenta: '0003', numero: '00012454', tipo: 'Factura A', cuit: '30-70818615-3', razonSocial: 'Alimentos del Plata SA', netoGravado: 35970, iva105: 0, iva21: 7554, impInternos: 0, total: 43524, percepciones: 0 },
];

export const MOCK_SUBDIARIO_IVA_COMPRAS: SubdiarioIvaRow[] = [
  { id: 'sc-001', fecha: '10/04/2026', puntoVenta: '0001', numero: '00089234', tipo: 'Factura A', cuit: '30-65432198-7', razonSocial: 'Frigorífico Norte SA', netoGravado: 154050, iva105: 0, iva21: 32351, impInternos: 0, total: 186401, percepciones: 1540 },
  { id: 'sc-002', fecha: '08/04/2026', puntoVenta: '0002', numero: '00045678', tipo: 'Factura A', cuit: '30-78901234-5', razonSocial: 'Bebidas Express SRL', netoGravado: 86200, iva105: 9051, iva21: 9051, impInternos: 0, total: 104302, percepciones: 862 },
  { id: 'sc-003', fecha: '05/04/2026', puntoVenta: '0003', numero: '00012845', tipo: 'Factura A', cuit: '30-54321098-6', razonSocial: 'Distribuidora Sur SA', netoGravado: 202480, iva105: 0, iva21: 42521, impInternos: 0, total: 245001, percepciones: 2025 },
  { id: 'sc-004', fecha: '03/04/2026', puntoVenta: '0001', numero: '00023456', tipo: 'Factura B', cuit: '20-12345678-9', razonSocial: 'Verdulería Central', netoGravado: 90910, iva105: 9546, iva21: 9546, impInternos: 0, total: 110002, percepciones: 0 },
];

export const MOCK_MEDIOS_PAGO: MedioPago[] = [
  { nombre: 'Efectivo', monto: 1845300, porcentaje: 43.6, color: '#22C55E' },
  { nombre: 'Tarjeta Débito', monto: 963900, porcentaje: 22.8, color: '#3B82F6' },
  { nombre: 'Tarjeta Crédito', monto: 714200, porcentaje: 16.9, color: '#A855F7' },
  { nombre: 'MercadoPago', monto: 447300, porcentaje: 10.6, color: '#F97316' },
  { nombre: 'Otros', monto: 264400, porcentaje: 6.2, color: '#6B7280' },
];

export const MOCK_PERCEPCIONES: PercepcionItem[] = [
  { concepto: 'Percep. IIBB CABA', monto: 48450 },
  { concepto: 'Percep. IIBB PBA', monto: 12160 },
  { concepto: 'Imp. Internos', monto: 9750 },
  { concepto: 'Total Percepciones', monto: 70360 },
];
