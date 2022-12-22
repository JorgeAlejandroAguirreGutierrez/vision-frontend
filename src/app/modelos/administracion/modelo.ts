import { valores } from "../../constantes";
export class Modelo {
    id: number;
    codigo:string;
    nombre: string;
    nombreTecnico: string;
    endpoint: string;
    estado: string;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.nombre=valores.vacio;
        this.nombreTecnico=valores.vacio;
        this.endpoint=valores.vacio;
        this.estado=valores.activo;
    }
}
