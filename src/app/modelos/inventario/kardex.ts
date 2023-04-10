import { Producto } from './producto';
import { valores } from "../../constantes";
import { Bodega } from './bodega';

export class Kardex {
    id: number;
    codigo: string;
    fecha: Date;
    documento: string;
    operacion: string;
    secuencial: string;
    entrada: number;
    salida: number;
    saldo: number;
    debe: number;
    haber: number;
    costoUnitario: number;
    costoTotal: number;
    bodega: Bodega;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fecha = new Date();
        this.documento = valores.vacio;
        this.operacion = valores.vacio;
        this.secuencial = valores.vacio;
        this.entrada = valores.cero;
        this.salida = valores.cero;
        this.saldo = valores.cero;
        this.costoUnitario = valores.cero;
        this.costoTotal =valores.cero;
        this.debe = valores.cero;
        this.haber = valores.cero;
        this.bodega = new Bodega();
    }
    
}
