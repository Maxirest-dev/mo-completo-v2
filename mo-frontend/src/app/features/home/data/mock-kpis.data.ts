import { KpiData } from '../models';

export const MOCK_KPIS: KpiData[] = [
  {
    id: 'ventas-hoy',
    titulo: 'Ventas Hoy',
    valor: 125400,
    unidad: 'ARS',
    tipo: 'currency',
    variacion: {
      valor: 12,
      direccion: 'up',
      periodo: 'vs semana pasada',
      valorAnterior: 111964
    },
    metadata: {
      ticketsEmitidos: 42,
      turnoId: 'c1a2b3d4-e5f6-7890-abcd-ef1234567890'
    }
  },
  {
    id: 'food-cost-teorico',
    titulo: 'Food Cost (Teórico)',
    valor: 28.5,
    unidad: 'PORCENTAJE',
    tipo: 'percentage',
    variacion: {
      valor: 0,
      direccion: 'neutral',
      periodo: 'En objetivo'
    },
    metadata: {
      objetivo: 30,
      badge: 'En objetivo'
    }
  },
  {
    id: 'ticket-promedio',
    titulo: 'Ticket Promedio',
    valor: 4200,
    unidad: 'ARS',
    tipo: 'currency',
    variacion: {
      valor: 2,
      direccion: 'down',
      periodo: 'vs semana pasada',
      valorAnterior: 4286
    }
  },
  {
    id: 'estado-salon',
    titulo: 'Estado del Salón',
    valor: 85,
    unidad: 'GAUGE',
    tipo: 'gauge',
    variacion: {
      valor: 0,
      direccion: 'neutral',
      periodo: 'ocupación actual'
    },
    metadata: {
      mesasOcupadas: 17,
      mesasTotales: 20
    }
  }
];
