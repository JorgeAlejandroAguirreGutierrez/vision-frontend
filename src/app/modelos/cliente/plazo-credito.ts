import { valores } from "../../constantes";
import { Empresa } from "../usuario/empresa";
export class PlazoCredito {
    id: number;
    codigo: string;
    descripcion: string;
    abreviatura: string;
    plazo: number;
    estado: string;
    empresa: Empresa;

    constructor() { 
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.descripcion = valores.vacio;
        this.abreviatura = valores.vacio;
        this.plazo = valores.cero;
        this.estado = valores.estadoActivo;
     }
}
