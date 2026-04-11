import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuditoriaFacade } from '../../state/auditoria.facade';
import { ConfiguracionSeccionComponent } from './configuracion-seccion.component';
import { ConfigModalComponent, ConfigExtraData } from './config-modal.component';
import { CategoriaConfiguracion, ConfiguracionAuditoria } from '../../models/auditoria.models';

@Component({
  selector: 'app-configuracion-page',
  standalone: true,
  imports: [CommonModule, ConfiguracionSeccionComponent, ConfigModalComponent],
  template: `
    <div class="configuracion-page">
      <!-- Header -->
      <div class="page-header">
        <button class="back-btn" (click)="volver()" title="Volver">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div class="title-section">
          <h1>Configuraciones</h1>
          <p class="subtitle">Gestiona la configuración de tu sistema gastronómico</p>
        </div>
      </div>

      @if (facade.loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Cargando configuraciones...</p>
        </div>
      } @else {
        <div class="content-grid">
          <!-- Columna izquierda -->
          <div class="left-column">
            <!-- Mesa -->
            <app-configuracion-seccion
              titulo="Mesa"
              [subtitulo]="'Gestiona las estaciones de comenzales • ' + facade.conteosConfiguracion().mesa.activas + ' de ' + facade.conteosConfiguracion().mesa.total + ' activas'"
              [configuraciones]="facade.configuracionesPorCategoria().mesa"
              [mostrarActivarTodas]="true"
              [singleColumn]="false"
              (toggleConfig)="onToggleConfig($event)"
              (activarTodas)="onActivarTodas('MESA')">
            </app-configuracion-seccion>

            <!-- Seguridad -->
            <div class="card seguridad-card">
              <div class="card-header">
                <h3>Seguridad</h3>
              </div>
              <div class="config-table-wrapper"><table class="config-table">
                <thead>
                  <tr>
                    <th>CONFIGURACIÓN</th>
                    <th>ESTADO</th>
                    <th style="text-align:right; padding-right:40px">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  @for (config of facade.configuracionesPorCategoria().seguridad; track config.id) {
                    <tr>
                      <td>
                        <div class="config-info">
                          <span class="config-nombre">{{ config.nombre }}</span>
                          @if (config.descripcion) {
                            <span class="config-descripcion">{{ config.descripcion }}</span>
                          }
                        </div>
                      </td>
                      <td>
                        <span class="estado-badge" [class.activo]="config.activo" [class.inactivo]="!config.activo">
                          {{ config.activo ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td>
                        <div class="acciones">
                          <button
                            class="btn-toggle"
                            (click)="onToggleConfig({ id: config.id, activo: !config.activo })">
                            {{ config.activo ? 'Desactivar' : 'Activar' }}
                          </button>
                          @if (config.tieneConfigExtra) {
                            <button class="btn-edit" (click)="abrirModalConfig(config)">Editar</button>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table></div>
            </div>
          </div>

          <!-- Columna derecha -->
          <div class="right-column">
            <!-- Notificaciones -->
            <div class="card notificaciones-card">
              <h3>NOTIFICACIONES</h3>
              <p>Quiero recibir notificaciones</p>
              <button class="btn-activar" [class.activo]="notificacionesActivas()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                Activar
              </button>
            </div>

            <!-- Factura -->
            <app-configuracion-seccion
              titulo="Factura"
              [subtitulo]="facade.conteosConfiguracion().factura.activas + ' de ' + facade.conteosConfiguracion().factura.total + ' activas'"
              [configuraciones]="facade.configuracionesPorCategoria().factura"
              [singleColumn]="true"
              (toggleConfig)="onToggleConfig($event)">
            </app-configuracion-seccion>

            <!-- Artículo -->
            <app-configuracion-seccion
              titulo="Articulo"
              [subtitulo]="facade.conteosConfiguracion().articulo.activas + ' de ' + facade.conteosConfiguracion().articulo.total + ' activas'"
              [configuraciones]="facade.configuracionesPorCategoria().articulo"
              [singleColumn]="true"
              (toggleConfig)="onToggleConfig($event)">
            </app-configuracion-seccion>
          </div>
        </div>

        <!-- Footer con botones -->
        <div class="page-footer">
          <button class="btn btn-primary" (click)="guardar()" [disabled]="!facade.tieneCambiosPendientes() || facade.guardando()">
            @if (facade.guardando()) {
              <div class="spinner-small"></div>
              Guardando...
            } @else {
              Guardar Cambios
            }
          </button>
        </div>
      }

      <!-- Modal de configuracion extra -->
      <app-config-modal
        [configuracion]="configSeleccionada()"
        [visible]="mostrarModal()"
        (cerrar)="cerrarModal()"
        (guardar)="guardarConfigExtra($event)">
      </app-config-modal>
    </div>
  `,
  styles: [`
    .configuracion-page {
      padding: 0;
      max-width: 1400px;
      margin: 0 auto;
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 32px;
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
    }

    .back-btn:hover { background: var(--slate-50); border-color: var(--slate-300); }

    .title-section h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-heading);
      margin: 0;
    }

    .subtitle {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 440px;
      gap: 24px;
    }

    .left-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .right-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .card {
      background: white;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: 12px;
      padding: 20px;
      box-shadow: var(--shadow-sm);
    }

    .notificaciones-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .notificaciones-card h3 {
      font-size: 12px;
      font-weight: 600;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .notificaciones-card p {
      font-size: 14px;
      color: var(--gray-700);
      margin: 0;
    }

    .btn-activar {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      font-size: 14px;
      color: var(--slate-700);
      cursor: pointer;
      transition: all 0.2s;
      width: fit-content;
    }

    .btn-activar:hover {
      background: var(--slate-50);
    }

    .btn-activar.activo {
      background: var(--primary-orange);
      border-color: var(--primary-orange);
      color: white;
    }

    .seguridad-card .card-header {
      margin-bottom: 16px;
    }

    .seguridad-card h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-heading);
      margin: 0 0 4px 0;
    }

    .seguridad-card .conteo {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .config-table-wrapper {
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      overflow: hidden;
    }

    .config-table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
    }

    .seguridad-card {
      overflow-x: auto;
    }

    .config-table thead tr { background: #F3F4F6; }

    .config-table th {
      font-size: 11px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      padding: 10px 16px;
      border-bottom: 1px solid #E5E7EB;
    }

    .config-table td {
      padding: 12px 16px;
      color: #374151;
      border-bottom: 1px solid #F3F4F6;
      vertical-align: middle;
    }

    .config-table tbody tr:last-child td { border-bottom: none; }
    .config-table tbody tr:hover { background: #FAFAFA; }

    .config-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .config-nombre {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-heading);
    }

    .config-descripcion {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .estado-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
    }

    .estado-badge::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .estado-badge.activo {
      background: var(--success-bg);
      color: var(--success-color);
      border: 1px solid var(--success-border);
    }

    .estado-badge.activo::before {
      background: var(--success-color);
    }

    .estado-badge.inactivo {
      background: var(--slate-100);
      color: var(--slate-600);
    }

    .estado-badge.inactivo::before {
      background: var(--slate-400);
    }

    .acciones {
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
      font-family: inherit;
      color: var(--gray-700);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-edit:hover { background: var(--slate-50); border-color: var(--slate-300); }

    .btn-toggle {
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-700);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-toggle:hover {
      background: var(--slate-50);
      border-color: var(--slate-300);
    }

    .btn-config {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      color: var(--slate-400);
    }

    .btn-config:hover {
      background: var(--slate-100);
      color: var(--slate-700);
    }

    .page-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
      padding-top: 24px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--slate-900);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--slate-800);
    }

    .btn-secondary {
      background: white;
      color: var(--slate-700);
      border: 1px solid var(--slate-200);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--slate-50);
    }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ConfiguracionPageComponent implements OnInit {
  private router = inject(Router);
  facade = inject(AuditoriaFacade);

  notificacionesActivas = signal(false);

  // Modal de configuracion extra
  mostrarModal = signal(false);
  configSeleccionada = signal<ConfiguracionAuditoria | null>(null);

  ngOnInit(): void {
    this.facade.cargarConfiguraciones();
  }

  volver(): void {
    this.router.navigate(['/pdv/auditoria']);
  }

  onToggleConfig(event: { id: number; activo: boolean }): void {
    this.facade.toggleConfiguracion(event.id, event.activo);
  }

  onActivarTodas(categoria: CategoriaConfiguracion): void {
    this.facade.activarTodas(categoria);
  }

  async guardar(): Promise<void> {
    const success = await this.facade.guardarConfiguraciones();
    if (success) {
      // Mostrar mensaje de éxito
      console.log('Configuraciones guardadas');
    }
  }

  cancelar(): void {
    this.facade.cancelarCambios();
  }

  // Metodos del modal
  abrirModalConfig(config: ConfiguracionAuditoria): void {
    this.configSeleccionada.set(config);
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.configSeleccionada.set(null);
  }

  guardarConfigExtra(data: ConfigExtraData): void {
    console.log('Guardando configuracion extra:', data);
    // Aqui se podria llamar a un servicio para guardar las opciones extra
    // Por ahora solo cerramos el modal
    this.cerrarModal();
  }
}
