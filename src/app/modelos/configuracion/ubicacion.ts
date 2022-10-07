import { valores } from "../../constantes";
export class Ubicacion {
    id: number;
    codigo: string;
    codigoNorma: string;
    provincia: string;
    canton: string;
    parroquia: string;

    constructor() {
        this.id = valores.cero;
        this.provincia = valores.vacio;
        this.canton = valores.vacio;
        this.parroquia = valores.vacio;
    }
    
}
