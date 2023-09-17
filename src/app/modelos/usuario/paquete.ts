import { valores } from "../../constantes";

export class Paquete {
    id: number;
    codigo: string;
    nombre: string;
    minimo: number;
    maximo: number;
    valorTotal: number;
    valorAnual: number;
    valorMinimo: number;
    valorMaximo: number;
    valorPuestaInicial: number;
    comision: number;
    cantidadUsuarioRecaudacion: number;
    cantidadUsuarioGerente: number;
    cantidadUsuarioAdministrador: number;
    descripcionPromocion: string;
    valorPromocion: number;
    tipo: string;
    estado: string;
    
    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.nombre = valores.vacio;
        this.minimo = valores.cero;
        this.maximo = valores.cero;
        this.valorTotal = valores.cero;
        this.valorAnual = valores.cero;
        this.valorMinimo = valores.cero;
        this.valorMaximo = valores.cero;
        this.valorPuestaInicial = valores.cero;
        this.comision = valores.cero;
        this.cantidadUsuarioRecaudacion = valores.cero;
        this.cantidadUsuarioGerente = valores.cero;
        this.cantidadUsuarioAdministrador = valores.cero;
        this.descripcionPromocion = valores.vacio;
        this.valorPromocion = valores.cero;
        this.tipo = valores.vacio;
        this.estado = valores.estadoActivo;
    }
}
