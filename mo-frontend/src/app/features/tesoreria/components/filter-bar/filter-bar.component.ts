import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroTesoreria, PeriodoPreset } from '../../models';

interface PresetOption {
  key: PeriodoPreset;
  label: string;
}

interface CuentaOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-tesoreria-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filter-bar">
      <div class="filter-left">
        <!-- Date range -->
        <div class="filter-group">
          <label class="filter-label">Periodo</label>
          <div class="date-range">
            <input
              type="date"
              class="date-input"
              [ngModel]="filtro().fechaDesde"
              (ngModelChange)="emitChange({ fechaDesde: $event, periodo: 'personalizado' })"
              aria-label="Fecha desde"
            />
            <span class="date-separator">&mdash;</span>
            <input
              type="date"
              class="date-input"
              [ngModel]="filtro().fechaHasta"
              (ngModelChange)="emitChange({ fechaHasta: $event, periodo: 'personalizado' })"
              aria-label="Fecha hasta"
            />
          </div>
        </div>

        <!-- Periodo preset -->
        <div class="filter-group">
          <label class="filter-label">Rango</label>
          <select
            class="filter-input"
            [ngModel]="filtro().periodo"
            (ngModelChange)="onPresetChange($event)"
            aria-label="Seleccionar rango de periodo"
          >
            @for (p of presets; track p.key) {
              <option [value]="p.key">{{ p.label }}</option>
            }
          </select>
        </div>

        <!-- Turno -->
        <div class="filter-group">
          <label class="filter-label">Turno</label>
          <select
            class="filter-input"
            [ngModel]="filtro().turno"
            (ngModelChange)="emitChange({ turno: $event })"
            aria-label="Seleccionar turno"
          >
            <option value="todos">Todos los turnos</option>
            <option value="manana">Manana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
          </select>
        </div>

        <!-- Cuenta (filtro global por cuenta) -->
        <div class="filter-group">
          <label class="filter-label">Cuenta</label>
          <select
            class="filter-input filter-input--cuenta"
            [ngModel]="cuentaSeleccionada"
            (ngModelChange)="onCuentaSeleccionada($event)"
            aria-label="Seleccionar cuenta"
          >
            @for (c of cuentasOptions; track c.value) {
              <option [value]="c.value">{{ c.label }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Acciones alineadas a la derecha -->
      <div class="header-actions">
        <button class="btn-export" type="button" (click)="onDescargar.emit('xlsx')" aria-label="Descargar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Descargar
        </button>
        <button class="btn-export" type="button" (click)="onImprimir.emit()" aria-label="Imprimir">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12Zm-2.25 0h.008v.008H16.5V12Z" />
          </svg>
          Imprimir
        </button>
        <button class="btn-export" type="button" (click)="onEnviar.emit()" aria-label="Enviar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          Enviar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 12px 0;
      gap: 16px;
      flex-wrap: wrap;
    }

    .filter-left {
      display: flex;
      align-items: flex-end;
      gap: 16px;
      flex-wrap: wrap;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    /* Date range */
    .date-range {
      display: flex;
      align-items: center;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md, 10px);
      background: white;
      overflow: hidden;
      transition: border-color 0.2s ease;
    }

    .date-range:focus-within {
      border-color: var(--primary-orange, #F27920);
      box-shadow: 0 0 0 3px rgba(242, 121, 32, 0.1);
    }

    .date-input {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      padding: 10px 12px;
      border: none;
      background: white;
      color: var(--slate-700, #314158);
      outline: none;
    }

    .date-input:focus {
      background: var(--primary-orange-light, #FFF7ED);
    }

    .date-separator {
      font-size: 13px;
      color: var(--slate-400, #90A1B9);
      padding: 0 4px;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-label {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: var(--slate-700, #314158);
    }

    .filter-input {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      padding: 10px 36px 10px 16px;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md, 10px);
      background: white;
      color: var(--slate-700, #314158);
      outline: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      transition: all 0.2s ease;
      min-width: 140px;
      cursor: pointer;
    }

    .filter-input:focus {
      border-color: var(--primary-orange, #F27920);
      box-shadow: 0 0 0 3px rgba(242, 121, 32, 0.1);
    }

    .filter-input--cuenta {
      min-width: 180px;
    }

    /* Action buttons */
    .btn-export {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      padding: 10px 16px;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md, 10px);
      background: white;
      color: var(--slate-700, #314158);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-export:hover {
      background: var(--slate-50, #F8FAFC);
      border-color: var(--slate-300, #CBD5E1);
    }

    .btn-icon {
      width: 16px;
      height: 16px;
    }
  `],
})
export class TesoreriaFilterBarComponent {
  readonly filtro = input.required<FiltroTesoreria>();
  readonly filtroChange = output<Partial<FiltroTesoreria>>();
  readonly onDescargar = output<'xlsx' | 'pdf'>();
  readonly onImprimir = output<void>();
  readonly onEnviar = output<void>();
  readonly cuentaChange = output<string>();

  cuentaSeleccionada = 'todas';

  readonly presets: PresetOption[] = [
    { key: 'hoy', label: 'Hoy' },
    { key: 'semana', label: 'Semana' },
    { key: 'mes', label: 'Mes' },
    { key: 'anio', label: 'Ano' },
    { key: 'personalizado', label: 'Custom' },
  ];

  readonly cuentasOptions: CuentaOption[] = [
    { value: 'todas', label: 'Todas las cuentas' },
    { value: 'caja-salon', label: 'Caja Salon' },
    { value: 'caja-administracion', label: 'Caja Administracion' },
    { value: 'banco-galicia', label: 'Banco Galicia' },
    { value: 'banco-nacion', label: 'Banco Nacion' },
    { value: 'mercadopago', label: 'MercadoPago' },
  ];

  onPresetChange(preset: PeriodoPreset): void {
    const hoy = new Date();
    let fechaDesde: string;
    const fechaHasta = hoy.toISOString().slice(0, 10);

    switch (preset) {
      case 'hoy':
        fechaDesde = fechaHasta;
        break;
      case 'semana': {
        const d = new Date(hoy);
        d.setDate(d.getDate() - d.getDay() + 1);
        fechaDesde = d.toISOString().slice(0, 10);
        break;
      }
      case 'mes':
        fechaDesde = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10);
        break;
      case 'anio':
        fechaDesde = new Date(hoy.getFullYear(), 0, 1).toISOString().slice(0, 10);
        break;
      default:
        fechaDesde = this.filtro().fechaDesde;
    }

    this.filtroChange.emit({ periodo: preset, fechaDesde, fechaHasta });
  }

  onCuentaSeleccionada(cuenta: string): void {
    this.cuentaSeleccionada = cuenta;
    this.cuentaChange.emit(cuenta);
  }

  emitChange(partial: Partial<FiltroTesoreria>): void {
    this.filtroChange.emit(partial);
  }
}
