import { valores } from "../../constantes";

export class CuentaContable {
    id:number;
    cuenta:string;
    descripcion:string;
    clasificacion: string;
    nivel: number;
    fe:boolean;
    casillero:string;
    mapeo:string;
    estado: string;

    constructor(){
        this.id = valores.cero;
        this.cuenta = valores.vacio;
        this.descripcion = valores.vacio;
        this.clasificacion = valores.vacio;
        this.nivel = valores.cero;
        this.fe = false;
        this.casillero=valores.vacio;
        this.mapeo=valores.vacio;
        this.estado=valores.activo;
    }
}
