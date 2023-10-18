import { valores } from "../../constantes";
import { ModeloDetalle } from "./modelo-detalle";
import { ModeloImpuesto } from "./modelo-impuesto";

export class Modelo {
    id: number;
    razonSocial: string;
    nombreComercial: string;
    ruc: string;
    claveAcceso: string;
    establecimiento: string;
    puntoVenta: string;
    secuencial: string;
    numeroComprobante: string;
    direccion: string;
    fecha: string;
    totalSinImpuestos: string;
    totalDescuento: string;
    importeTotal: string;
    modeloImpuestos: ModeloImpuesto[];
    modeloDetalles: ModeloDetalle[];

    constructor() {
        this.id = valores.cero;
        this.razonSocial = valores.vacio;
        this.nombreComercial = valores.vacio;
        this.ruc = valores.vacio;
        this.claveAcceso = valores.vacio;
        this.establecimiento = valores.vacio;
        this.puntoVenta = valores.vacio;
        this.secuencial = valores.vacio;
        this.numeroComprobante = valores.vacio;
        this.direccion = valores.vacio;
        this.fecha = valores.vacio;
        this.totalSinImpuestos = valores.vacio;
        this.totalDescuento = valores.vacio;
        this.importeTotal = valores.vacio;
        this.modeloImpuestos = [];
        this.modeloDetalles = [];
    }
}