import { valores } from "../../constantes";
import { Impuesto } from "../inventario/impuesto";
import { Producto } from "../inventario/producto";
import { Bodega } from "../inventario/bodega";

export class NotaCreditoCompraLinea {
    id: number;
    codigo: string;
    cantidadCompra: number;
    costoUnitarioCompra: number;
    cantidad: number;
    costoUnitario: number;
    subtotalLinea: number;
    importeIvaLinea: number;
    totalLinea: number;
    impuesto: Impuesto;
    producto: Producto;
    bodega: Bodega;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.cantidadCompra = valores.cero;
        this.costoUnitario = valores.cero;
        this.cantidad = valores.cero;
        this.costoUnitario = valores.cero;
        this.subtotalLinea = valores.cero;
        this.importeIvaLinea = valores.cero;
        this.totalLinea = valores.cero;
        this.impuesto = new Impuesto();
        this.producto = new Producto();
        this.bodega = new Bodega();
    }
}
