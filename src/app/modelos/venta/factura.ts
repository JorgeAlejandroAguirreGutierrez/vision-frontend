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
  estado: string;
  estadoSRI: string;

  valorDescuentoTotal: number;
  porcentajeDescuentoTotal: number;
  valorPorcentajeDescuentoTotal: number;
  valorDescuentoSubtotal: number;
  porcentajeDescuentoSubtotal: number;
  valorPorcentajeDescuentoSubtotal: number;

  subtotal: number;
  descuento: number;
  subtotalGravado: number;
  subtotalNoGravado: number;
  importeIva: number;
  total: number;

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
    this.estado = valores.estadoEmitida;
    this.estadoSRI = valores.vacio;

    this.valorDescuentoTotal = valores.cero;
    this.porcentajeDescuentoTotal = valores.cero;
    this.valorPorcentajeDescuentoTotal = valores.cero;
    this.valorDescuentoSubtotal = valores.cero;
    this.porcentajeDescuentoSubtotal = valores.cero;
    this.valorPorcentajeDescuentoSubtotal = valores.cero;

    this.subtotal = valores.cero;
    this.descuento = valores.cero;
    this.subtotalGravado = valores.cero;
    this.subtotalNoGravado = valores.cero;
    this.importeIva = valores.cero;
    this.total = valores.cero;

    this.comentario = valores.vacio;

    this.cliente = new Cliente();
    this.sesion = new Sesion();
    this.empresa = new Empresa();
    this.facturaLineas = [];
    

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