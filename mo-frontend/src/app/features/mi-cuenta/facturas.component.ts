import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

type TabFilter = 'todas' | 'facturadas' | 'vencidas' | 'pagas';
type EstadoFactura = 'Paga' | 'Emitida' | 'Vencida';

interface Factura {
  id: number;
  nombre: string;
  fechaEmision: string;
  estado: EstadoFactura;
  fechaVencimiento: string;
  total: number;
}

interface LineItem {
  id: number;
  descripcion: string;
  monto: number;
  checked: boolean;
}

interface MetodoPago {
  id: string;
  nombre: string;
  descripcion: string;
  icon: string;
}

const MOCK_FACTURAS: Factura[] = [
  { id: 1, nombre: 'A 0045-00183851', fechaEmision: '15/01/2026', estado: 'Paga', fechaVencimiento: '15/02/2026', total: 142500 },
  { id: 2, nombre: 'A 0045-00183852', fechaEmision: '15/02/2026', estado: 'Paga', fechaVencimiento: '15/03/2026', total: 156200 },
  { id: 3, nombre: 'A 0045-00183853', fechaEmision: '15/03/2026', estado: 'Emitida', fechaVencimiento: '15/04/2026', total: 168700 },
  { id: 4, nombre: 'A 0045-00183854', fechaEmision: '01/02/2026', estado: 'Paga', fechaVencimiento: '01/03/2026', total: 145300 },
  { id: 5, nombre: 'A 0045-00183855', fechaEmision: '01/03/2026', estado: 'Emitida', fechaVencimiento: '01/04/2026', total: 172400 },
  { id: 6, nombre: 'A 0045-00183856', fechaEmision: '20/12/2025', estado: 'Vencida', fechaVencimiento: '20/01/2026', total: 139800 },
  { id: 7, nombre: 'A 0045-00183857', fechaEmision: '01/01/2026', estado: 'Paga', fechaVencimiento: '01/02/2026', total: 180100 },
  { id: 8, nombre: 'A 0045-00183858', fechaEmision: '20/01/2026', estado: 'Emitida', fechaVencimiento: '20/02/2026', total: 151600 },
  { id: 9, nombre: 'A 0045-00183859', fechaEmision: '10/02/2026', estado: 'Paga', fechaVencimiento: '10/03/2026', total: 163900 },
  { id: 10, nombre: 'A 0045-00183860', fechaEmision: '25/02/2026', estado: 'Emitida', fechaVencimiento: '25/03/2026', total: 147200 },
];

const MOCK_LINE_ITEMS: LineItem[] = [
  { id: 1, descripcion: 'Servicio MRO - Plan Profesional', monto: 89000, checked: true },
  { id: 2, descripcion: 'Modulo Inventario Avanzado', monto: 32500, checked: true },
  { id: 3, descripcion: 'Soporte Premium 24/7', monto: 18200, checked: false },
  { id: 4, descripcion: 'Integracion con MercadoPago', monto: 12800, checked: false },
  { id: 5, descripcion: 'Backup en la nube - 50GB', monto: 16200, checked: true },
];

const METODOS_PAGO: MetodoPago[] = [
  { id: 'mercadopago', nombre: 'MercadoPago', descripcion: 'Paga con tu cuenta de MercadoPago de forma segura', icon: 'MP' },
  { id: 'mastercard', nombre: 'MasterCard', descripcion: '**** **** **** 7891 - Venc. 08/27', icon: 'MC' },
  { id: 'visa', nombre: 'Visa', descripcion: '**** **** **** 4532 - Venc. 12/28', icon: 'V' },
  { id: 'rappipay', nombre: 'RappiPay', descripcion: 'Paga con tu billetera RappiPay', icon: 'RP' },
  { id: 'tarjeta', nombre: 'Tarjeta', descripcion: 'Ingresa los datos de una nueva tarjeta', icon: 'TC' },
  { id: 'modoanticipo', nombre: 'ModoAnticipo', descripcion: 'Paga con anticipos acumulados en Modo', icon: 'MA' },
  { id: 'efectivo', nombre: 'Efectivo', descripcion: 'Genera un cupon para pagar en efectivo', icon: 'EF' },
];

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="facturas-layout">
      <!-- LEFT COLUMN -->
      <div class="facturas-main">
        <!-- Header -->
        <div class="page-header">
          <button class="back-btn" (click)="goBack()" title="Volver">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div class="page-header-info">
            <h1 class="page-title">Mis Facturas</h1>
            <p class="page-subtitle">Administra las facturas de tu negocio</p>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
          @for (tab of tabs; track tab.key) {
            <button
              class="filter-tab"
              [class.filter-tab--active]="activeTab() === tab.key"
              (click)="activeTab.set(tab.key)">
              {{ tab.label }}
              <span class="filter-tab-count">{{ tab.count() }}</span>
            </button>
          }
        </div>

        <!-- Table Card -->
        <div class="table-card">
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>NOMBRE / FECHA</th>
                  <th>ESTADO</th>
                  <th>VENC. / REGISTRADO</th>
                  <th>TOTAL</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                @for (factura of filteredFacturas(); track factura.id) {
                  <tr>
                    <td>
                      <div class="cell-nombre">
                        <span class="nombre-text">{{ factura.nombre }}</span>
                        <span class="nombre-fecha">{{ factura.fechaEmision }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="estado-badge"
                        [class.estado-badge--green]="factura.estado === 'Paga'"
                        [class.estado-badge--orange]="factura.estado === 'Emitida'"
                        [class.estado-badge--red]="factura.estado === 'Vencida'">
                        {{ factura.estado }}
                      </span>
                    </td>
                    <td>
                      <span class="cell-fecha">{{ factura.fechaVencimiento }}</span>
                    </td>
                    <td>
                      <span class="cell-total">\${{ formatNumber(factura.total) }}</span>
                    </td>
                    <td>
                      <div class="cell-actions">
                        <button class="action-btn action-btn--outline" (click)="openDetalle(factura)">Ver detalle</button>
                        <button class="action-btn action-btn--ghost">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Descargar
                        </button>
                      </div>
                    </td>
                  </tr>
                }
                @empty {
                  <tr>
                    <td colspan="5" class="empty-row">No se encontraron facturas</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN (sidebar) -->
      <div class="facturas-sidebar">
        <!-- Saldo Card -->
        <div class="sidebar-card">
          <h4 class="sidebar-card-label">SALDO</h4>
          <p class="saldo-amount">\$420,000</p>
          <button class="btn-pagar" (click)="openPagarFlow()">Pagar</button>
        </div>

        <!-- Debito Automatico Card -->
        <div class="sidebar-card">
          <h4 class="sidebar-card-label">DEBITO AUTOMATICO</h4>
          <div class="debito-toggle-row">
            <span class="debito-toggle-text">Activar debito automatico</span>
            <label class="toggle-switch">
              <input type="checkbox" [checked]="debitoAutomatico()" (change)="debitoAutomatico.set(!debitoAutomatico())" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="debito-options">
            <label class="debito-option">
              <input type="radio" name="debito-method" value="visa" checked />
              <div class="debito-option-info">
                <span class="debito-option-name">Visa terminada en 4532</span>
                <span class="debito-option-detail">Tarjeta de credito</span>
              </div>
            </label>
            <label class="debito-option">
              <input type="radio" name="debito-method" value="cbu" />
              <div class="debito-option-info">
                <span class="debito-option-name">CBU via Mercado Pago</span>
                <span class="debito-option-detail">Cuenta bancaria</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Adherirse Card -->
        <div class="sidebar-card">
          <h4 class="sidebar-card-label">ADHERIRSE</h4>
          <p class="adherirse-text">Adherite al servicio de facturacion electronica y recibi tus comprobantes de forma automatica.</p>
          <a class="ver-mas-link" href="javascript:void(0)">Ver mas</a>
        </div>
      </div>
    </div>

    <!-- DIALOG: Detalle/Pagar factura -->
    @if (showDetalle()) {
      <div class="dialog-backdrop" (click)="closeDetalle()">
        <div class="dialog-panel" (click)="$event.stopPropagation()">
          @if (pagarFlow()) {
            <!-- Pagar flow: seleccionar conceptos -->
            <div class="dialog-header">
              <div>
                <h2 class="dialog-title">Detalle de factura</h2>
                <p class="dialog-subtitle">Selecciona los conceptos a pagar</p>
              </div>
              <button class="dialog-close" (click)="closeDetalle()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="dialog-body">
              <div class="line-items">
                @for (item of lineItems(); track item.id) {
                  <label class="line-item">
                    <input type="checkbox" [checked]="item.checked" (change)="toggleLineItem(item.id)" />
                    <span class="line-item-desc">{{ item.descripcion }}</span>
                    <span class="line-item-amount">\${{ formatNumber(item.monto) }}</span>
                  </label>
                }
              </div>
              <div class="dialog-total-row">
                <span class="dialog-total-label">Total a pagar</span>
                <span class="dialog-total-amount">\${{ formatNumber(detalleTotal()) }}</span>
              </div>
            </div>
            <div class="dialog-footer">
              <button class="btn-dialog btn-dialog--secondary" (click)="closeDetalle()">Cancelar</button>
              <button class="btn-dialog btn-dialog--primary" (click)="advanceToPago()">Continuar</button>
            </div>
          } @else {
            <!-- Ver detalle: lectura de factura especifica -->
            <div class="dialog-header">
              <div>
                <h2 class="dialog-title">{{ detalleFactura()?.nombre }}</h2>
                <p class="dialog-subtitle">Fecha: {{ detalleFactura()?.fechaEmision }}</p>
              </div>
              <button class="dialog-close" (click)="closeDetalle()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="dialog-body">
              <div class="factura-detail-info">
                <div class="factura-detail-row">
                  <span class="factura-detail-label">Estado</span>
                  <span class="factura-detail-badge" [class]="'badge--' + detalleFactura()?.estado?.toLowerCase()">{{ detalleFactura()?.estado }}</span>
                </div>
                <div class="factura-detail-row">
                  <span class="factura-detail-label">Vencimiento</span>
                  <span class="factura-detail-value">{{ detalleFactura()?.fechaVencimiento }}</span>
                </div>
                <div class="factura-detail-row">
                  <span class="factura-detail-label">Registrado</span>
                  <span class="factura-detail-value">{{ detalleFactura()?.fechaEmision }}</span>
                </div>
              </div>
              <div class="line-items">
                @for (item of lineItems(); track item.id) {
                  <div class="line-item line-item--readonly">
                    <span class="line-item-dot"></span>
                    <span class="line-item-desc">{{ item.descripcion }}</span>
                    <span class="line-item-amount">\${{ formatNumber(item.monto) }}</span>
                  </div>
                }
              </div>
              <div class="dialog-total-row">
                <span class="dialog-total-label">Total</span>
                <span class="dialog-total-amount">\${{ formatNumber(detalleFactura()?.total ?? 0) }}</span>
              </div>
            </div>
            <div class="dialog-footer">
              <button class="btn-dialog btn-dialog--secondary" (click)="closeDetalle()">Cerrar</button>
              <button class="btn-dialog btn-dialog--primary" (click)="closeDetalle()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Descargar
              </button>
            </div>
          }
        </div>
      </div>
    }

    <!-- DIALOG 2: Elegir forma de pago -->
    @if (showPago()) {
      <div class="dialog-backdrop" (click)="closePago()">
        <div class="dialog-panel dialog-panel--pago" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <div>
              <h2 class="dialog-title">Elegi tu forma de pagar</h2>
              <p class="dialog-subtitle">Selecciona un metodo de pago para continuar</p>
            </div>
            <button class="dialog-close" (click)="closePago()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="dialog-body">
            <div class="metodos-list">
              @for (metodo of metodosPago; track metodo.id) {
                <label class="metodo-item" [class.metodo-item--selected]="selectedMetodo() === metodo.id">
                  <input type="radio" name="metodo-pago" [value]="metodo.id" [checked]="selectedMetodo() === metodo.id" (change)="selectedMetodo.set(metodo.id)" />
                  <div class="metodo-icon">{{ metodo.icon }}</div>
                  <div class="metodo-info">
                    <span class="metodo-nombre">{{ metodo.nombre }}</span>
                    <span class="metodo-desc">{{ metodo.descripcion }}</span>
                  </div>
                </label>
              }
            </div>
          </div>
          <div class="dialog-footer">
            <button class="btn-dialog btn-dialog--secondary" (click)="limpiarMetodo()">Limpiar</button>
            <button class="btn-dialog btn-dialog--primary" [disabled]="!selectedMetodo()" (click)="closePago()">Ir a pagar</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    /* ───── Layout ───── */
    .facturas-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* ───── Header ───── */
    .page-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
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
      margin-top: 2px;
    }
    .back-btn:hover {
      background: var(--slate-50);
      border-color: var(--slate-300);
    }

    .page-title {
      font-size: 26px;
      font-weight: 600;
      color: var(--slate-900);
      margin: 0 0 4px;
      letter-spacing: -0.01em;
    }
    .page-subtitle {
      font-size: 14px;
      color: var(--slate-500);
      margin: 0;
    }

    /* ───── Filter Tabs ───── */
    .filter-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .filter-tab {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: var(--radius-full);
      border: 1px solid var(--slate-200);
      background: white;
      color: var(--slate-500);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .filter-tab:hover {
      border-color: var(--slate-300);
      background: var(--slate-50);
    }
    .filter-tab--active {
      background: var(--slate-900);
      color: white;
      border-color: var(--slate-900);
    }
    .filter-tab--active:hover {
      background: var(--slate-800);
      border-color: var(--slate-800);
    }

    .filter-tab-count {
      background: rgba(0, 0, 0, 0.08);
      padding: 1px 7px;
      border-radius: var(--radius-full);
      font-size: 11px;
      font-weight: 600;
    }
    .filter-tab--active .filter-tab-count {
      background: rgba(255, 255, 255, 0.2);
    }

    /* ───── Table Card ───── */
    .table-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead tr {
      background: var(--slate-100);
    }

    .data-table th {
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-500);
      text-align: left;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--slate-200);
      white-space: nowrap;
    }

    .data-table td {
      padding: 14px 16px;
      font-size: 14px;
      color: var(--slate-700);
      border-bottom: 1px solid var(--slate-100);
      vertical-align: middle;
    }

    .data-table tbody tr:hover {
      background: var(--slate-50);
    }

    .data-table tbody tr:last-child td {
      border-bottom: none;
    }

    /* Table cells */
    .cell-nombre {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nombre-text {
      font-weight: 600;
      color: var(--slate-900);
      font-size: 14px;
    }
    .nombre-fecha {
      font-size: 12px;
      color: var(--slate-400);
    }

    .estado-badge {
      display: inline-flex;
      padding: 4px 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
    }
    .estado-badge--green {
      background: #F0FDF4;
      color: #16A34A;
      border: 1px solid #BBF7D0;
    }
    .estado-badge--orange {
      background: var(--primary-orange-light);
      color: var(--primary-orange-hover);
      border: 1px solid var(--primary-orange-lighter);
    }
    .estado-badge--red {
      background: #FEF2F2;
      color: #DC2626;
      border: 1px solid #FECACA;
    }

    .cell-fecha {
      font-size: 13px;
      color: var(--slate-500);
    }

    .cell-total {
      font-weight: 600;
      color: var(--slate-900);
    }

    .cell-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 500;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }
    .action-btn--outline {
      background: white;
      border: 1px solid var(--slate-200);
      color: var(--slate-700);
    }
    .action-btn--outline:hover {
      background: var(--slate-50);
      border-color: var(--slate-300);
    }
    .action-btn--ghost {
      background: transparent;
      border: 1px solid transparent;
      color: var(--slate-500);
    }
    .action-btn--ghost:hover {
      background: var(--slate-100);
      color: var(--slate-700);
    }

    .empty-row {
      text-align: center;
      padding: 40px 16px !important;
      color: var(--slate-400);
      font-size: 14px;
    }

    /* ───── Sidebar ───── */
    .facturas-sidebar {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sidebar-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-lg);
      padding: 20px;
      box-shadow: var(--shadow-sm);
    }

    .sidebar-card-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-400);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 12px;
    }

    .saldo-amount {
      font-size: 32px;
      font-weight: 700;
      color: var(--slate-900);
      margin: 0 0 16px;
      letter-spacing: -0.02em;
    }

    .btn-pagar {
      width: 100%;
      padding: 12px;
      border-radius: var(--radius-md);
      border: none;
      background: #22C55E;
      color: white;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .btn-pagar:hover {
      background: #16A34A;
    }

    /* Debito toggle */
    .debito-toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .debito-toggle-text {
      font-size: 13px;
      color: var(--slate-700);
      font-weight: 500;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background: var(--slate-300);
      border-radius: 24px;
      transition: 0.2s;
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: 0.2s;
    }
    .toggle-switch input:checked + .toggle-slider {
      background: #22C55E;
    }
    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(20px);
    }

    .debito-options {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .debito-option {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      cursor: pointer;
      padding: 10px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--slate-100);
      transition: background 0.15s;
    }
    .debito-option:hover { background: var(--slate-50); }
    .debito-option input[type="radio"] {
      margin-top: 3px;
      accent-color: #22C55E;
    }
    .debito-option-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .debito-option-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--slate-900);
    }
    .debito-option-detail {
      font-size: 12px;
      color: var(--slate-400);
    }

    /* Adherirse */
    .adherirse-text {
      font-size: 13px;
      color: var(--slate-500);
      line-height: 1.6;
      margin: 0 0 12px;
    }
    .ver-mas-link {
      font-size: 13px;
      font-weight: 600;
      color: #3B82F6;
      text-decoration: none;
      cursor: pointer;
    }
    .ver-mas-link:hover {
      text-decoration: underline;
    }

    /* ───── Dialog Shared ───── */
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 24px;
    }

    .dialog-panel {
      background: white;
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 540px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-lg);
    }
    .dialog-panel--pago {
      max-width: 480px;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px 24px 0;
    }

    .dialog-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--slate-900);
      margin: 0 0 4px;
    }
    .dialog-subtitle {
      font-size: 13px;
      color: var(--slate-500);
      margin: 0;
    }

    .dialog-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      border: none;
      background: transparent;
      color: var(--slate-400);
      cursor: pointer;
      transition: all 0.15s;
    }
    .dialog-close:hover {
      background: var(--slate-100);
      color: var(--slate-700);
    }

    .dialog-body {
      padding: 20px 24px;
      overflow-y: auto;
      flex: 1;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px 24px;
      border-top: 1px solid var(--slate-100);
    }

    .btn-dialog {
      padding: 10px 24px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      border: none;
    }
    .btn-dialog--secondary {
      background: white;
      border: 1px solid var(--slate-200);
      color: var(--slate-700);
    }
    .btn-dialog--secondary:hover {
      background: var(--slate-50);
      border-color: var(--slate-300);
    }
    .btn-dialog--primary {
      background: var(--slate-900);
      color: white;
    }
    .btn-dialog--primary:hover {
      background: var(--slate-800);
    }
    .btn-dialog--primary:disabled {
      background: var(--slate-300);
      color: var(--slate-400);
      cursor: not-allowed;
    }

    /* ───── Dialog 1: Line Items ───── */
    .line-items {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .line-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 12px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background 0.15s;
    }
    .line-item:hover { background: var(--slate-50); }
    .line-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary-orange);
      flex-shrink: 0;
    }
    .line-item-desc {
      flex: 1;
      font-size: 14px;
      color: var(--slate-700);
    }
    .line-item--readonly {
      cursor: default; padding: 10px 0; border-bottom: 1px solid var(--slate-100);
      display: flex; align-items: center; gap: 10px;
    }
    .line-item--readonly:last-child { border-bottom: none; }
    .line-item-dot {
      width: 6px; height: 6px; border-radius: 50%; background: var(--primary-orange); flex-shrink: 0;
    }
    .factura-detail-info {
      padding: 16px; background: var(--slate-50); border-radius: var(--radius-sm); margin-bottom: 16px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .factura-detail-row { display: flex; justify-content: space-between; align-items: center; }
    .factura-detail-label { font-size: 13px; color: var(--slate-500); }
    .factura-detail-value { font-size: 13px; font-weight: 500; color: var(--slate-800); }
    .factura-detail-badge {
      font-size: 12px; font-weight: 500; padding: 2px 10px; border-radius: var(--radius-full);
    }
    .badge--paga { background: #D1FAE5; color: #065F46; }
    .badge--emitida { background: var(--primary-orange-light); color: var(--primary-orange-hover); }
    .badge--vencida { background: #FEE2E2; color: #991B1B; }

    .line-item-amount {
      font-size: 14px;
      font-weight: 600;
      color: var(--slate-900);
      white-space: nowrap;
    }

    .dialog-total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 12px;
      margin-top: 8px;
      background: var(--primary-orange-light);
      border-radius: var(--radius-md);
      border: 1px solid var(--primary-orange-lighter);
    }
    .dialog-total-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-orange-hover);
    }
    .dialog-total-amount {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary-orange-hover);
    }

    /* ───── Dialog 2: Metodos de Pago ───── */
    .metodos-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .metodo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--slate-100);
      cursor: pointer;
      transition: all 0.15s;
    }
    .metodo-item:hover {
      background: var(--slate-50);
      border-color: var(--slate-200);
    }
    .metodo-item--selected {
      background: #F0FDF4;
      border-color: #22C55E;
    }
    .metodo-item input[type="radio"] {
      accent-color: #22C55E;
      flex-shrink: 0;
    }

    .metodo-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--slate-100);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: var(--slate-700);
      flex-shrink: 0;
    }

    .metodo-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .metodo-nombre {
      font-size: 14px;
      font-weight: 600;
      color: var(--slate-900);
    }
    .metodo-desc {
      font-size: 12px;
      color: var(--slate-400);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ───── Responsive ───── */
    @media (max-width: 1024px) {
      .facturas-layout {
        grid-template-columns: 1fr;
      }
      .facturas-sidebar {
        flex-direction: row;
        flex-wrap: wrap;
      }
      .facturas-sidebar .sidebar-card {
        flex: 1;
        min-width: 240px;
      }
    }

    @media (max-width: 768px) {
      .page-title { font-size: 22px; }
      .facturas-sidebar {
        flex-direction: column;
      }
      .cell-actions {
        flex-direction: column;
        gap: 4px;
      }
      .saldo-amount { font-size: 28px; }
    }
  `],
})
export class FacturasComponent {
  private readonly router = inject(Router);

  /* ── State ── */
  readonly activeTab = signal<TabFilter>('todas');
  readonly debitoAutomatico = signal(false);
  readonly showDetalle = signal(false);
  readonly showPago = signal(false);
  readonly pagarFlow = signal(false);
  readonly detalleFactura = signal<Factura | null>(null);
  readonly selectedMetodo = signal<string | null>(null);
  readonly lineItems = signal<LineItem[]>(
    MOCK_LINE_ITEMS.map(item => ({ ...item }))
  );

  /* ── Data ── */
  readonly metodosPago = METODOS_PAGO;
  private readonly facturas = signal<Factura[]>(MOCK_FACTURAS);

  /* ── Computed ── */
  readonly countTodas = computed(() => this.facturas().length);
  readonly countFacturadas = computed(() => this.facturas().filter(f => f.estado === 'Emitida').length);
  readonly countVencidas = computed(() => this.facturas().filter(f => f.estado === 'Vencida').length);
  readonly countPagas = computed(() => this.facturas().filter(f => f.estado === 'Paga').length);

  readonly tabs = [
    { key: 'todas' as TabFilter, label: 'Todas', count: this.countTodas },
    { key: 'facturadas' as TabFilter, label: 'Facturadas', count: this.countFacturadas },
    { key: 'vencidas' as TabFilter, label: 'Vencidas', count: this.countVencidas },
    { key: 'pagas' as TabFilter, label: 'Pagas', count: this.countPagas },
  ];

  readonly filteredFacturas = computed(() => {
    const tab = this.activeTab();
    const data = this.facturas();
    switch (tab) {
      case 'facturadas': return data.filter(f => f.estado === 'Emitida');
      case 'vencidas': return data.filter(f => f.estado === 'Vencida');
      case 'pagas': return data.filter(f => f.estado === 'Paga');
      default: return data;
    }
  });

  readonly detalleTotal = computed(() => {
    return this.lineItems()
      .filter(item => item.checked)
      .reduce((sum, item) => sum + item.monto, 0);
  });

  /* ── Navigation ── */
  goBack(): void {
    this.router.navigate(['/mi-cuenta']);
  }

  /* ── Helpers ── */
  formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }

  /* ── Detalle Dialog ── */
  openDetalle(factura: Factura): void {
    this.detalleFactura.set(factura);
    this.lineItems.set(MOCK_LINE_ITEMS.map(item => ({ ...item })));
    this.pagarFlow.set(false);
    this.showDetalle.set(true);
  }

  openPagarFlow(): void {
    this.detalleFactura.set(null);
    this.lineItems.set(MOCK_LINE_ITEMS.map(item => ({ ...item, checked: true })));
    this.pagarFlow.set(true);
    this.showDetalle.set(true);
  }

  advanceToPago(): void {
    this.showDetalle.set(false);
    this.detalleFactura.set(null);
    this.selectedMetodo.set(null);
    this.showPago.set(true);
  }

  closeDetalle(): void {
    this.showDetalle.set(false);
    this.detalleFactura.set(null);
    this.pagarFlow.set(false);
  }

  toggleLineItem(id: number): void {
    this.lineItems.update(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }

  /* ── Pago Dialog ── */
  openPago(): void {
    this.selectedMetodo.set(null);
    this.showPago.set(true);
  }

  closePago(): void {
    this.showPago.set(false);
  }

  limpiarMetodo(): void {
    this.selectedMetodo.set(null);
  }
}
