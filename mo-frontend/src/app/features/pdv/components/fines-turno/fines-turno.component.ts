import {
  Component,
  ChangeDetectionStrategy,
  input,
  Output,
  EventEmitter,
  signal,
  computed,
} from '@angular/core';
import { FinTurno } from '../../models';

interface CalendarDay {
  day: number;
  inMonth: boolean;
  isToday: boolean;
  hasShift: boolean;
  date: string;
}

@Component({
  selector: 'app-fines-turno',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <div class="card-header">
        <div class="card-header-left">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="header-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          <div class="card-header-text">
            <span class="card-header-title">Fines de Turno</span>
            <span class="card-header-subtitle">Informe mensual</span>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div class="month-nav">
          <button class="nav-arrow" (click)="prevMonth()" title="Mes anterior">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span class="month-label">{{ monthLabel() }}</span>
          <button class="nav-arrow" (click)="nextMonth()" title="Mes siguiente">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div class="calendar-grid">
          <div class="day-header">L</div>
          <div class="day-header">M</div>
          <div class="day-header">M</div>
          <div class="day-header">J</div>
          <div class="day-header">V</div>
          <div class="day-header">S</div>
          <div class="day-header">D</div>

          @for (day of calendarDays(); track day.date) {
            <div
              class="day-cell"
              [class.out-of-month]="!day.inMonth"
              [class.today]="day.isToday"
              [class.has-shift]="day.hasShift"
              [class.clickable]="day.hasShift"
              (click)="day.hasShift ? onDayClick(day.date) : null"
            >
              <span class="day-number">{{ day.day }}</span>
              @if (day.hasShift) {
                <span class="shift-dot"></span>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      align-items: center;
      padding: 16px 25px;
      border-bottom: 1px solid var(--divider-color);
    }

    .card-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-icon {
      width: 20px;
      height: 20px;
      color: var(--slate-400);
    }

    .card-header-text {
      display: flex;
      flex-direction: column;
    }

    .card-header-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-heading);
    }

    .card-header-subtitle {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .card-body {
      padding: 20px 25px 25px;
    }

    .month-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .month-label {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-heading);
      text-transform: capitalize;
    }

    .nav-arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      background: var(--bg-primary);
      color: var(--slate-500);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .nav-arrow:hover {
      background: var(--slate-50);
      border-color: var(--slate-300);
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }

    .day-header {
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: var(--slate-400);
      padding: 8px 0;
      text-transform: uppercase;
    }

    .day-cell {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 40px;
      border-radius: var(--radius-sm);
      cursor: default;
      transition: background 0.15s ease;
    }

    .day-cell:hover {
      background: var(--slate-50);
    }

    .day-number {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .day-cell.out-of-month .day-number {
      color: var(--slate-300);
    }

    .day-cell.today {
      background: var(--slate-100);
    }

    .day-cell.today .day-number {
      color: var(--text-heading);
      font-weight: 700;
    }

    .day-cell.has-shift {
      background: var(--primary-orange-light);
    }

    .day-cell.has-shift .day-number {
      color: var(--primary-orange);
      font-weight: 600;
    }

    .day-cell.clickable {
      cursor: pointer;
    }

    .day-cell.clickable:hover {
      background: var(--primary-orange-lighter);
    }

    .shift-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--primary-orange);
      margin-top: 1px;
    }
  `],
})
export class FinesTurnoComponent {
  finesTurno = input.required<FinTurno[]>();
  @Output() fechaSelect = new EventEmitter<string>();

  onDayClick(date: string): void {
    this.fechaSelect.emit(date);
  }

  currentYear = signal(2026);
  currentMonth = signal(2); // 0-indexed: March = 2

  private readonly monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  monthLabel = computed(() =>
    `${this.monthNames[this.currentMonth()]} ${this.currentYear()}`
  );

  calendarDays = computed<CalendarDay[]>(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Monday = 0, Sunday = 6
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const shiftDates = new Set(
      this.finesTurno().map((f) => f.fecha)
    );

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const days: CalendarDay[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const pm = month === 0 ? 11 : month - 1;
      const py = month === 0 ? year - 1 : year;
      const dateStr = `${py}-${String(pm + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, inMonth: false, isToday: dateStr === todayStr, hasShift: false, date: dateStr });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        inMonth: true,
        isToday: dateStr === todayStr,
        hasShift: shiftDates.has(dateStr),
        date: dateStr,
      });
    }

    // Next month padding to fill 6 rows
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nm = month === 11 ? 0 : month + 1;
      const ny = month === 11 ? year + 1 : year;
      const dateStr = `${ny}-${String(nm + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, inMonth: false, isToday: false, hasShift: false, date: dateStr });
    }

    return days;
  });

  prevMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.update((y) => y - 1);
    } else {
      this.currentMonth.update((m) => m - 1);
    }
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.update((y) => y + 1);
    } else {
      this.currentMonth.update((m) => m + 1);
    }
  }
}
