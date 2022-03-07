import { Ubicacion } from '../modelos/ubicacion';
export class Direccion {
    id:number;
    codigo:string;
    direccion: string;
    latitud: string;
    longitud: string;
    ubicacion: Ubicacion;

    constructor() {
        this.id=0;
        this.direccion="";
        this.ubicacion=new Ubicacion();
    }
}
