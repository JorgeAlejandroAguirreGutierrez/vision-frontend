import { Perfil } from './perfil';
import { valores } from "../../constantes";
export class Permiso {
  id: number;
  codigo: string;
  modulo: string;
  operacion: string;
  habilitado: string;
  estado: string;
  perfil: Perfil;

  constructor(){
    this.id=valores.cero;
    this.codigo=valores.vacio;
    this.modulo=valores.vacio;
    this.operacion=valores.vacio;
    this.habilitado=valores.si;
    this.perfil=new Perfil();
  }
}
