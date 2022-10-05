import { valores } from "../../constantes";
export class OperadorTarjeta {
    id: number;
    codigo: string;
    tipo: string;
    nombre: string;
    abreviatura: string;

    constructor(){
        this.codigo=valores.vacio;
        this.tipo=valores.vacio;
        this.nombre=valores.vacio;
        this.abreviatura=valores.vacio;
    }
}
