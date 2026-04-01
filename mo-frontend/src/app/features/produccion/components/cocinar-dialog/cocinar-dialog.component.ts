import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduccionGridRow } from '../../models/produccion-grid.model';
import { CocinarRequest } from '../../models/produccion.model';

@Component({
  selector: 'app-cocinar-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <header class="dialog-header">
          <div class="header-top">
            <h2 class="dialog-title">Cocinar</h2>
            <span class="badge-tipo" [class]="'tipo-' + item.tipo.toLowerCase()">
              {{ item.tipo === 'TRANSFORMACION' ? 'Transformacion' : 'Elaborado' }}
            </span>
          </div>
          <p class="dialog-item-name">{{ item.nombre }}</p>
        </header>

        <div class="dialog-body">
          <!-- Formula -->
          <div class="formula-section">
            <label class="section-label">FORMULA</label>
            @if (item.tipo === 'TRANSFORMACION') {
              <div class="formula-row">
                <span class="formula-origen">{{ item.origenCantidad }} {{ item.unidadMedidaOrigen }} {{ item.insumoOrigenNombre }}</span>
                <svg class="formula-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                </svg>
                <span class="formula-tipo-badge">{{ item.tipoTransformacion }}</span>
                <svg class="formula-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                </svg>
                <span class="formula-resultado">{{ item.resultadoCantidad }} {{ item.unidadMedida }}</span>
              </div>
            } @else {
              <div class="ingredientes-list">
                @for (ing of item.ingredientes; track ing.id) {
                  <div class="ing-row">
                    <span class="ing-dot"></span>
                    <span>{{ ing.nombre }} {{ ing.cantidad }} {{ ing.unidad }}</span>
                  </div>
                }
              </div>
              <div class="formula-resultado-elab">
                Produce: <strong>{{ item.resultadoCantidad }} {{ item.unidadMedida }}</strong> por lote
              </div>
            }
          </div>

          <!-- Stock info -->
          <div class="stock-info">
            <div class="stock-card">
              <span class="stock-label">Stock inventario</span>
              <span class="stock-value">{{ item.stockInventario }} {{ item.unidadMedidaOrigen }}</span>
            </div>
            <div class="stock-card">
              <span class="stock-label">Stock produccion actual</span>
              <span class="stock-value stock-prod">{{ item.stockProduccion }} {{ item.unidadMedida }}</span>
            </div>
          </div>

          <!-- Cantidad input -->
          <div class="cantidad-section">
            <label class="section-label">CANTIDAD DE LOTES</label>
            <input class="cantidad-input" type="number" [(ngModel)]="cantidadBatches" min="1" [max]="maxBatches()" placeholder="1"/>
            @if (cantidadBatches > maxBatches()) {
              <span class="error-msg">No hay suficiente stock de inventario (max: {{ maxBatches() }} lotes)</span>
            }
          </div>

          <!-- Preview -->
          <div class="preview-section">
            <label class="section-label">RESULTADO</label>
            <div class="preview-grid">
              <div class="preview-item">
                <span class="preview-label">Material necesario</span>
                <span class="preview-value preview-consume">- {{ consumo() }} {{ item.unidadMedidaOrigen }} {{ item.insumoOrigenNombre }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Se produciran</span>
                <span class="preview-value preview-produce">+ {{ resultado() }} {{ item.unidadMedida }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Stock inventario resultante</span>
                <span class="preview-value">{{ stockInvResultante() }} {{ item.unidadMedidaOrigen }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Stock produccion resultante</span>
                <span class="preview-value preview-produce">{{ stockProdResultante() }} {{ item.unidadMedida }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
          <button type="button" class="btn btn-primary" (click)="onConfirm()" [disabled]="!isValid()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"/>
            </svg>
            Cocinar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px;
    }
    .dialog-container {
      background: white; border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto;
    }
    .dialog-header { padding: 28px 28px 0; }
    .header-top { display: flex; align-items: center; gap: 12px; }
    .dialog-title { font-size: 22px; font-weight: 600; color: var(--text-heading); margin: 0; }
    .dialog-item-name { font-size: 16px; color: var(--slate-500); margin: 6px 0 0; font-weight: 500; }
    .badge-tipo { display: inline-block; padding: 3px 10px; font-size: 12px; font-weight: 500; border-radius: 6px; }
    .tipo-transformacion { background: #DBEAFE; color: #1E40AF; }
    .tipo-elaborado { background: var(--warning-bg); color: #92400E; }

    .dialog-body { padding: 24px 28px; }
    .section-label { display: block; font-size: 11px; font-weight: 600; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px; }

    /* Formula */
    .formula-section { margin-bottom: 20px; }
    .formula-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 12px 14px; background: var(--slate-50); border-radius: 8px; }
    .formula-origen { font-weight: 600; color: var(--text-heading); }
    .formula-arrow { flex-shrink: 0; }
    .formula-tipo-badge {
      padding: 3px 10px; font-size: 12px; font-weight: 600;
      background: #FFF7ED; color: var(--primary-orange-hover); border: 1px solid #FDBA74; border-radius: 6px; text-transform: capitalize;
    }
    .formula-resultado { font-weight: 600; color: #059669; }
    .ingredientes-list { padding: 8px 14px; background: var(--slate-50); border-radius: 8px; }
    .ing-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 14px; color: var(--text-primary); }
    .ing-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary-orange); flex-shrink: 0; }
    .formula-resultado-elab { margin-top: 8px; font-size: 13px; color: var(--slate-500); }

    /* Stock info */
    .stock-info { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .stock-card { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; background: var(--slate-50); border-radius: 8px; }
    .stock-label { font-size: 12px; color: var(--slate-400); font-weight: 500; }
    .stock-value { font-size: 16px; font-weight: 700; color: var(--text-heading); }
    .stock-prod { color: #059669; }

    /* Cantidad */
    .cantidad-section { margin-bottom: 20px; }
    .cantidad-input {
      width: 100%; padding: 12px 14px; font-size: 16px; font-weight: 600; font-family: inherit;
      color: var(--text-primary); background: white; border: 1px solid var(--slate-200); border-radius: 10px; transition: all 0.15s;
    }
    .cantidad-input:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
    .error-msg { display: block; margin-top: 6px; font-size: 12px; color: var(--danger-color); }

    /* Preview */
    .preview-section { }
    .preview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .preview-item { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; background: var(--slate-50); border-radius: 8px; }
    .preview-label { font-size: 11px; color: var(--slate-400); font-weight: 500; }
    .preview-value { font-size: 14px; font-weight: 700; color: var(--text-heading); }
    .preview-consume { color: #DC2626; }
    .preview-produce { color: #059669; }

    /* Actions */
    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; padding: 0 28px 28px; }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 24px; font-size: 14px; font-weight: 500; font-family: inherit;
      border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: var(--primary-orange); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--primary-orange-hover); }
    .btn-secondary { background: white; color: var(--text-primary); border: 1px solid var(--slate-200); }
    .btn-secondary:hover { background: var(--slate-50); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CocinarDialogComponent {
  @Input({ required: true }) item!: ProduccionGridRow;
  @Output() confirmar = new EventEmitter<CocinarRequest>();
  @Output() cancelar = new EventEmitter<void>();

  cantidadBatches = 1;

  maxBatches = computed(() => Math.floor(this.item.stockInventario / this.item.origenCantidad));
  consumo = computed(() => this.cantidadBatches * this.item.origenCantidad);
  resultado = computed(() => this.cantidadBatches * this.item.resultadoCantidad);
  stockInvResultante = computed(() => this.item.stockInventario - this.consumo());
  stockProdResultante = computed(() => this.item.stockProduccion + this.resultado());

  isValid(): boolean {
    return this.cantidadBatches >= 1 && this.cantidadBatches <= this.maxBatches();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.onCancel();
  }

  onCancel(): void { this.cancelar.emit(); }

  onConfirm(): void {
    if (!this.isValid()) return;
    this.confirmar.emit({
      itemId: this.item.id,
      cantidadBatches: this.cantidadBatches,
      cantidadResultado: this.resultado(),
      cantidadConsumo: this.consumo(),
    });
  }
}
