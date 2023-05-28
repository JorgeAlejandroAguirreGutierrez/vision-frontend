import { valores } from "../../constantes";

export class TipoComprobante {
    id: number;
    codigo: string;
    descripcion: string;
    abreviatura: string;
    nombreTabla: string;
    electronica: string;
    estado: string;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.descripcion = valores.vacio;
        this.abreviatura = valores.vacio;
        this.nombreTabla = valores.vacio;
        this.electronica = valores.no;
        this.estado = valores.activo;
    }
}
