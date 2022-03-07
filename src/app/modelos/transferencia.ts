import { CuentaPropia } from './cuenta-propia';
import { Banco } from './banco';

export class Transferencia {
    id:number;
    codigo: string;
    fecha: Date;
    comprobante: string;
    valor: number;
    cuentaPropia: CuentaPropia;
    banco: Banco;

    constructor(){
        this.fecha=new Date();
        this.comprobante="";
        this.valor=0;
        this.cuentaPropia=new CuentaPropia();
    }

}
