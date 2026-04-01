export interface AiSummary {
  id: string;
  turnoId: string;
  texto: string;
  highlights: AiHighlight[];
  detalles?: string;
  generadoAt: string;
  expiraAt: string;
}

export interface AiHighlight {
  tipo: AiHighlightTipo;
  texto: string;
}

export type AiHighlightTipo = 'positivo' | 'negativo' | 'neutro';
