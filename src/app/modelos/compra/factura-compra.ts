import { Proveedor } from './proveedor';
import { FacturaCompraLinea } from './factura-compra-linea';
import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { Empresa } from '../usuario/empresa';

export class FacturaCompra {
    id: number;
    codigo: string;
    establecimiento: string;
    puntoVenta: string;
    secuencial: string;
    numeroComprobante: string;
    fecha: Date;
    estado: string;

    subtotal: number;
    descuento: number;
    subtotalGravadoConDescuento: number;
    subtotalNoGravadoConDescuento: number;
    importeIvaTotal: number;
    total: number;

    valorDistribuidoTotal: number;
    valorDescuentoTotal: number;
    porcentajeDescuentoTotal: number;
    valorPorcentajeDescuentoTotal: number;

    comentario: string;
    proveedor: Proveedor;
    sesion: Sesion;
    tipoComprobante: TipoComprobante;
    empresa: Empresa;
    facturaCompraLineas: FacturaCompraLinea[];

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.establecimiento = valores.vacio;
        this.puntoVenta = valores.vacio;
        this.secuencial = valores.vacio;
        this.numeroComprobante = valores.vacio;
        this.fecha = new Date();
        this.estado = valores.estadoPorPagar;

        this.subtotal = valores.cero;
        this.descuento = valores.cero;
        this.subtotalGravadoConDescuento = valores.cero;
        this.subtotalNoGravadoConDescuento = valores.cero;
        this.importeIvaTotal = valores.cero;
        this.total = valores.cero;

        this.valorDistribuidoTotal = valores.cero;
        this.valorDescuentoTotal = valores.cero;
        this.porcentajeDescuentoTotal = valores.cero;
        this.valorPorcentajeDescuentoTotal = valores.cero;
        
        this.comentario = valores.vacio;
        this.proveedor = new Proveedor();
        this.sesion = new Sesion();
        this.tipoComprobante = new TipoComprobante();
        this.facturaCompraLineas = [];
    }
}