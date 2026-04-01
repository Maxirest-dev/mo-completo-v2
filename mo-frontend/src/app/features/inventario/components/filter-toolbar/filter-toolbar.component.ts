import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  effect,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface FilterContadores {
  todos: number;
  activos: number;
  stockBajo: number;
  critico: number;
}

export type FiltroTipo = 'todos' | 'activos' | 'stockBajo' | 'critico';

interface TabConfig {
  id: FiltroTipo;
  label: string;
  countKey: keyof FilterContadores;
}

@Component({
  selector: 'app-filter-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-toolbar">
      <!-- Filter Tabs (Left) -->
      <div class="filter-tabs">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            class="filter-tab"
            [class.filter-tab-active]="filtroActivo === tab.id"
            (click)="onFiltroClick(tab.id)"
          >
            {{ tab.label }} ({{ getCount(tab.countKey) }})
          </button>
        }
      </div>

      <!-- Right Section -->
      <div class="toolbar-right">
        <!-- Search Box -->
        <div class="search-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="search-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar insumos..."
            class="search-input"
            [ngModel]="busquedaInterna()"
            (ngModelChange)="onBusquedaInput($event)"
          />
          @if (busquedaInterna()) {
            <button
              type="button"
              class="search-clear"
              (click)="clearSearch()"
              title="Limpiar busqueda"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          }
        </div>

        <!-- Nuevo Deposito Button -->
        <button
          type="button"
          class="btn-nuevo-deposito"
          (click)="onNuevoDepositoClick()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Nuevo deposito
        </button>

      </div>
    </div>
  `,
  styles: [`
    .filter-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    /* Filter Tabs - Pill style like reference */
    .filter-tabs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-tab {
      padding: 9px 18px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: var(--slate-500);
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .filter-tab:hover {
      border-color: var(--slate-300);
      background: var(--slate-50);
    }

    .filter-tab-active {
      color: var(--primary-orange);
      border-color: var(--primary-orange);
      background: #FFF7ED;
    }

    .filter-tab-active:hover {
      background: #FFF7ED;
      border-color: var(--primary-orange);
    }

    /* Toolbar Right */
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* Search Box - Matching reference design */
    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      padding: 0 12px;
      min-width: 220px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .search-box:focus-within {
      border-color: var(--primary-orange);
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }

    .search-icon {
      width: 18px;
      height: 18px;
      color: var(--slate-400);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 10px 10px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-primary);
      background: transparent;
      min-width: 140px;
    }

    .search-input::placeholder {
      color: var(--slate-400);
    }

    .search-clear {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
      background: var(--slate-100);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      color: var(--slate-500);
      transition: all 0.15s ease;
    }

    .search-clear:hover {
      background: var(--slate-200);
      color: var(--text-primary);
    }

    .search-clear svg {
      width: 12px;
      height: 12px;
    }

    /* Nuevo Deposito Button - Orange like reference */
    .btn-nuevo-deposito {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: white;
      background: var(--primary-orange);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      box-shadow: 0 1px 2px rgba(249, 115, 22, 0.2);
    }

    .btn-nuevo-deposito:hover {
      background: var(--primary-orange-hover);
    }

    .btn-nuevo-deposito:active {
      background: #C2410C;
    }

    .btn-nuevo-deposito svg {
      width: 18px;
      height: 18px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .filter-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-tabs {
        overflow-x: auto;
        padding-bottom: 4px;
        -webkit-overflow-scrolling: touch;
      }

      .filter-tabs::-webkit-scrollbar {
        height: 4px;
      }

      .filter-tabs::-webkit-scrollbar-thumb {
        background: var(--slate-300);
        border-radius: 4px;
      }

      .toolbar-right {
        justify-content: space-between;
      }

      .search-box {
        flex: 1;
        min-width: 0;
      }
    }

    @media (max-width: 480px) {
      .toolbar-right {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        width: 100%;
      }

      .btn-nuevo-deposito {
        width: 100%;
        justify-content: center;
      }

    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterToolbarComponent implements OnDestroy {
  // Inputs
  @Input() contadores: FilterContadores = {
    todos: 0,
    activos: 0,
    stockBajo: 0,
    critico: 0,
  };

  @Input() filtroActivo: FiltroTipo = 'todos';
  @Input() busqueda: string = '';

  // Outputs
  @Output() filtroChange = new EventEmitter<FiltroTipo>();
  @Output() busquedaChange = new EventEmitter<string>();
  @Output() nuevoDeposito = new EventEmitter<void>();

  // Internal state
  busquedaInterna = signal<string>('');

  // Tabs configuration
  readonly tabs: TabConfig[] = [
    { id: 'todos', label: 'Todos', countKey: 'todos' },
    { id: 'activos', label: 'Activos', countKey: 'activos' },
    { id: 'stockBajo', label: 'Stock bajo', countKey: 'stockBajo' },
    { id: 'critico', label: 'Critico', countKey: 'critico' },
  ];

  // Debounce for search
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    // Setup debounce for search input
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.busquedaChange.emit(value);
      });

    // Sync busqueda input with internal signal
    effect(() => {
      // This effect will run when the component initializes
      // and sync the external busqueda value with internal state
    }, { allowSignalWrites: true });
  }

  ngOnChanges(changes: any): void {
    if (changes['busqueda'] && !changes['busqueda'].firstChange) {
      this.busquedaInterna.set(this.busqueda);
    }
    if (changes['busqueda']?.firstChange) {
      this.busquedaInterna.set(this.busqueda);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCount(key: keyof FilterContadores): number {
    return this.contadores[key] ?? 0;
  }

  onFiltroClick(filtro: FiltroTipo): void {
    if (filtro !== this.filtroActivo) {
      this.filtroChange.emit(filtro);
    }
  }

  onBusquedaInput(value: string): void {
    this.busquedaInterna.set(value);
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.busquedaInterna.set('');
    this.searchSubject.next('');
  }

  onNuevoDepositoClick(): void {
    this.nuevoDeposito.emit();
  }

}
