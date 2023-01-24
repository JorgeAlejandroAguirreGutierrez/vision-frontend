import { PlazoCredito } from './plazo-credito';
import { FormaPago } from './forma-pago';
import { valores } from "../../constantes";
export class Financiamiento {
    id: number;
    codigo: string;
    monto: number;
    formaPago: FormaPago;
    plazoCredito: PlazoCredito;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.monto = valores.cero;
        this.formaPago = new FormaPago();
        this.plazoCredito = new PlazoCredito();
     }
}
