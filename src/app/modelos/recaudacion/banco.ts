import { valores } from "../../constantes";
export class Banco {
    id: number;
    codigo: string;
    abreviatura: string;
    nombre: string;
    tipo: string;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.abreviatura=valores.vacio;
        this.nombre=valores.vacio;
        this.tipo=valores.vacio;
    }
}
