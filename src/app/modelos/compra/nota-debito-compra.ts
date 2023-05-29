import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { FacturaCompra } from './factura-compra';
import { NotaDebitoCompraLinea } from './nota-debito-compra-linea';
export class NotaDebitoCompra {
    id: number;
    codigo: string;
    serie: string;
    secuencial: string;
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
    facturaCompra: FacturaCompra;
    sesion: Sesion;
    tipoComprobante: TipoComprobante;
    notaDebitoCompraLineas: NotaDebitoCompraLinea[];

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.secuencial = valores.vacio;
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
        this.facturaCompra = new FacturaCompra();
        this.sesion = new Sesion();
        this.tipoComprobante = new TipoComprobante();
        this.notaDebitoCompraLineas = [];
    }
}
