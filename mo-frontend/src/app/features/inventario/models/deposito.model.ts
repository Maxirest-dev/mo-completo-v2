import { Insumo } from './insumo.model';

export interface Deposito {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: DepositoTipo;
  ubicacion: string | null;
  activo: boolean;
  orden: number;
  insumosCount: number;
  createdAt: string;
  updatedAt: string;
}

export type DepositoTipo = 'VERDURAS' | 'CARNES' | 'LACTEOS' | 'BEBIDAS' | 'SECOS' | 'CONGELADOS' | 'OTROS';

export interface DepositoCreate {
  nombre: string;
  tipo: DepositoTipo;
  descripcion?: string;
  ubicacion?: string;
  orden?: number;
}

export interface DepositoUpdate {
  nombre?: string;
  tipo?: DepositoTipo;
  descripcion?: string;
  ubicacion?: string;
  activo?: boolean;
  orden?: number;
}

export interface DepositoWithInsumos extends Deposito {
  insumos: Insumo[];
}
