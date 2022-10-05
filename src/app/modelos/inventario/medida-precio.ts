import { Medida } from "./medida";
import { Precio } from "./precio";
import { valores } from "../../constantes";

export class MedidaPrecio {
    id: number;
    codigo: string;
    medida: Medida;
    precios: Precio[];

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.medida=new Medida();
        this.precios=[];
    }
}
