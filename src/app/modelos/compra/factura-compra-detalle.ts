import { valores } from "../../constantes";
import { Impuesto } from "../inventario/impuesto";
import { Producto } from "../inventario/producto";
export class FacturaCompraDetalle {
    id: number;
    codigo: string;
    comentario: string;
    cantidad: number;
    costoUnitario: number;
    valorDescuentoLinea: number;
    porcentajeDescuentoLinea: number;
    totalSinDescuentoLinea: number;
    impuesto: Impuesto;
    producto: Producto;

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
    }
}
