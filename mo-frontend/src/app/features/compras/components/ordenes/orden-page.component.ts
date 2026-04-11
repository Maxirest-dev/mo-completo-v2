import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprasFacade } from '../../state/compras.facade';
import {
  OrdenCompra,
  OrdenProducto,
  EstadoOrden,
  AlicuotaIVA,
  CondicionPago,
  LineaItemTipo,
  ALICUOTAS_IVA,
  CONDICIONES_PAGO
} from '../../models/compras.models';
import { CurrencyArsPipe } from '../../../../shared/pipes/currency-ars.pipe';

@Component({
  selector: 'app-orden-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyArsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="orden-page">
      <!-- Top bar -->
      <div class="orden-topbar">
        <button class="back-btn" (click)="volver()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
          </svg>
          Volver a ordenes
        </button>
      </div>

      <!-- Page header -->
      <div class="orden-header">
        <h1>{{ ordenId ? 'Editar pedido' : 'Crear pedido' }}</h1>
        <p class="orden-header-sub">Completá los campos del pedido y guardá los cambios.</p>
      </div>

      <!-- Form card -->
      <div class="orden-form-card">
        <!-- Row 1: Proveedor, Tipo, Estado -->
        <div class="form-row">
          <div class="form-group">
            <label>Proveedor</label>
            <select class="form-select" [(ngModel)]="proveedorId" (ngModelChange)="onProveedorChange($event)">
              <option [ngValue]="0">Seleccionar...</option>
              @for (prov of facade.proveedoresActivos(); track prov.id) {
                <option [ngValue]="prov.id">{{ prov.nombre }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label>Tipo de (Orden / Facturas)</label>
            <select class="form-select" [(ngModel)]="tipo" (ngModelChange)="onTipoChange($event)">
              <option value="Orden">Orden</option>
              <option value="Factura">Factura</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ tipo === 'Orden' ? 'Estado del pedido' : 'Tipo de comprobante' }}</label>
            <select class="form-select" [(ngModel)]="estado">
              @for (opt of opcionesEstado(); track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
              }
            </select>
          </div>
        </div>

        <!-- Row 2: Comprobante + Fechas -->
        <div class="form-row">
          @if (tipo === 'Factura') {
            <div class="form-group" style="flex:0 0 auto;">
              <label>N Comprobante</label>
              <div style="display:flex;gap:8px;">
                <input class="form-input" style="width:60px;" [(ngModel)]="puntoVenta" placeholder="002" maxlength="3">
                <input class="form-input" style="width:130px;" [(ngModel)]="numeroComprobante" placeholder="0004543521" maxlength="10">
              </div>
            </div>
          }
          <div class="form-group">
            <label>Creación</label>
            @if (tipo === 'Orden') {
              <input class="form-input" type="date" [ngModel]="fechaCreacion" readonly>
            } @else {
              <input class="form-input" type="date" [(ngModel)]="fechaCreacion">
            }
          </div>
          @if (tipo === 'Orden') {
            <div class="form-group">
              <label>Compra / pedido</label>
              <input class="form-input" type="date" [(ngModel)]="fechaPedido">
            </div>
            <div class="form-group">
              <label>Recepción</label>
              <input class="form-input" type="date" [(ngModel)]="fechaRecepcion">
            </div>
          }
          @if (tipo === 'Factura') {
            <div class="form-group">
              <label>Pago / vencimiento</label>
              <input class="form-input" type="date" [(ngModel)]="fechaVencimiento">
            </div>
          }
        </div>

        <!-- Observaciones -->
        <div class="form-row">
          <div class="form-group">
            <label>Observaciones</label>
            <input class="form-input" [(ngModel)]="observaciones" placeholder="Campo ejemplo">
          </div>
        </div>

        <!-- Row 3: Condición de pago (solo Factura) -->
        @if (tipo === 'Factura') {
          <div class="form-row">
            <div class="form-group">
              <label>Condición de pago</label>
              <select class="form-select" [(ngModel)]="condicionPago">
                <option [ngValue]="null">Sin especificar</option>
                @for (cp of condicionesPago; track cp.value) {
                  <option [ngValue]="cp.value">{{ cp.label }}</option>
                }
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Percepción IIBB</label>
              <div style="display:flex;align-items:center;gap:4px;">
                <span style="color:var(--gray-500);font-size:13px;">$</span>
                <input class="form-input" type="number" [(ngModel)]="percepcionIIBB" (ngModelChange)="onPercepcionChange()" min="0" placeholder="0">
              </div>
            </div>
            <div class="form-group">
              <label>Percepción IVA</label>
              <div style="display:flex;align-items:center;gap:4px;">
                <span style="color:var(--gray-500);font-size:13px;">$</span>
                <input class="form-input" type="number" [(ngModel)]="percepcionIVA" (ngModelChange)="onPercepcionChange()" min="0" placeholder="0">
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Líneas del documento -->
      <div class="orden-productos-card">
        <div class="section-title-row">
          <h2 class="section-title">Líneas del documento</h2>
          <div style="display:flex;gap:8px;">
            <button class="btn-add-linea" (click)="agregarLinea('insumo')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              + Producto
            </button>
            <button class="btn-add-linea" (click)="agregarLinea('concepto')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              + Concepto
            </button>
          </div>
        </div>

        @if (_lineas().length > 0) {
          <div class="lineas-table">
            <div class="lineas-header">
              <span class="col-item">ITEM</span>
              <span class="col-cant">CANT</span>
              <span class="col-precio">P. UNIT</span>
              <span class="col-iva">IVA</span>
              <span class="col-desc">DESC %</span>
              <span class="col-impint">IMP.INT</span>
              <span class="col-subtotal">SUBTOTAL</span>
              <span class="col-acciones"></span>
            </div>
            @for (linea of _lineas(); track linea.id; let i = $index) {
              <div class="linea-row">
                <!-- ITEM (searchable dropdown) -->
                <div class="col-item">
                  <div class="item-dropdown-wrapper">
                    <div class="item-input-with-badge">
                      @if (linea.insumoId || linea.conceptoId) {
                        <span class="item-tipo-badge" [class.badge-concepto]="linea.tipo === 'concepto'">{{ linea.tipo === 'insumo' ? 'INS' : 'CG' }}</span>
                      }
                      <input
                        class="form-input form-input-sm"
                        type="text"
                        [value]="dropdownAbiertoIndex() === i ? _busquedaItem() : (linea.tipo === 'insumo' ? linea.insumo : (linea.concepto || ''))"
                        (focus)="openDropdown(i)"
                        (input)="onBusquedaItem($event)"
                        (keydown.enter)="onDropdownEnter($event, i)"
                        placeholder="Buscar...">
                    </div>
                    @if (dropdownAbiertoIndex() === i) {
                      <div class="item-dropdown" (mousedown)="$event.preventDefault()">
                        @if (linea.tipo === 'insumo') {
                          @for (ins of itemsFiltrados(); track ins.id) {
                            <div class="item-option" (click)="onItemSelect(i, ins.id, 'insumo')">
                              <span class="item-option-name">{{ ins.nombre }}</span>
                              <span class="item-option-detail">{{ ins.unidadMedida }} · {{ ins.precioUnitario | currencyArs }}</span>
                            </div>
                          } @empty {
                            <div class="item-option-empty">Sin resultados</div>
                          }
                        } @else {
                          @for (con of conceptosFiltrados(); track con.id) {
                            <div class="item-option" (click)="onItemSelect(i, con.id, 'concepto')">
                              <span class="item-option-name">{{ con.nombre }}</span>
                              <span class="item-option-detail">{{ con.rubro }}</span>
                            </div>
                          } @empty {
                            <div class="item-option-empty">Sin resultados</div>
                          }
                        }
                      </div>
                    }
                  </div>
                </div>

                <!-- CANTIDAD -->
                <div class="col-cant">
                  <input class="form-input form-input-sm input-number" type="number"
                    [ngModel]="linea.unidades"
                    (ngModelChange)="onCantidadChange(i, $event)"
                    (keydown.enter)="focusNext($event)"
                    min="0">
                </div>

                <!-- PRECIO UNITARIO -->
                <div class="col-precio">
                  <input class="form-input form-input-sm input-number" type="number"
                    [ngModel]="linea.precioUnitario"
                    (ngModelChange)="onPrecioUnitarioChange(i, $event)"
                    (keydown.enter)="focusNext($event)"
                    min="0">
                </div>

                <!-- IVA -->
                <div class="col-iva">
                  <select class="form-select form-select-sm" [ngModel]="linea.alicuotaIVA" (ngModelChange)="onAlicuotaLineaChange(i, $event)">
                    @for (al of alicuotasIVA; track al.value) {
                      <option [ngValue]="al.value">{{ al.label }}</option>
                    }
                  </select>
                </div>

                <!-- DESC % -->
                <div class="col-desc">
                  <input class="form-input form-input-sm input-number" type="number"
                    [ngModel]="linea.descuento"
                    (ngModelChange)="onDescuentoLineaChange(i, $event)"
                    (keydown.enter)="focusNext($event)"
                    min="0" max="100" placeholder="0">
                </div>

                <!-- IMP. INTERNOS -->
                <div class="col-impint">
                  <input class="form-input form-input-sm input-number" type="number"
                    [ngModel]="linea.impuestosInternos"
                    (ngModelChange)="onImpInternosChange(i, $event)"
                    (keydown.enter)="focusNext($event)"
                    min="0" placeholder="0">
                </div>

                <!-- SUBTOTAL -->
                <div class="col-subtotal">
                  {{ linea.precioTotal | currencyArs }}
                </div>

                <!-- ELIMINAR -->
                <div class="col-acciones">
                  <button class="btn-remove" (click)="eliminarLinea(i)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="lineas-empty">
            Agregá líneas usando los botones "+ Producto" o "+ Concepto"
          </div>
        }
      </div>

      <!-- Spacer for sticky bar -->
      @if (_lineas().length > 0) {
        <div class="sticky-bar-spacer"></div>
      }

      <!-- Sticky totals bar -->
      @if (_lineas().length > 0) {
        <div class="sticky-totals-bar">
          <div class="sticky-totals-content">
            <div class="order-totals">
              <div class="total-item">
                <div class="total-label">Líneas</div>
                <div class="total-value">{{ _lineas().length }}</div>
                <div class="total-detail">{{ categoriasCount() }} categorías</div>
              </div>
              <div class="total-item">
                <div class="total-label">Unidades</div>
                <div class="total-value">{{ totalUnidades() | number }}</div>
              </div>
              <div class="total-item">
                <div class="total-label">Subtotal</div>
                <div class="total-value">{{ totalMonto() | currencyArs }}</div>
              </div>
              @if (tipo === 'Factura') {
                <div class="total-item">
                  <div class="total-label">Neto gravado</div>
                  <div class="total-value">{{ netoGravadoCalc() | currencyArs }}</div>
                </div>
                <div class="total-item">
                  <div class="total-label">IVA</div>
                  <div class="total-value">{{ montoIVACalc() | currencyArs }}</div>
                </div>
              }
              @if (tipo === 'Factura') {
                <div class="total-item">
                  <div class="total-label">Imp. internos</div>
                  <div class="total-value">{{ totalImpInternos() | currencyArs }}</div>
                </div>
              }
              @if (tipo === 'Factura' && ((percepcionIIBB || 0) + (percepcionIVA || 0)) > 0) {
                <div class="total-item">
                  <div class="total-label">Percepciones</div>
                  <div class="total-value">{{ (percepcionIIBB || 0) + (percepcionIVA || 0) | currencyArs }}</div>
                </div>
              }
              <div class="total-item">
                <div class="total-label">Total</div>
                <div class="total-value total-highlight">{{ totalFinal() | currencyArs }}</div>
              </div>
            </div>
            <div class="sticky-totals-actions">
              <button class="btn btn-secondary" (click)="volver()">Cancelar</button>
              <button class="btn btn-primary" (click)="onGuardar()">Guardar cambios</button>
            </div>
          </div>
        </div>
      }

      <!-- Footer actions (when no lines) -->
      @if (_lineas().length === 0) {
        <div class="orden-footer">
          <button class="btn btn-secondary" (click)="volver()">Cancelar</button>
          <button class="btn btn-primary" (click)="onGuardar()">Guardar cambios</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .orden-page {
      max-width: 1200px;
      margin: 0 auto;
    }

    .orden-topbar {
      margin-bottom: 8px;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 4px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: var(--gray-500);
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.15s ease;

      &:hover {
        color: var(--gray-900);
      }
    }

    .orden-header {
      margin-bottom: 24px;

      h1 {
        font-size: 26px;
        font-weight: 600;
        color: var(--gray-900);
        margin: 0 0 6px 0;
        letter-spacing: -0.01em;
      }

      .orden-header-sub {
        font-size: 14px;
        color: var(--gray-500);
        margin: 0;
      }
    }

    .orden-form-card,
    .orden-productos-card {
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      padding: 24px;
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .section-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .btn-add-linea {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      border: 1px solid var(--primary-orange);
      border-radius: var(--radius-md);
      background: white;
      color: var(--primary-orange);
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: var(--primary-orange-light);
      }
    }

    .lineas-table {
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      overflow: visible;
    }

    .lineas-header {
      display: grid;
      grid-template-columns: 1fr 80px 100px 90px 70px 80px 100px 40px;
      gap: 8px;
      padding: 10px 12px;
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      font-size: 11px;
      font-weight: 600;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .linea-row {
      display: grid;
      grid-template-columns: 1fr 80px 100px 90px 70px 80px 100px 40px;
      gap: 8px;
      padding: 8px 12px;
      align-items: center;
      border-bottom: 1px solid var(--gray-100);

      &:last-child { border-bottom: none; }
      &:hover { background: var(--gray-50); }
    }

    .form-select-sm,
    .form-input-sm {
      padding: 5px 8px;
      font-size: 13px;
      height: 32px;
    }

    .input-number {
      text-align: right;
      width: 100%;
    }

    .col-subtotal {
      font-weight: 600;
      font-size: 13px;
      text-align: right;
      color: var(--gray-800);
    }

    .col-desc input {
      width: 100%;
    }

    .col-impint input {
      width: 100%;
    }

    .col-acciones {
      display: flex;
      justify-content: center;
    }

    .btn-remove {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--gray-400);
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #FEE2E2;
        color: #DC2626;
      }
    }

    .item-dropdown-wrapper {
      position: relative;
    }

    .item-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 50;
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      max-height: 200px;
      overflow-y: auto;
      margin-top: 2px;
    }

    .item-option {
      display: flex;
      flex-direction: column;
      gap: 1px;
      padding: 8px 12px;
      cursor: pointer;
      transition: background 0.1s ease;

      &:hover { background: var(--gray-50); }
    }

    .item-option-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-800);
    }

    .item-option-detail {
      font-size: 11px;
      color: var(--gray-400);
    }

    .item-option-empty {
      padding: 12px;
      text-align: center;
      font-size: 12px;
      color: var(--gray-400);
    }

    .item-input-with-badge {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .item-input-with-badge input {
      flex: 1;
      min-width: 0;
    }

    .item-tipo-badge {
      flex-shrink: 0;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 5px;
      border-radius: 3px;
      background: #DBEAFE;
      color: #1E40AF;
      letter-spacing: 0.03em;
    }

    .badge-concepto {
      background: #EDE9FE;
      color: #5B21B6;
    }

    .lineas-empty {
      padding: 32px;
      text-align: center;
      color: var(--gray-400);
      font-size: 13px;
      border: 1px dashed var(--gray-200);
      border-radius: var(--radius-md);
    }

    .orden-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 0 32px 0;
    }

    .sticky-bar-spacer {
      height: 110px;
    }

    .sticky-totals-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top: 1px solid var(--gray-200);
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
      z-index: 100;
      padding: 0 32px;
    }

    .sticky-totals-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 16px 0;

      .order-totals {
        flex: 1;
        margin-top: 0;
      }
    }

    .sticky-totals-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .total-highlight {
      font-weight: 700 !important;
      color: var(--gray-900);
    }
  `]
})
export class OrdenPageComponent implements OnInit {
  facade = inject(ComprasFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ordenId: number | null = null;
  alicuotasIVA = ALICUOTAS_IVA;
  condicionesPago = CONDICIONES_PAGO;

  // Form fields
  proveedorId = 0;
  tipo: 'Orden' | 'Factura' = 'Orden';
  estado = 'Pendiente';
  private _tipo = signal<'Orden' | 'Factura'>('Orden');

  opcionesEstado = computed(() => {
    if (this._tipo() === 'Orden') {
      return [
        { value: 'Pendiente', label: 'Pendiente' },
        { value: 'Pedida', label: 'Pedida' },
        { value: 'Recibida', label: 'Recibida' },
        { value: 'Facturada', label: 'Facturada' },
        { value: 'Pagada', label: 'Pagada' },
      ];
    } else {
      return [
        { value: 'Factura A', label: 'Factura A' },
        { value: 'Factura B', label: 'Factura B' },
        { value: 'Factura C', label: 'Factura C' },
        { value: 'Ticket Fiscal', label: 'Ticket Fiscal' },
      ];
    }
  });
  puntoVenta = '002';
  numeroComprobante = '';
  fechaCreacion = new Date().toISOString().split('T')[0];
  fechaPedido = '';
  fechaRecepcion = '';
  fechaVencimiento = '';
  observaciones = '';

  // Campos factura argentina
  condicionPago: CondicionPago | null = null;
  percepcionIIBB: number | null = null;
  percepcionIVA: number | null = null;

  // Líneas del documento
  _lineas = signal<OrdenProducto[]>([]);
  dropdownAbiertoIndex = signal<number | null>(null);
  _busquedaItem = signal('');

  itemsFiltrados = computed(() => {
    const busqueda = this._busquedaItem().toLowerCase();
    return this.facade.insumos().filter(i =>
      !busqueda || i.nombre.toLowerCase().includes(busqueda)
    );
  });

  conceptosFiltrados = computed(() => {
    const busqueda = this._busquedaItem().toLowerCase();
    return this.facade.conceptosActivos().filter(c =>
      !busqueda || c.nombre.toLowerCase().includes(busqueda)
    );
  });

  totalUnidades = computed(() =>
    this._lineas().reduce((sum, l) => sum + l.unidades, 0)
  );

  totalMonto = computed(() =>
    this._lineas().reduce((sum, l) => sum + l.precioTotal, 0)
  );

  private _facturaSignal = signal(0);

  descuentoAplicado = computed(() => 0);

  netoGravadoCalc = computed(() => {
    this._facturaSignal();
    return this.totalMonto();
  });

  montoIVACalc = computed(() => {
    this._facturaSignal();
    return this._lineas().reduce((sum, l) => sum + l.precioTotal * l.alicuotaIVA / 100, 0);
  });

  totalImpInternos = computed(() =>
    this._lineas().reduce((sum, l) => sum + l.impuestosInternos, 0)
  );

  totalFinal = computed(() => {
    this._facturaSignal();
    if (this.tipo !== 'Factura') {
      return this.totalMonto();
    }
    return this.netoGravadoCalc() + this.montoIVACalc() + this.totalImpInternos() + (this.percepcionIIBB || 0) + (this.percepcionIVA || 0);
  });

  categoriasCount = computed(() => {
    const insumoMap = new Map(this.facade.insumos().map(i => [i.id, i.categoriaId]));
    const catIds = new Set(
      this._lineas()
        .filter(l => l.tipo !== 'concepto')
        .map(l => insumoMap.get(l.insumoId))
        .filter(Boolean)
    );
    return catIds.size;
  });

  async ngOnInit(): Promise<void> {
    if (this.facade.ordenes().length === 0) {
      await this.facade.cargarDatos();
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.ordenId = +idParam;
      const orden = this.facade.ordenes().find(o => o.id === this.ordenId);
      if (orden) {
        this.proveedorId = orden.proveedorId;
        this.tipo = orden.tipo;
        this._tipo.set(orden.tipo);
        this.estado = orden.tipo === 'Factura'
          ? (orden.tipoFactura || 'Factura A')
          : orden.estado;
        this.puntoVenta = orden.puntoVenta;
        this.numeroComprobante = orden.numeroComprobante;
        this.fechaCreacion = orden.fechaCreacion;
        this.fechaPedido = orden.fechaPedido || '';
        this.fechaRecepcion = orden.fechaRecepcion || '';
        this.fechaVencimiento = orden.fechaVencimiento || '';
        this.observaciones = orden.observaciones;
        this._lineas.set([...orden.productos]);
        // Campos factura
        this.condicionPago = orden.condicionPago;
        this.percepcionIIBB = orden.percepcionIIBB;
        this.percepcionIVA = orden.percepcionIVA;
      }
    }

    // Close dropdown on click outside
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.item-dropdown-wrapper')) {
        this.dropdownAbiertoIndex.set(null);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/compras']);
  }

  onTipoChange(nuevoTipo: 'Orden' | 'Factura'): void {
    this._tipo.set(nuevoTipo);
    this.estado = nuevoTipo === 'Orden' ? 'Pendiente' : 'Factura A';
    if (nuevoTipo === 'Orden') {
      this.condicionPago = null;
      this.percepcionIIBB = null;
      this.percepcionIVA = null;
    }
  }

  onPercepcionChange(): void {
    this._facturaSignal.update(v => v + 1);
  }

  // --- Line item methods ---

  agregarLinea(tipo: LineaItemTipo = 'insumo'): void {
    const id = Date.now() + Math.random();
    const nuevaLinea: OrdenProducto = {
      id,
      insumoId: 0,
      insumo: '',
      unidadMedida: 'u',
      stockActual: 0,
      estado: 'Activo',
      unidades: 1,
      precioUnitario: 0,
      precioTotal: 0,
      tipo,
      conceptoId: null,
      concepto: null,
      rubroId: null,
      rubro: null,
      alicuotaIVA: 21,
      descuento: 0,
      impuestosInternos: 0
    };
    this._lineas.update(l => [...l, nuevaLinea]);
  }

  eliminarLinea(index: number): void {
    this._lineas.update(l => l.filter((_, i) => i !== index));
  }

  onTipoLineaChange(index: number, tipo: LineaItemTipo): void {
    this._lineas.update(lineas => lineas.map((l, i) => i === index ? {
      ...l,
      tipo,
      insumoId: 0,
      insumo: '',
      conceptoId: null,
      concepto: null,
      rubroId: null,
      rubro: null,
      unidadMedida: 'u',
      precioUnitario: 0,
      precioTotal: 0,
      unidades: 1,
      stockActual: 0
    } : l));
  }

  openDropdown(index: number): void {
    this._busquedaItem.set('');
    this.dropdownAbiertoIndex.set(index);
  }

  onBusquedaItem(event: Event): void {
    this._busquedaItem.set((event.target as HTMLInputElement).value);
  }

  onItemSelect(index: number, itemId: number, tipo: LineaItemTipo): void {
    this.dropdownAbiertoIndex.set(null);

    if (tipo === 'insumo') {
      const insumo = this.facade.insumos().find(i => i.id === itemId);
      if (!insumo) return;
      this._lineas.update(lineas => lineas.map((l, i) => {
        if (i !== index) return l;
        const unidades = l.unidades || 1;
        return {
          ...l,
          insumoId: insumo.id,
          insumo: insumo.nombre,
          unidadMedida: insumo.unidadMedida,
          stockActual: insumo.stockActual,
          estado: insumo.estado,
          precioUnitario: insumo.precioUnitario,
          descuento: 0,
          impuestosInternos: 0,
          precioTotal: unidades * insumo.precioUnitario,
          unidades,
          conceptoId: null,
          concepto: null,
          rubroId: null,
          rubro: null
        };
      }));
    } else {
      const concepto = this.facade.conceptosActivos().find(c => c.id === itemId);
      if (!concepto) return;
      this._lineas.update(lineas => lineas.map((l, i) => {
        if (i !== index) return l;
        return {
          ...l,
          insumoId: 0,
          insumo: concepto.nombre,
          conceptoId: concepto.id,
          concepto: concepto.nombre,
          rubroId: concepto.rubroId,
          rubro: concepto.rubro,
          unidadMedida: 'u'
        };
      }));
    }
  }

  onCantidadChange(index: number, cant: number): void {
    const val = Math.max(0, cant || 0);
    this._lineas.update(lineas => lineas.map((l, i) =>
      i === index ? { ...l, unidades: val, precioTotal: val * l.precioUnitario * (1 - l.descuento / 100) } : l
    ));
  }

  onPrecioUnitarioChange(index: number, precio: number): void {
    const val = Math.max(0, precio || 0);
    this._lineas.update(lineas => lineas.map((l, i) =>
      i === index ? { ...l, precioUnitario: val, precioTotal: l.unidades * val * (1 - l.descuento / 100) } : l
    ));
  }

  onAlicuotaLineaChange(index: number, alicuota: AlicuotaIVA): void {
    this._lineas.update(lineas => lineas.map((l, i) =>
      i === index ? { ...l, alicuotaIVA: alicuota } : l
    ));
  }

  onDescuentoLineaChange(index: number, desc: number): void {
    const val = Math.min(100, Math.max(0, desc || 0));
    this._lineas.update(lineas => lineas.map((l, i) =>
      i === index ? { ...l, descuento: val, precioTotal: l.unidades * l.precioUnitario * (1 - val / 100) } : l
    ));
  }

  onImpInternosChange(index: number, val: number): void {
    const v = Math.max(0, val || 0);
    this._lineas.update(lineas => lineas.map((l, i) =>
      i === index ? { ...l, impuestosInternos: v } : l
    ));
  }

  focusNext(event: Event): void {
    event.preventDefault();
    const el = event.target as HTMLElement;
    const container = el.closest('.orden-page')!;
    const focusables = Array.from(container.querySelectorAll<HTMLElement>(
      'input:not([readonly]):not([type=hidden]), select, textarea'
    ));
    const idx = focusables.indexOf(el);
    if (idx >= 0 && idx < focusables.length - 1) {
      focusables[idx + 1].focus();
    }
  }

  onDropdownEnter(event: Event, index: number): void {
    event.preventDefault();
    const linea = this._lineas()[index];
    if (this.dropdownAbiertoIndex() === index) {
      if (linea.tipo === 'insumo') {
        const items = this.itemsFiltrados();
        if (items.length > 0) this.onItemSelect(index, items[0].id, 'insumo');
      } else {
        const items = this.conceptosFiltrados();
        if (items.length > 0) this.onItemSelect(index, items[0].id, 'concepto');
      }
    }
  }

  onProveedorChange(provId: number): void {
    if (provId === 0) return;
    const prov = this.facade.proveedoresActivos().find(p => p.id === provId);
    if (prov?.conceptoGastoId) {
      const concepto = this.facade.conceptosActivos().find(c => c.id === prov.conceptoGastoId);
      if (concepto) {
        this._lineas.update(l => [...l, {
          id: Date.now() + Math.random(),
          insumoId: 0, insumo: concepto.nombre,
          unidadMedida: 'u', stockActual: 0, estado: 'Activo' as const,
          unidades: 1, precioUnitario: 0, precioTotal: 0,
          tipo: 'concepto' as const,
          conceptoId: concepto.id, concepto: concepto.nombre,
          rubroId: concepto.rubroId, rubro: concepto.rubro,
          alicuotaIVA: 21 as const,
          descuento: 0,
          impuestosInternos: 0
        }]);
      }
    }
  }

  async onGuardar(): Promise<void> {
    const proveedor = this.facade.proveedoresActivos().find(p => p.id === this.proveedorId);
    const isFactura = this.tipo === 'Factura';
    const lineas = this._lineas();
    const data: Partial<OrdenCompra> = {
      proveedorId: this.proveedorId,
      proveedor: proveedor?.nombre || '',
      tipo: this.tipo,
      tipoFactura: isFactura ? this.estado as any : null,
      estado: isFactura ? 'Pendiente' as EstadoOrden : this.estado as EstadoOrden,
      puntoVenta: this.puntoVenta,
      numeroComprobante: this.numeroComprobante,
      fechaCreacion: this.fechaCreacion,
      fechaPedido: this.fechaPedido || null,
      fechaRecepcion: this.fechaRecepcion || null,
      fechaVencimiento: this.fechaVencimiento || null,
      observaciones: this.observaciones,
      productos: lineas,
      cantidadProductos: lineas.length,
      subtotal: this.totalMonto(),
      total: this.totalFinal(),
      netoGravado: isFactura ? this.netoGravadoCalc() : null,
      montoIVA: isFactura ? this.montoIVACalc() : null,
      percepcionIIBB: isFactura ? this.percepcionIIBB : null,
      percepcionIVA: isFactura ? this.percepcionIVA : null,
      descuentoTipo: null,
      descuentoPorcentaje: null,
      descuentoMonto: null,
      condicionPago: isFactura ? this.condicionPago : null
    };

    if (this.ordenId) {
      await this.facade.actualizarOrden(this.ordenId, data);
    } else {
      await this.facade.crearOrden(data);
    }
    this.volver();
  }
}
