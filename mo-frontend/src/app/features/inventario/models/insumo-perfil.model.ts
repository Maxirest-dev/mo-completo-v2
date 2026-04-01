import { TipoInsumo, EstadoStock } from './insumo.model';

export interface Ingrediente {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
}

export interface PasoElaboracion {
  numero: number;
  descripcion: string;
}

export interface Transformacion {
  id: number;
  origen: string;
  origenCantidad: number;
  tipoTransformacion: string;
  resultado: string;
  resultadoCantidad: number;
  resultadoUnidad: string;
}

export interface InsumoPerfil {
  id: number;
  depositoId: number;
  depositoNombre: string;
  nombre: string;
  imagen: string | null;
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
  // ELABORADO
  ingredientes: Ingrediente[];
  elaboracion: PasoElaboracion[];
  tiempoElaboracion: string | null;
  pesoTotal: string | null;
  // COMPRADO
  transformaciones: Transformacion[];
}
