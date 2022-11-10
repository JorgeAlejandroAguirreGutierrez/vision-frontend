import { Establecimiento } from './establecimiento';
import { valores } from "../../constantes";

export class Estacion {
    id: number;
    codigo: string;
    descripcion: string;
    nombrePC: string;
    ip: string;
    abreviatura: string;
    estado: string;
    establecimiento: Establecimiento;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.descripcion = valores.vacio;
        this.nombrePC = valores.vacio;
        this.ip = valores.vacio;
        this.abreviatura = valores.vacio;
        this.estado = valores.activo;
        this.establecimiento=new Establecimiento();
    }
}
