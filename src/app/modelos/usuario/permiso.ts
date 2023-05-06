import { valores } from "../../constantes";
import { Perfil } from './perfil';
import { MenuOpcion } from '../configuracion/menu-opcion'

export class Permiso {
  id: number;
  codigo: string;
  estado: string;
  menuOpcion: MenuOpcion;
  perfil: Perfil;

  constructor(){
    this.id=valores.cero;
    this.codigo=valores.vacio;
    this.estado = valores.activo;
    this.menuOpcion = new MenuOpcion();
    this.perfil=new Perfil();
  }
}
