import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiLiquidacion, PreLiquidacionRow, Adelanto } from '../../models/personal.model';
import { MroCurrencyPipe } from '../../../balances/pipes/currency.pipe';

type VistaLiquidacion = 'preliquidacion' | 'adelantos';

@Component({
  selector: 'app-liquidacion',
  standalone: true,
  imports: [CommonModule, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../../balances/styles/balances-shared.css',
  styles: [`
    :host { display: block; }

    /* ===== PILL TOGGLE ===== */
    .pill-toggle {
      display: inline-flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .pill-btn {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      padding: 6px 18px;
      border: 1px solid #E5E7EB;
      border-radius: 20px;
      background: #fff;
      color: var(--slate-500, #6B7280);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .pill-btn:hover:not(.pill-active) {
      border-color: #D1D5DB;
      background: #F9FAFB;
    }

    .pill-active {
      background: #1155CC;
      color: #fff;
      border-color: #1155CC;
    }

    /* ===== TABLE CARD (Ventas style) ===== */
    .table-card {
      background: var(--bg-primary, white);
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-lg, 14px);
      box-shadow: 0 1px 1.75px -1px rgba(0, 0, 0, 0.1), 0 1px 2.625px rgba(0, 0, 0, 0.1);
      padding: 20px 25px;
    }

    .table-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .table-title {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--slate-900, #0F172B);
      margin: 0;
    }

    .table-wrapper { overflow-x: auto; }

    /* ===== TABLE FOOTER (not in shared CSS) ===== */
    .data-table tbody tr:hover {
      background: var(--slate-50, #F8FAFC);
    }

    .data-table tfoot td {
      padding: 12px 6px;
      font-weight: 700;
      color: var(--slate-900, #111827);
      border-top: 2px solid var(--slate-200, #E2E8F0);
      border-bottom: none;
      background: var(--slate-50, #F8FAFC);
    }

    .text-right { text-align: right; }
    .font-bold { font-weight: 600; color: var(--slate-900, #111827); }

    .text-purple { color: #7C3AED; font-weight: 600; }
    .text-orange { color: #D97706; font-weight: 600; }

    /* ===== STATUS BADGES ===== */
    .status-badge {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      padding: 5px 12px;
      border-radius: 8px;
      border: 1px solid transparent;
    }

    .status-entregado {
      background: #FEF3C7;
      color: #D97706;
      border-color: #FDE68A;
    }

    .status-descontado {
      background: #ECFDF5;
      color: #00A43D;
      border-color: #A4F4CF;
    }
  `],
  template: `
    <!-- KPI Row -->
    <section class="kpi-row" aria-label="Indicadores de liquidacion">
      @for (kpi of kpis(); track kpi.label; let i = $index) {
        <article class="kpi-card" [attr.aria-label]="kpi.label + ': ' + kpi.value">
          <span class="kpi-label">{{ kpi.label }}</span>
          <span class="kpi-value" [style.color]="kpi.color">
            @if (i < 2) {
              {{ kpi.value | mroCurrency }}
            } @else {
              {{ kpi.value }}hs
            }
          </span>
          <span class="kpi-subtitle">{{ kpi.subtitle }}</span>
        </article>
      }
    </section>

    <!-- View Toggle -->
    <div class="pill-toggle" role="tablist" aria-label="Vista de liquidacion">
      <button class="pill-btn"
        [class.pill-active]="vistaActiva() === 'preliquidacion'"
        (click)="vistaActiva.set('preliquidacion')"
        role="tab"
        [attr.aria-selected]="vistaActiva() === 'preliquidacion'">
        Pre-liquidacion
      </button>
      <button class="pill-btn"
        [class.pill-active]="vistaActiva() === 'adelantos'"
        (click)="vistaActiva.set('adelantos')"
        role="tab"
        [attr.aria-selected]="vistaActiva() === 'adelantos'">
        Adelantos
      </button>
    </div>

    <!-- Pre-liquidacion Table -->
    @if (vistaActiva() === 'preliquidacion') {
      <section class="table-card" aria-label="Pre-liquidacion del mes">
        <div class="table-header-row">
          <h3 class="table-title">Pre-liquidacion del Mes</h3>
          <span class="card-badge">{{ preLiquidacion().length }} empleados</span>
        </div>
        <div class="table-wrapper">
          <table class="data-table" aria-label="Tabla de pre-liquidacion">
            <thead>
              <tr>
                <th scope="col">Empleado</th>
                <th scope="col">Rol</th>
                <th scope="col" class="text-right">Hs Normales</th>
                <th scope="col" class="text-right">Hs Extra</th>
                <th scope="col" class="text-right">Adelantos</th>
                <th scope="col" class="text-right">Bruto</th>
                <th scope="col" class="text-right">Neto</th>
              </tr>
            </thead>
            <tbody>
              @for (pl of preLiquidacion(); track pl.id) {
                <tr>
                  <td class="font-bold">{{ pl.empleado }}</td>
                  <td>{{ pl.rol }}</td>
                  <td class="text-right">{{ pl.horasNormales }}</td>
                  <td class="text-right" [class.text-purple]="pl.horasExtra > 0">
                    {{ pl.horasExtra }}
                  </td>
                  <td class="text-right" [class.text-orange]="pl.adelantos > 0">
                    {{ pl.adelantos | mroCurrency }}
                  </td>
                  <td class="text-right">{{ pl.bruto | mroCurrency }}</td>
                  <td class="text-right font-bold">{{ pl.neto | mroCurrency }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7">
                    <div class="empty-state" role="status">
                      <span class="empty-state-icon" aria-hidden="true">&#128203;</span>
                      <span>No hay datos de pre-liquidacion disponibles</span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
            @if (preLiquidacion().length > 0) {
              <tfoot>
                <tr>
                  <td colspan="2">Totales</td>
                  <td class="text-right">{{ totales().horasNormales }}</td>
                  <td class="text-right">{{ totales().horasExtra }}</td>
                  <td class="text-right">{{ totales().adelantos | mroCurrency }}</td>
                  <td class="text-right">{{ totales().bruto | mroCurrency }}</td>
                  <td class="text-right">{{ totales().neto | mroCurrency }}</td>
                </tr>
              </tfoot>
            }
          </table>
        </div>
      </section>
    }

    <!-- Adelantos Table -->
    @if (vistaActiva() === 'adelantos') {
      <section class="table-card" aria-label="Adelantos y vales">
        <div class="table-header-row">
          <h3 class="table-title">Adelantos y Vales</h3>
          <span class="card-badge">{{ adelantos().length }} registros</span>
        </div>
        <div class="table-wrapper">
          <table class="data-table" aria-label="Tabla de adelantos">
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Empleado</th>
                <th scope="col" class="text-right">Monto</th>
                <th scope="col">Motivo</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              @for (a of adelantos(); track a.id) {
                <tr>
                  <td>{{ a.fecha }}</td>
                  <td class="font-bold">{{ a.empleado }}</td>
                  <td class="text-right">{{ a.monto | mroCurrency }}</td>
                  <td>{{ a.motivo }}</td>
                  <td>
                    <span class="status-badge"
                      [class.status-entregado]="a.estado === 'Entregado'"
                      [class.status-descontado]="a.estado === 'Descontado'"
                      role="status">
                      {{ a.estado }}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5">
                    <div class="empty-state" role="status">
                      <span class="empty-state-icon" aria-hidden="true">&#128176;</span>
                      <span>No hay adelantos registrados en este periodo</span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    }
  `,
})
export class LiquidacionComponent {
  readonly kpis = input.required<KpiLiquidacion[]>();
  readonly preLiquidacion = input.required<PreLiquidacionRow[]>();
  readonly adelantos = input.required<Adelanto[]>();

  readonly vistaActiva = signal<VistaLiquidacion>('preliquidacion');

  readonly totales = computed(() => {
    const rows = this.preLiquidacion();
    return {
      horasNormales: rows.reduce((sum, r) => sum + r.horasNormales, 0),
      horasExtra: rows.reduce((sum, r) => sum + r.horasExtra, 0),
      adelantos: rows.reduce((sum, r) => sum + r.adelantos, 0),
      bruto: rows.reduce((sum, r) => sum + r.bruto, 0),
      neto: rows.reduce((sum, r) => sum + r.neto, 0),
    };
  });
}
