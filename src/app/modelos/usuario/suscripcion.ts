import { valores } from "../../constantes";
import { Banco } from "../caja-banco/banco";
import { Empresa } from "./empresa";
import { Paquete } from "./paquete";

export class Suscripcion {
    id: number;
    codigo: string;
    fechaInicial: Date;
    fechaFinal: Date;
    conteoComprobantes: number;
    paquete: Paquete;
    empresa: Empresa;
    numeroTransaccion: string;
    fechaTransaccion: Date;
    banco: Banco;
    estado: string;
    
    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fechaInicial = null;
        this.fechaFinal = null;
        this.paquete = new Paquete();
        this.empresa = null;
        this.numeroTransaccion = valores.vacio;
        this.fechaTransaccion = new Date();
        this.banco = null;
        this.estado = valores.estadoActivo;
    }
}
