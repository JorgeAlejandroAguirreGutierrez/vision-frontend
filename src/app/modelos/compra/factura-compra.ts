import { Proveedor } from './proveedor';
import { FacturaCompraLinea } from './factura-compra-linea';
import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";
import { TipoComprobante } from '../comprobante/tipo-comprobante';
export class FacturaCompra {
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
    proveedor: Proveedor;
    sesion: Sesion;
    tipoComprobante: TipoComprobante;
    facturaCompraLineas: FacturaCompraLinea[];

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
        this.proveedor = new Proveedor();
        this.sesion = new Sesion();
        this.tipoComprobante = new TipoComprobante();
        this.facturaCompraLineas = [];
    }
}
