import { Banco } from './banco';
import { valores } from "../../constantes";
export class CuentaPropia {
    id:number;
    codigo:string;
    numero:string;
    banco: Banco;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.numero=valores.vacio;
        this.banco=new Banco();
    }
}
