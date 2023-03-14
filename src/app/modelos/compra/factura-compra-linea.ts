import { valores } from "../../constantes";
import { Bodega } from "../inventario/bodega";
import { Impuesto } from "../inventario/impuesto";
import { Producto } from "../inventario/producto";
export class FacturaCompraLinea {
    id: number;
    codigo: string;
    cantidad: number;
    costoUnitario: number;
    valorDescuentoLinea: number;
    porcentajeDescuentoLinea: number;
    totalSinDescuentoLinea: number;
    impuesto: Impuesto;
    producto: Producto;
    bodega: Bodega;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.cantidad = valores.cero;
        this.costoUnitario = valores.cero;
        this.valorDescuentoLinea = valores.cero;
        this.porcentajeDescuentoLinea = valores.cero;
        this.totalSinDescuentoLinea = valores.cero;
        this.impuesto = new Impuesto();
        this.producto = new Producto();
        this.bodega = new Bodega();
    }
}
