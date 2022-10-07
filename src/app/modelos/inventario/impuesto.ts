import { valores } from "../../constantes";
export class Impuesto {
    id:number;
    codigo:string;
    codigoNorma:string;
    porcentaje: number;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.codigoNorma=valores.vacio;
        this.porcentaje=valores.cero;
    }
}
