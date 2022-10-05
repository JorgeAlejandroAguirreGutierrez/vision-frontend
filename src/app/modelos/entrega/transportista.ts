import { VehiculoTransporte } from './vehiculo-transporte';
import { valores } from "../../constantes";
export class Transportista {
    id:number;
    codigo:string;
    nombre:string;
    identificacion:string;
    vehiculoPropio:boolean;
    vehiculoTransporte: VehiculoTransporte;


    constructor(){
        this.codigo = valores.vacio;
        this.nombre = valores.vacio;
        this.identificacion = valores.vacio;
        this.vehiculoPropio = false;
        this.vehiculoTransporte = new VehiculoTransporte();
    }
}
