import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
  OnInit,
  OnDestroy,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MroCurrencyPipe } from '../../../balances/pipes/currency.pipe';
import { EmpleadoEnTurno, FichajeRegistro, TipoFichaje } from '../../models/personal.model';

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
      font-size: 16px;
      font-weight: 600;
      height: 60px;
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
      cursor: pointer;
      position: relative;
    }

    .pin-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      font-size: 16px;
    }

    .pin-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--slate-200, #E5E7EB);
      transition: background 0.15s ease;
    }

    .pin-dot.filled {
      background: var(--slate-900, #111827);
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
          <button type="button" class="fichaje-btn btn-entrada" (click)="onFichaje.emit('entrada')">Entrada</button>
          <button type="button" class="fichaje-btn btn-descanso" (click)="onFichaje.emit('inicioDescanso')">Inicio Descanso</button>
          <button type="button" class="fichaje-btn btn-fin" (click)="onFichaje.emit('finDescanso')">Fin Descanso</button>
          <button type="button" class="fichaje-btn btn-salida" (click)="onFichaje.emit('salida')">Salida</button>
        </div>

        <div class="pin-section">
          <span class="pin-label">PIN:</span>
          <div class="pin-dots">
            <input
              class="pin-input"
              type="password"
              maxlength="6"
              [value]="pin()"
              (input)="onPinInput($event)"
              aria-label="Ingresar PIN de fichaje" />
            @for (i of pinSlots; track i) {
              <span class="pin-dot" [class.filled]="i < pin().length"></span>
            }
          </div>
        </div>
      </div>

      <!-- RIGHT: Monitor de Turno Actual -->
      <div class="card">
        <h3 class="card-title">Monitor de Turno Actual</h3>

        <table class="data-table" aria-label="Monitor de turno actual">
          <thead>
            <tr>
              <th scope="col">Empleado</th>
              <th scope="col">Puesto</th>
              <th scope="col">Hora Entrada</th>
              <th scope="col">Estado</th>
              <th scope="col" class="th-right">Hs Acum.</th>
            </tr>
          </thead>
          <tbody>
            @for (et of enTurno(); track et.id) {
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

      <table class="data-table" aria-label="Historial de fichajes">
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Empleado</th>
            <th scope="col">Rol</th>
            <th scope="col">Entrada</th>
            <th scope="col">Salida</th>
            <th scope="col" class="th-right">Hs Trabajadas</th>
            <th scope="col" class="th-right">Hs Extra</th>
          </tr>
        </thead>
        <tbody>
          @for (f of historial(); track f.id) {
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
  readonly enTurno = input<EmpleadoEnTurno[]>([]);
  readonly historial = input<FichajeRegistro[]>([]);
  readonly onFichaje = output<TipoFichaje>();

  horaActual = signal<string>(this.formatTime());
  pin = signal<string>('');
  readonly pinSlots = [0, 1, 2, 3, 4, 5];

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly ngZone: NgZone,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.horaActual.set(this.formatTime());

    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.horaActual.set(this.formatTime());
        this.cdr.markForCheck();
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onPinInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 6);
    this.pin.set(value);
    input.value = value;
  }

  private formatTime(): string {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const ss = now.getSeconds().toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
}
