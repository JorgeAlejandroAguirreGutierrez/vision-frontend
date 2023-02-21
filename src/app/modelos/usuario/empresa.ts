import { TipoIdentificacion } from '../configuracion/tipo-identificacion';
import { valores } from "../../constantes";

export class Empresa {
    id: number;
    codigo: string;
    identificacion:string;
    razonSocial:string;
    nombreComercial: string;
    direccion: string;
    obligadoContabilidad: string;
    logo64: string;
    estado: string;
    tipoIdentificacion: TipoIdentificacion;
    
    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.identificacion = valores.vacio;
        this.razonSocial = valores.vacio;
        this.nombreComercial = valores.vacio;
        this.direccion = valores.vacio;
        this.obligadoContabilidad = valores.no;
        this.logo64 = valores.vacio;
        this.estado = valores.activo;
        this.tipoIdentificacion = new TipoIdentificacion();
    }
}
