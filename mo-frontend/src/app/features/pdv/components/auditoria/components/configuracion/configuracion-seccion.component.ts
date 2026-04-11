import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionAuditoria } from '../../models/auditoria.models';

@Component({
  selector: 'app-configuracion-seccion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="seccion-card">
      <div class="seccion-header">
        <div class="seccion-info">
          <h3>{{ titulo() }}</h3>
          <span class="subtitulo">{{ subtitulo() }}</span>
        </div>
        @if (mostrarActivarTodas()) {
          <button class="btn-activar-todas" (click)="activarTodas.emit()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Activar todas
          </button>
        }
      </div>

      <div class="config-grid" [class.config-grid--single]="singleColumn()">
        @if (singleColumn()) {
          <!-- Columna unica -->
          <div class="config-column">
            <div class="config-table-wrapper"><table class="config-table">
              <thead>
                <tr>
                  <th>CONFIGURACIÓN</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                @for (config of configuraciones(); track config.id) {
                  <tr>
                    <td>{{ config.nombre }}</td>
                    <td>
                      <span class="estado-badge" [class.activo]="config.activo" [class.inactivo]="!config.activo">
                        {{ config.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>
                      <button
                        class="btn-toggle"
                        (click)="toggleConfig.emit({ id: config.id, activo: !config.activo })">
                        {{ config.activo ? 'Desactivar' : 'Activar' }}
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table></div>
          </div>
        } @else {
          <!-- Columna 1 -->
          <div class="config-column">
            <div class="config-table-wrapper"><table class="config-table">
              <thead>
                <tr>
                  <th>CONFIGURACIÓN</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                @for (config of primeraColumna(); track config.id) {
                  <tr>
                    <td>{{ config.nombre }}</td>
                    <td>
                      <span class="estado-badge" [class.activo]="config.activo" [class.inactivo]="!config.activo">
                        {{ config.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>
                      <button
                        class="btn-toggle"
                        (click)="toggleConfig.emit({ id: config.id, activo: !config.activo })">
                        {{ config.activo ? 'Desactivar' : 'Activar' }}
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table></div>
          </div>

          <!-- Columna 2 -->
          @if (segundaColumna().length > 0) {
            <div class="config-column">
              <div class="config-table-wrapper"><table class="config-table">
                <thead>
                  <tr>
                    <th>CONFIGURACIÓN</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  @for (config of segundaColumna(); track config.id) {
                    <tr>
                      <td>{{ config.nombre }}</td>
                      <td>
                        <span class="estado-badge" [class.activo]="config.activo" [class.inactivo]="!config.activo">
                          {{ config.activo ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td>
                        <button
                          class="btn-toggle"
                          (click)="toggleConfig.emit({ id: config.id, activo: !config.activo })">
                          {{ config.activo ? 'Desactivar' : 'Activar' }}
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table></div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .seccion-card {
      background: white;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: 12px;
      padding: 20px;
      box-shadow: var(--shadow-sm);
    }

    .seccion-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .seccion-info h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-heading);
      margin: 0 0 4px 0;
    }

    .subtitulo {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .btn-activar-todas {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: white;
      background: var(--primary-orange);
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      box-shadow: 0 1px 2px rgba(242, 121, 32, 0.2);
    }

    .btn-activar-todas:hover {
      background: var(--primary-orange-hover);
    }

    .config-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .config-grid--single {
      grid-template-columns: 1fr;
    }

    .config-column {
      min-width: 0;
    }

    :host { display: block; }

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

    .config-table thead tr { background: #F3F4F6; }

    .config-table th {
      font-size: 11px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      padding: 10px 16px;
      border-bottom: 1px solid var(--slate-200);
    }

    .config-table td {
      padding: 12px 16px;
      color: #374151;
      border-bottom: 1px solid #F3F4F6;
    }

    .config-table tbody tr:last-child td { border-bottom: none; }
    .config-table tbody tr:hover { background: #FAFAFA; }

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

    @media (max-width: 768px) {
      .config-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ConfiguracionSeccionComponent {
  titulo = input.required<string>();
  subtitulo = input<string>('');
  configuraciones = input.required<ConfiguracionAuditoria[]>();
  mostrarActivarTodas = input<boolean>(false);
  singleColumn = input<boolean>(false);

  toggleConfig = output<{ id: number; activo: boolean }>();
  activarTodas = output<void>();

  primeraColumna(): ConfiguracionAuditoria[] {
    const configs = this.configuraciones();
    const mitad = Math.ceil(configs.length / 2);
    return configs.slice(0, mitad);
  }

  segundaColumna(): ConfiguracionAuditoria[] {
    const configs = this.configuraciones();
    const mitad = Math.ceil(configs.length / 2);
    return configs.slice(mitad);
  }
}
