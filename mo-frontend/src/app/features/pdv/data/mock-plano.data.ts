import { PlanoSalon } from '../models/plano.model';

export const MOCK_PLANOS: PlanoSalon[] = [
  {
    id: 1,
    canalId: 1,
    nombre: 'Salon principal',
    gridRows: 10,
    gridCols: 12,
    piso: 'madera',
    items: [
      { id: 'm1', tipo: 'mesa', row: 1, col: 1, rowSpan: 1, colSpan: 1, forma: 'cuadrada', tamano: 'grande', numero: 1, comensalesMax: 4 },
      { id: 'm2', tipo: 'mesa', row: 1, col: 3, rowSpan: 1, colSpan: 1, forma: 'cuadrada', tamano: 'grande', numero: 2, comensalesMax: 4 },
      { id: 'm3', tipo: 'mesa', row: 1, col: 5, rowSpan: 1, colSpan: 1, forma: 'circular', tamano: 'grande', numero: 3, comensalesMax: 2 },
      { id: 'm4', tipo: 'mesa', row: 1, col: 7, rowSpan: 1, colSpan: 1, forma: 'circular', tamano: 'pequeno', numero: 4, comensalesMax: 2 },
      { id: 'm5', tipo: 'mesa', row: 3, col: 1, rowSpan: 1, colSpan: 2, forma: 'cuadrada', tamano: 'grande', numero: 5, comensalesMax: 8 },
      { id: 'm6', tipo: 'mesa', row: 3, col: 4, rowSpan: 1, colSpan: 1, forma: 'cuadrada', tamano: 'pequeno', numero: 6 },
      { id: 'm7', tipo: 'mesa', row: 5, col: 1, rowSpan: 1, colSpan: 1, forma: 'circular', tamano: 'grande', numero: 7, comensalesMax: 6 },
      { id: 'm8', tipo: 'mesa', row: 5, col: 3, rowSpan: 1, colSpan: 1, forma: 'cuadrada', tamano: 'grande', numero: 8, comensalesMax: 4 },
      { id: 'b1', tipo: 'barra', row: 7, col: 0, rowSpan: 1, colSpan: 4, label: 'Barra' },
      { id: 'p1', tipo: 'planta', row: 0, col: 0, rowSpan: 1, colSpan: 1, label: 'Planta' },
      { id: 'p2', tipo: 'planta', row: 0, col: 11, rowSpan: 1, colSpan: 1, label: 'Planta' },
      { id: 'e1', tipo: 'entrada', row: 9, col: 5, rowSpan: 1, colSpan: 2, label: 'Entrada' },
      { id: 'w1', tipo: 'bano', row: 0, col: 9, rowSpan: 1, colSpan: 2, label: 'Banos' },
      { id: 'c1', tipo: 'caja', row: 7, col: 10, rowSpan: 1, colSpan: 2, label: 'Caja' },
    ],
  },
];
