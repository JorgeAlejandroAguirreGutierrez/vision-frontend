import { Establecimiento } from '../modelos/establecimiento';

export class PuntoVenta {
    id: number;
    codigo:string;
    descripcion: string;
    establecimiento: Establecimiento;

    constructor() {
        this.id=0;
        this.codigo="";
        this.descripcion="";
        this.establecimiento=new Establecimiento();
    }
}
