import { AiSummary } from '../models';

export const MOCK_AI_SUMMARY: AiSummary = {
  id: 'e3c4d5f6-a7b8-9012-cdef-234567890123',
  turnoId: 'c1a2b3d4-e5f6-7890-abcd-ef1234567890',
  texto: 'La demanda de hoy supera en un 15% la previsión. Se recomienda reforzar la partida de postres, pescados. El proveedor de lácteos aumentó precios, revisa la sección de Compras.',
  highlights: [
    {
      tipo: 'positivo',
      texto: '+15% demanda vs previsión'
    },
    {
      tipo: 'negativo',
      texto: 'Aumento de precios en lácteos (proveedor La Serenísima)'
    },
    {
      tipo: 'neutro',
      texto: 'Reforzar partida de postres y pescados para el turno noche'
    }
  ],
  detalles: 'Análisis detallado: Las ventas del turno almuerzo muestran un crecimiento sostenido del 15% respecto a la previsión semanal. Los platos más demandados son hamburguesas y ensaladas. Se detectó un incremento del 8% en el costo de mozzarella y crema, impactando el food cost de pizzas y postres. Recomendación: evaluar ajuste de precios en la carta de pizzas o negociar con proveedor alternativo.',
  generadoAt: '2026-03-31T12:30:00',
  expiraAt: '2026-03-31T12:45:00'
};
