import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MroCurrencyPipe } from '../../../balances/pipes/currency.pipe';
import { PropinaRegistro, UniformeEntrega, Incidencia } from '../../models';

type SeccionMas = 'propinas' | 'uniformes' | 'incidencias';

@Component({
  selector: 'app-mas',
  standalone: true,
  imports: [CommonModule, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../../balances/styles/balances-shared.css',
  styles: [`
    /* Pill toggle group */
    .pill-group {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .pill-btn {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      padding: 6px 16px;
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

    /* Extra badge colors */
    .badge-green { background: #F0FDF4; color: #22C55E; }
    .badge-blue { background: #DBEAFE; color: #2563EB; }
    .badge-purple { background: #F3E8FF; color: #9333EA; }
    .badge-yellow { background: #FEF3C7; color: #D97706; }
    .badge-red { background: #FEF2F2; color: #EF4444; }
    .badge-orange { background: #FFF7ED; color: #EA580C; }
    .badge-gray { background: var(--slate-100, #F3F4F6); color: var(--slate-500, #6B7280); }

    /* KPI row override for 2 cards */
    .kpi-row-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .kpi-row-2 { grid-template-columns: 1fr; }
    }
  `],
  template: `
    <!-- Section toggle pills -->
    <div class="pill-group" role="tablist" aria-label="Secciones adicionales">
      @for (s of secciones; track s.key) {
        <button class="pill-btn" role="tab" type="button"
          [class.pill-active]="seccionActiva() === s.key"
          [attr.aria-selected]="seccionActiva() === s.key"
          (click)="seccionActiva.set(s.key)">
          {{ s.label }}
        </button>
      }
    </div>

    <!-- PROPINAS -->
    @if (seccionActiva() === 'propinas') {
      <div class="kpi-row-2">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Propinas Hoy</span>
          </div>
          <span class="kpi-value">{{ propinasHoy() | mroCurrency }}</span>
          <span class="kpi-subtitle">Pendientes de reparto</span>
        </div>
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Propinas Repartidas (semana)</span>
          </div>
          <span class="kpi-value">{{ propinasRepartidas() | mroCurrency }}</span>
          <span class="kpi-subtitle">Ya distribuidas al personal</span>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Detalle de Propinas</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Origen</th>
              <th class="th-right">Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (p of propinas(); track p.id) {
              <tr>
                <td>{{ p.fecha }}</td>
                <td>
                  <span class="badge"
                    [class.badge-green]="p.origen === 'Efectivo'"
                    [class.badge-blue]="p.origen === 'Tarjeta'"
                    [class.badge-purple]="p.origen === 'App'">
                    {{ p.origen }}
                  </span>
                </td>
                <td class="td-right td-bold">{{ p.monto | mroCurrency }}</td>
                <td>
                  <span class="badge"
                    [class.badge-green]="p.repartido"
                    [class.badge-yellow]="!p.repartido">
                    {{ p.repartido ? 'Repartido' : 'Pendiente' }}
                  </span>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4">
                  <div class="empty-state">
                    <span class="empty-state-icon" aria-hidden="true">&#x1F4B0;</span>
                    <span>No hay registros de propinas</span>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- UNIFORMES -->
    @if (seccionActiva() === 'uniformes') {
      <div class="card">
        <h3 class="card-title">Entrega de Uniformes</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Prenda</th>
              <th>Talle</th>
              <th>Fecha Entrega</th>
              <th>Fecha Devolucion</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (u of uniformes(); track u.id) {
              <tr>
                <td class="td-bold">{{ u.empleado }}</td>
                <td>{{ u.prenda }}</td>
                <td>{{ u.talle }}</td>
                <td>{{ u.fechaEntrega }}</td>
                <td>{{ u.fechaDevolucion || '\u2014' }}</td>
                <td>
                  <span class="badge"
                    [class.badge-blue]="u.estado === 'Entregado'"
                    [class.badge-green]="u.estado === 'Devuelto'"
                    [class.badge-yellow]="u.estado === 'Pendiente'">
                    {{ u.estado }}
                  </span>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6">
                  <div class="empty-state">
                    <span class="empty-state-icon" aria-hidden="true">&#x1F454;</span>
                    <span>No hay registros de uniformes</span>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- INCIDENCIAS -->
    @if (seccionActiva() === 'incidencias') {
      <div class="card">
        <h3 class="card-title">Registro de Incidencias</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Empleado</th>
              <th>Tipo</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            @for (i of incidencias(); track i.id) {
              <tr>
                <td>{{ i.fecha }}</td>
                <td class="td-bold">{{ i.empleado }}</td>
                <td>
                  <span class="badge"
                    [class.badge-red]="i.tipo === 'Sanción'"
                    [class.badge-orange]="i.tipo === 'Llegada tarde'"
                    [class.badge-green]="i.tipo === 'Premio'"
                    [class.badge-gray]="i.tipo === 'Observación'">
                    {{ i.tipo }}
                  </span>
                </td>
                <td>{{ i.descripcion }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4">
                  <div class="empty-state">
                    <span class="empty-state-icon" aria-hidden="true">&#x1F4CB;</span>
                    <span>No hay registros de incidencias</span>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class MasComponent {
  readonly propinas = input<PropinaRegistro[]>([]);
  readonly uniformes = input<UniformeEntrega[]>([]);
  readonly incidencias = input<Incidencia[]>([]);

  readonly seccionActiva = signal<SeccionMas>('propinas');

  readonly secciones: { key: SeccionMas; label: string }[] = [
    { key: 'propinas', label: 'Propinas' },
    { key: 'uniformes', label: 'Uniformes' },
    { key: 'incidencias', label: 'Incidencias' },
  ];

  readonly propinasHoy = computed(() => {
    const hoy = new Date();
    const dd = hoy.getDate().toString().padStart(2, '0');
    const mm = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const hoyStr = dd + '/' + mm;
    return this.propinas()
      .filter(p => p.fecha.includes(hoyStr) && !p.repartido)
      .reduce((sum, p) => sum + p.monto, 0);
  });

  readonly propinasRepartidas = computed(() =>
    this.propinas()
      .filter(p => p.repartido)
      .reduce((sum, p) => sum + p.monto, 0)
  );
}
