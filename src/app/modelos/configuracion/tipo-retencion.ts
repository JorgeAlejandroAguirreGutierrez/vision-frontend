import { valores } from "../../constantes";
export class TipoRetencion {
    id:number;
    codigo: string;
    impuestoRetencion: string;
    tipoRetencion: string;
    codigoNorma: string;
    homologacionFE: string;
    descripcion: string;
    porcentaje: number;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.impuestoRetencion=valores.vacio;
        this.tipoRetencion=valores.vacio;
        this.codigoNorma=valores.vacio;
        this.homologacionFE=valores.vacio;
        this.descripcion=valores.vacio;
        this.porcentaje=valores.cero;
    }
    
}
