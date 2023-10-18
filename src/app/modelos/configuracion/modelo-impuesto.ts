import { valores } from "../../constantes";

export class ModeloImpuesto {
    id: number;
    codigo: string;
    codigoPorcentaje: string;
    baseImponible: string;
    valor: string;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.codigoPorcentaje = valores.vacio;
        this.baseImponible = valores.vacio;
        this.valor = valores.vacio;
    }
}