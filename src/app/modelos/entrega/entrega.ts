import { Transportista } from './transportista';
import { Factura } from '../comprobante/factura';
import { valores } from "../../constantes";
import { Ubicacion } from '../configuracion/ubicacion';
export class Entrega {
    id: number;
    codigo: string;
    fecha: Date;
    guiaNumero: string;
    direccion: string;
    telefono: string;
    celular: string;
    correo: string;
    referencia: string;
    opcionGuia: string;
    estado: string;
    ubicacion : Ubicacion;
    transportista: Transportista;
    factura: Factura;
    inhabilitar: boolean;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fecha = new Date();
        this.guiaNumero = valores.vacio;
        this.direccion = valores.vacio;
        this.telefono = valores.vacio;
        this.celular = valores.vacio;
        this.correo = valores.vacio;
        this.opcionGuia = valores.clienteDireccion;
        this.estado = valores.pendiente;
        this.ubicacion = new Ubicacion();
        this.transportista = new Transportista();
        this.factura = new Factura();
        this.inhabilitar = false;
    }
}
