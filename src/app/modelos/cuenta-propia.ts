import { Banco } from './banco';

export class CuentaPropia {
    id:number;
    codigo:string;
    numero:string;
    banco: Banco;

    constructor(){
        this.numero="";
        this.banco=new Banco();
    }
}
