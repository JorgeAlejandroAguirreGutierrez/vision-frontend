import { AfectacionContable } from "./afectacion-contable";
import { valores } from "../../constantes";
export class MovimientoContable {
    id:number;
    codigo: string;
    inventario: string;
    costoVenta: number;
    devolucionCompra: number;
    descuentoCompra: number;
    venta: string;
    devolucionVenta: number;
    descuentoVenta: number;
    devolucionCostoVenta: number;
    afectacionContable: AfectacionContable;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.inventario = valores.vacio;
        this.costoVenta = valores.cero;
        this.devolucionCompra = valores.cero;
        this.descuentoCompra = valores.cero;
        this.venta = valores.vacio;
        this.devolucionVenta = valores.cero;
        this.descuentoVenta = valores.cero;
        this.devolucionCostoVenta = valores.cero;
        this.afectacionContable = new AfectacionContable();
    }
    
}
