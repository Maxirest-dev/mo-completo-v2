# mo-completo-v2

Web unificada Maxirest — Variante UI v2 con componentes actualizados desde Pencil.

## Descripcion

Clon de mo-completo-v1 con toda la capa visual rediseñada manteniendo funcionalidad identica.

### Cambios UI v2 vs v1
- Paleta Slate (reemplaza Gray) — tonos frios azulados
- Orange brand #F27920 (antes #F97316)
- Badges con bordes coloreados y rounded 8px
- Cards con rounded 14px y sombras sutiles
- Filter pills rounded 10px (antes pill 9999px)
- Header dark con buscador blanco pill y selector perfil
- StatCards con metricas separadas por divisores
- Tipografia jerarquica mas definida

## Stack

- Angular 21+ standalone, OnPush, Signals
- Tailwind CSS + shared-ui design system v2
- AG-Grid + Chart.js
- Mock data (sin backend)
- Vercel deploy

## Desarrollo local

```bash
cd mo-frontend
npm install
npm start
# http://localhost:4700
```

## Base

Clonado de [mo-completo-v1](https://github.com/Maxirest-dev/mo-completo-v1) (commit 85688e1)

---

## 📝 Últimos cambios

### 2026-04-11

**Commits incluidos:**
- 65b7e53 feat: major UI overhaul across all sections

**Archivos modificados:**
  - `.png`: logo-icon.png
  - `.ts`: header.component.ts, app.routes.ts, carta.component.ts, actualizar-precios.component.ts, descuentos.component.ts, edicion-masiva.component.ts, detalle-dialog.component.ts, extras-dialog.component.ts, precios-dialog.component.ts, producto-perfil.component.ts, mock-categorias.data.ts, mock-producto-perfil.data.ts, producto-perfil.model.ts, conceptos-gasto-grid.component.ts, configuracion-page.component.ts, rubros-grid.component.ts, orden-page.component.ts, ordenes-grid.component.ts, ordenes-page.component.ts, proyeccion-pagos.component.ts, proveedor-modal.component.ts, proveedores-grid.component.ts, proveedores-page.component.ts, ai-summary-banner.component.ts, dashboard-panel.component.ts, demand-chart.component.ts, demand-forecast.component.ts, home.component.ts, kpi-card.component.ts, kpi-cards-row.component.ts, rentability-alerts.component.ts, stock-alert-item.component.ts, stock-alerts.component.ts, top-venta-item.component.ts, top-ventas.component.ts, insumo-perfil.component.ts, facturas.component.ts, negocio.component.ts, tramites.component.ts, config-modal.component.ts, configuracion-page.component.ts, configuracion-seccion.component.ts, auditoria-grid.component.ts, filtros-tab.component.ts, informe-page.component.ts, auditoria.models.ts, auditoria-mock.data.ts, auditoria.service.ts, auditoria.facade.ts, configuraciones.component.ts, plano-editor.component.ts, turno-kpis.component.ts, mock-pdv.data.ts, mock-plano.data.ts, pdv.model.ts, plano.model.ts, pdv.component.ts, estacion-dialog.component.ts, usuario-perfil.component.ts, usuarios.component.ts, dashboard.component.ts, ventas-header.component.ts, ventas.component.ts
  - `.scss`: styles.scss
