import { Factura } from './factura';
import { Precio } from '../inventario/precio';
import { Producto } from '../inventario/producto';
import { Impuesto } from '../inventario/impuesto';
import { valores } from "../../constantes";
import { Bodega } from '../inventario/bodega';

export class FacturaLinea {
  id: number;
  posicion: number;
  comentario: string;
  entregado: string;
  cantidad: number;
  precioUnitario: number;
  valorDescuentoLinea: number;
  porcentajeDescuentoLinea: number;
  valorPorcentajeDescuentoLinea: number;
  valorDescuentoTotalLinea: number;
  porcentajeDescuentoTotalLinea: number;
  valorPorcentajeDescuentoTotalLinea: number;
  totalDescuentoLinea: number;
  subtotalSinDescuentoLinea: number;
  ivaSinDescuentoLinea: number;
  subtotalConDescuentoLinea: number;
  ivaConDescuentoLinea: number;
  totalConDescuentoLinea: number;
  //PRODUCTO SELECCIONADO
  producto: Producto;
  //IMPUESTO SELECCIONADO
  impuesto: Impuesto;
  //PRECIO SELECCIONADO
  precio: Precio;
  //BODEGA SELECCIONADO
  bodega: Bodega;  

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
    this.valorDescuentoTotalLinea = valores.cero;
    this.porcentajeDescuentoTotalLinea = valores.cero;
    this.valorPorcentajeDescuentoTotalLinea = valores.cero;
    this.totalDescuentoLinea = valores.cero;
    this.subtotalSinDescuentoLinea = valores.cero;
    this.ivaSinDescuentoLinea = valores.cero;
    this.subtotalConDescuentoLinea = valores.cero;
    this.ivaConDescuentoLinea = valores.cero;
    this.totalConDescuentoLinea = valores.cero;
    this.producto = new Producto();
    this.precio = new Precio();
    this.impuesto = new Impuesto();
    this.bodega = new Bodega();
  }
}
