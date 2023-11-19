import { Producto } from "./producto";
import { Bodega} from "./bodega";
import { valores } from "../../constantes";

export class ProductoBodega {
    id:number;
    codigo:string;
    cantidad: number;
    producto: Producto;
    bodega: Bodega;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.cantidad = valores.cero;
        this.producto = new Producto();
        this.bodega = new Bodega();
    }
}
