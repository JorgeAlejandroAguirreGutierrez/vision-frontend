export class PlazoCredito {
    id: number;
    codigo: string;
    descripcion: string;
    plazo: number;
    estado: string;

    constructor() { 
        this.id=0;
        this.codigo="";
        this.descripcion="";
        this.plazo=0;
        this.estado="ACTIVO";
     }
}
