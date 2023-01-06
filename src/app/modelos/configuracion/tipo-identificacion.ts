import { valores } from "../../constantes";
export class TipoIdentificacion {
    id: number;
    codigo: string;
    codigoSRI: string;
    descripcion: string;
    estado: string;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.codigoSRI = valores.vacio;
        this.descripcion=valores.vacio;
        this.estado=valores.activo;
    }
}
