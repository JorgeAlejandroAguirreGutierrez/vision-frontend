import { Producto } from './producto';
import { valores } from "../../constantes";
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { TipoOperacion } from './tipo-operacion';
import { Bodega } from './bodega';

export class Kardex {
    id: number;
    codigo: string;
    fecha: Date;
    //operacion: string;
    referencia: string;
    entrada: number;
    salida: number;
    saldo: number;
    debe: number;
    haber: number;
    costoPromedio: number;
    costoTotal: number;
    tipoComprobante: TipoComprobante;
    tipoOperacion: TipoOperacion;
    bodega: Bodega;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fecha = new Date();
        //this.documento = valores.vacio;
        //this.operacion = valores.vacio;
        this.referencia = valores.vacio;
        this.entrada = valores.cero;
        this.salida = valores.cero;
        this.saldo = valores.cero;
        this.costoPromedio = valores.cero;
        this.costoTotal =valores.cero;
        this.debe = valores.cero;
        this.haber = valores.cero;
        this.tipoComprobante = new TipoComprobante();
        this.tipoOperacion = new TipoOperacion();
        this.bodega = new Bodega();
    }
    
}
