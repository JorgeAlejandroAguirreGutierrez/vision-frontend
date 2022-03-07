export class Comprobante {
    id: number;
    codigo: string;
    tipo: string;
    nombre: string;
    abreviatura: string;

    constructor(){
        this.codigo="";
        this.tipo="";
        this.nombre="";
        this.abreviatura="";
    }
}
