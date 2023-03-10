import { OperadorTarjeta } from './operador-tarjeta';
import { Banco } from './banco';
import { FranquiciaTarjeta } from './franquicia-tarjeta';
import { valores } from "../../constantes";

export class TarjetaDebito {
  id: number;
  codigo: string;
  titular: boolean;
  identificacion: string;
  nombre: string;
  lote: string;
  valor: number;
  banco: Banco;
  operadorTarjeta: OperadorTarjeta;
  franquiciaTarjeta: FranquiciaTarjeta;

  constructor(){
    this.id = valores.cero;
    this.codigo = valores.vacio;
    this.titular = false;
    this.identificacion = valores.vacio;
    this.nombre = valores.vacio;
    this.lote = valores.vacio;
    this.valor = valores.cero;
    this.banco = new Banco();
    this.operadorTarjeta = new OperadorTarjeta();
    this.franquiciaTarjeta = new FranquiciaTarjeta();
  }
}


