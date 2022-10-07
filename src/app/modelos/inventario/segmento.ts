import { valores } from "../../constantes";
export class Segmento {
    id: number;
    codigo: string;
    descripcion: string;
    margenGanancia: number;
    estado: string;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.descripcion=valores.vacio;
        this.margenGanancia=valores.cero;
        this.estado=valores.activo;
    }
}
