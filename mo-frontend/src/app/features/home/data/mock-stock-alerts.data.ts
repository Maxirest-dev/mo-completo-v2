import { StockAlert } from '../models';

export const MOCK_STOCK_ALERTS: StockAlert[] = [
  {
    insumoId: 'c1111111-1111-1111-1111-111111111111',
    nombre: 'Mozzarella',
    stockActual: 1.5,
    stockMinimo: 10,
    porcentaje: 15,
    estado: 'CRITICO',
    unidad: 'kg',
    depositoNombre: 'Depósito Lácteos'
  },
  {
    insumoId: 'c2222222-2222-2222-2222-222222222222',
    nombre: 'Pan de Hamburguesa',
    stockActual: 25,
    stockMinimo: 100,
    porcentaje: 25,
    estado: 'BAJO',
    unidad: 'unidades',
    depositoNombre: 'Depósito Panadería'
  },
  {
    insumoId: 'c3333333-3333-3333-3333-333333333333',
    nombre: 'Tomates',
    stockActual: 8,
    stockMinimo: 20,
    porcentaje: 40,
    estado: 'BAJO',
    unidad: 'kg',
    depositoNombre: 'Depósito Verduras'
  },
  {
    insumoId: 'c4444444-4444-4444-4444-444444444444',
    nombre: 'Café en Grano',
    stockActual: 3,
    stockMinimo: 5,
    porcentaje: 60,
    estado: 'NORMAL',
    unidad: 'kg',
    depositoNombre: 'Depósito Bebidas'
  }
];
