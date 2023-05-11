import { OperadorTarjeta } from './operador-tarjeta';
import { FranquiciaTarjeta } from './franquicia-tarjeta';
import { Banco } from '../caja-banco/banco';
import { valores } from "../../constantes";

export class TarjetaCredito {
  id: number;
  codigo: string;
  fecha: Date;
  titular: string;
  identificacion: string;
  nombre: string;
  diferido: string;
  lote: string;
  valor: number;
  banco: Banco;
  operadorTarjeta: OperadorTarjeta;
  franquiciaTarjeta: FranquiciaTarjeta;

  constructor(){
    this.id = valores.cero;
    this.codigo = valores.vacio;
    this.fecha = new Date();
    this.titular = valores.si;
    this.identificacion = valores.vacio;
    this.nombre = valores.vacio;
    this.diferido = valores.no;    
    this.lote = valores.vacio;
    this.valor = valores.cero;
    this.banco = new Banco;
    this.operadorTarjeta = new OperadorTarjeta();
    this.franquiciaTarjeta = new FranquiciaTarjeta();
  }
}
