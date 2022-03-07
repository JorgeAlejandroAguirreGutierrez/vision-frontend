import { Usuario } from '../modelos/usuario';

export class Sesion {

    codigo: string;
    estado:boolean;
    sesionIp:string;
    fechaApertura: Date;
    fechaCierre: Date;
    usuario: Usuario;

    constructor() { 
        this.usuario=new Usuario();  
    }
}
