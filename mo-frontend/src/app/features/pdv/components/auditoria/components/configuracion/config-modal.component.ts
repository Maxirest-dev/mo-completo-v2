import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionAuditoria } from '../../models/auditoria.models';

export interface OpcionConfigExtra {
  id: string;
  label: string;
  descripcion?: string;
  activo: boolean;
}

export interface ConfigExtraData {
  configuracionId: number;
  opciones: OpcionConfigExtra[];
}

@Component({
  selector: 'app-config-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (visible()) {
      <div class="modal-overlay" (click)="onOverlayClick($event)">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div class="header-info">
              <h2>{{ configuracion()?.nombre }}</h2>
              @if (configuracion()?.descripcion) {
                <p class="header-descripcion">{{ configuracion()?.descripcion }}</p>
              }
            </div>
            <button class="btn-close" (click)="onCerrar()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <div class="opciones-section">
              <h4>Opciones adicionales</h4>
              <div class="opciones-list">
                @for (opcion of opcionesLocales(); track opcion.id) {
                  <label class="opcion-item">
                    <div class="checkbox-wrapper">
                      <input
                        type="checkbox"
                        [checked]="opcion.activo"
                        (change)="toggleOpcion(opcion.id)"
                      />
                      <span class="checkmark">
                        @if (opcion.activo) {
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        }
                      </span>
                    </div>
                    <div class="opcion-info">
                      <span class="opcion-label">{{ opcion.label }}</span>
                      @if (opcion.descripcion) {
                        <span class="opcion-descripcion">{{ opcion.descripcion }}</span>
                      }
                    </div>
                  </label>
                }
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="onCerrar()">
              Cancelar
            </button>
            <button class="btn btn-primary" (click)="onGuardar()">
              Guardar
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-container {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px 24px 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .header-info h2 {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 4px 0;
    }

    .header-descripcion {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .btn-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .modal-content {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }

    .opciones-section h4 {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 16px 0;
    }

    .opciones-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .opcion-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .opcion-item:hover {
      background: #f3f4f6;
    }

    .checkbox-wrapper {
      position: relative;
      flex-shrink: 0;
    }

    .checkbox-wrapper input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkmark {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background: white;
      border: 2px solid #d1d5db;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .checkbox-wrapper input:checked ~ .checkmark {
      background: #f97316;
      border-color: #f97316;
    }

    .checkmark svg {
      color: white;
    }

    .opcion-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .opcion-label {
      font-size: 14px;
      font-weight: 500;
      color: #1a1a1a;
    }

    .opcion-descripcion {
      font-size: 13px;
      color: #6b7280;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    @media (max-width: 540px) {
      .modal-container {
        margin: 16px;
        max-height: calc(100vh - 32px);
      }
    }
  `]
})
export class ConfigModalComponent {
  // Inputs
  configuracion = input<ConfiguracionAuditoria | null>(null);
  visible = input<boolean>(false);

  // Outputs
  cerrar = output<void>();
  guardar = output<ConfigExtraData>();

  // Estado local de opciones (copia editable)
  opcionesLocales = signal<OpcionConfigExtra[]>([]);

  constructor() {
    // Efecto para inicializar opciones cuando cambia la configuracion
    effect(() => {
      const config = this.configuracion();
      if (config && this.visible()) {
        this.inicializarOpciones(config);
      }
    });
  }

  private inicializarOpciones(config: ConfiguracionAuditoria): void {
    // Por ahora creamos opciones de ejemplo basadas en la configuracion
    // En produccion estas vendrian del backend
    const opciones = this.getOpcionesParaConfiguracion(config);
    this.opcionesLocales.set(opciones);
  }

  private getOpcionesParaConfiguracion(config: ConfiguracionAuditoria): OpcionConfigExtra[] {
    // Mapeamos opciones segun el tipo de configuracion
    // Esto podria venir del backend en el futuro
    const opcionesMap: Record<string, OpcionConfigExtra[]> = {
      'Acceso con claves': [
        {
          id: 'claves_maestras',
          label: 'Permitir claves maestras',
          descripcion: 'Permite el uso de claves maestras para acceso de emergencia',
          activo: false
        },
        {
          id: 'claves_temporales',
          label: 'Permitir claves temporales',
          descripcion: 'Genera claves de acceso con tiempo de expiracion',
          activo: true
        }
      ],
      'Cierre de sesion automatico': [
        {
          id: 'tiempo_inactividad',
          label: 'Cerrar por inactividad',
          descripcion: 'Cierra la sesion despues de 15 minutos sin actividad',
          activo: true
        },
        {
          id: 'cierre_programado',
          label: 'Cierre programado',
          descripcion: 'Cierra todas las sesiones a medianoche',
          activo: false
        }
      ]
    };

    // Si existe un mapeo especifico, usarlo
    if (opcionesMap[config.nombre]) {
      return opcionesMap[config.nombre];
    }

    // Opciones por defecto para cualquier otra configuracion
    return [
      {
        id: 'opcion_1',
        label: 'Habilitar modo avanzado',
        descripcion: 'Activa opciones adicionales para usuarios expertos',
        activo: false
      },
      {
        id: 'opcion_2',
        label: 'Registrar en auditoria',
        descripcion: 'Guarda un registro detallado de esta configuracion',
        activo: true
      }
    ];
  }

  toggleOpcion(id: string): void {
    this.opcionesLocales.update(opciones =>
      opciones.map(op =>
        op.id === id ? { ...op, activo: !op.activo } : op
      )
    );
  }

  onOverlayClick(event: MouseEvent): void {
    // Solo cerrar si se hace click directamente en el overlay
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onCerrar();
    }
  }

  onCerrar(): void {
    this.cerrar.emit();
  }

  onGuardar(): void {
    const config = this.configuracion();
    if (config) {
      this.guardar.emit({
        configuracionId: config.id,
        opciones: this.opcionesLocales()
      });
    }
  }
}
