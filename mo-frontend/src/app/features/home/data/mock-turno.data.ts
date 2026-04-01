import { Turno } from '../models';

export const MOCK_TURNO_ACTUAL: Turno = {
  id: 'c1a2b3d4-e5f6-7890-abcd-ef1234567890',
  nombre: 'Almuerzo',
  cajaId: 'a1b2c3d4-1111-2222-3333-444455556666',
  horaApertura: '2026-03-31T11:00:00',
  horaCierre: null,
  estado: 'ABIERTO',
  usuarioAperturaId: 'f0e1d2c3-b4a5-6789-0abc-def123456789',
  montoApertura: 15000
};

export const MOCK_TURNOS: Turno[] = [
  MOCK_TURNO_ACTUAL,
  {
    id: 'd2b3c4e5-f6a7-8901-bcde-f12345678901',
    nombre: 'Cena',
    cajaId: 'a1b2c3d4-1111-2222-3333-444455556666',
    horaApertura: '2026-03-31T19:00:00',
    horaCierre: null,
    estado: 'CERRADO',
    usuarioAperturaId: 'f0e1d2c3-b4a5-6789-0abc-def123456789',
    montoApertura: 20000
  }
];
