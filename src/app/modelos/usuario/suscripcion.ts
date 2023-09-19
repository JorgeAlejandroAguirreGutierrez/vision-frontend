import { valores } from "../../constantes";
import { Empresa } from "./empresa";
import { Paquete } from "./paquete";

export class Suscripcion {
    id: number;
    codigo: string;
    fechaInicial: Date;
    fechaFinal: Date;
    paquete: Paquete;
    empresa: Empresa;
    estado: string;
    
    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fechaInicial = null;
        this.fechaFinal = null;
        this.paquete = new Paquete();
        this.empresa = null;
        this.estado = valores.estadoActivo;
    }
}
