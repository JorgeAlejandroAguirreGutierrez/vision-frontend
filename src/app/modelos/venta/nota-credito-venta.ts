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
    codigoNumerico: string;
    claveAcceso: string;
    operacion: string;
    fecha: Date;
    fechaAutorizacion: Date;
    estado: string;
    estadoInterno: string;
    estadoSri: string;
    descuento: number;
    subtotal: number;
    subtotalGravado: number;
    subtotalNoGravado: number;
    importeIva: number;
    total: number;
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
        this.descuento = valores.cero;
        this.subtotal = valores.cero;
        this.subtotalGravado = valores.cero;
        this.subtotalNoGravado = valores.cero;
        this.importeIva = valores.cero;
        this.total = valores.cero;
        this.comentario = valores.vacio;
        this.factura = new Factura();
        this.sesion = new Sesion();
        this.tipoComprobante = new TipoComprobante();
        this.notaCreditoVentaLineas = [];
    }
}
