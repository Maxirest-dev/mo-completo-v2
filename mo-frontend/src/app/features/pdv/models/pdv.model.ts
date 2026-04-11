export type ViewMode = 'pesos' | 'cubiertos';
export type TurnoEstado = 'abierto' | 'cerrado';

export interface TurnoActual {
  id: number;
  estado: TurnoEstado;
  fechaInicio: string;
  ventas: number;
  regulaciones: number;
  promedio: number;
  cantTickets: number;
  cantRegulaciones: number;
  cantCubiertos: number;
}

export interface EstadoCaja {
  efectivo: number;
  ingreso: number;
  diferencia: number;
  porcentajeEfectivo: number;
}

export interface FormaCobrotTurno {
  nombre: string;
  total: number;
  porcentaje: number;
  color: string;
}

export interface FinTurno {
  id: number;
  fecha: string;
  turno: string;
  total: number;
  tickets: number;
  cubiertos: number;
}

export interface CierreTurnoData {
  local: string;
  fecha: string;
  turno: string;
  tickets: number;
  cubiertos: number;
  totalTurno: number;
  formasCobro: { nombre: string; total: number; operaciones: number }[];
  tasaPesado: number;
}

export interface ConfigEstacion {
  id: number;
  nombre: string;
  tipo: string;
  activo: boolean;
}

export type FormaCobrotCategoria = 'Medios electronicos' | 'Tarjeta debito' | 'Tarjeta credito' | 'Otros';

export interface ConfigFormaCobro {
  id: number;
  nombre: string;
  icono: string;
  color: string;
  categoria: FormaCobrotCategoria;
  activo: boolean;
}

export type CanalTipo = 'Salon' | 'Mostrador' | 'Delivery';

export interface ConfigCategoria {
  id: number;
  nombre: string;
  tipo: CanalTipo;
  activo: boolean;
  dispositivoIds?: number[];
}

export interface ConfigDispositivo {
  id: number;
  nombre: string;
  tipo: string;
  activo: boolean;
}

export interface ConfigTurno {
  id: number;
  nombre: string;
  horaInicio: string;
  horaFin: string;
}

export interface ArcaConfig {
  condicionIva: string;
  razonSocial: string;
  fechaAlta: string;
  email: string;
  celular: string;
  certificado: string;
}
