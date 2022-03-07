export class VehiculoTransporte {
    id:number;
    codigo:string;
    modelo:string;
    placa:string;
    marca:string;
    cilindraje:string;
    clase:string;
    color:string;
    fabricacion:string;
    numero:string;
    activo:boolean;

    constructor(){
        this.id=0;
        this.codigo="";
        this.modelo="";
        this.placa="";
        this.marca="";
        this.cilindraje="";
        this.clase="";
        this.color="";
        this.fabricacion="";
        this.numero="";
        this.activo=false;
    }

}
