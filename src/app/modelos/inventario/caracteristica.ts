import { valores } from "../../constantes";

export class Caracteristica {
    id: number;
    codigo: string;
    nombre: string;
    abreviatura: string;
    estado: string;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.nombre = valores.vacio;
        this.abreviatura = valores.vacio;
        this.estado = valores.estadoActivo;
    }
}
