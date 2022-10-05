import { Bodega } from './bodega';
import { FacturaDetalle } from '../comprobante/factura-detalle';
import { valores } from "../../constantes";
export class Caracteristica {
  id: number;
  codigo: string;
  descripcion: string;
  color: string;
  marca: string;
  modelo: string;
  serie: string;
  seleccionado: boolean;
  bodega: Bodega;
  facturaDetalle: FacturaDetalle;
  constructor() {
    this.id=valores.cero;
    this.codigo=valores.vacio;
    this.descripcion=valores.vacio;
    this.color=valores.vacio;
    this.marca=valores.vacio;
    this.modelo=valores.vacio;
    this.serie=valores.vacio;
    this.seleccionado=false;
    this.bodega=new Bodega();
    this.facturaDetalle=new FacturaDetalle();
  }
}
