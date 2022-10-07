import { valores } from "../../constantes";
export class TipoGasto {
    id: number;
    codigo: string;
    nombre:string;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.nombre=valores.vacio;
    }
}
