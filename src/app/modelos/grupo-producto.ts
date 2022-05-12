import { CategoriaProducto } from "./categoria-producto";

export class GrupoProducto {
    id:number;
    codigo: string;
    grupo: string;
    subgrupo : string;
    seccion: string;
    linea: string;
    sublinea: string;
    presentacion: string;
    presentacionBien: number;
    categoriaProducto: CategoriaProducto;

    constructor() {
        this.id=0;
        this.codigo="";
        this.grupo="";
        this.subgrupo="";
        this.seccion="";
        this.linea="";
        this.sublinea="";
        this.presentacion="";
        this.categoriaProducto = new CategoriaProducto();
    }
}
