import { valores } from "../../constantes";
export class TipoRetencion {
    id:number;
    codigo: string;
    impuestoRetencion: string;
    tipoRetencion: string;
    codigoSRI: string;
    descripcion: string;
    porcentaje: number;
    estado: string;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.impuestoRetencion=valores.vacio;
        this.tipoRetencion=valores.vacio;
        this.codigoSRI=valores.vacio;
        this.descripcion=valores.vacio;
        this.porcentaje=valores.cero;
        this.estado=valores.estadoActivo;
    }
}
