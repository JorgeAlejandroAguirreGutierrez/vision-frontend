import { valores } from "../../constantes";
import { Sesion } from '../usuario/sesion';
import { Cliente } from '../cliente/cliente';
import { FacturaDetalle } from './factura-detalle';

export class NotaCreditoVenta {
    id: number;
    codigo: string;
    secuencia: string;
    fecha: Date;
    estado: string;
  
    subtotalSinDescuento: number;
    subtotalConDescuento: number;
    descuentoTotal: number;
    subtotalBase12SinDescuento: number;
    subtotalBase0SinDescuento: number;
    subtotalBase12ConDescuento: number;
    subtotalBase0ConDescuento: number;
    ivaSinDescuento: number;
    ivaConDescuento: number;
    totalSinDescuento: number;
    totalConDescuento: number;
  
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
    facturaDetalles: FacturaDetalle[];
    
    constructor() {
      this.id=valores.cero;
      this.secuencia=valores.vacio;
      this.fecha=new Date();
      this.estado=valores.noFacturada;
      this.cliente=new Cliente();
      this.facturaDetalles=[];
      this.comentario=valores.vacio;
      this.sesion=new Sesion();
  
      this.subtotalSinDescuento=valores.cero;
      this.subtotalConDescuento=valores.cero;
      this.descuentoTotal=valores.cero;
      this.subtotalBase12SinDescuento=valores.cero;
      this.subtotalBase0SinDescuento=valores.cero;
      this.subtotalBase12ConDescuento=valores.cero;
      this.subtotalBase0ConDescuento=valores.cero;
      this.ivaSinDescuento=valores.cero;
      this.ivaConDescuento=valores.cero;
      this.totalSinDescuento=valores.cero;
      this.totalConDescuento=valores.cero;
  
      this.valorDescuentoSubtotal = valores.cero;
      this.porcentajeDescuentoSubtotal = valores.cero;
      this.valorPorcentajeDescuentoSubtotal = valores.cero;
      this.valorDescuentoTotal = valores.cero;
      this.porcentajeDescuentoTotal = valores.cero;
      this.valorPorcentajeDescuentoTotal = valores.cero;
    }
}