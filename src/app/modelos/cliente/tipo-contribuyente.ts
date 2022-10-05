import { valores } from "../../constantes";
export class TipoContribuyente {
    id: number;
    codigo: string;
    tipo: string;
    subtipo: string;
    obligadoContabilidad: boolean;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.tipo = valores.vacio;
        this.subtipo = valores.vacio;
        this.obligadoContabilidad = false;
    }
}
