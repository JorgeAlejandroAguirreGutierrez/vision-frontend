import { Ubicacion } from '../modelos/ubicacion';
export class Direccion {
    id:number;
    codigo:string;
    lugar: string;
    direccion: string;
    latitud: string;
    longitud: string;
    ubicacion: Ubicacion;

    constructor() {
        this.id=0;
        this.lugar="CASA";
        this.direccion="";
        this.ubicacion=new Ubicacion();
    }
}
