import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ConfigEstacion,
  ConfigFormaCobro,
  ConfigCategoria,
  ConfigDispositivo,
  ConfigTurno,
} from '../../models';
import {
  MOCK_ESTACIONES,
  MOCK_FORMAS_COBRO_CONFIG,
  MOCK_CATEGORIAS,
  MOCK_DISPOSITIVOS,
  MOCK_TURNOS,
} from '../../data/mock-pdv.data';

@Component({
  selector: 'app-configuraciones',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Header -->
    <div class="config-header">
      <button class="back-btn" (click)="goBack()" title="Volver">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>
      <div class="config-header-info">
        <div class="config-header-title-row">
          <h1 class="text-title">Configuraciones</h1>
        </div>
        <p class="text-subtitle">Administrar estaciones, formas de cobro, categorias, dispositivos y turnos</p>
      </div>
    </div>

    <!-- Grid Layout -->
    <div class="config-grid">
      <!-- Estaciones de Trabajo -->
      <div class="config-section">
        <div class="section-header">
          <h3 class="section-title">Estaciones de Trabajo</h3>
          <button class="btn btn-sm btn-outline-orange" (click)="editingId.set(null); newEstacionNombre.set(''); newEstacionTipo.set('Cocina'); showEstacionDialog.set(true)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Agregar
          </button>
        </div>
        <table class="data-table">
          <thead><tr><th>NOMBRE</th><th>TIPO</th><th>ESTADO</th><th class="th-acciones">ACCIONES</th></tr></thead>
          <tbody>
            @for (est of estaciones(); track est.id) {
              <tr>
                <td class="cell-name">{{ est.nombre }}</td>
                <td><span class="badge-tipo">{{ est.tipo }}</span></td>
                <td><span class="badge-estado" [class.badge-activo]="est.activo" [class.badge-inactivo]="!est.activo">{{ est.activo ? 'Activo' : 'Inactivo' }}</span></td>
                <td class="td-acciones">
                  <div class="acciones-cell">
                    <button class="btn-edit" (click)="editEstacion(est)">Editar</button>
                    <button class="btn-deactivate" (click)="toggleEstacion(est.id)">{{ est.activo ? 'Desactivar' : 'Activar' }}</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Formas de Cobro -->
      <div class="config-section">
        <div class="section-header">
          <h3 class="section-title">Formas de Cobro</h3>
          <span class="section-subtitle-sm">{{ formasCobro().filter(f => f.activo).length }} activas de {{ formasCobro().length }}</span>
        </div>
        <div class="cobro-cta-grid">
          <button class="cobro-cta" (click)="openCobroCategoria('Medios electronicos')">
            <span class="cobro-cta-icon" style="background: #DBEAFE;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#3B82F6" width="24" height="24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </span>
            <span class="cobro-cta-label">Medios electronicos</span>
            <span class="cobro-cta-count">{{ getCobroCount('Medios electronicos') }}</span>
          </button>
          <button class="cobro-cta" (click)="openCobroCategoria('Tarjeta debito')">
            <span class="cobro-cta-icon" style="background: #FEF3C7;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#F59E0B" width="24" height="24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
            </span>
            <span class="cobro-cta-label">Tarjeta debito</span>
            <span class="cobro-cta-count">{{ getCobroCount('Tarjeta debito') }}</span>
          </button>
          <button class="cobro-cta" (click)="openCobroCategoria('Tarjeta credito')">
            <span class="cobro-cta-icon" style="background: #EDE9FE;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#8B5CF6" width="24" height="24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
            </span>
            <span class="cobro-cta-label">Tarjeta credito</span>
            <span class="cobro-cta-count">{{ getCobroCount('Tarjeta credito') }}</span>
          </button>
          <button class="cobro-cta" (click)="openCobroCategoria('Otros')">
            <span class="cobro-cta-icon" style="background: #F3F4F6;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#6B7280" width="24" height="24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
            <span class="cobro-cta-label">Otros</span>
            <span class="cobro-cta-count">{{ getCobroCount('Otros') }}</span>
          </button>
        </div>
      </div>

      <!-- Categorias de Venta -->
      <div class="config-section">
        <div class="section-header">
          <h3 class="section-title">Canales de Venta</h3>
          <button class="btn btn-sm btn-outline-orange" (click)="editingId.set(null); newCategoriaNombre.set(''); newCategoriaTipo.set('Salon'); newCategoriaDispositivos.set([]); showCategoriaDialog.set(true)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Agregar
          </button>
        </div>
        <table class="data-table">
          <thead><tr><th>NOMBRE</th><th>TIPO</th><th>ESTADO</th><th class="th-acciones">ACCIONES</th></tr></thead>
          <tbody>
            @for (cat of categorias(); track cat.id) {
              <tr>
                <td>
                  <div class="cell-with-icon">
                    <span class="cell-icon" [style.background]="getCanalIconColor(cat.tipo)">{{ getCanalEmoji(cat.tipo) }}</span>
                    <span class="cell-name">{{ cat.nombre }}</span>
                  </div>
                </td>
                <td><span class="badge-tipo">{{ cat.tipo || 'Salon' }}</span></td>
                <td><span class="badge-estado" [class.badge-activo]="cat.activo" [class.badge-inactivo]="!cat.activo">{{ cat.activo ? 'Activo' : 'Inactivo' }}</span></td>
                <td class="td-acciones">
                  <div class="acciones-cell">
                    <button class="btn-edit" (click)="editCategoria(cat)">Editar</button>
                    <button class="btn-deactivate" (click)="toggleCategoria(cat.id)">{{ cat.activo ? 'Desactivar' : 'Activar' }}</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Dispositivos -->
      <div class="config-section">
        <div class="section-header">
          <h3 class="section-title">Puntos de Venta</h3>
          <button class="btn btn-sm btn-outline-orange" (click)="editingId.set(null); newDispositivoNombre.set(''); newDispositivoTipo.set('Cajero'); acceptedTerms.set(false); posStep.set(1); showDispositivoDialog.set(true)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Agregar
          </button>
        </div>
        <table class="data-table">
          <thead><tr><th>NOMBRE</th><th>TIPO</th><th>ESTADO</th><th class="th-acciones">ACCIONES</th></tr></thead>
          <tbody>
            @for (disp of dispositivos(); track disp.id) {
              <tr>
                <td class="cell-name">{{ disp.nombre }}</td>
                <td><span class="badge-tipo">{{ disp.tipo }}</span></td>
                <td><span class="badge-estado" [class.badge-activo]="disp.activo" [class.badge-inactivo]="!disp.activo">{{ disp.activo ? 'Activo' : 'Inactivo' }}</span></td>
                <td class="td-acciones">
                  <div class="acciones-cell">
                    <button class="btn-edit" (click)="editDispositivo(disp)">Editar</button>
                    <button class="btn-deactivate" (click)="toggleDispositivo(disp.id)">{{ disp.activo ? 'Desactivar' : 'Activar' }}</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Turnos -->
      <div class="config-section">
        <div class="section-header">
          <h3 class="section-title">Turnos</h3>
          <button class="btn btn-sm btn-outline-orange" (click)="editingId.set(null); newTurnoNombre.set(''); newTurnoInicio.set(''); newTurnoFin.set(''); showTurnoDialog.set(true)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Agregar
          </button>
        </div>
        <table class="data-table">
          <thead><tr><th>NOMBRE</th><th>HORA INICIO</th><th>HORA FIN</th><th class="th-acciones">ACCIONES</th></tr></thead>
          <tbody>
            @for (turno of turnos(); track turno.id) {
              <tr>
                <td>
                  <div class="cell-with-icon">
                    <span class="cell-icon" [style.background]="getTurnoIconColor(turno.nombre)">{{ getTurnoEmoji(turno.nombre) }}</span>
                    <span class="cell-name">{{ turno.nombre }}</span>
                  </div>
                </td>
                <td>{{ turno.horaInicio }}</td>
                <td>{{ turno.horaFin }}</td>
                <td class="td-acciones">
                  <div class="acciones-cell">
                    <button class="btn-edit" (click)="editTurno(turno)">Editar</button>
                    <button class="btn-deactivate" (click)="removeTurno(turno.id)">Eliminar</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Estacion Dialog -->
    @if (showEstacionDialog()) {
      <div class="dialog-backdrop" (click)="showEstacionDialog.set(false)">
        <div class="dialog-sm" (click)="$event.stopPropagation()">
          <h3 class="dialog-sm-title">{{ editingId() ? 'Editar Estacion' : 'Agregar Estacion' }}</h3>
          <div class="form-group">
            <label class="form-label">Nombre</label>
            <input class="form-input" type="text" [ngModel]="newEstacionNombre()" (ngModelChange)="newEstacionNombre.set($event)" placeholder="Nombre de la estacion" />
          </div>
          <div class="form-group">
            <label class="form-label">Tipo</label>
            <select class="form-select" [ngModel]="newEstacionTipo()" (ngModelChange)="newEstacionTipo.set($event)">
              <option value="Cocina">Cocina</option>
              <option value="Barra">Barra</option>
              <option value="Caja">Caja</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>
          <div class="dialog-sm-actions">
            <button class="btn btn-secondary" (click)="showEstacionDialog.set(false)">Cancelar</button>
            <button class="btn btn-primary" (click)="saveEstacion()">{{ editingId() ? 'Guardar' : 'Agregar' }}</button>
          </div>
        </div>
      </div>
    }

    <!-- Cobro Categoria Dialog -->
    @if (showCobroDialog()) {
      <div class="dialog-backdrop" (click)="showCobroDialog.set(false)">
        <div class="dialog-cobro" (click)="$event.stopPropagation()">
          <div class="dialog-cobro-header">
            <h3 class="dialog-sm-title">{{ cobroCategoria() }}</h3>
            <p class="dialog-cobro-subtitle">Selecciona las formas de cobro que deseas activar o desactivar.</p>
          </div>
          <div class="dialog-cobro-grid">
            @for (fc of cobroCategoriaItems(); track fc.id) {
              <div
                class="cobro-select-card"
                [class.cobro-selected]="fc.activo"
                (click)="toggleCobro(fc.id)"
              >
                @if (fc.activo) {
                  <span class="cobro-check"></span>
                }
                <div class="cobro-select-dot" [style.background]="fc.color"></div>
                <span class="cobro-select-name">{{ fc.nombre }}</span>
              </div>
            }
          </div>
          <div class="dialog-sm-actions">
            <button class="btn btn-secondary" (click)="showCobroDialog.set(false)">Cerrar</button>
          </div>
        </div>
      </div>
    }

    <!-- Categoria Dialog -->
    @if (showCategoriaDialog()) {
      <div class="dialog-backdrop" (click)="showCategoriaDialog.set(false)">
        <div class="dialog-sm" (click)="$event.stopPropagation()">
          <h3 class="dialog-sm-title">{{ editingId() ? 'Editar Canal de Venta' : 'Agregar Canal de Venta' }}</h3>
          <div class="form-group">
            <label class="form-label">Nombre</label>
            <input class="form-input" type="text" [ngModel]="newCategoriaNombre()" (ngModelChange)="newCategoriaNombre.set($event)" placeholder="Nombre del canal" />
          </div>
          <div class="form-group">
            <label class="form-label">Tipo</label>
            <select class="form-select" [ngModel]="newCategoriaTipo()" (ngModelChange)="newCategoriaTipo.set($event)">
              <option value="Salon">Salon</option>
              <option value="Mostrador">Mostrador</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Visible en POS</label>
            <span class="form-hint">Opcional — si no se selecciona ninguno, se muestra en todos</span>
            <div class="pos-chips">
              @for (disp of dispositivos(); track disp.id) {
                @if (disp.activo) {
                  <button
                    type="button"
                    class="pos-chip"
                    [class.pos-chip--selected]="isDispositivoSelected(disp.id)"
                    (click)="toggleDispositivoSelection(disp.id)"
                  >
                    <span class="pos-chip-check" [class.pos-chip-check--visible]="isDispositivoSelected(disp.id)">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    {{ disp.nombre }}
                  </button>
                }
              }
            </div>
          </div>
          @if (editingId() && newCategoriaTipo() === 'Salon') {
            <button class="btn-plano-dialog" (click)="showCategoriaDialog.set(false); openPlano(editingId()!)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              Editar plano del salon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          }
          <div class="dialog-sm-actions">
            <button class="btn btn-secondary" (click)="showCategoriaDialog.set(false)">Cancelar</button>
            <button class="btn btn-primary" (click)="saveCategoria()">{{ editingId() ? 'Guardar' : 'Agregar' }}</button>
          </div>
        </div>
      </div>
    }

    <!-- Dispositivo Dialog -->
    @if (showDispositivoDialog()) {
      <div class="dialog-backdrop" (click)="showDispositivoDialog.set(false)">
        @if (editingId()) {
          <!-- Modo edicion: dialog simple -->
          <div class="dialog-sm" (click)="$event.stopPropagation()">
            <h3 class="dialog-sm-title">Editar Punto de Venta</h3>
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input class="form-input" type="text" [ngModel]="newDispositivoNombre()" (ngModelChange)="newDispositivoNombre.set($event)" placeholder="Nombre del POS" />
            </div>
            <div class="form-group">
              <label class="form-label">Tipo</label>
              <select class="form-select" [ngModel]="newDispositivoTipo()" (ngModelChange)="newDispositivoTipo.set($event)">
                <option value="Cajero">Cajero</option>
                <option value="Mozo">Mozo</option>
                <option value="Cocina">Cocina</option>
              </select>
            </div>
            <div class="dialog-sm-actions">
              <button class="btn btn-secondary" (click)="showDispositivoDialog.set(false)">Cancelar</button>
              <button class="btn btn-primary" (click)="saveDispositivo()">Guardar</button>
            </div>
          </div>
        } @else {
          <!-- Modo alta: dialog comercial 2 pasos -->
          <div class="dialog-pos" (click)="$event.stopPropagation()">
            <!-- Stepper -->
            <div class="pos-stepper">
              <div class="pos-step" [class.pos-step--active]="posStep() === 1" [class.pos-step--done]="posStep() > 1">
                <span class="pos-step-dot">{{ posStep() > 1 ? '✓' : '1' }}</span>
                <span class="pos-step-label">Informacion</span>
              </div>
              <div class="pos-step-line" [class.pos-step-line--done]="posStep() > 1"></div>
              <div class="pos-step" [class.pos-step--active]="posStep() === 2">
                <span class="pos-step-dot">2</span>
                <span class="pos-step-label">Configuracion</span>
              </div>
            </div>

            @if (posStep() === 1) {
              <!-- Paso 1: Info comercial -->
              <div class="pos-step-body">
                <div class="pos-hero-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="36" height="36">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                  </svg>
                </div>
                <h3 class="pos-hero-title">Nuevo Punto de Venta</h3>
                <p class="pos-hero-desc">Suma un terminal POS a tu local para operar, facturar y gestionar comandas desde un dispositivo adicional.</p>

                <div class="pos-price-block">
                  <span class="pos-price-label">Costo mensual por terminal</span>
                  <div class="pos-price-row">
                    <span class="pos-price-currency">$</span>
                    <span class="pos-price-amount">4.990</span>
                    <span class="pos-price-period">/mes</span>
                  </div>
                </div>

                <div class="pos-features">
                  <div class="pos-feature">
                    <span class="pos-feature-icon">⚡</span>
                    <div class="pos-feature-text">
                      <span class="pos-feature-title">Facturacion electronica</span>
                      <span class="pos-feature-desc">Emiti comprobantes fiscales integrados con ARCA</span>
                    </div>
                  </div>
                  <div class="pos-feature">
                    <span class="pos-feature-icon">📋</span>
                    <div class="pos-feature-text">
                      <span class="pos-feature-title">Comandas en tiempo real</span>
                      <span class="pos-feature-desc">Envia pedidos a cocina y barra al instante</span>
                    </div>
                  </div>
                  <div class="pos-feature">
                    <span class="pos-feature-icon">🔄</span>
                    <div class="pos-feature-text">
                      <span class="pos-feature-title">Sincronizacion automatica</span>
                      <span class="pos-feature-desc">Todos los datos sincronizados con tu cuenta</span>
                    </div>
                  </div>
                  <div class="pos-feature">
                    <span class="pos-feature-icon">🛟</span>
                    <div class="pos-feature-text">
                      <span class="pos-feature-title">Soporte tecnico incluido</span>
                      <span class="pos-feature-desc">Asistencia por chat y telefono sin costo extra</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="dialog-sm-actions">
                <button class="btn btn-secondary" (click)="showDispositivoDialog.set(false)">Cancelar</button>
                <button class="btn btn-primary" (click)="posStep.set(2)">Continuar</button>
              </div>
            } @else {
              <!-- Paso 2: Configuracion -->
              <div class="pos-step-body">
                <div class="pos-dialog-form">
                  <div class="form-group">
                    <label class="form-label">Nombre del terminal</label>
                    <input class="form-input" type="text" [ngModel]="newDispositivoNombre()" (ngModelChange)="newDispositivoNombre.set($event)" placeholder="Ej: POS Caja 2, POS Mozo Terraza..." />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Tipo de terminal</label>
                    <select class="form-select" [ngModel]="newDispositivoTipo()" (ngModelChange)="newDispositivoTipo.set($event)">
                      <option value="Cajero">Cajero — Punto fijo de cobro</option>
                      <option value="Mozo">Mozo — Terminal movil de salon</option>
                      <option value="Cocina">Cocina — Pantalla de comandas</option>
                    </select>
                  </div>
                </div>

                <label class="pos-dialog-terms">
                  <input type="checkbox" class="pos-terms-check" [ngModel]="acceptedTerms()" (ngModelChange)="acceptedTerms.set($event)" />
                  <span class="pos-terms-text">Acepto los <a class="pos-terms-link">terminos y condiciones</a> del servicio y autorizo el cargo mensual de $4.990 por este terminal POS.</span>
                </label>
              </div>

              <div class="dialog-sm-actions">
                <button class="btn btn-secondary" (click)="posStep.set(1)">Atras</button>
                <button class="btn btn-primary" [disabled]="!acceptedTerms() || !newDispositivoNombre().trim()" (click)="saveDispositivo()">Confirmar y agregar</button>
              </div>
            }
          </div>
        }
      </div>
    }

    <!-- Turno Dialog -->
    @if (showTurnoDialog()) {
      <div class="dialog-backdrop" (click)="showTurnoDialog.set(false)">
        <div class="dialog-sm" (click)="$event.stopPropagation()">
          <h3 class="dialog-sm-title">{{ editingId() ? 'Editar Turno' : 'Agregar Turno' }}</h3>
          <div class="form-group">
            <label class="form-label">Nombre</label>
            <input class="form-input" type="text" [ngModel]="newTurnoNombre()" (ngModelChange)="newTurnoNombre.set($event)" placeholder="Nombre del turno" />
          </div>
          <div class="form-group">
            <label class="form-label">Hora Inicio</label>
            <input class="form-input" type="time" [ngModel]="newTurnoInicio()" (ngModelChange)="newTurnoInicio.set($event)" />
          </div>
          <div class="form-group">
            <label class="form-label">Hora Fin</label>
            <input class="form-input" type="time" [ngModel]="newTurnoFin()" (ngModelChange)="newTurnoFin.set($event)" />
          </div>
          <div class="dialog-sm-actions">
            <button class="btn btn-secondary" (click)="showTurnoDialog.set(false)">Cancelar</button>
            <button class="btn btn-primary" (click)="saveTurno()">{{ editingId() ? 'Guardar' : 'Agregar' }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .config-header {
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
      border: 1px solid var(--border-color);
      border-radius: 10px;
      background: white;
      color: var(--gray-600);
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .back-btn:hover {
      background: var(--gray-50);
      border-color: var(--gray-300);
    }

    .config-header-info {
      flex: 1;
    }

    .config-header-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 14px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 9999px;
      background: var(--success-bg);
      color: var(--success-text);
    }

    .badge-pill::before {
      content: '';
      width: 6px;
      height: 6px;
      background: var(--success-color);
      border-radius: 50%;
    }

    .config-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .config-section {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 20px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    /* Data Table */
    .data-table {
      width: 100%; border-collapse: separate; border-spacing: 0;
      font-family: 'Inter', sans-serif; font-size: 13px;
      border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;
    }
    .data-table thead tr { background: #F3F4F6; }
    .data-table th {
      padding: 10px 16px; font-weight: 600; color: #6B7280; text-align: left;
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;
      border-bottom: 1px solid #E5E7EB;
    }
    .data-table td {
      padding: 12px 16px; color: #374151; border-bottom: 1px solid #F3F4F6;
    }
    .data-table tbody tr:last-child td { border-bottom: none; }
    .data-table tbody tr:hover { background: #FAFAFA; }
    .cell-name { font-weight: 500; color: #1F2937; }
    .cell-with-icon { display: flex; align-items: center; gap: 12px; }
    .cell-icon {
      width: 36px; height: 36px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; flex-shrink: 0;
    }
    .badge-tipo {
      display: inline-block; padding: 2px 8px; font-size: 11px;
      font-weight: 500; border-radius: 4px; background: #F3F4F6; color: #374151;
    }

    .th-acciones { text-align: right; }
    .td-acciones { text-align: right; }
    .acciones-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
    }
    .badge-estado {
      display: inline-block; padding: 2px 8px; font-size: 11px;
      font-weight: 500; border-radius: 4px;
    }
    .badge-activo { background: #D1FAE5; color: #065F46; }
    .badge-inactivo { background: #F3F4F6; color: #6B7280; }
    /* POS commercial dialog */
    .dialog-pos {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.25);
      width: 480px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 0;
      scrollbar-width: none;
    }

    .dialog-pos::-webkit-scrollbar { display: none; }

    /* Stepper */
    .pos-stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      padding: 24px 32px 0;
    }

    .pos-step {
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0.4;
    }

    .pos-step--active { opacity: 1; }
    .pos-step--done { opacity: 0.7; }

    .pos-step-dot {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      background: var(--slate-200);
      color: var(--slate-500);
    }

    .pos-step--active .pos-step-dot {
      background: var(--primary-blue, #1155CC);
      color: white;
    }

    .pos-step--done .pos-step-dot {
      background: var(--success-color);
      color: white;
      font-size: 11px;
    }

    .pos-step-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .pos-step--active .pos-step-label { color: var(--text-heading); }

    .pos-step-line {
      width: 40px;
      height: 2px;
      background: var(--slate-200);
      margin: 0 12px;
    }

    .pos-step-line--done { background: var(--success-color); }

    /* Step body */
    .pos-step-body {
      padding: 24px 32px 0;
    }

    /* Step 1: Hero */
    .pos-hero-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: var(--primary-blue, #1155CC);
      color: white;
      margin: 0 auto 16px;
    }

    .pos-hero-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-heading);
      margin: 0 0 6px;
      text-align: center;
    }

    .pos-hero-desc {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0 0 24px;
      line-height: 1.55;
      text-align: center;
    }

    .pos-price-block {
      text-align: center;
      padding: 20px;
      background: var(--slate-50, #F8FAFC);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .pos-price-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      display: block;
      margin-bottom: 6px;
    }

    .pos-price-row {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 2px;
    }

    .pos-price-currency {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-heading);
    }

    .pos-price-amount {
      font-size: 36px;
      font-weight: 800;
      color: var(--text-heading);
      line-height: 1;
      letter-spacing: -0.02em;
    }

    .pos-price-period {
      font-size: 14px;
      color: var(--text-secondary);
      margin-left: 2px;
    }

    /* Features */
    .pos-features {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .pos-feature {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .pos-feature-icon {
      font-size: 18px;
      line-height: 1;
      flex-shrink: 0;
      width: 24px;
      text-align: center;
      margin-top: 1px;
    }

    .pos-feature-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .pos-feature-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-heading);
    }

    .pos-feature-desc {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .pos-dialog-form {
      padding: 0 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .pos-dialog-terms {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 16px 32px 0;
      cursor: pointer;
    }

    .pos-terms-check {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      accent-color: var(--primary-blue, #1155CC);
      cursor: pointer;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .pos-terms-text {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .pos-terms-link {
      color: var(--primary-blue, #1155CC);
      text-decoration: underline;
      cursor: pointer;
    }

    .dialog-pos .dialog-sm-actions {
      padding: 20px 32px 28px;
    }

    .dialog-pos .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-plano-dialog {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 12px 16px;
      margin-top: 4px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: var(--primary-blue, #1155CC);
      background: rgba(17, 85, 204, 0.04);
      border: 1px dashed rgba(17, 85, 204, 0.25);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
    }
    .btn-plano-dialog:hover {
      background: rgba(17, 85, 204, 0.08);
      border-color: rgba(17, 85, 204, 0.4);
    }
    .btn-plano-dialog svg:last-child {
      margin-left: auto;
      opacity: 0.5;
    }
    .btn-plano-dialog:hover svg:last-child {
      opacity: 1;
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
    }
    .btn-deactivate:hover { background: #FEF2F2; }

    /* Outline orange button */
    .btn-outline-orange {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; font-size: 13px; font-weight: 500; font-family: inherit;
      color: #FF8800; background: #FFFFFF; border: 1px solid #FF8800;
      border-radius: 6px; cursor: pointer; transition: all 0.15s; white-space: nowrap;
    }
    .btn-outline-orange:hover { background: #FFF7ED; }

    /* Toggle Switch */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 22px;
      cursor: pointer;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      inset: 0;
      background: var(--gray-300);
      border-radius: 22px;
      transition: background 0.2s ease;
    }

    .toggle-slider::before {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: transform 0.2s ease;
    }

    .toggle-switch input:checked + .toggle-slider {
      background: var(--success-color);
    }

    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(18px);
    }

    .toggle-sm {
      width: 34px;
      height: 18px;
    }

    .toggle-sm .toggle-slider::before {
      width: 12px;
      height: 12px;
    }

    .toggle-sm input:checked + .toggle-slider::before {
      transform: translateX(16px);
    }

    /* Cobro CTA Grid */
    .cobro-cta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .cobro-cta {
      display: flex; align-items: center; gap: 14px;
      padding: 20px; background: white; border: 1px solid #E5E7EB;
      border-radius: 10px; cursor: pointer; transition: all 0.15s;
      font-family: inherit; text-align: left;
    }
    .cobro-cta:hover { border-color: #D1D5DB; background: #FAFAFA; }
    .cobro-cta-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .cobro-cta-label { flex: 1; font-size: 15px; font-weight: 600; color: #1F2937; }
    .cobro-cta-count { font-size: 13px; color: #9CA3AF; font-weight: 500; }
    .section-subtitle-sm { font-size: 12px; color: #9CA3AF; }

    /* Cobro Select Dialog */
    .dialog-cobro {
      background: white; border-radius: 16px; width: 100%; max-width: 520px;
      padding: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    }
    .dialog-cobro-header { margin-bottom: 20px; }
    .dialog-cobro-subtitle { font-size: 13px; color: #6B7280; margin: 6px 0 0; }
    .dialog-cobro-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;
    }
    .cobro-select-card {
      position: relative; display: flex; align-items: center; gap: 10px;
      padding: 14px 16px; border: 2px solid #E5E7EB; border-radius: 12px;
      cursor: pointer; transition: all 0.2s; background: white;
    }
    .cobro-select-card:hover { border-color: #F97316; background: #FFF7ED; }
    .cobro-selected {
      border-color: #F97316; background: #FFF7ED;
      box-shadow: 0 0 0 3px rgba(249,115,22,0.15);
    }
    .cobro-check {
      position: absolute; top: 8px; right: 8px;
      width: 10px; height: 10px; border-radius: 50%; background: #22C55E;
    }
    .cobro-select-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .cobro-select-name { font-size: 14px; font-weight: 500; color: #374151; }

    /* Dialog */
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 24px;
    }

    .dialog-sm {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 420px;
      padding: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .dialog-sm-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 20px 0;
    }

    .dialog-sm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .form-hint {
      display: block;
      font-size: 11px;
      font-weight: 400;
      color: var(--slate-400);
      margin-top: 2px;
      margin-bottom: 10px;
    }

    .pos-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }

    .pos-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      background: var(--bg-primary);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .pos-chip:hover {
      border-color: var(--slate-300);
      color: var(--text-primary);
    }

    .pos-chip--selected {
      border-color: var(--primary-blue, #1155CC);
      background: rgba(17, 85, 204, 0.06);
      color: var(--primary-blue, #1155CC);
    }

    .pos-chip--selected:hover {
      border-color: var(--primary-blue, #1155CC);
    }

    .pos-chip-check {
      display: inline-flex;
      width: 0;
      overflow: hidden;
      transition: width 0.15s ease;
      color: var(--primary-blue, #1155CC);
    }

    .pos-chip-check--visible {
      width: 14px;
    }

    @media (max-width: 1024px) {
      .config-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .cobro-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ConfiguracionesComponent {
  private readonly router = inject(Router);

  // Data signals
  estaciones = signal<ConfigEstacion[]>([...MOCK_ESTACIONES]);
  formasCobro = signal<ConfigFormaCobro[]>([...MOCK_FORMAS_COBRO_CONFIG]);
  categorias = signal<ConfigCategoria[]>([...MOCK_CATEGORIAS]);
  dispositivos = signal<ConfigDispositivo[]>([...MOCK_DISPOSITIVOS]);
  turnos = signal<ConfigTurno[]>([...MOCK_TURNOS]);

  // Dialog visibility
  showEstacionDialog = signal(false);
  showCobroDialog = signal(false);
  showCategoriaDialog = signal(false);
  showDispositivoDialog = signal(false);
  showTurnoDialog = signal(false);

  // New item form signals
  editingId = signal<number | null>(null);
  newEstacionNombre = signal('');
  newEstacionTipo = signal('Principal');
  cobroCategoria = signal('');
  cobroCategoriaItems = signal<ConfigFormaCobro[]>([]);
  newCategoriaNombre = signal('');
  newCategoriaTipo = signal<'Salon' | 'Mostrador' | 'Delivery'>('Salon');
  newCategoriaDispositivos = signal<number[]>([]);
  newDispositivoNombre = signal('');
  newDispositivoTipo = signal('Cajero');
  acceptedTerms = signal(false);
  posStep = signal(1);
  newTurnoNombre = signal('');
  newTurnoInicio = signal('');
  newTurnoFin = signal('');

  getTurnoEmoji(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('manana') || n.includes('mañana')) return '🌅';
    if (n.includes('tarde')) return '☀️';
    if (n.includes('noche')) return '🌙';
    return '🕐';
  }

  getTurnoIconColor(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('manana') || n.includes('mañana')) return '#FEF3C7';
    if (n.includes('tarde')) return '#FFEDD5';
    if (n.includes('noche')) return '#DBEAFE';
    return '#F3F4F6';
  }

  getCanalEmoji(tipo: string): string {
    if (tipo === 'Salon') return '🍽️';
    if (tipo === 'Mostrador') return '🏪';
    if (tipo === 'Delivery') return '🛵';
    return '📦';
  }

  getCanalIconColor(tipo: string): string {
    if (tipo === 'Salon') return '#D1FAE5';
    if (tipo === 'Mostrador') return '#FEF3C7';
    if (tipo === 'Delivery') return '#DBEAFE';
    return '#F3F4F6';
  }

  goBack(): void {
    this.router.navigate(['/pdv']);
  }

  toggleEstacion(id: number): void {
    this.estaciones.update((list) =>
      list.map((e) => (e.id === id ? { ...e, activo: !e.activo } : e))
    );
  }

  toggleCobro(id: number): void {
    this.formasCobro.update((list) =>
      list.map((f) => (f.id === id ? { ...f, activo: !f.activo } : f))
    );
    // Update dialog items if open
    if (this.showCobroDialog()) {
      this.cobroCategoriaItems.set(
        this.formasCobro().filter(f => f.categoria === this.cobroCategoria())
      );
    }
  }

  toggleCategoria(id: number): void {
    this.categorias.update((list) =>
      list.map((c) => (c.id === id ? { ...c, activo: !c.activo } : c))
    );
  }

  toggleDispositivo(id: number): void {
    this.dispositivos.update((list) =>
      list.map((d) => (d.id === id ? { ...d, activo: !d.activo } : d))
    );
  }

  editEstacion(est: ConfigEstacion): void {
    this.editingId.set(est.id);
    this.newEstacionNombre.set(est.nombre);
    this.newEstacionTipo.set(est.tipo);
    this.showEstacionDialog.set(true);
  }

  saveEstacion(): void {
    const nombre = this.newEstacionNombre().trim();
    if (!nombre) return;
    const id = this.editingId();
    if (id) {
      this.estaciones.update(list => list.map(e => e.id === id ? { ...e, nombre, tipo: this.newEstacionTipo() } : e));
    } else {
      const maxId = Math.max(...this.estaciones().map(e => e.id), 0);
      this.estaciones.update(list => [...list, { id: maxId + 1, nombre, tipo: this.newEstacionTipo(), activo: true }]);
    }
    this.newEstacionNombre.set(''); this.newEstacionTipo.set('Cocina'); this.editingId.set(null);
    this.showEstacionDialog.set(false);
  }

  openCobroCategoria(categoria: string): void {
    this.cobroCategoria.set(categoria);
    this.cobroCategoriaItems.set(
      this.formasCobro().filter(f => f.categoria === categoria)
    );
    this.showCobroDialog.set(true);
  }

  getCobroCount(categoria: string): string {
    const items = this.formasCobro().filter(f => f.categoria === categoria);
    const activos = items.filter(f => f.activo).length;
    return `${activos}/${items.length}`;
  }

  openPlano(canalId: number): void {
    this.router.navigate(['/pdv/configuraciones/plano', canalId]);
  }

  editCategoria(cat: ConfigCategoria): void {
    this.editingId.set(cat.id);
    this.newCategoriaNombre.set(cat.nombre);
    this.newCategoriaTipo.set(cat.tipo);
    this.newCategoriaDispositivos.set(cat.dispositivoIds ? [...cat.dispositivoIds] : []);
    this.showCategoriaDialog.set(true);
  }

  saveCategoria(): void {
    const nombre = this.newCategoriaNombre().trim();
    if (!nombre) return;
    const id = this.editingId();
    const dispositivoIds = this.newCategoriaDispositivos().length > 0 ? this.newCategoriaDispositivos() : undefined;
    if (id) {
      this.categorias.update(list => list.map(c => c.id === id ? { ...c, nombre, tipo: this.newCategoriaTipo(), dispositivoIds } : c));
    } else {
      const maxId = Math.max(...this.categorias().map(c => c.id), 0);
      this.categorias.update(list => [...list, { id: maxId + 1, nombre, tipo: this.newCategoriaTipo(), activo: true, dispositivoIds }]);
    }
    this.newCategoriaNombre.set(''); this.newCategoriaTipo.set('Salon'); this.newCategoriaDispositivos.set([]); this.editingId.set(null);
    this.showCategoriaDialog.set(false);
  }

  isDispositivoSelected(id: number): boolean {
    return this.newCategoriaDispositivos().includes(id);
  }

  toggleDispositivoSelection(id: number): void {
    this.newCategoriaDispositivos.update(ids =>
      ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]
    );
  }

  editDispositivo(disp: ConfigDispositivo): void {
    this.editingId.set(disp.id);
    this.newDispositivoNombre.set(disp.nombre);
    this.newDispositivoTipo.set(disp.tipo);
    this.showDispositivoDialog.set(true);
  }

  saveDispositivo(): void {
    const nombre = this.newDispositivoNombre().trim();
    if (!nombre) return;
    const id = this.editingId();
    if (id) {
      this.dispositivos.update(list => list.map(d => d.id === id ? { ...d, nombre, tipo: this.newDispositivoTipo() } : d));
    } else {
      const maxId = Math.max(...this.dispositivos().map(d => d.id), 0);
      this.dispositivos.update(list => [...list, { id: maxId + 1, nombre, tipo: this.newDispositivoTipo(), activo: true }]);
    }
    this.newDispositivoNombre.set(''); this.newDispositivoTipo.set('Cajero'); this.editingId.set(null);
    this.showDispositivoDialog.set(false);
  }

  editTurno(turno: ConfigTurno): void {
    this.editingId.set(turno.id);
    this.newTurnoNombre.set(turno.nombre);
    this.newTurnoInicio.set(turno.horaInicio);
    this.newTurnoFin.set(turno.horaFin);
    this.showTurnoDialog.set(true);
  }

  saveTurno(): void {
    const nombre = this.newTurnoNombre().trim();
    if (!nombre) return;
    const id = this.editingId();
    if (id) {
      this.turnos.update(list => list.map(t => t.id === id ? { ...t, nombre, horaInicio: this.newTurnoInicio(), horaFin: this.newTurnoFin() } : t));
    } else {
      const maxId = Math.max(...this.turnos().map(t => t.id), 0);
      this.turnos.update(list => [...list, { id: maxId + 1, nombre, horaInicio: this.newTurnoInicio(), horaFin: this.newTurnoFin() }]);
    }
    this.newTurnoNombre.set(''); this.newTurnoInicio.set(''); this.newTurnoFin.set(''); this.editingId.set(null);
    this.showTurnoDialog.set(false);
  }

  removeTurno(id: number): void {
    this.turnos.update(list => list.filter(t => t.id !== id));
  }
}
