export class Ubicacion {
    id:number;
    codigo:string;
    codigoNorma: string;
    provincia:string;
    canton:string;
    parroquia:string;

    constructor() {
        this.id=0;
        this.provincia="";
        this.canton="";
        this.parroquia="";
    }
    
}
