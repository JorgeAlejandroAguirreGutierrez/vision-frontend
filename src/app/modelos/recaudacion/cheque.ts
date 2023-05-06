import { Banco } from '../caja-banco/banco';
import { valores } from "../../constantes";
export class Cheque {
  id:number;
  numero: string;
  tipo: string;
  fecha: Date;
  fechaEfectivizacion: Date;
  valor: number;
  banco: Banco;

  constructor(){
    this.numero=valores.vacio;
    this.tipo=valores.vacio;
    this.fecha = new Date();
    this.fechaEfectivizacion = new Date();
    this.valor = valores.cero;
    this.banco = new Banco();
  }

}
