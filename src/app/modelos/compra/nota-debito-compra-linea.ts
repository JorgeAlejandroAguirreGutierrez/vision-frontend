import { valores } from "../../constantes";
import { Bodega } from "../inventario/bodega";
import { Impuesto } from "../inventario/impuesto";
import { Producto } from "../inventario/producto";
export class NotaDebitoCompraLinea {
    id: number;
    codigo: string;
    cantidad: number;
    costoUnitario: number;
    valorDescuentoLinea: number;
    subtotalLinea: number;
    importeIvaLinea: number;
    totalLinea: number;
    entregado: string;
    //IMPUESTO SELECCIONADO
    impuesto: Impuesto;
    //PRODUCTO SELECCIONADO
    producto: Producto;
    //BODEGA SELECCIONADO
    bodega: Bodega;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.cantidad = valores.cero;
        this.costoUnitario = valores.cero;
        this.valorDescuentoLinea = valores.cero;
        this.subtotalLinea = valores.cero;
        this.importeIvaLinea = valores.cero;
        this.totalLinea = valores.cero;
        this.entregado = valores.no;
        this.impuesto = new Impuesto();
        this.producto = new Producto();
        this.bodega = new Bodega();
    }
}
