//import { TipoIdentificacion } from '../configuracion/tipo-identificacion';
import { valores } from "../../constantes";

export class Empresa {
    id: number;
    codigo: string;
    identificacion:string;
    razonSocial:string;
    nombreComercial: string;
    obligadoContabilidad: string;
    logo: string;
    estado: string;
    //tipoIdentificacion: TipoIdentificacion;
    
    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.identificacion=valores.vacio;
        this.razonSocial=valores.vacio;
        this.nombreComercial=valores.vacio;
        this.obligadoContabilidad=valores.vacio;
        this.logo=valores.vacio;
        this.estado=valores.activo;
        //this.tipoIdentificacion=new TipoIdentificacion();
    }
}
