import { Regimen } from '../configuracion/regimen';
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
    latitudgeo: number;
    longitudgeo: number;
    estado: string;
    regimen: Regimen;
    ubicacion: Ubicacion;
    empresa: Empresa;
    telefonosEstablecimiento: TelefonoEstablecimiento[];
    celularesEstablecimiento: CelularEstablecimiento[];
    correosEstablecimiento: CorreoEstablecimiento[];

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.codigoSRI = valores.vacio;
        this.descripcion = valores.vacio;
        this.direccion = valores.vacio;
        this.latitudgeo = valores.latCiudad;
        this.longitudgeo = valores.lngCiudad;
        this.estado = valores.estadoActivo;
        this.regimen = new Regimen();
        this.ubicacion = new Ubicacion();
        this.empresa = new Empresa();
        this.telefonosEstablecimiento=[];
        this.celularesEstablecimiento=[];
        this.correosEstablecimiento=[];
    }
}
