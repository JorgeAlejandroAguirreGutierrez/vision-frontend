import { valores } from "../../constantes";
export class CategoriaProducto {
    id:number;
    codigo: string;
    descripcion: string;
    tipo: string;
    abreviatura: string;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.descripcion=valores.vacio;
        this.tipo=valores.vacio;
        this.abreviatura=valores.vacio;
    }
    
}
