import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastContainerComponent, NotificationService } from '@mro/shared-ui';
import { PersonalTabNavComponent } from './components/tab-nav/tab-nav.component';
import { StaffComponent } from './components/staff/staff.component';
import { FichajeComponent } from './components/fichaje/fichaje.component';
import { TareasComponent } from './components/tareas/tareas.component';
import { LiquidacionComponent } from './components/liquidacion/liquidacion.component';
import { MasComponent } from './components/mas/mas.component';
import {
  TabPersonal,
  Empleado, EmpleadoEnTurno, FichajeRegistro,
  Tarea, Checklist,
  KpiLiquidacion, PreLiquidacionRow, Adelanto,
  PropinaRegistro, UniformeEntrega, Incidencia,
} from './models';
import {
  MOCK_EMPLEADOS, MOCK_EN_TURNO, MOCK_HISTORIAL_FICHAJES,
  MOCK_TAREAS, MOCK_CHECKLISTS,
  MOCK_KPI_LIQUIDACION, MOCK_PRE_LIQUIDACION, MOCK_ADELANTOS,
  MOCK_PROPINAS, MOCK_UNIFORMES, MOCK_INCIDENCIAS,
} from './data/mock-personal.data';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [
    CommonModule, ToastContainerComponent,
    PersonalTabNavComponent,
    StaffComponent, FichajeComponent, TareasComponent,
    LiquidacionComponent, MasComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-toast-container />

    @if (loading()) {
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <p class="loading-text">Cargando datos...</p>
      </div>
    } @else if (error()) {
      <div class="error-state">
        <span class="error-icon" aria-hidden="true">⚠️</span>
        <p class="error-text">{{ error() }}</p>
        <button class="btn-retry" (click)="reload()" type="button">Reintentar</button>
      </div>
    } @else {
      <!-- Header -->
      <header class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Personal</h1>
          <p class="page-subtitle">Gestión de equipo y nómina</p>
        </div>
        <app-personal-tab-nav
          [tabActivo]="tabActivo()"
          (tabChange)="tabActivo.set($event)"
        />
      </header>
      <div class="page-divider"></div>

      <!-- Tab Content -->
      @for (tab of [tabActivo()]; track tab) {
      <div class="tab-content" role="tabpanel"
        [id]="'tabpanel-' + tabActivo()"
        [attr.aria-labelledby]="'tab-' + tabActivo()">
        @switch (tabActivo()) {
          @case ('staff') {
            <app-staff
              [empleados]="empleados()"
              (nuevoEmpleado)="onNuevoEmpleado()"
              (onVerEmpleado)="onVerEmpleado($event)"
            />
          }
          @case ('fichaje') {
            <app-fichaje
              [enTurno]="enTurno()"
              [historial]="historialFichajes()"
            />
          }
          @case ('tareas') {
            <app-tareas
              [tareas]="tareas()"
              [checklists]="checklists()"
            />
          }
          @case ('liquidacion') {
            <app-liquidacion
              [kpis]="kpiLiquidacion()"
              [preLiquidacion]="preLiquidacion()"
              [adelantos]="adelantos()"
            />
          }
          @case ('mas') {
            <app-mas
              [propinas]="propinas()"
              [uniformes]="uniformes()"
              [incidencias]="incidencias()"
            />
          }
        }
      </div>
      }
    }
  `,
  styles: [`
    :host { display: block; }

    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;
    }
    .page-header-left { display: flex; flex-direction: column; gap: 2px; }
    .page-title {
      font-size: 26px; font-weight: 700;
      color: var(--slate-900, #0F172B); margin: 0; letter-spacing: -0.01em;
    }
    .page-subtitle { font-size: 14px; color: var(--slate-400, #90A1B9); margin: 0; }
    .page-divider { height: 1px; background: var(--slate-200, #E2E8F0); margin: 16px 0 20px; }

    .tab-content { animation: tabFadeIn 0.3s ease; }
    @keyframes tabFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .loading-overlay {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; min-height: 400px; gap: 16px;
    }
    .loading-spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--slate-200, #E2E8F0);
      border-top-color: var(--primary-orange, #F27920);
      border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-text { font-family: 'Inter', sans-serif; font-size: 14px; color: var(--slate-400, #90A1B9); margin: 0; }

    .error-state {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; min-height: 400px; gap: 12px;
    }
    .error-icon { font-size: 40px; }
    .error-text { font-family: 'Inter', sans-serif; font-size: 14px; color: var(--slate-500, #6B7280); margin: 0; }
    .btn-retry {
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
      padding: 8px 20px; border: 1px solid var(--primary-orange, #F27920);
      border-radius: 8px; background: var(--primary-orange, #F27920);
      color: #fff; cursor: pointer; transition: all 0.15s ease;
    }
    .btn-retry:hover { opacity: 0.9; }
  `],
})
export class PersonalComponent implements OnInit {
  private readonly notifications = inject(NotificationService);

  readonly tabActivo = signal<TabPersonal>('staff');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  // Staff
  readonly empleados = signal<Empleado[]>([]);

  // Fichaje
  readonly enTurno = signal<EmpleadoEnTurno[]>([]);
  readonly historialFichajes = signal<FichajeRegistro[]>([]);

  // Tareas
  readonly tareas = signal<Tarea[]>([]);
  readonly checklists = signal<Checklist[]>([]);

  // Liquidacion
  readonly kpiLiquidacion = signal<KpiLiquidacion[]>([]);
  readonly preLiquidacion = signal<PreLiquidacionRow[]>([]);
  readonly adelantos = signal<Adelanto[]>([]);

  // Mas
  readonly propinas = signal<PropinaRegistro[]>([]);
  readonly uniformes = signal<UniformeEntrega[]>([]);
  readonly incidencias = signal<Incidencia[]>([]);

  ngOnInit(): void { this.loadData(); }

  reload(): void {
    this.error.set(null);
    this.loading.set(true);
    this.loadData();
  }

  onNuevoEmpleado(): void {
    this.notifications.show('Formulario de nuevo empleado — en desarrollo', 'info');
  }

  onVerEmpleado(id: string): void {
    this.notifications.show(`Detalle del empleado ${id} — en desarrollo`, 'info');
  }

  private loadData(): void {
    setTimeout(() => {
      this.empleados.set(MOCK_EMPLEADOS);
      this.enTurno.set(MOCK_EN_TURNO);
      this.historialFichajes.set(MOCK_HISTORIAL_FICHAJES);
      this.tareas.set(MOCK_TAREAS);
      this.checklists.set(MOCK_CHECKLISTS);
      this.kpiLiquidacion.set(MOCK_KPI_LIQUIDACION);
      this.preLiquidacion.set(MOCK_PRE_LIQUIDACION);
      this.adelantos.set(MOCK_ADELANTOS);
      this.propinas.set(MOCK_PROPINAS);
      this.uniformes.set(MOCK_UNIFORMES);
      this.incidencias.set(MOCK_INCIDENCIAS);
      this.loading.set(false);
    }, 500);
  }
}
