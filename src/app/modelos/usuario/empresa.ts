import { TipoIdentificacion } from '../configuracion/tipo-identificacion';
import { valores } from "../../constantes";

export class Empresa {
    id: number;
    codigo: string;
    identificacion:string;
    razonSocial:string;
    nombreComercial: string;
    direccion: string;
    logo: string;
    obligadoContabilidad: string;
    especial: string;
    resolucionEspecial: string;
    agenteRetencion: string;
    resolucionAgente: string;
    estado: string;
    tipoIdentificacion: TipoIdentificacion;
    certificado: string;
    contrasena: string;
    contrasenaSRI: string;
    
    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.identificacion = valores.vacio;
        this.razonSocial = valores.vacio;
        this.nombreComercial = valores.vacio;
        this.direccion = valores.vacio;
        this.logo = valores.vacio;
        this.obligadoContabilidad = valores.no;
        this.especial = valores.no;
        this.resolucionEspecial = valores.vacio;
        this.agenteRetencion = valores.no;
        this.resolucionAgente = valores.vacio;
        this.estado = valores.estadoActivo;
        this.certificado = valores.vacio;
        this.contrasena = valores.vacio;
        this.contrasenaSRI = valores.vacio;
        this.tipoIdentificacion = new TipoIdentificacion();
    }
}
