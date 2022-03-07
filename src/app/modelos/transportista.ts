import { VehiculoTransporte } from './vehiculo-transporte';

export class Transportista {
    id:number;
    codigo:string;
    nombre:string;
    identificacion:string;
    vehiculoPropio:boolean;
    vehiculoTransporte: VehiculoTransporte;


    constructor(){
        this.codigo="";
        this.nombre="";
        this.identificacion="";
        this.vehiculoPropio=false;
        this.vehiculoTransporte=new VehiculoTransporte();
    }
}
