import { Cliente } from '../cliente/cliente';
import { Usuario } from '../usuario/usuario';
import { valores } from "../../constantes";

export class Pedido {
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
  total:  number;
  descuentoPorcentaje: number;
  descuento: number;
  comentario: string;
  cliente: Cliente;
  vendedor: Usuario;
}
