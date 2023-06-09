import { valores } from "../../constantes";
import { Empresa } from "../usuario/empresa";
export class Medida {
    id: number;
    codigo:string;
    tipo: string;
    descripcion: string;
    abreviatura: string;
    estado: string;
    empresa: Empresa;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.tipo = valores.vacio;
        this.descripcion = valores.vacio;
        this.abreviatura = valores.vacio;
        this.estado = valores.activo;
    }
}
