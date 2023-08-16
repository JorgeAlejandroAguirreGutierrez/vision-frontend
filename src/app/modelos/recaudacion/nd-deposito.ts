import { CuentaPropia } from '../caja-banco/cuenta-propia';
import { valores } from "../../constantes";
export class NDDeposito {
    id:number;
    codigo: string;
    fecha: Date;
    comprobante: string;
    valor: number;
    cuentaPropia: CuentaPropia;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fecha = new Date();
        this.comprobante = valores.vacio;
        this.valor = valores.cero;
        this.cuentaPropia = new CuentaPropia();
    }

}
