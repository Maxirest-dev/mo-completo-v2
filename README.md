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

### 2026-04-14

**Commits incluidos:**
- d7fcd2b feat: add employee profile page + staff table redesign + remove modal
- aad9d72 fix: polish Personal — signal migration, fichaje functional, ARIA, DRY
- a6160b5 feat: add Personal module with 5 tabs (Staff, Fichaje, Tareas, Liquidación, Más)
- cbc3967 fix: polish Tesorería UI — dynamic filter-bar per tab, Cash Flow KPI cards with operators
- ffdffe0 fix: polish Tesorería — bug fix, filter-bar extract, ARIA, DRY, handlers
- fac7c54 feat: add Tesorería module with 5 tabs (Disponibilidades, Movimientos, Conciliación, Agenda, Cash Flow)
- e76bece fix: polish Balances UI — unified filter bar, compact alerts, table styles, KPI alignment
- 0aefb0e feat: add Balances module with 4 tabs (Operativos, Económicos, Financieros, Fiscales)

**Archivos modificados:**
  - `.ts`: app.routes.ts, empleado-dialog.component.ts, empleado-perfil.component.ts, staff.component.ts, mock-personal.data.ts, personal.model.ts, personal.component.ts
