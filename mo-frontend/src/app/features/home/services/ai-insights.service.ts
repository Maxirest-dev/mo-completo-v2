import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, EMPTY } from 'rxjs';

import { AiSummary } from '../models';
import { DASHBOARD_DATA_SOURCE } from '../../../core/tokens/dashboard-data-source.token';

/** Cache duration in minutes. */
const CACHE_DURATION_MIN = 15;

/**
 * Manages AI-generated insights/summaries with a 15-minute client-side cache.
 */
@Injectable()
export class AiInsightsService {

  private readonly dataSource = inject(DASHBOARD_DATA_SOURCE);
  private readonly destroyRef = inject(DestroyRef);

  // --- State ---
  readonly summary = signal<AiSummary | null>(null);
  readonly loading = signal(true);

  // --- Cache tracking ---
  private cachedUntil: Date | null = null;

  // --- Actions ---

  loadSummary(turnoId: string): void {
    if (!this.isExpired() && this.summary() !== null) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    this.dataSource.getAiSummary(turnoId).pipe(
      tap(data => {
        this.summary.set(data);
        this.cachedUntil = new Date(Date.now() + CACHE_DURATION_MIN * 60 * 1000);
        this.loading.set(false);
      }),
      catchError(err => {
        console.error('[AiInsightsService] Error loading AI summary:', err);
        this.loading.set(false);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  /** Returns true if the cached summary has expired or no cache exists. */
  isExpired(): boolean {
    if (!this.cachedUntil) {
      return true;
    }
    return new Date() >= this.cachedUntil;
  }

  /** Force reload ignoring cache. */
  refresh(turnoId: string): void {
    this.cachedUntil = null;
    this.loadSummary(turnoId);
  }
}
