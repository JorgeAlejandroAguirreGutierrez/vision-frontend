import { valores } from "../../constantes";
export class FormaPago {
    id: number;
    codigo: string;
    descripcion: string;
    abreviatura: string;
    codigoSRI: string;
    estado:string;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.descripcion = valores.vacio;
        this.abreviatura = valores.vacio;
        this.codigoSRI = valores.vacio;
        this.estado = valores.estadoActivo;
    }
    
}
