import { TipoComprobante } from './tipo-comprobante';

export class Compensacion {
    id:number;
    codigo: string;
    tipo:string;
    comprobante:string;
    fecha: Date;
    origen: string;
    motivo:string;
    fechaVencimiento: Date;
    valorInicial: number;
    valorCompensado: number;
    tipoComprobante: TipoComprobante;

    constructor(){
        this.id=0;
        this.codigo="";
        this.tipo="";
        this.comprobante="";
        this.fecha=new Date();
        this.origen="";
        this.motivo="";
        this.fechaVencimiento=new Date();
        this.valorInicial=0;
        this.valorCompensado=0;
        this.tipoComprobante=new TipoComprobante();
    }
}
