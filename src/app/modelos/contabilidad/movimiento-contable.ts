import { AfectacionContable } from "./afectacion-contable";
import { CuentaContable } from "./cuenta-contable"
import { valores } from "../../constantes";
import { Empresa } from "../acceso/empresa";

export class MovimientoContable {
    id:number;
    codigo: string;
    inventario: CuentaContable;
    costoVenta: CuentaContable;
    devolucionCompra: CuentaContable;
    descuentoCompra: CuentaContable;
    venta: CuentaContable;
    devolucionVenta: CuentaContable;
    descuentoVenta: CuentaContable;
    devolucionCostoVenta: CuentaContable;
    afectacionContable: AfectacionContable;
    empresa: Empresa;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.inventario = new CuentaContable();
        this.costoVenta = new CuentaContable();
        this.devolucionCompra = new CuentaContable();
        this.descuentoCompra = new CuentaContable();
        this.venta = new CuentaContable();
        this.devolucionVenta = new CuentaContable();
        this.descuentoVenta = new CuentaContable();
        this.devolucionCostoVenta = new CuentaContable();
        this.afectacionContable = new AfectacionContable();
    }
    
}
