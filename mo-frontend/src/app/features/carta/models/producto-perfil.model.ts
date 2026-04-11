export interface Ingrediente {
  nombre: string;
  cantidad?: string;
  unidad?: string;
  cantidadNum?: number;
  pesoUnitario?: number;
  costoUnitario?: number;
}

export interface PasoElaboracion {
  paso: number;
  descripcion: string;
}

export interface Estacion {
  id: number;
  nombre: string;
  icono: string;
}

export interface CalendarioTurno {
  activo: boolean;
}

export interface CalendarioDia {
  dia: string;
  turnos: CalendarioTurno[];
}

export interface CalendarioData {
  canal: string;
  dias: CalendarioDia[];
}

export interface ExtraItem {
  id: number;
  nombre: string;
  precio: number;
  cantidadMax: number;
}

export type PrecioStrategy = 'suma' | 'mayor' | 'manual';

export interface PizzaTamano {
  id: number;
  nombre: string;
  precio: number;
  porciones: number;
}

export interface PizzaSabor {
  id: number;
  nombre: string;
  preciosPorTamano: Record<number, number>;
  habilitado: boolean;
}

export interface PizzaConfig {
  tamanos: PizzaTamano[];
  sabores: PizzaSabor[];
  permiteMitad: boolean;
}

export interface ComboProducto {
  id: number;
  nombre: string;
  precio: number;
  fijo: boolean;
}

export interface ComboStep {
  id: number;
  titulo: string;
  opciones: ComboProducto[];
  minSeleccion: number;
  maxSeleccion: number;
}

export interface ProductoPerfil {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string | null;
  activo: boolean;
  categoriaId: number;
  categoriaNombre: string;
  codigoProducto: string;
  codigosBusqueda: string[];
  codigoBarras: string | null;
  sku: string | null;
  precioSalon: number;
  precioDelivery: number;
  precioMostrador: number;
  rindeParaPersonas: number;
  tipo: string;
  estacion: string | null;
  pesoTotal: string | null;
  ingredientes: Ingrediente[];
  elaboracion: PasoElaboracion[];
  estaciones: number[];
  calendario: CalendarioData[];
  extras: ExtraItem[];
  adicionales: ExtraItem[];
  precioStrategy?: PrecioStrategy;
  productosFijos?: ComboProducto[];
  pasos?: ComboStep[];
  pizzaConfig?: PizzaConfig;
}

export interface PreciosFormData {
  precioSalon: number;
  precioDelivery: number;
  precioMostrador: number;
}

export interface CodigosFormData {
  codigoProducto: string;
  codigosBusqueda: string[];
  codigoBarras: string | null;
  sku: string | null;
}

export interface DetalleFormData {
  categoriaId: number;
  rindeParaPersonas: number;
  tipo: string;
  origen: string;
}

export interface EstacionFormData {
  estaciones: number[];
}

export interface CalendarioFormData {
  calendario: CalendarioData[];
}

export interface ExtrasFormData {
  extras: ExtraItem[];
  adicionales: ExtraItem[];
}

export interface IngredientesFormData {
  ingredientes: Ingrediente[];
}

export interface ElaboracionFormData {
  elaboracion: PasoElaboracion[];
}
