export class TipoComprobante {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    nombreTabla: string;

    constructor(){
        this.id=0;
        this.codigo="";
        this.nombre="";
        this.descripcion="";
        this.nombreTabla="";
    }
}
