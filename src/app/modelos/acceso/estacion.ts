import { Regimen } from '../configuracion/regimen';
import { Establecimiento } from './establecimiento';
import { valores } from "../../constantes";

export class Estacion {
    id: number;
    codigo: string;
    codigoSRI: string;
    descripcion: string;
    dispositivo: string;
    ip: string;
    puntoVenta: string;
    estado: string;
    regimen: Regimen;
    establecimiento: Establecimiento;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.codigoSRI = valores.vacio;
        this.descripcion = valores.vacio;
        this.dispositivo = valores.vacio;
        this.ip = valores.vacio;
        this.puntoVenta = valores.no;
        this.estado = valores.estadoActivo;
        this.regimen = new Regimen();
        this.establecimiento = new Establecimiento();
    }
}
