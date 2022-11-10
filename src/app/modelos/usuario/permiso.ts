import { Perfil } from './perfil';
import { valores } from "../../constantes";
export class Permiso {
  id: number;
  codigo: string;
  modulo: string;
  opcion: string;
  operacion: string;
  habilitado: boolean;
  perfil: Perfil;

  constructor(){
    this.id=valores.cero;
    this.codigo=valores.vacio;
    this.modulo=valores.vacio;
    this.opcion=valores.vacio;
    this.operacion=valores.vacio;
    this.habilitado=true;
    this.perfil=new Perfil();
  }
}
