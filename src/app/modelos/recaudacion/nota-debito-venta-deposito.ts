import { CuentaPropia } from '../caja-banco/cuenta-propia';
import { Banco } from '../caja-banco/banco';
import { valores } from "../../constantes";
export class NotaDebitoVentaDeposito {
    id: number;
    codigo: string;
    fecha: Date;
    comprobante: string;
    valor: number;
    cuentaPropia: CuentaPropia;
    banco: Banco;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fecha = new Date();
        this.comprobante = valores.vacio;
        this.valor = valores.cero;
        this.cuentaPropia = new CuentaPropia();
        this.banco = new Banco();
    }

}
