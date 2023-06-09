import { Transportista } from './transportista';
import { Factura } from '../venta/factura';
import { valores } from "../../constantes";
import { Sesion } from '../usuario/sesion';
import { VehiculoTransporte } from './vehiculo-transporte';
export class GuiaRemision {
    id: number;
    codigo: string;
    secuencial: string;
    fecha: Date;
    fechaInicioTransporte: Date;
    fechaFinTransporte: Date;
    motivoTraslado: string;
    ruta: string;
    identificacionDestinatario: string;
    razonSocialDestinatario: string;
    direccionDestinatario: string;
    telefonoDestinatario: string;
    celularDestinatario: string;
    correoDestinatario: string;
    opcionGuia: string;
    estado: string;
    sesion: Sesion;
    transportista: Transportista;
    vehiculoTransporte: VehiculoTransporte
    factura: Factura;

    constructor(){
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.secuencial = valores.vacio;
        this.fecha = new Date();
        this.fechaInicioTransporte = new Date();
        this.fechaFinTransporte = new Date();
        this.motivoTraslado = valores.vacio;
        this.ruta = valores.vacio;
        this.direccionDestinatario = valores.vacio;
        this.telefonoDestinatario = valores.vacio;
        this.celularDestinatario = valores.vacio;
        this.correoDestinatario = valores.vacio;
        this.opcionGuia = valores.clienteDireccion;
        this.estado = valores.pendiente;
        this.sesion = new Sesion();
        this.transportista = new Transportista();
        this.vehiculoTransporte = new VehiculoTransporte();
        this.factura = new Factura();
    }
}
