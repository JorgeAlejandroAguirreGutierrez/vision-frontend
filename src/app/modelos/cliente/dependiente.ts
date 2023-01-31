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
    direccion: string;
    estado: string;
    ubicacion : Ubicacion;
    cliente: Cliente;
    telefonosDependiente: TelefonoDependiente[];
    celularesDependiente: CelularDependiente[];
    correosDependiente: CorreoDependiente[];

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.razonSocial = valores.vacio;
        this.direccion = valores.vacio;
        this.estado = valores.activo;
        this.ubicacion = new Ubicacion();
        this.cliente = new Cliente();
        this.telefonosDependiente = [];
        this.celularesDependiente = [];
        this.correosDependiente = [];
    }
}
