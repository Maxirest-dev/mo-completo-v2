export interface WsEvent<T> {
  canal: string;
  tipo: string;
  payload: T;
  timestamp: string;
}

export interface WsKpiPayload {
  id: string;
  titulo: string;
  valor: number;
  unidad: string;
  tipo: string;
}

export interface WsVentaPayload {
  ventaId: string;
  monto: number;
  productos: WsVentaProducto[];
}

export interface WsVentaProducto {
  productoId: string;
  nombre: string;
  cantidad: number;
}

export interface WsSalonPayload {
  mesasOcupadas: number;
  mesasTotales: number;
  ocupacionPct: number;
}
