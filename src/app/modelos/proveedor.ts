import { GrupoProveedor } from '../modelos/grupo-proveedor';
import { TipoContribuyente } from '../modelos/tipo-contribuyente';
import { Segmento } from '../modelos/segmento';
import { Direccion } from '../modelos/direccion';
import { Financiamiento } from '../modelos/financiamiento';
import { Genero } from '../modelos/genero';
import { EstadoCivil } from '../modelos/estado-civil';
import { CalificacionCliente } from './calificacion-cliente';
import { OrigenIngreso } from '../modelos/origen-ingreso';
import { PuntoVenta } from '../modelos/punto-venta';
import { Telefono } from '../modelos/telefono';
import { Celular } from '../modelos/celular';
import { Correo } from '../modelos/correo';
import { Dependiente } from './dependiente';
import { RetencionCliente } from './retencion-cliente';
import { FormaPago } from './forma-pago';
import { PlazoCredito } from './plazo-credito';
import { Ubicacion } from './ubicacion';
import { TipoRetencion } from './tipo-retencion';

export class Proveedor {
    id:number;
    codigo:string;
    identificacion:string;
    tipoIdentificacion:string;
    razonSocial: string;
    nombreComercial: string;
    especial: boolean;
    estado: string;

    puntoVenta: PuntoVenta;
    grupoProveedor: GrupoProveedor;
    tipoContribuyente: TipoContribuyente;
    segmento: Segmento;
    direccion: Direccion;
    financiamiento: Financiamiento;
    genero: Genero;
    estadoCivil: EstadoCivil;
    calificacionCliente: CalificacionCliente;
    origenIngreso: OrigenIngreso;
    obligadoContabilidad=false;

    dependientes: Dependiente[];
    telefonos: Telefono[];
    celulares: Celular[];
    correos: Correo[];
    retencionesCliente: RetencionCliente[];

    constructor() {
        this.id=0;
        this.codigo="";
        this.identificacion="";
        this.tipoIdentificacion="";
        this.razonSocial="";
        this.nombreComercial="";
        this.estado='ACTIVO';
        this.especial=false;
        this.puntoVenta=new PuntoVenta();
        this.tipoContribuyente=new TipoContribuyente();
        this.segmento=new Segmento();
        this.grupoProveedor=new GrupoProveedor();
        this.direccion=new Direccion();
        this.financiamiento=new Financiamiento();
        this.genero=new Genero();
        this.estadoCivil=new EstadoCivil();
        this.calificacionCliente= new CalificacionCliente();
        this.origenIngreso=new OrigenIngreso();
        this.telefonos=[];
        this.celulares=[];
        this.correos=[];
        this.dependientes=[];
        this.retencionesCliente=[];
        this.retencionesCliente.push(new RetencionCliente());
        this.retencionesCliente.push(new RetencionCliente());
        this.retencionesCliente.push(new RetencionCliente());
        this.retencionesCliente.push(new RetencionCliente());
    }
}
