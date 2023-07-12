import { valores } from "../../constantes";

export class Regimen {
    id : number;
    codigo : string;
    descripcion : string;
    abreviatura : string;
    visible : string;
    estado :string;
    
    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.descripcion = valores.vacio;
        this.abreviatura = valores.vacio;
        this.visible = valores.no;
        this.estado = valores.estadoActivo;
    }
}
