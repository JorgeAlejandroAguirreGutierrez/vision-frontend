import { valores } from "../../constantes";

export class MenuOpcion {
    id: number;
    codigo: string;
    modulo: string;
    opcion: string;
    operacion: string;
    menu: string;
    tabla: string;
    abreviatura: string;
    estado: string;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.modulo = valores.vacio;
        this.opcion = valores.vacio;
        this.operacion = valores.vacio;
        this.menu = valores.no;
        this.tabla = valores.vacio;
        this.abreviatura = valores.vacio;
        this.estado = valores.activo;
    }
}
