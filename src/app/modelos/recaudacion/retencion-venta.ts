import { RetencionCliente } from '../cliente/retencion-cliente';
import { PuntoVenta } from '../usuario/punto-venta';
import { Establecimiento } from '../usuario/establecimiento';
import { valores } from "../../constantes";

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
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.secuencia=valores.vacio;
        this.autorizacion=valores.vacio;
        this.baseImponible=valores.cero;
        this.valor=valores.cero;
        this.porcentaje=valores.cero;
        this.retencionCliente=new RetencionCliente();
        this.puntoVenta=new PuntoVenta();
    }
}
