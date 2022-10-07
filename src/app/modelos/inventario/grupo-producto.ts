import { AfectacionContable } from "../../modelos/contabilidad/afectacion-contable";
import { CategoriaProducto } from "./categoria-producto";
import { valores } from "../../constantes";

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
    afectacionContable: AfectacionContable;
    categoriaProducto: CategoriaProducto;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.grupo=valores.vacio;
        this.subgrupo=valores.vacio;
        this.seccion=valores.vacio;
        this.linea=valores.vacio;
        this.sublinea=valores.vacio;
        this.presentacion=valores.vacio;
        this.afectacionContable = new AfectacionContable();
        this.categoriaProducto = new CategoriaProducto();
    }
}
