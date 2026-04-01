import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import {
  OrdenCompra,
  Proveedor,
  Insumo,
  CategoriaInsumo,
  ProyeccionPagos,
  EstadoOrden,
  RubroConceptoGasto,
  ConceptoGasto
} from '../models/compras.models';
import {
  MOCK_ORDENES,
  MOCK_PROVEEDORES,
  MOCK_INSUMOS,
  MOCK_CATEGORIAS,
  MOCK_PROYECCION,
  MOCK_RUBROS_CONCEPTO,
  MOCK_CONCEPTOS_GASTO
} from './compras-mock.data';

@Injectable({ providedIn: 'root' })
export class ComprasService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/v1';
  private useMock = true;

  private nextOrdenId = MOCK_ORDENES.length + 1;
  private nextProveedorId = MOCK_PROVEEDORES.length + 1;
  private nextRubroId = MOCK_RUBROS_CONCEPTO.length + 1;
  private nextConceptoId = MOCK_CONCEPTOS_GASTO.length + 1;

  // ============== ORDENES ==============

  listarOrdenes(): Observable<OrdenCompra[]> {
    if (this.useMock) {
      return of([...MOCK_ORDENES]).pipe(delay(300));
    }
    return this.http.get<OrdenCompra[]>(`${this.baseUrl}/compras/ordenes`);
  }

  obtenerOrden(id: number): Observable<OrdenCompra | undefined> {
    if (this.useMock) {
      const orden = MOCK_ORDENES.find(o => o.id === id);
      return of(orden ? { ...orden } : undefined).pipe(delay(200));
    }
    return this.http.get<OrdenCompra>(`${this.baseUrl}/compras/ordenes/${id}`);
  }

  crearOrden(orden: Partial<OrdenCompra>): Observable<OrdenCompra> {
    if (this.useMock) {
      const nueva: OrdenCompra = {
        id: this.nextOrdenId++,
        numero: String(62850 + this.nextOrdenId).padStart(8, '0'),
        puntoVenta: orden.puntoVenta || '002',
        numeroComprobante: String(4543520 + this.nextOrdenId).padStart(10, '0'),
        proveedorId: orden.proveedorId || 0,
        proveedor: orden.proveedor || '',
        tipo: orden.tipo || 'Orden',
        tipoFactura: orden.tipoFactura || null,
        estado: orden.estado || 'Pendiente',
        fechaCreacion: new Date().toISOString().split('T')[0],
        fechaPedido: null,
        fechaRecepcion: null,
        fechaVencimiento: orden.fechaVencimiento || null,
        observaciones: orden.observaciones || '',
        productos: orden.productos || [],
        cantidadProductos: orden.productos?.length || 0,
        subtotal: orden.subtotal || 0,
        total: orden.total || 0,
        netoGravado: orden.netoGravado ?? null,
        montoIVA: orden.montoIVA ?? null,
        percepcionIIBB: orden.percepcionIIBB ?? null,
        percepcionIVA: orden.percepcionIVA ?? null,
        descuentoTipo: orden.descuentoTipo ?? null,
        descuentoPorcentaje: orden.descuentoPorcentaje ?? null,
        descuentoMonto: orden.descuentoMonto ?? null,
        condicionPago: orden.condicionPago ?? null
      };
      MOCK_ORDENES.unshift(nueva);
      return of({ ...nueva }).pipe(delay(300));
    }
    return this.http.post<OrdenCompra>(`${this.baseUrl}/compras/ordenes`, orden);
  }

  actualizarOrden(id: number, data: Partial<OrdenCompra>): Observable<OrdenCompra> {
    if (this.useMock) {
      const index = MOCK_ORDENES.findIndex(o => o.id === id);
      if (index !== -1) {
        MOCK_ORDENES[index] = { ...MOCK_ORDENES[index], ...data };
        return of({ ...MOCK_ORDENES[index] }).pipe(delay(300));
      }
      throw new Error('Orden no encontrada');
    }
    return this.http.put<OrdenCompra>(`${this.baseUrl}/compras/ordenes/${id}`, data);
  }

  cambiarEstadoOrden(id: number, nuevoEstado: EstadoOrden): Observable<OrdenCompra> {
    if (this.useMock) {
      const index = MOCK_ORDENES.findIndex(o => o.id === id);
      if (index !== -1) {
        MOCK_ORDENES[index] = { ...MOCK_ORDENES[index], estado: nuevoEstado };

        if (nuevoEstado === 'Pedida' && !MOCK_ORDENES[index].fechaPedido) {
          MOCK_ORDENES[index].fechaPedido = new Date().toISOString().split('T')[0];
        }
        if (nuevoEstado === 'Recibida' && !MOCK_ORDENES[index].fechaRecepcion) {
          MOCK_ORDENES[index].fechaRecepcion = new Date().toISOString().split('T')[0];
        }

        return of({ ...MOCK_ORDENES[index] }).pipe(delay(300));
      }
      throw new Error('Orden no encontrada');
    }
    return this.http.put<OrdenCompra>(`${this.baseUrl}/compras/ordenes/${id}/estado`, { estado: nuevoEstado });
  }

  // ============== PROVEEDORES ==============

  listarProveedores(): Observable<Proveedor[]> {
    if (this.useMock) {
      return of([...MOCK_PROVEEDORES]).pipe(delay(300));
    }
    return this.http.get<Proveedor[]>(`${this.baseUrl}/compras/proveedores`);
  }

  crearProveedor(proveedor: Partial<Proveedor>): Observable<Proveedor> {
    if (this.useMock) {
      const nuevo: Proveedor = {
        id: this.nextProveedorId++,
        codigo: `PROV-${String(this.nextProveedorId).padStart(3, '0')}`,
        nombre: proveedor.nombre || '',
        razonSocial: proveedor.razonSocial || '',
        cuit: proveedor.cuit || '',
        email: proveedor.email || '',
        telefono: proveedor.telefono || '',
        direccion: proveedor.direccion || '',
        condicionIVA: proveedor.condicionIVA || 'Responsable Inscripto',
        diasCredito: proveedor.diasCredito || 30,
        activo: true,
        tipo: proveedor.tipo || 'Distribuidora',
        pedidosRealizados: 0,
        conceptoGastoId: proveedor.conceptoGastoId ?? null
      };
      MOCK_PROVEEDORES.push(nuevo);
      return of({ ...nuevo }).pipe(delay(300));
    }
    return this.http.post<Proveedor>(`${this.baseUrl}/compras/proveedores`, proveedor);
  }

  actualizarProveedor(id: number, data: Partial<Proveedor>): Observable<Proveedor> {
    if (this.useMock) {
      const index = MOCK_PROVEEDORES.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PROVEEDORES[index] = { ...MOCK_PROVEEDORES[index], ...data };
        return of({ ...MOCK_PROVEEDORES[index] }).pipe(delay(300));
      }
      throw new Error('Proveedor no encontrado');
    }
    return this.http.put<Proveedor>(`${this.baseUrl}/compras/proveedores/${id}`, data);
  }

  // ============== INSUMOS ==============

  listarInsumos(): Observable<Insumo[]> {
    if (this.useMock) {
      return of([...MOCK_INSUMOS]).pipe(delay(200));
    }
    return this.http.get<Insumo[]>(`${this.baseUrl}/compras/insumos`);
  }

  listarCategorias(): Observable<CategoriaInsumo[]> {
    if (this.useMock) {
      return of([...MOCK_CATEGORIAS]).pipe(delay(100));
    }
    return this.http.get<CategoriaInsumo[]>(`${this.baseUrl}/compras/categorias`);
  }

  // ============== RUBROS CONCEPTO GASTO ==============

  listarRubros(): Observable<RubroConceptoGasto[]> {
    if (this.useMock) {
      return of([...MOCK_RUBROS_CONCEPTO]).pipe(delay(200));
    }
    return this.http.get<RubroConceptoGasto[]>(`${this.baseUrl}/compras/rubros-concepto`);
  }

  crearRubro(rubro: Partial<RubroConceptoGasto>): Observable<RubroConceptoGasto> {
    if (this.useMock) {
      const nuevo: RubroConceptoGasto = {
        id: this.nextRubroId++,
        nombre: rubro.nombre || ''
      };
      MOCK_RUBROS_CONCEPTO.push(nuevo);
      return of({ ...nuevo }).pipe(delay(200));
    }
    return this.http.post<RubroConceptoGasto>(`${this.baseUrl}/compras/rubros-concepto`, rubro);
  }

  actualizarRubro(id: number, data: Partial<RubroConceptoGasto>): Observable<RubroConceptoGasto> {
    if (this.useMock) {
      const index = MOCK_RUBROS_CONCEPTO.findIndex(r => r.id === id);
      if (index !== -1) {
        MOCK_RUBROS_CONCEPTO[index] = { ...MOCK_RUBROS_CONCEPTO[index], ...data };
        return of({ ...MOCK_RUBROS_CONCEPTO[index] }).pipe(delay(200));
      }
      throw new Error('Rubro no encontrado');
    }
    return this.http.put<RubroConceptoGasto>(`${this.baseUrl}/compras/rubros-concepto/${id}`, data);
  }

  // ============== CONCEPTOS DE GASTO ==============

  listarConceptos(): Observable<ConceptoGasto[]> {
    if (this.useMock) {
      return of([...MOCK_CONCEPTOS_GASTO]).pipe(delay(200));
    }
    return this.http.get<ConceptoGasto[]>(`${this.baseUrl}/compras/conceptos-gasto`);
  }

  crearConcepto(concepto: Partial<ConceptoGasto>): Observable<ConceptoGasto> {
    if (this.useMock) {
      const nuevo: ConceptoGasto = {
        id: this.nextConceptoId++,
        rubroId: concepto.rubroId || 0,
        rubro: concepto.rubro || '',
        nombre: concepto.nombre || '',
        activo: concepto.activo ?? true
      };
      MOCK_CONCEPTOS_GASTO.push(nuevo);
      return of({ ...nuevo }).pipe(delay(200));
    }
    return this.http.post<ConceptoGasto>(`${this.baseUrl}/compras/conceptos-gasto`, concepto);
  }

  actualizarConcepto(id: number, data: Partial<ConceptoGasto>): Observable<ConceptoGasto> {
    if (this.useMock) {
      const index = MOCK_CONCEPTOS_GASTO.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_CONCEPTOS_GASTO[index] = { ...MOCK_CONCEPTOS_GASTO[index], ...data };
        return of({ ...MOCK_CONCEPTOS_GASTO[index] }).pipe(delay(200));
      }
      throw new Error('Concepto no encontrado');
    }
    return this.http.put<ConceptoGasto>(`${this.baseUrl}/compras/conceptos-gasto/${id}`, data);
  }

  desactivarConcepto(id: number): Observable<ConceptoGasto> {
    if (this.useMock) {
      const index = MOCK_CONCEPTOS_GASTO.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_CONCEPTOS_GASTO[index] = { ...MOCK_CONCEPTOS_GASTO[index], activo: false };
        return of({ ...MOCK_CONCEPTOS_GASTO[index] }).pipe(delay(200));
      }
      throw new Error('Concepto no encontrado');
    }
    return this.http.put<ConceptoGasto>(`${this.baseUrl}/compras/conceptos-gasto/${id}/desactivar`, {});
  }

  // ============== PROYECCION ==============

  obtenerProyeccion(): Observable<ProyeccionPagos> {
    if (this.useMock) {
      return of({ ...MOCK_PROYECCION }).pipe(delay(200));
    }
    return this.http.get<ProyeccionPagos>(`${this.baseUrl}/compras/proyeccion`);
  }
}
