import { Direccion } from '../cliente/direccion';
import { Transportista } from './transportista';
import { Factura } from '../comprobante/factura';
import { valores } from "../../constantes";
export class Entrega {
    id: number;
    codigo: string;
    fecha: Date;
    numero: string;
    direccion: Direccion;
    telefono: string;
    celular: string;
    correo: string;
    referencia: string;
    estado: string;
    transportista: Transportista;
    factura: Factura;
    inhabilitar: boolean;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fecha = new Date();
        this.numero = valores.vacio;
        this.direccion = new Direccion();
        this.telefono = valores.vacio;
        this.celular = valores.vacio;
        this.correo = valores.vacio;
        this.estado = valores.pendiente;
        this.transportista = new Transportista();
        this.factura = new Factura();
        this.inhabilitar = false;
    }

    normalizar(){
        if (this.direccion.ubicacion.id==valores.cero){
            this.direccion=new Direccion();
        }
    }
    des_normalizar(){
        this.direccion=new Direccion();
    }
}
