import { Permiso } from './permiso';
import { valores } from "../../constantes";
export class Perfil {
    id: number;
    codigo: string;
    descripcion: string;
    abreviatura: string;
    permisos: Permiso[];

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.descripcion=valores.vacio;
        this.abreviatura=valores.vacio;
        this.permisos=[];
    }
}
