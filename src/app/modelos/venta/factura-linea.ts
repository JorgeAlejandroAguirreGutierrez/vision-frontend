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
  //subsidio: number;
  //sinSubsidio: number;
  valorDescuentoLinea: number;
  porcentajeDescuentoLinea: number;
  valorPorcentajeDescuentoLinea: number;
  valorDescuentoTotalLinea: number;
  porcentajeDescuentoTotalLinea: number;
  valorPorcentajeDescuentoTotalLinea: number;
  subtotalSinDescuentoLinea: number;
  subtotalConDescuentoLinea: number;
  importeIvaLinea: number;
  totalLinea: number;
  factura: Factura;

  impuesto: Impuesto;
  producto: Producto;
  bodega: Bodega;
  precio: Precio;

  constructor() {
    this.id = valores.cero;
    this.posicion = valores.cero;
    this.entregado = valores.no;
    this.comentario = valores.vacio;
    this.cantidad = valores.uno;
    this.precioUnitario = valores.cero;
    //this.subsidio = valores.cero;
    //this.sinSubsidio = valores.cero;
    this.valorDescuentoLinea = valores.cero;
    this.porcentajeDescuentoLinea = valores.cero;
    this.valorPorcentajeDescuentoLinea = valores.cero;
    this.valorDescuentoTotalLinea = valores.cero;
    this.porcentajeDescuentoTotalLinea = valores.cero;
    this.valorPorcentajeDescuentoTotalLinea = valores.cero;
    this.subtotalSinDescuentoLinea = valores.cero;
    this.subtotalConDescuentoLinea = valores.cero;
    this.importeIvaLinea = valores.cero;
    this.totalLinea = valores.cero;

    this.impuesto = new Impuesto();
    this.producto = new Producto();
    this.bodega = new Bodega();
    this.precio = new Precio();
  }
}
