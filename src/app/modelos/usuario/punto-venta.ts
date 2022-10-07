import { Establecimiento } from './establecimiento';
import { valores } from "../../constantes";
export class PuntoVenta {
    id: number;
    codigo: string;
    descripcion: string;
    establecimiento: Establecimiento;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.descripcion = valores.vacio;
        this.establecimiento=new Establecimiento();
    }
}
