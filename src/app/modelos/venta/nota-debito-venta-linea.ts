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
    valorPorcentajeDescuentoLinea: number;
    subtotalLinea: number;
    importeIvaLinea: number;
    totalLinea: number;
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
    this.valorPorcentajeDescuentoLinea = valores.cero;
    this.subtotalLinea = valores.cero;
    this.importeIvaLinea = valores.cero;
    this.totalLinea = valores.cero;
    this.impuesto = new Impuesto();
    this.precio = new Precio();
    this.producto = new Producto();
    this.bodega = new Bodega();
  }
}
