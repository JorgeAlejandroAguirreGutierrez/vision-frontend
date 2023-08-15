import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { NotaDebitoVentaLinea } from './nota-debito-venta-linea';
import { Factura } from './factura';
import { NotaDebitoVentaCheque } from '../recaudacion/nota-debito-venta-cheque';
import { NotaDebitoVentaDeposito } from '../recaudacion/nota-debito-venta-deposito';
import { NotaDebitoVentaTransferencia } from '../recaudacion/nota-debito-venta-transferencia';
import { NotaDebitoVentaTarjetaDebito } from '../recaudacion/nota-debito-venta-tarjeta-debito';
import { NotaDebitoVentaTarjetaCredito } from '../recaudacion/nota-debito-venta-tarjeta-credito';
import { NotaDebitoVentaCredito } from '../recaudacion/nota-debito-venta-credito';
import { Empresa } from '../usuario/empresa';

export class NotaDebitoVenta {
    id: number;
    codigo: string;
    establecimiento: string;
    puntoVenta: string;
    secuencial: string;
    numeroComprobante: string;
    codigoNumerico: string;
    claveAcceso: string;
    fecha: Date;
    fechaAutorizacion: Date;
    estadoInterno: string;
    estado: string;
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
    notaDebitoVentaLineas: NotaDebitoVentaLinea[];
    //RECAUDACION
    totalRecaudacion: number;
    porPagar: number;
    efectivo: number;
    cambio: number;
    totalCheques: number;
    totalDepositos: number;
    totalTransferencias: number;
    totalTarjetasDebitos: number;
    totalTarjetasCreditos: number;
    totalCredito: number;
    cheques: NotaDebitoVentaCheque[];
    depositos: NotaDebitoVentaDeposito[];
    transferencias: NotaDebitoVentaTransferencia[];
    tarjetasDebitos: NotaDebitoVentaTarjetaDebito[];
    tarjetasCreditos: NotaDebitoVentaTarjetaCredito[];
    credito: NotaDebitoVentaCredito;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.establecimiento = valores.vacio;
        this.puntoVenta = valores.vacio;
        this.secuencial = valores.vacio;
        this.numeroComprobante = valores.vacio;
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
        this.notaDebitoVentaLineas = [];
        //RECAUDACION
        this.totalRecaudacion = valores.cero;
        this.efectivo = valores.cero;
        this.cambio = valores.cero;
        this.totalCheques = valores.cero;
        this.totalDepositos = valores.cero;
        this.totalTransferencias = valores.cero;
        this.totalTarjetasDebitos = valores.cero;
        this.totalTarjetasCreditos = valores.cero;
        this.totalCredito = valores.cero;
        this.cheques = [];
        this.depositos = [];
        this.transferencias = [];
        this.tarjetasDebitos = []
        this.tarjetasCreditos = []
        this.credito = new NotaDebitoVentaCredito();
    }
}
