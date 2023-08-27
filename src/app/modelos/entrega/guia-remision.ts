import { Transportista } from './transportista';
import { Factura } from '../venta/factura';
import { valores } from "../../constantes";
import { Sesion } from '../usuario/sesion';
import { Vehiculo } from './vehiculo';
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { Empresa } from '../usuario/empresa';

export class GuiaRemision {
    id: number;
    codigo: string;
    establecimiento: string;
    puntoVenta: string;
    secuencial: string;
    numeroComprobante: string;
    codigoNumerico: string;
    claveAcceso: string;
    fecha: Date;
    fechaAutorizacion: Date;
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
    estadoSRI: string;
    tipoComprobante: TipoComprobante;
    sesion: Sesion;
    transportista: Transportista;
    vehiculo: Vehiculo;
    factura: Factura;
    empresa: Empresa;

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
        this.estado = valores.vacio;
        this.estadoSRI = valores.vacio;
        this.tipoComprobante = new TipoComprobante();
        this.sesion = new Sesion();
        this.transportista = new Transportista();
        this.vehiculo = new Vehiculo();
        this.factura = new Factura();
        this.empresa = null;
    }
}
