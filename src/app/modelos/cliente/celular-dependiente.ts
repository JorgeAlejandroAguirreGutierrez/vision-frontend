import { valores } from "../../constantes";
export class CelularDependiente {
    id : number;
    codigo : string;
    numero : string;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.numero=valores.vacio;
    }
}
