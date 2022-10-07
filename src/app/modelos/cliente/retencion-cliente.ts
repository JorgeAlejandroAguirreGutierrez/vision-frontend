import { TipoRetencion } from '../configuracion/tipo-retencion';
import { valores } from "../../constantes";
export class RetencionCliente {
    id : number;
    codigo : string;
    tipoRetencion : TipoRetencion;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.tipoRetencion = new TipoRetencion();
    }
}
