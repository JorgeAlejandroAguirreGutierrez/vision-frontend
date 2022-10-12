import { Perfil } from './perfil';
import { PuntoVenta } from './punto-venta';
import { valores } from "../../constantes";
export class Usuario {
    id: number;
    codigo: string;
    usuario: string;
    contrasena: string;
    identificacion: string;
    nombre: string;
    correo: string;
    celular: string;
    activo: string;
    puntoVenta: PuntoVenta;
    perfil: Perfil;

    constructor() {
      this.id = valores.cero;
      this.codigo = valores.vacio;
      this.usuario = valores.vacio;
      this.contrasena = valores.vacio;
      this.identificacion = valores.vacio;
      this.nombre = valores.vacio;
      this.correo = valores.vacio;
      this.celular = valores.vacio;
      this.activo = valores.activo;
      this.puntoVenta = new PuntoVenta();
      this.perfil = new Perfil();
    }
    
}
