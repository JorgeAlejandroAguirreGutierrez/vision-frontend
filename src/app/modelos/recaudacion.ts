import { TarjetaCredito } from '../modelos/tarjeta-credito';
import { TarjetaDebito } from '../modelos/tarjeta-debito';
import { Cheque } from './cheque';
import { Compensacion } from './compensacion';
import { Credito } from './credito';
import { Deposito } from './deposito';
import { Transferencia } from './transferencia';
import { Sesion } from './sesion';
import { Factura } from './factura';
import { RetencionVenta } from './retencion-venta';
import * as constantes from '../constantes';

export class Recaudacion {
    id:number;
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
        this.fecha=new Date();
        this.total=0;
        this.efectivo=0;
        this.cambio=0;
        this.estado=constantes.norecaudado;
        this.totalCheques=0;
        this.totalDepositos=0;
        this.totalTransferencias=0;
        this.totalTarjetasDebitos=0;
        this.totalTarjetasCreditos=0;
        this.totalCompensaciones=0;
        this.totalCredito=0;
        this.totalRetencionesVentas=0;
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
