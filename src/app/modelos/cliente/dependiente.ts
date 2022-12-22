import { Cliente } from './cliente';
import { Direccion } from './direccion';
import { TelefonoDependiente } from './telefono-dependiente';
import { CelularDependiente } from './celular-dependiente';
import { CorreoDependiente } from './correo-dependiente';
import { valores } from "../../constantes";

export class Dependiente {
    id: number;
    codigo: string;
    razonSocial: string;
    estado: string;
    direccion:Direccion;
    cliente: Cliente;
    telefonos: TelefonoDependiente[];
    celulares: CelularDependiente[];
    correos: CorreoDependiente[];

    constructor(){
        this.codigo = valores.vacio;
        this.razonSocial = valores.vacio;
        this.estado=valores.activo;
        this.direccion=new Direccion();
        this.cliente=new Cliente();
        this.telefonos=[];
        this.celulares=[];
        this.correos=[];
    }
}
