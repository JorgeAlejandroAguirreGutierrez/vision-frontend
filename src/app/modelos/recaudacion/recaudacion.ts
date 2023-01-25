import { TarjetaCredito } from './tarjeta-credito';
import { TarjetaDebito } from './tarjeta-debito';
import { Cheque } from './cheque';
import { Compensacion } from './compensacion';
import { Credito } from './credito';
import { Deposito } from './deposito';
import { Transferencia } from './transferencia';
import { Sesion } from '../usuario/sesion';
import { Factura } from '../comprobante/factura';
import { RetencionVenta } from './retencion-venta';
import { valores } from "../../constantes";

export class Recaudacion {
    id:number;
    codigo: string;
    fecha: Date;
    total: number;
    comentario: string;
    efectivo: number;
    cambio: number;
    totalCheques: number;
    totalDepositos: number;
    totalTransferencias: number;
    totalTarjetasDebitos: number;
    totalTarjetasCreditos: number;
    totalCredito: number;
    efectivoCodigoSri: string;
    chequeCodigoSri: string;
    depositoCodigoSri: string;
    transferenciaCodigoSri: string;
    tarjetaCreditoCodigoSri: string;
    tarjetaDebitoCodigoSri: string;
    creditoCodigoSri: string;
    estado: string;
    sesion: Sesion;
    factura: Factura;
    cheques: Cheque[];
    depositos: Deposito[];
    transferencias: Transferencia[];
    tarjetasDebitos: TarjetaDebito[];
    tarjetasCreditos: TarjetaCredito[];
    credito: Credito;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.fecha=new Date();
        this.total=valores.cero;
        this.efectivo=valores.cero;
        this.cambio=valores.cero;
        this.totalCheques=valores.cero;
        this.totalDepositos=valores.cero;
        this.totalTransferencias=valores.cero;
        this.totalTarjetasDebitos=valores.cero;
        this.totalTarjetasCreditos=valores.cero;
        this.totalCredito=valores.cero;
        this.efectivoCodigoSri = valores.vacio;
        this.chequeCodigoSri = valores.vacio;
        this.depositoCodigoSri = valores.vacio;
        this.transferenciaCodigoSri = valores.vacio;
        this.tarjetaCreditoCodigoSri = valores.vacio;
        this.tarjetaDebitoCodigoSri = valores.vacio;
        this.creditoCodigoSri = valores.vacio;
        this.estado=valores.noRecaudado;
        this.cheques= [];
        this.depositos=[];
        this.transferencias=[];
        this.tarjetasDebitos=[]
        this.tarjetasCreditos=[]
        this.credito=new Credito();
        this.sesion=new Sesion();
        this.factura=new Factura();
    }
}
