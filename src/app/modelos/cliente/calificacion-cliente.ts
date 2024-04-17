import { valores } from "../../constantes";
import { Empresa } from "../acceso/empresa";

export class CalificacionCliente {
    id:number;
    codigo: string;
    descripcion: string;
    abreviatura: string;
    estado: string;
    empresa: Empresa;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.descripcion=valores.vacio;
        this.abreviatura=valores.vacio;
        this.estado=valores.estadoActivo;
    }
    
}
