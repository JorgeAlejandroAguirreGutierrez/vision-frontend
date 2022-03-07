import { Banco } from '../modelos/banco';

export class Cheque {
  id:number;
  numero: string;
  tipo: string;
  fecha: Date;
  fechaEfectivizacion: Date;
  valor: number;
  banco: Banco;

  constructor(){
    this.numero="";
    this.tipo="";
    this.fecha=new Date();
    this.fechaEfectivizacion=new Date();
    this.valor=0;
    this.banco=new Banco();
  }

}
