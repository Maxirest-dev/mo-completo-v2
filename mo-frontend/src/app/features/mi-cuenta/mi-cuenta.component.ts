import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
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
        <h1 class="page-title">Mi Cuenta</h1>
        <p class="page-subtitle">Dirigir tu cuenta y consultar tus formularios</p>
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="cards-grid">
      <!-- Row 1: 3 cards -->
      <div class="card-item" (click)="navigate('/mi-cuenta/facturas')">
        <div class="card-left-border card-left-border--red"></div>
        <div class="card-content">
          <h3 class="card-title">Mis Facturas</h3>
          <p class="card-description">Encontra el estado de tu cuenta y controla tus facturas del servicio</p>
          <div class="card-data">
            <span class="card-label">Ultima factura</span>
            <span class="card-value card-value--red">{{'$'}}26,708</span>
            <span class="badge badge--green">En dia: sin deuda</span>
          </div>
        </div>
      </div>

      <div class="card-item" (click)="navigate('/mi-cuenta/tramites')">
        <div class="card-left-border card-left-border--orange"></div>
        <div class="card-content">
          <h3 class="card-title">Mis Tramites</h3>
          <p class="card-description">Consulta el historial, controla las fechas y toma el control de cada tramite</p>
          <div class="card-data">
            <span class="card-label">Ultimo tramite</span>
            <span class="badge badge--orange">EN CURSO</span>
            <span class="card-detail">TRM-2024-00156</span>
          </div>
        </div>
      </div>

      <div class="card-item" (click)="navigate('/usuarios/1')">
        <div class="card-left-border card-left-border--blue"></div>
        <div class="card-content">
          <h3 class="card-title">Mis Datos</h3>
          <p class="card-description">Mantene a tu tabla personalizada actualizada para optimizar tu comunicacion</p>
          <div class="card-data">
            <span class="card-label">Completado</span>
            <span class="card-value card-value--dark">80%</span>
            <span class="badge badge--blue badge--link">Completar configuracion</span>
          </div>
        </div>
      </div>

      <!-- Row 2: 2 cards -->
      <div class="card-item" (click)="navigate('/mi-cuenta/productos')">
        <div class="card-left-border card-left-border--green"></div>
        <div class="card-content">
          <h3 class="card-title">Mis Productos</h3>
          <p class="card-description">Descubri lo que tenemos preparado para potenciar tu restaurante, entre servicios, promociones, complementos y mas</p>
          <div class="card-data">
            <span class="card-label">Oferta activa</span>
            <div class="card-data-row">
              <span class="badge badge--green">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="12" height="12">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                16% OFF
              </span>
            </div>
            <span class="card-detail">en todos y medios de pago</span>
          </div>
        </div>
      </div>

      <div class="card-item" (click)="navigate('/mi-cuenta/negocio')">
        <div class="card-left-border card-left-border--blue"></div>
        <div class="card-content">
          <h3 class="card-title">Mi Negocio</h3>
          <p class="card-description">Monitora las cifras de tu negocio y trabaja para llegar a tus metas</p>
          <div class="card-data">
            <span class="card-label">Crecimiento</span>
            <span class="card-value card-value--blue">16%</span>
            <span class="badge badge--blue">del periodo cumpliendo</span>
          </div>
        </div>
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
      border-radius: var(--radius-md);
      border: 1px solid var(--slate-200);
      background: white;
      color: var(--slate-700);
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .back-btn:hover {
      background: var(--slate-50);
      border-color: var(--slate-300);
    }

    .page-title {
      font-size: 26px;
      font-weight: 600;
      color: var(--slate-900);
      margin: 0 0 4px;
      letter-spacing: -0.01em;
    }
    .page-subtitle {
      font-size: 14px;
      color: var(--slate-500);
      margin: 0;
    }

    /* Cards Grid */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .card-item {
      display: flex;
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-lg);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 180px;
      box-shadow: var(--shadow-sm);
    }
    .card-item:hover {
      border-color: var(--slate-300);
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }

    /* Left colored border */
    .card-left-border {
      width: 4px;
      flex-shrink: 0;
    }
    .card-left-border--red { background: #EF4444; }
    .card-left-border--orange { background: var(--primary-orange); }
    .card-left-border--blue { background: #3B82F6; }
    .card-left-border--green { background: #22C55E; }

    .card-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--slate-900);
      margin: 0;
    }

    .card-description {
      font-size: 13px;
      color: var(--slate-500);
      margin: 0;
      line-height: 1.5;
    }

    .card-data {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: auto;
      padding-top: 8px;
    }

    .card-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--slate-400);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .card-value {
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
    }
    .card-value--red { color: #EF4444; }
    .card-value--dark { color: var(--slate-900); }
    .card-value--blue { color: #3B82F6; }

    .card-data-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-detail {
      font-size: 13px;
      color: #60A5FA;
      font-weight: 500;
    }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
      width: fit-content;
    }
    .badge--green {
      background: #F0FDF4;
      color: #16A34A;
      border: 1px solid #BBF7D0;
    }
    .badge--orange {
      background: var(--primary-orange-light);
      color: var(--primary-orange-hover);
      border: 1px solid var(--primary-orange-lighter);
    }
    .badge--blue {
      background: #EFF6FF;
      color: #2563EB;
      border: 1px solid #BFDBFE;
    }
    .badge--link {
      cursor: pointer;
      transition: background 0.15s;
    }
    .badge--link:hover {
      background: #DBEAFE;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .cards-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .cards-grid {
        grid-template-columns: 1fr;
      }
      .page-title {
        font-size: 22px;
      }
    }
  `],
})
export class MiCuentaComponent {
  private readonly router = inject(Router);

  goBack(): void {
    this.router.navigate(['/home']);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
