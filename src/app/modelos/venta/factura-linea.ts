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
  consignacion: string;
  cantidad: number;
  precioUnitario: number;
  subsidio: number;
  sinSubsidio: number;
  valorDescuentoLinea: number;
  porcentajeDescuentoLinea: number;
  valorPorcentajeDescuentoLinea: number;
  valorDescuentoTotalLinea: number;
  porcentajeDescuentoTotalLinea: number;
  valorPorcentajeDescuentoTotalLinea: number;
  totalDescuentoLinea: number;
  porcentajeIvaLinea: number;
  subtotalSinDescuentoLinea: number;
  ivaSinDescuentoLinea: number;
  subtotalConDescuentoLinea: number;
  ivaConDescuentoLinea: number;
  totalConDescuentoLinea: number;
  factura: Factura;
  //PRECIO SELECCIONADO
  precio: Precio;
  //PRODUCTO SELECCIONADO
  producto: Producto;
  //IMPUESTO SELECCIONADO
  impuesto: Impuesto;
  //BODEGA SELECCIONADO
  bodega: Bodega;

  constructor() {
    this.id = valores.cero;
    this.posicion = valores.cero;
    this.entregado = valores.no;
    this.comentario = valores.vacio;
    this.cantidad = valores.cero;
    this.precioUnitario = valores.cero;
    this.subsidio = valores.cero;
    this.sinSubsidio = valores.cero;
    this.valorDescuentoLinea = valores.cero;
    this.porcentajeDescuentoLinea = valores.cero;
    this.valorPorcentajeDescuentoLinea = valores.cero;
    this.valorDescuentoTotalLinea = valores.cero;
    this.porcentajeDescuentoTotalLinea = valores.cero;
    this.valorPorcentajeDescuentoTotalLinea = valores.cero;
    this.totalDescuentoLinea = valores.cero;
    this.porcentajeIvaLinea = valores.cero;
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
