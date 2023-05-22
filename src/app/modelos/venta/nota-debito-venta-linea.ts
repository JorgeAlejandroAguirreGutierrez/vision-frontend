import { valores } from "../../constantes";
import { Bodega } from "../inventario/bodega";
import { Impuesto } from "../inventario/impuesto";
import { Precio } from "../inventario/precio";
import { Producto } from "../inventario/producto";
export class NotaDebitoVentaLinea {
    id: number;
    codigo: string;
    posicion: number;
    entregado: string;
    consignacion: string;
    cantidad: number;
    precioUnitario: number;
    valorDescuentoLinea: number;
    porcentajeDescuentoLinea: number;
    ivaSinDescuentoLinea: number;
    ivaConDescuentoLinea: number;
    subtotalSinDescuentoLinea: number;
    subtotalConDescuentoLinea: number;
    totalConDescuentoLinea: number;
    //IMPUESTO SELECCIONADO
    impuesto: Impuesto;
    //PRECIO SELECCIONADO
    precio: Precio;
    //PRODUCTO SELECCIONADO
    producto: Producto;
    //BODEGA SELECCIONADO
    bodega: Bodega;

  constructor() {
    this.id = valores.cero;
    this.posicion = valores.cero;
    this.entregado = valores.no;
    this.cantidad = valores.cero;
    this.valorDescuentoLinea = valores.cero;
    this.porcentajeDescuentoLinea = valores.cero;
    this.ivaSinDescuentoLinea = valores.cero;
    this.ivaConDescuentoLinea = valores.cero;
    this.subtotalSinDescuentoLinea = valores.cero;
    this.subtotalConDescuentoLinea = valores.cero;
    this.totalConDescuentoLinea = valores.cero;
    this.precio = new Precio();
    this.producto = new Producto();
    this.impuesto = new Impuesto();
    this.bodega = new Bodega();
  }
}
