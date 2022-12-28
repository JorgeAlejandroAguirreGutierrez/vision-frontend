import { Establecimiento } from './establecimiento';
import { valores } from "../../constantes";

export class Estacion {
    id: number;
    codigo: string;
    codigoSRI: string;
    nombre: string;
    dispositivo: string;
    estado: string;
    establecimiento: Establecimiento;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.codigoSRI = valores.vacio;
        this.nombre = valores.vacio;
        this.dispositivo = valores.vacio;
        this.estado = valores.activo;
        this.establecimiento = new Establecimiento();
    }
}
