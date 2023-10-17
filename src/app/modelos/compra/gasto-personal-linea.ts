import { valores } from "../../constantes";
import { Impuesto } from "../inventario/impuesto";

export class GastoPersonalLinea {
    id: number;
    codigo: string;
    posicion: number;
    nombreProducto: string;
    medida: string;
    cantidad: number;
    costoUnitario: number;

    valorDescuentoLinea: number;
    subtotalLineaSinDescuento: number;
    subtotalLinea: number;
    importeIvaLinea: number;
    totalLinea: number;

    impuesto: Impuesto;

    constructor() {
        this.id = valores.cero;
        this.posicion = valores.cero;
        this.nombreProducto = valores.vacio;
        this.codigo = valores.vacio;
        this.cantidad = valores.uno;
        this.costoUnitario = valores.cero;
        
        this.valorDescuentoLinea = valores.cero;
        this.subtotalLineaSinDescuento = valores.cero;
        this.subtotalLinea = valores.cero;
        this.importeIvaLinea = valores.cero;
        this.totalLinea = valores.cero;

        this.impuesto = new Impuesto();
    }
}
