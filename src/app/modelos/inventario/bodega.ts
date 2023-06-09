import { valores } from "../../constantes";
import { Empresa } from "../usuario/empresa";
export class Bodega {
    id: number;
    codigo: string;
    nombre: string;
    abreviatura: string;
    estado: string;
    empresa: Empresa;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.nombre = valores.vacio;
        this.abreviatura = valores.vacio;
        this.estado = valores.activo;
    }
}
