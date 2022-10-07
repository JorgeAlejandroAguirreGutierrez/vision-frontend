import { valores } from "../../constantes";
export class Parametro {
    id: number;
    codigo: string;
    tipo:string;
    nombre:string;
    abreviatura: string;
    tabla: string;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.tipo=valores.vacio;
        this.nombre=valores.vacio;
        this.abreviatura=valores.vacio;
        this.tabla=valores.vacio;
    }
}
