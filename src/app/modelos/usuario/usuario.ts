import { Perfil } from './perfil';
import { valores } from "../../constantes";
import { Estacion } from './estacion';

export class Usuario {
    id: number;
    codigo: string;
    apodo: string;
    contrasena: string;
    confirmarContrasena: string;
    identificacion: string;
    nombre: string;
    telefono: string;
    celular: string;
    correo: string;
    avatar64: string;
    avatar: string;
    cambiarContrasena: string;
    pregunta: string;
    respuesta: string;
    estado: string;
    perfil: Perfil;
    estacion: Estacion;

    constructor() {
      this.id = valores.cero;
      this.codigo = valores.vacio;
      this.apodo = valores.vacio;
      this.contrasena = valores.vacio;
      this.confirmarContrasena = valores.vacio;
      this.identificacion = valores.vacio;
      this.nombre = valores.vacio;
      this.telefono = valores.vacio;
      this.celular = valores.vacio;
      this.correo = valores.vacio;
      this.avatar64 = valores.vacio;
      this.avatar = valores.vacio;
      this.cambiarContrasena = valores.si;
      this.pregunta = valores.vacio;
      this.respuesta = valores.vacio;
      this.estado = valores.estadoActivo;
      this.perfil = new Perfil();
      this.estacion=new Estacion();
    }
    
}
