import { valores } from "../../constantes";
export class PlazoCredito {
    id: number;
    codigo: string;
    descripcion: string;
    plazo: number;
    estado: string;

    constructor() { 
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.descripcion = valores.vacio;
        this.plazo = valores.cero;
        this.estado = valores.activo;
     }
}
