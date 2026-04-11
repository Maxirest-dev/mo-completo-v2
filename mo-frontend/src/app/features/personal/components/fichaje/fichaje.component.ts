import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MroCurrencyPipe } from '../../../balances/pipes/currency.pipe';
import { EmpleadoEnTurno, FichajeRegistro } from '../../models/personal.model';

@Component({
  selector: 'app-fichaje',
  standalone: true,
  imports: [CommonModule, MroCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../../balances/styles/balances-shared.css',
  styles: [`
    /* ===== LAYOUT ===== */
    .fichaje-top-row {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    /* ===== PANEL DE FICHAJE ===== */
    .fichaje-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .clock-display {
      font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
      font-size: 48px;
      font-weight: 700;
      color: var(--slate-900, #111827);
      letter-spacing: 0.04em;
      line-height: 1;
    }

    .fichaje-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }

    .fichaje-btn {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      height: 48px;
      width: 100%;
      border: none;
      border-radius: 10px;
      color: #fff;
      cursor: pointer;
      transition: opacity 0.15s ease, transform 0.1s ease;
      letter-spacing: 0.01em;
    }

    .fichaje-btn:hover {
      opacity: 0.9;
    }

    .fichaje-btn:active {
      transform: scale(0.98);
    }

    .btn-entrada    { background: #22C55E; }
    .btn-descanso   { background: #F59E0B; }
    .btn-fin        { background: #3B82F6; }
    .btn-salida     { background: #EF4444; }

    /* ===== PIN DISPLAY ===== */
    .pin-section {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 4px;
    }

    .pin-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--slate-500, #6B7280);
    }

    .pin-dots {
      display: flex;
      gap: 8px;
    }

    .pin-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--slate-200, #E5E7EB);
    }

    /* ===== BADGE VARIANTS ===== */
    .badge-turno     { background: #F0FDF4; color: #22C55E; }
    .badge-descanso  { background: #FEF3C7; color: #D97706; }
    .badge-ingresar  { background: #DBEAFE; color: #2563EB; }
    .badge-ausente   { background: #FEF2F2; color: #EF4444; }

    /* ===== EXTRAS ===== */
    .td-extra-red {
      color: #EF4444;
      font-weight: 600;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .fichaje-top-row {
        grid-template-columns: 1fr;
      }
    }
  `],
  template: `
    <!-- TOP ROW: Panel Fichaje + Monitor Turno Actual -->
    <div class="fichaje-top-row">

      <!-- LEFT: Panel de Fichaje -->
      <div class="card fichaje-panel">
        <span class="clock-display">{{ horaActual() }}</span>

        <div class="fichaje-buttons">
          <button class="fichaje-btn btn-entrada">Entrada</button>
          <button class="fichaje-btn btn-descanso">Inicio Descanso</button>
          <button class="fichaje-btn btn-fin">Fin Descanso</button>
          <button class="fichaje-btn btn-salida">Salida</button>
        </div>

        <div class="pin-section">
          <span class="pin-label">PIN:</span>
          <div class="pin-dots">
            <span class="pin-dot"></span>
            <span class="pin-dot"></span>
            <span class="pin-dot"></span>
            <span class="pin-dot"></span>
            <span class="pin-dot"></span>
            <span class="pin-dot"></span>
          </div>
        </div>
      </div>

      <!-- RIGHT: Monitor de Turno Actual -->
      <div class="card">
        <h3 class="card-title">Monitor de Turno Actual</h3>

        <table class="data-table">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Puesto</th>
              <th>Hora Entrada</th>
              <th>Estado</th>
              <th class="th-right">Hs Acum.</th>
            </tr>
          </thead>
          <tbody>
            @for (et of enTurno; track et.id) {
              <tr>
                <td class="td-bold">{{ et.empleado }}</td>
                <td>{{ et.puesto }}</td>
                <td>{{ et.horaEntrada || '—' }}</td>
                <td>
                  <span class="badge"
                    [class.badge-turno]="et.estado === 'En turno'"
                    [class.badge-descanso]="et.estado === 'En descanso'"
                    [class.badge-ingresar]="et.estado === 'Por ingresar'"
                    [class.badge-ausente]="et.estado === 'Ausente'">
                    {{ et.estado }}
                  </span>
                </td>
                <td class="td-right">{{ et.horasAcumuladas }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5">
                  <div class="empty-state">
                    <span class="empty-state-icon">&#128337;</span>
                    No hay empleados en turno
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- BOTTOM: Historial de Fichajes -->
    <div class="card">
      <h3 class="card-title">Historial de Fichajes</h3>

      <table class="data-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Empleado</th>
            <th>Rol</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th class="th-right">Hs Trabajadas</th>
            <th class="th-right">Hs Extra</th>
          </tr>
        </thead>
        <tbody>
          @for (f of historial; track f.id) {
            <tr>
              <td>{{ f.fecha }}</td>
              <td class="td-bold">{{ f.empleado }}</td>
              <td>{{ f.rol }}</td>
              <td>{{ f.entrada }}</td>
              <td>{{ f.salida || '—' }}</td>
              <td class="td-right">{{ f.horasTrabajadas }}</td>
              <td class="td-right"
                [class.td-extra-red]="f.horasExtra > 0">
                {{ f.horasExtra }}
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="7">
                <div class="empty-state">
                  <span class="empty-state-icon">&#128203;</span>
                  Sin registros de fichaje
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class FichajeComponent implements OnInit, OnDestroy {
  @Input() enTurno: EmpleadoEnTurno[] = [];
  @Input() historial: FichajeRegistro[] = [];

  horaActual = signal<string>(this.formatTime());

  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.horaActual.set(this.formatTime());
    this.intervalId = setInterval(() => {
      this.horaActual.set(this.formatTime());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private formatTime(): string {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }
}
