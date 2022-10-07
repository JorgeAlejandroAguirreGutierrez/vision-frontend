import { valores } from "../../constantes";
export class Correo {
    id : number;
    codigo : string;
    email : string;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.email = valores.vacio;
    }
}
