import {
  TurnoActual,
  EstadoCaja,
  FormaCobrotTurno,
  FinTurno,
  CierreTurnoData,
  ConfigEstacion,
  ConfigFormaCobro,
  ConfigCategoria,
  ConfigDispositivo,
  ConfigTurno,
  ArcaConfig,
} from '../models';

export const MOCK_TURNO_ACTUAL: TurnoActual = {
  id: 1,
  estado: 'abierto',
  fechaInicio: '2026-03-30T06:00:00',
  ventas: 167128,
  regulaciones: 100640,
  promedio: 267768,
  cantTickets: 342,
  cantRegulaciones: 156,
  cantCubiertos: 498,
};

export const MOCK_ESTADO_CAJA: EstadoCaja = {
  efectivo: 189745,
  ingreso: 245300,
  diferencia: 55555,
  porcentajeEfectivo: 77,
};

export const MOCK_FORMAS_COBRO: FormaCobrotTurno[] = [
  { nombre: 'Efectivo', total: 100277, porcentaje: 60, color: '#3B82F6' },
  { nombre: 'MercadoPago', total: 41782, porcentaje: 25, color: '#10B981' },
  { nombre: 'Tarjeta', total: 25069, porcentaje: 15, color: '#F59E0B' },
];

export const MOCK_FINES_TURNO: FinTurno[] = [
  { id: 1, fecha: '2026-03-02', turno: 'Maniana', total: 185400, tickets: 45, cubiertos: 102 },
  { id: 2, fecha: '2026-03-05', turno: 'Tarde', total: 210300, tickets: 52, cubiertos: 118 },
  { id: 3, fecha: '2026-03-08', turno: 'Noche', total: 320150, tickets: 78, cubiertos: 195 },
  { id: 4, fecha: '2026-03-10', turno: 'Maniana', total: 145600, tickets: 38, cubiertos: 86 },
  { id: 5, fecha: '2026-03-13', turno: 'Tarde', total: 275800, tickets: 65, cubiertos: 152 },
  { id: 6, fecha: '2026-03-15', turno: 'Noche', total: 198200, tickets: 48, cubiertos: 110 },
  { id: 7, fecha: '2026-03-18', turno: 'Maniana', total: 167500, tickets: 42, cubiertos: 96 },
  { id: 8, fecha: '2026-03-21', turno: 'Tarde', total: 289700, tickets: 70, cubiertos: 165 },
  { id: 9, fecha: '2026-03-25', turno: 'Noche', total: 345200, tickets: 85, cubiertos: 210 },
  { id: 10, fecha: '2026-03-28', turno: 'Maniana', total: 156800, tickets: 40, cubiertos: 92 },
];

export const MOCK_CIERRE_TURNO: CierreTurnoData = {
  local: 'Gastro Tapas SRL',
  fecha: '2026-03-30',
  turno: 'Maniana',
  tickets: 88,
  cubiertos: 210,
  totalTurno: 11377300,
  formasCobro: [
    { nombre: 'Efectivo', total: 7170500, operaciones: 52 },
    { nombre: 'Tarjeta', total: 2645800, operaciones: 24 },
    { nombre: 'Grua', total: 1561000, operaciones: 12 },
  ],
  tasaPesado: 0,
};

export const MOCK_ESTACIONES: ConfigEstacion[] = [
  { id: 1, nombre: 'Mostrador', tipo: 'Principal', activo: true },
  { id: 2, nombre: 'Barra', tipo: 'Secundario', activo: true },
  { id: 3, nombre: 'Cocina', tipo: 'Produccion', activo: true },
  { id: 4, nombre: 'Parrilla', tipo: 'Produccion', activo: false },
];

export const MOCK_FORMAS_COBRO_CONFIG: ConfigFormaCobro[] = [
  { id: 1, nombre: 'MercadoPago', icono: 'mobile', color: '#10B981', categoria: 'Medios electronicos', activo: true },
  { id: 2, nombre: 'Cuenta DNI', icono: 'mobile', color: '#3B82F6', categoria: 'Medios electronicos', activo: true },
  { id: 3, nombre: 'Transferencia', icono: 'digital', color: '#6366F1', categoria: 'Medios electronicos', activo: false },
  { id: 4, nombre: 'RappiPay', icono: 'mobile', color: '#8B5CF6', categoria: 'Medios electronicos', activo: true },
  { id: 5, nombre: 'Visa Debito', icono: 'card', color: '#1E40AF', categoria: 'Tarjeta debito', activo: true },
  { id: 6, nombre: 'Maestro', icono: 'card', color: '#EF4444', categoria: 'Tarjeta debito', activo: true },
  { id: 7, nombre: 'Cabal Debito', icono: 'card', color: '#F59E0B', categoria: 'Tarjeta debito', activo: false },
  { id: 8, nombre: 'Visa Credito', icono: 'card', color: '#1E40AF', categoria: 'Tarjeta credito', activo: true },
  { id: 9, nombre: 'Mastercard', icono: 'card', color: '#EF4444', categoria: 'Tarjeta credito', activo: true },
  { id: 10, nombre: 'American Express', icono: 'card', color: '#06B6D4', categoria: 'Tarjeta credito', activo: true },
  { id: 11, nombre: 'Cabal Credito', icono: 'card', color: '#F59E0B', categoria: 'Tarjeta credito', activo: false },
  { id: 12, nombre: 'Efectivo', icono: 'cash', color: '#10B981', categoria: 'Otros', activo: true },
  { id: 13, nombre: 'Cuenta corriente', icono: 'digital', color: '#F97316', categoria: 'Otros', activo: true },
  { id: 14, nombre: 'Cheque', icono: 'digital', color: '#6B7280', categoria: 'Otros', activo: false },
];

export const MOCK_CATEGORIAS: ConfigCategoria[] = [
  { id: 1, nombre: 'Salon principal', tipo: 'Salon', activo: true },
  { id: 2, nombre: 'Delivery apps', tipo: 'Delivery', activo: true },
  { id: 3, nombre: 'Take away', tipo: 'Mostrador', activo: true },
];

export const MOCK_DISPOSITIVOS: ConfigDispositivo[] = [
  { id: 1, nombre: 'POS Caja 1', tipo: 'Cajero', activo: true },
  { id: 2, nombre: 'POS Mozo Salon', tipo: 'Mozo', activo: true },
  { id: 3, nombre: 'POS Cocina', tipo: 'Cocina', activo: true },
];

export const MOCK_TURNOS: ConfigTurno[] = [
  { id: 1, nombre: 'Maniana', horaInicio: '06:00', horaFin: '14:00' },
  { id: 2, nombre: 'Tarde', horaInicio: '14:00', horaFin: '22:00' },
  { id: 3, nombre: 'Noche', horaInicio: '22:00', horaFin: '06:00' },
];

export const MOCK_ARCA_CONFIG: ArcaConfig = {
  condicionIva: 'Responsable Inscripto',
  razonSocial: 'Gastro Tapas SRL',
  fechaAlta: '2026-01-15',
  email: 'contacto@gastrotapas.com',
  celular: '+54 11 5555-1234',
  certificado: 'certificado_arca.pem',
};

export const MOCK_VENTAS_POR_CONCEPTO = [
  { concepto: 'Salon', total: 95000 },
  { concepto: 'Delivery', total: 48000 },
  { concepto: 'Take Away', total: 24128 },
];
