import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";
import { TipoComprobante } from './tipo-comprobante';
import { NotaDebitoVentaLinea } from './nota-debito-venta-linea';
import { Factura } from './factura';
import { Bodega } from '../inventario/bodega';
export class NotaDebitoVenta {
    id: number;
    codigo: string;
    secuencia: string;
    fecha: Date;
    estado: string;
    valorDescuentoTotal: number;
    porcentajeDescuentoTotal: number;
    subtotalSinDescuento: number;
    descuentoTotal: number;
    subtotalBase12SinDescuento: number;
    subtotalBase0SinDescuento: number;
    ivaSinDescuento: number;
    totalSinDescuento: number;
    comentario: string;
    factura: Factura;
    sesion: Sesion;
    tipoComprobante: TipoComprobante;
    notaDebitoVentaLineas: NotaDebitoVentaLinea[];

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.secuencia = valores.vacio;
        this.fecha = new Date();
        this.estado = valores.noFacturada;
        this.valorDescuentoTotal = valores.cero;
        this.porcentajeDescuentoTotal = valores.cero;
        this.subtotalSinDescuento = valores.cero;
        this.descuentoTotal = valores.cero;
        this.subtotalBase12SinDescuento = valores.cero;
        this.subtotalBase0SinDescuento = valores.cero;
        this.ivaSinDescuento = valores.cero;
        this.totalSinDescuento = valores.cero;
        this.comentario = valores.vacio;
        this.factura = new Factura();
        this.sesion = new Sesion();
        this.tipoComprobante = new TipoComprobante();
        this.notaDebitoVentaLineas = [];
    }
}
