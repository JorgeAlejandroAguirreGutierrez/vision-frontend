import { CuentaContable } from "../../modelos/contabilidad/cuenta-contable";
import { CategoriaProducto } from "./categoria-producto";
import { valores } from "../../constantes";
import { Empresa } from "../usuario/empresa";

export class GrupoProducto {
    id: number;
    codigo: string;
    grupo: string;
    subgrupo : string;
    seccion: string;
    linea: string;
    sublinea: string;
    presentacion: string;
    estado: string;
    categoriaProducto: CategoriaProducto;
    cuentaContable: CuentaContable;
    empresa: Empresa;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.grupo=valores.vacio;
        this.subgrupo=valores.vacio;
        this.seccion=valores.vacio;
        this.linea=valores.vacio;
        this.sublinea=valores.vacio;
        this.presentacion=valores.vacio;
        this.estado=valores.estadoActivo;
        this.categoriaProducto = new CategoriaProducto();
        this.cuentaContable = new CuentaContable();
    }
}
