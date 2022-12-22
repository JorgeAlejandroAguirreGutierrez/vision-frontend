import { valores } from "../../constantes";
export class Impuesto {
    id:number;
    codigo:string;
    codigoSri:string;
    porcentaje: number;
    estado: string;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.codigoSri=valores.vacio;
        this.porcentaje=valores.cero;
        this.estado=valores.activo;
    }
}
