import { EstadoStock } from './insumo.model';
import { DepositoTipo } from './deposito.model';

export interface DepositoGridRow {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: DepositoTipo;
  ubicacion: string | null;
  activo: boolean;
  orden: number;
  insumosCount: number;
  insumos: InsumoGridRow[];
}

export interface InsumoGridRow {
  id: number;
  depositoId: number;
  nombre: string;
  tipoInsumo: 'COMPRADO' | 'ELABORADO';
  codigo: string | null;
  unidadMedida: string;
  stockActual: number;
  stockMinimo: number;
  precio: number | null;
  estadoStock: EstadoStock;
  activo: boolean;
}

export type GridActionEvent = {
  action: 'edit' | 'deactivate' | 'activate' | 'delete' | 'adjust-stock';
  type: 'deposito' | 'insumo';
  data: DepositoGridRow | InsumoGridRow;
};
