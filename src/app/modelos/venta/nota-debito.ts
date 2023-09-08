import { valores } from "../../constantes";
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { NotaDebitoLinea } from './nota-debito-linea';
import { Factura } from './factura';
import { NDCheque } from '../recaudacion/nd-cheque';
import { NDDeposito } from '../recaudacion/nd-deposito';
import { NDTransferencia } from '../recaudacion/nd-transferencia';
import { NDTarjetaDebito } from '../recaudacion/nd-tarjeta-debito';
import { NDTarjetaCredito } from '../recaudacion/nd-tarjeta-credito';
import { NDCredito } from '../recaudacion/nd-credito';
import { Empresa } from '../usuario/empresa';
import { Usuario } from '../usuario/usuario';

export class NotaDebito {
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
    estado: string;
    procesoSRI: string;
    descuento: number;
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
    notaDebitoLineas: NotaDebitoLinea[];
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
    cheques: NDCheque[];
    depositos: NDDeposito[];
    transferencias: NDTransferencia[];
    tarjetasDebitos: NDTarjetaDebito[];
    tarjetasCreditos: NDTarjetaCredito[];
    credito: NDCredito;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.establecimiento = valores.vacio;
        this.puntoVenta = valores.vacio;
        this.secuencial = valores.vacio;
        this.numeroComprobante = valores.vacio;
        this.fecha = new Date();
        this.estado = valores.vacio;
        this.procesoSRI = valores.vacio;
        this.descuento = valores.cero;
        this.subtotal = valores.cero;
        this.subtotalGravado = valores.cero;
        this.subtotalNoGravado = valores.cero;
        this.importeIva = valores.cero;
        this.total = valores.cero;
        this.comentario = valores.vacio;
        this.factura = new Factura();
        this.usuario = new Usuario();
        this.tipoComprobante = new TipoComprobante();
        this.notaDebitoLineas = [];
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
        this.credito = new NDCredito();
    }
}