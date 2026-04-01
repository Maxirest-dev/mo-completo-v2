import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import { Turno, TurnoEstado } from '../../models/turno.model';

@Component({
  selector: 'app-turno-selector',
  standalone: true,
  template: `
    <div class="turno-selector">
      <div class="turno-info">
        <span
          class="turno-status-dot"
          [class.dot-abierto]="turnoActivo()?.estado === 'ABIERTO'"
          [class.dot-cerrado]="turnoActivo()?.estado === 'CERRADO'"
          [class.dot-en-cierre]="turnoActivo()?.estado === 'EN_CIERRE'"
        ></span>

        @if (turnos().length > 1) {
          <select
            class="turno-select"
            [value]="turnoActivo()?.id ?? ''"
            (change)="onTurnoChange($event)"
          >
            @for (turno of turnos(); track turno.id) {
              <option [value]="turno.id">
                {{ turno.nombre }}
              </option>
            }
          </select>
        } @else {
          <span class="turno-nombre">{{ turnoActivo()?.nombre ?? 'Sin turno' }}</span>
        }
      </div>

      @if (turnoActivo(); as turno) {
        <span class="turno-horario">
          {{ turno.horaApertura }}@if (turno.horaCierre) { - {{ turno.horaCierre }}}
        </span>
        <span class="turno-estado-badge" [class]="'badge-' + turno.estado.toLowerCase()">
          {{ estadoLabel() }}
        </span>
      }
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .turno-selector {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 14px;
      background: var(--gray-50, #F9FAFB);
      border: 1px solid var(--gray-200, #E5E7EB);
      border-radius: 8px;
      font-size: 14px;
      color: var(--gray-700, #374151);
    }

    .turno-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .turno-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .dot-abierto {
      background-color: #22C55E;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
    }

    .dot-cerrado {
      background-color: var(--gray-400, #9CA3AF);
    }

    .dot-en-cierre {
      background-color: #F59E0B;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
    }

    .turno-nombre {
      font-weight: 600;
      color: var(--gray-900, #111827);
    }

    .turno-select {
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-900, #111827);
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      outline: none;
      font-family: inherit;
    }

    .turno-select:focus-visible {
      outline: 2px solid var(--primary-orange, #F97316);
      outline-offset: 2px;
      border-radius: 4px;
    }

    .turno-horario {
      color: var(--gray-500, #6B7280);
      font-size: 13px;
      white-space: nowrap;
    }

    .turno-estado-badge {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 2px 8px;
      border-radius: 10px;
      white-space: nowrap;
    }

    .badge-abierto {
      background-color: rgba(34, 197, 94, 0.12);
      color: #16A34A;
    }

    .badge-cerrado {
      background-color: var(--gray-100, #F3F4F6);
      color: var(--gray-500, #6B7280);
    }

    .badge-en_cierre {
      background-color: rgba(245, 158, 11, 0.12);
      color: #D97706;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TurnoSelectorComponent {
  turnoActivo = input.required<Turno | null>();
  turnos = input<Turno[]>([]);
  turnoChange = output<string>();

  estadoLabel = computed(() => {
    const estado = this.turnoActivo()?.estado;
    const labels: Record<TurnoEstado, string> = {
      'ABIERTO': 'Abierto',
      'CERRADO': 'Cerrado',
      'EN_CIERRE': 'En cierre',
    };
    return estado ? labels[estado] : '';
  });

  onTurnoChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.turnoChange.emit(select.value);
  }
}
