import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";
import { TipoComprobante } from './tipo-comprobante';
import { NotaDebitoVentaLinea } from './nota-debito-venta-linea';
import { Factura } from './factura';
import { NotaDebitoVentaCheque } from '../recaudacion/nota-debito-venta-cheque';
import { NotaDebitoVentaDeposito } from '../recaudacion/nota-debito-venta-deposito';
import { NotaDebitoVentaTransferencia } from '../recaudacion/nota-debito-venta-transferencia';
import { NotaDebitoVentaTarjetaDebito } from '../recaudacion/nota-debito-venta-tarjeta-debito';
import { NotaDebitoVentaTarjetaCredito } from '../recaudacion/nota-debito-venta-tarjeta-credito';
import { NotaDebitoVentaCredito } from '../recaudacion/nota-debito-venta-credito';
export class NotaDebitoVenta {
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
    totalConDescuento: number;
    comentario: string;
    factura: Factura;
    sesion: Sesion;
    tipoComprobante: TipoComprobante;
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
        this.totalConDescuento = valores.cero;
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
        this.depositos =[];
        this.transferencias = [];
        this.tarjetasDebitos = []
        this.tarjetasCreditos = []
        this.credito = new NotaDebitoVentaCredito();
    }
}
