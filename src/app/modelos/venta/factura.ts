import { Cliente } from '../cliente/cliente';
import { FacturaLinea } from './factura-linea';
import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";
import { Cheque } from '../recaudacion/cheque';
import { Deposito } from '../recaudacion/deposito';
import { Transferencia } from '../recaudacion/transferencia';
import { TarjetaDebito } from '../recaudacion/tarjeta-debito';
import { TarjetaCredito } from '../recaudacion/tarjeta-credito';
import { Credito } from '../recaudacion/credito';
import { Empresa } from '../usuario/empresa';
import { TipoComprobante } from '../configuracion/tipo-comprobante';

export class Factura {
  id: number;
  codigo: string;
  establecimiento: string;
  puntoVenta: string;
  secuencial: string;
  numeroComprobante: string;
  codigoNumerico: String;
  fecha: Date;
  claveAcceso: String;
  fechaAutorizacion: Date;
  estadoInterno: string;
  estado: string;
  estadoSri: string;

  subtotal: number;
  descuentoTotal: number;
  subtotalGravadoConDescuento: number;
  subtotalNoGravadoConDescuento: number;
  importeIvaTotal: number;
  valorTotal: number;

  comentario: string;
  cliente: Cliente;
  sesion: Sesion;
  tipoComprobante: TipoComprobante;
  empresa: Empresa;
  facturaLineas: FacturaLinea[];

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
  cheques: Cheque[];
  depositos: Deposito[];
  transferencias: Transferencia[];
  tarjetasDebitos: TarjetaDebito[];
  tarjetasCreditos: TarjetaCredito[];
  credito: Credito;
  
  constructor() {
    this.id = valores.cero;
    this.codigo = valores.vacio;
    this.establecimiento = valores.vacio;
    this.puntoVenta = valores.vacio;
    this.secuencial = valores.vacio;
    this.numeroComprobante = valores.vacio;
    this.codigoNumerico = valores.vacio;
    this.claveAcceso = valores.vacio;
    this.fecha = new Date();
    this.estado = valores.estadoActivo;
    this.estadoInterno = valores.vacio;
    this.estadoSri = valores.vacio;

    this.cliente = new Cliente();
    this.facturaLineas = [];
    this.comentario = valores.vacio;
    this.sesion = new Sesion();

    this.subtotal = valores.cero;
    this.descuentoTotal = valores.cero;
    this.subtotalGravadoConDescuento = valores.cero;
    this.subtotalNoGravadoConDescuento = valores.cero;
    this.importeIvaTotal = valores.cero;
    this.valorTotal = valores.cero;

    //RECAUDACION
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
    this.credito = new Credito();
  }
}
