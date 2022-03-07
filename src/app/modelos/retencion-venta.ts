import { RetencionCliente } from './retencion-cliente';
import { PuntoVenta } from './punto-venta';
import { Establecimiento } from './establecimiento';

export class RetencionVenta {
    id:number;
    codigo: string;
    secuencia: string;
    autorizacion: string;
    baseImponible: number;
    valor: number;
    porcentaje: number;
    retencionCliente: RetencionCliente;
    establecimiento: Establecimiento;
    puntoVenta: PuntoVenta;

    constructor() {
        this.id=0;
        this.codigo="";
        this.secuencia="";
        this.autorizacion="";
        this.baseImponible=0;
        this.valor=0;
        this.porcentaje=0;
        this.retencionCliente=new RetencionCliente();
        this.puntoVenta=new PuntoVenta();
    }
}
