// ============================================================
// Marketplaces Domain Models
// ============================================================

// --- Productos Hardware ---

export interface ProductoHardware {
  id: number;
  nombre: string;
  subtitulo: string;
  color: string;
  features: string[];
  precioMensual: number;
  iva: string;
}

// --- Soluciones (Integraciones) ---

export type EstadoSolucion = 'Activo' | 'Disponible' | 'Inactivo';

export interface Solucion {
  id: number;
  nombre: string;
  descripcion: string;
  estado: EstadoSolucion;
  precioMensual: number;
  iconColor: string;
  iconText: string;
  tieneWizard: boolean;
  features?: string[];
  descripcionLarga?: string;
}

// --- Wizard Pedidos Ya ---

export interface Sucursal {
  id: string;
  codigo: string;
  nombre: string;
  marca: string;
}

export type TipoIdentificacionTienda = 'existente' | 'nueva';

export interface IdentificacionTienda {
  sucursal: Sucursal | null;
  tipo: TipoIdentificacionTienda | null;
  idTienda: string;
}

export interface ListaPrecios {
  id: number;
  nombre: string;
  productosSincronizados: number;
}

export interface MetodoAceptacionOption {
  id: 'automatica' | 'manual';
  nombre: string;
  descripcion: string;
  tiempoRespuesta: string;
  recomendado: boolean;
}

export interface ConfiguracionPedidosYa {
  listaPrecios: ListaPrecios | null;
  metodoAceptacion: MetodoAceptacionOption | null;
  terminosAceptados: boolean;
}

export interface DatosFacturacion {
  metodoPago: string;
  proximoCargo: string;
}

export type EstadoIntegracion =
  | 'idle'
  | 'contratacion'
  | 'identificacion'
  | 'configuracion'
  | 'confirmacion'
  | 'activando'
  | 'exito';

export interface ResultadoActivacion {
  sincronizacionIniciada: boolean;
  menuPublicado: boolean;
  sistemaListo: boolean;
}
