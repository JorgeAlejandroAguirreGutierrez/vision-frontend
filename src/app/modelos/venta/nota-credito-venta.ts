import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";
import { TipoComprobante } from './tipo-comprobante';
import { NotaCreditoVentaLinea } from './nota-credito-venta-linea';
import { Factura } from './factura';
export class NotaCreditoVenta {
    id: number;
    codigo: string;
    secuencial: string;
    operacion: string;
    fecha: Date;
    estado: string;
    subtotalSinDescuento: number;
    descuentoTotal: number;
    subtotalBase12SinDescuento: number;
    subtotalBase0SinDescuento: number;
    ivaSinDescuento: number;
    totalSinDescuento: number;
    totalConDescuento: number;
    comentario: string;
    factura: Factura;
    sesion: Sesion;
    tipoComprobante: TipoComprobante;
    notaCreditoVentaLineas: NotaCreditoVentaLinea[];

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.secuencial = valores.vacio;
        this.operacion = valores.vacio;
        this.fecha = new Date();
        this.estado = valores.noFacturada;
        this.subtotalSinDescuento = valores.cero;
        this.descuentoTotal = valores.cero;
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
