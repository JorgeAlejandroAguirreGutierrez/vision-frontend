import { Direccion } from '../cliente/direccion';
import { Telefono } from '../cliente/telefono';
import { Celular } from '../cliente/celular';
import { Correo } from '../cliente/correo';
import { TipoIdentificacion } from './tipo-identificacion';
import { valores } from "../../constantes";

export class Empresa {
    id: number;
    codigo: string;
    identificacion:string;
    razonSocial:string;
    nombreComercial: string;
    direccion: Direccion;
    logo: string;
    estado: string;
    tipoIdentificacion: TipoIdentificacion;
    telefonos: Telefono[];
    celulares: Celular[];
    correos: Correo[];
    
    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.identificacion=valores.vacio;
        this.razonSocial=valores.vacio;
        this.nombreComercial=valores.vacio;
        this.direccion=new Direccion();
        this.logo=valores.vacio;
        this.estado=valores.activo;
        this.tipoIdentificacion=new TipoIdentificacion();
        this.telefonos=[];
        this.celulares=[];
        this.correos=[];
    }
}
