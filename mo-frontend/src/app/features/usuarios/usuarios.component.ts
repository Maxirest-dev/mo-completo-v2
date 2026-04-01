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
        <p class="page-subtitle">Administrar el ingreso de tu restaurante</p>
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
              [class.filter-tab--active]="tabActivo() === tab.key"
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
            placeholder="Buscar usuario..."
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
          />
        </div>

        <!-- New User Button -->
        <button class="btn-primary" (click)="navigateToUser(0)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo usuario
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>USUARIO</th>
            <th>SUCURSALES</th>
            <th>EMAIL</th>
            <th>TELEFONO</th>
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
                <span class="cell-text">{{ user.sucursales }}</span>
              </td>
              <td>
                <span class="cell-text">{{ user.email }}</span>
              </td>
              <td>
                <span class="cell-text">{{ user.telefono }}</span>
              </td>
              <td>
                <div class="actions-cell">
                  <button class="btn-action" (click)="navigateToUser(user.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15" height="15">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                    </svg>
                    Editar
                  </button>
                  <button class="btn-action btn-action--secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15" height="15">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                    Modificar permisos
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

    /* Filter Tabs - pill style like inventario/produccion */
    .filter-tabs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 9px 18px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: #6B7280;
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .filter-tab:hover {
      border-color: #D1D5DB;
      background: #F9FAFB;
    }
    .filter-tab--active {
      color: #F97316;
      border-color: #F97316;
      background: #FFF7ED;
    }
    .filter-tab--active:hover {
      background: #FFF7ED;
      border-color: #F97316;
    }

    .filter-tab-count {
      font-size: 13px;
      font-weight: 500;
    }
    .filter-tab-count--active {
      color: #F97316;
    }

    /* Search - same style as inventario/produccion */
    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 0 12px;
      min-width: 220px;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .search-box:focus-within {
      border-color: #F97316;
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }
    .search-icon {
      width: 18px;
      height: 18px;
      color: #9CA3AF;
      flex-shrink: 0;
    }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 10px;
      font-size: 14px;
      font-family: inherit;
      color: #374151;
      background: transparent;
      min-width: 140px;
    }
    .search-input::placeholder { color: #9CA3AF; }

    /* Primary Button */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 18px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: white;
      background: #F97316;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .btn-primary:hover { background: #EA580C; }

    /* Table */
    .table-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table thead {
      background: #F3F4F6;
    }
    .data-table th {
      padding: 12px 20px;
      font-size: 11px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      border-bottom: 1px solid #E5E7EB;
    }
    .th-acciones { text-align: right; }

    .data-table td {
      padding: 16px 20px;
      font-size: 14px;
      color: #374151;
      border-bottom: 1px solid #F3F4F6;
      vertical-align: middle;
    }
    .data-table tbody tr:last-child td {
      border-bottom: none;
    }
    .data-table tbody tr:hover {
      background: #FAFAFA;
    }

    .cell-text {
      font-size: 14px;
      color: #374151;
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
      color: #111827;
    }

    .user-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9999px;
      width: fit-content;
    }
    .user-badge--red {
      background: #FEF2F2;
      color: #DC2626;
      border: 1px solid #FECACA;
    }
    .user-badge--orange {
      background: #FFF7ED;
      color: #EA580C;
      border: 1px solid #FED7AA;
    }
    .user-badge--blue {
      background: #EFF6FF;
      color: #2563EB;
      border: 1px solid #BFDBFE;
    }

    /* Actions */
    .actions-cell {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 7px 14px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      color: #374151;
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .btn-action:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
    }
    .btn-action--secondary {
      color: #6B7280;
    }

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
      color: #D1D5DB;
    }
    .empty-text {
      font-size: 14px;
      color: #9CA3AF;
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
      .search-input {
        width: 100%;
        min-width: 160px;
      }
    }

    /* Dialog */
    .dialog-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px;
    }
    .dialog-container {
      background: white; border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;
    }
    .dialog-header { padding: 28px 28px 0; }
    .dialog-title { font-size: 22px; font-weight: 600; color: #1F2937; margin: 0 0 6px; }
    .dialog-subtitle { font-size: 14px; color: #6B7280; margin: 0; }
    .dialog-body { padding: 24px 28px; }
    .dialog-avatar-section {
      display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
      padding-bottom: 20px; border-bottom: 1px solid #F3F4F6;
    }
    .dialog-avatar {
      width: 56px; height: 56px; border-radius: 50%; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 600; flex-shrink: 0;
    }
    .dialog-avatar-name { font-size: 18px; font-weight: 600; color: #1F2937; }
    .dialog-section-title {
      font-size: 12px; font-weight: 600; color: #9CA3AF; text-transform: uppercase;
      letter-spacing: 0.04em; margin: 20px 0 12px;
    }
    .dialog-section-title:first-of-type { margin-top: 0; }
    .dialog-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px; }
    .dialog-field { display: flex; flex-direction: column; gap: 4px; }
    .dialog-label { font-size: 13px; font-weight: 600; color: #374151; }
    .dialog-input {
      width: 100%; padding: 10px 12px; font-size: 14px; font-family: inherit;
      color: #374151; background: white; border: 1px solid #E5E7EB;
      border-radius: 8px; transition: all 0.15s;
    }
    .dialog-input:focus { outline: none; border-color: #F97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
    .dialog-actions {
      display: flex; justify-content: flex-end; gap: 12px; padding: 0 28px 28px;
    }
    .btn-secondary {
      padding: 10px 20px; font-size: 14px; font-weight: 500; font-family: inherit;
      color: #374151; background: white; border: 1px solid #E5E7EB;
      border-radius: 10px; cursor: pointer; transition: all 0.15s;
    }
    .btn-secondary:hover { background: #F9FAFB; }
    .btn-dark {
      padding: 10px 20px; font-size: 14px; font-weight: 500; font-family: inherit;
      color: white; background: #1F2937; border: none;
      border-radius: 10px; cursor: pointer; transition: all 0.15s;
    }
    .btn-dark:hover { background: #374151; }
    .btn-dark:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 768px) {
      .page-title { font-size: 22px; }
      .filter-tabs { flex-wrap: wrap; }
      .table-card { overflow-x: auto; }
      .data-table { min-width: 700px; }
      .btn-action--secondary { display: none; }
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

  navigateToUser(id: number): void {
    this.router.navigate(['/usuarios', id]);
  }
}
