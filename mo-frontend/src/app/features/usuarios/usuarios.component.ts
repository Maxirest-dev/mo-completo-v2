import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type TabUsuario = 'todos' | 'activos' | 'directivos' | 'administradores';
type RolUsuario = 'Dueño' | 'Encargado' | 'Administrador';

interface Usuario {
  id: number;
  nombre: string;
  rol: RolUsuario;
  sucursales: number;
  apellido: string;
  dni: string;
  edad: number;
  email: string;
  telefono: string;
  activo: boolean;
}

const MOCK_USUARIOS: Usuario[] = [
  { id: 1, nombre: 'Jose Eduardo', apellido: 'Perez', dni: '30456789', edad: 42, rol: 'Dueño', sucursales: 1, email: 'jose.eduardo@maxirest.com', telefono: '+54 9 11 5551234', activo: true },
  { id: 2, nombre: 'Maria Isabel', apellido: 'Garcia', dni: '33567890', edad: 35, rol: 'Encargado', sucursales: 2, email: 'maria.garcia@maxirest.com', telefono: '+54 9 11 5552345', activo: true },
  { id: 3, nombre: 'Rodrigo', apellido: 'Calamaro', dni: '28123456', edad: 29, rol: 'Encargado', sucursales: 1, email: 'rodrigo.calamaro@maxirest.com', telefono: '+54 9 11 5553456', activo: true },
  { id: 4, nombre: 'Nicolas', apellido: 'Nuno', dni: '35678901', edad: 31, rol: 'Administrador', sucursales: 3, email: 'nicolas.nuno@maxirest.com', telefono: '+54 9 11 5554567', activo: true },
  { id: 5, nombre: 'Fiona', apellido: 'Garcia Murillo', dni: '37890123', edad: 27, rol: 'Administrador', sucursales: 1, email: 'fiona.garcia@maxirest.com', telefono: '+54 9 11 5565678', activo: false },
  { id: 6, nombre: 'Dulce', apellido: 'Maitina', dni: '34567890', edad: 33, rol: 'Encargado', sucursales: 1, email: 'dulce.maitina@maxirest.com', telefono: '+54 9 11 5567890', activo: true },
];

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
        <h1 class="page-title">Usuarios</h1>
        <p class="page-subtitle">{{ countTodos() }} usuarios registrados</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- Filter Tabs -->
        <div class="filter-tabs">
          @for (tab of tabs; track tab.key) {
            <button
              class="filter-tab"
              [class.filter-tab-active]="tabActivo() === tab.key"
              (click)="tabActivo.set(tab.key)">
              {{ tab.label }} ({{ tab.count() }})
            </button>
          }
        </div>
      </div>

      <div class="toolbar-right">
        <!-- Search -->
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="Buscar..."
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
          />
        </div>

        <!-- New User Button -->
        <button class="btn-primary" (click)="navigateToUser(0)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Usuario
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>USUARIO</th>
            <th>EMAIL</th>
            <th>TELEFONO</th>
            <th>ESTADO</th>
            <th class="th-acciones">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          @for (user of filteredUsuarios(); track user.id) {
            <tr>
              <td>
                <div class="user-cell">
                  <div class="user-avatar" [style.background]="getAvatarColor(user.rol)">
                    {{ getInitials(user.nombre) }}
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ user.nombre }} {{ user.apellido }}</span>
                    <span class="user-badge" [class]="'user-badge--' + getRolClass(user.rol)">
                      {{ user.rol }}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <div class="cell-with-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cell-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span class="cell-text">{{ user.email }}</span>
                </div>
              </td>
              <td>
                <div class="cell-with-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cell-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <span class="cell-text">{{ user.telefono }}</span>
                </div>
              </td>
              <td>
                <span class="status-badge" [class]="user.activo ? 'status-badge--active' : 'status-badge--inactive'">
                  {{ user.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <div class="acciones-cell">
                  <button class="btn-edit" (click)="navigateToUser(user.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15" height="15">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                    </svg>
                    Editar
                  </button>
                  <button class="btn-deactivate" (click)="toggleUserActive(user)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15" height="15">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                    {{ user.activo ? 'Suspender' : 'Activar' }}
                  </button>
                </div>
              </td>
            </tr>
          }
          @empty {
            <tr>
              <td colspan="5">
                <div class="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="empty-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  <p class="empty-text">No se encontraron usuarios</p>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

  `,
  styles: [`
    :host { display: block; }

    /* Header */
    .page-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 16px;
    }

    .back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md, 10px);
      border: 1px solid var(--border-color, #E2E8F0);
      background: var(--bg-primary, white);
      color: var(--slate-700, #314158);
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .back-btn:hover {
      background: var(--slate-50, #F8FAFC);
      border-color: var(--slate-300, #CBD5E1);
    }

    .page-title {
      font-size: 26px;
      font-weight: 600;
      color: var(--text-heading, #0F172B);
      margin: 0 0 4px;
      letter-spacing: -0.01em;
    }
    .page-subtitle {
      font-size: 14px;
      color: var(--text-secondary, #90A1B9);
      margin: 0;
    }

    .title-divider {
      height: 1px;
      background: var(--border-color, #E2E8F0);
      margin-bottom: 20px;
    }

    /* Toolbar */
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Filter Tabs */
    .filter-tabs {
      display: flex;
      gap: 22px;
      flex-wrap: wrap;
    }

    .filter-tab {
      padding: 11px 16px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: var(--slate-700);
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      line-height: 1.428;
    }
    .filter-tab:hover {
      border-color: var(--slate-300);
      background: var(--slate-50);
    }
    .filter-tab-active {
      color: var(--primary-orange-dark);
      border-color: var(--primary-orange-lighter);
      background: var(--primary-orange-light);
    }
    .filter-tab-active:hover {
      background: var(--primary-orange-light);
      border-color: var(--primary-orange-lighter);
    }

    /* Search — Pencil v2 buscador */
    .search-box {
      display: flex;
      align-items: center;
      background: var(--bg-primary, white);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md, 10px);
      padding: 0 12px;
      width: 256px;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .search-box:focus-within {
      border-color: var(--primary-orange, #F27920);
      box-shadow: 0 0 0 3px rgba(242, 121, 32, 0.1);
    }
    .search-icon {
      width: 18px;
      height: 18px;
      color: var(--text-secondary, #90A1B9);
      flex-shrink: 0;
    }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 10px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-primary, #314158);
      background: transparent;
      min-width: 140px;
    }
    .search-input::placeholder { color: var(--text-secondary, #90A1B9); }

    /* Primary Button — Pencil v2 */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: white;
      background: var(--primary-orange, #F27920);
      border: none;
      border-radius: var(--radius-sm, 8px);
      cursor: pointer;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .btn-primary:hover { background: var(--primary-hover, #E06A10); }

    /* Table — Pencil v2 */
    .table-card {
      background: var(--bg-primary, white);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-lg, 14px);
      overflow: hidden;
      box-shadow: var(--shadow-sm, 0 1px 1.75px -1px rgba(0, 0, 0, 0.1), 0 1px 2.625px rgba(0, 0, 0, 0.1));
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table thead {
      background: var(--slate-50, #F8FAFC);
    }
    .data-table th {
      padding: 12px 20px;
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-500, #64748B);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      border-bottom: 1px solid var(--border-color, #E2E8F0);
    }
    .th-acciones { text-align: right; }

    .data-table td {
      padding: 16px 20px;
      font-size: 14px;
      color: var(--text-primary, #314158);
      border-bottom: 1px solid var(--divider-color, #F1F5F9);
      vertical-align: middle;
    }
    .data-table tbody tr:last-child td {
      border-bottom: none;
    }
    .data-table tbody tr:hover {
      background: var(--slate-50, #F8FAFC);
    }

    /* Cell with icon prefix */
    .cell-with-icon {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cell-icon {
      width: 16px;
      height: 16px;
      color: var(--text-secondary, #90A1B9);
      flex-shrink: 0;
    }
    .cell-text {
      font-size: 14px;
      color: var(--text-primary, #314158);
    }

    /* User Cell */
    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      color: white;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-heading, #0F172B);
    }

    .user-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
      border-radius: var(--radius-sm, 8px);
      width: fit-content;
    }
    .user-badge--red {
      background: var(--danger-bg, #FEF2F2);
      color: var(--danger-text, #DC2626);
      border: 1px solid var(--danger-border, #FECACA);
    }
    .user-badge--orange {
      background: var(--primary-orange-light, #FFF7ED);
      color: var(--primary-orange, #F27920);
      border: 1px solid var(--primary-orange-lighter, #FFD6A7);
    }
    .user-badge--blue {
      background: var(--info-bg, #EFF6FF);
      color: var(--info-text, #1E40AF);
      border: 1px solid var(--info-border, #BFDBFE);
    }

    /* Status Badge — Pencil v2 */
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      border-radius: var(--radius-sm, 8px);
      white-space: nowrap;
    }
    .status-badge--active {
      background: var(--success-bg, #ECFDF5);
      color: var(--success-text, #00A43D);
      border: 1px solid var(--success-border, #A4F4CF);
    }
    .status-badge--inactive {
      background: var(--inactive-bg, #F1F5F9);
      color: var(--inactive-text, #45556C);
      border: 1px solid var(--inactive-border, #E2E8F0);
    }

    /* Actions */
    .acciones-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
    }

    .btn-edit {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-700);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
    }
    .btn-edit:hover { background: var(--slate-50); border-color: var(--slate-300); }

    .btn-deactivate {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      color: #DC2626;
      background: #FFFFFF;
      border: 1px solid #FECACA;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
      font-family: inherit;
      white-space: nowrap;
    }
    .btn-deactivate:hover { background: #FEF2F2; }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 48px 24px;
      text-align: center;
    }
    .empty-icon {
      width: 40px;
      height: 40px;
      color: var(--slate-300, #CBD5E1);
    }
    .empty-text {
      font-size: 14px;
      color: var(--text-secondary, #90A1B9);
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .toolbar {
        flex-direction: column;
        align-items: flex-start;
      }
      .toolbar-right {
        width: 100%;
        flex-wrap: wrap;
      }
      .search-box {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .page-title { font-size: 22px; }
      .filter-tabs { flex-wrap: wrap; gap: 10px; }
      .table-card { overflow-x: auto; }
      .data-table { min-width: 750px; }
      .btn-deactivate { display: none; }
    }
  `],
})
export class UsuariosComponent {
  private readonly router = inject(Router);

  readonly usuarios = signal<Usuario[]>(MOCK_USUARIOS);
  readonly tabActivo = signal<TabUsuario>('todos');
  readonly searchTerm = signal('');


  readonly countTodos = computed(() => this.usuarios().length);
  readonly countActivos = computed(() => this.usuarios().filter(u => u.activo).length);
  readonly countDirectivos = computed(() => this.usuarios().filter(u => u.rol === 'Dueño').length);
  readonly countAdministradores = computed(() => this.usuarios().filter(u => u.rol === 'Administrador').length);

  readonly tabs = [
    { key: 'todos' as TabUsuario, label: 'Todos', count: this.countTodos },
    { key: 'activos' as TabUsuario, label: 'Activos', count: this.countActivos },
    { key: 'directivos' as TabUsuario, label: 'Directivos', count: this.countDirectivos },
    { key: 'administradores' as TabUsuario, label: 'Administradores', count: this.countAdministradores },
  ];

  readonly filteredUsuarios = computed(() => {
    let list = this.usuarios();
    const tab = this.tabActivo();
    const search = this.searchTerm().toLowerCase().trim();

    switch (tab) {
      case 'activos':
        list = list.filter(u => u.activo);
        break;
      case 'directivos':
        list = list.filter(u => u.rol === 'Dueño');
        break;
      case 'administradores':
        list = list.filter(u => u.rol === 'Administrador');
        break;
    }

    if (search) {
      list = list.filter(u =>
        (u.nombre + ' ' + u.apellido).toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.rol.toLowerCase().includes(search)
      );
    }

    return list;
  });

  goBack(): void {
    this.router.navigate(['/home']);
  }

  getInitials(nombre: string): string {
    const parts = nombre.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  getAvatarColor(rol: RolUsuario): string {
    switch (rol) {
      case 'Dueño': return '#EF4444';
      case 'Encargado': return '#F97316';
      case 'Administrador': return '#3B82F6';
    }
  }

  getRolClass(rol: RolUsuario): string {
    switch (rol) {
      case 'Dueño': return 'red';
      case 'Encargado': return 'orange';
      case 'Administrador': return 'blue';
    }
  }

  toggleUserActive(user: Usuario): void {
    this.usuarios.update(list =>
      list.map(u => u.id === user.id ? { ...u, activo: !u.activo } : u)
    );
  }

  navigateToUser(id: number): void {
    this.router.navigate(['/usuarios', id]);
  }
}
