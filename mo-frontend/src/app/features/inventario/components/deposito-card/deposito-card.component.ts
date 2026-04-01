import {
  Component,
  ChangeDetectionStrategy,
  signal,
  input,
  output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  DepositoGridRow,
  InsumoGridRow,
  GridActionEvent,
} from '../../models/inventario-grid.model';

@Component({
  selector: 'app-deposito-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="deposito-card" [class.card-inactive]="!deposito().activo">
      <!-- Card Header -->
      <div class="card-header" (click)="toggleExpand()">
        <div class="header-left">
          <span class="chevron" [class.chevron-open]="isExpanded()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/>
            </svg>
          </span>
          <div class="deposito-info">
            <div class="deposito-name-row">
              <h3 class="deposito-name">{{ deposito().nombre }}</h3>
              <span class="stock-status-badge" [class]="getStockStatusBadgeClass()">
                <span class="stock-status-dot"></span>
                {{ getStockStatusLabel() }}
              </span>
              @if (!deposito().activo) {
                <span class="inactive-badge">Inactivo</span>
              }
            </div>
            @if (deposito().descripcion) {
              <p class="deposito-desc">{{ deposito().descripcion }}</p>
            }
          </div>
        </div>
        <div class="header-right" (click)="$event.stopPropagation()">
          <div class="insumos-count">
            <span class="count-number">{{ deposito().insumosCount }}</span>
            <span class="count-label">insumos</span>
          </div>
          @if (deposito().ubicacion) {
            <span class="ubicacion-tag">{{ deposito().ubicacion }}</span>
          }
          <button class="btn-agregar" (click)="onAgregarInsumo()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            Agregar
          </button>
          <div class="header-actions">
            <button class="btn-action btn-edit" (click)="onAction('edit', 'deposito', deposito())">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Expanded Content: Insumos Table -->
      @if (isExpanded()) {
        <div class="card-body">
          <table class="insumos-table">
            <thead>
              <tr>
                <th class="col-nombre">NOMBRE</th>
                <th class="col-tipo">TIPO</th>
                <th class="col-estado">ESTADO</th>
                <th class="col-stock">STOCK ACTUAL</th>
                <th class="col-minimo">STOCK MIN.</th>
                <th class="col-unidad">UNIDAD</th>
                <th class="col-precio">PRECIO</th>
                <th class="col-acciones">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              @for (insumo of deposito().insumos; track insumo.id) {
                <tr class="insumo-row" [class.row-inactive]="!insumo.activo">
                  <td class="col-nombre">
                    <div class="insumo-name-cell">
                      <a class="insumo-name insumo-link" (click)="navigateToProfile(insumo.id)">{{ insumo.nombre }}</a>
                      @if (insumo.codigo) {
                        <span class="insumo-code">{{ insumo.codigo }}</span>
                      }
                    </div>
                  </td>
                  <td class="col-tipo">
                    <span class="tipo-insumo-badge" [class.tipo-elaborado]="insumo.tipoInsumo === 'ELABORADO'">
                      {{ insumo.tipoInsumo === 'COMPRADO' ? 'Comprado' : 'Elaborado' }}
                    </span>
                  </td>
                  <td class="col-estado">
                    <span class="estado-badge" [class]="getEstadoBadgeClass(insumo.estadoStock)">
                      <span class="estado-dot"></span>
                      {{ getEstadoLabel(insumo.estadoStock) }}
                    </span>
                  </td>
                  <td class="col-stock">
                    <span class="stock-value" [class.stock-critical]="insumo.estadoStock === 'CRITICO'" [class.stock-low]="insumo.estadoStock === 'BAJO'">
                      {{ insumo.stockActual }}
                    </span>
                  </td>
                  <td class="col-minimo">{{ insumo.stockMinimo }}</td>
                  <td class="col-unidad">{{ insumo.unidadMedida }}</td>
                  <td class="col-precio">{{ formatPrice(insumo.precio) }}</td>
                  <td class="col-acciones">
                    <div class="acciones-cell">
                      <button class="btn-action-text btn-edit-insumo" (click)="onAction('edit', 'insumo', insumo)">Editar</button>
                      <button class="btn-action-text btn-adjust-insumo" (click)="onAction('adjust-stock', 'insumo', insumo)">Ajustar</button>
                      @if (insumo.activo) {
                        <button class="btn-action-text btn-deactivate-insumo" (click)="onAction('deactivate', 'insumo', insumo)">Desactivar</button>
                      } @else {
                        <button class="btn-action-text btn-activate-insumo" (click)="onAction('activate', 'insumo', insumo)">Activar</button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="empty-insumos">Sin insumos en este deposito</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .deposito-card {
      background: white;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      transition: border-color 0.15s;
    }

    .deposito-card:hover {
      border-color: #D1D5DB;
    }

    .card-inactive {
      opacity: 0.7;
    }

    /* Card Header */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      cursor: pointer;
      transition: background 0.15s;
      gap: 16px;
    }

    .card-header:hover {
      background: #FAFAFA;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;
    }

    .chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #9CA3AF;
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }

    .chevron-open {
      transform: rotate(90deg);
    }

    .deposito-info {
      min-width: 0;
    }

    .deposito-name-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .deposito-name {
      font-size: 15px;
      font-weight: 600;
      color: #1F2937;
      margin: 0;
    }

    .deposito-desc {
      font-size: 13px;
      color: #6B7280;
      margin: 4px 0 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Tipo Badge */
    .tipo-badge {
      display: inline-flex;
      padding: 2px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .tipo-verduras { background: #D1FAE5; color: #065F46; }
    .tipo-carnes { background: #FEE2E2; color: #991B1B; }
    .tipo-lacteos { background: #DBEAFE; color: #1E40AF; }
    .tipo-bebidas { background: #E0E7FF; color: #3730A3; }
    .tipo-secos { background: #FEF3C7; color: #92400E; }
    .tipo-congelados { background: #CFFAFE; color: #155E75; }
    .tipo-otros { background: #F3F4F6; color: #4B5563; }

    /* Stock Status Badge */
    .stock-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9999px;
      letter-spacing: 0.03em;
    }

    .stock-status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .stock-normal { background: #D1FAE5; color: #065F46; }
    .stock-normal .stock-status-dot { background: #10B981; }

    .stock-bajo { background: #FEF3C7; color: #92400E; }
    .stock-bajo .stock-status-dot { background: #F59E0B; }

    .stock-critico { background: #FEE2E2; color: #991B1B; }
    .stock-critico .stock-status-dot { background: #EF4444; }

    .stock-vacio { background: #F3F4F6; color: #6B7280; }
    .stock-vacio .stock-status-dot { background: #9CA3AF; }

    .inactive-badge {
      display: inline-flex;
      padding: 2px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9999px;
      background: #F3F4F6;
      color: #6B7280;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    .insumos-count {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .count-number {
      font-weight: 600;
      font-size: 15px;
      color: #F97316;
    }

    .count-label {
      font-size: 11px;
      color: #9CA3AF;
    }

    .ubicacion-tag {
      display: inline-flex;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 500;
      color: #6B7280;
      background: #F3F4F6;
      border-radius: 6px;
      white-space: nowrap;
    }

    .header-actions {
      display: flex;
      gap: 6px;
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      background: transparent;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      color: #6B7280;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-action:hover {
      background: #F3F4F6;
      border-color: #D1D5DB;
      color: #374151;
    }

    .btn-activate {
      color: #10B981;
      border-color: #D1FAE5;
    }

    .btn-activate:hover {
      background: #D1FAE5;
      color: #059669;
    }

    /* Agregar button */
    .btn-agregar {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      color: white;
      background: #F97316;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.15s;
      white-space: nowrap;
    }

    .btn-agregar:hover {
      background: #EA580C;
    }

    /* Card Body - Insumos Table */
    .card-body {
      border-top: 1px solid #F3F4F6;
      padding: 0;
    }

    .insumos-table {
      width: 100%;
      border-collapse: collapse;
    }

    .insumos-table thead th {
      padding: 10px 16px;
      font-size: 11px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      background: #F9FAFB;
      border-bottom: 1px solid #E5E7EB;
    }

    .col-nombre { width: 22%; }
    .col-tipo { width: 10%; }
    .col-estado { width: 12%; }
    .col-stock { width: 10%; text-align: center !important; }
    .col-minimo { width: 10%; text-align: center !important; }
    .col-unidad { width: 8%; }
    .col-precio { width: 10%; text-align: right !important; }
    .col-acciones { width: 18%; text-align: right !important; }

    .insumo-row td {
      padding: 12px 16px;
      font-size: 14px;
      color: #374151;
      border-bottom: 1px solid #F3F4F6;
      vertical-align: middle;
    }

    .insumo-row:last-child td {
      border-bottom: none;
    }

    .row-inactive {
      opacity: 0.5;
    }

    .insumo-name-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .insumo-name {
      font-weight: 500;
      color: #1F2937;
    }

    .insumo-link {
      cursor: pointer;
      text-decoration: none;
      transition: color 0.15s;
    }

    .insumo-link:hover {
      color: #F97316;
    }

    .insumo-code {
      font-size: 12px;
      color: #9CA3AF;
    }

    /* Tipo Insumo Badge */
    .tipo-insumo-badge {
      font-size: 12px;
      font-weight: 500;
      color: #6B7280;
    }

    .tipo-elaborado {
      color: #7C3AED;
    }

    /* Estado Badge */
    .estado-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 9999px;
      white-space: nowrap;
    }

    .estado-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .estado-normal { background: #D1FAE5; color: #065F46; }
    .estado-normal .estado-dot { background: #10B981; }

    .estado-bajo { background: #FEF3C7; color: #92400E; }
    .estado-bajo .estado-dot { background: #F59E0B; }

    .estado-critico { background: #FEE2E2; color: #991B1B; }
    .estado-critico .estado-dot { background: #EF4444; }

    /* Stock value */
    .stock-value {
      font-weight: 600;
      text-align: center;
      display: block;
    }

    .stock-critical { color: #EF4444; }
    .stock-low { color: #F59E0B; }

    .col-minimo {
      text-align: center;
    }

    .col-precio {
      text-align: right;
    }

    /* Acciones insumo */
    .acciones-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      justify-content: flex-end;
    }

    .btn-action-text {
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      background: transparent;
      color: #6B7280;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .btn-adjust-insumo:hover {
      background: #FFF7ED;
      border-color: #FDBA74;
      color: #EA580C;
    }

    .btn-edit-insumo:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
      color: #374151;
    }

    .btn-deactivate-insumo:hover {
      background: #FEF2F2;
      border-color: #FECACA;
      color: #DC2626;
    }

    .btn-activate-insumo {
      color: #10B981;
      border-color: #D1FAE5;
    }

    .btn-activate-insumo:hover {
      background: #D1FAE5;
      color: #059669;
    }

    .empty-insumos {
      padding: 24px 16px !important;
      text-align: center;
      color: #9CA3AF;
      font-size: 13px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .ubicacion-tag {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .header-right {
        width: 100%;
        justify-content: space-between;
      }

      .card-body {
        overflow-x: auto;
      }

      .insumos-table {
        min-width: 700px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositoCardComponent {
  deposito = input.required<DepositoGridRow>();
  actionEvent = output<GridActionEvent>();
  agregarInsumo = output<number>();

  private readonly router = inject(Router);

  isExpanded = signal(false);

  toggleExpand(): void {
    this.isExpanded.update(v => !v);
  }

  onAction(action: GridActionEvent['action'], type: GridActionEvent['type'], data: DepositoGridRow | InsumoGridRow): void {
    this.actionEvent.emit({ action, type, data });
  }

  getTipoBadgeClass(tipo: string): string {
    switch (tipo) {
      case 'VERDURAS': return 'tipo-badge tipo-verduras';
      case 'CARNES': return 'tipo-badge tipo-carnes';
      case 'LACTEOS': return 'tipo-badge tipo-lacteos';
      case 'BEBIDAS': return 'tipo-badge tipo-bebidas';
      case 'SECOS': return 'tipo-badge tipo-secos';
      case 'CONGELADOS': return 'tipo-badge tipo-congelados';
      default: return 'tipo-badge tipo-otros';
    }
  }

  getDepositoStockStatus(): 'NORMAL' | 'BAJO' | 'CRITICO' | 'VACIO' {
    const insumos = this.deposito().insumos;
    if (!insumos || insumos.length === 0) return 'VACIO';

    const activeInsumos = insumos.filter(i => i.activo);
    if (activeInsumos.length === 0) return 'VACIO';

    if (activeInsumos.some(i => i.estadoStock === 'CRITICO')) return 'CRITICO';
    if (activeInsumos.some(i => i.estadoStock === 'BAJO')) return 'BAJO';
    return 'NORMAL';
  }

  getStockStatusBadgeClass(): string {
    const status = this.getDepositoStockStatus();
    switch (status) {
      case 'NORMAL': return 'stock-status-badge stock-normal';
      case 'BAJO': return 'stock-status-badge stock-bajo';
      case 'CRITICO': return 'stock-status-badge stock-critico';
      case 'VACIO': return 'stock-status-badge stock-vacio';
    }
  }

  getStockStatusLabel(): string {
    const status = this.getDepositoStockStatus();
    switch (status) {
      case 'NORMAL': return 'Normal';
      case 'BAJO': return 'Stock bajo';
      case 'CRITICO': return 'Critico';
      case 'VACIO': return 'Vacio';
    }
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'NORMAL': return 'estado-badge estado-normal';
      case 'BAJO': return 'estado-badge estado-bajo';
      case 'CRITICO': return 'estado-badge estado-critico';
      default: return 'estado-badge estado-normal';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'NORMAL': return 'Normal';
      case 'BAJO': return 'Bajo';
      case 'CRITICO': return 'Critico';
      default: return estado;
    }
  }

  onAgregarInsumo(): void {
    this.agregarInsumo.emit(this.deposito().id);
  }

  navigateToProfile(insumoId: number): void {
    this.router.navigate(['/inventario/insumo', insumoId]);
  }

  formatPrice(price: number | null): string {
    if (price == null) return '-';
    return '$' + price.toLocaleString('es-AR');
  }
}
