import { Producto } from "./producto";
import { Proveedor } from "../proveedor/proveedor";
import { valores } from "../../constantes";
export class ProductoProveedor {
    id:number;
    codigo:string;
    codigoEquivalente: string;
    producto: Producto;
    proveedor: Proveedor;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.codigoEquivalente=valores.vacio;
        this.producto=new Producto();
        this.proveedor=new Proveedor();
    }
}
