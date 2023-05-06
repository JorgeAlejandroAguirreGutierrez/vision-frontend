import { OperadorTarjeta } from './operador-tarjeta';
import { FranquiciaTarjeta } from './franquicia-tarjeta';
import { Banco } from '../caja-banco/banco';
import { valores } from "../../constantes";

export class NotaDebitoVentaTarjetaCredito {
  id: number;
  codigo: string;
  titular: string;
  identificacion: string;
  nombre: string;
  diferido: string;
  lote: string;
  valor: number;
  operadorTarjeta: OperadorTarjeta;
  franquiciaTarjeta: FranquiciaTarjeta;
  banco: Banco;

  constructor(){
    this.id = valores.cero;
    this.codigo = valores.vacio;
    this.titular = valores.si;
    this.identificacion = valores.vacio;
    this.nombre = valores.vacio;
    this.diferido = valores.no;
    this.lote = valores.vacio;
    this.valor = valores.cero;
    this.operadorTarjeta = new OperadorTarjeta();
    this.franquiciaTarjeta = new FranquiciaTarjeta();
    this.banco = new Banco;
  }
}
