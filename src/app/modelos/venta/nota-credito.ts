import { valores } from "../../constantes";
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { NotaCreditoLinea } from './nota-credito-linea';
import { Factura } from './factura';
import { Empresa } from '../acceso/empresa';
import { Usuario } from '../acceso/usuario';

export class NotaCredito {
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
    procesoSRI: string;
    valorDescuento: number;
    porcentajeDescuento: number;
    subtotal: number;
    subtotalGravado: number;
    subtotalNoGravado: number;
    importeIva: number;
    total: number;
    comentario: string;
    factura: Factura;
    usuario: Usuario;
    tipoComprobante: TipoComprobante;
    empresa: Empresa;
    notaCreditoLineas: NotaCreditoLinea[];

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.establecimiento = valores.vacio;
        this.puntoVenta = valores.vacio;
        this.secuencial = valores.vacio;
        this.numeroComprobante = valores.vacio;
        this.operacion = valores.vacio;
        this.fecha = null;
        this.estado = valores.vacio;
        this.procesoSRI = valores.vacio;
        this.valorDescuento = valores.cero;
        this.porcentajeDescuento = valores.cero;
        this.subtotal = valores.cero;
        this.subtotalGravado = valores.cero;
        this.subtotalNoGravado = valores.cero;
        this.importeIva = valores.cero;
        this.total = valores.cero;
        this.comentario = valores.vacio;
        this.factura = new Factura();
        this.usuario = new Usuario();
        this.tipoComprobante = new TipoComprobante();
        this.notaCreditoLineas = [];
    }
}