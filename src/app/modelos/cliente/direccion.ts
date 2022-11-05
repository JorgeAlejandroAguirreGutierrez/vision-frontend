import { Ubicacion } from '../configuracion/ubicacion';
import { valores } from "../../constantes";
export class Direccion {
    id : number;
    codigo : string;
    direccion : string;
    latitud : number;
    longitud : number;
    ubicacion : Ubicacion;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.direccion = valores.vacio;
        this.latitud = valores.latCiudad;
        this.longitud = valores.lngCiudad;
        this.ubicacion = new Ubicacion();
    }
}
