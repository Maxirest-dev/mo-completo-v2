import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroBalances, PeriodoPreset } from '../../models';

interface PresetOption {
  key: PeriodoPreset;
  label: string;
}

@Component({
  selector: 'app-balances-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filter-bar">
      <div class="filter-left">
        <!-- Periodo presets -->
        <div class="preset-group" role="group" aria-label="Seleccionar período">
          @for (p of presets; track p.key) {
            <button
              class="preset-btn"
              [class.preset-active]="filtro().periodo === p.key"
              (click)="onPresetChange(p.key)"
              type="button"
            >{{ p.label }}</button>
          }
        </div>

        <!-- Date pickers (visible cuando es personalizado o siempre para ajustar) -->
        <div class="filter-input">
          <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <input
            type="date"
            [ngModel]="filtro().fechaDesde"
            (ngModelChange)="emitChange({ fechaDesde: $event, periodo: 'personalizado' })"
            aria-label="Fecha desde"
          />
        </div>
        <div class="filter-input">
          <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <input
            type="date"
            [ngModel]="filtro().fechaHasta"
            (ngModelChange)="emitChange({ fechaHasta: $event, periodo: 'personalizado' })"
            aria-label="Fecha hasta"
          />
        </div>

        <!-- Turno -->
        <select
          class="filter-select"
          [ngModel]="filtro().turno"
          (ngModelChange)="emitChange({ turno: $event })"
          aria-label="Seleccionar turno"
        >
          <option value="todos">Turno: Todos</option>
          <option value="manana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="noche">Noche</option>
        </select>
      </div>

      <div class="filter-right">
        <!-- Comparativa interanual -->
        <button
          class="btn-compare"
          [class.btn-compare-active]="filtro().compararAnioAnterior"
          (click)="emitChange({ compararAnioAnterior: !filtro().compararAnioAnterior })"
          type="button"
          [attr.aria-pressed]="filtro().compararAnioAnterior"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
          vs Año anterior
        </button>

        <!-- Acciones -->
        <button class="btn-filter" type="button" (click)="onDescargar.emit('xlsx')" aria-label="Descargar Excel">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Excel
        </button>
        <button class="btn-filter" type="button" (click)="onDescargar.emit('pdf')" aria-label="Descargar PDF">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          PDF
        </button>
        <button class="btn-filter" type="button" (click)="onImprimir.emit()" aria-label="Imprimir">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Imprimir
        </button>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      gap: 12px;
      flex-wrap: wrap;
    }

    .filter-left, .filter-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    /* Presets */
    .preset-group {
      display: flex;
      border: 1px solid var(--slate-200, #E5E7EB);
      border-radius: 6px;
      overflow: hidden;
    }

    .preset-btn {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 500;
      padding: 6px 12px;
      border: none;
      border-right: 1px solid var(--slate-200, #E5E7EB);
      background: #fff;
      color: var(--slate-500, #6B7280);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .preset-btn:last-child { border-right: none; }
    .preset-btn:hover:not(.preset-active) { background: #F9FAFB; }

    .preset-active {
      background: var(--primary-orange, #F27920);
      color: #fff;
    }

    /* Date pickers */
    .filter-input {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 10px;
      height: 32px;
      border: 1px solid var(--slate-200, #E5E7EB);
      border-radius: 6px;
      background: #fff;
    }

    .filter-icon {
      width: 14px;
      height: 14px;
      color: var(--slate-500, #6B7280);
      flex-shrink: 0;
    }

    .filter-input input {
      border: none;
      outline: none;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: var(--slate-900, #111827);
      background: transparent;
      width: 110px;
    }

    .filter-select {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: var(--slate-900, #111827);
      height: 32px;
      padding: 0 10px;
      border: 1px solid var(--slate-200, #E5E7EB);
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      outline: none;
    }

    /* Compare button */
    .btn-compare {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-500, #6B7280);
      padding: 0 12px;
      height: 32px;
      border: 1px dashed var(--slate-300, #D1D5DB);
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-compare:hover { border-color: #1155CC; color: #1155CC; }

    .btn-compare-active {
      background: #EFF6FF;
      border-color: #1155CC;
      border-style: solid;
      color: #1155CC;
    }

    /* Action buttons */
    .btn-filter {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 400;
      color: var(--slate-900, #111827);
      padding: 0 10px;
      height: 32px;
      border: 1px solid var(--slate-200, #E5E7EB);
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-filter:hover { background: #F9FAFB; border-color: #D1D5DB; }
    .btn-filter svg { color: var(--slate-500, #6B7280); }
  `],
})
export class BalancesFilterBarComponent {
  readonly filtro = input.required<FiltroBalances>();
  readonly filtroChange = output<Partial<FiltroBalances>>();
  readonly onDescargar = output<'xlsx' | 'pdf'>();
  readonly onImprimir = output<void>();

  readonly presets: PresetOption[] = [
    { key: 'hoy', label: 'Hoy' },
    { key: 'semana', label: 'Semana' },
    { key: 'mes', label: 'Mes' },
    { key: 'anio', label: 'Año' },
    { key: 'personalizado', label: 'Custom' },
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

  emitChange(partial: Partial<FiltroBalances>): void {
    this.filtroChange.emit(partial);
  }
}
