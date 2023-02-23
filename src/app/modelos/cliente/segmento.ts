import { valores } from "../../constantes";
export class Segmento {
    id: number;
    codigo: string;
    margenGanancia: number;
    descripcion: string;
    abreviatura: string;
    estado: string;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.margenGanancia=valores.cero;
        this.descripcion=valores.vacio;
        this.abreviatura=valores.vacio;
        this.estado=valores.activo;
    }
}
