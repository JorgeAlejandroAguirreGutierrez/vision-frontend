import { AfectacionContable } from "./afectacion-contable";

export class MovimientoContable {
    id:number;
    codigo: string;
    inventario: string;
    costoVenta: string;
    devolucionCompra: string;
    descuentoCompra: string;
    venta: string;
    devolucionVenta: string;
    descuentoVenta: string;
    devolucionCostoVenta: string;
    afectacionContable: AfectacionContable;

    constructor() {
        this.id=0;
        this.codigo="";
        this.inventario="";
        this.costoVenta="";
        this.devolucionCompra="";
        this.descuentoCompra="";
        this.venta="";
        this.devolucionVenta="";
        this.descuentoVenta="";
        this.devolucionCostoVenta="";
        this.afectacionContable=new AfectacionContable();
    }
    
}
