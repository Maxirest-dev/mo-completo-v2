import { Component, ChangeDetectionStrategy, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprasFacade } from '../../state/compras.facade';
import { Proveedor, CondicionIVA } from '../../models/compras.models';

@Component({
  selector: 'app-proveedor-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-container" style="max-width:640px;" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div>
            <h2>{{ proveedorEditar() ? 'Editar proveedor' : 'Nuevo proveedor' }}</h2>
            <p class="modal-subtitle">Completa los datos del proveedor.</p>
          </div>
          <button class="modal-close" (click)="cerrar.emit()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre</label>
              <input class="form-control" [(ngModel)]="nombre" placeholder="Nombre comercial">
            </div>
            <div class="form-group">
              <label>Razon Social</label>
              <input class="form-control" [(ngModel)]="razonSocial" placeholder="Razon social">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>CUIT</label>
              <input class="form-control" [(ngModel)]="cuit" placeholder="30-12345678-9">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input class="form-control" type="email" [(ngModel)]="email" placeholder="email@empresa.com.ar">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Telefono</label>
              <input class="form-control" [(ngModel)]="telefono" placeholder="011-1234-5678">
            </div>
            <div class="form-group">
              <label>Direccion</label>
              <input class="form-control" [(ngModel)]="direccion" placeholder="Direccion completa">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Condicion IVA</label>
              <select class="form-control" [(ngModel)]="condicionIVA">
                <option value="Responsable Inscripto">Responsable Inscripto</option>
                <option value="Monotributo">Monotributo</option>
                <option value="Exento">Exento</option>
                <option value="Consumidor Final">Consumidor Final</option>
              </select>
            </div>
            <div class="form-group">
              <label>Dias de Credito</label>
              <input class="form-control" type="number" [(ngModel)]="diasCredito" min="0" max="365">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Concepto de gasto asociado</label>
              <select class="form-control" [(ngModel)]="conceptoGastoId">
                <option [ngValue]="null">Sin concepto asociado</option>
                @for (c of facade.conceptosActivos(); track c.id) {
                  <option [ngValue]="c.id">{{ c.nombre }} ({{ c.rubro }})</option>
                }
              </select>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="cerrar.emit()">Cancelar</button>
          <button class="btn btn-primary" (click)="onGuardar()" [disabled]="!nombre">Guardar</button>
        </div>
      </div>
    </div>
  `
})
export class ProveedorModalComponent implements OnInit {
  facade = inject(ComprasFacade);

  proveedorEditar = input<number | null>(null);
  guardar = output<Partial<Proveedor>>();
  cerrar = output<void>();

  nombre = '';
  razonSocial = '';
  cuit = '';
  email = '';
  telefono = '';
  direccion = '';
  condicionIVA: CondicionIVA = 'Responsable Inscripto';
  diasCredito = 30;
  conceptoGastoId: number | null = null;

  ngOnInit(): void {
    if (this.proveedorEditar()) {
      const prov = this.facade.proveedores().find(p => p.id === this.proveedorEditar());
      if (prov) {
        this.nombre = prov.nombre;
        this.razonSocial = prov.razonSocial;
        this.cuit = prov.cuit;
        this.email = prov.email;
        this.telefono = prov.telefono;
        this.direccion = prov.direccion;
        this.condicionIVA = prov.condicionIVA;
        this.diasCredito = prov.diasCredito;
        this.conceptoGastoId = prov.conceptoGastoId;
      }
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }

  onGuardar(): void {
    this.guardar.emit({
      nombre: this.nombre,
      razonSocial: this.razonSocial,
      cuit: this.cuit,
      email: this.email,
      telefono: this.telefono,
      direccion: this.direccion,
      condicionIVA: this.condicionIVA,
      diasCredito: this.diasCredito,
      conceptoGastoId: this.conceptoGastoId
    });
  }
}
