import { valores } from "../../constantes";
export class AfectacionContable {
    id: number;
    codigo: string;
    descripcion: string;
    abreviatura: string;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.descripcion = valores.vacio;
        this.abreviatura = valores.vacio;
    }
}
