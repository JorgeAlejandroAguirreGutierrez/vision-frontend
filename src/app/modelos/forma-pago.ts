export class FormaPago {
    id: number;
    codigo: string;
    descripcion: string;
    abreviatura: string;
    estado:string;

    constructor() {
        this.id=0;
        this.codigo="";
        this.descripcion="";
        this.abreviatura="";
        this.estado="ACTIVO";
    }
    
}
