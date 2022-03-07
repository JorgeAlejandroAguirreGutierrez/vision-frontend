import { Cliente } from '../modelos/cliente';
import { TipoRetencion } from '../modelos/tipo-retencion';
export class RetencionCliente {
    id:number;
    codigo: string;
    cliente: Cliente;
    tipoRetencion: TipoRetencion;

    constructor() {
        this.id=0;
        this.codigo="";
        this.tipoRetencion=new TipoRetencion();
    }
}
