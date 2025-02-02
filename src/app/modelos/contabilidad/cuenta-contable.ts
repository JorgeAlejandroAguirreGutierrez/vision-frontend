import { valores } from "../../constantes";
import { Empresa } from "../acceso/empresa";

export class CuentaContable {
    id:number;
    cuenta: string;
    descripcion: string;
    clasificacion: string;
    nivel: number;
    fe: string;
    casillero: string;
    mapeo: string;
    estado: string;
    empresa: Empresa;

    constructor(){
        this.id = valores.cero;
        this.cuenta = valores.vacio;
        this.descripcion = valores.vacio;
        this.clasificacion = valores.vacio;
        this.nivel = valores.cero;
        this.fe = valores.no;
        this.casillero=valores.vacio;
        this.mapeo=valores.vacio;
        this.estado=valores.estadoActivo;
    }
}
