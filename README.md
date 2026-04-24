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

### 2026-04-24

**Commits incluidos:**
- 3c210cd feat(marketplaces): rework Pedidos Ya wizard + promote Mis Productos to header as Tienda
- 41568ba feat(ai-panel): add Maxi vendor response for margin question

**Archivos modificados:**
  - `.ts`: header.component.ts, app.routes.ts, paso-identificacion-tienda.component.ts, paso1-contratacion.component.ts, paso2-configuracion.component.ts, paso3-confirmacion.component.ts, wizard-container.component.ts, wizard-exito.component.ts, wizard-stepper.component.ts, marketplaces-mock.data.ts, marketplaces.service.ts, marketplaces.models.ts, marketplaces.facade.ts, mi-cuenta.component.ts, productos.component.ts
