// Modelos de Auditoría

export interface AuditoriaEvento {
  id: number;
  ubicacion: string;
  mesa: string;
  horaApertura: string;
  horaCierre: string;
  empleado: Empleado;
  comprobante: string;
  precio: number;
  estado: EstadoAuditoria;
  prioridad: PrioridadAuditoria;
  detalles: AuditoriaDetalle[];
}

export interface AuditoriaDetalle {
  id: number;
  hora: string;
  tipoAccion: TipoAccion;
  nombreArticulo: string;
  precio: number;
  empleadoSolicitud: string;
  activo: boolean;
}

export interface Empleado {
  id: number;
  codigo: string;
  nombre: string;
  rol: string;
}

export interface TipoAccion {
  id: number;
  codigo: string;
  nombre: string;
  color: string;
  categoria: CategoriaAccion;
}

export interface ConfiguracionAuditoria {
  id: number;
  categoria: CategoriaConfiguracion;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  tieneConfigExtra: boolean;
}

export interface FiltroAuditoria {
  prioridad?: PrioridadAuditoria;
  estado?: EstadoAuditoria;
  busqueda?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface ConteosPrioridad {
  todos: number;
  critico: number;
  comunes: number;
  altaPrioridad: number;
  bajaPrioridad: number;
}

// Enums
export type EstadoAuditoria = 'Critico' | 'Moderado' | 'Leve';
export type PrioridadAuditoria = 'CRITICO' | 'ALTA' | 'COMUN' | 'BAJA';
export type CategoriaAccion = 'MESA' | 'FACTURA' | 'ARTICULO' | 'SEGURIDAD' | 'OTRO';
export type CategoriaConfiguracion = 'MESA' | 'FACTURA' | 'ARTICULO' | 'NOTIFICACIONES' | 'SEGURIDAD';

// Filtros Tab
export interface FiltroTab {
  id: string;
  label: string;
  count: number;
  prioridad?: PrioridadAuditoria;
}

// AG-Grid Types
export interface GridRowData {
  id: number;
  nombre: string;
  hora: string;
  empleado: {
    nombre: string;
    rol: string;
  };
  comprobante: string;
  precio: number;
  estado: EstadoAuditoria;
  detalles: GridDetalleRowData[];
}

export interface GridDetalleRowData {
  id: number;
  hora: string;
  accion: {
    tipo: string;
    label: string;
    color: string;
  };
  nombre: string;
  precio: number;
  solicitud: string;
  activo: boolean;
}
