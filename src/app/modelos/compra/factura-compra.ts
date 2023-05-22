import { Proveedor } from './proveedor';
import { FacturaCompraLinea } from './factura-compra-linea';
import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";
import { TipoComprobante } from '../venta/tipo-comprobante';
export class FacturaCompra {
    id: number;
    codigo: string;
    serie: string;
    secuencial: string;
    fecha: Date;
    estado: string;
    valorDistribuidoTotal: number;
    valorDescuentoTotal: number;
    porcentajeDescuentoTotal: number;
    valorPorcentajeDescuentoTotal: number;
    subtotalSinDescuento: number;
    descuentoTotal: number;
    subtotalGrabadoConDescuento: number;
    subtotalNoGrabadoConDescuento: number;
    importeIvaTotal: number;
    valorTotal: number;
    comentario: string;
    proveedor: Proveedor;
    sesion: Sesion;
    tipoComprobante: TipoComprobante;
    facturaCompraLineas: FacturaCompraLinea[];

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.secuencial = valores.vacio;
        this.fecha = new Date();
        this.estado = valores.activo;
        this.valorDistribuidoTotal = valores.cero;
        this.valorDescuentoTotal = valores.cero;
        this.porcentajeDescuentoTotal = valores.cero;
        this.valorPorcentajeDescuentoTotal = valores.cero;
        this.subtotalSinDescuento = valores.cero;
        this.descuentoTotal = valores.cero;
        this.subtotalGrabadoConDescuento = valores.cero;
        this.subtotalNoGrabadoConDescuento = valores.cero;
        this.importeIvaTotal = valores.cero;
        this.valorTotal = valores.cero;
        this.comentario = valores.vacio;
        this.proveedor = new Proveedor();
        this.sesion = new Sesion();
        this.tipoComprobante = new TipoComprobante();
        this.facturaCompraLineas = [];
    }
}
