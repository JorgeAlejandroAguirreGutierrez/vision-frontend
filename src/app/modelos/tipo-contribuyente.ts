export class TipoContribuyente {
    id:number;
    codigo:string;
    tipo:string;
    subtipo:string;
    obligadoContabilidad: boolean;

    constructor() {
        this.id=0;
        this.tipo="";
        this.subtipo="";
        this.obligadoContabilidad=false;
    }
}
