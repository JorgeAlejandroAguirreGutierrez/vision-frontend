import { OperadorTarjeta } from './operador-tarjeta';
import { Banco } from '../caja-banco/banco';
import { FranquiciaTarjeta } from './franquicia-tarjeta';
import { valores } from "../../constantes";

export class NotaDebitoVentaTarjetaDebito {
  id:number;
  codigo: string;
  titular: string;
  identificacion:string;
  nombre: string;
  lote: string;
  valor: number;
  operadorTarjeta: OperadorTarjeta;
  franquiciaTarjeta:FranquiciaTarjeta;
  banco: Banco;

  constructor(){
    this.id = valores.cero;
    this.codigo = valores.vacio;
    this.titular = valores.si;
    this.identificacion = valores.vacio;
    this.nombre = valores.vacio;
    this.lote = valores.vacio;
    this.valor = valores.cero;
    this.operadorTarjeta = new OperadorTarjeta();
    this.franquiciaTarjeta = new FranquiciaTarjeta();
    this.banco = new Banco();
  }
}


