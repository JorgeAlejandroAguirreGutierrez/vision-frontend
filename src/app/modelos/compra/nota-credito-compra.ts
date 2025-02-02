import { valores } from "../../constantes";
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { NotaCreditoCompraLinea } from './nota-credito-compra-linea';
import { FacturaCompra } from './factura-compra';
import { Empresa } from '../acceso/empresa';
import { Usuario } from '../acceso/usuario';

export class NotaCreditoCompra {
    id: number;
    codigo: string;
    establecimiento: string;
    puntoVenta: string;
    secuencial: string;
    numeroComprobante: string;
    operacion: string;
    fecha: Date;
    estado: string;

    descuentoGravado: number;
    descuentoNoGravado: number;
    subtotal: number;
    subtotalGravado: number;
    subtotalNoGravado: number;
    importeIva: number;
    total: number;

    comentario: string;
    facturaCompra: FacturaCompra;
    usuario: Usuario;
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
        this.estado = valores.vacio;

        this.descuentoGravado = valores.cero;
        this.descuentoNoGravado = valores.cero;
        this.subtotal = valores.cero;
        this.subtotalGravado = valores.cero;
        this.subtotalNoGravado = valores.cero;
        this.importeIva = valores.cero;
        this.total = valores.cero;

        this.comentario = valores.vacio;
        this.facturaCompra = new FacturaCompra();
        this.usuario = new Usuario();
        this.tipoComprobante = new TipoComprobante();
        this.notaCreditoCompraLineas = [];
    }
}