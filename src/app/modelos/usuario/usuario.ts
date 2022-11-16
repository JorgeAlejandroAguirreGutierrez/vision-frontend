import { Perfil } from './perfil';
import { EstacionUsuario } from './estacion-usuario';
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
    avatar: string;
    cambiarContrasena: string;
    pregunta: string;
    respuesta: string;
    activo: string;
    perfil: Perfil;
    estacionesUsuarios: EstacionUsuario[];

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
      this.avatar = valores.vacio;
      this.cambiarContrasena = valores.si;
      this.pregunta = valores.vacio;
      this.respuesta = valores.vacio;
      this.activo = valores.activo;
      this.perfil = new Perfil();
      this.estacionesUsuarios = [];
    }
    
}
