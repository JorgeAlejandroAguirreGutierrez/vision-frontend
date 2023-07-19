import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { NotaCreditoCompraLinea } from './nota-credito-compra-linea';
import { FacturaCompra } from './factura-compra';
import { Empresa } from '../usuario/empresa';

export class NotaCreditoCompra {
    id: number;
    codigo: string;
    establecimiento: string;
    puntoVenta: string;
    secuencial: string;
    numeroComprobante: string;
    operacion: string;
    fecha: Date;
    estadoInterno: string;
    estado: string;

    descuento: number;
    subtotal: number;
    subtotalGrabado: number;
    subtotalNoGrabado: number;
    importeIvaTotal: number;
    valorTotal: number;

    comentario: string;
    facturaCompra: FacturaCompra;
    sesion: Sesion;
    tipoComprobante: TipoComprobante;
    empresa: Empresa;
    notaCreditoCompraLineas: NotaCreditoCompraLinea[];

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

        this.descuento = valores.cero;
        this.subtotal = valores.cero;
        this.subtotalGrabado = valores.cero;
        this.subtotalNoGrabado = valores.cero;
        this.importeIvaTotal = valores.cero;
        this.valorTotal = valores.cero;

        this.comentario = valores.vacio;
        this.facturaCompra = new FacturaCompra();
        this.sesion = new Sesion();
        this.tipoComprobante = new TipoComprobante();
        this.notaCreditoCompraLineas = [];
    }
}
