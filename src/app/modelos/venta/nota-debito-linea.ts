import { valores } from "../../constantes";
import { Impuesto } from "../inventario/impuesto";
import { Precio } from "../inventario/precio";
import { Producto } from "../inventario/producto";

export class NotaDebitoLinea {
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

  constructor() {
    this.id = valores.cero;
    this.posicion = valores.cero;
    this.entregado = valores.no;
    this.cantidad = valores.uno;
    this.valorDescuentoLinea = valores.cero;
    this.porcentajeDescuentoLinea = valores.cero;
    this.valorPorcentajeDescuentoLinea = valores.cero;
    this.subtotalLinea = valores.cero;
    this.importeIvaLinea = valores.cero;
    this.totalLinea = valores.cero;
    this.impuesto = new Impuesto();
    this.precio = new Precio();
    this.producto = new Producto();
  }
}
