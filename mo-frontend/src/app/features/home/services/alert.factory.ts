import {
  StockAlert,
  StockAlertEstado,
  RentabilityAlert,
  RentabilityAlertTipo,
  RentabilityAlertSeveridad
} from '../models';

/**
 * Factory Method pattern -- centralizes creation of typed alerts
 * with consistent validation, severity calculation, and defaults.
 */
export class AlertFactory {

  /**
   * Creates a StockAlert, automatically calculating porcentaje and estado
   * based on stockActual vs stockMinimo.
   */
  static createStockAlert(data: {
    insumoId: string;
    nombre: string;
    stockActual: number;
    stockMinimo: number;
    unidad: string;
    depositoNombre?: string;
  }): StockAlert {
    const porcentaje = data.stockMinimo > 0
      ? Math.round((data.stockActual / data.stockMinimo) * 100)
      : 0;

    const estado: StockAlertEstado = porcentaje < 20
      ? 'CRITICO'
      : porcentaje < 50
        ? 'BAJO'
        : 'NORMAL';

    return {
      insumoId: data.insumoId,
      nombre: data.nombre,
      stockActual: data.stockActual,
      stockMinimo: data.stockMinimo,
      porcentaje,
      estado,
      unidad: data.unidad,
      depositoNombre: data.depositoNombre
    };
  }

  /**
   * Creates a RentabilityAlert, assigning severidad based on the alert tipo.
   * MARGEN_BAJO and COSTO_ALTO are critical/warning; others are informational.
   */
  static createRentabilityAlert(data: {
    tipo: RentabilityAlertTipo;
    titulo: string;
    descripcion: string;
    sugerencia: string;
  }): RentabilityAlert {
    const severidad: RentabilityAlertSeveridad = AlertFactory.calcSeverity(data.tipo);

    return {
      id: crypto.randomUUID(),
      tipo: data.tipo,
      severidad,
      titulo: data.titulo,
      descripcion: data.descripcion,
      sugerencia: data.sugerencia,
      generadoAt: new Date().toISOString()
    };
  }

  // --- Private helpers ---

  private static calcSeverity(tipo: RentabilityAlertTipo): RentabilityAlertSeveridad {
    switch (tipo) {
      case 'MARGEN_BAJO':
        return 'CRITICAL';
      case 'COSTO_ALTO':
        return 'WARNING';
      case 'OPORTUNIDAD':
      case 'TENDENCIA':
        return 'INFO';
    }
  }
}
