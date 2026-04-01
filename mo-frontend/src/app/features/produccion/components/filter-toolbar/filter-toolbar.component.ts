import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ProduccionFilterType, ProduccionFilterContadores } from '../../models/produccion-grid.model';

@Component({
  selector: 'app-filter-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-toolbar">
      <div class="filter-tabs">
        @for (tab of tabs; track tab.id) {
          <button type="button" class="filter-tab" [class.filter-tab-active]="filtroActivo === tab.id" (click)="onFiltroClick(tab.id)">
            {{ tab.label }} ({{ getCount(tab.countKey) }})
          </button>
        }
      </div>
      <div class="toolbar-right">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
          </svg>
          <input type="text" placeholder="Buscar items..." class="search-input" [ngModel]="busquedaInterna()" (ngModelChange)="onBusquedaInput($event)"/>
          @if (busquedaInterna()) {
            <button type="button" class="search-clear" (click)="clearSearch()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
              </svg>
            </button>
          }
        </div>
        <button type="button" class="btn-nueva-estacion" (click)="nuevaEstacion.emit()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Nueva estacion
        </button>
      </div>
    </div>
  `,
  styles: [`
    .filter-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
    .filter-tab {
      padding: 9px 18px; font-size: 14px; font-weight: 500; font-family: inherit;
      color: #6B7280; background: white; border: 1px solid #E5E7EB;
      border-radius: 9999px; cursor: pointer; transition: all 0.15s; white-space: nowrap;
    }
    .filter-tab:hover { border-color: #D1D5DB; background: #F9FAFB; }
    .filter-tab-active { color: #F97316; border-color: #F97316; background: #FFF7ED; }
    .filter-tab-active:hover { background: #FFF7ED; border-color: #F97316; }
    .toolbar-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .search-box {
      display: flex; align-items: center; background: white; border: 1px solid #E5E7EB;
      border-radius: 8px; padding: 0 12px; min-width: 220px; transition: border-color 0.15s, box-shadow 0.15s;
    }
    .search-box:focus-within { border-color: #F97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
    .search-icon { width: 18px; height: 18px; color: #9CA3AF; flex-shrink: 0; }
    .search-input {
      flex: 1; border: none; outline: none; padding: 10px; font-size: 14px;
      font-family: inherit; color: #374151; background: transparent; min-width: 140px;
    }
    .search-input::placeholder { color: #9CA3AF; }
    .search-clear {
      display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;
      padding: 0; background: #F3F4F6; border: none; border-radius: 50%; cursor: pointer; color: #6B7280;
    }
    .search-clear:hover { background: #E5E7EB; color: #374151; }
    .search-clear svg { width: 12px; height: 12px; }
    .btn-nueva-estacion {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; font-size: 14px; font-weight: 500; font-family: inherit;
      color: white; background: #F97316; border: none; border-radius: 8px;
      cursor: pointer; transition: all 0.15s; white-space: nowrap;
      box-shadow: 0 1px 2px rgba(249,115,22,0.2);
    }
    .btn-nueva-estacion:hover { background: #EA580C; }
    .btn-nueva-estacion svg { width: 18px; height: 18px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterToolbarComponent implements OnDestroy {
  @Input() contadores: ProduccionFilterContadores = { todos: 0, conStock: 0, sinStock: 0 };
  @Input() filtroActivo: ProduccionFilterType = 'todos';
  @Input() busqueda = '';
  @Output() filtroChange = new EventEmitter<ProduccionFilterType>();
  @Output() busquedaChange = new EventEmitter<string>();
  @Output() nuevaEstacion = new EventEmitter<void>();

  busquedaInterna = signal('');

  readonly tabs: { id: ProduccionFilterType; label: string; countKey: keyof ProduccionFilterContadores }[] = [
    { id: 'todos', label: 'Todos', countKey: 'todos' },
    { id: 'conStock', label: 'Con stock', countKey: 'conStock' },
    { id: 'sinStock', label: 'Sin stock', countKey: 'sinStock' },
  ];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(v => this.busquedaChange.emit(v));
  }

  ngOnChanges(changes: any): void {
    if (changes['busqueda']) this.busquedaInterna.set(this.busqueda);
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  getCount(key: keyof ProduccionFilterContadores): number { return this.contadores[key] ?? 0; }
  onFiltroClick(filtro: ProduccionFilterType): void { if (filtro !== this.filtroActivo) this.filtroChange.emit(filtro); }
  onBusquedaInput(value: string): void { this.busquedaInterna.set(value); this.searchSubject.next(value); }
  clearSearch(): void { this.busquedaInterna.set(''); this.searchSubject.next(''); }
}
