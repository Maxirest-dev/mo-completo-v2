import { TopVenta } from '../models';

export const MOCK_TOP_VENTAS: TopVenta[] = [
  {
    posicion: 1,
    productoId: 'd1111111-1111-1111-1111-111111111111',
    nombre: 'Hamb. Clásica',
    imagen: null,
    cantidadPedidos: 32,
    montoTotal: 128000,
    tendencia: 'SUBE',
    variacionPct: 8
  },
  {
    posicion: 2,
    productoId: 'd2222222-2222-2222-2222-222222222222',
    nombre: 'Ensalada César',
    imagen: null,
    cantidadPedidos: 28,
    montoTotal: 89600,
    tendencia: 'ESTABLE',
    variacionPct: 0
  },
  {
    posicion: 3,
    productoId: 'd3333333-3333-3333-3333-333333333333',
    nombre: 'Pizza Margarita',
    imagen: null,
    cantidadPedidos: 24,
    montoTotal: 96000,
    tendencia: 'SUBE',
    variacionPct: 15
  },
  {
    posicion: 4,
    productoId: 'd4444444-4444-4444-4444-444444444444',
    nombre: 'Milanesa Napolitana',
    imagen: null,
    cantidadPedidos: 22,
    montoTotal: 110000,
    tendencia: 'BAJA',
    variacionPct: 5
  },
  {
    posicion: 5,
    productoId: 'd5555555-5555-5555-5555-555555555555',
    nombre: 'Lomo Completo',
    imagen: null,
    cantidadPedidos: 18,
    montoTotal: 108000,
    tendencia: 'SUBE',
    variacionPct: 3
  }
];
