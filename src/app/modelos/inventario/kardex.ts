import { Producto } from './producto';
import { valores } from "../../constantes";
import { Bodega } from './bodega';
import { Medida } from './medida';
export class Kardex {
    id: number;
    codigo: string;
    fecha: Date;
    documento: string;
    numero: string;
    operacion: string;
    entrada: number;
    salida: number;
    debe: number;
    haber: number;
    cantidad: number;
    costoUnitario: number;
    costoTotal: number;
    producto: Producto;
    bodega: Bodega;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fecha = new Date();
        this.documento = valores.vacio;
        this.numero = valores.vacio;
        this.operacion = valores.vacio;
        this.entrada = valores.cero;
        this.salida = valores.cero;
        this.costoUnitario = valores.cero;
        this.costoTotal =valores.cero;
        this.debe = valores.cero;
        this.haber = valores.cero;
        this.cantidad = valores.cero;
        this.bodega = new Bodega();
    }
    
}
