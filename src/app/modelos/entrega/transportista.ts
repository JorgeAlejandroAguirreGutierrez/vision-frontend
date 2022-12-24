import { VehiculoTransporte } from './vehiculo-transporte';
import { valores } from "../../constantes";
export class Transportista {
    id: number;
    codigo: string;
    nombre: string;
    identificacion: string;
    vehiculoPropio: string;
    estado: string;
    vehiculoTransporte: VehiculoTransporte;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.nombre = valores.vacio;
        this.identificacion = valores.vacio;
        this.vehiculoPropio = valores.si;
        this.estado = valores.activo;
        this.vehiculoTransporte = new VehiculoTransporte();
    }
}
