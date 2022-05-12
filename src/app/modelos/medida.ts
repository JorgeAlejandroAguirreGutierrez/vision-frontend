export class Medida {
    id: number;
    codigo:string;
    tipo: string;
    descripcion: string;
    abreviatura: string;
    estado: string;

    constructor(){
        this.id=0;
        this.codigo="";
        this.tipo="";
        this.descripcion="";
        this.abreviatura="";
        this.estado="ACTIVO";
    }
}
