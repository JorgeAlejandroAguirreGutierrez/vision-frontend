import { Banco } from '../caja-banco/banco';
import { valores } from "../../constantes";

export class NotaDebitoVentaTransferencia {
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
