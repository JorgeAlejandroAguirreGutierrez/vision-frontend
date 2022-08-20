import { Direccion } from '../modelos/direccion';
import { Telefono } from '../modelos/telefono';
import { Celular } from '../modelos/celular';
import { Correo } from '../modelos/correo';

export class Empresa {
    id: number;
    codigo: string;
    identificacion:string;
    razonSocial:string;
    nombreComercial: string;
    direccionMatriz: Direccion;
    contribuyenteEspecial: number; //# de Resolución 
    obligadoContabilidad: string; //SI o NO
    logo: string;
    tipoAmbiente: number;
    tipoEmision: number;
    estado: string;

    telefonos: Telefono[];
    celulares: Celular[];
    correos: Correo[];
    
    constructor() {
        this.id=0;
        this.codigo="";
        this.identificacion="";
        this.razonSocial="";
        this.nombreComercial="";
        this.direccionMatriz=new Direccion();
        this.contribuyenteEspecial=0;
        this.obligadoContabilidad="";
        this.logo="";
        this.tipoAmbiente=1;
        this.tipoEmision=1;
        this.estado="ACTIVO";
        this.telefonos=[];
        this.celulares=[];
        this.correos=[];
    }
}
