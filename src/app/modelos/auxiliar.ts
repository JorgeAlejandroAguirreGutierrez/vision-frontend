import { Cliente } from './cliente';
import { Direccion } from './direccion';
import { TelefonoAuxiliar } from './telefono-auxiliar';
import { CelularAuxiliar } from './celular-auxiliar';
import { CorreoAuxiliar } from './correo-auxiliar';

export class Auxiliar {
    id: number;
    codigo: string;
    razonSocial: string;
    estado: boolean;
    eliminado: boolean;
    direccion:Direccion;
    cliente: Cliente;
    telefonos: TelefonoAuxiliar[];
    celulares: CelularAuxiliar[];
    correos: CorreoAuxiliar[];

    constructor(){
        this.codigo="";
        this.razonSocial="";
        this.eliminado=false;
        this.estado=true;
        this.direccion=new Direccion();
        this.cliente=new Cliente();
        this.telefonos=[];
        this.celulares=[];
        this.correos=[];
    }
}
