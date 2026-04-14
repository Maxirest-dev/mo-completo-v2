import { Injectable, signal, computed } from '@angular/core';

export interface TourStep {
  selector: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface SectionTour {
  sectionId: string;
  sectionName: string;
  description: string;
  steps: TourStep[];
}

export interface HelpLink {
  label: string;
  description: string;
  icon: string;
}

export interface SectionHelp {
  sectionId: string;
  sectionName: string;
  tour: SectionTour;
  links: HelpLink[];
}

// ============================================================
// Tour configurations per section
// ============================================================

const SECTION_HELP: Record<string, SectionHelp> = {
  home: {
    sectionId: 'home', sectionName: 'Inicio',
    tour: {
      sectionId: 'home', sectionName: 'Inicio',
      description: 'Conocé tu panel de control principal',
      steps: [
        { selector: '.page-title, .home-title, h1', title: 'Panel de inicio', content: 'Desde acá tenés una vista general de tu negocio: ventas del día, mesas activas y métricas clave.', position: 'bottom' },
        { selector: '.nav-item-active, .nav-items', title: 'Navegación principal', content: 'Usá la barra de navegación para moverte entre las secciones del sistema.', position: 'bottom' },
        { selector: '.ai-cta', title: 'Asistente IA', content: 'Maxi es tu asistente inteligente. Preguntale cualquier cosa sobre tu negocio.', position: 'bottom' },
      ],
    },
    links: [
      { label: 'Primeros pasos', description: 'Cómo arrancar con el sistema', icon: '🚀' },
      { label: 'Atajos de teclado', description: 'Accesos rápidos para ir más rápido', icon: '⌨️' },
    ],
  },
  pdv: {
    sectionId: 'pdv', sectionName: 'Punto de Venta',
    tour: {
      sectionId: 'pdv', sectionName: 'Punto de Venta',
      description: 'Configurá tu terminal de cobro y salones',
      steps: [
        { selector: '.page-title, h1', title: 'Punto de Venta', content: 'Acá gestionás tus salones, planos de mesas, configuraciones del POS y auditoría.', position: 'bottom' },
        { selector: '.btn-configuraciones, [routerLink*="configuraciones"]', title: 'Configuraciones', content: 'Definí tus dispositivos, estaciones de trabajo, formas de cobro y más.', position: 'bottom' },
        { selector: '.btn-auditoria, [routerLink*="auditoria"]', title: 'Auditoría', content: 'Controlá todas las acciones sensibles: anulaciones, descuentos, transferencias de mesa.', position: 'bottom' },
      ],
    },
    links: [
      { label: 'Configurar plano de salón', description: 'Diseñá la distribución de mesas', icon: '🗺️' },
      { label: 'Formas de cobro', description: 'Agregá tarjetas, QR y billeteras', icon: '💳' },
    ],
  },
  carta: {
    sectionId: 'carta', sectionName: 'Menú',
    tour: {
      sectionId: 'carta', sectionName: 'Menú',
      description: 'Gestioná tu carta de productos',
      steps: [
        { selector: '.page-title, h1', title: 'Tu carta de productos', content: 'Desde acá administrás todas las categorías y productos de tu menú.', position: 'bottom' },
        { selector: '.filter-toolbar, .toolbar-right', title: 'Filtros y búsqueda', content: 'Filtrá por estado (activos, inactivos, sin stock) y buscá productos por nombre.', position: 'bottom' },
        { selector: '.btn-nueva-categoria, .btn-outline-orange', title: 'Nueva categoría', content: 'Creá una nueva categoría para organizar tu menú. Cada una puede tener sus propios productos.', position: 'left' },
      ],
    },
    links: [
      { label: 'Crear mi primer producto', description: 'Paso a paso para cargar un plato', icon: '🍽️' },
      { label: 'Actualizar precios', description: 'Ajustá precios de forma masiva', icon: '💲' },
      { label: 'Gestionar descuentos', description: 'Configurá promos y descuentos', icon: '🏷️' },
    ],
  },
  compras: {
    sectionId: 'compras', sectionName: 'Compras',
    tour: {
      sectionId: 'compras', sectionName: 'Compras',
      description: 'Gestioná tus órdenes de compra a proveedores',
      steps: [
        { selector: '.page-title, h1', title: 'Órdenes de compra', content: 'Acá registrás las compras a proveedores. Cada orden impacta en tu stock y balances.', position: 'bottom' },
        { selector: '.btn-nueva-orden, .btn-primary', title: 'Nueva orden', content: 'Creá una orden de compra seleccionando proveedor, insumos y cantidades.', position: 'left' },
      ],
    },
    links: [
      { label: 'Cargar una factura de compra', description: 'Registrá facturas de proveedores', icon: '📄' },
      { label: 'Mover stock', description: 'Cómo impacta una compra en tu inventario', icon: '📦' },
    ],
  },
  inventario: {
    sectionId: 'inventario', sectionName: 'Inventario',
    tour: {
      sectionId: 'inventario', sectionName: 'Inventario',
      description: 'Controlá tus insumos y existencias',
      steps: [
        { selector: '.page-title, h1', title: 'Tu inventario', content: 'Acá ves todos tus insumos, su stock actual y podés hacer ajustes de inventario.', position: 'bottom' },
        { selector: '.filter-toolbar, .toolbar-right, .search', title: 'Buscar insumos', content: 'Filtrá por estado o buscá un insumo específico por nombre o código.', position: 'bottom' },
      ],
    },
    links: [
      { label: 'Ajuste de stock', description: 'Cómo corregir diferencias de inventario', icon: '📊' },
      { label: 'Entender mermas', description: 'Qué son y cómo reducirlas', icon: '📉' },
    ],
  },
  produccion: {
    sectionId: 'produccion', sectionName: 'Producción',
    tour: {
      sectionId: 'produccion', sectionName: 'Producción',
      description: 'Transformá insumos en platos finales',
      steps: [
        { selector: '.page-title, h1', title: 'Producción', content: 'Acá gestionás las recetas y transformaciones de insumos en productos finales.', position: 'bottom' },
      ],
    },
    links: [
      { label: 'Crear una receta', description: 'Cómo armar escandallos de producción', icon: '👨‍🍳' },
    ],
  },
  ventas: {
    sectionId: 'ventas', sectionName: 'Ventas',
    tour: {
      sectionId: 'ventas', sectionName: 'Ventas',
      description: 'Analizá el rendimiento de tus ventas',
      steps: [
        { selector: '.page-title, h1', title: 'Dashboard de Ventas', content: 'Acá ves el resumen de ventas por período, formas de cobro y artículos más vendidos.', position: 'bottom' },
        { selector: '.tab-nav, app-tab-nav', title: 'Pestañas de análisis', content: 'Navegá entre Dashboard, Formas de cobro, Conceptos, Comprobantes y Artículos.', position: 'bottom' },
        { selector: '.page-header .date-range, .ventas-header', title: 'Filtros de período', content: 'Ajustá las fechas y el turno para ver datos de un rango específico.', position: 'bottom' },
      ],
    },
    links: [
      { label: 'Leer mis ventas', description: 'Cómo interpretar los gráficos', icon: '📈' },
      { label: 'Formas de cobro', description: 'Desglose por medio de pago', icon: '💳' },
    ],
  },
  balances: {
    sectionId: 'balances', sectionName: 'Balances',
    tour: {
      sectionId: 'balances', sectionName: 'Balances',
      description: 'Entendé la salud financiera de tu negocio',
      steps: [
        { selector: '.page-title, h1', title: 'Balances', content: 'Acá controlás la rentabilidad, costos operativos, flujo financiero e impuestos de tu negocio.', position: 'bottom' },
        { selector: '.tab-nav, app-balances-tab-nav', title: 'Cuatro perspectivas', content: 'Operativos (cocina), Económicos (P&L), Financieros (caja) y Fiscales (AFIP).', position: 'bottom' },
        { selector: '.kpi-row', title: 'Indicadores clave', content: 'El Food Cost es tu indicador de vida. Si está en rojo, estás perdiendo dinero en la cocina.', position: 'bottom' },
      ],
    },
    links: [
      { label: 'Entender el Food Cost', description: 'Qué es y cómo controlarlo', icon: '🥩' },
      { label: 'Punto de equilibrio', description: 'Cuánto necesitás facturar para cubrir costos', icon: '⚖️' },
      { label: 'IVA y obligaciones fiscales', description: 'Sub-diarios y posición IVA', icon: '🏛️' },
    ],
  },
  tesoreria: {
    sectionId: 'tesoreria', sectionName: 'Tesorería',
    tour: {
      sectionId: 'tesoreria', sectionName: 'Tesorería',
      description: 'Controlá tu dinero real y flujo de caja',
      steps: [
        { selector: '.page-title, h1', title: 'Tesorería', content: 'Desde acá controlás toda la liquidez: cuentas, movimientos, conciliación y pagos.', position: 'bottom' },
        { selector: '.tab-nav, app-tesoreria-tab-nav', title: 'Cinco módulos', content: 'Disponibilidades, Movimientos, Conciliación de pagos, Agenda de pagos y Proyección de Cash Flow.', position: 'bottom' },
        { selector: '.kpi-row', title: 'Tu dinero en un vistazo', content: 'Caja Salón + Caja Admin + Bancos + Billeteras = Saldo Total. Todo en tiempo real.', position: 'bottom' },
      ],
    },
    links: [
      { label: 'Conciliar pagos de tarjeta', description: 'Cómo verificar que el dinero llegó al banco', icon: '🏦' },
      { label: 'Registrar un movimiento', description: 'Carga de ingresos/egresos manuales', icon: '📝' },
      { label: 'Proyectar el cash flow', description: 'Anticipá si vas a tener liquidez', icon: '🔮' },
    ],
  },
  personal: {
    sectionId: 'personal', sectionName: 'Personal',
    tour: {
      sectionId: 'personal', sectionName: 'Personal',
      description: 'Gestioná tu equipo de trabajo',
      steps: [
        { selector: '.page-title, h1', title: 'Gestión de Personal', content: 'Acá administrás tu equipo: legajos, fichaje, tareas, liquidación y más.', position: 'bottom' },
        { selector: '.tab-nav, app-personal-tab-nav', title: 'Todo sobre tu equipo', content: 'Staff (directorio), Fichaje (presencia), Tareas, Liquidación y extras como propinas y uniformes.', position: 'bottom' },
        { selector: '.master-table, .staff-table', title: 'Tu directorio', content: 'Hacé click en cualquier empleado para ver su perfil completo, documentación e historial.', position: 'top' },
      ],
    },
    links: [
      { label: 'Registrar un empleado', description: 'Cómo dar de alta personal nuevo', icon: '👤' },
      { label: 'Control de fichaje', description: 'Cómo funciona el clock-in/out', icon: '⏰' },
      { label: 'Pre-liquidación', description: 'Calcular sueldos antes de pagar', icon: '💰' },
    ],
  },
};

// ============================================================
// Spotlight search actions
// ============================================================

export interface SpotlightAction {
  label: string;
  description: string;
  route: string;
  icon: string;
  section: string;
}

const SPOTLIGHT_ACTIONS: SpotlightAction[] = [
  { label: 'Nuevo producto', description: 'Crear un producto en el menú', route: '/carta', icon: '🍽️', section: 'Menú' },
  { label: 'Nueva categoría', description: 'Crear categoría de menú', route: '/carta', icon: '📁', section: 'Menú' },
  { label: 'Actualizar precios', description: 'Ajustar precios masivamente', route: '/carta/actualizar-precios', icon: '💲', section: 'Menú' },
  { label: 'Nueva orden de compra', description: 'Comprar a proveedor', route: '/compras/ordenes/nueva', icon: '📦', section: 'Compras' },
  { label: 'Nuevo empleado', description: 'Dar de alta personal', route: '/personal/empleado/nuevo', icon: '👤', section: 'Personal' },
  { label: 'Ver balances', description: 'Rentabilidad y costos', route: '/balances', icon: '📊', section: 'Balances' },
  { label: 'Flujo de caja', description: 'Proyección de liquidez', route: '/tesoreria', icon: '💰', section: 'Tesorería' },
  { label: 'Auditoría POS', description: 'Control de acciones sensibles', route: '/pdv/auditoria', icon: '🔍', section: 'PdV' },
  { label: 'Fichaje de personal', description: 'Clock-in/out de empleados', route: '/personal', icon: '⏰', section: 'Personal' },
  { label: 'Mis productos', description: 'Integraciones y marketplace', route: '/mi-cuenta/productos', icon: '🛒', section: 'Mi Cuenta' },
  { label: 'Configurar POS', description: 'Dispositivos y estaciones', route: '/pdv/configuraciones', icon: '⚙️', section: 'PdV' },
  { label: 'Ver ventas', description: 'Dashboard de ventas', route: '/ventas', icon: '📈', section: 'Ventas' },
  { label: 'Descuentos', description: 'Gestionar descuentos', route: '/carta/descuentos', icon: '🏷️', section: 'Menú' },
  { label: 'Agenda de pagos', description: 'Facturas pendientes', route: '/tesoreria', icon: '📅', section: 'Tesorería' },
  { label: 'Conciliar pagos', description: 'Verificar acreditaciones', route: '/tesoreria', icon: '🏦', section: 'Tesorería' },
];

@Injectable({ providedIn: 'root' })
export class TourService {
  // Tour state
  private readonly _tourActive = signal(false);
  private readonly _currentSteps = signal<TourStep[]>([]);
  private readonly _currentStepIndex = signal(0);
  private readonly _tourSectionName = signal('');

  readonly tourActive = this._tourActive.asReadonly();
  readonly currentSteps = this._currentSteps.asReadonly();
  readonly currentStepIndex = this._currentStepIndex.asReadonly();
  readonly tourSectionName = this._tourSectionName.asReadonly();

  readonly currentStep = computed(() => {
    const steps = this._currentSteps();
    const idx = this._currentStepIndex();
    return steps[idx] ?? null;
  });

  readonly totalSteps = computed(() => this._currentSteps().length);

  // Help state
  private readonly _completedTours = signal<Set<string>>(new Set());

  // ============== SECTION HELP ==============

  getSectionHelp(sectionId: string): SectionHelp | null {
    return SECTION_HELP[sectionId] ?? null;
  }

  detectSection(url: string): string {
    const path = url.split('?')[0].replace(/^\//, '');
    const segment = path.split('/')[0];

    const mapping: Record<string, string> = {
      'home': 'home', '': 'home',
      'pdv': 'pdv',
      'carta': 'carta',
      'compras': 'compras',
      'inventario': 'inventario',
      'produccion': 'produccion',
      'ventas': 'ventas',
      'balances': 'balances',
      'tesoreria': 'tesoreria',
      'personal': 'personal',
    };

    return mapping[segment] ?? 'home';
  }

  // ============== TOUR ACTIONS ==============

  startTour(sectionId: string): void {
    const help = SECTION_HELP[sectionId];
    if (!help || help.tour.steps.length === 0) return;

    this._currentSteps.set(help.tour.steps);
    this._currentStepIndex.set(0);
    this._tourSectionName.set(help.sectionName);
    this._tourActive.set(true);
  }

  nextStep(): void {
    const idx = this._currentStepIndex();
    if (idx < this._currentSteps().length - 1) {
      this._currentStepIndex.set(idx + 1);
    } else {
      this.endTour();
    }
  }

  prevStep(): void {
    const idx = this._currentStepIndex();
    if (idx > 0) {
      this._currentStepIndex.set(idx - 1);
    }
  }

  endTour(): void {
    const section = this.detectSection(window.location.pathname);
    this._completedTours.update(set => { const n = new Set(set); n.add(section); return n; });
    this._tourActive.set(false);
    this._currentSteps.set([]);
    this._currentStepIndex.set(0);
  }

  isTourCompleted(sectionId: string): boolean {
    return this._completedTours().has(sectionId);
  }

  // ============== SPOTLIGHT ==============

  searchActions(query: string): SpotlightAction[] {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return SPOTLIGHT_ACTIONS.filter(a =>
      a.label.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.section.toLowerCase().includes(q)
    ).slice(0, 6);
  }
}
