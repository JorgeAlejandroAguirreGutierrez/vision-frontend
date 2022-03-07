import { Cliente } from '../modelos/cliente';
import { Usuario } from '../modelos/usuario';

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
    this.codigo="";
    this.numeroInterno="";
    this.fecha=new Date();
    this.fechaEntrega=new Date();
    this.estado="";
    this.subtotal=0;
    this.subdescuento=0;
    this.baseIva=0;
    this.base0=0;
    this.importeIva=0;
    this.total=0;
    this.descuentoPorcentaje=0;
    this.descuento=0;
    this.abono=0;
    this.comentario="";
    this.cliente=new Cliente();
    this.vendedor=new Usuario();
  }
}
