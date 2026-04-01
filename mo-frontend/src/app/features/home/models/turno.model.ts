export interface Turno {
  id: string;
  nombre: string;
  cajaId: string;
  horaApertura: string;
  horaCierre: string | null;
  estado: TurnoEstado;
  usuarioAperturaId: string;
  montoApertura: number;
}

export type TurnoEstado = 'ABIERTO' | 'CERRADO' | 'EN_CIERRE';
