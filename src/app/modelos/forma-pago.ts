export class FormaPago {
    id: number;
    codigo: string;
    descripcion: string;
    abreviatura: string;
    codigoSri:string;
    estado:string;

    constructor() {
        this.id=0;
        this.codigo="";
        this.descripcion="";
        this.abreviatura="";
        this.codigoSri="";
        this.estado="ACTIVO";
    }
    
}
