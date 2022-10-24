import { Medida } from './medida';
import { valores } from "../../constantes";
export class EquivalenciaMedida {
    id: number;
    codigo: string;
    medidaIni: Medida;
    medidaEqui: Medida;
    equivalencia: number;
    estado: string;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.medidaIni= new Medida();
        this.medidaEqui=new Medida();
        this.equivalencia=valores.cero;
        this.estado=valores.activo;
    }
}