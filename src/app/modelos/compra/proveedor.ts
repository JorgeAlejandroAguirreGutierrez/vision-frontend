import { GrupoProveedor } from './grupo-proveedor';
import { TipoContribuyente } from '../cliente/tipo-contribuyente';
import { TipoIdentificacion } from '../configuracion/tipo-identificacion';
import { Ubicacion } from '../configuracion/ubicacion';
import { TelefonoProveedor } from '../compra/telefono-proveedor';
import { CelularProveedor } from '../compra/celular-proveedor';
import { CorreoProveedor } from '../compra/correo-proveedor';
import { FormaPago } from '../cliente/forma-pago';
import { PlazoCredito } from '../cliente/plazo-credito';
import { RetencionCliente } from '../cliente/retencion-cliente';
import { valores } from "../../constantes";
import { Empresa } from '../acceso/empresa';


export class Proveedor {
    id: number;
    codigo: string;
    identificacion: string;
    razonSocial: string;
    nombreComercial: string;
    direccion: string;
    referencia: string;
    latitudgeo: number;
    longitudgeo: number;
    especial: string;
    obligadoContabilidad: string;
    fantasma: string;
    relacionado: string;
    montoFinanciamiento: number;
    estado: string;
    
    tipoIdentificacion: TipoIdentificacion;
    tipoContribuyente: TipoContribuyente;
    grupoProveedor: GrupoProveedor;
    ubicacion: Ubicacion;
    formaPago: FormaPago;
    plazoCredito: PlazoCredito;
    empresa: Empresa;

    telefonosProveedor: TelefonoProveedor[];
    celularesProveedor: CelularProveedor[];
    correosProveedor: CorreoProveedor[];

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.identificacion = valores.vacio;
        this.razonSocial = valores.vacio;
        this.nombreComercial = valores.vacio;
        this.direccion = valores.vacio;
        this.referencia = valores.vacio;
        this.latitudgeo = valores.latCiudad;
        this.longitudgeo = valores.lngCiudad;
        this.obligadoContabilidad = valores.no;
        this.estado = valores.estadoActivo;
        this.especial = valores.no;
        this.fantasma = valores.no;
        this.relacionado = valores.no;
        this.tipoIdentificacion = new TipoIdentificacion();
        this.ubicacion = new Ubicacion();
        this.tipoContribuyente = new TipoContribuyente();
        this.grupoProveedor = new GrupoProveedor();
        this.formaPago = new FormaPago();
        this.plazoCredito = new PlazoCredito();
        this.montoFinanciamiento = valores.cero;
        this.telefonosProveedor = [];
        this.celularesProveedor = [];
        this.correosProveedor = [];
    }
}
