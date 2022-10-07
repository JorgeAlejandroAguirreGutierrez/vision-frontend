import { valores } from "../../constantes";

export class TipoComprobante {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    nombreTabla: string;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.nombre=valores.vacio;
        this.descripcion=valores.vacio;
        this.nombreTabla=valores.vacio;
    }
}
