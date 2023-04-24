import { valores } from "../../constantes";
import { Estacion } from "../usuario/estacion";
import { TipoComprobante } from "../venta/tipo-comprobante";

export class Secuencial {
    id: number;
    codigo: string;
    numeroSiguiente: number;
    estado: string;
    tipoComprobante: TipoComprobante;
    estacion: Estacion;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.numeroSiguiente = valores.cero;
        this.estado = valores.activo;
        this.tipoComprobante = new TipoComprobante();
        this.estacion = new Estacion();
    }

}
