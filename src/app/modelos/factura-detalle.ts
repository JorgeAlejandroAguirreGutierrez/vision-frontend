import { Factura } from './factura';
import { Precio } from './precio';
import { Caracteristica } from './caracteristica';
import { Producto } from './producto';
import { Bodega } from './bodega';
import { Impuesto } from './impuesto';

export class FacturaDetalle {
  id: number;
  posicion: number;
  comentario: string;
  entregado: boolean;
  consignacion: number;
  cantidad: number;
  subsidio: number;
  sinSubsidio: number;
  valorDescuentoLinea: number;
  porcentajeDescuentoLinea: number;
  valorPorcentajeDescuentoLinea: number;
  valorDescuentoTotalLinea: number;
  porcentajeDescuentoTotalLinea: number;
  valorPorcentajeDescuentoTotalLinea: number;
  totalDescuentoLinea: number;
  porcentajeIvaLinea: number;
  subtotalSinDescuentoLinea: number;
  ivaSinDescuentoLinea: number;
  subtotalConDescuentoLinea: number;
  ivaConDescuentoLinea: number;
  totalConDescuentoLinea: number;
  factura: Factura;
  //CARACTERISTICAS SELECCIONADAS
  caracteristicas: Caracteristica[];
  //PRECIO SELECCIONADO
  precio: Precio;
  //PRODUCTO SELECCIONADO
  producto: Producto;
  //IMPUESTO SELECCIONADO
  impuesto: Impuesto;
  //BODEGA SELECCIONADO
  bodega: Bodega;

  

  constructor() {
    this.id=0;
    this.posicion=-1;
    this.entregado=false;
    this.comentario="";
    this.cantidad=0;
    this.subsidio=0;
    this.sinSubsidio=0;
    this.valorDescuentoLinea=0;
    this.porcentajeDescuentoLinea=0;
    this.valorPorcentajeDescuentoLinea=0;
    this.valorDescuentoTotalLinea=0;
    this.porcentajeDescuentoTotalLinea=0;
    this.valorPorcentajeDescuentoTotalLinea=0;
    this.totalDescuentoLinea=0;
    this.porcentajeIvaLinea=0;
    this.subtotalSinDescuentoLinea=0;
    this.ivaSinDescuentoLinea=0;
    this.subtotalConDescuentoLinea=0;
    this.ivaConDescuentoLinea=0;
    this.totalConDescuentoLinea=0;
    this.producto=new Producto();
    this.precio=new Precio();
    this.impuesto=new Impuesto();
    this.bodega=new Bodega();
    this.caracteristicas=[];
  }
}
