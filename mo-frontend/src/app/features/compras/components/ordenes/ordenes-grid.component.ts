import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  AllCommunityModule,
  ClientSideRowModelModule
} from 'ag-grid-community';
import {
  OrdenCompra,
  EstadoOrden,
  ESTADO_ORDEN_COLORS
} from '../../models/compras.models';

const ESTADO_ORDER: EstadoOrden[] = ['Pendiente', 'Pedida', 'Recibida', 'Facturada', 'Pagada'];
const BOTONES_ESTADO: { label: string; estado: EstadoOrden }[] = [
  { label: 'Pedido', estado: 'Pedida' },
  { label: 'Recibo', estado: 'Recibida' },
  { label: 'Factura', estado: 'Facturada' },
  { label: 'Pagar', estado: 'Pagada' }
];

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

@Component({
  selector: 'app-ordenes-grid',
  standalone: true,
  imports: [AgGridAngular],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card" style="overflow:hidden;">
      <ag-grid-angular
        class="ag-theme-alpine"
        [theme]="'legacy'"
        [rowData]="data()"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [rowHeight]="72"
        [headerHeight]="44"
        [animateRows]="true"
        [suppressRowClickSelection]="true"
        [suppressCellFocus]="true"
        [domLayout]="'autoHeight'"
        (gridReady)="onGridReady($event)"
        style="width: 100%;">
      </ag-grid-angular>
    </div>
  `
})
export class OrdenesGridComponent {
  data = input.required<OrdenCompra[]>();

  verOrdenClick = output<number>();
  cambiarEstadoClick = output<{ id: number; estado: EstadoOrden }>();

  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      field: 'numero',
      headerName: 'Número de Orden / Factura',
      flex: 1.2,
      minWidth: 200,
      cellRenderer: (params: any) => {
        const data = params.data as OrdenCompra;
        return `
          <div class="cell-multiline">
            <span class="cell-main">${data.numero}</span>
            <span class="cell-sub">${this.formatDate(data.fechaCreacion)}</span>
          </div>
        `;
      }
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 130,
      cellRenderer: (params: any) => {
        const estado = params.value as EstadoOrden;
        const colors = ESTADO_ORDEN_COLORS[estado];
        return `
          <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:500;background:${colors.bg};color:${colors.text};">
            <span style="width:6px;height:6px;border-radius:50%;background:${colors.dot};"></span>
            ${estado}
          </span>
        `;
      }
    },
    {
      field: 'proveedor',
      headerName: 'Proveedor',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const data = params.data as OrdenCompra;
        return `
          <div class="cell-multiline">
            <span class="cell-main">${data.proveedor}</span>
            <span class="cell-sub">${data.cantidadProductos} productos</span>
          </div>
        `;
      }
    },
    {
      field: 'fechaRecepcion',
      headerName: 'Recepción',
      width: 120,
      valueFormatter: (params) => {
        return params.value ? this.formatDate(params.value) : '-';
      }
    },
    {
      field: 'total',
      headerName: 'Importe',
      width: 130,
      cellRenderer: (params: any) => {
        const value = params.value as number;
        const formatted = new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value).replace('ARS', '$').trim();
        return `<span class="precio-cell">${formatted}</span>`;
      }
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 320,
      suppressHeaderMenuButton: true,
      sortable: false,
      cellRenderer: (params: any) => {
        const data = params.data as OrdenCompra;
        const currentIndex = ESTADO_ORDER.indexOf(data.estado);
        const container = document.createElement('div');
        container.className = 'action-buttons';

        // Eye/view button
        const viewBtn = document.createElement('button');
        viewBtn.className = 'action-btn-view';
        viewBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
        viewBtn.onclick = (e) => { e.stopPropagation(); this.verOrdenClick.emit(data.id); };
        container.appendChild(viewBtn);

        // State action buttons
        BOTONES_ESTADO.forEach(boton => {
          const btn = document.createElement('button');
          const targetIndex = ESTADO_ORDER.indexOf(boton.estado);
          const done = targetIndex <= currentIndex;
          btn.className = `action-btn${done ? ' action-btn--done' : ''}`;
          btn.textContent = boton.label;
          btn.disabled = done;
          if (!done) {
            btn.onclick = (e) => {
              e.stopPropagation();
              this.cambiarEstadoClick.emit({ id: data.id, estado: boton.estado });
            };
          }
          container.appendChild(btn);
        });

        return container;
      }
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  };

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  private formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
}
