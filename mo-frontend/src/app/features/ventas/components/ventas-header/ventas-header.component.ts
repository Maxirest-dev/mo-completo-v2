import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroVentas } from '../../models';

@Component({
  selector: 'app-ventas-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ventas-header">
      <div class="header-filters">
        <div class="filter-group">
          <label class="filter-label">Periodo</label>
          <div class="date-range">
            <input
              type="date"
              class="date-input"
              [ngModel]="filtro().fechaDesde"
              (ngModelChange)="onFechaDesdeChange($event)"
            />
            <span class="date-separator">—</span>
            <input
              type="date"
              class="date-input"
              [ngModel]="filtro().fechaHasta"
              (ngModelChange)="onFechaHastaChange($event)"
            />
          </div>
        </div>
        <div class="filter-group">
          <label class="filter-label">Turno</label>
          <select
            class="filter-input"
            [ngModel]="filtro().turno"
            (ngModelChange)="onTurnoChange($event)"
          >
            <option value="todos">Todos los turnos</option>
            <option value="manana">Manana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
          </select>
        </div>
      </div>
      <button class="btn-export" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        Exportar
      </button>
    </div>
  `,
  styles: [`
    .ventas-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      margin-bottom: 20px;
    }

    .header-filters {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin: 4px 0 0;
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
      padding: 10px 16px;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: var(--radius-md, 10px);
      background: white;
      color: var(--slate-700, #314158);
      outline: none;
      transition: all 0.2s ease;
      min-width: 140px;
    }

    .filter-input:focus {
      border-color: var(--primary-orange, #F27920);
      box-shadow: 0 0 0 3px rgba(242, 121, 32, 0.1);
    }

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
    .date-input:focus { background: var(--primary-orange-light, #FFF7ED); }
    .date-separator {
      font-size: 14px;
      color: var(--slate-400, #90A1B9);
      padding: 0 4px;
    }

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

    @media (max-width: 768px) {
      .ventas-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .filter-input {
        min-width: unset;
        width: 100%;
      }
    }
  `],
})
export class VentasHeaderComponent {
  readonly filtro = input.required<FiltroVentas>();
  readonly filtroChange = output<FiltroVentas>();

  onFechaDesdeChange(fechaDesde: string): void {
    this.filtroChange.emit({ ...this.filtro(), fechaDesde });
  }

  onFechaHastaChange(fechaHasta: string): void {
    this.filtroChange.emit({ ...this.filtro(), fechaHasta });
  }

  onTurnoChange(turno: FiltroVentas['turno']): void {
    this.filtroChange.emit({ ...this.filtro(), turno });
  }
}
