import {
  Empleado, EmpleadoEnTurno, FichajeRegistro,
  Tarea, Checklist,
  KpiLiquidacion, PreLiquidacionRow, Adelanto,
  PropinaRegistro, UniformeEntrega, Incidencia,
} from '../models';

// ==============================
// STAFF / DIRECTORIO
// ==============================

export const MOCK_EMPLEADOS: Empleado[] = [
  { id: 'e-001', nombre: 'María López', avatar: '', rol: 'Mozo', estado: 'Trabajando', dni: '35.678.901', cuil: '27-35678901-4', telefono: '11-4567-8901', email: 'maria.lopez@mail.com', contactoEmergencia: '11-9876-5432', fechaIngreso: '2024-03-15', sueldoBase: 380000, valorHoraExtra: 3200, diasFranco: ['Domingo', 'Lunes'] },
  { id: 'e-002', nombre: 'Carlos Ruiz', avatar: '', rol: 'Cocinero', estado: 'Trabajando', dni: '31.234.567', cuil: '20-31234567-8', telefono: '11-2345-6789', email: 'carlos.ruiz@mail.com', contactoEmergencia: '11-8765-4321', fechaIngreso: '2023-08-01', sueldoBase: 420000, valorHoraExtra: 3500, diasFranco: ['Lunes', 'Martes'] },
  { id: 'e-003', nombre: 'Ana Torres', avatar: '', rol: 'Bachero', estado: 'Franco', dni: '38.901.234', cuil: '27-38901234-6', telefono: '11-3456-7890', email: 'ana.torres@mail.com', contactoEmergencia: '11-7654-3210', fechaIngreso: '2025-01-10', sueldoBase: 310000, valorHoraExtra: 2600, diasFranco: ['Miércoles', 'Jueves'] },
  { id: 'e-004', nombre: 'Diego Martín', avatar: '', rol: 'Bartender', estado: 'Trabajando', dni: '33.456.789', cuil: '20-33456789-2', telefono: '11-4567-1234', email: 'diego.martin@mail.com', contactoEmergencia: '11-6543-2109', fechaIngreso: '2024-06-20', sueldoBase: 390000, valorHoraExtra: 3300, diasFranco: ['Domingo', 'Lunes'] },
  { id: 'e-005', nombre: 'Laura Sánchez', avatar: '', rol: 'Manager', estado: 'Trabajando', dni: '29.876.543', cuil: '27-29876543-0', telefono: '11-5678-2345', email: 'laura.sanchez@mail.com', contactoEmergencia: '11-5432-1098', fechaIngreso: '2022-11-05', sueldoBase: 520000, valorHoraExtra: 4300, diasFranco: ['Domingo'] },
  { id: 'e-006', nombre: 'Pablo Herrera', avatar: '', rol: 'Cocinero', estado: 'Franco', dni: '36.543.210', cuil: '20-36543210-4', telefono: '11-6789-3456', email: 'pablo.herrera@mail.com', contactoEmergencia: '11-4321-0987', fechaIngreso: '2024-09-12', sueldoBase: 400000, valorHoraExtra: 3400, diasFranco: ['Martes', 'Miércoles'] },
  { id: 'e-007', nombre: 'Valentina Díaz', avatar: '', rol: 'Mozo', estado: 'Vacaciones', dni: '37.210.987', cuil: '27-37210987-8', telefono: '11-7890-4567', email: 'valentina.diaz@mail.com', contactoEmergencia: '11-3210-9876', fechaIngreso: '2024-01-08', sueldoBase: 370000, valorHoraExtra: 3100, diasFranco: ['Domingo', 'Lunes'] },
  { id: 'e-008', nombre: 'Facundo Gómez', avatar: '', rol: 'Bachero', estado: 'Trabajando', dni: '39.654.321', cuil: '20-39654321-6', telefono: '11-8901-5678', email: 'facundo.gomez@mail.com', contactoEmergencia: '11-2109-8765', fechaIngreso: '2025-02-20', sueldoBase: 310000, valorHoraExtra: 2600, diasFranco: ['Jueves', 'Viernes'] },
];

// ==============================
// FICHAJE
// ==============================

export const MOCK_EN_TURNO: EmpleadoEnTurno[] = [
  { id: 'et-001', empleado: 'María López', puesto: 'Mozo', horaEntrada: '12:00', estado: 'En turno', horasAcumuladas: '4:35' },
  { id: 'et-002', empleado: 'Carlos Ruiz', puesto: 'Cocinero', horaEntrada: '09:00', estado: 'En turno', horasAcumuladas: '7:35' },
  { id: 'et-003', empleado: 'Diego Martín', puesto: 'Bartender', horaEntrada: '17:00', estado: 'Por ingresar', horasAcumuladas: '—' },
  { id: 'et-004', empleado: 'Laura Sánchez', puesto: 'Manager', horaEntrada: '09:00', estado: 'En descanso', horasAcumuladas: '6:15' },
  { id: 'et-005', empleado: 'Facundo Gómez', puesto: 'Bachero', horaEntrada: '08:00', estado: 'En turno', horasAcumuladas: '8:35' },
];

export const MOCK_HISTORIAL_FICHAJES: FichajeRegistro[] = [
  { id: 'f-001', fecha: '11/04/2026', empleado: 'María López', rol: 'Mozo', entrada: '12:00', salida: '', horasTrabajadas: 4.5, horasExtra: 0 },
  { id: 'f-002', fecha: '11/04/2026', empleado: 'Carlos Ruiz', rol: 'Cocinero', entrada: '09:00', salida: '', horasTrabajadas: 7.5, horasExtra: 0 },
  { id: 'f-003', fecha: '10/04/2026', empleado: 'María López', rol: 'Mozo', entrada: '11:00', salida: '20:30', horasTrabajadas: 8.5, horasExtra: 0.5 },
  { id: 'f-004', fecha: '10/04/2026', empleado: 'Carlos Ruiz', rol: 'Cocinero', entrada: '08:00', salida: '17:00', horasTrabajadas: 8, horasExtra: 0 },
  { id: 'f-005', fecha: '09/04/2026', empleado: 'Ana Torres', rol: 'Bachero', entrada: '10:00', salida: '18:30', horasTrabajadas: 7.5, horasExtra: 0 },
  { id: 'f-006', fecha: '09/04/2026', empleado: 'Facundo Gómez', rol: 'Bachero', entrada: '08:00', salida: '16:30', horasTrabajadas: 7.5, horasExtra: 0 },
];

// ==============================
// TAREAS
// ==============================

export const MOCK_TAREAS: Tarea[] = [
  { id: 't-001', titulo: 'Limpiar campana extractora', asignadoA: 'Facundo Gómez', rol: 'Bachero', estado: 'Pendiente', prioridad: 'Alta', fechaLimite: '11/04/2026' },
  { id: 't-002', titulo: 'Reponer stock barra', asignadoA: 'Diego Martín', rol: 'Bartender', estado: 'En proceso', prioridad: 'Media', fechaLimite: '11/04/2026' },
  { id: 't-003', titulo: 'Inventario cámara fría', asignadoA: 'Carlos Ruiz', rol: 'Cocinero', estado: 'Revisión', prioridad: 'Alta', fechaLimite: '12/04/2026' },
  { id: 't-004', titulo: 'Capacitación manipulación alimentos', asignadoA: 'Ana Torres', rol: 'Bachero', estado: 'Pendiente', prioridad: 'Media', fechaLimite: '15/04/2026' },
  { id: 't-005', titulo: 'Actualizar carta de vinos', asignadoA: 'Laura Sánchez', rol: 'Manager', estado: 'Finalizado', prioridad: 'Baja', fechaLimite: '10/04/2026' },
  { id: 't-006', titulo: 'Limpiar filtros de aire acondicionado', asignadoA: 'Facundo Gómez', rol: 'Bachero', estado: 'Pendiente', prioridad: 'Baja', fechaLimite: '18/04/2026' },
];

export const MOCK_CHECKLISTS: Checklist[] = [
  {
    tipo: 'apertura', titulo: 'Checklist de Apertura',
    items: [
      { id: 'ca-01', descripcion: 'Encender luces y aire acondicionado', completado: true, obligatorio: true },
      { id: 'ca-02', descripcion: 'Verificar gas y hornallas', completado: true, obligatorio: true },
      { id: 'ca-03', descripcion: 'Revisar temperaturas cámaras frigoríficas', completado: false, obligatorio: true },
      { id: 'ca-04', descripcion: 'Preparar mise en place', completado: false, obligatorio: false },
      { id: 'ca-05', descripcion: 'Contar fondo de caja', completado: true, obligatorio: true },
    ],
  },
  {
    tipo: 'cierre', titulo: 'Checklist de Cierre',
    items: [
      { id: 'cc-01', descripcion: 'Gas apagado y llaves cerradas', completado: false, obligatorio: true },
      { id: 'cc-02', descripcion: 'Cámaras frigoríficas cerradas', completado: false, obligatorio: true },
      { id: 'cc-03', descripcion: 'Cierre de caja completado', completado: false, obligatorio: true },
      { id: 'cc-04', descripcion: 'Luces y equipos apagados', completado: false, obligatorio: true },
      { id: 'cc-05', descripcion: 'Alarma activada', completado: false, obligatorio: true },
    ],
  },
];

// ==============================
// LIQUIDACION
// ==============================

export const MOCK_KPI_LIQUIDACION: KpiLiquidacion[] = [
  { label: 'Nómina del mes', value: 3110000, subtitle: '8 empleados activos', color: '#1155CC' },
  { label: 'Adelantos entregados', value: 185000, subtitle: '4 adelantos este mes', color: '#F97316' },
  { label: 'Horas extra acumuladas', value: 42, subtitle: '6 empleados con HS extra', color: '#8B5CF6' },
];

export const MOCK_PRE_LIQUIDACION: PreLiquidacionRow[] = [
  { id: 'pl-001', empleado: 'María López', rol: 'Mozo', horasNormales: 176, horasExtra: 8, adelantos: 30000, bruto: 405600, neto: 375600 },
  { id: 'pl-002', empleado: 'Carlos Ruiz', rol: 'Cocinero', horasNormales: 176, horasExtra: 12, adelantos: 50000, bruto: 462000, neto: 412000 },
  { id: 'pl-003', empleado: 'Ana Torres', rol: 'Bachero', horasNormales: 160, horasExtra: 0, adelantos: 0, bruto: 310000, neto: 310000 },
  { id: 'pl-004', empleado: 'Diego Martín', rol: 'Bartender', horasNormales: 176, horasExtra: 6, adelantos: 25000, bruto: 409800, neto: 384800 },
  { id: 'pl-005', empleado: 'Laura Sánchez', rol: 'Manager', horasNormales: 184, horasExtra: 10, adelantos: 80000, bruto: 563000, neto: 483000 },
  { id: 'pl-006', empleado: 'Pablo Herrera', rol: 'Cocinero', horasNormales: 168, horasExtra: 4, adelantos: 0, bruto: 413600, neto: 413600 },
  { id: 'pl-007', empleado: 'Valentina Díaz', rol: 'Mozo', horasNormales: 0, horasExtra: 0, adelantos: 0, bruto: 0, neto: 0 },
  { id: 'pl-008', empleado: 'Facundo Gómez', rol: 'Bachero', horasNormales: 184, horasExtra: 2, adelantos: 0, bruto: 315200, neto: 315200 },
];

export const MOCK_ADELANTOS: Adelanto[] = [
  { id: 'a-001', fecha: '05/04/2026', empleado: 'María López', monto: 30000, motivo: 'Adelanto quincenal', estado: 'Entregado' },
  { id: 'a-002', fecha: '03/04/2026', empleado: 'Carlos Ruiz', monto: 50000, motivo: 'Emergencia personal', estado: 'Entregado' },
  { id: 'a-003', fecha: '01/04/2026', empleado: 'Diego Martín', monto: 25000, motivo: 'Adelanto quincenal', estado: 'Descontado' },
  { id: 'a-004', fecha: '08/04/2026', empleado: 'Laura Sánchez', monto: 80000, motivo: 'Adelanto mensual', estado: 'Entregado' },
];

// ==============================
// MAS (Valor Agregado)
// ==============================

export const MOCK_PROPINAS: PropinaRegistro[] = [
  { id: 'p-001', fecha: '11/04/2026', origen: 'Efectivo', monto: 45000, repartido: false },
  { id: 'p-002', fecha: '11/04/2026', origen: 'Tarjeta', monto: 28500, repartido: false },
  { id: 'p-003', fecha: '10/04/2026', origen: 'Efectivo', monto: 52000, repartido: true },
  { id: 'p-004', fecha: '10/04/2026', origen: 'App', monto: 12800, repartido: true },
  { id: 'p-005', fecha: '09/04/2026', origen: 'Efectivo', monto: 38000, repartido: true },
];

export const MOCK_UNIFORMES: UniformeEntrega[] = [
  { id: 'u-001', empleado: 'María López', prenda: 'Camisa negra', talle: 'M', fechaEntrega: '15/03/2026', fechaDevolucion: '', estado: 'Entregado' },
  { id: 'u-002', empleado: 'Carlos Ruiz', prenda: 'Chaqueta cocina', talle: 'L', fechaEntrega: '01/08/2023', fechaDevolucion: '', estado: 'Entregado' },
  { id: 'u-003', empleado: 'Ana Torres', prenda: 'Delantal', talle: 'M', fechaEntrega: '10/01/2025', fechaDevolucion: '', estado: 'Entregado' },
  { id: 'u-004', empleado: 'Valentina Díaz', prenda: 'Camisa negra', talle: 'S', fechaEntrega: '08/01/2024', fechaDevolucion: '20/03/2026', estado: 'Devuelto' },
];

export const MOCK_INCIDENCIAS: Incidencia[] = [
  { id: 'i-001', fecha: '10/04/2026', empleado: 'Facundo Gómez', tipo: 'Llegada tarde', descripcion: 'Llegó 25 min tarde al turno de mañana' },
  { id: 'i-002', fecha: '08/04/2026', empleado: 'María López', tipo: 'Premio', descripcion: 'Mejor valorada por clientes en encuesta semanal' },
  { id: 'i-003', fecha: '05/04/2026', empleado: 'Pablo Herrera', tipo: 'Observación', descripcion: 'No completó checklist de cierre correctamente' },
];
