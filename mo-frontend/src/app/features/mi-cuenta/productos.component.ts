import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Integracion {
  nombre: string;
  descripcion: string;
  activo: boolean;
  boton: string | null;
  iconColor: string | null;
  iconLetter: string | null;
}

const INTEGRACIONES_SERVICIOS: Integracion[] = [
  {
    nombre: 'Ordering',
    descripcion: 'Recibe pedidos de tu tienda, tu delivery, y gestiona todo en un solo lugar',
    activo: true,
    boton: 'Conoce mas',
    iconColor: null,
    iconLetter: null,
  },
  {
    nombre: 'Manager',
    descripcion: 'Panel de gestion de Pedidos, inventario y mas',
    activo: false,
    boton: 'Contratar info',
    iconColor: null,
    iconLetter: null,
  },
  {
    nombre: 'Kitchen',
    descripcion: 'Emite pedidos en la Pantalla de tu cocina y gestiona tus ordenes',
    activo: true,
    boton: 'Conoce mas',
    iconColor: null,
    iconLetter: null,
  },
  {
    nombre: 'Menu',
    descripcion: 'Menu digital, Contacto para tus clientes, tus integraciones',
    activo: false,
    boton: 'Contratar info',
    iconColor: null,
    iconLetter: null,
  },
];

const INTEGRACIONES_DELIVERY: Integracion[] = [
  {
    nombre: 'PedidosYa',
    descripcion: 'Activacion del comercio (PedidosYa) y recepcion a nuevos clientes',
    activo: true,
    boton: null,
    iconColor: '#F97316',
    iconLetter: 'PY',
  },
  {
    nombre: 'Rappi',
    descripcion: 'Aplica e gestiona de Rappi (Pedidos, menu, publicaciones, tarifas e envios)',
    activo: true,
    boton: null,
    iconColor: '#F97316',
    iconLetter: 'R',
  },
  {
    nombre: 'Midity',
    descripcion: 'Servicio de plataforma de Pedidos y pago digital',
    activo: false,
    boton: null,
    iconColor: '#3B82F6',
    iconLetter: 'M',
  },
  {
    nombre: 'Wility',
    descripcion: 'Activacion del comercio (Cuenta Grupo) y recepcion a nuevos clientes',
    activo: false,
    boton: null,
    iconColor: '#8B5CF6',
    iconLetter: 'W',
  },
];

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Header -->
    <div class="page-header">
      <button class="back-btn" (click)="goBack()" title="Volver">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>
      <div class="page-header-info">
        <h1 class="page-title">Mis Productos</h1>
        <p class="page-subtitle">Conoce tu sistema y gestionalo con las propuestas</p>
      </div>
    </div>

    <!-- Main Product Card -->
    <div class="product-hero">
      <div class="product-hero-left">
        <h2 class="product-hero-name">POINT</h2>
        <div class="product-hero-badges">
          <span class="badge badge--green-solid">Al corriente</span>
          <span class="badge badge--blue-solid">App movil</span>
        </div>
        <div class="product-hero-price">
          <span class="product-hero-amount">{{'$'}}29,250</span>
          <span class="product-hero-tax">+ IVA (segun corresponda)</span>
        </div>
      </div>
      <div class="product-hero-right">
        <button class="btn-outline-white">Transacciones</button>
        <button class="btn-plus-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" width="18" height="18">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Integraciones Servicios -->
    <div class="section">
      <h3 class="section-title">Integraciones</h3>
      <div class="integraciones-grid">
        @for (item of integracionesServicios(); track item.nombre) {
          <div class="integracion-card">
            <div class="integracion-icon-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
              </svg>
            </div>
            <h4 class="integracion-nombre">{{ item.nombre }}</h4>
            <p class="integracion-desc">{{ item.descripcion }}</p>
            <div class="integracion-footer">
              <span class="badge" [class.badge--green]="item.activo" [class.badge--gray]="!item.activo">
                {{ item.activo ? 'Activo' : 'Inactivo' }}
              </span>
              @if (item.boton) {
                <button class="btn-integracion">{{ item.boton }}</button>
              }
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Integraciones Delivery -->
    <div class="section">
      <h3 class="section-title">Integraciones</h3>
      <div class="integraciones-grid">
        @for (item of integracionesDelivery(); track item.nombre) {
          <div class="integracion-card">
            <div class="integracion-icon-circle" [style.background]="item.iconColor">
              <span class="integracion-icon-letter">{{ item.iconLetter }}</span>
            </div>
            <h4 class="integracion-nombre">{{ item.nombre }}</h4>
            <p class="integracion-desc">{{ item.descripcion }}</p>
            <div class="integracion-footer">
              <span class="badge" [class.badge--green]="item.activo" [class.badge--gray]="!item.activo">
                {{ item.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    /* Header */
    .page-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 28px;
    }

    .back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: 1px solid #E5E7EB;
      background: white;
      color: #374151;
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .back-btn:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
    }

    .page-title {
      font-size: 26px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 4px;
      letter-spacing: -0.01em;
    }
    .page-subtitle {
      font-size: 14px;
      color: #6B7280;
      margin: 0;
    }

    /* Product Hero Card */
    .product-hero {
      background: #1F2937;
      border-radius: 16px;
      padding: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .product-hero-name {
      font-size: 36px;
      font-weight: 700;
      color: white;
      margin: 0 0 12px;
      letter-spacing: 0.02em;
    }

    .product-hero-badges {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .badge--green-solid {
      background: #22C55E;
      color: white;
      padding: 4px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge--blue-solid {
      background: #3B82F6;
      color: white;
      padding: 4px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
    }

    .product-hero-price {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .product-hero-amount {
      font-size: 28px;
      font-weight: 700;
      color: white;
    }
    .product-hero-tax {
      font-size: 13px;
      color: #9CA3AF;
    }

    .product-hero-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-outline-white {
      padding: 10px 24px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: transparent;
      color: white;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-outline-white:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .btn-plus-white {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: transparent;
      color: white;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-plus-white:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    /* Sections */
    .section {
      margin-bottom: 32px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 16px;
    }

    /* Integraciones Grid */
    .integraciones-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .integracion-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .integracion-card:hover {
      border-color: #D1D5DB;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }

    .integracion-icon-placeholder {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: #F3F4F6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6B7280;
      margin-bottom: 4px;
    }

    .integracion-icon-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }
    .integracion-icon-letter {
      color: white;
      font-size: 14px;
      font-weight: 700;
    }

    .integracion-nombre {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .integracion-desc {
      font-size: 13px;
      color: #6B7280;
      margin: 0;
      line-height: 1.5;
      flex: 1;
    }

    .integracion-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 8px;
    }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      width: fit-content;
    }
    .badge--green {
      background: #F0FDF4;
      color: #16A34A;
      border: 1px solid #BBF7D0;
    }
    .badge--gray {
      background: #F3F4F6;
      color: #6B7280;
      border: 1px solid #E5E7EB;
    }

    .btn-integracion {
      padding: 6px 16px;
      border-radius: 8px;
      border: 1px solid #E5E7EB;
      background: white;
      color: #374151;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-integracion:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .integraciones-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .integraciones-grid {
        grid-template-columns: 1fr;
      }
      .product-hero {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
        padding: 24px;
      }
      .product-hero-name {
        font-size: 28px;
      }
      .product-hero-amount {
        font-size: 22px;
      }
      .page-title {
        font-size: 22px;
      }
    }
  `],
})
export class ProductosComponent {
  private readonly router = inject(Router);

  readonly integracionesServicios = signal(INTEGRACIONES_SERVICIOS);
  readonly integracionesDelivery = signal(INTEGRACIONES_DELIVERY);

  goBack(): void {
    this.router.navigate(['/mi-cuenta']);
  }
}
