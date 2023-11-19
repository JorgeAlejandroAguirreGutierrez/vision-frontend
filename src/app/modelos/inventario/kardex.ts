import { Producto } from './producto';
import { valores } from "../../constantes";
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { TipoOperacion } from './tipo-operacion';
import { Bodega } from './bodega';

export class Kardex {
    id: number;
    codigo: string;
    fecha: Date;
    referencia: string;
    idLinea: number;
    entrada: number;
    salida: number;
    saldo: number;
    debe: number;
    haber: number;
    costoPromedio: number;
    costoTotal: number;
    estado: string;
    tipoComprobante: TipoComprobante;
    tipoOperacion: TipoOperacion;
    bodega: Bodega;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fecha = new Date();
        this.referencia = valores.vacio;
        this.idLinea = valores.cero;
        this.entrada = valores.cero;
        this.salida = valores.cero;
        this.saldo = valores.cero;
        this.debe = valores.cero;
        this.haber = valores.cero;
        this.costoPromedio = valores.cero;
        this.costoTotal = valores.cero;
        this.estado = valores.estadoActivo;
        this.tipoComprobante = new TipoComprobante();
        this.tipoOperacion = new TipoOperacion();
        this.bodega = new Bodega();
    }
    
}
