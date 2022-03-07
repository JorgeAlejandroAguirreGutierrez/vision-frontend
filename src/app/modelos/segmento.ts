import { estadoActivo } from '../constantes';

export class Segmento {
    id: number;
    codigo: string;
    descripcion: string;
    margenGanancia: number;
    estado: string;

    constructor() {
        this.id=0;
        this.codigo="";
        this.descripcion="";
        this.margenGanancia=0;
        this.estado=estadoActivo;
    }
}
