import { Component, ChangeDetectionStrategy, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprasFacade } from '../../state/compras.facade';
import { RubroConceptoGasto } from '../../models/compras.models';

@Component({
  selector: 'app-rubro-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-container" style="max-width:480px;" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div>
            <h2>{{ rubroEditar() ? 'Editar rubro' : 'Nuevo rubro' }}</h2>
            <p class="modal-subtitle">Nombre del rubro de concepto de gasto.</p>
          </div>
          <button class="modal-close" (click)="cerrar.emit()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Nombre</label>
            <input class="form-input" [(ngModel)]="nombre" placeholder="Ej: Fletes, Servicios...">
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="cerrar.emit()">Cancelar</button>
          <button class="btn btn-primary" (click)="onGuardar()" [disabled]="!nombre.trim()">Guardar</button>
        </div>
      </div>
    </div>
  `
})
export class RubroModalComponent implements OnInit {
  facade = inject(ComprasFacade);

  rubroEditar = input<number | null>(null);
  guardar = output<Partial<RubroConceptoGasto>>();
  cerrar = output<void>();

  nombre = '';

  ngOnInit(): void {
    if (this.rubroEditar()) {
      const rubro = this.facade.rubros().find(r => r.id === this.rubroEditar());
      if (rubro) {
        this.nombre = rubro.nombre;
      }
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }

  onGuardar(): void {
    this.guardar.emit({ nombre: this.nombre.trim() });
  }
}
