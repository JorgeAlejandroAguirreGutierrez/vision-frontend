import { Amortizacion } from './amortizacion';

export class Credito {
  id:number;
  codigo: string;
  saldo: number;
  tasaInteresAnual: number;
  periodicidad: string;
  periodicidadNumero: number;
  periodicidadTotal: number;
  tasaPeriodo: number;
  cuotas: number;
  fechaPrimeraCuota: Date;
  fechaConsecion: Date;
  dividendo: number;
  tipo: string;
  sinIntereses: boolean;
  amortizaciones: Amortizacion[]; 

  constructor(){
    this.id=0;
    this.saldo=0;
    this.tasaInteresAnual=0;
    this.periodicidad="";
    this.periodicidadNumero=0;
    this.periodicidadTotal=0;
    this.tasaPeriodo=0;
    this.cuotas=0;
    this.fechaPrimeraCuota=new Date();
    this.fechaConsecion=new Date();
    this.dividendo=0;
    this.tipo="";
    this.sinIntereses=false;
    this.amortizaciones=[];
  }

}
