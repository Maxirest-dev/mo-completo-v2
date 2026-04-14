import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MroCurrencyPipe } from '../../../balances/pipes/currency.pipe';
import {
  Empleado,
  RolGastronomico,
  EstadoEmpleado,
  FichajeRegistro,
  Adelanto,
  Incidencia,
  UniformeEntrega,
} from '../../models';
import {
  MOCK_EMPLEADOS,
  MOCK_HISTORIAL_FICHAJES,
  MOCK_ADELANTOS,
  MOCK_INCIDENCIAS,
  MOCK_UNIFORMES,
} from '../../data/mock-personal.data';

type PerfilTab = 'fichajes' | 'incidencias' | 'adelantos' | 'uniformes';

type DocStatus = 'Vigente' | 'Vencida' | 'Pendiente';

interface Documento {
  nombre: string;
  icono: string;
  estado: DocStatus;
}

interface HistorialItem {
  fecha: string;
  descripcion: string;
  tipo: string;
}

const AVATAR_COLORS: Record<RolGastronomico, string> = {
  Mozo: '#3B82F6',
  Cocinero: '#EF4444',
  Bachero: '#8B5CF6',
  Manager: '#059669',
  Bartender: '#F97316',
  Cajero: '#6366F1',
  Delivery: '#10B981',
};

const ESTADO_BADGE: Record<EstadoEmpleado, { bg: string; color: string }> = {
  Trabajando:   { bg: '#ECFDF5', color: '#00A43D' },
  Franco:       { bg: '#DBEAFE', color: '#2563EB' },
  Vacaciones:   { bg: '#F3E8FF', color: '#7C3AED' },
  Licencia:     { bg: '#FFFBEB', color: '#92400E' },
  Desvinculado: { bg: '#F1F5F9', color: '#5F6D7E' },
};

const ESTADO_DOT_COLOR: Record<EstadoEmpleado, string> = {
  Trabajando:   '#00A43D',
  Franco:       '#2563EB',
  Vacaciones:   '#7C3AED',
  Licencia:     '#92400E',
  Desvinculado: '#5F6D7E',
};

@Component({
  selector: 'app-empleado-perfil',
  standalone: true,
  imports: [
    CommonModule,
    MroCurrencyPipe,
  ],
  template: `
    <div class="perfil-container">
      @if (empleado()) {
        <!-- Top action bar -->
        <div class="top-action-bar">
          <button
            class="back-btn"
            (click)="goBack()"
            title="Volver al listado"
            aria-label="Volver al listado de personal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          @if (isNew()) {
            <span class="new-badge">Nuevo empleado</span>
            <button class="btn-save" (click)="onSave()" [disabled]="!empleado()?.nombre">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
              Guardar empleado
            </button>
          }
        </div>

        <!-- Top Row: 3 columns -->
        <div class="top-row" role="region" aria-label="Informacion del empleado">
          <!-- Col 1: Avatar Card -->
          <div class="image-card">
            <div
              class="avatar-circle"
              [style.background]="getAvatarColor(empleado()!.rol)"
              role="img"
              [attr.aria-label]="'Avatar de ' + empleado()!.nombre"
            >
              <span class="avatar-initials">{{ getInitials(empleado()!.nombre) }}</span>
            </div>
            <span class="avatar-rol">{{ empleado()!.rol }}</span>
            <span
              class="estado-badge-pill"
              [style.background]="getEstadoBg(empleado()!.estado)"
              [style.color]="getEstadoColor(empleado()!.estado)"
              role="status"
            >
              {{ empleado()!.estado }}
            </span>
          </div>

          <!-- Col 2: Info Card -->
          <div class="info-card">
            <!-- Name row -->
            <div class="info-name-row">
              @if (isNew()) {
                <input type="text" class="edit-input edit-input-name" placeholder="Nombre completo"
                  [value]="empleado()!.nombre"
                  (input)="updateField('nombre', $event)" />
              } @else {
                <h1 class="product-name">{{ empleado()!.nombre }}</h1>
              }
              <span
                class="status-badge"
                [style.background]="getEstadoBg(empleado()!.estado)"
                [style.color]="getEstadoColor(empleado()!.estado)"
              >
                <span class="status-dot" [style.background]="getEstadoDotColor(empleado()!.estado)"></span>
                {{ empleado()!.estado }}
              </span>
              <button class="icon-btn" aria-label="Editar empleado">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
            <!-- Datos Personales -->
            <div class="info-desc-section">
              <label class="section-label">DATOS PERSONALES</label>
              <div class="info-data-grid">
                <div class="info-data-row">
                  <div class="info-data-item">
                    <span class="info-data-label">DNI</span>
                    @if (isNew()) {
                      <input type="text" class="edit-input" placeholder="Ej: 35.678.901"
                        [value]="empleado()!.dni" (input)="updateField('dni', $event)" />
                    } @else {
                      <span class="info-data-value">{{ empleado()!.dni }}</span>
                    }
                  </div>
                  <div class="info-data-item">
                    <span class="info-data-label">CUIL</span>
                    @if (isNew()) {
                      <input type="text" class="edit-input" placeholder="Ej: 27-35678901-4"
                        [value]="empleado()!.cuil" (input)="updateField('cuil', $event)" />
                    } @else {
                      <span class="info-data-value">{{ empleado()!.cuil }}</span>
                    }
                  </div>
                </div>
                <div class="info-data-row">
                  <div class="info-data-item">
                    <span class="info-data-label">Contacto emergencia</span>
                    @if (isNew()) {
                      <input type="text" class="edit-input" placeholder="Ej: 11-9876-5432"
                        [value]="empleado()!.contactoEmergencia" (input)="updateField('contactoEmergencia', $event)" />
                    } @else {
                      <span class="info-data-value">{{ empleado()!.contactoEmergencia }}</span>
                    }
                  </div>
                  <div class="info-data-item">
                    <span class="info-data-label">Fecha de ingreso</span>
                    @if (isNew()) {
                      <input type="date" class="edit-input"
                        [value]="empleado()!.fechaIngreso" (input)="updateField('fechaIngreso', $event)" />
                    } @else {
                      <span class="info-data-value">{{ formatDate(empleado()!.fechaIngreso) }}</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Col 3: CTA Grid 2x3 -->
          <div class="cta-grid" role="list" aria-label="Datos de contacto y condiciones">
            <!-- Telefono -->
            <div class="cta-card" role="listitem">
              <div class="cta-header">
                <div class="cta-icon-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" stroke-width="2" class="cta-icon" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                  </svg>
                  <span class="cta-label">Telefono</span>
                </div>
              </div>
              <span class="cta-value cta-value-small">{{ empleado()!.telefono }}</span>
            </div>

            <!-- Email -->
            <div class="cta-card" role="listitem">
              <div class="cta-header">
                <div class="cta-icon-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" stroke-width="2" class="cta-icon" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                  </svg>
                  <span class="cta-label">Email</span>
                </div>
              </div>
              <span class="cta-value cta-value-small cta-value-email">{{ empleado()!.email }}</span>
            </div>

            <!-- Sueldo Base -->
            <div class="cta-card" role="listitem">
              <div class="cta-header">
                <div class="cta-icon-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" stroke-width="2" class="cta-icon" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                  <span class="cta-label">Sueldo Base</span>
                </div>
              </div>
              <span class="cta-value cta-value-price">{{ empleado()!.sueldoBase | mroCurrency }}</span>
            </div>

            <!-- Hora Extra -->
            <div class="cta-card" role="listitem">
              <div class="cta-header">
                <div class="cta-icon-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" class="cta-icon" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                  <span class="cta-label">Hora Extra</span>
                </div>
              </div>
              <span class="cta-value cta-value-price">{{ empleado()!.valorHoraExtra | mroCurrency }}</span>
            </div>

            <!-- Dias de Franco -->
            <div class="cta-card" role="listitem">
              <div class="cta-header">
                <div class="cta-icon-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" class="cta-icon" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
                  </svg>
                  <span class="cta-label">Dias de Franco</span>
                </div>
              </div>
              <span class="cta-value cta-value-small">{{ empleado()!.diasFranco.join(', ') }}</span>
            </div>

            <!-- Estado -->
            <div class="cta-card" role="listitem">
              <div class="cta-header">
                <div class="cta-icon-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" stroke-width="2" class="cta-icon" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"/>
                  </svg>
                  <span class="cta-label">Estado</span>
                </div>
              </div>
              <span
                class="cta-value cta-value-small"
                [style.color]="getEstadoColor(empleado()!.estado)"
              >
                {{ empleado()!.estado }}
              </span>
            </div>
          </div>
        </div>

        <!-- Bottom Grid: 2 columns -->
        <div class="bottom-grid">
          <!-- Left: Documentacion -->
          <div class="detail-card" role="region" aria-label="Documentacion del empleado">
            <div class="detail-card-header">
              <h3 class="detail-card-title">DOCUMENTACION</h3>
              <button class="icon-btn" aria-label="Agregar documento">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
              </button>
            </div>
            <ul class="doc-list" role="list">
              @for (doc of documentos(); track doc.nombre) {
                <li class="doc-item" role="listitem">
                  <div class="doc-item-left">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--slate-400)" stroke-width="1.5" class="doc-icon" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                    </svg>
                    <span class="doc-name">{{ doc.nombre }}</span>
                  </div>
                  <span
                    class="doc-status-badge"
                    [class.doc-status--vigente]="doc.estado === 'Vigente'"
                    [class.doc-status--vencida]="doc.estado === 'Vencida'"
                    [class.doc-status--pendiente]="doc.estado === 'Pendiente'"
                    role="status"
                  >
                    {{ doc.estado }}
                  </span>
                </li>
              }
            </ul>
          </div>

          <!-- Right: Historial Reciente -->
          <div class="detail-card" role="region" aria-label="Historial reciente">
            <div class="detail-card-header">
              <h3 class="detail-card-title">HISTORIAL RECIENTE</h3>
            </div>
            @if (historialReciente().length > 0) {
              <ul class="historial-list" role="list">
                @for (item of historialReciente(); track $index) {
                  <li class="historial-item" role="listitem">
                    <div class="historial-item-left">
                      <span class="historial-fecha">{{ item.fecha }}</span>
                      <span class="historial-desc">{{ item.descripcion }}</span>
                    </div>
                    <span
                      class="historial-tipo-badge"
                      [class.tipo-fichaje]="item.tipo === 'Fichaje'"
                      [class.tipo-sancion]="item.tipo === 'Sancion'"
                      [class.tipo-llegada-tarde]="item.tipo === 'Llegada tarde'"
                      [class.tipo-premio]="item.tipo === 'Premio'"
                      [class.tipo-observacion]="item.tipo === 'Observacion'"
                    >
                      {{ item.tipo }}
                    </span>
                  </li>
                }
              </ul>
            } @else {
              <p class="empty-detail">Sin registros recientes.</p>
            }
          </div>
        </div>

        <!-- Full Width: Tabs Section -->
        <div class="tabs-section" role="region" aria-label="Detalle por categoria">
          <nav class="tab-pills" role="tablist" aria-label="Categorias de detalle">
            <button
              class="tab-pill"
              [class.tab-pill--active]="activeTab() === 'fichajes'"
              (click)="setTab('fichajes')"
              role="tab"
              [attr.aria-selected]="activeTab() === 'fichajes'"
              aria-controls="panel-fichajes"
            >
              Fichajes
            </button>
            <button
              class="tab-pill"
              [class.tab-pill--active]="activeTab() === 'incidencias'"
              (click)="setTab('incidencias')"
              role="tab"
              [attr.aria-selected]="activeTab() === 'incidencias'"
              aria-controls="panel-incidencias"
            >
              Incidencias
            </button>
            <button
              class="tab-pill"
              [class.tab-pill--active]="activeTab() === 'adelantos'"
              (click)="setTab('adelantos')"
              role="tab"
              [attr.aria-selected]="activeTab() === 'adelantos'"
              aria-controls="panel-adelantos"
            >
              Adelantos
            </button>
            <button
              class="tab-pill"
              [class.tab-pill--active]="activeTab() === 'uniformes'"
              (click)="setTab('uniformes')"
              role="tab"
              [attr.aria-selected]="activeTab() === 'uniformes'"
              aria-controls="panel-uniformes"
            >
              Uniformes
            </button>
          </nav>

          <!-- Fichajes Panel -->
          @if (activeTab() === 'fichajes') {
            <div class="tab-panel" id="panel-fichajes" role="tabpanel" aria-label="Fichajes">
              @if (fichajes().length > 0) {
                <div class="table-wrapper">
                  <table class="data-table" aria-label="Historial de fichajes">
                    <thead>
                      <tr>
                        <th scope="col">Fecha</th>
                        <th scope="col">Entrada</th>
                        <th scope="col">Salida</th>
                        <th scope="col">Hs. Trabajadas</th>
                        <th scope="col">Hs. Extra</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (f of fichajes(); track f.id) {
                        <tr>
                          <td>{{ f.fecha }}</td>
                          <td>{{ f.entrada }}</td>
                          <td>{{ f.salida || 'En turno' }}</td>
                          <td>{{ f.horasTrabajadas }}h</td>
                          <td>
                            @if (f.horasExtra > 0) {
                              <span class="extra-badge">+{{ f.horasExtra }}h</span>
                            } @else {
                              <span class="text-muted">--</span>
                            }
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <p class="empty-detail">Sin fichajes registrados.</p>
              }
            </div>
          }

          <!-- Incidencias Panel -->
          @if (activeTab() === 'incidencias') {
            <div class="tab-panel" id="panel-incidencias" role="tabpanel" aria-label="Incidencias">
              @if (incidencias().length > 0) {
                <div class="table-wrapper">
                  <table class="data-table" aria-label="Historial de incidencias">
                    <thead>
                      <tr>
                        <th scope="col">Fecha</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Descripcion</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (i of incidencias(); track i.id) {
                        <tr>
                          <td>{{ i.fecha }}</td>
                          <td>
                            <span
                              class="incidencia-tipo-badge"
                              [class.tipo-sancion]="i.tipo === 'Sanción'"
                              [class.tipo-llegada-tarde]="i.tipo === 'Llegada tarde'"
                              [class.tipo-premio]="i.tipo === 'Premio'"
                              [class.tipo-observacion]="i.tipo === 'Observación'"
                            >
                              {{ i.tipo }}
                            </span>
                          </td>
                          <td>{{ i.descripcion }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <p class="empty-detail">Sin incidencias registradas.</p>
              }
            </div>
          }

          <!-- Adelantos Panel -->
          @if (activeTab() === 'adelantos') {
            <div class="tab-panel" id="panel-adelantos" role="tabpanel" aria-label="Adelantos">
              @if (adelantos().length > 0) {
                <div class="table-wrapper">
                  <table class="data-table" aria-label="Historial de adelantos">
                    <thead>
                      <tr>
                        <th scope="col">Fecha</th>
                        <th scope="col">Monto</th>
                        <th scope="col">Motivo</th>
                        <th scope="col">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (a of adelantos(); track a.id) {
                        <tr>
                          <td>{{ a.fecha }}</td>
                          <td class="td-monto">{{ a.monto | mroCurrency }}</td>
                          <td>{{ a.motivo }}</td>
                          <td>
                            <span
                              class="adelanto-estado-badge"
                              [class.adelanto-entregado]="a.estado === 'Entregado'"
                              [class.adelanto-descontado]="a.estado === 'Descontado'"
                            >
                              {{ a.estado }}
                            </span>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <p class="empty-detail">Sin adelantos registrados.</p>
              }
            </div>
          }

          <!-- Uniformes Panel -->
          @if (activeTab() === 'uniformes') {
            <div class="tab-panel" id="panel-uniformes" role="tabpanel" aria-label="Uniformes">
              @if (uniformes().length > 0) {
                <div class="table-wrapper">
                  <table class="data-table" aria-label="Historial de uniformes">
                    <thead>
                      <tr>
                        <th scope="col">Prenda</th>
                        <th scope="col">Talle</th>
                        <th scope="col">Fecha Entrega</th>
                        <th scope="col">Fecha Devolucion</th>
                        <th scope="col">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (u of uniformes(); track u.id) {
                        <tr>
                          <td>{{ u.prenda }}</td>
                          <td>{{ u.talle }}</td>
                          <td>{{ u.fechaEntrega }}</td>
                          <td>{{ u.fechaDevolucion || '--' }}</td>
                          <td>
                            <span
                              class="uniforme-estado-badge"
                              [class.uniforme-entregado]="u.estado === 'Entregado'"
                              [class.uniforme-devuelto]="u.estado === 'Devuelto'"
                              [class.uniforme-pendiente]="u.estado === 'Pendiente'"
                            >
                              {{ u.estado }}
                            </span>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <p class="empty-detail">Sin uniformes registrados.</p>
              }
            </div>
          }
        </div>
      } @else {
        <div class="not-found">
          <h2>Empleado no encontrado</h2>
          <p>El empleado solicitado no existe o fue desvinculado.</p>
          <button class="btn btn-primary" (click)="goBack()">Volver al personal</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .perfil-container {
      max-width: 1300px;
      margin: 0 auto;
      padding-bottom: 32px;
    }

    /* ---- Top Action Bar ---- */
    .top-action-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .new-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 9999px;
      background: #DBEAFE;
      color: #1155CC;
    }

    .btn-save {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      color: white;
      background: var(--primary-orange, #F27920);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
      box-shadow: 0 1px 2px rgba(242, 121, 32, 0.2);
    }

    .btn-save:hover { background: #E06D1B; }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ---- Edit Inputs ---- */
    .edit-input {
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      color: var(--text-primary, #314158);
      background: white;
      border: 1px solid var(--primary-orange, #F27920);
      border-radius: 8px;
      outline: none;
      transition: all 0.15s ease;
      box-sizing: border-box;
    }

    .edit-input:focus {
      box-shadow: 0 0 0 3px rgba(242, 121, 32, 0.1);
    }

    .edit-input::placeholder { color: var(--slate-400); }

    .edit-input-name {
      font-size: 20px;
      font-weight: 600;
      padding: 10px 14px;
      flex: 1;
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
      margin-bottom: 24px;
    }
    .back-btn:hover { background: var(--slate-50); border-color: var(--slate-300); }

    /* ---- Top Row: 3 columns ---- */
    .top-row {
      display: grid;
      grid-template-columns: 220px 1fr 340px;
      gap: 20px;
      margin-bottom: 24px;
      align-items: start;
    }

    /* Col 1: Avatar Card */
    .image-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      overflow: hidden;
      width: 220px;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      gap: 12px;
    }

    .avatar-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar-initials {
      font-size: 38px;
      font-weight: 700;
      color: white;
      letter-spacing: 0.02em;
      user-select: none;
    }

    .avatar-rol {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .estado-badge-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 14px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 20px;
      white-space: nowrap;
    }

    /* Col 2: Info card */
    .info-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 24px;
      min-height: 200px;
      display: flex;
      flex-direction: column;
    }

    .info-name-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--slate-100);
    }

    .product-name {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-heading);
      margin: 0;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      font-size: 13px;
      font-weight: 500;
      border-radius: var(--radius-md);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; }

    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      background: transparent;
      border: none;
      color: var(--slate-300);
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.15s;
      flex-shrink: 0;
    }
    .icon-btn:hover { color: var(--text-primary); background: var(--slate-100); }

    .info-desc-section { flex: 1; }

    .section-label {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin: 0 0 12px 0;
      display: block;
    }

    .info-data-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-data-row {
      display: flex;
      gap: 24px;
    }

    .info-data-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .info-data-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-400);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .info-data-value {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-heading);
    }

    /* Col 3: CTA Grid */
    .cta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      align-content: start;
    }

    .cta-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 14px 16px;
      cursor: default;
      transition: all 0.15s;
    }
    .cta-card:hover {
      border-color: var(--primary-orange);
      box-shadow: 0 2px 8px rgba(249, 115, 22, 0.1);
    }

    .cta-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .cta-icon-label {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .cta-icon { flex-shrink: 0; }
    .cta-label { font-size: 13px; font-weight: 600; color: var(--slate-500); }

    .cta-value {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: var(--text-heading);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cta-value-price { color: var(--text-heading); }
    .cta-value-small { font-size: 14px; font-weight: 600; }
    .cta-value-email { font-size: 12px; }

    /* ---- Bottom Grid ---- */
    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .detail-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 24px;
    }
    .detail-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .detail-card-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin: 0;
    }

    /* Document list */
    .doc-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .doc-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--slate-100);
    }
    .doc-item:last-child { border-bottom: none; }

    .doc-item-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .doc-icon { flex-shrink: 0; }

    .doc-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-heading);
    }

    .doc-status-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 20px;
      white-space: nowrap;
    }
    .doc-status--vigente { background: #ECFDF5; color: #00A43D; }
    .doc-status--vencida { background: #FEF2F2; color: #DC2626; }
    .doc-status--pendiente { background: #FFFBEB; color: #92400E; }

    /* Historial list */
    .historial-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .historial-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--slate-100);
    }
    .historial-item:last-child { border-bottom: none; }

    .historial-item-left {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }

    .historial-fecha {
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-400);
    }

    .historial-desc {
      font-size: 14px;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .historial-tipo-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 20px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .tipo-fichaje { background: #DBEAFE; color: #2563EB; }
    .tipo-sancion { background: #FEF2F2; color: #DC2626; }
    .tipo-llegada-tarde { background: #FFFBEB; color: #92400E; }
    .tipo-premio { background: #ECFDF5; color: #00A43D; }
    .tipo-observacion { background: #F1F5F9; color: #5F6D7E; }

    .empty-detail {
      font-size: 13px;
      color: var(--text-secondary);
      margin: 8px 0 0;
    }

    /* ---- Tabs Section ---- */
    .tabs-section {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 24px;
    }

    .tab-pills {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .tab-pill {
      display: inline-flex;
      align-items: center;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      border-radius: 20px;
      border: 1px solid var(--slate-200);
      background: white;
      color: var(--slate-500);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .tab-pill:hover {
      border-color: var(--primary-orange);
      color: var(--primary-orange);
    }
    .tab-pill--active {
      background: var(--primary-orange);
      border-color: var(--primary-orange);
      color: white;
    }
    .tab-pill--active:hover {
      background: var(--primary-orange-hover, #E06C10);
      border-color: var(--primary-orange-hover, #E06C10);
      color: white;
    }

    .tab-panel {
      min-height: 100px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .data-table thead th {
      padding: 10px 16px;
      font-size: 12px;
      font-weight: 600;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      border-bottom: 1px solid var(--slate-200);
      background: var(--slate-50);
      white-space: nowrap;
    }

    .data-table tbody td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--slate-100);
      vertical-align: middle;
      font-size: 14px;
      color: var(--text-primary);
    }

    .data-table tbody tr:last-child td { border-bottom: none; }

    .data-table tbody tr:hover { background: var(--slate-50); }

    .td-monto {
      font-weight: 600;
      color: var(--text-heading);
    }

    .text-muted {
      color: var(--slate-300);
    }

    .extra-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 10px;
      background: #F3E8FF;
      color: #7C3AED;
    }

    .incidencia-tipo-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 20px;
      white-space: nowrap;
    }

    .adelanto-estado-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 20px;
      white-space: nowrap;
    }
    .adelanto-entregado { background: #FFFBEB; color: #92400E; }
    .adelanto-descontado { background: #ECFDF5; color: #00A43D; }

    .uniforme-estado-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 20px;
      white-space: nowrap;
    }
    .uniforme-entregado { background: #DBEAFE; color: #2563EB; }
    .uniforme-devuelto { background: #ECFDF5; color: #00A43D; }
    .uniforme-pendiente { background: #FFFBEB; color: #92400E; }

    /* ---- Not Found ---- */
    .not-found {
      text-align: center;
      padding: 80px 24px;
    }
    .not-found h2 { font-size: 22px; color: var(--text-heading); margin: 0 0 8px 0; }
    .not-found p { font-size: 14px; color: var(--slate-500); margin: 0 0 24px 0; }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 28px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background-color: var(--text-heading); color: white; }
    .btn-primary:hover:not(:disabled) { background-color: var(--text-primary); }

    /* ---- Responsive ---- */
    @media (max-width: 1100px) {
      .top-row {
        grid-template-columns: 200px 1fr 280px;
      }
    }

    @media (max-width: 900px) {
      .top-row {
        grid-template-columns: 1fr 1fr;
      }
      .image-card {
        width: 100%;
        grid-column: 1 / -1;
        min-height: auto;
        padding: 20px;
        flex-direction: row;
        gap: 16px;
      }
      .avatar-circle { width: 80px; height: 80px; }
      .avatar-initials { font-size: 28px; }
      .cta-grid { grid-template-columns: 1fr 1fr; }
      .bottom-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .info-data-row { flex-direction: column; gap: 12px; }
      .tab-pills { gap: 6px; }
      .tab-pill { padding: 6px 14px; font-size: 12px; }
      .data-table { font-size: 13px; }
      .data-table thead th { padding: 8px 12px; font-size: 11px; }
      .data-table tbody td { padding: 10px 12px; font-size: 13px; }
    }

    @media (max-width: 600px) {
      .top-row { grid-template-columns: 1fr; }
      .image-card { flex-direction: column; }
      .cta-grid { grid-template-columns: 1fr 1fr; }
      .back-btn { font-size: 13px; }
      .product-name { font-size: 18px; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadoPerfilComponent implements OnInit {
  @Input() id!: string;

  private readonly router = inject(Router);

  empleado = signal<Empleado | null>(null);
  isNew = signal(false);
  fichajes = signal<FichajeRegistro[]>([]);
  adelantos = signal<Adelanto[]>([]);
  incidencias = signal<Incidencia[]>([]);
  uniformes = signal<UniformeEntrega[]>([]);
  activeTab = signal<PerfilTab>('fichajes');

  documentos = signal<Documento[]>([
    { nombre: 'Libreta Sanitaria', icono: 'doc', estado: 'Vigente' },
    { nombre: 'Curso Manipulacion de Alimentos', icono: 'doc', estado: 'Vigente' },
    { nombre: 'Contrato', icono: 'doc', estado: 'Vigente' },
  ]);

  historialReciente = computed<HistorialItem[]>(() => {
    const emp = this.empleado();
    if (!emp) return [];

    const fichajeItems: HistorialItem[] = this.fichajes().map(f => ({
      fecha: f.fecha,
      descripcion: `Entrada: ${f.entrada}${f.salida ? ' - Salida: ' + f.salida : ' (en turno)'}`,
      tipo: 'Fichaje',
    }));

    const incidenciaItems: HistorialItem[] = this.incidencias().map(i => ({
      fecha: i.fecha,
      descripcion: i.descripcion,
      tipo: i.tipo === 'Llegada tarde' ? 'Llegada tarde'
            : i.tipo === 'Sanción' ? 'Sancion'
            : i.tipo === 'Premio' ? 'Premio'
            : 'Observacion',
    }));

    const combined = [...fichajeItems, ...incidenciaItems];
    combined.sort((a, b) => {
      const dateA = this.parseDDMMYYYY(a.fecha);
      const dateB = this.parseDDMMYYYY(b.fecha);
      return dateB - dateA;
    });

    return combined.slice(0, 5);
  });

  ngOnInit(): void {
    this.loadEmpleado();
  }

  private loadEmpleado(): void {
    if (this.id === 'nuevo') {
      this.isNew.set(true);
      this.empleado.set({
        id: 'e-' + Date.now(),
        nombre: '',
        avatar: '',
        rol: 'Mozo',
        estado: 'Trabajando',
        dni: '',
        cuil: '',
        telefono: '',
        email: '',
        contactoEmergencia: '',
        fechaIngreso: new Date().toISOString().slice(0, 10),
        sueldoBase: 0,
        valorHoraExtra: 0,
        diasFranco: [],
      });
      return;
    }

    const emp = MOCK_EMPLEADOS.find(e => e.id === this.id);
    if (!emp) {
      this.empleado.set(null);
      return;
    }

    this.empleado.set({ ...emp });

    this.fichajes.set(
      MOCK_HISTORIAL_FICHAJES.filter(f => f.empleado === emp.nombre)
    );
    this.adelantos.set(
      MOCK_ADELANTOS.filter(a => a.empleado === emp.nombre)
    );
    this.incidencias.set(
      MOCK_INCIDENCIAS.filter(i => i.empleado === emp.nombre)
    );
    this.uniformes.set(
      MOCK_UNIFORMES.filter(u => u.empleado === emp.nombre)
    );
  }

  updateField(field: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.empleado.update(emp => emp ? { ...emp, [field]: value } : emp);
  }

  onSave(): void {
    const emp = this.empleado();
    if (!emp || !emp.nombre) return;
    // In a real app, this would POST to API. For mock, just navigate back.
    this.router.navigate(['/personal']);
  }

  goBack(): void {
    this.router.navigate(['/personal']);
  }

  setTab(tab: PerfilTab): void {
    this.activeTab.set(tab);
  }

  getAvatarColor(rol: RolGastronomico): string {
    return AVATAR_COLORS[rol] ?? '#6B7280';
  }

  getInitials(nombre: string): string {
    const parts = nombre.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  getEstadoBg(estado: EstadoEmpleado): string {
    return ESTADO_BADGE[estado]?.bg ?? '#F3F4F6';
  }

  getEstadoColor(estado: EstadoEmpleado): string {
    return ESTADO_BADGE[estado]?.color ?? '#6B7280';
  }

  getEstadoDotColor(estado: EstadoEmpleado): string {
    return ESTADO_DOT_COLOR[estado] ?? '#6B7280';
  }

  formatDate(isoDate: string): string {
    if (!isoDate) return '--';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  private parseDDMMYYYY(dateStr: string): number {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return 0;
    return new Date(
      parseInt(parts[2], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[0], 10)
    ).getTime();
  }
}
