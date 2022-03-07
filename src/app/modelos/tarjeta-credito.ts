import { OperadorTarjeta } from './operador-tarjeta';
import { FranquiciaTarjeta } from './franquicia-tarjeta';
import { Banco } from './banco';

export class TarjetaCredito {
  id:number;
  codigo: string;
  titular: boolean;
  identificacion:string;
  nombre: string;
  diferido: boolean;
  lote: string;
  valor: number;
  operadorTarjeta: OperadorTarjeta;
  franquiciaTarjeta:FranquiciaTarjeta;
  banco: Banco;

  constructor(){
    this.id=0;
    this.codigo="";
    this.titular=false;
    this.identificacion="";
    this.nombre="";
    this.diferido=false;
    this.lote="";
    this.valor=0;
    this.operadorTarjeta=new OperadorTarjeta();
    this.franquiciaTarjeta= new FranquiciaTarjeta();
    this.banco= new Banco;
  }
}
