import { AuditoriaEvento, ConfiguracionAuditoria, TipoAccion } from '../models/auditoria.models';

// Tipos de Acción disponibles
export const TIPOS_ACCION: TipoAccion[] = [
  // Mesa
  { id: 1, codigo: 'ANULADA', nombre: 'Anulación', color: '#EF4444', categoria: 'MESA' },
  { id: 2, codigo: 'BORRADA_VACIA', nombre: 'Borrada por quedar vacía', color: '#F97316', categoria: 'MESA' },
  { id: 3, codigo: 'DESCUENTO_GENERAL', nombre: 'Descuento general', color: '#8B5CF6', categoria: 'MESA' },
  { id: 4, codigo: 'CONTROLADA_MOD', nombre: 'Controlada modificada', color: '#3B82F6', categoria: 'MESA' },
  { id: 5, codigo: 'CLIENTE_DESASIG', nombre: 'Cliente desasignado', color: '#6366F1', categoria: 'MESA' },
  { id: 6, codigo: 'DERIVADA_STOCK', nombre: 'Derivada a Mov Stock', color: '#F97316', categoria: 'MESA' },
  { id: 7, codigo: 'TRANSFERENCIA', nombre: 'Transferencia', color: '#10B981', categoria: 'MESA' },
  { id: 8, codigo: 'COMBINACION', nombre: 'Combinación de mesa', color: '#14B8A6', categoria: 'MESA' },
  { id: 9, codigo: 'CONTROL_MESA', nombre: 'Control de mesa', color: '#06B6D4', categoria: 'MESA' },
  { id: 10, codigo: 'MENU_CUBIERTO', nombre: 'Incluye Menu/Cubierto', color: '#0EA5E9', categoria: 'MESA' },
  { id: 11, codigo: 'ELIMINAR_PLANO', nombre: 'Eliminar mesa del plano', color: '#EF4444', categoria: 'MESA' },
  { id: 27, codigo: 'REMARCHADO_COMANDA', nombre: 'Remarchado de comanda', color: '#E11D48', categoria: 'MESA' },

  // Factura
  { id: 12, codigo: 'FACTURA_ANULADA', nombre: 'Anulación de factura', color: '#EF4444', categoria: 'FACTURA' },
  { id: 13, codigo: 'FACTURA_REIMPRESA', nombre: 'Reimpresión de factura', color: '#F59E0B', categoria: 'FACTURA' },
  { id: 14, codigo: 'FACTURA_ELIMINADA', nombre: 'Eliminación definitiva', color: '#DC2626', categoria: 'FACTURA' },

  // Artículo
  { id: 15, codigo: 'ART_ELIMINADO', nombre: 'Artículo eliminado', color: '#EF4444', categoria: 'ARTICULO' },
  { id: 16, codigo: 'ART_INVITADO', nombre: 'Invitación', color: '#3B82F6', categoria: 'ARTICULO' },
  { id: 17, codigo: 'ART_INEXISTENTE', nombre: 'Artículo inexistente', color: '#F97316', categoria: 'ARTICULO' },
  { id: 18, codigo: 'MOD_PRECIO', nombre: 'Modificación de precio', color: '#8B5CF6', categoria: 'ARTICULO' },
  { id: 19, codigo: 'MOD_ITEM', nombre: 'Modificación de ítem', color: '#6366F1', categoria: 'ARTICULO' },

  // Seguridad
  { id: 20, codigo: 'SOLICITUD_MOTIVO', nombre: 'Solicitud de motivo', color: '#F59E0B', categoria: 'SEGURIDAD' },
  { id: 21, codigo: 'ACCESO_CLAVES', nombre: 'Acceso con claves', color: '#10B981', categoria: 'SEGURIDAD' },
  { id: 22, codigo: 'LISTA_PREDET', nombre: 'Usa lista predeterminada', color: '#06B6D4', categoria: 'SEGURIDAD' },

  // Otros
  { id: 23, codigo: 'ESPECIF_MANUAL', nombre: 'Especificaciones manuales', color: '#6B7280', categoria: 'OTRO' },
  { id: 24, codigo: 'AUDIT_VARIAS', nombre: 'Auditorías varias', color: '#9CA3AF', categoria: 'OTRO' },
  { id: 25, codigo: 'CAMBIO_NUM', nombre: 'Cambio de numeración', color: '#64748B', categoria: 'OTRO' },
  { id: 26, codigo: 'MOV_STOCK', nombre: 'Movimiento de Stock', color: '#F97316', categoria: 'OTRO' },
];

// Mock de eventos de auditoría
export const MOCK_EVENTOS: AuditoriaEvento[] = [
  {
    id: 1,
    ubicacion: 'Terraza',
    mesa: 'Mesa 12',
    horaApertura: '10:33',
    horaCierre: '12:02',
    empleado: { id: 1, codigo: 'EMP001', nombre: 'Juan Carlos Pérez', rol: 'Encargado' },
    comprobante: 'FcB- 00019359378',
    precio: 524236.05,
    estado: 'Critico',
    prioridad: 'CRITICO',
    detalles: [
      {
        id: 101,
        hora: '10:33',
        tipoAccion: TIPOS_ACCION[15], // Invitación
        nombreArticulo: 'Papas fritas',
        precio: 45000,
        empleadoSolicitud: 'Juan Carlos Pérez',
        activo: true
      },
      {
        id: 102,
        hora: '11:13',
        tipoAccion: TIPOS_ACCION[25], // Mov Stock
        nombreArticulo: 'Nachos Supreme',
        precio: 38000,
        empleadoSolicitud: 'Juan Carlos Pérez',
        activo: true
      },
      {
        id: 103,
        hora: '12:02',
        tipoAccion: TIPOS_ACCION[0], // Anulación
        nombreArticulo: 'Tequeños',
        precio: 35000,
        empleadoSolicitud: 'Juan Carlos Pérez',
        activo: true
      }
    ]
  },
  {
    id: 2,
    ubicacion: 'Terraza',
    mesa: 'Mesa 12',
    horaApertura: '10:33',
    horaCierre: '12:02',
    empleado: { id: 1, codigo: 'EMP001', nombre: 'Juan Carlos Pérez', rol: 'Encargado' },
    comprobante: 'FcB- 00019359378',
    precio: 524236.05,
    estado: 'Critico',
    prioridad: 'CRITICO',
    detalles: [
      {
        id: 201,
        hora: '10:45',
        tipoAccion: TIPOS_ACCION[17], // Mod precio
        nombreArticulo: 'Hamburguesa Classic',
        precio: 28000,
        empleadoSolicitud: 'María González',
        activo: true
      }
    ]
  },
  {
    id: 3,
    ubicacion: 'Terraza',
    mesa: 'Mesa 12',
    horaApertura: '10:33',
    horaCierre: '12:02',
    empleado: { id: 1, codigo: 'EMP001', nombre: 'Juan Carlos Pérez', rol: 'Encargado' },
    comprobante: 'FcB- 00019359378',
    precio: 524236.05,
    estado: 'Critico',
    prioridad: 'CRITICO',
    detalles: []
  },
  {
    id: 4,
    ubicacion: 'Interior',
    mesa: 'Mesa 5',
    horaApertura: '12:15',
    horaCierre: '13:45',
    empleado: { id: 2, codigo: 'EMP002', nombre: 'María González', rol: 'Mozo' },
    comprobante: 'FcB- 00019359380',
    precio: 187500.00,
    estado: 'Moderado',
    prioridad: 'ALTA',
    detalles: [
      {
        id: 401,
        hora: '12:30',
        tipoAccion: TIPOS_ACCION[14], // Art eliminado
        nombreArticulo: 'Ensalada César',
        precio: 32000,
        empleadoSolicitud: 'María González',
        activo: true
      },
      {
        id: 402,
        hora: '13:00',
        tipoAccion: TIPOS_ACCION[2], // Descuento general
        nombreArticulo: 'Descuento 10%',
        precio: -18750,
        empleadoSolicitud: 'María González',
        activo: true
      }
    ]
  },
  {
    id: 5,
    ubicacion: 'Barra',
    mesa: 'Mostrador 1',
    horaApertura: '14:00',
    horaCierre: '14:15',
    empleado: { id: 3, codigo: 'EMP003', nombre: 'Carlos Rodríguez', rol: 'Cajero' },
    comprobante: 'FcB- 00019359382',
    precio: 45000.00,
    estado: 'Leve',
    prioridad: 'ALTA',
    detalles: [
      {
        id: 501,
        hora: '14:10',
        tipoAccion: TIPOS_ACCION[12], // Reimpresión factura
        nombreArticulo: 'Factura reimprenta',
        precio: 0,
        empleadoSolicitud: 'Carlos Rodríguez',
        activo: true
      }
    ]
  },
  {
    id: 6,
    ubicacion: 'Patio',
    mesa: 'Mesa 8',
    horaApertura: '15:30',
    horaCierre: '17:00',
    empleado: { id: 4, codigo: 'EMP004', nombre: 'Ana Martínez', rol: 'Mozo' },
    comprobante: 'FcB- 00019359385',
    precio: 320000.00,
    estado: 'Moderado',
    prioridad: 'COMUN',
    detalles: [
      {
        id: 601,
        hora: '16:00',
        tipoAccion: TIPOS_ACCION[6], // Transferencia
        nombreArticulo: 'Transferido a Mesa 10',
        precio: 0,
        empleadoSolicitud: 'Ana Martínez',
        activo: true
      }
    ]
  },
  {
    id: 7,
    ubicacion: 'Salón VIP',
    mesa: 'Mesa 2',
    horaApertura: '19:00',
    horaCierre: '22:30',
    empleado: { id: 5, codigo: 'EMP005', nombre: 'Roberto Silva', rol: 'Encargado' },
    comprobante: 'FcB- 00019359390',
    precio: 1250000.00,
    estado: 'Critico',
    prioridad: 'CRITICO',
    detalles: [
      {
        id: 701,
        hora: '20:00',
        tipoAccion: TIPOS_ACCION[11], // Anulación factura
        nombreArticulo: 'Factura anulada',
        precio: -450000,
        empleadoSolicitud: 'Roberto Silva',
        activo: true
      },
      {
        id: 702,
        hora: '21:30',
        tipoAccion: TIPOS_ACCION[20], // Acceso claves
        nombreArticulo: 'Acceso con clave supervisor',
        precio: 0,
        empleadoSolicitud: 'Gerente',
        activo: true
      }
    ]
  },
  {
    id: 8,
    ubicacion: 'Interior',
    mesa: 'Mesa 15',
    horaApertura: '13:00',
    horaCierre: '14:30',
    empleado: { id: 2, codigo: 'EMP002', nombre: 'María González', rol: 'Mozo' },
    comprobante: 'FcB- 00019359392',
    precio: 89000.00,
    estado: 'Leve',
    prioridad: 'BAJA',
    detalles: [
      {
        id: 801,
        hora: '13:30',
        tipoAccion: TIPOS_ACCION[22], // Especif manual
        nombreArticulo: 'Sin sal, extra queso',
        precio: 0,
        empleadoSolicitud: 'María González',
        activo: true
      }
    ]
  }
];

// Configuraciones de auditoría
export const MOCK_CONFIGURACIONES: ConfiguracionAuditoria[] = [
  // Mesa
  { id: 1, categoria: 'MESA', nombre: 'Anulada', activo: true, tieneConfigExtra: false },
  { id: 2, categoria: 'MESA', nombre: 'Borrada por quedar vacía', activo: false, tieneConfigExtra: false },
  { id: 3, categoria: 'MESA', nombre: 'Descuento general', activo: true, tieneConfigExtra: false },
  { id: 4, categoria: 'MESA', nombre: 'Controlada modificada', activo: true, tieneConfigExtra: false },
  { id: 5, categoria: 'MESA', nombre: 'Cliente desasignado', activo: true, tieneConfigExtra: false },
  { id: 6, categoria: 'MESA', nombre: 'Derivada a Mov Stock', activo: false, tieneConfigExtra: false },
  { id: 7, categoria: 'MESA', nombre: 'Transferencia', activo: true, tieneConfigExtra: false },
  { id: 8, categoria: 'MESA', nombre: 'Combinación de mesa', activo: false, tieneConfigExtra: false },
  { id: 9, categoria: 'MESA', nombre: 'Control de mesa', activo: true, tieneConfigExtra: false },
  { id: 10, categoria: 'MESA', nombre: 'Incluye Menu/Cubierto', activo: false, tieneConfigExtra: false },
  { id: 11, categoria: 'MESA', nombre: 'Eliminar mesa del plano', activo: false, tieneConfigExtra: false },
  { id: 22, categoria: 'MESA', nombre: 'Remarchado de comanda', activo: false, tieneConfigExtra: false },

  // Factura
  { id: 12, categoria: 'FACTURA', nombre: 'Anulada', activo: true, tieneConfigExtra: false },
  { id: 13, categoria: 'FACTURA', nombre: 'Reimpresa', activo: false, tieneConfigExtra: false },
  { id: 14, categoria: 'FACTURA', nombre: 'Eliminación definitiva', activo: true, tieneConfigExtra: false },

  // Artículo
  { id: 15, categoria: 'ARTICULO', nombre: 'Eliminado', activo: true, tieneConfigExtra: false },
  { id: 16, categoria: 'ARTICULO', nombre: 'Invitado', activo: false, tieneConfigExtra: false },
  { id: 17, categoria: 'ARTICULO', nombre: 'Inexistente', activo: true, tieneConfigExtra: false },
  { id: 18, categoria: 'ARTICULO', nombre: 'Modificación de precio', activo: false, tieneConfigExtra: false },

  // Seguridad
  { id: 19, categoria: 'SEGURIDAD', nombre: 'Solicitud de motivo', descripcion: 'Servicio de mesa', activo: true, tieneConfigExtra: true },
  { id: 20, categoria: 'SEGURIDAD', nombre: 'Usar lista predeterminada', descripcion: 'Punto de venta', activo: true, tieneConfigExtra: true },
  { id: 21, categoria: 'SEGURIDAD', nombre: 'Acceso con claves', descripcion: 'Envíos', activo: false, tieneConfigExtra: true },
];
