// === SHARED ===
export type TabPersonal = 'staff' | 'fichaje' | 'tareas' | 'liquidacion' | 'mas';

export type RolGastronomico = 'Mozo' | 'Cocinero' | 'Bachero' | 'Manager' | 'Bartender' | 'Cajero' | 'Delivery';

export type EstadoEmpleado = 'Trabajando' | 'Franco' | 'Vacaciones' | 'Licencia' | 'Desvinculado';

// === STAFF / DIRECTORIO ===
export interface Empleado {
  id: string;
  nombre: string;
  avatar: string;
  rol: RolGastronomico;
  estado: EstadoEmpleado;
  dni: string;
  cuil: string;
  telefono: string;
  contactoEmergencia: string;
  fechaIngreso: string;
  sueldoBase: number;
  valorHoraExtra: number;
  diasFranco: string[];
}

// === FICHAJE ===
export type TipoFichaje = 'entrada' | 'inicioDescanso' | 'finDescanso' | 'salida';

export interface FichajeRegistro {
  id: string;
  fecha: string;
  empleado: string;
  rol: RolGastronomico;
  entrada: string;
  salida: string;
  horasTrabajadas: number;
  horasExtra: number;
}

export interface EmpleadoEnTurno {
  id: string;
  empleado: string;
  puesto: RolGastronomico;
  horaEntrada: string;
  estado: 'En turno' | 'En descanso' | 'Por ingresar' | 'Ausente';
  horasAcumuladas: string;
}

// === TAREAS ===
export type EstadoTarea = 'Pendiente' | 'En proceso' | 'Revisión' | 'Finalizado';

export interface Tarea {
  id: string;
  titulo: string;
  asignadoA: string;
  rol: RolGastronomico;
  estado: EstadoTarea;
  prioridad: 'Alta' | 'Media' | 'Baja';
  fechaLimite: string;
}

export interface ChecklistItem {
  id: string;
  descripcion: string;
  completado: boolean;
  obligatorio: boolean;
}

export interface Checklist {
  tipo: 'apertura' | 'cierre';
  titulo: string;
  items: ChecklistItem[];
}

// === LIQUIDACION ===
export interface KpiLiquidacion {
  label: string;
  value: number;
  subtitle: string;
  color: string;
}

export interface PreLiquidacionRow {
  id: string;
  empleado: string;
  rol: RolGastronomico;
  horasNormales: number;
  horasExtra: number;
  adelantos: number;
  bruto: number;
  neto: number;
}

export interface Adelanto {
  id: string;
  fecha: string;
  empleado: string;
  monto: number;
  motivo: string;
  estado: 'Entregado' | 'Descontado';
}

// === MAS (Valor Agregado) ===
export interface PropinaRegistro {
  id: string;
  fecha: string;
  origen: 'Efectivo' | 'Tarjeta' | 'App';
  monto: number;
  repartido: boolean;
}

export interface UniformeEntrega {
  id: string;
  empleado: string;
  prenda: string;
  talle: string;
  fechaEntrega: string;
  fechaDevolucion: string;
  estado: 'Entregado' | 'Devuelto' | 'Pendiente';
}

export interface Incidencia {
  id: string;
  fecha: string;
  empleado: string;
  tipo: 'Sanción' | 'Llegada tarde' | 'Premio' | 'Observación';
  descripcion: string;
}
