import { Producto } from './producto.model';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  orden: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  productos?: Producto[];
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string;
  icono?: string;
  orden?: number;
  activo?: boolean;
}

export interface CategoriaUpdate {
  nombre?: string;
  descripcion?: string;
  icono?: string;
  orden?: number;
  activo?: boolean;
}

export interface CategoriaWithProducts extends Categoria {
  productos: Producto[];
  productosCount: number;
}
