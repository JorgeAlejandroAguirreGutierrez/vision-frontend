import { Medida } from './medida';
import { valores } from "../../constantes";
export class EquivalenciaMedida {
    id: number;
    codigo: string;
    medida1: Medida;
    medida2: Medida;
    equivalencia: number;
    estado: string;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.medida1= new Medida();
        this.medida2=new Medida();
        this.equivalencia=valores.cero;
        this.estado=valores.vacio;
    }
}