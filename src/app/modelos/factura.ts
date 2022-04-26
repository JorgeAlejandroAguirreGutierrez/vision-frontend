import { Cliente } from '../modelos/cliente';
import { Auxiliar } from '../modelos/auxiliar';
import { Usuario } from '../modelos/usuario';
import { FacturaDetalle } from './factura-detalle';
import { Sesion } from './sesion';

export class Factura {
  id: number;
  codigo: string;
  secuencia: string;
  fecha: Date;
  estado: string;
  eliminado: boolean;

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
  valorDescuentoSubtotal: number=0;
  porcentajeDescuentoSubtotal: number=0;
  valorPorcentajeDescuentoSubtotal: number= 0;
  valorDescuentoTotal: number=0;
  porcentajeDescuentoTotal: number=0;
  valorPorcentajeDescuentoTotal: number= 0;
  //FIN DESCUENTO_GENERAL

  comentario: string;

  cliente: Cliente;
  clienteFactura:Cliente;
  auxiliar: Auxiliar;
  vendedor: Usuario;
  sesion: Sesion;
  facturaDetalles: FacturaDetalle[];
  
  constructor() {
    this.id=0;
    this.secuencia="";
    this.fecha=new Date();
    this.estado="";
    this.eliminado=false;
    this.cliente=new Cliente();
    this.clienteFactura=new Cliente();
    this.auxiliar=null;
    this.vendedor=new Usuario();
    this.facturaDetalles=[];
    this.comentario="";

    this.subtotalSinDescuento=0;
    this.subtotalConDescuento=0;
    this.descuentoTotal=0;
    this.subtotalBase12SinDescuento=0;
    this.subtotalBase0SinDescuento=0;
    this.subtotalBase12ConDescuento=0;
    this.subtotalBase0ConDescuento=0;
    this.ivaSinDescuento=0;
    this.ivaConDescuento=0;
    this.totalSinDescuento=0;
    this.totalConDescuento=0;
  }

  normalizar(){
    if (this.cliente==null) this.cliente=new Cliente();
    if (this.clienteFactura==null) this.clienteFactura=new Cliente();
    if (this.vendedor==null) this.vendedor=new Usuario();
    if (this.sesion==null) this.sesion=new Sesion();
    if (this.facturaDetalles==null) this.facturaDetalles=[];
 }
}
