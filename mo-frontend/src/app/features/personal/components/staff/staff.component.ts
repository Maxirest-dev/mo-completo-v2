import { Component, ChangeDetectionStrategy, computed, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Empleado, RolGastronomico, EstadoEmpleado } from '../../models';

const ROLES: RolGastronomico[] = ['Mozo', 'Cocinero', 'Bachero', 'Manager', 'Bartender', 'Cajero', 'Delivery'];
const ESTADOS: EstadoEmpleado[] = ['Trabajando', 'Franco', 'Vacaciones', 'Licencia', 'Desvinculado'];

const ROL_COLORS: Record<RolGastronomico, string> = {
  Mozo: '#EFF6FF', Cocinero: '#FEF2F2', Bachero: '#F5F3FF',
  Manager: '#F0FDFA', Bartender: '#FFFBEB', Cajero: '#EEF2FF', Delivery: '#ECFDF5',
};

const ROL_ICONS: Record<RolGastronomico, string> = {
  Mozo: '🍽️', Cocinero: '👨‍🍳', Bachero: '🧹', Manager: '💼',
  Bartender: '🍸', Cajero: '💰', Delivery: '🛵',
};

const ESTADO_BADGE: Record<EstadoEmpleado, { bg: string; color: string }> = {
  Trabajando:   { bg: '#ECFDF5', color: '#00A43D' },
  Franco:       { bg: '#DBEAFE', color: '#2563EB' },
  Vacaciones:   { bg: '#F3E8FF', color: '#7C3AED' },
  Licencia:     { bg: '#FFFBEB', color: '#92400E' },
  Desvinculado: { bg: '#F1F5F9', color: '#5F6D7E' },
};

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Action Bar -->
    <div class="action-bar">
      <div class="action-filters">
        <select class="filter-input" aria-label="Filtrar por rol"
          [ngModel]="filtroRol()" (ngModelChange)="filtroRol.set($event)">
          <option value="">Todos los roles</option>
          @for (rol of roles; track rol) { <option [value]="rol">{{ rol }}</option> }
        </select>
        <select class="filter-input" aria-label="Filtrar por estado"
          [ngModel]="filtroEstado()" (ngModelChange)="filtroEstado.set($event)">
          <option value="">Todos los estados</option>
          @for (estado of estados; track estado) { <option [value]="estado">{{ estado }}</option> }
        </select>
      </div>
      <div class="action-right">
        <div class="search-wrapper">
          <svg class="search-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
          </svg>
          <input type="text" class="search-input" placeholder="Buscar por nombre..."
            aria-label="Buscar empleados por nombre"
            [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)" />
        </div>
        <button class="btn-nueva" type="button" (click)="nuevoEmpleado.emit()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Nuevo Empleado
        </button>
      </div>
    </div>

    <!-- Staff Table (identical to Menú grid) -->
    <div class="card">
      <table class="master-table" aria-label="Directorio de personal">
        <thead>
          <tr>
            <th class="col-nombre">NOMBRE</th>
            <th class="col-estado">ESTADO</th>
            <th class="col-dni">DNI</th>
            <th class="col-contacto">CONTACTO</th>
            <th class="col-mail">MAIL</th>
            <th class="col-acciones">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          @for (emp of filteredEmpleados(); track emp.id) {
            <tr class="master-row" (click)="onVerEmpleado.emit(emp.id)">
              <td class="col-nombre">
                <div class="nombre-cell">
                  <span class="emp-icon" [style.background]="getRolColor(emp.rol)">
                    {{ getRolIcon(emp.rol) }}
                  </span>
                  <div class="emp-info">
                    <span class="emp-name">{{ emp.nombre }}</span>
                    <span class="emp-desc">{{ emp.rol }}</span>
                  </div>
                </div>
              </td>
              <td class="col-estado">
                <span class="badge" [style.background]="getBadgeBg(emp.estado)" [style.color]="getBadgeColor(emp.estado)">
                  {{ emp.estado }}
                </span>
              </td>
              <td class="col-dni">{{ emp.dni }}</td>
              <td class="col-contacto">{{ emp.telefono }}</td>
              <td class="col-mail">{{ emp.email }}</td>
              <td class="col-acciones" (click)="$event.stopPropagation()">
                <div class="acciones-cell">
                  <button class="btn-edit" (click)="onVerEmpleado.emit(emp.id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar
                  </button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="empty-state-row">
                <div class="empty-state">
                  <span class="empty-state-title">Sin empleados</span>
                  <span class="empty-state-description">No se encontraron empleados con los filtros aplicados</span>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    /* ===== ACTION BAR ===== */
    .action-bar {
      display: flex; justify-content: space-between; align-items: center;
      gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
    }
    .action-right { display: flex; align-items: center; gap: 8px; }
    .action-filters { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

    .search-wrapper { position: relative; }
    .search-icon {
      position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
      width: 16px; height: 16px; color: var(--slate-400); pointer-events: none;
    }
    .search-input {
      font-family: 'Inter', sans-serif; font-size: 14px;
      padding: 10px 16px 10px 36px;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md, 10px); background: white;
      color: var(--slate-700); outline: none; transition: all 0.2s ease; min-width: 200px;
    }
    .search-input::placeholder { color: var(--slate-400); }
    .search-input:focus { border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(242,121,32,0.1); }

    .filter-input {
      font-family: 'Inter', sans-serif; font-size: 14px;
      padding: 10px 36px 10px 16px;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md, 10px); background: white;
      color: var(--slate-700); outline: none; appearance: none; cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 12px center; background-size: 16px;
      transition: all 0.2s ease; min-width: 160px;
    }
    .filter-input:focus { border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(242,121,32,0.1); }

    /* ===== CARD (identical to Menú) ===== */
    .card {
      overflow: hidden; background: white; border-radius: 12px;
      border: 1px solid var(--gray-200, #E5E7EB);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    /* ===== TABLE (identical to Menú master-table) ===== */
    .master-table { width: 100%; border-collapse: collapse; table-layout: fixed; }

    .master-table thead th {
      padding: 14px 16px; font-size: 12px; font-weight: 600;
      color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.05em;
      text-align: left; border-bottom: 1px solid var(--slate-200); background: white;
    }

    .col-nombre { width: 25%; }
    .col-estado { width: 13%; }
    .col-dni { width: 13%; }
    .col-contacto { width: 14%; }
    .col-mail { width: 20%; }
    .col-acciones { width: 15%; text-align: right !important; }

    .master-row { cursor: pointer; transition: background 0.15s; }
    .master-row:hover { background: #FAFAFA; }

    .master-row td {
      padding: 12px 16px; border-bottom: 1px solid var(--slate-100);
      vertical-align: middle; font-size: 14px; color: var(--gray-700);
    }

    /* Nombre cell (identical to Menú) */
    .nombre-cell { display: flex; align-items: center; gap: 12px; }

    .emp-icon {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }

    .emp-info { display: flex; flex-direction: column; min-width: 0; }
    .emp-name { font-weight: 600; font-size: 14px; color: var(--gray-900); }
    .emp-desc {
      font-size: 13px; color: var(--gray-500);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    /* Badge (identical to Menú) */
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 12px; font-size: 13px; font-weight: 500;
      border-radius: var(--radius-md, 8px); white-space: nowrap;
    }
    .badge::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%;
      background: currentColor;
    }

    /* Acciones (identical to Menú) */
    .acciones-cell { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }

    .btn-nueva {
      display: inline-flex; align-items: center; gap: 12px;
      padding: 8px 12px; font-size: 14px; font-weight: 500;
      font-family: 'Inter', sans-serif;
      color: white; background: var(--primary-orange, #F27920);
      border: none; border-radius: var(--radius-sm, 8px);
      cursor: pointer; transition: all 0.15s ease; white-space: nowrap;
      box-shadow: 0 1px 2px rgba(242, 121, 32, 0.2);
    }
    .btn-nueva:hover { background: var(--primary-orange-hover, #E06D1B); }
    .btn-nueva:active { background: var(--primary-orange-dark, #C45F17); }

    .btn-edit {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; font-size: 13px; font-weight: 500;
      color: var(--gray-700); background: white;
      border: 1px solid var(--slate-200); border-radius: 6px;
      cursor: pointer; transition: all 0.15s;
    }
    .btn-edit:hover { background: var(--slate-50); border-color: var(--slate-300); }

    /* Empty state (identical to Menú) */
    .empty-state-row { text-align: center; padding: 60px 16px; }
    .empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px; }
    .empty-state-title { font-size: 16px; font-weight: 600; color: var(--gray-900); }
    .empty-state-description { font-size: 14px; color: var(--gray-500); }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .action-bar { flex-direction: column; align-items: stretch; }
      .action-filters { flex-direction: column; }
      .action-right { flex-direction: column; }
      .search-input, .filter-input { min-width: unset; width: 100%; }
    }
  `],
})
export class StaffComponent {
  readonly empleados = input.required<Empleado[]>();
  readonly nuevoEmpleado = output<void>();
  readonly onVerEmpleado = output<string>();

  readonly busqueda = signal('');
  readonly filtroRol = signal('');
  readonly filtroEstado = signal('');

  readonly roles = ROLES;
  readonly estados = ESTADOS;

  readonly filteredEmpleados = computed(() => {
    const term = this.busqueda().toLowerCase().trim();
    const rol = this.filtroRol();
    const estado = this.filtroEstado();
    return this.empleados().filter(emp => {
      if (term && !emp.nombre.toLowerCase().includes(term)) return false;
      if (rol && emp.rol !== rol) return false;
      if (estado && emp.estado !== estado) return false;
      return true;
    });
  });

  getRolColor(rol: RolGastronomico): string { return ROL_COLORS[rol] ?? '#F3F4F6'; }
  getRolIcon(rol: RolGastronomico): string { return ROL_ICONS[rol] ?? '👤'; }
  getBadgeBg(estado: EstadoEmpleado): string { return ESTADO_BADGE[estado]?.bg ?? '#F3F4F6'; }
  getBadgeColor(estado: EstadoEmpleado): string { return ESTADO_BADGE[estado]?.color ?? '#6B7280'; }
}
