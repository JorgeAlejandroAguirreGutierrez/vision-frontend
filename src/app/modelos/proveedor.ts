export class Proveedor {
    id:number;
    codigo:string;
    identificacion:string;
    razonSocial: string;
    tipoIdentificacion:string;
    estado: boolean;
    eliminado: boolean;
    telefono: string;

    constructor() {
        this.id=0;
        this.codigo="";
        this.identificacion="";
        this.razonSocial="";
        this.tipoIdentificacion="";
        this.estado=true;
        this.eliminado=false;
        this.telefono="";
    }
}
