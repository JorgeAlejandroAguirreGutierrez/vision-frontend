import { Producto } from "./producto";
import { Bodega} from "./bodega";

export class ProductoBodega {
    id:number;
    codigo:string;
    cantidad: number;
    producto: Producto;
    bodega: Bodega;

    constructor() {
        this.id=0;
        this.codigo="";
        this.cantidad=0;
        this.producto=new Producto();
        this.bodega=new Bodega();
    }
}
