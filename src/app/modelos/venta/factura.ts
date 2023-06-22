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

export class Factura {
  id: number;
  codigo: string;
  serie: string;
  secuencial: string;
  codigoNumerico: String;
  fecha: Date;
  claveAcceso: String;
  estado: string;

  subtotalSinDescuento: number;
  subtotalConDescuento: number;
  descuentoTotal: number;
  subtotalGrabadoConDescuento: number;
  subtotalNoGrabadoConDescuento: number;
  importeIvaTotal: number;
  valorTotal: number;

  //DESCUENTO_GENERAL
  valorDescuentoSubtotal: number;
  porcentajeDescuentoSubtotal: number;
  valorPorcentajeDescuentoSubtotal: number;
  valorDescuentoTotal: number;
  porcentajeDescuentoTotal: number;
  valorPorcentajeDescuentoTotal: number;
  //FIN DESCUENTO_GENERAL

  comentario: string;
  cliente: Cliente;
  sesion: Sesion;
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
    this.serie = valores.vacio;
    this.secuencial = valores.vacio;
    this.codigoNumerico = valores.vacio;
    this.claveAcceso = valores.vacio;
    this.fecha = new Date();
    this.estado = valores.noFacturada;

    this.cliente = new Cliente();
    this.facturaLineas = [];
    this.comentario = valores.vacio;
    this.sesion = new Sesion();

    this.subtotalSinDescuento = valores.cero;
    this.subtotalConDescuento = valores.cero;
    this.descuentoTotal = valores.cero;
    this.subtotalGrabadoConDescuento = valores.cero;
    this.subtotalNoGrabadoConDescuento = valores.cero;
    this.importeIvaTotal = valores.cero;
    this.valorTotal = valores.cero;

    this.valorDescuentoSubtotal = valores.cero;
    this.porcentajeDescuentoSubtotal = valores.cero;
    this.valorPorcentajeDescuentoSubtotal = valores.cero;
    this.valorDescuentoTotal = valores.cero;
    this.porcentajeDescuentoTotal = valores.cero;
    this.valorPorcentajeDescuentoTotal = valores.cero;

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
