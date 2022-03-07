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
        this.id=0;
        this.codigo="";
        this.numeroCuota= 0;
        this.fechaPago=new Date();
        this.numeroDias= 0;
        this.capitalInicioPeriodo=0;
        this.capital= 0;
        this.interesesPeriodo=0;
        this.valorCuota=0;
        this.saldoCapital=0;
    }
}
