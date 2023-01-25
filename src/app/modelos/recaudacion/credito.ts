import { valores } from "../../constantes";
export class Credito {
  id:number;
  codigo: string;
  saldo: number;
  unidadTiempo: String;
  plazo: number;

  constructor(){
    this.id = valores.cero;
    this.saldo = valores.cero;
    this.unidadTiempo = valores.mensual;
    this.plazo = valores.uno;
  }

}
