import { DemandForecast } from '../models';

export const MOCK_DEMAND_FORECAST: DemandForecast = {
  fecha: '2026-03-31',
  series: [
    {
      nombre: 'Semana Pasada',
      estilo: 'dashed',
      datos: [
        { hora: '11:00', valor: 8500 },
        { hora: '12:00', valor: 32000 },
        { hora: '13:00', valor: 68000 },
        { hora: '14:00', valor: 55000 },
        { hora: '15:00', valor: 18000 },
        { hora: '16:00', valor: 6500 },
        { hora: '17:00', valor: 3200 },
        { hora: '18:00', valor: 4800 },
        { hora: '19:00', valor: 15000 },
        { hora: '20:00', valor: 42000 },
        { hora: '21:00', valor: 72000 },
        { hora: '22:00', valor: 58000 },
        { hora: '23:00', valor: 22000 }
      ]
    },
    {
      nombre: 'Ventas Hoy',
      estilo: 'solid',
      datos: [
        { hora: '11:00', valor: 9800 },
        { hora: '12:00', valor: 38500 },
        { hora: '13:00', valor: 78200 },
        { hora: '14:00', valor: 62000 },
        { hora: '15:00', valor: 21000 },
        { hora: '16:00', valor: 7200 },
        { hora: '17:00', valor: 0 },
        { hora: '18:00', valor: 0 },
        { hora: '19:00', valor: 0 },
        { hora: '20:00', valor: 0 },
        { hora: '21:00', valor: 0 },
        { hora: '22:00', valor: 0 },
        { hora: '23:00', valor: 0 }
      ]
    },
    {
      nombre: 'Prediccion IA',
      estilo: 'area',
      datos: [
        { hora: '11:00', valor: 10200 },
        { hora: '12:00', valor: 37000 },
        { hora: '13:00', valor: 76000 },
        { hora: '14:00', valor: 61000 },
        { hora: '15:00', valor: 20500 },
        { hora: '16:00', valor: 7500 },
        { hora: '17:00', valor: 3800 },
        { hora: '18:00', valor: 5500 },
        { hora: '19:00', valor: 17500 },
        { hora: '20:00', valor: 48000 },
        { hora: '21:00', valor: 82000 },
        { hora: '22:00', valor: 66000 },
        { hora: '23:00', valor: 25000 }
      ]
    }
  ]
};
