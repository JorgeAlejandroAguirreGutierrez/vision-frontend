import { valores } from "../../constantes";
import { Empresa } from "../acceso/empresa";

export class Banco {
    id: number;
    codigo: string;
    ruc: string;
    razonSocial: string;
    subsistema: string;
    calificacion: string;
    abreviatura: string;
    estado: string;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.ruc = valores.vacio;
        this.razonSocial = valores.vacio;
        this.subsistema = valores.vacio;
        this.calificacion = valores.vacio;
        this.abreviatura = valores.vacio;
        this.estado = valores.estadoActivo;    
    }
}
