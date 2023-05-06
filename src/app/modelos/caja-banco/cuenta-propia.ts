import { Banco } from './banco';
import { valores } from "../../constantes";

export class CuentaPropia {
    id: number;
    codigo: string;
    tipoCuenta: string;
    nombre: string;
    numero: string;
    estado: string;
    banco: Banco;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.tipoCuenta = valores.vacio;
        this.nombre = valores.vacio;
        this.numero = valores.vacio;
        this.estado = valores.activo;
        this.banco = new Banco();
    }
}
