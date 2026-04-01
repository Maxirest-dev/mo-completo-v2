// Extended interfaces for AG-Grid display
import { Producto } from './producto.model';

export interface CategoriaGridRow {
  id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  iconoColor: string;
  estado: 'DISPONIBLE' | 'STOCK_MEDIO' | 'SIN_STOCK' | 'INACTIVO';
  productosCount: number;
  categoriaPadre: string | null;
  activo: boolean;
  orden?: number;
  productos: ProductoGridRow[];
}

export interface ProductoGridRow {
  id: number;
  categoriaId: number;
  codigoBusqueda: string | null;
  nombre: string;
  descripcion: string | null;
  estado: 'ACTIVO' | 'INACTIVO';
  precio: number;
  precioTakeAway: number | null;
  precioDelivery: number | null;
  stock: number;
  activo: boolean;
  estadistica: number | null;
}

export type EstadoCategoria = 'DISPONIBLE' | 'STOCK_MEDIO' | 'SIN_STOCK' | 'INACTIVO';
export type EstadoProducto = 'ACTIVO' | 'INACTIVO';

export interface GridActionEvent {
  action: 'edit' | 'deactivate' | 'activate' | 'delete' | 'create';
  type: 'categoria' | 'producto';
  data: CategoriaGridRow | ProductoGridRow;
}
