import { valores } from "../../constantes";
import { Usuario } from './usuario';

export class Sesion {
    id:number;
    codigo: string;
    ip:string;
    fechaApertura: Date;
    fechaCierre: Date;
    estado: string;
    usuario: Usuario;

    constructor() { 
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.ip = valores.vacio;
        this.fechaApertura = new Date();
        this.fechaCierre = new Date();
        this.estado = valores.estadoActivo;
        this.usuario = new Usuario();
    }
}
