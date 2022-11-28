import { Usuario } from './usuario';
import { Estacion } from './estacion';
import { Empresa } from './empresa';
import { valores } from "../../constantes";

export class Sesion {
    id:number;
    codigo: string;
    estado:boolean;
    //sesionIp:string;
    fechaApertura: Date;
    fechaCierre: Date;
    usuario: Usuario;
    estacion: Estacion;
    empresa: Empresa;

    constructor() { 
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.estado = true;
        //this.sesionIp = valores.vacio;
        this.fechaApertura = new Date();
        this.fechaCierre = new Date();
        this.usuario = new Usuario(); 
        this.estacion = new Estacion();  
        this.empresa = new Empresa();  
    }
}
