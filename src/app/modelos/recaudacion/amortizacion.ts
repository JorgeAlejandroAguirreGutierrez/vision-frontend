import { valores } from "../../constantes";
export class Amortizacion {
    id: number;
    codigo: string;
    numeroCuota: number;
    fechaPago: Date;
    numeroDias: number;
    capitalInicioPeriodo:number;
    capital: number;
    interesesPeriodo: number;
    valorCuota: number;
    saldoCapital: number;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.numeroCuota=valores.cero;
        this.fechaPago=new Date();
        this.numeroDias=valores.cero;
        this.capitalInicioPeriodo=valores.cero;
        this.capital=valores.cero;
        this.interesesPeriodo=valores.cero;
        this.valorCuota=valores.cero;
        this.saldoCapital=valores.cero;
    }
}
