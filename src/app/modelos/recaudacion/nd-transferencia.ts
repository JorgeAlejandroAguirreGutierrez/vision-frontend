import { valores } from "../../constantes";
import { CuentaPropia } from '../caja-banco/cuenta-propia';

export class NDTransferencia {
    id: number;
    codigo: string;
    fecha: Date;
    tipo: string;
    comprobante: string;
    valor: number;
    cuentaPropia: CuentaPropia;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fecha = new Date();
        this.tipo = valores.transferenciaDirecta;
        this.comprobante = valores.vacio;
        this.valor = valores.cero;
        this.cuentaPropia = new CuentaPropia();
    }
}
