import { valores } from "../../constantes";
import { Bodega } from "../inventario/bodega";
import { Producto } from "../inventario/producto";
export class NotaDebitoCompraLinea {
    id: number;
    codigo: string;
    cantidad: number;
    costoUnitario: number;
    valorDescuentoLinea: number;
    porcentajeDescuentoLinea: number;
    totalSinDescuentoLinea: number;
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
        this.producto = new Producto();
        this.bodega = new Bodega();
    }
}
