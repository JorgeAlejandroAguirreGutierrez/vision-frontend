import { valores } from "../../constantes";
import { Impuesto } from "../inventario/impuesto";
import { Producto } from "../inventario/producto";
import { Bodega } from "../inventario/bodega";
import { Precio } from "../inventario/precio";

export class NotaCreditoLinea {
    id: number;
    codigo: string;
    cantidadVenta: number;
    costoUnitarioVenta: number;
    cantidadCredito: number;
    costoUnitario: number;
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
        this.cantidadVenta = valores.cero;
        this.costoUnitarioVenta = valores.cero;
        this.cantidadCredito = valores.cero;
        this.costoUnitario = valores.cero;
        this.subtotalLinea = valores.cero;
        this.importeIvaLinea = valores.cero;
        this.totalLinea = valores.cero;
        this.impuesto = new Impuesto();
        this.precio = new Precio();
        this.producto = new Producto();
        this.bodega = new Bodega();
    }
}
