import { valores } from "../../constantes";
import { Estacion } from "../usuario/estacion";
import { TipoComprobante } from "./tipo-comprobante";

export class Secuencial {
    id: number;
    codigo: string;
    numeroSiguiente: number;
    maximo: Number;
    estado: string;
    tipoComprobante: TipoComprobante;
    estacion: Estacion;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.numeroSiguiente = valores.cero;
        this.maximo = valores.diez;
        this.estado = valores.estadoActivo;
        this.tipoComprobante = new TipoComprobante();
        this.estacion = new Estacion();
    }
}
