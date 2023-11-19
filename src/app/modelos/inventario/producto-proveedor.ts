import { Producto } from "./producto";
import { Proveedor } from "../compra/proveedor";
import { valores } from "../../constantes";

export class ProductoProveedor {
    id:number;
    codigo:string;
    codigoEquivalente: string;
    estado: string;
    producto: Producto;
    proveedor: Proveedor;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.codigoEquivalente = valores.vacio;
        this.estado = valores.estadoActivo;
        this.producto = new Producto();
        this.proveedor = new Proveedor();
    }
}
