import { Component, ChangeDetectionStrategy, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprasFacade } from '../../state/compras.facade';
import { ConceptoGasto } from '../../models/compras.models';

@Component({
  selector: 'app-concepto-gasto-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-container" style="max-width:520px;" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div>
            <h2>{{ conceptoEditar() ? 'Editar concepto' : 'Nuevo concepto de gasto' }}</h2>
            <p class="modal-subtitle">Completa los datos del concepto.</p>
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
            <input class="form-input" [(ngModel)]="nombre" placeholder="Ej: Flete refrigerado...">
          </div>

          <div class="form-group">
            <label>Rubro</label>
            <select class="form-select" [(ngModel)]="rubroId" (ngModelChange)="onRubroChange()">
              <option [ngValue]="0" disabled>Seleccionar rubro...</option>
              @for (rubro of facade.rubros(); track rubro.id) {
                <option [ngValue]="rubro.id">{{ rubro.nombre }}</option>
              }
            </select>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="activo">
              Activo
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="cerrar.emit()">Cancelar</button>
          <button class="btn btn-primary" (click)="onGuardar()" [disabled]="!nombre.trim() || !rubroId">Guardar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--gray-700);
      cursor: pointer;

      input[type="checkbox"] {
        width: 16px;
        height: 16px;
        accent-color: var(--primary-orange);
      }
    }
  `]
})
export class ConceptoGastoModalComponent implements OnInit {
  facade = inject(ComprasFacade);

  conceptoEditar = input<number | null>(null);
  guardar = output<Partial<ConceptoGasto>>();
  cerrar = output<void>();

  nombre = '';
  rubroId = 0;
  rubroNombre = '';
  activo = true;

  ngOnInit(): void {
    if (this.conceptoEditar()) {
      const concepto = this.facade.conceptos().find(c => c.id === this.conceptoEditar());
      if (concepto) {
        this.nombre = concepto.nombre;
        this.rubroId = concepto.rubroId;
        this.rubroNombre = concepto.rubro;
        this.activo = concepto.activo;
      }
    }
  }

  onRubroChange(): void {
    const rubro = this.facade.rubros().find(r => r.id === this.rubroId);
    this.rubroNombre = rubro?.nombre || '';
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }

  onGuardar(): void {
    this.guardar.emit({
      nombre: this.nombre.trim(),
      rubroId: this.rubroId,
      rubro: this.rubroNombre,
      activo: this.activo
    });
  }
}
