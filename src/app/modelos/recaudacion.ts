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

export class Recaudacion {
    id:number;
    fecha: Date;
    total: number;
    comentario: string;
    cambio: number;
    estado: boolean;
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
        this.estado=false;
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

    private calcularTotalCheques(){
        this.totalCheques=0;
        this.cheques.forEach((cheque, index)=> {
            this.totalCheques=this.totalCheques+Number(cheque.valor);
        });  
    }
    private calcularTotalDepositos(){
        this.totalDepositos=0;
        this.depositos.forEach((deposito, index)=> {
            this.totalDepositos=this.totalDepositos+Number(deposito.valor);
        });  
    }
    private calcularTotalTransferencias(){
        this.totalTransferencias=0;
        this.transferencias.forEach((transferencia, index)=> {
            this.totalTransferencias=this.totalTransferencias+Number(transferencia.valor);
        });  
    }
    private calcularTotalTarjetasDebitos(){
        this.totalTarjetasDebitos=0;
        this.tarjetasDebitos.forEach((tarjeta_debito, index)=> {
            this.totalTarjetasDebitos=this.totalTarjetasDebitos+Number(tarjeta_debito.valor);
        });  
    }
    private calcularTotalTarjetasCreditos(){
        this.totalTarjetasCreditos=0;
        this.tarjetasCreditos.forEach((tarjeta_credito, index)=> {
            this.totalTarjetasCreditos=this.totalTarjetasCreditos+Number(tarjeta_credito.valor);
        });  
    }

    calcularTotales(){
        this.calcularTotalCheques();
        this.calcularTotalDepositos();
        this.calcularTotalTransferencias();
        this.calcularTotalTarjetasDebitos();
        this.calcularTotalTarjetasCreditos();
        
    }
}
