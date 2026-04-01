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
import { Proveedor } from '../../models/compras.models';

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

@Component({
  selector: 'app-proveedores-grid',
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
        [rowHeight]="60"
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
export class ProveedoresGridComponent {
  data = input.required<Proveedor[]>();

  editarClick = output<number>();
  pedirClick = output<number>();

  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      field: 'nombre',
      headerName: 'Nombre',
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: any) => {
        const data = params.data as Proveedor;
        return `
          <div class="cell-multiline">
            <span class="cell-main">${data.nombre}</span>
            <span class="cell-sub">${data.pedidosRealizados} pedidos realizados</span>
          </div>
        `;
      }
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 140,
      cellRenderer: (params: any) => {
        const colores: Record<string, string> = {
          'Carnes': 'var(--danger-color)',
          'Lácteos': '#3B82F6',
          'Verduras': '#22C55E',
          'Bebidas': '#8B5CF6',
          'Panadería': 'var(--warning-color)',
          'Limpieza': '#06B6D4',
          'Pescados': '#0EA5E9',
          'Condimentos': '#EC4899',
          'Aceites': '#EAB308',
          'Descartables': 'var(--slate-500)',
          'Harinas': '#A16207',
          'Congelados': '#0891B2',
          'Papelería': '#D946EF',
          'Distribuidora': 'var(--primary-orange)'
        };
        const color = colores[params.value] || 'var(--slate-500)';
        return `<span style="font-weight:500;color:${color};">${params.value}</span>`;
      }
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'telefono',
      headerName: 'Teléfono',
      width: 160
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 170,
      suppressHeaderMenuButton: true,
      sortable: false,
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        container.className = 'action-buttons';

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn';
        editBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px;">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Editar
        `;
        editBtn.onclick = (e) => {
          e.stopPropagation();
          this.editarClick.emit(params.data.id);
        };
        container.appendChild(editBtn);

        const pedirBtn = document.createElement('button');
        pedirBtn.className = 'action-btn';
        pedirBtn.textContent = 'Pedir';
        pedirBtn.onclick = (e) => {
          e.stopPropagation();
          this.pedirClick.emit(params.data.id);
        };
        container.appendChild(pedirBtn);

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
}
