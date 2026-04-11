import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasFacade } from '../../state/compras.facade';
import { RubroConceptoGasto, ConceptoGasto } from '../../models/compras.models';
import { RubrosGridComponent } from './rubros-grid.component';
import { RubroModalComponent } from './rubro-modal.component';
import { ConceptosGastoGridComponent } from './conceptos-gasto-grid.component';
import { ConceptoGastoModalComponent } from './concepto-gasto-modal.component';

@Component({
  selector: 'app-configuracion-page',
  standalone: true,
  imports: [
    CommonModule,
    RubrosGridComponent,
    RubroModalComponent,
    ConceptosGastoGridComponent,
    ConceptoGastoModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="config-grid">
      <!-- Rubros -->
      <section class="config-section">
        <div class="section-header">
          <h2>Rubros de Conceptos de Gasto</h2>
          <button class="btn btn-primary btn-sm" (click)="abrirModalRubro()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nuevo Rubro
          </button>
        </div>
        <app-rubros-grid (editarClick)="editarRubro($event)" />
      </section>

      <!-- Conceptos -->
      <section class="config-section">
        <app-conceptos-gasto-grid
          (editarClick)="editarConcepto($event)"
          (desactivarClick)="onDesactivarConcepto($event)"
          (nuevoClick)="abrirModalConcepto()" />
      </section>
    </div>

    <!-- Modales -->
    @if (modalRubroAbierto()) {
      <app-rubro-modal
        [rubroEditar]="rubroEditarId()"
        (guardar)="onGuardarRubro($event)"
        (cerrar)="cerrarModalRubro()" />
    }

    @if (modalConceptoAbierto()) {
      <app-concepto-gasto-modal
        [conceptoEditar]="conceptoEditarId()"
        (guardar)="onGuardarConcepto($event)"
        (cerrar)="cerrarModalConcepto()" />
    }
  `,
  styles: [`
    .config-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: start;
    }

    .config-section {
      background: white;
      border: 1px solid var(--border-color, #E2E8F0);
      border-radius: 12px;
      padding: 20px;
      box-shadow: var(--shadow-sm);
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      h2 {
        font-size: 16px;
        font-weight: 600;
        color: var(--slate-900);
        margin: 0;
      }
    }

    .btn-sm {
      padding: 7px 14px;
      font-size: 13px;
    }
  `]
})
export class ConfiguracionPageComponent {
  private facade = inject(ComprasFacade);

  modalRubroAbierto = signal(false);
  rubroEditarId = signal<number | null>(null);
  modalConceptoAbierto = signal(false);
  conceptoEditarId = signal<number | null>(null);

  abrirModalRubro(): void {
    this.rubroEditarId.set(null);
    this.modalRubroAbierto.set(true);
  }

  editarRubro(id: number): void {
    this.rubroEditarId.set(id);
    this.modalRubroAbierto.set(true);
  }

  cerrarModalRubro(): void {
    this.modalRubroAbierto.set(false);
    this.rubroEditarId.set(null);
  }

  onGuardarRubro(data: Partial<RubroConceptoGasto>): void {
    const id = this.rubroEditarId();
    if (id) {
      this.facade.actualizarRubro(id, data);
    } else {
      this.facade.crearRubro(data);
    }
    this.cerrarModalRubro();
  }

  abrirModalConcepto(): void {
    this.conceptoEditarId.set(null);
    this.modalConceptoAbierto.set(true);
  }

  editarConcepto(id: number): void {
    this.conceptoEditarId.set(id);
    this.modalConceptoAbierto.set(true);
  }

  cerrarModalConcepto(): void {
    this.modalConceptoAbierto.set(false);
    this.conceptoEditarId.set(null);
  }

  onGuardarConcepto(data: Partial<ConceptoGasto>): void {
    const id = this.conceptoEditarId();
    if (id) {
      this.facade.actualizarConcepto(id, data);
    } else {
      this.facade.crearConcepto(data);
    }
    this.cerrarModalConcepto();
  }

  onDesactivarConcepto(id: number): void {
    this.facade.desactivarConcepto(id);
  }
}
