# Maxirest - Sistema de Gestion para Restaurantes

## Arquitectura del Prototipo Funcional v1

### Vision general
Web unificada que integra 7 módulos del sistema de gestión Maxirest, cada uno como feature independiente con lazy loading, compartiendo un header de navegación centralizado y una librería de componentes compartida (shared-ui).

---

## Módulos

### Home (`/home`)
Dashboard operativo del turno actual con KPIs en tiempo real, resumen IA, forecast de demanda, alertas de stock y rentabilidad.

### Punto de Venta (`/pdv`)
Gestión de turnos, estado de caja, calendario de cierres, configuraciones del POS (estaciones, formas de cobro, canales, puntos de venta, turnos) y alta en ARCA (facturación electrónica, wizard 3 pasos).

| Sub-ruta | Descripción |
|----------|-------------|
| `/pdv` | Turno actual y fines de turno |
| `/pdv/configuraciones` | Configuraciones del POS |
| `/pdv/alta-arca` | Wizard de facturación electrónica |

### Menu (`/carta`)
Configuración de productos del menú, categorías con tabla master-detail, perfil de plato con imagen/CTAs/ingredientes/elaboración, descuentos, actualización de precios y edición masiva (calendario + estaciones).

| Sub-ruta | Descripción |
|----------|-------------|
| `/carta` | Configuración de productos |
| `/carta/producto/:id` | Perfil de plato |
| `/carta/descuentos` | Gestión de descuentos |
| `/carta/actualizar-precios` | Actualización masiva de precios |
| `/carta/edicion-masiva` | Edición masiva calendario/estaciones |

### Compras (`/compras`)
Gestión de órdenes de compra, proveedores y configuración. *Actualmente en modo placeholder.*

### Inventario (`/inventario`)
Gestión de depósitos e insumos con tabla master-detail, perfil de insumo con CTAs inline, transformaciones, ingredientes y elaboración paso a paso.

| Sub-ruta | Descripción |
|----------|-------------|
| `/inventario` | Depósitos e insumos |
| `/inventario/insumo/:id` | Perfil de insumo |

### Produccion (`/produccion`)
Control de producción por estaciones de trabajo. Permite "cocinar" transformaciones e insumos elaborados, actualizando stock de producción e inventario.

### Ventas (`/ventas`)
Dashboard de estadísticas con tabs: Dashboard (5 gráficos), Artículos, Formas de cobro, Comprobantes (con tabla de emisiones), Conceptos. Filtros de fecha y turno funcionales.

### Mi Cuenta (accesible desde dropdown usuario)
| Sub-ruta | Descripción |
|----------|-------------|
| `/mi-cuenta` | Dashboard con 5 cards de acceso |
| `/mi-cuenta/facturas` | Facturas, saldo, pago (2 dialogs) |
| `/mi-cuenta/productos` | POINT, integraciones, delivery |
| `/mi-cuenta/tramites` | Tabla trámites, detalle, chat bot |
| `/mi-cuenta/negocio` | Perfil del negocio con edición |

### Usuarios (`/usuarios`)
| Sub-ruta | Descripción |
|----------|-------------|
| `/usuarios` | Tabla de usuarios con filtros |
| `/usuarios/:id` | Perfil completo del usuario |

---

## Stack tecnológico

| Tecnología | Uso |
|-----------|-----|
| Angular 21.1 | Framework (standalone components) |
| Signals | State management (signal, computed, input, output) |
| OnPush | Change detection en todos los componentes |
| Chart.js + ng2-charts | Gráficos (ventas, pdv) |
| AG-Charts | Gráficos (home, compras) |
| AG-Grid | Tablas avanzadas (inventario cell renderers) |
| Tailwind CSS 4.1 | Utility-first CSS |
| shared-ui | Componentes compartidos (header, layout, toast) |
| TypeScript 5.9 | Tipado estricto |
| Vercel | Hosting y deploy |

---

## Estructura del proyecto

```
mo-frontend/
├── shared-ui/                    # Librería compartida
│   ├── components/
│   │   ├── header/               # Header con navegación centrada + dropdown usuario
│   │   ├── layout/               # Layout wrapper (header + content)
│   │   ├── toast-container/      # Notificaciones toast
│   │   ├── trend-indicator/      # Indicador de tendencia
│   │   ├── progress-bar/         # Barra de progreso
│   │   └── loading-spinner/      # Spinner de carga
│   ├── services/
│   │   └── notification.service  # Servicio de notificaciones
│   ├── interceptors/
│   │   └── error.interceptor     # Interceptor de errores HTTP
│   ├── pipes/
│   │   └── currency-ars.pipe     # Formateo ARS
│   └── styles/                   # Variables SCSS, buttons, forms, badges
│
├── src/app/
│   ├── app.routes.ts             # Rutas con lazy loading
│   ├── features/
│   │   ├── home/                 # 13 componentes, 10 servicios, 9 archivos mock
│   │   ├── pdv/                  # KPIs, estadísticas, caja, calendario, config, ARCA
│   │   ├── carta/                # Grid categorías, perfil producto, descuentos, precios
│   │   ├── compras/              # Placeholder (en desarrollo)
│   │   ├── inventario/           # Grid depósitos, perfil insumo, transformaciones
│   │   ├── produccion/           # Grid estaciones, cocinar dialog
│   │   ├── ventas/               # Dashboard, tabs, gráficos Chart.js
│   │   ├── mi-cuenta/            # Facturas, productos, trámites, negocio
│   │   └── usuarios/             # Tabla usuarios, perfil usuario
│   ├── core/                     # Servicios core (auth, tenant, websocket)
│   └── shared/                   # Pipes compartidos
```

---

## Patrones de diseño UI

### Tablas
- Card blanca con `border: 1px solid #E5E7EB`, `border-radius: 12px`
- Header: `background: #F3F4F6`, texto uppercase 11px `#6B7280`
- Filas: hover `#FAFAFA`, border-bottom `#F3F4F6`
- Acciones alineadas a la derecha

### Filtros
- Pill tabs: `border-radius: 9999px`, activo naranja `#F97316` con `background: #FFF7ED`
- Search box: border con focus naranja + `box-shadow`

### Botones
- Primario oscuro: `#1F2937` → hover `#374151`
- Primario naranja: `#F97316` → hover `#EA580C`
- Outline naranja: `color: #FF8800`, `border: 1px solid #FF8800`, `bg: white`
- Secundario: `bg: white`, `border: #E5E7EB`
- Desactivar: `color: #DC2626`, `border: #FECACA`

### Badges de estado
- Activo/Disponible: `bg: #D1FAE5`, `color: #065F46`
- Inactivo: `bg: #F3F4F6`, `color: #6B7280`
- Bajo/Warning: `bg: #FEF3C7`, `color: #92400E`
- Crítico/Vencido: `bg: #FEE2E2`, `color: #991B1B`
- En curso: `bg: #DBEAFE`, `color: #1E40AF`

### Iconos por tipo
Emoji en cuadrado redondeado con fondo de color (usado en inventario, producción, pdv configuraciones).

### Dialogs
- Backdrop: `rgba(0,0,0,0.4)`, centrado flex
- Container: `border-radius: 16px`, `max-width: 520px`, `box-shadow`
- Click fuera cierra

---

## Header de navegación

```
[Logo m] [🏠] ──── [🔍 Buscar...] ──── [🔔] [❓] [Usuario ▾]
         [Punto de venta] [Menu] [Compras] [Inventario] [Produccion] [Ventas]
```

- Nav items centrados con spacers flex
- Buscador centrado con spacers flex
- Dropdown de usuario: Mi cuenta, Usuarios, Config negocio, Cerrar sesión

---

## Deploy

Todos los proyectos deployados en Vercel bajo la cuenta `valentinopecile-4226s-projects`.

| URL | Proyecto |
|-----|----------|
| mo-frontend-jade.vercel.app | Web unificada (principal) |
| menu-frontend-amber.vercel.app | Menu individual |
| inventario-frontend-ebon.vercel.app | Inventario individual |
| produccion-frontend.vercel.app | Produccion individual |
| ventas-frontend-psi.vercel.app | Ventas individual |
| pdv-frontend-jet.vercel.app | Punto de Venta individual |
