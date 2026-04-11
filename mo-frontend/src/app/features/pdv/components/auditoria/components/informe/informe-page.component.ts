import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuditoriaFacade } from '../../state/auditoria.facade';
import { FiltrosTabComponent } from './filtros-tab.component';
import { AuditoriaGridComponent } from './auditoria-grid.component';
import { FiltroTab } from '../../models/auditoria.models';

@Component({
  selector: 'app-informe-page',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltrosTabComponent, AuditoriaGridComponent],
  template: `
    <div class="informe-page">
      <!-- Header de la página -->
      <div class="page-header">
        <div class="page-header-left">
          <button class="back-btn" (click)="goBack()" title="Volver">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
          <h1 class="page-title">Auditoría</h1>
          <p class="page-subtitle">Informe de eventos auditados</p>
          </div>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary" (click)="onConfiguraciones()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Configuraciones
          </button>
        </div>
      </div>

      <!-- Filtros y acciones -->
      <div class="filter-toolbar">
        <div class="date-range">
          <input type="date" class="date-input" [ngModel]="fechaDesde()" (ngModelChange)="fechaDesde.set($event)" />
          <span class="date-separator">—</span>
          <input type="date" class="date-input" [ngModel]="fechaHasta()" (ngModelChange)="fechaHasta.set($event)" />
        </div>

        <div class="toolbar-actions">
          <button class="btn btn-secondary btn-sm-action" (click)="onImportExport()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Descargar
          </button>
          <button class="btn btn-secondary btn-sm-action" (click)="onImprimir()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12Zm-2.25 0h.008v.008H16.5V12Z" />
            </svg>
            Imprimir
          </button>
          <button class="btn btn-secondary btn-sm-action" (click)="onEnviarMail()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            Enviar
          </button>
        </div>
      </div>

      <!-- Grid de auditoría -->
      @if (facade.loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Cargando eventos...</p>
        </div>
      } @else if (facade.error()) {
        <div class="error-container">
          <p>{{ facade.error() }}</p>
          <button class="btn btn-primary" (click)="recargar()">Reintentar</button>
        </div>
      } @else {
        <app-auditoria-grid
          [data]="facade.eventosFiltrados()">
        </app-auditoria-grid>
      }
    </div>
  `,
  styles: [`
    .informe-page {
      padding: 0;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Page header - matching menu project */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      gap: 24px;
    }

    .page-header-left {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      flex-shrink: 0;
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

    .back-btn:hover { background: var(--slate-50); border-color: var(--slate-300); }

    .page-title {
      font-size: 26px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 6px 0;
      letter-spacing: -0.01em;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--gray-500);
      margin: 0;
    }

    .page-header-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    /* Filter toolbar - matching menu project */
    .filter-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }

    .btn-sm-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      background: white;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md);
      color: var(--slate-700);
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .btn-sm-action:hover {
      background: var(--slate-50);
      border-color: var(--slate-300);
    }

    .date-range {
      display: flex;
      align-items: center;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md);
      overflow: hidden;
      background: white;
      flex-shrink: 0;
    }

    .date-input {
      border: none;
      outline: none;
      padding: 10px 12px;
      font-size: 14px;
      font-family: inherit;
      color: var(--slate-700);
      background: transparent;
    }

    .date-input:focus {
      background: var(--slate-50);
    }

    .date-separator {
      color: var(--slate-400);
      font-size: 14px;
      padding: 0 4px;
    }

    /* Search box */
    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      padding: 0 12px;
      min-width: 220px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .search-box:focus-within {
      border-color: var(--primary-orange);
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }

    .search-icon {
      color: var(--gray-400);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 10px 10px;
      font-size: 14px;
      font-family: inherit;
      color: var(--gray-700);
      background: transparent;
      min-width: 140px;
    }

    .search-input::placeholder {
      color: var(--gray-400);
    }

    .loading-container,
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
    }

    .error-container {
      color: var(--danger-color);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .page-header {
        flex-direction: column;
      }
      .page-header-actions {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 22px;
      }
      .filter-toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      .search-box {
        flex: 1;
        min-width: 0;
      }
    }
  `]
})
export class InformePageComponent implements OnInit {
  private router = inject(Router);
  facade = inject(AuditoriaFacade);

  filtros = signal<FiltroTab[]>([
    { id: 'todos', label: 'Todos', count: 0 },
    { id: 'critico', label: 'Crítico', count: 0, prioridad: 'CRITICO' },
    { id: 'comunes', label: 'Comunes', count: 0, prioridad: 'COMUN' },
    { id: 'alta', label: 'Alta prioridad', count: 0, prioridad: 'ALTA' },
    { id: 'baja', label: 'Baja prioridad', count: 0, prioridad: 'BAJA' }
  ]);

  fechaDesde = signal(new Date().toISOString().split('T')[0]);
  fechaHasta = signal(new Date().toISOString().split('T')[0]);

  constructor() {
    // Usar effect para actualizar conteos reactivamente cuando los eventos cambien
    effect(() => {
      const conteos = this.facade.conteosPorPrioridad();
      this.filtros.update(filtros => filtros.map(f => {
        switch (f.id) {
          case 'todos': return { ...f, count: conteos.todos };
          case 'critico': return { ...f, count: conteos.critico };
          case 'comunes': return { ...f, count: conteos.comunes };
          case 'alta': return { ...f, count: conteos.altaPrioridad };
          case 'baja': return { ...f, count: conteos.bajaPrioridad };
          default: return f;
        }
      }));
    });
  }

  ngOnInit(): void {
    this.facade.cargarEventos();
  }

  onFiltroChange(filtroId: string): void {
    this.facade.setFiltroActivo(filtroId);
  }

  onBusqueda(texto: string): void {
    this.facade.setBusqueda(texto);
  }

  onImportExport(): void {
    console.log('Descargar clicked');
  }

  onImprimir(): void {
    window.print();
  }

  onEnviarMail(): void {
    alert('Funcionalidad de envio por mail en desarrollo');
  }

  goBack(): void {
    this.router.navigate(['/pdv']);
  }

  onConfiguraciones(): void {
    this.router.navigate(['/pdv/auditoria/configuracion']);
  }

  recargar(): void {
    this.facade.cargarEventos();
  }
}
