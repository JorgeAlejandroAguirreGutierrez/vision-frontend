import { Cliente } from './cliente';
import { Direccion } from './direccion';
import { TelefonoDependiente } from './telefono-dependiente';
import { CelularDependiente } from './celular-dependiente';
import { CorreoDependiente } from './correo-dependiente';

export class Dependiente {
    id: number;
    codigo: string;
    razonSocial: string;
    estado: boolean;
    eliminado: boolean;
    direccion:Direccion;
    cliente: Cliente;
    telefonos: TelefonoDependiente[];
    celulares: CelularDependiente[];
    correos: CorreoDependiente[];

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
