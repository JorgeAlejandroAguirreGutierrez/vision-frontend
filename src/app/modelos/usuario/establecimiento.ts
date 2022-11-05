import { Ubicacion } from '../configuracion/ubicacion';
import { Empresa } from './empresa';
import { valores } from "../../constantes";
export class Establecimiento {
    id: number;
    codigo: string;
    direccion: string;
    empresa: Empresa;
    ubicacion: Ubicacion;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.direccion = valores.vacio;
        this.empresa = new Empresa();
        this.ubicacion = new Ubicacion();
    }
}
