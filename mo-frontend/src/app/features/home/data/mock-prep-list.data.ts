import { PrepItem } from '../models';

export const MOCK_PREP_LIST: PrepItem[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    tarea: 'Picar 5kg Cebolla',
    prioridad: 'ALTA',
    completado: true,
    completadoPor: 'f0e1d2c3-b4a5-6789-0abc-def123456789',
    completadoAt: '2026-03-31T10:45:00',
    horaLimite: '11:00',
    insumoId: 'b2222222-2222-2222-2222-222222222222',
    cantidad: 5,
    unidad: 'kg',
    orden: 1
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    tarea: 'Descongelar Salmón para turno noche',
    prioridad: 'ALTA',
    completado: false,
    completadoPor: null,
    completadoAt: null,
    horaLimite: '17:00',
    insumoId: 'b3333333-3333-3333-3333-333333333333',
    cantidad: 3,
    unidad: 'kg',
    orden: 2
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    tarea: 'Preparar masa de pizza',
    prioridad: 'MEDIA',
    completado: false,
    completadoPor: null,
    completadoAt: null,
    horaLimite: '15:00',
    insumoId: 'b4444444-4444-4444-4444-444444444444',
    cantidad: 10,
    unidad: 'kg',
    orden: 3
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    tarea: 'Cortar verduras para ensalada',
    prioridad: 'MEDIA',
    completado: true,
    completadoPor: 'f0e1d2c3-b4a5-6789-0abc-def123456789',
    completadoAt: '2026-03-31T10:30:00',
    horaLimite: '11:30',
    insumoId: 'b5555555-5555-5555-5555-555555555555',
    cantidad: 4,
    unidad: 'kg',
    orden: 4
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    tarea: 'Marinar pollo para brasa',
    prioridad: 'BAJA',
    completado: false,
    completadoPor: null,
    completadoAt: null,
    horaLimite: '18:00',
    insumoId: 'b6666666-6666-6666-6666-666666666666',
    cantidad: 8,
    unidad: 'kg',
    orden: 5
  }
];
