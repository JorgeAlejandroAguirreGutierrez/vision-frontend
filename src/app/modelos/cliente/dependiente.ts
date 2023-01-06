import { Cliente } from './cliente';
import { TelefonoDependiente } from './telefono-dependiente';
import { CelularDependiente } from './celular-dependiente';
import { CorreoDependiente } from './correo-dependiente';
import { valores } from "../../constantes";
import { Ubicacion } from '../configuracion/ubicacion';

export class Dependiente {
    id: number;
    codigo: string;
    razonSocial: string;
    estado: string;
    direccion: string;
    ubicacion : Ubicacion;
    cliente: Cliente;
    telefonos: TelefonoDependiente[];
    celulares: CelularDependiente[];
    correos: CorreoDependiente[];

    constructor(){
        this.codigo = valores.vacio;
        this.razonSocial = valores.vacio;
        this.estado = valores.activo;
        this.direccion = valores.vacio;
        this.ubicacion = new Ubicacion();
        this.cliente = new Cliente();
        this.telefonos = [];
        this.celulares = [];
        this.correos = [];
    }
}
