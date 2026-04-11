import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@mro/shared-ui').then((m) => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      // Home
      {
        path: 'home',
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },

      // Punto de Venta
      {
        path: 'pdv',
        loadComponent: () =>
          import('./features/pdv/pdv.component').then((m) => m.PdvComponent),
      },
      {
        path: 'pdv/configuraciones',
        loadComponent: () =>
          import('./features/pdv/components/configuraciones/configuraciones.component').then(
            (m) => m.ConfiguracionesComponent
          ),
      },
      {
        path: 'pdv/configuraciones/plano/:id',
        loadComponent: () =>
          import('./features/pdv/components/plano-editor/plano-editor.component').then(
            (m) => m.PlanoEditorComponent
          ),
      },
      {
        path: 'pdv/auditoria',
        loadComponent: () =>
          import('./features/pdv/components/auditoria/components/informe/informe-page.component').then(
            (m) => m.InformePageComponent
          ),
      },
      {
        path: 'pdv/auditoria/configuracion',
        loadComponent: () =>
          import('./features/pdv/components/auditoria/components/configuracion/configuracion-page.component').then(
            (m) => m.ConfiguracionPageComponent
          ),
      },
      {
        path: 'pdv/alta-arca',
        loadComponent: () =>
          import('./features/pdv/components/alta-arca/alta-arca.component').then(
            (m) => m.AltaArcaComponent
          ),
      },

      // Menu (Carta)
      {
        path: 'carta',
        loadComponent: () =>
          import('./features/carta/carta.component').then((m) => m.CartaComponent),
      },
      {
        path: 'carta/producto/:id',
        loadComponent: () =>
          import('./features/carta/components/producto-perfil/producto-perfil.component').then(
            (m) => m.ProductoPerfilComponent
          ),
      },
      {
        path: 'carta/descuentos',
        loadComponent: () =>
          import('./features/carta/components/descuentos/descuentos.component').then(
            (m) => m.DescuentosComponent
          ),
      },
      {
        path: 'carta/actualizar-precios',
        loadComponent: () =>
          import('./features/carta/components/actualizar-precios/actualizar-precios.component').then(
            (m) => m.ActualizarPreciosComponent
          ),
      },
      {
        path: 'carta/edicion-masiva',
        loadComponent: () =>
          import('./features/carta/components/edicion-masiva/edicion-masiva.component').then(
            (m) => m.EdicionMasivaComponent
          ),
      },

      // Compras
      {
        path: 'compras',
        loadComponent: () =>
          import('./features/compras/components/ordenes/ordenes-page.component').then(
            (m) => m.OrdenesPageComponent
          ),
      },
      {
        path: 'compras/ordenes/nueva',
        loadComponent: () =>
          import('./features/compras/components/ordenes/orden-page.component').then(
            (m) => m.OrdenPageComponent
          ),
      },
      {
        path: 'compras/ordenes/:id',
        loadComponent: () =>
          import('./features/compras/components/ordenes/orden-page.component').then(
            (m) => m.OrdenPageComponent
          ),
      },

      // Inventario
      {
        path: 'inventario',
        loadComponent: () =>
          import('./features/inventario/inventario.component').then(
            (m) => m.InventarioComponent
          ),
      },
      {
        path: 'inventario/insumo/:id',
        loadComponent: () =>
          import('./features/inventario/components/insumo-perfil/insumo-perfil.component').then(
            (m) => m.InsumoPerfilComponent
          ),
      },

      // Produccion
      {
        path: 'produccion',
        loadComponent: () =>
          import('./features/produccion/produccion.component').then(
            (m) => m.ProduccionComponent
          ),
      },

      // Ventas
      {
        path: 'ventas',
        loadComponent: () =>
          import('./features/ventas/ventas.component').then(
            (m) => m.VentasComponent
          ),
      },

      // Balances
      {
        path: 'balances',
        loadComponent: () =>
          import('./features/balances/balances.component').then(
            (m) => m.BalancesComponent
          ),
      },

      // Mi Cuenta
      {
        path: 'mi-cuenta',
        loadComponent: () =>
          import('./features/mi-cuenta/mi-cuenta.component').then(
            (m) => m.MiCuentaComponent
          ),
      },
      {
        path: 'mi-cuenta/productos',
        loadComponent: () =>
          import('./features/mi-cuenta/productos.component').then(
            (m) => m.ProductosComponent
          ),
      },
      {
        path: 'mi-cuenta/facturas',
        loadComponent: () =>
          import('./features/mi-cuenta/facturas.component').then(
            (m) => m.FacturasComponent
          ),
      },
      {
        path: 'mi-cuenta/tramites',
        loadComponent: () =>
          import('./features/mi-cuenta/tramites.component').then(
            (m) => m.TramitesComponent
          ),
      },
      {
        path: 'mi-cuenta/negocio',
        loadComponent: () =>
          import('./features/mi-cuenta/negocio.component').then(
            (m) => m.NegocioComponent
          ),
      },

      // Usuarios
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuarios.component').then(
            (m) => m.UsuariosComponent
          ),
      },
      {
        path: 'usuarios/:id',
        loadComponent: () =>
          import('./features/usuarios/usuario-perfil.component').then(
            (m) => m.UsuarioPerfilComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
