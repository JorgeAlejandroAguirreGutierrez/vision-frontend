import { AfectacionContable } from "./afectacion-contable";

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
        this.id=0;
        this.codigo="";
        this.inventario="";
        this.costoVenta=0;
        this.devolucionCompra=0;
        this.descuentoCompra=0;
        this.venta="";
        this.devolucionVenta=0;
        this.descuentoVenta=0;
        this.devolucionCostoVenta=0;
        this.afectacionContable=new AfectacionContable();
    }
    
}
