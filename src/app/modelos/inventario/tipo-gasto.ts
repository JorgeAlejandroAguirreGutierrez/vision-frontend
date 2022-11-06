import { valores } from "../../constantes";
export class TipoGasto {
    id: number;
    codigo: string;
    descripcion:string;
    abreviatura: string;
    estado: string;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.descripcion=valores.vacio;
        this.abreviatura=valores.vacio;
        this.estado=valores.activo;
    }
}
