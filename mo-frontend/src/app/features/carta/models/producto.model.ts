export type TipoProducto = 'entrada' | 'principal' | 'guarnicion' | 'combo' | 'menu' | 'pizza' | 'sushi' | 'bebida' | 'postre';

export const TIPOS_PRODUCTO: { value: TipoProducto; label: string }[] = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'principal', label: 'Principal' },
  { value: 'guarnicion', label: 'Guarnicion' },
  { value: 'combo', label: 'Combo' },
  { value: 'menu', label: 'Menu' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'sushi', label: 'Sushi' },
  { value: 'bebida', label: 'Bebida' },
  { value: 'postre', label: 'Postre' },
];

export interface Producto {
  id: number;
  categoriaId: number;
  tipo: TipoProducto | null;
  codigoBusqueda: string | null;
  nombre: string;
  descripcion: string | null;
  precio: number;
  precioDelivery: number | null;
  stock: number;
  imagen: string | null;
  disponible: boolean;
  destacado: boolean;
  orden: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductoCreate {
  categoriaId: number;
  tipo?: TipoProducto;
  codigoBusqueda?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioDelivery?: number;
  stock?: number;
  imagen?: string;
  disponible?: boolean;
  destacado?: boolean;
  orden?: number;
  activo?: boolean;
}

export interface ProductoUpdate {
  categoriaId?: number;
  tipo?: TipoProducto | null;
  codigoBusqueda?: string | null;
  nombre?: string;
  descripcion?: string | null;
  precio?: number;
  precioDelivery?: number | null;
  stock?: number;
  imagen?: string | null;
  disponible?: boolean;
  destacado?: boolean;
  orden?: number;
  activo?: boolean;
}
