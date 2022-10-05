import { Usuario } from './usuario';
import { valores } from "../../constantes";
export class Sesion {
    id:number;
    codigo: string;
    estado:boolean;
    sesionIp:string;
    fechaApertura: Date;
    fechaCierre: Date;
    usuario: Usuario;

    constructor() { 
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.estado = true;
        this.sesionIp = valores.vacio;
        this.fechaApertura = new Date();
        this.fechaCierre = new Date();
        this.usuario = new Usuario();  
    }
}
