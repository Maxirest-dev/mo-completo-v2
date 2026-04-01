export interface PrepItem {
  id: string;
  tarea: string;
  prioridad: PrepPrioridad;
  completado: boolean;
  completadoPor?: string | null;
  completadoAt?: string | null;
  horaLimite?: string | null;
  insumoId?: string | null;
  cantidad?: number | null;
  unidad?: string | null;
  orden: number;
}

export type PrepPrioridad = 'ALTA' | 'MEDIA' | 'BAJA';

export interface PrepItemUpdateRequest {
  completado: boolean;
}
