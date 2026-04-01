import {
  Component, ChangeDetectionStrategy, signal, inject, OnInit, Input, computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type RolUsuario = 'Dueño' | 'Encargado' | 'Administrador';

interface UsuarioPerfil {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  edad: number;
  rol: RolUsuario;
  email: string;
  telefono: string;
  dispositivos: { id: number; nombre: string; tipo: string; activo: boolean }[];
  puntosVenta: { id: number; nombre: string; sucursal: string; activo: boolean }[];
}

const MOCK_USUARIOS: Record<number, UsuarioPerfil> = {
  1: { id: 1, nombre: 'Jose Eduardo', apellido: 'Perez', dni: '30456789', edad: 42, rol: 'Dueño', email: 'jose.eduardo@maxirest.com', telefono: '+54 9 11 5551234',
    dispositivos: [{ id: 1, nombre: 'Tablet', tipo: 'Android', activo: true }, { id: 2, nombre: 'PC', tipo: 'Desktop', activo: true }, { id: 3, nombre: 'Movil', tipo: 'iOS', activo: false }],
    puntosVenta: [{ id: 1, nombre: 'Gastro Tapas SRL', sucursal: 'Av. Callao 1672', activo: true }, { id: 2, nombre: 'Sucursal Palermo', sucursal: 'Av. Santa Fe 3800', activo: true }] },
  2: { id: 2, nombre: 'Maria Isabel', apellido: 'Garcia', dni: '33567890', edad: 35, rol: 'Encargado', email: 'maria.garcia@maxirest.com', telefono: '+54 9 11 5552345',
    dispositivos: [{ id: 1, nombre: 'Tablet', tipo: 'Android', activo: true }],
    puntosVenta: [{ id: 1, nombre: 'Gastro Tapas SRL', sucursal: 'Av. Callao 1672', activo: true }] },
  3: { id: 3, nombre: 'Rodrigo', apellido: 'Calamaro', dni: '28123456', edad: 29, rol: 'Encargado', email: 'rodrigo.calamaro@maxirest.com', telefono: '+54 9 11 5553456',
    dispositivos: [{ id: 1, nombre: 'Movil', tipo: 'iOS', activo: true }],
    puntosVenta: [{ id: 1, nombre: 'Gastro Tapas SRL', sucursal: 'Av. Callao 1672', activo: true }] },
  4: { id: 4, nombre: 'Nicolas', apellido: 'Nuno', dni: '35678901', edad: 31, rol: 'Administrador', email: 'nicolas.nuno@maxirest.com', telefono: '+54 9 11 5554567',
    dispositivos: [{ id: 1, nombre: 'PC', tipo: 'Desktop', activo: true }, { id: 2, nombre: 'Tablet', tipo: 'Android', activo: true }],
    puntosVenta: [{ id: 1, nombre: 'Gastro Tapas SRL', sucursal: 'Av. Callao 1672', activo: true }, { id: 2, nombre: 'Sucursal Palermo', sucursal: 'Av. Santa Fe 3800', activo: true }, { id: 3, nombre: 'Sucursal Recoleta', sucursal: 'Av. Alvear 1200', activo: false }] },
  5: { id: 5, nombre: 'Fiona', apellido: 'Garcia Murillo', dni: '37890123', edad: 27, rol: 'Administrador', email: 'fiona.garcia@maxirest.com', telefono: '+54 9 11 5565678',
    dispositivos: [{ id: 1, nombre: 'Movil', tipo: 'Android', activo: true }],
    puntosVenta: [{ id: 1, nombre: 'Gastro Tapas SRL', sucursal: 'Av. Callao 1672', activo: true }] },
  6: { id: 6, nombre: 'Dulce', apellido: 'Maitina', dni: '34567890', edad: 33, rol: 'Encargado', email: 'dulce.maitina@maxirest.com', telefono: '+54 9 11 5567890',
    dispositivos: [{ id: 1, nombre: 'Tablet', tipo: 'iOS', activo: true }],
    puntosVenta: [{ id: 1, nombre: 'Gastro Tapas SRL', sucursal: 'Av. Callao 1672', activo: true }] },
};

@Component({
  selector: 'app-usuario-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Header -->
    <div class="page-header">
      <button class="back-btn" (click)="goBack()">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>
      <div>
        <h1 class="page-title">{{ usuario()?.id === 0 ? 'Nuevo usuario' : 'Usuario' }}</h1>
        <p class="page-subtitle">{{ usuario()?.id === 0 ? 'Completa los datos del nuevo usuario' : 'Administra la informacion del usuario' }}</p>
      </div>
    </div>
    <div class="title-divider"></div>

    @if (usuario()) {
      <div class="perfil-layout">
        <!-- Left: Avatar -->
        <div class="avatar-section">
          <div class="avatar-card">
            <span class="perfil-role-badge">{{ usuario()!.rol }}</span>
            <div class="avatar-circle" [style.background]="getAvatarColor(usuario()!.rol)">
              {{ usuario()!.nombre[0] }}{{ usuario()!.apellido[0] }}
            </div>
            <span class="avatar-name">{{ usuario()!.nombre }} {{ usuario()!.apellido }}</span>
          </div>
        </div>

        <!-- Right: Data -->
        <div class="data-section">
          <div class="data-card">
            <div class="card-header-row">
              <h3 class="card-section-title">Datos personales</h3>
              <button class="btn-edit-sm" (click)="toggleEdit()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
            <div class="fields-grid">
              <div class="field">
                <label class="field-label">Nombre</label>
                @if (editing()) {
                  <input class="field-input" [(ngModel)]="editNombre" />
                } @else {
                  <span class="field-value">{{ usuario()!.nombre }}</span>
                }
              </div>
              <div class="field">
                <label class="field-label">Apellido</label>
                @if (editing()) {
                  <input class="field-input" [(ngModel)]="editApellido" />
                } @else {
                  <span class="field-value">{{ usuario()!.apellido }}</span>
                }
              </div>
              <div class="field">
                <label class="field-label">DNI / Empresa</label>
                @if (editing()) {
                  <input class="field-input" [(ngModel)]="editDni" />
                } @else {
                  <span class="field-value">{{ usuario()!.dni }}</span>
                }
              </div>
              <div class="field">
                <label class="field-label">Edad</label>
                @if (editing()) {
                  <input class="field-input" type="number" [(ngModel)]="editEdad" />
                } @else {
                  <span class="field-value">{{ usuario()!.edad }}</span>
                }
              </div>
            </div>

            <h3 class="card-section-title section-title-mt">Datos de contacto</h3>
            <div class="fields-grid">
              <div class="field">
                <label class="field-label">Telefono</label>
                @if (editing()) {
                  <input class="field-input" [(ngModel)]="editTelefono" />
                } @else {
                  <span class="field-value">{{ usuario()!.telefono }}</span>
                }
              </div>
              <div class="field">
                <label class="field-label">Email</label>
                @if (editing()) {
                  <input class="field-input" [(ngModel)]="editEmail" />
                } @else {
                  <span class="field-value">{{ usuario()!.email }}</span>
                }
              </div>
            </div>

            @if (editing()) {
              <div class="edit-actions">
                <button class="btn-cancel" (click)="cancelEdit()">Cancelar</button>
                <button class="btn-save" (click)="saveEdit()">Guardar cambios</button>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Bottom: Dispositivos + Puntos de Venta -->
      <div class="bottom-grid">
        <!-- Dispositivos -->
        <div class="bottom-card">
          <div class="card-header-row">
            <div>
              <h3 class="card-section-title">Dispositivos</h3>
              <p class="card-section-sub">Dispositivos vinculados al usuario</p>
            </div>
          </div>
          <div class="items-list">
            @for (disp of usuario()!.dispositivos; track disp.id) {
              <div class="item-row">
                <div class="item-icon" [style.background]="disp.activo ? '#D1FAE5' : 'var(--slate-100)'">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" [attr.stroke]="disp.activo ? '#059669' : '#90A1B9'" width="18" height="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <div class="item-info">
                  <span class="item-name">{{ disp.nombre }}</span>
                  <span class="item-sub">{{ disp.tipo }}</span>
                </div>
                <span class="item-badge" [class.badge-active]="disp.activo" [class.badge-inactive]="!disp.activo">{{ disp.activo ? 'Activo' : 'Inactivo' }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Puntos de Venta -->
        <div class="bottom-card">
          <div class="card-header-row">
            <div>
              <h3 class="card-section-title">Puntos de venta</h3>
              <p class="card-section-sub">Puntos de venta asignados al usuario</p>
            </div>
          </div>
          <div class="items-list">
            @for (pdv of usuario()!.puntosVenta; track pdv.id) {
              <div class="item-row">
                <div class="item-icon" style="background: #DBEAFE;">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#3B82F6" width="18" height="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                  </svg>
                </div>
                <div class="item-info">
                  <span class="item-name">{{ pdv.nombre }}</span>
                  <span class="item-sub">{{ pdv.sucursal }}</span>
                </div>
                <span class="item-badge" [class.badge-active]="pdv.activo" [class.badge-inactive]="!pdv.activo">{{ pdv.activo ? 'Activo' : 'Inactivo' }}</span>
              </div>
            }
            <button class="btn-agregar-item">+ Agregar</button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="perfil-footer">
        <button class="btn-cancel" (click)="goBack()">Volver al listado</button>
        <button class="btn-save" (click)="goBack()">Guardar cambios</button>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .page-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
    .back-btn {
      display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;
      border-radius: var(--radius-md); border: 1px solid var(--slate-200); background: white; color: var(--slate-700);
      cursor: pointer; transition: all 0.15s; flex-shrink: 0; margin-top: 2px;
    }
    .back-btn:hover { background: var(--slate-50); border-color: var(--slate-300); }
    .page-title { font-size: 26px; font-weight: 600; color: var(--slate-900); margin: 0 0 4px; }
    .page-subtitle { font-size: 14px; color: var(--slate-400); margin: 0; }
    .title-divider {
      height: 1px;
      background: var(--slate-200);
      margin-bottom: 24px;
    }

    /* Layout */
    .perfil-layout { display: grid; grid-template-columns: 220px 1fr; gap: 24px; margin-bottom: 24px; }

    /* Avatar */
    .avatar-card {
      background: white; border: 1px solid var(--slate-200); border-radius: var(--radius-lg);
      padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 12px;
      box-shadow: var(--shadow-sm);
    }
    .perfil-role-badge {
      font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: var(--radius-sm);
      background: var(--slate-100); color: var(--slate-700); text-transform: uppercase; letter-spacing: 0.03em;
      border: 1px solid var(--slate-200);
    }
    .avatar-circle {
      width: 100px; height: 100px; border-radius: 50%; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 32px; font-weight: 600; border: 3px solid var(--slate-200);
      background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
    }
    .avatar-name { font-size: 16px; font-weight: 600; color: var(--slate-800); text-align: center; }

    /* Data card */
    .data-card {
      background: white; border: 1px solid var(--slate-200); border-radius: var(--radius-lg); padding: 24px;
      box-shadow: var(--shadow-sm);
    }
    .card-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .card-section-title { font-size: 14px; font-weight: 700; color: var(--slate-800); margin: 0; text-transform: uppercase; letter-spacing: 0.03em; }
    .section-title-mt { margin-top: 24px; margin-bottom: 16px; }
    .card-section-sub { font-size: 12px; color: var(--slate-400); margin: 4px 0 0; }
    .btn-edit-sm {
      display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;
      background: transparent; border: none; color: var(--slate-400); cursor: pointer; border-radius: var(--radius-sm);
    }
    .btn-edit-sm:hover { color: var(--slate-500); background: var(--slate-100); }

    .fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 4px; }
    .field-label { font-size: 12px; font-weight: 600; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.03em; }
    .field-value { font-size: 14px; font-weight: 500; color: var(--slate-800); padding: 8px 0; }
    .field-input {
      padding: 8px 12px; font-size: 14px; font-family: inherit; color: var(--slate-700);
      background: white; border: 1px solid var(--slate-200); border-radius: var(--radius-md); transition: all 0.15s;
    }
    .field-input:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(242, 121, 32, 0.1); }

    .edit-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--slate-100); }

    /* Bottom grid */
    .bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    .bottom-card {
      background: white; border: 1px solid var(--slate-200); border-radius: var(--radius-lg); padding: 24px;
      box-shadow: var(--shadow-sm);
    }
    .items-list { display: flex; flex-direction: column; gap: 0; }
    .item-row {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 0; border-bottom: 1px solid var(--slate-100);
    }
    .item-row:last-of-type { border-bottom: none; }
    .item-icon {
      width: 36px; height: 36px; border-radius: var(--radius-sm);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .item-info { display: flex; flex-direction: column; flex: 1; }
    .item-name { font-size: 14px; font-weight: 500; color: var(--slate-800); }
    .item-sub { font-size: 12px; color: var(--slate-400); }
    .item-badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-sm); }
    .badge-active { background: var(--success-bg); color: var(--success-text); border: 1px solid var(--success-border); }
    .badge-inactive { background: var(--inactive-bg); color: var(--inactive-text); border: 1px solid var(--inactive-border); }
    .btn-agregar-item {
      padding: 10px; margin-top: 8px; font-size: 13px; font-weight: 500; font-family: inherit;
      color: var(--slate-400); background: none; border: 1px dashed var(--slate-200); border-radius: var(--radius-sm);
      cursor: pointer; transition: all 0.15s;
    }
    .btn-agregar-item:hover { color: var(--primary-orange); border-color: var(--primary-orange); }

    /* Footer */
    .perfil-footer { display: flex; justify-content: flex-end; gap: 12px; }
    .btn-cancel {
      padding: 8px 12px; font-size: 14px; font-weight: 500; font-family: inherit;
      color: var(--slate-700); background: white; border: 1px solid var(--slate-200);
      border-radius: var(--radius-sm); cursor: pointer;
    }
    .btn-cancel:hover { background: var(--slate-50); }
    .btn-save {
      padding: 8px 12px; font-size: 14px; font-weight: 500; font-family: inherit;
      color: white; background: var(--primary-orange); border: none;
      border-radius: var(--radius-sm); cursor: pointer;
    }
    .btn-save:hover { background: var(--primary-orange-hover); }

    @media (max-width: 768px) {
      .perfil-layout { grid-template-columns: 1fr; }
      .bottom-grid { grid-template-columns: 1fr; }
      .fields-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class UsuarioPerfilComponent implements OnInit {
  @Input() id!: string;
  private readonly router = inject(Router);

  usuario = signal<UsuarioPerfil | null>(null);
  editing = signal(false);
  editNombre = '';
  editApellido = '';
  editDni = '';
  editEdad = 0;
  editTelefono = '';
  editEmail = '';

  ngOnInit(): void {
    const numId = Number(this.id);
    const data = MOCK_USUARIOS[numId] ?? null;
    if (data) {
      this.usuario.set(data);
    } else {
      // Nuevo usuario
      this.usuario.set({
        id: 0, nombre: '', apellido: '', dni: '', edad: 0, rol: 'Encargado',
        email: '', telefono: '', dispositivos: [], puntosVenta: [],
      });
      this.editNombre = ''; this.editApellido = ''; this.editDni = '';
      this.editEdad = 0; this.editTelefono = ''; this.editEmail = '';
      this.editing.set(true);
    }
  }

  goBack(): void { this.router.navigate(['/usuarios']); }

  getAvatarColor(rol: RolUsuario): string {
    switch (rol) { case 'Dueño': return 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'; case 'Encargado': return 'linear-gradient(135deg, #F27920 0%, #E06A10 100%)'; case 'Administrador': return 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'; }
  }

  toggleEdit(): void {
    const u = this.usuario();
    if (!u) return;
    this.editNombre = u.nombre; this.editApellido = u.apellido;
    this.editDni = u.dni; this.editEdad = u.edad;
    this.editTelefono = u.telefono; this.editEmail = u.email;
    this.editing.set(true);
  }

  cancelEdit(): void { this.editing.set(false); }

  saveEdit(): void {
    const u = this.usuario();
    if (!u) return;
    this.usuario.set({ ...u, nombre: this.editNombre, apellido: this.editApellido, dni: this.editDni, edad: this.editEdad, telefono: this.editTelefono, email: this.editEmail });
    this.editing.set(false);
  }
}
