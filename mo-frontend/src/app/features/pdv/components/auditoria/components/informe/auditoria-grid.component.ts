import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriaEvento } from '../../models/auditoria.models';

@Component({
  selector: 'app-auditoria-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-chevron"></th>
            <th>NOMBRE</th>
            <th>ESTADO</th>
            <th>HORA</th>
            <th>EMPLEADO</th>
            <th>COMPROBANTE</th>
            <th>PRECIO</th>
          </tr>
        </thead>
        <tbody>
          @for (evento of data(); track evento.id) {
            <tr class="master-row" [class.expanded]="isExpanded(evento.id)" (click)="toggleExpand(evento.id)">
              <td class="col-chevron">
                <span class="chevron" [class.chevron-open]="isExpanded(evento.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/>
                  </svg>
                </span>
              </td>
              <td>
                <div class="cell-multi">
                  <span class="cell-main">{{ evento.ubicacion }}</span>
                  <span class="cell-sub">{{ evento.mesa }}</span>
                </div>
              </td>
              <td>
                <span class="badge-estado" [class]="getBadgeClass(evento.estado)">{{ evento.estado }}</span>
              </td>
              <td>{{ evento.horaApertura }} - {{ evento.horaCierre }}</td>
              <td>
                <div class="cell-multi">
                  <span class="cell-main">{{ evento.empleado.nombre }}</span>
                  <span class="cell-sub cell-sub--orange">{{ evento.empleado.rol }}</span>
                </div>
              </td>
              <td>{{ evento.comprobante }}</td>
              <td class="cell-precio">{{ formatCurrency(evento.precio) }}</td>
            </tr>
            @if (isExpanded(evento.id) && evento.detalles.length > 0) {
              <tr class="detail-row">
                <td colspan="7">
                  <div class="detail-wrapper">
                    <table class="detail-table">
                      <thead>
                        <tr>
                          <th>HORA</th>
                          <th>ACCION</th>
                          <th>NOMBRE</th>
                          <th>PRECIO</th>
                          <th>SOLICITUD</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (det of evento.detalles; track det.id) {
                          <tr>
                            <td>{{ det.hora }}</td>
                            <td><span class="accion-badge" [style.background]="det.tipoAccion.color + '20'" [style.color]="det.tipoAccion.color">{{ det.tipoAccion.nombre }}</span></td>
                            <td>{{ det.nombreArticulo }}</td>
                            <td>{{ formatCurrency(det.precio) }}</td>
                            <td>{{ det.empleadoSolicitud }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            }
          } @empty {
            <tr>
              <td colspan="7" class="empty-state">No se encontraron eventos de auditoria</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead th {
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      background: #F3F4F6;
      border-bottom: 1px solid var(--slate-200);
    }

    /* Master row */
    .master-row { cursor: pointer; transition: background 0.15s; }
    .master-row:hover { background: #FAFAFA; }
    .master-row.expanded { background: #FAFAFA; }
    .master-row td {
      padding: 12px 16px; border-bottom: 1px solid var(--slate-100);
      vertical-align: middle; font-size: 14px; color: var(--gray-700);
    }

    /* Chevron */
    .col-chevron { width: 40px; }
    .chevron {
      display: inline-flex; align-items: center; justify-content: center;
      color: var(--slate-400); transition: transform 0.2s ease; flex-shrink: 0;
    }
    .chevron-open { transform: rotate(90deg); }

    .cell-multi { display: flex; flex-direction: column; gap: 2px; }
    .cell-main { font-weight: 600; color: var(--text-heading); }
    .cell-sub { font-size: 12px; color: var(--slate-400); margin-top: 2px; }
    .cell-sub--orange { color: var(--primary-orange); }
    .cell-precio { font-weight: 600; color: var(--text-heading); }

    .badge-estado {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 12px; font-size: 12px; font-weight: 500;
      border-radius: var(--radius-sm, 8px); white-space: nowrap;
      border: 1px solid transparent; line-height: 1.333;
    }

    .badge-estado::before {
      content: ''; width: 6px; height: 6px;
      border-radius: 50%; flex-shrink: 0;
    }

    .badge-critico { background: var(--danger-bg, #FEF2F2); color: #DC2626; border-color: #FECACA; }
    .badge-critico::before { background: #DC2626; }
    .badge-moderado { background: var(--warning-bg, #FFFBEB); color: #D97706; border-color: #FDE68A; }
    .badge-moderado::before { background: #D97706; }
    .badge-leve { background: var(--success-bg, #F0FDF4); color: #16A34A; border-color: #BBF7D0; }
    .badge-leve::before { background: #16A34A; }

    /* Detail row */
    .detail-row td { padding: 0; border-bottom: 1px solid var(--slate-100); }
    .detail-wrapper { padding: 0 16px 16px 16px; background: #FAFAFA; }
    .detail-table {
      width: 100%; border-collapse: collapse;
      background: white; border: 1px solid var(--slate-200);
      border-radius: 8px; overflow: hidden;
    }
    .detail-table thead th {
      padding: 10px 16px; font-size: 11px; font-weight: 600; color: var(--slate-500);
      text-transform: uppercase; letter-spacing: 0.05em; text-align: left;
      background: var(--slate-100); border-bottom: 1px solid var(--slate-200);
    }
    .detail-table tbody td {
      padding: 12px 16px; font-size: 14px; color: var(--gray-700);
      border-bottom: 1px solid var(--slate-100);
    }
    .detail-table tbody tr:last-child td { border-bottom: none; }

    .accion-badge {
      display: inline-flex; padding: 3px 10px;
      border-radius: 6px; font-size: 12px; font-weight: 500;
    }

    .empty-state {
      text-align: center; padding: 40px 16px;
      font-size: 14px; color: var(--slate-400);
    }
  `]
})
export class AuditoriaGridComponent {
  data = input.required<AuditoriaEvento[]>();
  private expandedRows = signal<Set<number>>(new Set());

  isExpanded(id: number): boolean {
    return this.expandedRows().has(id);
  }

  toggleExpand(id: number): void {
    this.expandedRows.update(set => {
      const next = new Set(set);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).format(value);
  }

  getBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      'Critico': 'badge-estado badge-critico',
      'Moderado': 'badge-estado badge-moderado',
      'Leve': 'badge-estado badge-leve',
    };
    return map[estado] || 'badge-estado';
  }
}
