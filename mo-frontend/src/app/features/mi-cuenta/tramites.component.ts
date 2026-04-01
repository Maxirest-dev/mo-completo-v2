import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

type TabFilter = 'todos' | 'pendiente' | 'en_curso' | 'resuelto';
type EstadoTramite = 'Asignado' | 'En tramite' | 'Pendiente' | 'Resuelto';

interface Tramite {
  id: number;
  numero: string;
  motivo: string;
  tipo: string;
  concepto: string;
  lugar: string;
  fechaSeguimiento: string;
  estado: EstadoTramite;
  avatarColor: string;
  avatarLetters: string;
  notasInternas: string;
}

const MOCK_TRAMITES: Tramite[] = [
  {
    id: 1,
    numero: '56247/19621',
    motivo: 'Cambio de razon social',
    tipo: 'Legal',
    concepto: 'Lega',
    lugar: 'Autogestionado',
    fechaSeguimiento: '12/12/2025 17:00',
    estado: 'Asignado',
    avatarColor: '#F97316',
    avatarLetters: 'CR',
    notasInternas: '',
  },
  {
    id: 2,
    numero: '58312/20145',
    motivo: 'Emision de factura manual',
    tipo: 'Administrativo',
    concepto: 'Administrativo',
    lugar: '11/09/2025 12:00',
    fechaSeguimiento: '11/09/2025 12:00',
    estado: 'En tramite',
    avatarColor: '#22C55E',
    avatarLetters: 'EF',
    notasInternas: '',
  },
  {
    id: 3,
    numero: '60189/21034',
    motivo: 'Ubicacion de servicios',
    tipo: 'Servicio',
    concepto: 'Factura',
    lugar: 'Autogestionado',
    fechaSeguimiento: '10/15/2025 17:00',
    estado: 'En tramite',
    avatarColor: '#EAB308',
    avatarLetters: 'US',
    notasInternas: '',
  },
  {
    id: 4,
    numero: '61455/21987',
    motivo: 'Gestion de credito',
    tipo: 'Financiero',
    concepto: 'N/A',
    lugar: 'Pendiente',
    fechaSeguimiento: '09/22/2025',
    estado: 'Pendiente',
    avatarColor: '#EF4444',
    avatarLetters: 'GC',
    notasInternas: '',
  },
  {
    id: 5,
    numero: '63078/22456',
    motivo: 'Soporte tecnico acceso',
    tipo: 'Soporte',
    concepto: 'Zocm',
    lugar: 'Autogestionado',
    fechaSeguimiento: '08/15/2025',
    estado: 'Resuelto',
    avatarColor: '#3B82F6',
    avatarLetters: 'ST',
    notasInternas: '',
  },
  {
    id: 6,
    numero: '64901/23112',
    motivo: 'Verificacion de certificado',
    tipo: 'Legal',
    concepto: 'Lega',
    lugar: 'Autogestionado',
    fechaSeguimiento: '07/10/2025',
    estado: 'Resuelto',
    avatarColor: '#8B5CF6',
    avatarLetters: 'VC',
    notasInternas: '',
  },
];

@Component({
  selector: 'app-tramites',
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
        <h1 class="page-title">Mis Tramites</h1>
        <p class="page-subtitle">Lleva control de tus gestiones</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="filter-tabs">
          @for (tab of tabs(); track tab.key) {
            <button
              class="filter-tab"
              [class.filter-tab--active]="activeTab() === tab.key"
              (click)="activeTab.set(tab.key)">
              {{ tab.label }}
              <span class="filter-tab-count" [class.filter-tab-count--active]="activeTab() === tab.key">{{ tab.count }}</span>
            </button>
          }
        </div>
      </div>
      <div class="toolbar-right">
        <div class="search-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="Buscar tramite..."
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set(\$event)" />
        </div>
        <button class="btn-primary" (click)="openChat()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo tramite
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>MOTIVO</th>
              <th>CONCEPTO</th>
              <th>LUGAR</th>
              <th>FECHA DE SEGUIMIENTO</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            @for (tramite of filteredTramites(); track tramite.id) {
              <tr>
                <td>
                  <div class="motivo-cell">
                    <div class="avatar" [style.background]="tramite.avatarColor">
                      {{ tramite.avatarLetters }}
                    </div>
                    <div class="motivo-info">
                      <span class="motivo-name">{{ tramite.motivo }}</span>
                      <span class="motivo-tipo">{{ tramite.tipo }}</span>
                    </div>
                  </div>
                </td>
                <td>{{ tramite.concepto }}</td>
                <td>{{ tramite.lugar }}</td>
                <td>{{ tramite.fechaSeguimiento }}</td>
                <td>
                  <span class="estado-badge" [ngClass]="getEstadoClass(tramite.estado)">
                    {{ tramite.estado }}
                  </span>
                </td>
                <td>
                  <button class="btn-action" (click)="openDetail(tramite)">
                    Ver detalle
                  </button>
                </td>
              </tr>
            }
            @if (filteredTramites().length === 0) {
              <tr>
                <td colspan="6" class="empty-row">
                  No se encontraron tramites
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Dialog Overlay -->
    @if (showDetail()) {
      <div class="dialog-overlay" (click)="closeDetail()">
        <div class="dialog" (click)="\$event.stopPropagation()">
          <div class="dialog-header">
            <div class="dialog-header-left">
              <h2 class="dialog-title">Tramite #{{ selectedTramite()?.numero }}</h2>
              <span class="estado-badge" [ngClass]="getEstadoClass(selectedTramite()?.estado ?? 'Pendiente')">
                {{ selectedTramite()?.estado }}
              </span>
            </div>
            <button class="dialog-close" (click)="closeDetail()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="dialog-info-row">
            <div class="dialog-info-item">
              <span class="dialog-info-label">Fecha alta</span>
              <span class="dialog-info-value">{{ selectedTramite()?.fechaSeguimiento }}</span>
            </div>
            <div class="dialog-info-item">
              <span class="dialog-info-label">Concepto</span>
              <span class="dialog-info-value">{{ selectedTramite()?.concepto }}</span>
            </div>
            <div class="dialog-info-item">
              <span class="dialog-info-label">Rubro</span>
              <span class="dialog-info-value">{{ selectedTramite()?.tipo }}</span>
            </div>
            <div class="dialog-info-item">
              <span class="dialog-info-label">Hora</span>
              <span class="dialog-info-value">17:00</span>
            </div>
          </div>

          <div class="dialog-notes">
            <label class="dialog-notes-label">Notas internas</label>
            <textarea
              class="dialog-notes-input"
              placeholder="Agrega comentarios sobre este..."
              rows="4"
              [ngModel]="detailNotes()"
              (ngModelChange)="detailNotes.set(\$event)"></textarea>
          </div>

          <div class="dialog-actions">
            <button class="btn-secondary" (click)="closeDetail()">Imprimir</button>
            <button class="btn-primary" (click)="closeDetail()">Guardar y salir</button>
          </div>
        </div>
      </div>
    }

    <!-- Chat Widget -->
    @if (showChat()) {
      <div class="chat-widget">
        <div class="chat-header">
          <div class="chat-header-left">
            <div class="chat-bot-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <span class="chat-header-title">Bot Maxirest</span>
          </div>
          <button class="chat-close" (click)="showChat.set(false)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="chat-body">
          <div class="chat-bubble">
            Hola! Soy el asistente virtual de Maxirest. Como puedo ayudarte? Escribi tu consulta y te vamos a guiar.
          </div>
          <div class="chat-quick-actions">
            <button class="quick-action-pill">Nuevo reclamo</button>
            <button class="quick-action-pill">Consulta de estado</button>
            <button class="quick-action-pill">Facturacion</button>
            <button class="quick-action-pill">Soporte tecnico</button>
          </div>
        </div>
        <div class="chat-footer">
          <input
            type="text"
            class="chat-input"
            placeholder="Escribi tu consulta..."
            [ngModel]="chatMessage()"
            (ngModelChange)="chatMessage.set(\$event)"
            (keydown.enter)="sendMessage()" />
          <button class="chat-send" (click)="sendMessage()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    /* ===== Header ===== */
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

    /* ===== Toolbar ===== */
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .filter-tabs {
      display: flex;
      gap: 6px;
      background: #F3F4F6;
      border-radius: 10px;
      padding: 4px;
    }

    .filter-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #6B7280;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .filter-tab:hover {
      color: #374151;
    }
    .filter-tab--active {
      background: white;
      color: #111827;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .filter-tab-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 9999px;
      background: #E5E7EB;
      color: #6B7280;
      font-size: 11px;
      font-weight: 600;
    }
    .filter-tab-count--active {
      background: #F97316;
      color: white;
    }

    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      color: #9CA3AF;
      pointer-events: none;
    }
    .search-input {
      padding: 8px 12px 8px 36px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 13px;
      color: #374151;
      background: white;
      width: 220px;
      outline: none;
      transition: border-color 0.15s;
    }
    .search-input::placeholder {
      color: #9CA3AF;
    }
    .search-input:focus {
      border-color: #F97316;
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 20px;
      border: none;
      border-radius: 8px;
      background: #F97316;
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
      white-space: nowrap;
    }
    .btn-primary:hover {
      background: #EA580C;
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 20px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      background: white;
      color: #374151;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-secondary:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
    }

    /* ===== Table ===== */
    .table-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      overflow: hidden;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead tr {
      background: #F3F4F6;
    }

    .data-table th {
      padding: 12px 16px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    .data-table td {
      padding: 14px 16px;
      font-size: 13px;
      color: #374151;
      border-top: 1px solid #F3F4F6;
      vertical-align: middle;
    }

    .data-table tbody tr {
      transition: background 0.1s ease;
    }
    .data-table tbody tr:hover {
      background: #FAFAFA;
    }

    .motivo-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .motivo-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .motivo-name {
      font-weight: 500;
      color: #111827;
      white-space: nowrap;
    }
    .motivo-tipo {
      font-size: 12px;
      color: #9CA3AF;
    }

    .estado-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }
    .estado--asignado {
      background: #FFF7ED;
      color: #EA580C;
      border: 1px solid #FED7AA;
    }
    .estado--en-tramite {
      background: #EFF6FF;
      color: #2563EB;
      border: 1px solid #BFDBFE;
    }
    .estado--resuelto {
      background: #F0FDF4;
      color: #16A34A;
      border: 1px solid #BBF7D0;
    }
    .estado--pendiente {
      background: #FEF2F2;
      color: #DC2626;
      border: 1px solid #FECACA;
    }

    .btn-action {
      padding: 6px 14px;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      background: white;
      color: #374151;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .btn-action:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
    }

    .empty-row {
      text-align: center;
      color: #9CA3AF;
      padding: 40px 16px !important;
      font-size: 14px;
    }

    /* ===== Dialog ===== */
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .dialog {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 560px;
      padding: 28px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    }

    .dialog-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .dialog-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .dialog-title {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .dialog-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 8px;
      background: #F3F4F6;
      color: #6B7280;
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .dialog-close:hover {
      background: #E5E7EB;
      color: #374151;
    }

    .dialog-info-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      padding: 16px;
      background: #F9FAFB;
      border-radius: 10px;
      margin-bottom: 24px;
    }

    .dialog-info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .dialog-info-label {
      font-size: 11px;
      font-weight: 600;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .dialog-info-value {
      font-size: 13px;
      font-weight: 500;
      color: #111827;
    }

    .dialog-notes {
      margin-bottom: 24px;
    }

    .dialog-notes-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }

    .dialog-notes-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 13px;
      color: #374151;
      font-family: inherit;
      resize: vertical;
      outline: none;
      transition: border-color 0.15s;
      box-sizing: border-box;
    }
    .dialog-notes-input::placeholder {
      color: #9CA3AF;
    }
    .dialog-notes-input:focus {
      border-color: #F97316;
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    /* ===== Chat Widget ===== */
    .chat-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 360px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      z-index: 999;
      display: flex;
      flex-direction: column;
      background: white;
    }

    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
      color: white;
    }

    .chat-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .chat-bot-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .chat-header-title {
      font-size: 15px;
      font-weight: 600;
    }

    .chat-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.15);
      color: white;
      cursor: pointer;
      transition: background 0.15s;
    }
    .chat-close:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    .chat-body {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .chat-bubble {
      background: #F3F4F6;
      border-radius: 12px 12px 12px 4px;
      padding: 14px 16px;
      font-size: 13px;
      color: #374151;
      line-height: 1.6;
    }

    .chat-quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .quick-action-pill {
      padding: 6px 14px;
      border: 1px solid #FED7AA;
      border-radius: 9999px;
      background: #FFF7ED;
      color: #EA580C;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .quick-action-pill:hover {
      background: #FFEDD5;
      border-color: #FDBA74;
    }

    .chat-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid #F3F4F6;
    }

    .chat-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 13px;
      color: #374151;
      outline: none;
      transition: border-color 0.15s;
    }
    .chat-input::placeholder {
      color: #9CA3AF;
    }
    .chat-input:focus {
      border-color: #F97316;
    }

    .chat-send {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border: none;
      border-radius: 8px;
      background: #F97316;
      color: white;
      cursor: pointer;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .chat-send:hover {
      background: #EA580C;
    }

    /* ===== Responsive ===== */
    @media (max-width: 1024px) {
      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      .toolbar-left, .toolbar-right {
        width: 100%;
      }
      .filter-tabs {
        overflow-x: auto;
      }
      .toolbar-right {
        justify-content: flex-end;
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 22px;
      }
      .dialog-info-row {
        grid-template-columns: repeat(2, 1fr);
      }
      .chat-widget {
        width: calc(100% - 32px);
        right: 16px;
        bottom: 16px;
      }
      .search-input {
        width: 160px;
      }
    }

    @media (max-width: 480px) {
      .toolbar-right {
        flex-direction: column;
      }
      .search-input {
        width: 100%;
      }
      .dialog-info-row {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class TramitesComponent {
  private readonly router = inject(Router);

  readonly activeTab = signal<TabFilter>('todos');
  readonly searchQuery = signal('');
  readonly showDetail = signal(false);
  readonly showChat = signal(false);
  readonly selectedTramite = signal<Tramite | null>(null);
  readonly detailNotes = signal('');
  readonly chatMessage = signal('');

  private readonly allTramites = signal(MOCK_TRAMITES);

  readonly tabs = computed(() => {
    const all = this.allTramites();
    return [
      { key: 'todos' as TabFilter, label: 'Todos', count: all.length },
      { key: 'pendiente' as TabFilter, label: 'Pendiente a sol', count: all.filter(t => t.estado === 'Pendiente' || t.estado === 'Asignado').length },
      { key: 'en_curso' as TabFilter, label: 'En curso', count: all.filter(t => t.estado === 'En tramite').length },
      { key: 'resuelto' as TabFilter, label: 'Resuelto', count: all.filter(t => t.estado === 'Resuelto').length },
    ];
  });

  readonly filteredTramites = computed(() => {
    let result = this.allTramites();
    const tab = this.activeTab();
    const query = this.searchQuery().toLowerCase().trim();

    if (tab === 'pendiente') {
      result = result.filter(t => t.estado === 'Pendiente' || t.estado === 'Asignado');
    } else if (tab === 'en_curso') {
      result = result.filter(t => t.estado === 'En tramite');
    } else if (tab === 'resuelto') {
      result = result.filter(t => t.estado === 'Resuelto');
    }

    if (query) {
      result = result.filter(t =>
        t.motivo.toLowerCase().includes(query) ||
        t.concepto.toLowerCase().includes(query) ||
        t.tipo.toLowerCase().includes(query) ||
        t.numero.includes(query)
      );
    }

    return result;
  });

  getEstadoClass(estado: EstadoTramite | string): string {
    switch (estado) {
      case 'Asignado': return 'estado--asignado';
      case 'En tramite': return 'estado--en-tramite';
      case 'Resuelto': return 'estado--resuelto';
      case 'Pendiente': return 'estado--pendiente';
      default: return '';
    }
  }

  goBack(): void {
    this.router.navigate(['/mi-cuenta']);
  }

  openDetail(tramite: Tramite): void {
    this.selectedTramite.set(tramite);
    this.detailNotes.set(tramite.notasInternas);
    this.showDetail.set(true);
  }

  closeDetail(): void {
    this.showDetail.set(false);
    this.selectedTramite.set(null);
  }

  openChat(): void {
    this.showChat.set(true);
  }

  sendMessage(): void {
    if (this.chatMessage().trim()) {
      this.chatMessage.set('');
    }
  }
}
