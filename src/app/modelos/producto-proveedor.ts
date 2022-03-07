import { Producto } from "./producto";
import { Proveedor } from "./proveedor";

export class ProductoProveedor {
    id:number;
    codigo:string;
    codigoEquivalente: string;
    producto: Producto;
    proveedor: Proveedor;

    constructor() {
        this.id=0;
        this.codigo="";
        this.codigoEquivalente="";
        this.producto=new Producto();
        this.proveedor=new Proveedor();
    }
}
