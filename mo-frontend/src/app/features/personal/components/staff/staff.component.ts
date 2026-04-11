import { Component, ChangeDetectionStrategy, computed, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MroCurrencyPipe } from '../../../balances/pipes/currency.pipe';
import { Empleado, RolGastronomico, EstadoEmpleado } from '../../models';

const ROLES: RolGastronomico[] = ['Mozo', 'Cocinero', 'Bachero', 'Manager', 'Bartender', 'Cajero', 'Delivery'];

const ESTADOS: EstadoEmpleado[] = ['Trabajando', 'Franco', 'Vacaciones', 'Licencia', 'Desvinculado'];

const ROL_COLORS: Record<RolGastronomico, string> = {
  Mozo: '#2563EB',
  Cocinero: '#DC2626',
  Bachero: '#7C3AED',
  Manager: '#0D9488',
  Bartender: '#D97706',
  Cajero: '#4F46E5',
  Delivery: '#059669',
};

const ESTADO_BADGE: Record<EstadoEmpleado, { bg: string; color: string }> = {
  Trabajando:   { bg: '#F0FDF4', color: '#22C55E' },
  Franco:       { bg: '#DBEAFE', color: '#2563EB' },
  Vacaciones:   { bg: '#F3E8FF', color: '#7C3AED' },
  Licencia:     { bg: '#FEF3C7', color: '#D97706' },
  Desvinculado: { bg: '#F3F4F6', color: '#6B7280' },
};

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../../balances/styles/balances-shared.css',
  template: `
    <!-- ===== ACTION BAR ===== -->
    <div class="action-bar">
      <div class="action-filters">
        <div class="search-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="Buscar por nombre..."
            [ngModel]="busqueda()"
            (ngModelChange)="busqueda.set($event)"
          />
        </div>

        <select
          class="filter-input"
          [ngModel]="filtroRol()"
          (ngModelChange)="filtroRol.set($event)"
        >
          <option value="">Todos los roles</option>
          @for (rol of roles; track rol) {
            <option [value]="rol">{{ rol }}</option>
          }
        </select>

        <select
          class="filter-input"
          [ngModel]="filtroEstado()"
          (ngModelChange)="filtroEstado.set($event)"
        >
          <option value="">Todos los estados</option>
          @for (estado of estados; track estado) {
            <option [value]="estado">{{ estado }}</option>
          }
        </select>
      </div>

      <button class="btn-primary" type="button" (click)="onNuevoEmpleado.emit()">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="btn-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Nuevo Empleado
      </button>
    </div>

    <!-- ===== KPI ROW ===== -->
    <div class="kpi-row">
      <div class="kpi-card">
        <span class="kpi-label">Empleados Activos</span>
        <span class="kpi-value">{{ empleadosActivos() }}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">En Turno Hoy</span>
        <span class="kpi-value">{{ enTurnoHoy() }}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">En Franco Hoy</span>
        <span class="kpi-value">{{ enFrancoHoy() }}</span>
      </div>
    </div>

    <!-- ===== STAFF GRID ===== -->
    <div class="staff-grid">
      @for (emp of filteredEmpleados(); track emp.id) {
        <div class="staff-card">
          <div class="staff-card-body">
            <div class="avatar" [style.background-color]="getAvatarColor(emp.rol)">
              {{ getInitials(emp.nombre) }}
            </div>
            <div class="staff-info">
              <span class="staff-nombre">{{ emp.nombre }}</span>
              <span class="staff-rol">{{ emp.rol }}</span>
            </div>
          </div>
          <span
            class="staff-badge"
            [style.background-color]="getBadgeBg(emp.estado)"
            [style.color]="getBadgeColor(emp.estado)"
          >{{ emp.estado }}</span>
        </div>
      } @empty {
        <div class="empty-state">
          <span class="empty-state-icon">&#128100;</span>
          <span>No se encontraron empleados con los filtros aplicados.</span>
        </div>
      }
    </div>
  `,
  styles: [`
    /* ===== ACTION BAR ===== */
    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .action-filters {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .search-wrapper {
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: var(--slate-400, #90A1B9);
      pointer-events: none;
    }

    .search-input {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      padding: 10px 16px 10px 36px;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md, 10px);
      background: white;
      color: var(--slate-700, #314158);
      outline: none;
      transition: all 0.2s ease;
      min-width: 200px;
    }

    .search-input::placeholder {
      color: var(--slate-400, #90A1B9);
    }

    .search-input:focus {
      border-color: var(--primary-orange, #F27920);
      box-shadow: 0 0 0 3px rgba(242, 121, 32, 0.1);
    }

    .filter-input {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      padding: 10px 36px 10px 16px;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md, 10px);
      background: white;
      color: var(--slate-700, #314158);
      outline: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      transition: all 0.2s ease;
      min-width: 160px;
      cursor: pointer;
    }

    .filter-input:focus {
      border-color: var(--primary-orange, #F27920);
      box-shadow: 0 0 0 3px rgba(242, 121, 32, 0.1);
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      padding: 10px 20px;
      border: none;
      border-radius: var(--radius-md, 10px);
      background: #1155CC;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn-primary:hover {
      background: #0E47AD;
    }

    .btn-icon {
      width: 16px;
      height: 16px;
    }

    /* ===== STAFF GRID ===== */
    .staff-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .staff-card {
      background: #fff;
      border: 1px solid var(--slate-200, #E5E7EB);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    .staff-card:hover {
      border-color: var(--slate-300, #CBD5E1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    .staff-card-body {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .avatar {
      width: 48px;
      height: 48px;
      min-width: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.02em;
    }

    .staff-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .staff-nombre {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--slate-900, #111827);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .staff-rol {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: var(--slate-500, #6B7280);
    }

    .staff-badge {
      display: inline-flex;
      align-self: flex-start;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 9999px;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .staff-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .action-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .action-filters {
        flex-direction: column;
      }

      .search-input,
      .filter-input {
        min-width: unset;
        width: 100%;
      }

      .btn-primary {
        justify-content: center;
      }

      .staff-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class StaffComponent {

  /* --- I/O --- */
  readonly empleados = input.required<Empleado[]>();
  readonly onNuevoEmpleado = output<void>();

  /* --- Filter signals --- */
  readonly busqueda   = signal('');
  readonly filtroRol  = signal('');
  readonly filtroEstado = signal('');

  /* --- Lookup data --- */
  readonly roles   = ROLES;
  readonly estados = ESTADOS;

  /* --- Computed: filtered list --- */
  readonly filteredEmpleados = computed(() => {
    const term   = this.busqueda().toLowerCase().trim();
    const rol    = this.filtroRol();
    const estado = this.filtroEstado();

    return this.empleados().filter(emp => {
      if (term && !emp.nombre.toLowerCase().includes(term)) return false;
      if (rol && emp.rol !== rol) return false;
      if (estado && emp.estado !== estado) return false;
      return true;
    });
  });

  /* --- Computed: KPIs --- */
  readonly empleadosActivos = computed(
    () => this.empleados().filter(e => e.estado !== 'Desvinculado').length,
  );

  readonly enTurnoHoy = computed(
    () => this.empleados().filter(e => e.estado === 'Trabajando').length,
  );

  readonly enFrancoHoy = computed(
    () => this.empleados().filter(e => e.estado === 'Franco').length,
  );

  /* --- Helpers --- */
  getInitials(nombre: string): string {
    const parts = nombre.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nombre.substring(0, 2).toUpperCase();
  }

  getAvatarColor(rol: RolGastronomico): string {
    return ROL_COLORS[rol] ?? '#6B7280';
  }

  getBadgeBg(estado: EstadoEmpleado): string {
    return ESTADO_BADGE[estado]?.bg ?? '#F3F4F6';
  }

  getBadgeColor(estado: EstadoEmpleado): string {
    return ESTADO_BADGE[estado]?.color ?? '#6B7280';
  }
}
