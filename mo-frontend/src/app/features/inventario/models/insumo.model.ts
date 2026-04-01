export type TipoInsumo = 'COMPRADO' | 'ELABORADO';
export type EstadoStock = 'NORMAL' | 'BAJO' | 'CRITICO';

export interface Insumo {
  id: number;
  depositoId: number;
  depositoNombre: string;
  nombre: string;
  tipoInsumo: TipoInsumo;
  codigo: string | null;
  unidadMedida: string;
  stockActual: number;
  stockMinimo: number;
  precio: number | null;
  estadoStock: EstadoStock;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InsumoCreate {
  depositoId: number;
  nombre: string;
  tipoInsumo?: TipoInsumo;
  codigo?: string;
  unidadMedida?: string;
  stockActual?: number;
  stockMinimo?: number;
  precio?: number;
}

export interface InsumoUpdate {
  depositoId?: number;
  nombre?: string;
  tipoInsumo?: TipoInsumo;
  codigo?: string;
  unidadMedida?: string;
  stockActual?: number;
  stockMinimo?: number;
  precio?: number;
  activo?: boolean;
}
