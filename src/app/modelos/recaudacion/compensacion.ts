import { TipoComprobante } from '../comprobante/tipo-comprobante';
import { valores } from "../../constantes";
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
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.tipo=valores.vacio;
        this.comprobante=valores.vacio;
        this.fecha=new Date();
        this.origen=valores.vacio;
        this.motivo=valores.vacio;
        this.fechaVencimiento=new Date();
        this.valorInicial=valores.cero;
        this.valorCompensado=valores.cero;
        this.tipoComprobante=new TipoComprobante();
    }
}
