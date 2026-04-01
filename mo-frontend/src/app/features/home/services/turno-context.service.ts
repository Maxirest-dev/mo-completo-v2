import { Injectable, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { Turno } from '../models';
import { MOCK_TURNO_ACTUAL, MOCK_TURNOS } from '../data';

/**
 * Manages the active turno context for the dashboard.
 * NOT providedIn root -- provided at the feature level so it lives
 * within the Home route lifecycle.
 */
@Injectable()
export class TurnoContextService {

  // --- State signals ---
  readonly turnoActivo = signal<Turno | null>(null);
  readonly turnos = signal<Turno[]>([]);

  // --- Observable bridge for services that need RxJS ---
  readonly turnoActivo$ = toObservable(this.turnoActivo);

  // --- Computed: find same turno name from 7 days ago ---
  readonly turnoHistorico = computed<Turno | null>(() => {
    const activo = this.turnoActivo();
    if (!activo) {
      return null;
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.turnos().find(t => {
      if (t.nombre !== activo.nombre || t.id === activo.id) {
        return false;
      }
      const turnoDate = new Date(t.horaApertura);
      return turnoDate.toDateString() === sevenDaysAgo.toDateString();
    }) ?? null;
  });

  // --- Actions ---

  loadTurnoActivo(): void {
    this.turnoActivo.set(MOCK_TURNO_ACTUAL);
  }

  loadTurnos(): void {
    this.turnos.set(MOCK_TURNOS);
  }

  changeTurno(turnoId: string): void {
    const found = this.turnos().find(t => t.id === turnoId);
    if (found) {
      this.turnoActivo.set(found);
    }
  }
}
