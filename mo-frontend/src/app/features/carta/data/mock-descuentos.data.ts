import { Descuento } from '../models/descuento.model';

export const MOCK_DESCUENTOS: Descuento[] = [
  {
    id: 1,
    codigo: 1,
    nombre: 'Promos Noche',
    tipoDescuento: 'porcentaje',
    cantidad: 10,
    estado: 'ACTIVA',
    grupo: 'Entradas',
    productos: [
      {
        id: 10,
        codigoBusqueda: '10',
        nombre: 'Alitas BBQ',
        precioOriginal: 45000,
        precioConDescuento: 40500,
      },
      {
        id: 11,
        codigoBusqueda: '11',
        nombre: 'Nachos Supreme',
        precioOriginal: 38000,
        precioConDescuento: 34200,
      },
      {
        id: 12,
        codigoBusqueda: '12',
        nombre: 'Tequenos',
        precioOriginal: 35000,
        precioConDescuento: 31500,
      },
    ],
  },
  {
    id: 2,
    codigo: 2,
    nombre: 'Promos Tarde',
    tipoDescuento: 'porcentaje',
    cantidad: 10,
    estado: 'ACTIVA',
    grupo: 'Cafeteria',
    productos: [
      {
        id: 60,
        codigoBusqueda: '60',
        nombre: 'Spaghetti Bolognesa',
        precioOriginal: 38000,
        precioConDescuento: 34200,
      },
      {
        id: 61,
        codigoBusqueda: '61',
        nombre: 'Fettuccine Alfredo',
        precioOriginal: 42000,
        precioConDescuento: 37800,
      },
    ],
  },
  {
    id: 3,
    codigo: 3,
    nombre: 'Promos manana',
    tipoDescuento: 'importe',
    cantidad: 5000,
    estado: 'ACTIVA',
    grupo: 'Principal',
    productos: [
      {
        id: 20,
        codigoBusqueda: '20',
        nombre: 'Filete de Res',
        precioOriginal: 65000,
        precioConDescuento: 60000,
      },
      {
        id: 21,
        codigoBusqueda: '21',
        nombre: 'Pollo a la Plancha',
        precioOriginal: 42000,
        precioConDescuento: 37000,
      },
    ],
  },
];
