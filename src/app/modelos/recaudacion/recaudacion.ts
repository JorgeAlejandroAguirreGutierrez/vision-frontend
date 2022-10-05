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
    cambio: number;
    estado: string;
    efectivo: number;
    totalCheques: number;
    totalDepositos: number;
    totalTransferencias: number;
    totalTarjetasDebitos: number;
    totalTarjetasCreditos: number;
    totalCompensaciones: number;
    totalRetencionesVentas: number;
    totalCredito: number;
    cheques: Cheque[];
    depositos: Deposito[];
    transferencias: Transferencia[];
    tarjetasCreditos: TarjetaCredito[];
    tarjetasDebitos: TarjetaDebito[];
    compensaciones: Compensacion[];
    retencionesVentas: RetencionVenta[];
    credito: Credito;
    sesion: Sesion;
    factura: Factura;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.fecha=new Date();
        this.total=valores.cero;
        this.efectivo=valores.cero;
        this.cambio=valores.cero;
        this.estado=valores.norecaudado;
        this.totalCheques=valores.cero;
        this.totalDepositos=valores.cero;
        this.totalTransferencias=valores.cero;
        this.totalTarjetasDebitos=valores.cero;
        this.totalTarjetasCreditos=valores.cero;
        this.totalCompensaciones=valores.cero;
        this.totalCredito=valores.cero;
        this.totalRetencionesVentas=valores.cero;
        this.cheques= [];
        this.depositos=[];
        this.transferencias=[];
        this.tarjetasDebitos=[]
        this.tarjetasCreditos=[]
        this.compensaciones=[];
        this.retencionesVentas=[];
        this.credito=new Credito();
        this.sesion=new Sesion();
        this.factura=new Factura();
    }

    normalizar(){
        if (this.credito==null) this.credito=new Credito();
    }
}
