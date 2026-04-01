import {
  OrdenCompra,
  Proveedor,
  Insumo,
  CategoriaInsumo,
  ProyeccionPagos,
  RubroConceptoGasto,
  ConceptoGasto
} from '../models/compras.models';

// ============================================================
// Categorias de Insumos
// ============================================================

export const MOCK_CATEGORIAS: CategoriaInsumo[] = [
  { id: 1, nombre: 'Carnes' },
  { id: 2, nombre: 'Lácteos' },
  { id: 3, nombre: 'Verduras y Frutas' },
  { id: 4, nombre: 'Panadería' },
  { id: 5, nombre: 'Bebidas' },
  { id: 6, nombre: 'Condimentos' },
  { id: 7, nombre: 'Aceites y Grasas' },
  { id: 8, nombre: 'Limpieza' },
  { id: 9, nombre: 'Descartables' },
  { id: 10, nombre: 'Pescados y Mariscos' },
  { id: 11, nombre: 'Congelados' },
  { id: 12, nombre: 'Secos y Harinas' }
];

// ============================================================
// Proveedores
// ============================================================

export const MOCK_PROVEEDORES: Proveedor[] = [
  { id: 1, codigo: 'PROV-001', nombre: 'COTO', razonSocial: 'COTO C.I.C.S.A.', cuit: '30-50099444-5', email: 'compras@coto.com.ar', telefono: '011-4000-1234', direccion: 'Av. Libertador 4200, CABA', condicionIVA: 'Responsable Inscripto', diasCredito: 30, activo: true, tipo: 'Distribuidora', pedidosRealizados: 24, conceptoGastoId: null },
  { id: 2, codigo: 'PROV-002', nombre: 'FEMSA S.R.L.', razonSocial: 'FEMSA Argentina S.R.L.', cuit: '30-71234567-8', email: 'ventas@femsa.com.ar', telefono: '011-5555-6789', direccion: 'Av. del Libertador 101, Vicente López', condicionIVA: 'Responsable Inscripto', diasCredito: 45, activo: true, tipo: 'Bebidas', pedidosRealizados: 18, conceptoGastoId: null },
  { id: 3, codigo: 'PROV-003', nombre: 'Distribuidora Norte', razonSocial: 'Distribuidora Norte S.A.', cuit: '30-65432198-7', email: 'pedidos@distnorte.com.ar', telefono: '011-4321-8765', direccion: 'Ruta 8 Km 42, Pilar', condicionIVA: 'Responsable Inscripto', diasCredito: 15, activo: true, tipo: 'Distribuidora', pedidosRealizados: 31, conceptoGastoId: null },
  { id: 4, codigo: 'PROV-004', nombre: 'Frigorífico Pampero', razonSocial: 'Frigorífico Pampero S.A.', cuit: '30-54321876-3', email: 'ventas@pampero.com.ar', telefono: '011-4567-1234', direccion: 'Parque Industrial Pilar, Pilar', condicionIVA: 'Responsable Inscripto', diasCredito: 30, activo: true, tipo: 'Carnes', pedidosRealizados: 42, conceptoGastoId: 1 },
  { id: 5, codigo: 'PROV-005', nombre: 'Lácteos del Sur', razonSocial: 'Lácteos del Sur S.R.L.', cuit: '30-71111111-2', email: 'pedidos@lacteossur.com.ar', telefono: '011-3456-7890', direccion: 'Av. San Martín 3200, Avellaneda', condicionIVA: 'Responsable Inscripto', diasCredito: 20, activo: true, tipo: 'Lácteos', pedidosRealizados: 36, conceptoGastoId: null },
  { id: 6, codigo: 'PROV-006', nombre: 'Verdulería Central', razonSocial: 'Verdulería Central S.A.', cuit: '30-72222222-3', email: 'contacto@verdcentral.com.ar', telefono: '011-2345-6789', direccion: 'Mercado Central, La Matanza', condicionIVA: 'Monotributo', diasCredito: 7, activo: true, tipo: 'Verduras', pedidosRealizados: 58, conceptoGastoId: null },
  { id: 7, codigo: 'PROV-007', nombre: 'Bebidas Express', razonSocial: 'Bebidas Express S.A.', cuit: '30-73333333-4', email: 'ventas@bebidasexpress.com.ar', telefono: '011-6789-0123', direccion: 'Av. Corrientes 1500, CABA', condicionIVA: 'Responsable Inscripto', diasCredito: 30, activo: true, tipo: 'Bebidas', pedidosRealizados: 15, conceptoGastoId: null },
  { id: 8, codigo: 'PROV-008', nombre: 'Pan del Día', razonSocial: 'Panificadora del Día S.R.L.', cuit: '30-74444444-5', email: 'pedidos@pandeldia.com.ar', telefono: '011-7890-1234', direccion: 'Av. Rivadavia 8500, CABA', condicionIVA: 'Monotributo', diasCredito: 7, activo: true, tipo: 'Panadería', pedidosRealizados: 47, conceptoGastoId: null },
  { id: 9, codigo: 'PROV-009', nombre: 'Limpieza Total', razonSocial: 'Limpieza Total S.R.L.', cuit: '30-75555555-6', email: 'ventas@limpiezatotal.com.ar', telefono: '011-8901-2345', direccion: 'Parque Industrial Burzaco', condicionIVA: 'Responsable Inscripto', diasCredito: 30, activo: true, tipo: 'Limpieza', pedidosRealizados: 12, conceptoGastoId: null },
  { id: 10, codigo: 'PROV-010', nombre: 'Pesquera Atlántica', razonSocial: 'Pesquera Atlántica S.A.', cuit: '30-76666666-7', email: 'ventas@pesqueraatl.com.ar', telefono: '0223-456-7890', direccion: 'Puerto de Mar del Plata', condicionIVA: 'Responsable Inscripto', diasCredito: 15, activo: true, tipo: 'Pescados', pedidosRealizados: 22, conceptoGastoId: 1 },
  { id: 11, codigo: 'PROV-011', nombre: 'Condimentos Sabor', razonSocial: 'Sabor Argentino S.A.', cuit: '30-77777777-8', email: 'ventas@condimentossabor.com.ar', telefono: '011-9012-3456', direccion: 'Av. Juan B. Justo 3400, CABA', condicionIVA: 'Responsable Inscripto', diasCredito: 30, activo: true, tipo: 'Condimentos', pedidosRealizados: 9, conceptoGastoId: null },
  { id: 12, codigo: 'PROV-012', nombre: 'Aceites del Litoral', razonSocial: 'Aceites del Litoral S.A.', cuit: '30-78888888-9', email: 'comercial@aceiteslitoral.com.ar', telefono: '0341-456-7890', direccion: 'Parque Industrial Rosario', condicionIVA: 'Responsable Inscripto', diasCredito: 30, activo: false, tipo: 'Aceites', pedidosRealizados: 5, conceptoGastoId: null },
  { id: 13, codigo: 'PROV-013', nombre: 'Descartables YA', razonSocial: 'Descartables YA S.R.L.', cuit: '30-79999999-0', email: 'ventas@descartablesya.com.ar', telefono: '011-0123-4567', direccion: 'Av. Mosconi 2800, CABA', condicionIVA: 'Responsable Inscripto', diasCredito: 15, activo: true, tipo: 'Descartables', pedidosRealizados: 20, conceptoGastoId: null },
  { id: 14, codigo: 'PROV-014', nombre: 'Harinas San Luis', razonSocial: 'Molino San Luis S.A.', cuit: '30-80000000-1', email: 'ventas@harinassanluis.com.ar', telefono: '0266-444-5555', direccion: 'Ruta 7 Km 790, San Luis', condicionIVA: 'Responsable Inscripto', diasCredito: 30, activo: true, tipo: 'Harinas', pedidosRealizados: 14, conceptoGastoId: null },
  { id: 15, codigo: 'PROV-015', nombre: 'Congelados Express', razonSocial: 'Congelados Express S.A.', cuit: '30-81111111-2', email: 'ventas@congeladosexp.com.ar', telefono: '011-1234-5678', direccion: 'Parque Industrial Tortuguitas', condicionIVA: 'Responsable Inscripto', diasCredito: 15, activo: true, tipo: 'Congelados', pedidosRealizados: 27, conceptoGastoId: null }
];

// ============================================================
// Insumos (Materias Primas)
// ============================================================

export const MOCK_INSUMOS: Insumo[] = [
  // Carnes
  { id: 1, codigo: 'INS-001', nombre: 'Bife de Chorizo', categoriaId: 1, categoria: 'Carnes', unidadMedida: 'kg', stockActual: 45, stockMinimo: 20, estado: 'Activo', precioUnitario: 8500 },
  { id: 2, codigo: 'INS-002', nombre: 'Pollo Entero', categoriaId: 1, categoria: 'Carnes', unidadMedida: 'kg', stockActual: 30, stockMinimo: 15, estado: 'Activo', precioUnitario: 3200 },
  { id: 3, codigo: 'INS-003', nombre: 'Entraña', categoriaId: 1, categoria: 'Carnes', unidadMedida: 'kg', stockActual: 8, stockMinimo: 10, estado: 'StockBajo', precioUnitario: 9800 },
  { id: 4, codigo: 'INS-004', nombre: 'Cerdo Bondiola', categoriaId: 1, categoria: 'Carnes', unidadMedida: 'kg', stockActual: 25, stockMinimo: 10, estado: 'Activo', precioUnitario: 6500 },
  // Lácteos
  { id: 5, codigo: 'INS-005', nombre: 'Queso Mozzarella', categoriaId: 2, categoria: 'Lácteos', unidadMedida: 'kg', stockActual: 20, stockMinimo: 10, estado: 'Activo', precioUnitario: 5200 },
  { id: 6, codigo: 'INS-006', nombre: 'Crema de Leche', categoriaId: 2, categoria: 'Lácteos', unidadMedida: 'lt', stockActual: 15, stockMinimo: 8, estado: 'Activo', precioUnitario: 2800 },
  { id: 7, codigo: 'INS-007', nombre: 'Manteca', categoriaId: 2, categoria: 'Lácteos', unidadMedida: 'kg', stockActual: 5, stockMinimo: 8, estado: 'StockBajo', precioUnitario: 4500 },
  { id: 8, codigo: 'INS-008', nombre: 'Queso Parmesano', categoriaId: 2, categoria: 'Lácteos', unidadMedida: 'kg', stockActual: 12, stockMinimo: 5, estado: 'Activo', precioUnitario: 12000 },
  // Verduras y Frutas
  { id: 9, codigo: 'INS-009', nombre: 'Tomate Redondo', categoriaId: 3, categoria: 'Verduras y Frutas', unidadMedida: 'kg', stockActual: 40, stockMinimo: 20, estado: 'Activo', precioUnitario: 1800 },
  { id: 10, codigo: 'INS-010', nombre: 'Lechuga Criolla', categoriaId: 3, categoria: 'Verduras y Frutas', unidadMedida: 'u', stockActual: 0, stockMinimo: 15, estado: 'SinStock', precioUnitario: 800 },
  { id: 11, codigo: 'INS-011', nombre: 'Cebolla', categoriaId: 3, categoria: 'Verduras y Frutas', unidadMedida: 'kg', stockActual: 25, stockMinimo: 10, estado: 'Activo', precioUnitario: 1200 },
  { id: 12, codigo: 'INS-012', nombre: 'Papa', categoriaId: 3, categoria: 'Verduras y Frutas', unidadMedida: 'kg', stockActual: 50, stockMinimo: 20, estado: 'Activo', precioUnitario: 900 },
  { id: 13, codigo: 'INS-013', nombre: 'Limón', categoriaId: 3, categoria: 'Verduras y Frutas', unidadMedida: 'kg', stockActual: 10, stockMinimo: 5, estado: 'Activo', precioUnitario: 2200 },
  // Panadería
  { id: 14, codigo: 'INS-014', nombre: 'Pan de Hamburguesa', categoriaId: 4, categoria: 'Panadería', unidadMedida: 'u', stockActual: 100, stockMinimo: 50, estado: 'Activo', precioUnitario: 350 },
  { id: 15, codigo: 'INS-015', nombre: 'Tapas de Empanada', categoriaId: 4, categoria: 'Panadería', unidadMedida: 'docena', stockActual: 20, stockMinimo: 10, estado: 'Activo', precioUnitario: 1500 },
  // Bebidas
  { id: 16, codigo: 'INS-016', nombre: 'Coca-Cola 2.25L', categoriaId: 5, categoria: 'Bebidas', unidadMedida: 'u', stockActual: 48, stockMinimo: 24, estado: 'Activo', precioUnitario: 2500 },
  { id: 17, codigo: 'INS-017', nombre: 'Agua Mineral 500ml', categoriaId: 5, categoria: 'Bebidas', unidadMedida: 'pack x6', stockActual: 3, stockMinimo: 10, estado: 'StockBajo', precioUnitario: 3600 },
  { id: 18, codigo: 'INS-018', nombre: 'Vino Malbec', categoriaId: 5, categoria: 'Bebidas', unidadMedida: 'u', stockActual: 24, stockMinimo: 12, estado: 'Activo', precioUnitario: 4500 },
  // Condimentos
  { id: 19, codigo: 'INS-019', nombre: 'Sal Fina', categoriaId: 6, categoria: 'Condimentos', unidadMedida: 'kg', stockActual: 10, stockMinimo: 5, estado: 'Activo', precioUnitario: 600 },
  { id: 20, codigo: 'INS-020', nombre: 'Pimienta Negra', categoriaId: 6, categoria: 'Condimentos', unidadMedida: 'kg', stockActual: 2, stockMinimo: 1, estado: 'Activo', precioUnitario: 8500 },
  // Aceites
  { id: 21, codigo: 'INS-021', nombre: 'Aceite de Oliva', categoriaId: 7, categoria: 'Aceites y Grasas', unidadMedida: 'lt', stockActual: 15, stockMinimo: 5, estado: 'Activo', precioUnitario: 6800 },
  { id: 22, codigo: 'INS-022', nombre: 'Aceite de Girasol', categoriaId: 7, categoria: 'Aceites y Grasas', unidadMedida: 'lt', stockActual: 20, stockMinimo: 10, estado: 'Activo', precioUnitario: 2200 },
  // Limpieza
  { id: 23, codigo: 'INS-023', nombre: 'Detergente 5L', categoriaId: 8, categoria: 'Limpieza', unidadMedida: 'u', stockActual: 4, stockMinimo: 3, estado: 'Activo', precioUnitario: 5500 },
  { id: 24, codigo: 'INS-024', nombre: 'Lavandina 5L', categoriaId: 8, categoria: 'Limpieza', unidadMedida: 'u', stockActual: 6, stockMinimo: 4, estado: 'Activo', precioUnitario: 3200 },
  // Descartables
  { id: 25, codigo: 'INS-025', nombre: 'Servilletas x1000', categoriaId: 9, categoria: 'Descartables', unidadMedida: 'paq', stockActual: 8, stockMinimo: 5, estado: 'Activo', precioUnitario: 4800 },
  { id: 26, codigo: 'INS-026', nombre: 'Film 38cm', categoriaId: 9, categoria: 'Descartables', unidadMedida: 'rollo', stockActual: 3, stockMinimo: 2, estado: 'Activo', precioUnitario: 6200 },
  // Pescados
  { id: 27, codigo: 'INS-027', nombre: 'Salmón Rosado', categoriaId: 10, categoria: 'Pescados y Mariscos', unidadMedida: 'kg', stockActual: 0, stockMinimo: 5, estado: 'SinStock', precioUnitario: 15000 },
  { id: 28, codigo: 'INS-028', nombre: 'Merluza', categoriaId: 10, categoria: 'Pescados y Mariscos', unidadMedida: 'kg', stockActual: 10, stockMinimo: 8, estado: 'Activo', precioUnitario: 5500 },
  // Congelados
  { id: 29, codigo: 'INS-029', nombre: 'Papas Pre-fritas', categoriaId: 11, categoria: 'Congelados', unidadMedida: 'kg', stockActual: 30, stockMinimo: 15, estado: 'Activo', precioUnitario: 3800 },
  { id: 30, codigo: 'INS-030', nombre: 'Helado Vainilla', categoriaId: 11, categoria: 'Congelados', unidadMedida: 'kg', stockActual: 0, stockMinimo: 5, estado: 'SinStock', precioUnitario: 7500 },
  // Secos
  { id: 31, codigo: 'INS-031', nombre: 'Harina 000', categoriaId: 12, categoria: 'Secos y Harinas', unidadMedida: 'kg', stockActual: 50, stockMinimo: 20, estado: 'Activo', precioUnitario: 800 },
  { id: 32, codigo: 'INS-032', nombre: 'Arroz Largo Fino', categoriaId: 12, categoria: 'Secos y Harinas', unidadMedida: 'kg', stockActual: 25, stockMinimo: 10, estado: 'Activo', precioUnitario: 1600 },
  // One inactivo
  { id: 33, codigo: 'INS-033', nombre: 'Azúcar Impalpable', categoriaId: 12, categoria: 'Secos y Harinas', unidadMedida: 'kg', stockActual: 5, stockMinimo: 3, estado: 'Inactivo', precioUnitario: 2200 }
];

// ============================================================
// Rubros de Conceptos de Gasto
// ============================================================

export const MOCK_RUBROS_CONCEPTO: RubroConceptoGasto[] = [
  { id: 1, nombre: 'Fletes' },
  { id: 2, nombre: 'Servicios' },
  { id: 3, nombre: 'Alquileres' },
  { id: 4, nombre: 'Mantenimiento' }
];

// ============================================================
// Conceptos de Gasto
// ============================================================

export const MOCK_CONCEPTOS_GASTO: ConceptoGasto[] = [
  { id: 1, rubroId: 1, rubro: 'Fletes', nombre: 'Flete refrigerado', activo: true },
  { id: 2, rubroId: 1, rubro: 'Fletes', nombre: 'Flete seco', activo: true },
  { id: 3, rubroId: 2, rubro: 'Servicios', nombre: 'Servicio técnico', activo: true },
  { id: 4, rubroId: 3, rubro: 'Alquileres', nombre: 'Alquiler depósito', activo: true },
  { id: 5, rubroId: 4, rubro: 'Mantenimiento', nombre: 'Mantenimiento equipo frío', activo: true }
];

// ============================================================
// Ordenes de Compra
// ============================================================

export const MOCK_ORDENES: OrdenCompra[] = [
  {
    id: 1, numero: '00062851', puntoVenta: '002', numeroComprobante: '0004543521',
    proveedorId: 1, proveedor: 'COTO', tipo: 'Orden', tipoFactura: null, estado: 'Pedida',
    fechaCreacion: '2025-01-08', fechaPedido: '2025-01-08', fechaRecepcion: null, fechaVencimiento: null,
    observaciones: '', cantidadProductos: 6,
    productos: [
      { id: 1, insumoId: 1, insumo: 'Bife de Chorizo', unidadMedida: 'kg', stockActual: 45, estado: 'Activo', unidades: 10, precioUnitario: 8500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 85000 },
      { id: 2, insumoId: 5, insumo: 'Queso Mozzarella', unidadMedida: 'kg', stockActual: 20, estado: 'Activo', unidades: 5, precioUnitario: 5200, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 26000 },
      { id: 3, insumoId: 9, insumo: 'Tomate Redondo', unidadMedida: 'kg', stockActual: 40, estado: 'Activo', unidades: 8, precioUnitario: 1800, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 14400 },
      { id: 4, insumoId: 11, insumo: 'Cebolla', unidadMedida: 'kg', stockActual: 25, estado: 'Activo', unidades: 3, precioUnitario: 1200, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 3600 },
      { id: 5, insumoId: 19, insumo: 'Sal Fina', unidadMedida: 'kg', stockActual: 10, estado: 'Activo', unidades: 2, precioUnitario: 600, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 1200 },
      { id: 6, insumoId: 21, insumo: 'Aceite de Oliva', unidadMedida: 'lt', stockActual: 15, estado: 'Activo', unidades: 3, precioUnitario: 6800, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 20400 }
    ],
    subtotal: 150600, total: 150600,
    netoGravado: null, montoIVA: null, percepcionIIBB: null, percepcionIVA: null,
    descuentoTipo: null, descuentoPorcentaje: null, descuentoMonto: null, condicionPago: null
  },
  {
    id: 2, numero: '00062852', puntoVenta: '002', numeroComprobante: '0004543522',
    proveedorId: 1, proveedor: 'COTO', tipo: 'Orden', tipoFactura: null, estado: 'Pendiente',
    fechaCreacion: '2025-01-08', fechaPedido: null, fechaRecepcion: null, fechaVencimiento: null,
    observaciones: 'Urgente - revisar stock', cantidadProductos: 6,
    productos: [
      { id: 7, insumoId: 2, insumo: 'Pollo Entero', unidadMedida: 'kg', stockActual: 30, estado: 'Activo', unidades: 15, precioUnitario: 3200, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 48000 },
      { id: 8, insumoId: 12, insumo: 'Papa', unidadMedida: 'kg', stockActual: 50, estado: 'Activo', unidades: 20, precioUnitario: 900, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 18000 },
      { id: 9, insumoId: 14, insumo: 'Pan de Hamburguesa', unidadMedida: 'u', stockActual: 100, estado: 'Activo', unidades: 50, precioUnitario: 350, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 17500 },
      { id: 10, insumoId: 16, insumo: 'Coca-Cola 2.25L', unidadMedida: 'u', stockActual: 48, estado: 'Activo', unidades: 24, precioUnitario: 2500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 60000 },
      { id: 11, insumoId: 22, insumo: 'Aceite de Girasol', unidadMedida: 'lt', stockActual: 20, estado: 'Activo', unidades: 10, precioUnitario: 2200, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 22000 },
      { id: 12, insumoId: 29, insumo: 'Papas Pre-fritas', unidadMedida: 'kg', stockActual: 30, estado: 'Activo', unidades: 15, precioUnitario: 3800, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 57000 }
    ],
    subtotal: 222500, total: 222500,
    netoGravado: null, montoIVA: null, percepcionIIBB: null, percepcionIVA: null,
    descuentoTipo: null, descuentoPorcentaje: null, descuentoMonto: null, condicionPago: null
  },
  {
    id: 3, numero: '00062853', puntoVenta: '002', numeroComprobante: '0004543523',
    proveedorId: 4, proveedor: 'Frigorífico Pampero', tipo: 'Orden', tipoFactura: null, estado: 'Recibida',
    fechaCreacion: '2025-01-05', fechaPedido: '2025-01-05', fechaRecepcion: '2025-01-07', fechaVencimiento: null,
    observaciones: '', cantidadProductos: 3,
    productos: [
      { id: 13, insumoId: 1, insumo: 'Bife de Chorizo', unidadMedida: 'kg', stockActual: 45, estado: 'Activo', unidades: 20, precioUnitario: 8500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 170000 },
      { id: 14, insumoId: 3, insumo: 'Entraña', unidadMedida: 'kg', stockActual: 8, estado: 'StockBajo', unidades: 15, precioUnitario: 9800, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 147000 },
      { id: 15, insumoId: 4, insumo: 'Cerdo Bondiola', unidadMedida: 'kg', stockActual: 25, estado: 'Activo', unidades: 10, precioUnitario: 6500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 65000 }
    ],
    subtotal: 382000, total: 382000,
    netoGravado: null, montoIVA: null, percepcionIIBB: null, percepcionIVA: null,
    descuentoTipo: null, descuentoPorcentaje: null, descuentoMonto: null, condicionPago: null
  },
  {
    id: 4, numero: 'A-0002-00062854', puntoVenta: '002', numeroComprobante: '0004543524',
    proveedorId: 5, proveedor: 'Lácteos del Sur', tipo: 'Factura', tipoFactura: 'Factura A', estado: 'Facturada',
    fechaCreacion: '2025-01-03', fechaPedido: '2025-01-03', fechaRecepcion: '2025-01-05', fechaVencimiento: '2025-02-05',
    observaciones: 'Factura con 30 dias de crédito', cantidadProductos: 4,
    productos: [
      { id: 16, insumoId: 5, insumo: 'Queso Mozzarella', unidadMedida: 'kg', stockActual: 20, estado: 'Activo', unidades: 10, precioUnitario: 5200, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 52000 },
      { id: 17, insumoId: 6, insumo: 'Crema de Leche', unidadMedida: 'lt', stockActual: 15, estado: 'Activo', unidades: 12, precioUnitario: 2800, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 33600 },
      { id: 18, insumoId: 7, insumo: 'Manteca', unidadMedida: 'kg', stockActual: 5, estado: 'StockBajo', unidades: 8, precioUnitario: 4500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 36000 },
      { id: 19, insumoId: 8, insumo: 'Queso Parmesano', unidadMedida: 'kg', stockActual: 12, estado: 'Activo', unidades: 5, precioUnitario: 12000, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 60000 }
    ],
    subtotal: 181600, total: 213049.20,
    netoGravado: 172520, montoIVA: 36229.20, percepcionIIBB: 2500, percepcionIVA: 1800,
    descuentoTipo: 'porcentaje', descuentoPorcentaje: 5, descuentoMonto: null, condicionPago: '30 días'
  },
  {
    id: 5, numero: 'A-0002-00062855', puntoVenta: '002', numeroComprobante: '0004543525',
    proveedorId: 2, proveedor: 'FEMSA S.R.L.', tipo: 'Factura', tipoFactura: 'Factura A', estado: 'Pagada',
    fechaCreacion: '2024-12-20', fechaPedido: '2024-12-20', fechaRecepcion: '2024-12-22', fechaVencimiento: '2025-01-20',
    observaciones: '', cantidadProductos: 3,
    productos: [
      { id: 20, insumoId: 16, insumo: 'Coca-Cola 2.25L', unidadMedida: 'u', stockActual: 48, estado: 'Activo', unidades: 48, precioUnitario: 2500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 120000 },
      { id: 21, insumoId: 17, insumo: 'Agua Mineral 500ml', unidadMedida: 'pack x6', stockActual: 3, estado: 'StockBajo', unidades: 20, precioUnitario: 3600, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 72000 },
      { id: 22, insumoId: 18, insumo: 'Vino Malbec', unidadMedida: 'u', stockActual: 24, estado: 'Activo', unidades: 12, precioUnitario: 4500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 54000 }
    ],
    subtotal: 246000, total: 300860,
    netoGravado: 246000, montoIVA: 51660, percepcionIIBB: 3200, percepcionIVA: 0,
    descuentoTipo: null, descuentoPorcentaje: null, descuentoMonto: null, condicionPago: '30 días'
  },
  {
    id: 6, numero: '00062856', puntoVenta: '002', numeroComprobante: '0004543526',
    proveedorId: 6, proveedor: 'Verdulería Central', tipo: 'Orden', tipoFactura: null, estado: 'Pendiente',
    fechaCreacion: '2025-01-09', fechaPedido: null, fechaRecepcion: null, fechaVencimiento: null,
    observaciones: 'Pedido semanal verduras', cantidadProductos: 5,
    productos: [
      { id: 23, insumoId: 9, insumo: 'Tomate Redondo', unidadMedida: 'kg', stockActual: 40, estado: 'Activo', unidades: 15, precioUnitario: 1800, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 27000 },
      { id: 24, insumoId: 10, insumo: 'Lechuga Criolla', unidadMedida: 'u', stockActual: 0, estado: 'SinStock', unidades: 20, precioUnitario: 800, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 16000 },
      { id: 25, insumoId: 11, insumo: 'Cebolla', unidadMedida: 'kg', stockActual: 25, estado: 'Activo', unidades: 10, precioUnitario: 1200, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 12000 },
      { id: 26, insumoId: 12, insumo: 'Papa', unidadMedida: 'kg', stockActual: 50, estado: 'Activo', unidades: 25, precioUnitario: 900, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 22500 },
      { id: 27, insumoId: 13, insumo: 'Limón', unidadMedida: 'kg', stockActual: 10, estado: 'Activo', unidades: 5, precioUnitario: 2200, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 11000 }
    ],
    subtotal: 88500, total: 88500,
    netoGravado: null, montoIVA: null, percepcionIIBB: null, percepcionIVA: null,
    descuentoTipo: null, descuentoPorcentaje: null, descuentoMonto: null, condicionPago: null
  },
  {
    id: 7, numero: '00062857', puntoVenta: '002', numeroComprobante: '0004543527',
    proveedorId: 10, proveedor: 'Pesquera Atlántica', tipo: 'Orden', tipoFactura: null, estado: 'Pedida',
    fechaCreacion: '2025-01-07', fechaPedido: '2025-01-07', fechaRecepcion: null, fechaVencimiento: null,
    observaciones: 'Entrega refrigerada', cantidadProductos: 2,
    productos: [
      { id: 28, insumoId: 27, insumo: 'Salmón Rosado', unidadMedida: 'kg', stockActual: 0, estado: 'SinStock', unidades: 8, precioUnitario: 15000, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 120000 },
      { id: 29, insumoId: 28, insumo: 'Merluza', unidadMedida: 'kg', stockActual: 10, estado: 'Activo', unidades: 10, precioUnitario: 5500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 55000 }
    ],
    subtotal: 175000, total: 175000,
    netoGravado: null, montoIVA: null, percepcionIIBB: null, percepcionIVA: null,
    descuentoTipo: null, descuentoPorcentaje: null, descuentoMonto: null, condicionPago: null
  },
  {
    id: 8, numero: 'A-0002-00062858', puntoVenta: '002', numeroComprobante: '0004543528',
    proveedorId: 3, proveedor: 'Distribuidora Norte', tipo: 'Factura', tipoFactura: 'Factura A', estado: 'Facturada',
    fechaCreacion: '2025-01-02', fechaPedido: '2025-01-02', fechaRecepcion: '2025-01-04', fechaVencimiento: '2025-01-17',
    observaciones: '15 dias crédito', cantidadProductos: 4,
    productos: [
      { id: 30, insumoId: 19, insumo: 'Sal Fina', unidadMedida: 'kg', stockActual: 10, estado: 'Activo', unidades: 5, precioUnitario: 600, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 3000 },
      { id: 31, insumoId: 20, insumo: 'Pimienta Negra', unidadMedida: 'kg', stockActual: 2, estado: 'Activo', unidades: 2, precioUnitario: 8500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 17000 },
      { id: 32, insumoId: 23, insumo: 'Detergente 5L', unidadMedida: 'u', stockActual: 4, estado: 'Activo', unidades: 3, precioUnitario: 5500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 16500 },
      { id: 33, insumoId: 24, insumo: 'Lavandina 5L', unidadMedida: 'u', stockActual: 6, estado: 'Activo', unidades: 4, precioUnitario: 3200, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 12800 }
    ],
    subtotal: 49300, total: 54266.50,
    netoGravado: 47300, montoIVA: 4966.50, percepcionIIBB: 1200, percepcionIVA: 800,
    descuentoTipo: 'monto', descuentoPorcentaje: null, descuentoMonto: 2000, condicionPago: '15 días'
  },
  {
    id: 9, numero: '00062859', puntoVenta: '002', numeroComprobante: '0004543529',
    proveedorId: 8, proveedor: 'Pan del Día', tipo: 'Orden', tipoFactura: null, estado: 'Recibida',
    fechaCreacion: '2025-01-06', fechaPedido: '2025-01-06', fechaRecepcion: '2025-01-07', fechaVencimiento: null,
    observaciones: 'Entrega diaria', cantidadProductos: 2,
    productos: [
      { id: 34, insumoId: 14, insumo: 'Pan de Hamburguesa', unidadMedida: 'u', stockActual: 100, estado: 'Activo', unidades: 100, precioUnitario: 350, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 35000 },
      { id: 35, insumoId: 15, insumo: 'Tapas de Empanada', unidadMedida: 'docena', stockActual: 20, estado: 'Activo', unidades: 10, precioUnitario: 1500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 15000 }
    ],
    subtotal: 50000, total: 50000,
    netoGravado: null, montoIVA: null, percepcionIIBB: null, percepcionIVA: null,
    descuentoTipo: null, descuentoPorcentaje: null, descuentoMonto: null, condicionPago: null
  },
  {
    id: 10, numero: 'A-0002-00062860', puntoVenta: '002', numeroComprobante: '0004543530',
    proveedorId: 7, proveedor: 'Bebidas Express', tipo: 'Factura', tipoFactura: 'Factura A', estado: 'Pagada',
    fechaCreacion: '2024-12-15', fechaPedido: '2024-12-15', fechaRecepcion: '2024-12-17', fechaVencimiento: '2025-01-15',
    observaciones: '', cantidadProductos: 3,
    productos: [
      { id: 36, insumoId: 16, insumo: 'Coca-Cola 2.25L', unidadMedida: 'u', stockActual: 48, estado: 'Activo', unidades: 36, precioUnitario: 2500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 90000 },
      { id: 37, insumoId: 17, insumo: 'Agua Mineral 500ml', unidadMedida: 'pack x6', stockActual: 3, estado: 'StockBajo', unidades: 15, precioUnitario: 3600, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 54000 },
      { id: 38, insumoId: 18, insumo: 'Vino Malbec', unidadMedida: 'u', stockActual: 24, estado: 'Activo', unidades: 18, precioUnitario: 4500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 81000 }
    ],
    subtotal: 225000, total: 272250,
    netoGravado: 225000, montoIVA: 47250, percepcionIIBB: 0, percepcionIVA: 0,
    descuentoTipo: null, descuentoPorcentaje: null, descuentoMonto: null, condicionPago: 'Contado'
  },
  {
    id: 11, numero: '00062861', puntoVenta: '002', numeroComprobante: '0004543531',
    proveedorId: 9, proveedor: 'Limpieza Total', tipo: 'Orden', tipoFactura: null, estado: 'Pendiente',
    fechaCreacion: '2025-01-09', fechaPedido: null, fechaRecepcion: null, fechaVencimiento: null,
    observaciones: 'Pedido mensual limpieza', cantidadProductos: 2,
    productos: [
      { id: 39, insumoId: 23, insumo: 'Detergente 5L', unidadMedida: 'u', stockActual: 4, estado: 'Activo', unidades: 6, precioUnitario: 5500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 33000 },
      { id: 40, insumoId: 24, insumo: 'Lavandina 5L', unidadMedida: 'u', stockActual: 6, estado: 'Activo', unidades: 8, precioUnitario: 3200, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 25600 }
    ],
    subtotal: 58600, total: 58600,
    netoGravado: null, montoIVA: null, percepcionIIBB: null, percepcionIVA: null,
    descuentoTipo: null, descuentoPorcentaje: null, descuentoMonto: null, condicionPago: null
  },
  {
    id: 12, numero: '00062862', puntoVenta: '002', numeroComprobante: '0004543532',
    proveedorId: 14, proveedor: 'Harinas San Luis', tipo: 'Orden', tipoFactura: null, estado: 'Pendiente',
    fechaCreacion: '2025-01-09', fechaPedido: null, fechaRecepcion: null, fechaVencimiento: null,
    observaciones: '', cantidadProductos: 2,
    productos: [
      { id: 41, insumoId: 31, insumo: 'Harina 000', unidadMedida: 'kg', stockActual: 50, estado: 'Activo', unidades: 50, precioUnitario: 800, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 40000 },
      { id: 42, insumoId: 32, insumo: 'Arroz Largo Fino', unidadMedida: 'kg', stockActual: 25, estado: 'Activo', unidades: 20, precioUnitario: 1600, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 32000 }
    ],
    subtotal: 72000, total: 72000,
    netoGravado: null, montoIVA: null, percepcionIIBB: null, percepcionIVA: null,
    descuentoTipo: null, descuentoPorcentaje: null, descuentoMonto: null, condicionPago: null
  },
  {
    id: 13, numero: '00062863', puntoVenta: '002', numeroComprobante: '0004543533',
    proveedorId: 13, proveedor: 'Descartables YA', tipo: 'Orden', tipoFactura: null, estado: 'Recibida',
    fechaCreacion: '2025-01-04', fechaPedido: '2025-01-04', fechaRecepcion: '2025-01-06', fechaVencimiento: null,
    observaciones: '', cantidadProductos: 2,
    productos: [
      { id: 43, insumoId: 25, insumo: 'Servilletas x1000', unidadMedida: 'paq', stockActual: 8, estado: 'Activo', unidades: 10, precioUnitario: 4800, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 48000 },
      { id: 44, insumoId: 26, insumo: 'Film 38cm', unidadMedida: 'rollo', stockActual: 3, estado: 'Activo', unidades: 5, precioUnitario: 6200, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 31000 }
    ],
    subtotal: 79000, total: 79000,
    netoGravado: null, montoIVA: null, percepcionIIBB: null, percepcionIVA: null,
    descuentoTipo: null, descuentoPorcentaje: null, descuentoMonto: null, condicionPago: null
  },
  {
    id: 14, numero: '00062864', puntoVenta: '002', numeroComprobante: '0004543534',
    proveedorId: 15, proveedor: 'Congelados Express', tipo: 'Orden', tipoFactura: null, estado: 'Pedida',
    fechaCreacion: '2025-01-08', fechaPedido: '2025-01-08', fechaRecepcion: null, fechaVencimiento: null,
    observaciones: 'Mantener cadena de frío', cantidadProductos: 2,
    productos: [
      { id: 45, insumoId: 29, insumo: 'Papas Pre-fritas', unidadMedida: 'kg', stockActual: 30, estado: 'Activo', unidades: 25, precioUnitario: 3800, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 95000 },
      { id: 46, insumoId: 30, insumo: 'Helado Vainilla', unidadMedida: 'kg', stockActual: 0, estado: 'SinStock', unidades: 10, precioUnitario: 7500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 75000 }
    ],
    subtotal: 170000, total: 170000,
    netoGravado: null, montoIVA: null, percepcionIIBB: null, percepcionIVA: null,
    descuentoTipo: null, descuentoPorcentaje: null, descuentoMonto: null, condicionPago: null
  },
  {
    id: 15, numero: 'A-0002-00062865', puntoVenta: '002', numeroComprobante: '0004543535',
    proveedorId: 11, proveedor: 'Condimentos Sabor', tipo: 'Factura', tipoFactura: 'Factura A', estado: 'Pagada',
    fechaCreacion: '2024-12-10', fechaPedido: '2024-12-10', fechaRecepcion: '2024-12-12', fechaVencimiento: '2025-01-10',
    observaciones: '', cantidadProductos: 2,
    productos: [
      { id: 47, insumoId: 19, insumo: 'Sal Fina', unidadMedida: 'kg', stockActual: 10, estado: 'Activo', unidades: 10, precioUnitario: 600, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 6000 },
      { id: 48, insumoId: 20, insumo: 'Pimienta Negra', unidadMedida: 'kg', stockActual: 2, estado: 'Activo', unidades: 3, precioUnitario: 8500, tipo: 'insumo', conceptoId: null, concepto: null, rubroId: null, rubro: null, alicuotaIVA: 21, descuento: 0, impuestosInternos: 0, precioTotal: 25500 }
    ],
    subtotal: 31500, total: 36971.55,
    netoGravado: 30555, montoIVA: 6416.55, percepcionIIBB: 0, percepcionIVA: 0,
    descuentoTipo: 'porcentaje', descuentoPorcentaje: 3, descuentoMonto: null, condicionPago: '30 días'
  }
];

// ============================================================
// Proyeccion de Pagos
// ============================================================

export const MOCK_PROYECCION: ProyeccionPagos = {
  estaSemana: {
    monto: 107256,
    cantidadFacturas: 10,
    porcentaje: 18.9
  },
  proximos30Dias: {
    monto: 21921,
    cantidadFacturas: 2,
    porcentaje: 3.9
  },
  vencidas: {
    monto: 15378,
    cantidadFacturas: 7,
    porcentaje: 2.7
  }
};
