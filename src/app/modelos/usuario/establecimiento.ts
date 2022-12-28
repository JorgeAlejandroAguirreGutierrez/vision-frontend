import { Ubicacion } from '../configuracion/ubicacion';
import { Empresa } from './empresa';
import { TelefonoEstablecimiento } from './telefono-establecimiento';
import { CelularEstablecimiento } from './celular-establecimiento';
import { CorreoEstablecimiento } from './correo-establecimiento';
import { valores } from "../../constantes";

export class Establecimiento {
    id: number;
    codigo: string;
    codigoSRI: string;
    descripcion: string;
    direccion: string;
    latitud: number;
    longitud: number;
    estado: string;
    empresa: Empresa;
    ubicacion: Ubicacion;
    telefonos: TelefonoEstablecimiento[];
    celulares: CelularEstablecimiento[];
    correos: CorreoEstablecimiento[];

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.codigoSRI = valores.vacio;
        this.descripcion = valores.vacio;
        this.direccion = valores.vacio;
        this.latitud = valores.cero;
        this.latitud = valores.cero;
        this.estado = valores.activo;
        this.empresa = new Empresa();
        this.ubicacion = new Ubicacion();
        this.telefonos=[];
        this.celulares=[];
        this.correos=[];
    }
}
