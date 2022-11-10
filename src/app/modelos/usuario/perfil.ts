import { Permiso } from './permiso';
import { valores } from "../../constantes";
import { ControlAcceso } from './control-acceso';

export class Perfil {
    id: number;
    codigo: string;
    descripcion: string;
    abreviatura: string;
    estado: string;
    controlAcceso: ControlAcceso;
    permisos: Permiso[];

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.descripcion=valores.vacio;
        this.abreviatura=valores.vacio;
        this.estado=valores.activo;
        this.controlAcceso= new ControlAcceso();
        this.permisos=[];
    }
}
