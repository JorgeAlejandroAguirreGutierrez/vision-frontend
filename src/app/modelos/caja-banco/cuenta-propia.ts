import { valores } from "../../constantes";
import { Banco } from './banco';
import { Empresa } from "../usuario/empresa";


export class CuentaPropia {
    id: number;
    codigo: string;
    tipoCuenta: string;
    nombre: string;
    numero: string;
    estado: string;
    banco: Banco;
    empresa: Empresa;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.tipoCuenta = valores.vacio;
        this.nombre = valores.vacio;
        this.numero = valores.vacio;
        this.estado = valores.estadoActivo;
        this.banco = new Banco();
    }
}
