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
import { Estacion, EstacionFormData } from '../../models/producto-perfil.model';
import { ESTACIONES_DISPONIBLES } from '../../data/mock-producto-perfil.data';

@Component({
  selector: 'app-estacion-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <h2 class="dialog-title">Estacion de preparacion</h2>
          <p class="dialog-subtitle">Selecciona en que estaciones se prepara este producto.</p>
        </header>

        <div class="dialog-body">
          <div class="estaciones-grid">
            @for (est of estaciones; track est.id) {
              <div
                class="estacion-card"
                [class.estacion-selected]="isSelected(est.id)"
                (click)="toggleEstacion(est.id)"
              >
                @if (isSelected(est.id)) {
                  <span class="estacion-check"></span>
                }
                <div class="estacion-icon">
                  @switch (est.icono) {
                    @case ('mostrador') {
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/>
                      </svg>
                    }
                    @case ('barra') {
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>
                      </svg>
                    }
                    @case ('cocina') {
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"/>
                      </svg>
                    }
                    @case ('parrilla') {
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 5.625v-.75ZM3.75 9.375c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 10.125v-.75ZM3.75 13.875c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125H4.875a1.125 1.125 0 0 1-1.125-1.125v-.75ZM6 18.75v2.25M12 18.75v2.25M18 18.75v2.25"/>
                      </svg>
                    }
                  }
                </div>
                <span class="estacion-name">{{ est.nombre }}</span>
              </div>
            }
            <!-- Agregar card -->
            <div class="estacion-card estacion-add">
              <div class="estacion-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
              </div>
              <span class="estacion-name">Agregar</span>
            </div>
          </div>

          <div class="selection-summary">
            {{ selectedCount() }} estacion{{ selectedCount() !== 1 ? 'es' : '' }} seleccionada{{ selectedCount() !== 1 ? 's' : '' }}
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
      width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto;
      animation: slideUp 0.2s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dialog-header { padding: 28px 28px 0; }
    .dialog-title { font-size: 22px; font-weight: 600; color: var(--text-heading); margin: 0 0 6px 0; }
    .dialog-subtitle { font-size: 14px; color: var(--slate-500); margin: 0; }

    .dialog-body { padding: 24px 28px; }

    .estaciones-grid {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .estacion-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 120px;
      height: 120px;
      border: 2px solid var(--slate-200);
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: white;
    }
    .estacion-card:hover {
      border-color: var(--primary-orange);
      background: #FFF7ED;
    }

    .estacion-selected {
      border-color: var(--primary-orange);
      background: #FFF7ED;
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
    }
    .estacion-selected .estacion-icon { color: var(--primary-orange); }
    .estacion-selected .estacion-name { color: var(--primary-orange-hover); font-weight: 600; }

    .estacion-check {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #22C55E;
    }

    .estacion-add {
      border-style: dashed;
      border-color: var(--slate-300);
      color: var(--slate-400);
    }
    .estacion-add:hover {
      border-color: var(--slate-400);
      background: var(--slate-50);
    }
    .estacion-add .estacion-icon { color: var(--slate-300); }
    .estacion-add .estacion-name { color: var(--slate-400); }

    .estacion-icon { color: var(--slate-500); transition: color 0.2s; }
    .estacion-name { font-size: 13px; font-weight: 500; color: var(--text-primary); transition: all 0.2s; }

    .selection-summary {
      margin-top: 20px;
      font-size: 13px;
      color: var(--slate-500);
    }

    .dialog-actions {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 0 28px 28px;
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstacionDialogComponent implements OnInit {
  @Input() estacionesSeleccionadas: number[] = [];
  @Output() guardar = new EventEmitter<EstacionFormData>();
  @Output() cancelar = new EventEmitter<void>();

  estaciones = ESTACIONES_DISPONIBLES;
  selected = signal<Set<number>>(new Set());

  selectedCount = computed(() => this.selected().size);

  ngOnInit(): void {
    this.selected.set(new Set(this.estacionesSeleccionadas));
  }

  isSelected(id: number): boolean {
    return this.selected().has(id);
  }

  toggleEstacion(id: number): void {
    this.selected.update(s => {
      const next = new Set(s);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
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
    this.guardar.emit({ estaciones: Array.from(this.selected()) });
  }
}
