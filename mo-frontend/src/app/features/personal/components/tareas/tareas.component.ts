import { Component, ChangeDetectionStrategy, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tarea, Checklist, EstadoTarea } from '../../models/personal.model';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../../balances/styles/balances-shared.css',
  template: `
    <!-- View Toggle -->
    <div class="view-toggle">
      <button class="pill-btn" [class.pill-active]="vistaActiva() === 'tareas'"
              (click)="vistaActiva.set('tareas')">Tareas</button>
      <button class="pill-btn" [class.pill-active]="vistaActiva() === 'checklists'"
              (click)="vistaActiva.set('checklists')">Checklists</button>
    </div>

    <!-- ========== TAREAS VIEW ========== -->
    @if (vistaActiva() === 'tareas') {
      <!-- KPI Row (4 cards, one per estado) -->
      <div class="kpi-row kpi-row-4">
        @for (kpi of estadoKpis; track kpi.estado) {
          <div class="kpi-card kpi-card-sm" [style.border-left]="'3px solid ' + kpi.color"
               (click)="toggleFiltro(kpi.estado)">
            <span class="kpi-label">{{ kpi.estado }}</span>
            <span class="kpi-value">{{ tareasCount()[kpi.estado] || 0 }}</span>
          </div>
        }
      </div>

      <!-- Tareas Table -->
      <div class="card">
        <div class="card-header-row">
          <h3 class="card-title">Listado de Tareas</h3>
          @if (filtroEstado()) {
            <button class="btn-action" (click)="filtroEstado.set('')">
              Limpiar filtro: {{ filtroEstado() }}
            </button>
          }
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Asignado a</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Fecha Limite</th>
            </tr>
          </thead>
          <tbody>
            @for (t of filteredTareas(); track t.id) {
              <tr>
                <td class="td-bold">{{ t.titulo }}</td>
                <td>{{ t.asignadoA }}</td>
                <td>{{ t.rol }}</td>
                <td>
                  <span class="badge" [ngClass]="estadoBadgeClass(t.estado)">
                    {{ t.estado }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="prioridadBadgeClass(t.prioridad)">
                    {{ t.prioridad }}
                  </span>
                </td>
                <td>{{ t.fechaLimite }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6">
                  <div class="empty-state">
                    <span class="empty-state-icon">&#128203;</span>
                    <span>No hay tareas registradas</span>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- ========== CHECKLISTS VIEW ========== -->
    @if (vistaActiva() === 'checklists') {
      <div class="bottom-row-2">
        @for (cl of checklists; track cl.tipo) {
          @let completados = completadosCount(cl);
          @let total = cl.items.length;
          @let pct = total > 0 ? Math.round((completados / total) * 100) : 0;
          <div class="card checklist-card">
            <h3 class="card-title">{{ cl.titulo }}</h3>

            <!-- Progress bar -->
            <div class="progress-track">
              <div class="progress-fill"
                   [style.width.%]="pct"
                   [class.progress-complete]="pct === 100">
              </div>
            </div>
            <span class="progress-label">{{ pct }}% completado</span>

            <!-- Items -->
            <ul class="checklist-list">
              @for (item of cl.items; track item.id) {
                <li class="checklist-item"
                    [class.checklist-done]="item.completado">
                  <span class="check-icon">{{ item.completado ? '\u2713' : '\u25CB' }}</span>
                  <span class="checklist-desc">{{ item.descripcion }}</span>
                  @if (item.obligatorio) {
                    <span class="badge badge-obligatorio">Obligatorio</span>
                  }
                </li>
              }
            </ul>

            <!-- Footer -->
            <div class="checklist-footer">
              {{ completados }} de {{ total }} completados
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    /* ===== VIEW TOGGLE ===== */
    .view-toggle {
      display: flex;
      background: var(--slate-100, #F3F4F6);
      border-radius: 8px;
      padding: 2px;
      margin-bottom: 16px;
      width: fit-content;
    }

    .pill-btn {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      padding: 6px 14px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--slate-500, #6B7280);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .pill-active {
      background: #fff;
      color: var(--slate-900, #0F172B);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    }

    /* ===== KPI ROW 4 COLS ===== */
    .kpi-row-4 {
      grid-template-columns: repeat(4, 1fr);
    }

    .kpi-card-sm {
      padding: 14px 16px;
      cursor: pointer;
      transition: box-shadow 0.15s ease;
    }

    .kpi-card-sm:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .kpi-card-sm .kpi-value {
      font-size: 22px;
    }

    /* ===== ESTADO BADGES ===== */
    .badge-revision {
      background: #F3E8FF;
      color: #7C3AED;
    }

    /* ===== PRIORIDAD BADGES ===== */
    .badge-baja {
      background: var(--slate-100, #F3F4F6);
      color: var(--slate-500, #6B7280);
    }

    /* ===== CHECKLIST CARD ===== */
    .checklist-card {
      gap: 10px;
    }

    .progress-track {
      width: 100%;
      height: 6px;
      background: var(--slate-100, #F3F4F6);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #2563EB;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .progress-complete {
      background: #22C55E;
    }

    .progress-label {
      font-size: 11px;
      color: var(--slate-400, #9CA3AF);
    }

    .checklist-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .checklist-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-left: 3px solid var(--slate-200, #E5E7EB);
      font-size: 12px;
      color: var(--slate-700, #374151);
    }

    .checklist-item.checklist-done {
      border-left-color: #22C55E;
    }

    .check-icon {
      font-size: 14px;
      width: 18px;
      text-align: center;
      flex-shrink: 0;
    }

    .checklist-done .check-icon {
      color: #22C55E;
    }

    .checklist-desc {
      flex: 1;
    }

    .badge-obligatorio {
      background: #FEF3C7;
      color: #D97706;
      font-size: 9px;
      font-weight: 600;
      padding: 1px 6px;
      border-radius: 9999px;
      flex-shrink: 0;
    }

    .checklist-footer {
      font-size: 11px;
      color: var(--slate-400, #9CA3AF);
      padding-top: 6px;
      border-top: 1px solid var(--slate-100, #F3F4F6);
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .kpi-row-4 { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .kpi-row-4 { grid-template-columns: 1fr; }
    }
  `]
})
export class TareasComponent {

  @Input() tareas: Tarea[] = [];
  @Input() checklists: Checklist[] = [];

  readonly Math = Math;

  readonly filtroEstado = signal<string>('');
  readonly vistaActiva = signal<'tareas' | 'checklists'>('tareas');

  readonly estadoKpis: { estado: EstadoTarea; color: string }[] = [
    { estado: 'Pendiente', color: '#D97706' },
    { estado: 'En proceso', color: '#2563EB' },
    { estado: 'Revisión', color: '#7C3AED' },
    { estado: 'Finalizado', color: '#22C55E' },
  ];

  readonly tareasCount = computed(() => {
    const counts: Record<string, number> = {};
    for (const t of this.tareas) {
      counts[t.estado] = (counts[t.estado] || 0) + 1;
    }
    return counts;
  });

  readonly filteredTareas = computed(() => {
    const estado = this.filtroEstado();
    if (!estado) return this.tareas;
    return this.tareas.filter(t => t.estado === estado);
  });

  toggleFiltro(estado: string): void {
    this.filtroEstado.update(current => current === estado ? '' : estado);
  }

  estadoBadgeClass(estado: EstadoTarea): string {
    switch (estado) {
      case 'Pendiente': return 'badge-pending';
      case 'En proceso': return 'badge-process';
      case 'Revisión': return 'badge-revision';
      case 'Finalizado': return 'badge-ok';
    }
  }

  prioridadBadgeClass(prioridad: 'Alta' | 'Media' | 'Baja'): string {
    switch (prioridad) {
      case 'Alta': return 'badge-alert';
      case 'Media': return 'badge-pending';
      case 'Baja': return 'badge-baja';
    }
  }

  completadosCount(cl: Checklist): number {
    return cl.items.filter(i => i.completado).length;
  }
}
