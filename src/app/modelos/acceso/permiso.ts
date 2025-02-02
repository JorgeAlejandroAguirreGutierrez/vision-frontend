import { valores } from "../../constantes";
import { Perfil } from './perfil';
import { MenuOpcion } from '../configuracion/menu-opcion'

export class Permiso {
  id: number;
  codigo: string;
  estado: string;
  menuOpcion: MenuOpcion;

  constructor(){
    this.id=valores.cero;
    this.codigo=valores.vacio;
    this.estado = valores.estadoActivo;
    this.menuOpcion = new MenuOpcion();
  }
}
