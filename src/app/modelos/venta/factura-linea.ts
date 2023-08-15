import { Factura } from './factura';
import { Precio } from '../inventario/precio';
import { Producto } from '../inventario/producto';
import { Impuesto } from '../inventario/impuesto';
import { valores } from "../../constantes";
import { Bodega } from '../inventario/bodega';

export class FacturaLinea {
  id: number;
  codigo: string;
  posicion: number;
  comentario: string;
  entregado: string;
  consignacion: string;
  cantidad: number;
  precioUnitario: number;

  valorDescuentoLinea: number;
  porcentajeDescuentoLinea: number;
  valorPorcentajeDescuentoLinea: number;
  subtotalLinea: number;
  importeIvaLinea: number;
  totalLinea: number;
  
  impuesto: Impuesto;
  producto: Producto;
  bodega: Bodega;
  precio: Precio;
  factura: Factura;

  constructor() {
    this.id = valores.cero;
    this.posicion = valores.cero;
    this.entregado = valores.no;
    this.comentario = valores.vacio;
    this.cantidad = valores.uno;
    this.precioUnitario = valores.cero;
    this.valorDescuentoLinea = valores.cero;
    this.porcentajeDescuentoLinea = valores.cero;
    this.valorPorcentajeDescuentoLinea = valores.cero;
    this.subtotalLinea = valores.cero;
    this.importeIvaLinea = valores.cero;
    this.totalLinea = valores.cero;

    this.impuesto = new Impuesto();
    this.producto = new Producto();
    this.bodega = new Bodega();
    this.precio = new Precio();
  }
}
