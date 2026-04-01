import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarioData, CalendarioFormData } from '../../models/producto-perfil.model';

const CANALES = ['TODOS', 'SALON', 'MOSTRADOR', 'DELIVERY', 'PEDIDOS YA'];
const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
const TURNOS = ['Manana', 'Tarde', 'Noche'];

@Component({
  selector: 'app-calendario-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <div class="dialog-header-row">
            <div>
              <h2 class="dialog-title">Calendario de disponibilidad</h2>
              <p class="dialog-subtitle">Configura los turnos en que este producto esta disponible.</p>
            </div>
            <div class="turnos-counter">
              <span class="counter-value">{{ turnosActivosCount() }}</span>
              <span class="counter-label">/{{ turnosTotalCount() }} turnos activos</span>
            </div>
          </div>
        </header>

        <!-- Canal tabs -->
        <div class="canal-tabs">
          @for (canal of canales; track canal) {
            <button
              class="canal-tab"
              [class.canal-tab-active]="canalActivo() === canal"
              (click)="setCanal(canal)"
            >
              {{ canal }}
            </button>
          }
        </div>

        <!-- Quick actions -->
        <div class="quick-actions">
          <button class="quick-btn" (click)="quickAction('all')">Todos los dias</button>
          <button class="quick-btn" (click)="quickAction('weekdays')">Lunes a Viernes</button>
          <button class="quick-btn" (click)="quickAction('weekend')">Fin de semana</button>
          <button class="quick-btn quick-btn-clear" (click)="quickAction('clear')">Limpiar todo</button>
        </div>

        <!-- Days grid -->
        <div class="dialog-body">
          <div class="days-grid">
            @for (dia of dias; track dia; let diaIdx = $index) {
              <div class="day-card" [style.border-left-color]="getDayBorderColor(diaIdx)">
                <div class="day-header">{{ dia }}</div>
                <div class="turnos-list">
                  @for (turno of turnos; track turno; let turnoIdx = $index) {
                    <button
                      class="turno-toggle"
                      [class.turno-active]="isTurnoActive(diaIdx, turnoIdx)"
                      (click)="toggleTurno(diaIdx, turnoIdx)"
                    >
                      <span class="turno-dot" [class.turno-dot-active]="isTurnoActive(diaIdx, turnoIdx)"></span>
                      {{ turno }}
                    </button>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Legend -->
          <div class="legend">
            <div class="legend-item">
              <span class="legend-swatch" style="background: #22C55E;"></span>
              <span>3 turnos</span>
            </div>
            <div class="legend-item">
              <span class="legend-swatch" style="background: var(--primary-orange);"></span>
              <span>2 turnos</span>
            </div>
            <div class="legend-item">
              <span class="legend-swatch" style="background: #EAB308;"></span>
              <span>1 turno</span>
            </div>
            <div class="legend-item">
              <span class="legend-swatch" style="background: var(--slate-300);"></span>
              <span>Inactivo</span>
            </div>
          </div>
        </div>

        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
          <button type="button" class="btn btn-primary" (click)="onSubmit()">Guardar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px; animation: fadeIn 0.15s ease-out;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .dialog-container {
      background: white; border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 100%; max-width: 1100px; max-height: 90vh; overflow-y: auto;
      animation: slideUp 0.2s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dialog-header { padding: 28px 28px 0; }
    .dialog-header-row {
      display: flex; justify-content: space-between; align-items: flex-start;
    }
    .dialog-title { font-size: 22px; font-weight: 600; color: var(--text-heading); margin: 0 0 6px 0; }
    .dialog-subtitle { font-size: 14px; color: var(--slate-500); margin: 0; }

    .turnos-counter {
      display: flex; align-items: baseline; gap: 4px;
      background: var(--slate-100); padding: 8px 16px; border-radius: 10px;
      white-space: nowrap; flex-shrink: 0;
    }
    .counter-value { font-size: 20px; font-weight: 700; color: var(--text-heading); }
    .counter-label { font-size: 13px; color: var(--slate-500); }

    /* Canal tabs */
    .canal-tabs {
      display: flex; gap: 4px; padding: 20px 28px 0;
      border-bottom: 1px solid var(--slate-200);
    }
    .canal-tab {
      padding: 10px 18px; font-size: 13px; font-weight: 500; font-family: inherit;
      color: var(--slate-500); background: transparent; border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer; transition: all 0.15s;
      margin-bottom: -1px;
    }
    .canal-tab:hover { color: var(--text-primary); }
    .canal-tab-active {
      color: var(--primary-orange); border-bottom-color: var(--primary-orange); font-weight: 600;
    }

    /* Quick actions */
    .quick-actions {
      display: flex; gap: 8px; padding: 16px 28px;
      flex-wrap: wrap;
    }
    .quick-btn {
      padding: 6px 14px; font-size: 12px; font-weight: 500; font-family: inherit;
      color: var(--text-primary); background: var(--slate-100); border: 1px solid var(--slate-200);
      border-radius: 8px; cursor: pointer; transition: all 0.15s;
    }
    .quick-btn:hover { background: var(--slate-200); }
    .quick-btn-clear { color: var(--danger-color); border-color: #FECACA; background: #FEF2F2; }
    .quick-btn-clear:hover { background: var(--danger-bg); }

    .dialog-body { padding: 0 28px 16px; }

    /* Days grid */
    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 10px;
    }

    .day-card {
      background: #FAFAFA;
      border: 1px solid var(--slate-200);
      border-left: 3px solid var(--slate-300);
      border-radius: 10px;
      overflow: hidden;
    }

    .day-header {
      padding: 10px 12px 6px;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .turnos-list {
      display: flex; flex-direction: column; gap: 4px;
      padding: 4px 8px 10px;
    }

    .turno-toggle {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 8px; font-size: 12px; font-family: inherit;
      color: var(--slate-400); background: white; border: 1px solid var(--slate-200);
      border-radius: 6px; cursor: pointer; transition: all 0.15s;
      font-weight: 500;
    }
    .turno-toggle:hover { border-color: var(--primary-orange); }
    .turno-active {
      color: var(--text-primary); background: #FFF7ED; border-color: #FDBA74;
    }

    .turno-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--slate-300); flex-shrink: 0; transition: background 0.15s;
    }
    .turno-dot-active { background: #22C55E; }

    /* Legend */
    .legend {
      display: flex; gap: 20px; margin-top: 16px;
      padding-top: 12px; border-top: 1px solid var(--slate-100);
    }
    .legend-item {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: var(--slate-500);
    }
    .legend-swatch {
      width: 10px; height: 10px; border-radius: 3px;
    }

    .dialog-actions {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 12px 28px 28px;
    }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 24px; font-size: 14px; font-weight: 500; font-family: inherit;
      border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s ease;
    }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background-color: var(--text-heading); color: white; }
    .btn-primary:hover:not(:disabled) { background-color: var(--text-primary); }
    .btn-secondary { background-color: white; color: var(--text-primary); border: 1px solid var(--slate-200); }
    .btn-secondary:hover:not(:disabled) { background-color: var(--slate-50); }

    @media (max-width: 900px) {
      .days-grid { grid-template-columns: repeat(4, 1fr); }
    }
    @media (max-width: 600px) {
      .days-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarioDialogComponent implements OnInit {
  @Input() calendario: CalendarioData[] = [];
  @Output() guardar = new EventEmitter<CalendarioFormData>();
  @Output() cancelar = new EventEmitter<void>();

  canales = CANALES;
  dias = DIAS;
  turnos = TURNOS;
  canalActivo = signal('TODOS');

  // Internal state: one CalendarioData per real canal (SALON, MOSTRADOR, DELIVERY, PEDIDOS YA)
  private data = signal<CalendarioData[]>([]);

  // Computed view: which data to show based on active canal tab
  private viewData = computed(() => {
    const canal = this.canalActivo();
    const all = this.data();
    if (canal === 'TODOS') {
      // Merge: a turno is active if active in ANY canal
      return DIAS.map((dia, diaIdx) => ({
        dia,
        turnos: TURNOS.map((_, turnoIdx) => ({
          activo: all.some(c => c.dias[diaIdx]?.turnos[turnoIdx]?.activo),
        })),
      }));
    }
    const canalData = all.find(c => c.canal === canal);
    if (!canalData) return DIAS.map(dia => ({ dia, turnos: TURNOS.map(() => ({ activo: false })) }));
    return canalData.dias;
  });

  turnosActivosCount = computed(() => {
    const all = this.data();
    let count = 0;
    for (const canal of all) {
      for (const dia of canal.dias) {
        for (const turno of dia.turnos) {
          if (turno.activo) count++;
        }
      }
    }
    return count;
  });

  turnosTotalCount = computed(() => {
    const all = this.data();
    return all.length * DIAS.length * TURNOS.length;
  });

  ngOnInit(): void {
    // Deep clone input data
    const cloned = this.calendario.map(c => ({
      canal: c.canal,
      dias: c.dias.map(d => ({
        dia: d.dia,
        turnos: d.turnos.map(t => ({ activo: t.activo })),
      })),
    }));
    this.data.set(cloned);
  }

  setCanal(canal: string): void {
    this.canalActivo.set(canal);
  }

  isTurnoActive(diaIdx: number, turnoIdx: number): boolean {
    const vd = this.viewData();
    return vd[diaIdx]?.turnos[turnoIdx]?.activo ?? false;
  }

  getDayBorderColor(diaIdx: number): string {
    const vd = this.viewData();
    const activeCount = vd[diaIdx]?.turnos.filter(t => t.activo).length ?? 0;
    if (activeCount === 3) return '#22C55E';
    if (activeCount === 2) return 'var(--primary-orange)';
    if (activeCount === 1) return '#EAB308';
    return 'var(--slate-300)';
  }

  toggleTurno(diaIdx: number, turnoIdx: number): void {
    const canal = this.canalActivo();
    this.data.update(all => {
      const next = all.map(c => ({
        canal: c.canal,
        dias: c.dias.map(d => ({
          dia: d.dia,
          turnos: d.turnos.map(t => ({ activo: t.activo })),
        })),
      }));
      if (canal === 'TODOS') {
        // Toggle in ALL canales
        const currentlyActive = next.some(c => c.dias[diaIdx]?.turnos[turnoIdx]?.activo);
        for (const c of next) {
          c.dias[diaIdx].turnos[turnoIdx].activo = !currentlyActive;
        }
      } else {
        const canalData = next.find(c => c.canal === canal);
        if (canalData) {
          canalData.dias[diaIdx].turnos[turnoIdx].activo = !canalData.dias[diaIdx].turnos[turnoIdx].activo;
        }
      }
      return next;
    });
  }

  quickAction(action: string): void {
    const canal = this.canalActivo();
    this.data.update(all => {
      const next = all.map(c => ({
        canal: c.canal,
        dias: c.dias.map(d => ({
          dia: d.dia,
          turnos: d.turnos.map(t => ({ activo: t.activo })),
        })),
      }));

      const applyToCanal = (c: CalendarioData) => {
        for (let diaIdx = 0; diaIdx < DIAS.length; diaIdx++) {
          const isWeekday = diaIdx < 5;
          const isWeekend = diaIdx >= 5;
          for (let turnoIdx = 0; turnoIdx < TURNOS.length; turnoIdx++) {
            if (action === 'all') {
              c.dias[diaIdx].turnos[turnoIdx].activo = true;
            } else if (action === 'weekdays') {
              c.dias[diaIdx].turnos[turnoIdx].activo = isWeekday;
            } else if (action === 'weekend') {
              c.dias[diaIdx].turnos[turnoIdx].activo = isWeekend;
            } else if (action === 'clear') {
              c.dias[diaIdx].turnos[turnoIdx].activo = false;
            }
          }
        }
      };

      if (canal === 'TODOS') {
        next.forEach(applyToCanal);
      } else {
        const canalData = next.find(c => c.canal === canal);
        if (canalData) applyToCanal(canalData);
      }

      return next;
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  onCancel(): void {
    this.cancelar.emit();
  }

  onSubmit(): void {
    this.guardar.emit({ calendario: this.data() });
  }
}
