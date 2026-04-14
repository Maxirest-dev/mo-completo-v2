import {
  ProductoHardware,
  Solucion,
  ListaPrecios,
  MetodoAceptacionOption,
  DatosFacturacion
} from '../models/marketplaces.models';

// ============================================================
// Productos Hardware
// ============================================================

export const MOCK_PRODUCTOS_HARDWARE: ProductoHardware[] = [
  {
    id: 1,
    nombre: 'MAXI ONE',
    subtitulo: 'Terminal de cobro inteligente',
    color: '#F97316',
    features: [
      'Acepta todas las tarjetas y QR',
      'Impresora termica integrada',
      'Conexion WiFi y datos moviles',
      'Bateria de larga duracion'
    ],
    precioMensual: 12500,
    iva: '+ IVA'
  }
];

// ============================================================
// Soluciones (Integraciones)
// ============================================================

export const MOCK_SOLUCIONES: Solucion[] = [
  {
    id: 1,
    nombre: 'Pedidos Ya',
    descripcion: 'Recibe pedidos de Pedidos Ya directamente en tu sistema sin necesidad de tablets adicionales.',
    estado: 'Disponible',
    precioMensual: 8500,
    iconColor: '#E02020',
    iconText: 'PY',
    tieneWizard: true,
    features: [
      'Recepcion automatica de pedidos en el sistema',
      'Sincronizacion de menu y precios en tiempo real',
      'Reportes de ventas por plataforma'
    ],
    descripcionLarga: 'Integra Pedidos Ya con tu sistema Maxirest y recibe todos los pedidos directamente en tu terminal de gestion. Sin tablets adicionales, sin carga manual. Tu menu se sincroniza automaticamente y los pedidos entran al flujo normal de tu cocina.'
  },
  {
    id: 2,
    nombre: 'Rappi',
    descripcion: 'Conecta con Rappi para recibir pedidos de delivery y takeaway.',
    estado: 'Disponible',
    precioMensual: 8500,
    iconColor: '#FF6B00',
    iconText: 'R',
    tieneWizard: false
  },
  {
    id: 3,
    nombre: 'MercadoPago QR',
    descripcion: 'Acepta pagos con QR de MercadoPago directamente desde tus mesas.',
    estado: 'Activo',
    precioMensual: 3200,
    iconColor: '#009EE3',
    iconText: 'MP',
    tieneWizard: false
  },
  {
    id: 4,
    nombre: 'Ordering',
    descripcion: 'Sistema de pedidos online con tu propia marca y dominio personalizado.',
    estado: 'Disponible',
    precioMensual: 6800,
    iconColor: '#7C3AED',
    iconText: 'OR',
    tieneWizard: false
  },
  {
    id: 5,
    nombre: 'Kitchen Display',
    descripcion: 'Pantalla de cocina digital para gestionar comandas sin papel.',
    estado: 'Activo',
    precioMensual: 4500,
    iconColor: '#059669',
    iconText: 'KD',
    tieneWizard: false
  },
  {
    id: 6,
    nombre: 'Reservas Online',
    descripcion: 'Sistema de reservas integrado con Google y redes sociales.',
    estado: 'Inactivo',
    precioMensual: 5200,
    iconColor: '#D946EF',
    iconText: 'RE',
    tieneWizard: false
  },
  {
    id: 7,
    nombre: 'Facturacion Electronica',
    descripcion: 'Emision automatica de facturas electronicas AFIP desde cada venta.',
    estado: 'Activo',
    precioMensual: 3800,
    iconColor: '#0891B2',
    iconText: 'FE',
    tieneWizard: false
  }
];

// ============================================================
// Listas de Precios (para wizard Pedidos Ya)
// ============================================================

export const MOCK_LISTAS_PRECIOS: ListaPrecios[] = [
  { id: 1, nombre: 'Lista Principal - Salon', productosSincronizados: 142 },
  { id: 2, nombre: 'Lista Delivery', productosSincronizados: 98 },
  { id: 3, nombre: 'Lista Takeaway', productosSincronizados: 115 },
  { id: 4, nombre: 'Lista Promociones', productosSincronizados: 45 }
];

// ============================================================
// Metodos de Aceptacion
// ============================================================

export const MOCK_METODOS_ACEPTACION: MetodoAceptacionOption[] = [
  {
    id: 'automatica',
    nombre: 'Aceptacion automatica',
    descripcion: 'Los pedidos se aceptan automaticamente y entran directo al flujo de preparacion.',
    tiempoRespuesta: 'Inmediato',
    recomendado: true
  },
  {
    id: 'manual',
    nombre: 'Aceptacion manual',
    descripcion: 'Cada pedido requiere confirmacion manual antes de entrar al sistema.',
    tiempoRespuesta: 'Hasta 5 minutos',
    recomendado: false
  }
];

// ============================================================
// Datos de Facturacion (mock)
// ============================================================

export const MOCK_DATOS_FACTURACION: DatosFacturacion = {
  metodoPago: 'Debito automatico - Visa **** 4532',
  proximoCargo: '15 de Marzo 2026'
};
