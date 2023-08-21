import { valores } from "../../constantes";
import { Impuesto } from "../inventario/impuesto";
import { Producto } from "../inventario/producto";
import { Bodega } from "../inventario/bodega";

export class FacturaCompraLinea {
    id: number;
    codigo: string;
    posicion: number;
    cantidad: number;
    costoUnitario: number;
    costoDistribuido: number;
    costoPromedio: number;

    valorDescuentoLinea: number;
    porcentajeDescuentoLinea: number;
    valorPorcentajeDescuentoLinea: number;
    valorDescuentoTotalLinea: number;
    valorPorcentajeDescuentoTotalLinea: number;
    subtotalLineaSinDescuento: number;
    subtotalLinea: number;
    importeIvaLinea: number;
    totalLinea: number;

    impuesto: Impuesto;
    producto: Producto;
    bodega: Bodega;

    constructor() {
        this.id = valores.cero;
        this.posicion = valores.cero;
        this.codigo = valores.vacio;
        this.cantidad = valores.uno;
        this.costoUnitario = valores.cero;
        this.costoDistribuido = valores.cero;
        this.costoPromedio = valores.cero;
        
        this.valorDescuentoLinea = valores.cero;
        this.porcentajeDescuentoLinea = valores.cero;
        this.valorPorcentajeDescuentoLinea = valores.cero;
        this.valorDescuentoTotalLinea = valores.cero;
        this.valorPorcentajeDescuentoTotalLinea = valores.cero;
        this.subtotalLineaSinDescuento = valores.cero;
        this.subtotalLinea = valores.cero;
        this.importeIvaLinea = valores.cero;
        this.totalLinea = valores.cero;

        this.impuesto = new Impuesto();
        this.producto = new Producto();
        this.bodega = new Bodega();
    }
}
