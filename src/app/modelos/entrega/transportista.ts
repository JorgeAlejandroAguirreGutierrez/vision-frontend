import { valores } from "../../constantes";
import { TipoIdentificacion } from '../configuracion/tipo-identificacion';
import { Empresa } from '../usuario/empresa';
export class Transportista {
    id: number;
    codigo: string;
    nombre: string;
    identificacion: string;
    vehiculoPropio: string;
    estado: string;
    tipoIdentificacion: TipoIdentificacion;
    empresa: Empresa;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.nombre = valores.vacio;
        this.identificacion = valores.vacio;
        this.vehiculoPropio = valores.vacio;
        this.estado = valores.estadoActivo;
        this.tipoIdentificacion = new TipoIdentificacion();
    }
}
