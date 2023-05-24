import { valores } from "../../constantes";
import { Bodega } from "../inventario/bodega";
import { Impuesto } from "../inventario/impuesto";
import { Producto } from "../inventario/producto";

export class FacturaCompraLinea {
    id: number;
    codigo: string;
    cantidad: number;
    costoUnitario: number;
    costoDistribuido: number;
    costoPromedio: number;
    valorDescuentoLinea: number;
    porcentajeDescuentoLinea: number;
    valorPorcentajeDescuentoLinea: number;
    valorDescuentoTotalLinea: number;
    valorPorcentajeDescuentoTotalLinea: number;
    subtotalSinDescuentoLinea: number;
    subtotalConDescuentoLinea: number;
    importeIvaLinea: number;
    totalLinea: number;
    impuesto: Impuesto;
    producto: Producto;
    bodega: Bodega;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.cantidad = valores.cero;
        this.costoUnitario = valores.cero;
        this.costoDistribuido = valores.cero;
        this.costoPromedio = valores.cero;
        this.valorDescuentoLinea = valores.cero;
        this.porcentajeDescuentoLinea = valores.cero;
        this.valorPorcentajeDescuentoLinea = valores.cero;
        this.valorDescuentoTotalLinea = valores.cero;
        this.valorPorcentajeDescuentoTotalLinea = valores.cero;
        this.subtotalSinDescuentoLinea = valores.cero;
        this.subtotalConDescuentoLinea = valores.cero;
        this.importeIvaLinea = valores.cero;
        this.totalLinea = valores.cero;
        this.impuesto = new Impuesto();
        this.producto = new Producto();
        this.bodega = new Bodega();
    }
}
