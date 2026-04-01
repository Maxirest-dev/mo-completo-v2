import { RentabilityAlert } from '../models';

export const MOCK_RENTABILITY_ALERTS: RentabilityAlert[] = [
  {
    id: 'e1111111-1111-1111-1111-111111111111',
    tipo: 'MARGEN_BAJO',
    severidad: 'CRITICAL',
    titulo: 'Margen crítico en Ojo de Bife',
    descripcion: 'El Ojo de Bife tiene un margen inferior al 10% debido al aumento de costo de carne. El precio de compra subió un 18% en las últimas 2 semanas.',
    sugerencia: 'IA sugiere: Subir precio de $8.500 a $9.800 o reducir gramaje de 350g a 300g para mantener margen objetivo del 25%.',
    generadoAt: '2026-03-31T12:15:00'
  },
  {
    id: 'e2222222-2222-2222-2222-222222222222',
    tipo: 'OPORTUNIDAD',
    severidad: 'INFO',
    titulo: 'Oportunidad de destacar Ensalada César',
    descripcion: 'La Ensalada César tiene un margen del 72% y demanda creciente (+15% semanal). Considerar como plato destacado del día.',
    sugerencia: 'IA sugiere: Posicionar como "Recomendado del Chef" en carta digital. Potencial de incrementar ventas un 20% adicional con promoción visible.',
    generadoAt: '2026-03-31T12:20:00'
  }
];
