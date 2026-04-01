import {
  Component,
  ChangeDetectionStrategy,
  output,
} from '@angular/core';

@Component({
  selector: 'app-accesos-rapidos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="accesos-grid">
      <button class="acceso-card" (click)="navigateTo.emit('alta-arca')">
        <div class="acceso-icon facturacion">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <div class="acceso-info">
          <h4 class="acceso-title">Facturacion Electronica</h4>
          <span class="acceso-subtitle">Configurar alta en ARCA y emision de comprobantes</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="acceso-arrow" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <button class="acceso-card" (click)="navigateTo.emit('configuraciones')">
        <div class="acceso-icon configuraciones">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>
        <div class="acceso-info">
          <h4 class="acceso-title">Configuraciones</h4>
          <span class="acceso-subtitle">Estaciones, formas de cobro, turnos y dispositivos</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="acceso-arrow" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .accesos-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .acceso-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      padding: 20px;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
      width: 100%;
      font-family: inherit;
    }

    .acceso-card:hover {
      border-color: var(--slate-300);
      box-shadow: var(--shadow-md);
    }

    .acceso-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      flex-shrink: 0;
    }

    .acceso-icon.facturacion {
      background: var(--primary-orange-light);
      color: var(--primary-orange);
    }

    .acceso-icon.configuraciones {
      background: var(--info-bg);
      color: var(--info-color);
    }

    .acceso-info {
      flex: 1;
    }

    .acceso-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-heading);
      margin: 0 0 4px 0;
    }

    .acceso-subtitle {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .acceso-arrow {
      color: var(--slate-400);
      flex-shrink: 0;
    }
  `],
})
export class AccesosRapidosComponent {
  navigateTo = output<string>();
}
