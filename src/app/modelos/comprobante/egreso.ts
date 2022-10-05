import { Cliente } from '../cliente/cliente';
import { Usuario } from '../usuario/usuario';
import { valores } from "../../constantes";

export class Egreso {
  id: number;
  codigo: string;
  numeroInterno: string;
  fecha: Date;
  fechaEntrega: Date;
  estado: string;
  subtotal: number;
  subdescuento: number;
  baseIva: number;
  base0: number;
  importeIva: number;
  total: number;
  descuentoPorcentaje: number;
  descuento: number;
  abono: number;
  comentario: string;
  cliente: Cliente;
  vendedor: Usuario;

  constructor() {
    this.codigo = valores.vacio;
    this.numeroInterno = valores.vacio;
    this.fecha = new Date();
    this.fechaEntrega = new Date();
    this.estado = valores.activo;
    this.subtotal = valores.cero;
    this.subdescuento = valores.cero;
    this.baseIva = valores.cero;
    this.base0 = valores.cero;
    this.importeIva = valores.cero;
    this.total = valores.cero;
    this.descuentoPorcentaje = valores.cero;
    this.descuento = valores.cero;
    this.abono = valores.cero;
    this.comentario = valores.vacio;
    this.cliente=new Cliente();
    this.vendedor=new Usuario();
  }
}
