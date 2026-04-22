import { Injectable, signal } from '@angular/core';

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class AiPanelService {
  readonly isOpen = signal(false);
  readonly messages = signal<AiMessage[]>([]);
  readonly isTyping = signal(false);

  private messageId = 0;

  toggle(): void {
    this.isOpen.update(v => !v);
    if (this.isOpen() && this.messages().length === 0) {
      this.addWelcomeMessage();
    }
  }

  open(): void {
    this.isOpen.set(true);
    if (this.messages().length === 0) {
      this.addWelcomeMessage();
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

  sendMessage(content: string): void {
    if (!content.trim()) return;

    const userMsg: AiMessage = {
      id: `msg-${++this.messageId}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    this.simulateResponse(content.trim());
  }

  clearChat(): void {
    this.messages.set([]);
  }

  private addWelcomeMessage(): void {
    const welcome: AiMessage = {
      id: `msg-${++this.messageId}`,
      role: 'assistant',
      content: '¡Hola! Soy el asistente IA de **Maxirest**. Puedo ayudarte con el backoffice y el punto de venta.\n\n¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    };
    this.messages.set([welcome]);
  }

  private simulateResponse(userInput: string): void {
    this.isTyping.set(true);

    const lower = userInput.toLowerCase();
    let response = '';

    if (lower.includes('margen') || lower.includes('margin')) {
      response = 'Tu campeón de **abril** fue la **Milanesa Napolitana** 🥇\n\n• **Margen bruto**: 68% (vs. 61% en marzo)\n• **Unidades vendidas**: 312\n• **Aporte total**: $ 1.248.000\n\nSubió 14% en ventas desde la última actualización de precios. Te recomendaría reforzar stock de **muzzarella** y **jamón cocido** antes del fin de semana — van camino a crítico.\n\n¿Querés ver los 5 platos con mejor margen?';
    } else if (lower.includes('inventario') || lower.includes('stock')) {
      response = 'En el módulo de **Inventario** podés:\n\n• Ver el stock actual de todos los insumos\n• Registrar movimientos de entrada y salida\n• Configurar alertas de stock mínimo\n• Ver transformaciones entre insumos\n\n¿Querés que te guíe a alguna sección específica?';
    } else if (lower.includes('venta') || lower.includes('ventas')) {
      response = 'El módulo de **Ventas** te permite:\n\n• Consultar ventas por período\n• Ver comprobantes emitidos (facturas, notas de crédito)\n• Analizar métricas con gráficos interactivos\n• Filtrar por tipo de comprobante y estado\n\n¿Necesitás algo en particular?';
    } else if (lower.includes('pos') || lower.includes('punto de venta') || lower.includes('pdv')) {
      response = 'El **Punto de Venta** incluye:\n\n• Gestión de mesas y salones\n• Registro de pedidos en tiempo real\n• Configuración de medios de pago\n• Turnos de caja con apertura/cierre\n• Vista para mozos, cajeros y encargados\n\n¿Te interesa alguna función en especial?';
    } else if (lower.includes('menu') || lower.includes('carta') || lower.includes('producto')) {
      response = 'En **Menú / Carta** podés gestionar:\n\n• Productos con categorías y subcategorías\n• Precios y actualización masiva\n• Descuentos y promociones\n• Edición masiva de productos\n• Fichas técnicas con costos\n\n¿Qué necesitás hacer?';
    } else if (lower.includes('produccion') || lower.includes('producción')) {
      response = 'El módulo de **Producción** te permite:\n\n• Crear órdenes de producción\n• Asociar recetas e insumos\n• Controlar lotes y vencimientos\n• Ver el estado de cada orden en tiempo real\n\n¿Querés más detalles?';
    } else if (lower.includes('factura') || lower.includes('comprobante')) {
      response = 'Para **Facturación** podés ir a *Mi Cuenta > Facturas* donde encontrás:\n\n• Historial de comprobantes\n• Filtros por fecha, tipo y estado\n• Descarga de PDFs\n• Resumen de montos\n\n¿Te llevo ahí?';
    } else if (lower.includes('hola') || lower.includes('buenas') || lower.includes('hey')) {
      response = '¡Hola! Estoy acá para ayudarte. Podés preguntarme sobre cualquier módulo del sistema: inventario, ventas, menú, producción, punto de venta, facturación y más.\n\n¿Qué necesitás?';
    } else if (lower.includes('gracias') || lower.includes('genial') || lower.includes('perfecto')) {
      response = '¡De nada! Si necesitás algo más, acá estoy.';
    } else {
      response = `Entiendo tu consulta sobre "${userInput}". Puedo ayudarte con:\n\n• **Backoffice**: Inventario, Menú, Producción, Ventas, Compras\n• **Punto de Venta**: Mesas, Pedidos, Caja, Turnos\n• **Configuración**: Usuarios, Negocio, Mi Cuenta\n\nProbá preguntándome algo más específico sobre algún módulo.`;
    }

    setTimeout(() => {
      const assistantMsg: AiMessage = {
        id: `msg-${++this.messageId}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      this.messages.update(msgs => [...msgs, assistantMsg]);
      this.isTyping.set(false);
    }, 800 + Math.random() * 700);
  }
}
