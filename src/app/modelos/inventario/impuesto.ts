import { valores } from "../../constantes";
export class Impuesto {
    id:number;
    codigo:string;
    codigoSRI:string;
    descripcion: string;
    abreviatura: string;
    porcentaje: number;
    estado: string;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.codigoSRI = valores.vacio;
        this.porcentaje = valores.cero;
        this.estado = valores.activo;
    }
}
