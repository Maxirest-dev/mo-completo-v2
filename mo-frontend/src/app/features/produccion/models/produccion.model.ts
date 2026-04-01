export type TipoProduccion = 'TRANSFORMACION' | 'ELABORADO';

export interface Ingrediente {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
}

export interface CocinarRequest {
  itemId: number;
  cantidadBatches: number;
  cantidadResultado: number;
  cantidadConsumo: number;
}
