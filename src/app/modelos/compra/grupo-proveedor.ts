import { CuentaContable } from "../contabilidad/cuenta-contable";
import { valores } from "../../constantes";

export class GrupoProveedor {
    id: number;
    codigo:string;
    descripcion:string;
    abreviatura:string;
    estado:string;
    cuentaContable: CuentaContable;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.descripcion = valores.vacio;
        this.abreviatura = valores.vacio;
        this.estado = valores.activo;
        this.cuentaContable = new CuentaContable();
    }
}
