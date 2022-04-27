import { PlazoCredito } from '../modelos/plazo-credito';
import { TipoPago } from '../modelos/tipo-pago';
import { FormaPago } from '../modelos/forma-pago';

export class Financiamiento {
    id: number;
    codigo: string;
    monto: number;
    formaPago: FormaPago;
    plazoCredito: PlazoCredito;

    constructor() {
        this.id=0;
        this.monto=0;
        this.formaPago=new FormaPago();
        this.plazoCredito=new PlazoCredito();
     }



}
