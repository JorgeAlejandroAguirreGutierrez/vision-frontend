import { Perfil } from '../modelos/perfil';
import { PuntoVenta } from '../modelos/punto-venta';
export class Usuario {
    id: number;
    codigo: string;
    nombre: string;
    correo: string;
    contrasena: string;
    identificacion: string;
    activo: boolean;
    puntoVenta: PuntoVenta;
    perfil: Perfil;

    constructor() {
        this.puntoVenta=new PuntoVenta();
        this.perfil=new Perfil();
      }
    
}
