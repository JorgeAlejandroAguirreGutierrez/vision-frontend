import { Perfil } from './perfil';
import { PuntoVenta } from './punto-venta';
import { valores } from "../../constantes";

export class Usuario {
    id: number;
    codigo: string;
    apodo: string;
    contrasena: string;
    identificacion: string;
    nombre: string;
    telefono: string;
    celular: string;
    correo: string;
    foto: string;
    activo: string;
    puntoVenta: PuntoVenta;
    perfil: Perfil;

    constructor() {
      this.id = valores.cero;
      this.codigo = valores.vacio;
      this.apodo = valores.vacio;
      this.contrasena = valores.vacio;
      this.identificacion = valores.vacio;
      this.nombre = valores.vacio;
      this.telefono = valores.vacio;
      this.celular = valores.vacio;
      this.correo = valores.vacio;
      this.activo = valores.activo;
      this.puntoVenta = new PuntoVenta();
      this.perfil = new Perfil();
    }
    
}
