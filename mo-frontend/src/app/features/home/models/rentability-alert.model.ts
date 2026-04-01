export interface RentabilityAlert {
  id: string;
  tipo: RentabilityAlertTipo;
  severidad: RentabilityAlertSeveridad;
  titulo: string;
  descripcion: string;
  sugerencia: string;
  generadoAt: string;
}

export type RentabilityAlertTipo = 'MARGEN_BAJO' | 'COSTO_ALTO' | 'OPORTUNIDAD' | 'TENDENCIA';

export type RentabilityAlertSeveridad = 'INFO' | 'WARNING' | 'CRITICAL';
