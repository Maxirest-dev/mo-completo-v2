import { Injectable } from '@angular/core';
import { Subject, interval, map, takeUntil, switchMap, timer } from 'rxjs';

import {
  WsEvent,
  WsKpiPayload,
  WsVentaPayload,
  WsSalonPayload
} from '../../features/home/models';

/**
 * Simulates WebSocket real-time events using RxJS interval + Subject.
 * Observer Pattern: multiple consumers subscribe to typed streams independently.
 *
 * Replace with a real WebSocket connection in the future -- the public
 * Observable API remains identical.
 */
@Injectable({ providedIn: 'root' })
export class WebSocketSimulatorService {

  // --- Private Subjects (event emitters) ---
  private readonly kpiSubject = new Subject<WsEvent<WsKpiPayload>>();
  private readonly ventaSubject = new Subject<WsEvent<WsVentaPayload>>();
  private readonly salonSubject = new Subject<WsEvent<WsSalonPayload>>();

  // --- Destroy signal for cleanup ---
  private destroy$ = new Subject<void>();

  // --- Public read-only Observables ---
  readonly kpiUpdates$ = this.kpiSubject.asObservable();
  readonly ventaUpdates$ = this.ventaSubject.asObservable();
  readonly salonUpdates$ = this.salonSubject.asObservable();

  // --- Simulation state ---
  private running = false;

  /**
   * Starts emitting simulated real-time events at randomized intervals.
   * Safe to call multiple times -- subsequent calls are no-ops while running.
   */
  startSimulation(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.destroy$ = new Subject<void>();

    // KPI updates: every 10-30 seconds
    this.createRandomInterval(10_000, 30_000).pipe(
      takeUntil(this.destroy$),
      map(() => this.generateKpiUpdate())
    ).subscribe(event => this.kpiSubject.next(event));

    // Venta events: every 30-90 seconds
    this.createRandomInterval(30_000, 90_000).pipe(
      takeUntil(this.destroy$),
      map(() => this.generateVentaEvent())
    ).subscribe(event => this.ventaSubject.next(event));

    // Salon updates: every 60 seconds
    interval(60_000).pipe(
      takeUntil(this.destroy$),
      map(() => this.generateSalonUpdate())
    ).subscribe(event => this.salonSubject.next(event));
  }

  /**
   * Stops all running simulations and completes the destroy Subject.
   */
  stopSimulation(): void {
    if (!this.running) {
      return;
    }
    this.destroy$.next();
    this.destroy$.complete();
    this.running = false;
  }

  // -------------------------------------------------------
  // Private helpers: random interval & data generators
  // -------------------------------------------------------

  /**
   * Creates an Observable that emits at random intervals between min and max ms.
   * Each emission schedules the next with a fresh random delay.
   */
  private createRandomInterval(minMs: number, maxMs: number) {
    return new Subject<void>().pipe(
      // Seed with a self-scheduling recursive timer
      source => {
        const output$ = new Subject<number>();
        let count = 0;

        const scheduleNext = (): void => {
          const delayMs = this.randomBetween(minMs, maxMs);
          timer(delayMs).pipe(
            takeUntil(this.destroy$)
          ).subscribe(() => {
            output$.next(count++);
            scheduleNext();
          });
        };

        scheduleNext();
        return output$.asObservable();
      }
    );
  }

  /** Returns a random integer between min (inclusive) and max (inclusive). */
  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** Small random variation: value +/- up to pct%. */
  private randomVariation(baseValue: number, pct: number): number {
    const factor = 1 + (Math.random() * 2 - 1) * (pct / 100);
    return Math.round(baseValue * factor);
  }

  private now(): string {
    return new Date().toISOString();
  }

  // --- KPI update generator ---

  private generateKpiUpdate(): WsEvent<WsKpiPayload> {
    const kpiOptions: Array<{ id: string; titulo: string; base: number; unidad: string; tipo: string }> = [
      { id: 'ventas-hoy', titulo: 'Ventas Hoy', base: 125400, unidad: 'ARS', tipo: 'currency' },
      { id: 'ticket-promedio', titulo: 'Ticket Promedio', base: 4200, unidad: 'ARS', tipo: 'currency' },
      { id: 'food-cost-teorico', titulo: 'Food Cost (Teórico)', base: 28.5, unidad: 'PORCENTAJE', tipo: 'percentage' },
      { id: 'estado-salon', titulo: 'Estado del Salón', base: 85, unidad: 'GAUGE', tipo: 'gauge' }
    ];

    const selected = kpiOptions[this.randomBetween(0, kpiOptions.length - 1)];
    const variationPct = selected.tipo === 'percentage' ? 3 : 5;

    return {
      canal: 'kpi',
      tipo: 'KPI_UPDATE',
      payload: {
        id: selected.id,
        titulo: selected.titulo,
        valor: this.randomVariation(selected.base, variationPct),
        unidad: selected.unidad,
        tipo: selected.tipo
      },
      timestamp: this.now()
    };
  }

  // --- Venta event generator ---

  private generateVentaEvent(): WsEvent<WsVentaPayload> {
    const platos = [
      { productoId: 'd1111111-1111-1111-1111-111111111111', nombre: 'Hamb. Clásica', precio: 4000 },
      { productoId: 'd2222222-2222-2222-2222-222222222222', nombre: 'Ensalada César', precio: 3200 },
      { productoId: 'd3333333-3333-3333-3333-333333333333', nombre: 'Pizza Margarita', precio: 4000 },
      { productoId: 'd4444444-4444-4444-4444-444444444444', nombre: 'Milanesa Napolitana', precio: 5000 },
      { productoId: 'd5555555-5555-5555-5555-555555555555', nombre: 'Lomo Completo', precio: 6000 }
    ];

    const cantProductos = this.randomBetween(1, 3);
    const productos = Array.from({ length: cantProductos }, () => {
      const plato = platos[this.randomBetween(0, platos.length - 1)];
      const cantidad = this.randomBetween(1, 2);
      return {
        productoId: plato.productoId,
        nombre: plato.nombre,
        cantidad
      };
    });

    const monto = productos.reduce((sum, p) => {
      const plato = platos.find(pl => pl.productoId === p.productoId);
      return sum + (plato?.precio ?? 0) * p.cantidad;
    }, 0);

    return {
      canal: 'ventas',
      tipo: 'NUEVA_VENTA',
      payload: {
        ventaId: crypto.randomUUID(),
        monto,
        productos
      },
      timestamp: this.now()
    };
  }

  // --- Salon update generator ---

  private generateSalonUpdate(): WsEvent<WsSalonPayload> {
    const mesasTotales = 20;
    const mesasOcupadas = this.randomBetween(10, mesasTotales);
    const ocupacionPct = Math.round((mesasOcupadas / mesasTotales) * 100);

    return {
      canal: 'salon',
      tipo: 'SALON_UPDATE',
      payload: {
        mesasOcupadas,
        mesasTotales,
        ocupacionPct
      },
      timestamp: this.now()
    };
  }
}
