import { CuentaPropia } from './cuenta-propia';
import { Banco } from './banco';
import { valores } from "../../constantes";

export class Transferencia {
    id: number;
    codigo: string;
    fecha: Date;
    tipoTransaccion: string;
    numeroTransaccion: string;
    valor: number;
    banco: Banco;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fecha = new Date();
        this.tipoTransaccion = valores.vacio;
        this.numeroTransaccion = valores.vacio;
        this.valor = valores.cero;
        this.banco = new Banco();
    }

}
