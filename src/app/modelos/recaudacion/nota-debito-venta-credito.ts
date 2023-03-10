import { valores } from "../../constantes";
export class NotaDebitoVentaCredito {
  id: number;
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
