import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiFiscal, SubdiarioIvaRow, MedioPago, PercepcionItem } from '../../models/balances.model';
import { MroCurrencyPipe } from '../../pipes/currency.pipe';

@Component({
  selector: 'app-fiscales',
  standalone: true,
  imports: [CommonModule, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../styles/balances-shared.css',
  template: `
    <!-- KPI Row -->
    <div class="kpi-row">
      @for (kpi of kpis(); track kpi.label) {
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-icon" [style.background]="kpi.bgColor" aria-hidden="true">{{ kpi.icon }}</span>
            <span class="kpi-label">{{ kpi.label }}</span>
          </div>
          <span class="kpi-value" [style.color]="kpi.color">{{ kpi.value | mroCurrency }}</span>
          <span class="kpi-subtitle">{{ kpi.subtitle }}</span>
        </div>
      }
    </div>

    <!-- Sub-diario IVA Ventas -->
    <div class="card table-card">
      <div class="card-header-row">
        <h3 class="card-title">Sub-diario IVA Ventas</h3>
        <div class="card-actions">
          <button class="btn-action"
                  type="button"
                  aria-label="Exportar sub-diario IVA ventas a Excel"
                  (click)="onExportar.emit({ tabla: 'ventas', formato: 'xlsx' })">
            Exportar XLSX
          </button>
          <button class="btn-action"
                  type="button"
                  aria-label="Exportar sub-diario IVA ventas a PDF"
                  (click)="onExportar.emit({ tabla: 'ventas', formato: 'pdf' })">
            Exportar PDF
          </button>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>P. Vta</th>
              <th>Numero</th>
              <th>Tipo</th>
              <th>CUIT</th>
              <th>Razon Social</th>
              <th class="th-right">Neto Gravado</th>
              <th class="th-right">IVA 10.5%</th>
              <th class="th-right">IVA 21%</th>
              <th class="th-right">Imp. Internos</th>
              <th class="th-right">Total</th>
              <th class="th-right">Percep.</th>
            </tr>
          </thead>
          <tbody>
            @for (row of subdiarioVentas(); track row.id) {
              <tr>
                <td>{{ row.fecha }}</td>
                <td>{{ row.puntoVenta }}</td>
                <td>{{ row.numero }}</td>
                <td>
                  <span class="tipo-badge"
                    [class.tipo-a]="row.tipo.includes('A')"
                    [class.tipo-b]="row.tipo.includes('B')"
                    [class.tipo-nc]="row.tipo.includes('Credito') || row.tipo.includes('NC')">
                    {{ row.tipo }}
                  </span>
                </td>
                <td>{{ row.cuit }}</td>
                <td class="td-bold">{{ row.razonSocial || '—' }}</td>
                <td class="td-right">{{ row.netoGravado | mroCurrency }}</td>
                <td class="td-right">{{ row.iva105 | mroCurrency }}</td>
                <td class="td-right">{{ row.iva21 | mroCurrency }}</td>
                <td class="td-right">{{ row.impInternos | mroCurrency }}</td>
                <td class="td-right td-bold">{{ row.total | mroCurrency }}</td>
                <td class="td-right">{{ row.percepciones | mroCurrency }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="12">
                  <div class="empty-state">
                    <span class="empty-state-icon" aria-hidden="true">📄</span>
                    Sin comprobantes de venta en el periodo seleccionado
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sub-diario IVA Compras -->
    <div class="card table-card">
      <div class="card-header-row">
        <h3 class="card-title">Sub-diario IVA Compras</h3>
        <div class="card-actions">
          <button class="btn-action"
                  type="button"
                  aria-label="Exportar sub-diario IVA compras a Excel"
                  (click)="onExportar.emit({ tabla: 'compras', formato: 'xlsx' })">
            Exportar XLSX
          </button>
          <button class="btn-action"
                  type="button"
                  aria-label="Exportar sub-diario IVA compras a PDF"
                  (click)="onExportar.emit({ tabla: 'compras', formato: 'pdf' })">
            Exportar PDF
          </button>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>P. Vta</th>
              <th>Numero</th>
              <th>Tipo</th>
              <th>CUIT</th>
              <th>Razon Social</th>
              <th class="th-right">Neto Gravado</th>
              <th class="th-right">IVA 10.5%</th>
              <th class="th-right">IVA 21%</th>
              <th class="th-right">Imp. Internos</th>
              <th class="th-right">Total</th>
              <th class="th-right">Percep.</th>
            </tr>
          </thead>
          <tbody>
            @for (row of subdiarioCompras(); track row.id) {
              <tr>
                <td>{{ row.fecha }}</td>
                <td>{{ row.puntoVenta }}</td>
                <td>{{ row.numero }}</td>
                <td>
                  <span class="tipo-badge"
                    [class.tipo-a]="row.tipo.includes('A')"
                    [class.tipo-b]="row.tipo.includes('B')"
                    [class.tipo-nc]="row.tipo.includes('Credito') || row.tipo.includes('NC')">
                    {{ row.tipo }}
                  </span>
                </td>
                <td>{{ row.cuit }}</td>
                <td class="td-bold">{{ row.razonSocial || '—' }}</td>
                <td class="td-right">{{ row.netoGravado | mroCurrency }}</td>
                <td class="td-right">{{ row.iva105 | mroCurrency }}</td>
                <td class="td-right">{{ row.iva21 | mroCurrency }}</td>
                <td class="td-right">{{ row.impInternos | mroCurrency }}</td>
                <td class="td-right td-bold">{{ row.total | mroCurrency }}</td>
                <td class="td-right">{{ row.percepciones | mroCurrency }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="12">
                  <div class="empty-state">
                    <span class="empty-state-icon" aria-hidden="true">📄</span>
                    Sin comprobantes de compra en el periodo seleccionado
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="bottom-row-2">
      <!-- Reporte Medios de Pago -->
      <div class="card">
        <h3 class="card-title">Reporte Medios de Pago</h3>
        <div class="medios-list">
          @for (m of mediosPago(); track m.nombre) {
            <div class="medio-row">
              <div class="medio-color" [style.background]="m.color" aria-hidden="true"></div>
              <span class="medio-nombre">{{ m.nombre }}</span>
              <span class="medio-monto">{{ m.monto | mroCurrency }}</span>
              <span class="medio-pct">{{ m.porcentaje }}%</span>
            </div>
          } @empty {
            <div class="empty-state">
              <span class="empty-state-icon" aria-hidden="true">💳</span>
              Sin datos de medios de pago
            </div>
          }
        </div>
      </div>

      <!-- Percepciones e Imp. Internos -->
      <div class="card">
        <h3 class="card-title">Percepciones e Imp. Internos</h3>
        <div class="percepciones-list">
          @for (p of percepciones(); track p.concepto; let last = $last) {
            <div class="percepcion-row" [class.percepcion-total]="last">
              <span class="percepcion-concepto">{{ p.concepto }}</span>
              <span class="percepcion-monto" [class.monto-total]="last">{{ p.monto | mroCurrency }}</span>
            </div>
          } @empty {
            <div class="empty-state">
              <span class="empty-state-icon" aria-hidden="true">📋</span>
              Sin percepciones registradas
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .kpi-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .tipo-badge {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .tipo-a { background: #DBEAFE; color: #2563EB; }
    .tipo-b { background: #FEF3C7; color: #D97706; }
    .tipo-nc { background: #FEF2F2; color: #EF4444; }

    .table-card { margin-bottom: 16px; }

    .card-actions {
      display: flex;
      gap: 8px;
    }

    .medios-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .medio-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .medio-color {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      flex-shrink: 0;
    }

    .medio-nombre {
      font-size: 13px;
      color: #374151;
      flex: 1;
    }

    .medio-monto {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }

    .medio-pct {
      font-size: 11px;
      color: #9CA3AF;
      width: 40px;
      text-align: right;
    }

    .percepciones-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .percepcion-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #F9FAFB;
    }

    .percepcion-row:last-child { border-bottom: none; }

    .percepcion-total {
      border-top: 1px solid #E5E7EB;
      padding-top: 10px;
    }

    .percepcion-concepto {
      font-size: 13px;
      color: #374151;
    }

    .percepcion-monto {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }

    .monto-total {
      font-size: 15px;
      font-weight: 700;
      color: #1155CC;
    }
  `],
})
export class FiscalesComponent {
  readonly kpis = input.required<KpiFiscal[]>();
  readonly subdiarioVentas = input.required<SubdiarioIvaRow[]>();
  readonly subdiarioCompras = input.required<SubdiarioIvaRow[]>();
  readonly mediosPago = input.required<MedioPago[]>();
  readonly percepciones = input.required<PercepcionItem[]>();

  readonly onExportar = output<{ tabla: string; formato: 'xlsx' | 'pdf' }>();
}
