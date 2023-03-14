import { valores } from "../../constantes";
import { Bodega } from "../inventario/bodega";
import { Impuesto } from "../inventario/impuesto";
import { Producto } from "../inventario/producto";
export class NotaDebitoCompraLinea {
    id: number;
    codigo: string;
    posicion: number;
    entregado: string;
    consignacion: string;
    costoUnitario: number;
    cantidad: number;
    valorDescuentoLinea: number;
    porcentajeDescuentoLinea: number;
    ivaSinDescuentoLinea: number;
    totalSinDescuentoLinea: number;
    totalConDescuentoLinea: number;
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
        this.porcentajeDescuentoLinea = valores.cero; 
        this.totalSinDescuentoLinea = valores.cero;
        this.impuesto = new Impuesto();
        this.producto = new Producto();
        this.bodega = new Bodega();
    }
}
