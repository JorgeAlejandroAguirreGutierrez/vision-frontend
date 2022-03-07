export class CuentaContable {
    id:number;
    cuenta:string;
    descripcion:string;
    clasificacion: string;
    nivel: number;
    fe:boolean;
    casillero:string;
    mapeo:string;

    constructor(){
        this.id=0;
        this.cuenta="";
        this.descripcion="";
        this.clasificacion="";
        this.nivel=0;
        this.fe=false;
        this.casillero="";
        this.mapeo="";
    }
}
