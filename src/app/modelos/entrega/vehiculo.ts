import { valores } from "../../constantes";
import { Empresa } from "../usuario/empresa";

export class Vehiculo {
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
    estado: string;
    empresa: Empresa;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.modelo = valores.vacio;
        this.placa = valores.vacio;
        this.marca = valores.vacio;
        this.cilindraje = valores.vacio;
        this.clase = valores.vacio;
        this.color = valores.vacio;
        this.fabricacion = valores.vacio;
        this.numero = valores.vacio;
        this.estado = valores.estadoActivo;
    }
}
