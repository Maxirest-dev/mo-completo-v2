import { TipoProduccion, Ingrediente } from './produccion.model';

export type EstacionTipo = 'MOSTRADOR' | 'BARRA' | 'COCINA' | 'PARRILLA';

export interface EstacionProduccionRow {
  id: number;
  nombre: string;
  tipo: EstacionTipo;
  itemsCount: number;
  items: ProduccionGridRow[];
}

export interface ProduccionGridRow {
  id: number;
  estacionId: number;
  nombre: string;
  tipo: TipoProduccion;
  stockProduccion: number;
  stockInventario: number;
  unidadMedida: string;
  unidadMedidaOrigen: string;
  origenCantidad: number;
  resultadoCantidad: number;
  costoUnitario: number | null;
  vencimiento: string | null;
  insumoOrigenNombre: string;
  tipoTransformacion?: string;
  ingredientes?: Ingrediente[];
}

export type ProduccionFilterType = 'todos' | 'conStock' | 'sinStock';

export interface ProduccionFilterContadores {
  todos: number;
  conStock: number;
  sinStock: number;
}

export interface GridActionEvent {
  action: 'cocinar';
  data: ProduccionGridRow;
}
