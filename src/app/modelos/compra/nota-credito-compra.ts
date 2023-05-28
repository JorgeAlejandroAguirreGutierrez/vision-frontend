import { Proveedor } from './proveedor';
import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { NotaCreditoCompraLinea } from './nota-credito-compra-linea';
import { FacturaCompra } from './factura-compra';
import { Bodega } from '../inventario/bodega';
export class NotaCreditoCompra {
    id: number;
    codigo: string;
    serie: string;
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
    facturaCompra: FacturaCompra;
    sesion: Sesion;
    tipoComprobante: TipoComprobante;
    notaCreditoCompraLineas: NotaCreditoCompraLinea[];

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
        this.comentario = valores.vacio;
        this.facturaCompra = new FacturaCompra();
        this.sesion = new Sesion();
        this.tipoComprobante = new TipoComprobante();
        this.notaCreditoCompraLineas = [];
    }
}
