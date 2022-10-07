import { Amortizacion } from './amortizacion';
import { valores } from "../../constantes";
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
    this.id=valores.cero;
    this.saldo=valores.cero;
    this.tasaInteresAnual=valores.cero;
    this.periodicidad=valores.vacio;
    this.periodicidadNumero=valores.cero;
    this.periodicidadTotal=valores.cero;
    this.tasaPeriodo=valores.cero;
    this.cuotas=valores.cero;
    this.fechaPrimeraCuota=new Date();
    this.fechaConsecion=new Date();
    this.dividendo=valores.cero;
    this.tipo=valores.vacio;
    this.sinIntereses=false;
    this.amortizaciones=[];
  }

}
