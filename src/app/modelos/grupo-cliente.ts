import { CuentaContable } from "./cuenta-contable";

export class GrupoCliente {
    id: number;
    codigo:string;
    descripcion:string;
    abreviatura:string;
    estado:string;
    cuentaContable: CuentaContable;

    constructor() {
        this.id=0;
        this.codigo="";
        this.descripcion="";
        this.abreviatura="";
        this.estado="ACTIVO";
        this.cuentaContable=new CuentaContable();
    }
}
