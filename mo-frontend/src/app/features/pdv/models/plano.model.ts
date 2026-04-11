export type PlanoItemTipo = 'mesa' | 'planta' | 'pared' | 'barra' | 'entrada' | 'bano' | 'caja';
export type MesaForma = 'cuadrada' | 'circular';
export type ItemTamano = 'pequeno' | 'grande';
export type ParedOrientacion = 'horizontal' | 'vertical' | 'curva';
export type CurvaRotacion = 0 | 90 | 180 | 270;

export interface PlanoItem {
  id: string;
  tipo: PlanoItemTipo;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  forma?: MesaForma;
  tamano?: ItemTamano;
  numero?: number;
  comensalesMax?: number;
  label?: string;
  orientacion?: ParedOrientacion;
  curvaRotacion?: CurvaRotacion;
}

export type PisoTipo = 'ninguno' | 'madera' | 'piedra' | 'porcelanato';

export interface PlanoSalon {
  id: number;
  canalId: number;
  nombre: string;
  gridRows: number;
  gridCols: number;
  piso: PisoTipo;
  items: PlanoItem[];
}

export interface ToolbarItem {
  tipo: PlanoItemTipo;
  label: string;
  emoji: string;
  forma?: MesaForma;
}
