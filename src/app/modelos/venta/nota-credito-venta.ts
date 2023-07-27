import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { NotaCreditoVentaLinea } from './nota-credito-venta-linea';
import { Factura } from './factura';
import { Empresa } from '../usuario/empresa';

export class NotaCreditoVenta {
    id: number;
    codigo: string;
    establecimiento: string;
    puntoVenta: string;
    secuencial: string;
    numeroComprobante: string;
    operacion: string;
    fecha: Date;
    estado: string;
    estadoInterno: string;
    estadoSri: string;
    subtotalSinDescuento: number;
    descuento: number;
    subtotalBase12SinDescuento: number;
    subtotalBase0SinDescuento: number;
    ivaSinDescuento: number;
    totalSinDescuento: number;
    totalConDescuento: number;
    comentario: string;
    factura: Factura;
    sesion: Sesion;
    tipoComprobante: TipoComprobante;
    empresa: Empresa;
    notaCreditoVentaLineas: NotaCreditoVentaLinea[];

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.establecimiento = valores.vacio;
        this.puntoVenta = valores.vacio;
        this.secuencial = valores.vacio;
        this.numeroComprobante = valores.vacio;
        this.operacion = valores.vacio;
        this.fecha = new Date();
        this.estado = valores.estadoActivo;
        this.estadoInterno = valores.vacio;
        this.estadoSri = valores.vacio;
        this.subtotalSinDescuento = valores.cero;
        this.descuento = valores.cero;
        this.subtotalBase12SinDescuento = valores.cero;
        this.subtotalBase0SinDescuento = valores.cero;
        this.ivaSinDescuento = valores.cero;
        this.totalSinDescuento = valores.cero;
        this.totalConDescuento = valores.cero;
        this.comentario = valores.vacio;
        this.factura = new Factura();
        this.sesion = new Sesion();
        this.tipoComprobante = new TipoComprobante();
        this.notaCreditoVentaLineas = [];
    }
}
