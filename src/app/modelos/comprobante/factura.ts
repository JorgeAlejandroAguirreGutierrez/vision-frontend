import { Cliente } from '../cliente/cliente';
import { Dependiente } from '../cliente/dependiente';
import { Usuario } from '../usuario/usuario';
import { FacturaDetalle } from './factura-detalle';
import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";

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
  dependiente: Dependiente;
  vendedor: Usuario;
  sesion: Sesion;
  facturaDetalles: FacturaDetalle[];
  
  constructor() {
    this.id=valores.cero;
    this.secuencia=valores.vacio;
    this.fecha=new Date();
    this.estado=valores.activo;
    this.eliminado=false;
    this.cliente=new Cliente();
    this.clienteFactura=new Cliente();
    this.dependiente=null;
    this.vendedor=new Usuario();
    this.facturaDetalles=[];
    this.comentario=valores.vacio;

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
  }

  normalizar(){
    if (this.cliente==null) this.cliente=new Cliente();
    if (this.clienteFactura==null) this.clienteFactura=new Cliente();
    if (this.vendedor==null) this.vendedor=new Usuario();
    if (this.sesion==null) this.sesion=new Sesion();
    if (this.facturaDetalles==null) this.facturaDetalles=[];
 }
}
