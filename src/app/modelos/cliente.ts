import { GrupoCliente } from '../modelos/grupo-cliente';
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
import { Auxiliar } from './auxiliar';
import { RetencionCliente } from './retencion-cliente';
import { TipoPago } from './tipo-pago';
import { FormaPago } from './forma-pago';
import { PlazoCredito } from './plazo-credito';
import { Ubicacion } from './ubicacion';
import { TipoRetencion } from './tipo-retencion';

export class Cliente {
    id:number;
    codigo:string;
    identificacion:string;
    tipoIdentificacion: string;
    razonSocial:string;
    especial: boolean;
    estado:string;

    puntoVenta: PuntoVenta;
    grupoCliente: GrupoCliente;
    tipoContribuyente: TipoContribuyente;
    segmento: Segmento;
    direccion: Direccion;
    financiamiento: Financiamiento;
    genero: Genero;
    estadoCivil: EstadoCivil;
    calificacionCliente: CalificacionCliente;
    origenIngreso: OrigenIngreso;
    obligadoContabilidad=false;

    auxiliares: Auxiliar[];
    telefonos: Telefono[];
    celulares: Celular[];
    correos: Correo[];
    retencionesCliente: RetencionCliente[];

    constructor() {
        this.id=0;
        this.razonSocial="";
        this.identificacion="";
        this.estado="ACTIVO";
        this.especial=false;
        this.puntoVenta=new PuntoVenta();
        this.tipoContribuyente=new TipoContribuyente();
        this.segmento=new Segmento();
        this.grupoCliente=new GrupoCliente();
        this.direccion=new Direccion();
        this.financiamiento=new Financiamiento();
        this.genero=new Genero();
        this.estadoCivil=new EstadoCivil();
        this.calificacionCliente= new CalificacionCliente();
        this.origenIngreso=new OrigenIngreso();
        this.telefonos=[];
        this.celulares=[];
        this.correos=[];
        this.auxiliares=[];
        this.retencionesCliente=[];
        this.retencionesCliente.push(new RetencionCliente());
        this.retencionesCliente.push(new RetencionCliente());
        this.retencionesCliente.push(new RetencionCliente());
        this.retencionesCliente.push(new RetencionCliente());
     }

     normalizar(){
        if (this.tipoContribuyente==null) this.tipoContribuyente=new TipoContribuyente();
        if (this.segmento==null) this.segmento=new Segmento();
        if (this.grupoCliente==null) this.grupoCliente=new GrupoCliente();
        if (this.calificacionCliente==null) this.calificacionCliente=new CalificacionCliente();
        if (this.origenIngreso==null) this.origenIngreso=new OrigenIngreso();
        if (this.financiamiento==null) this.financiamiento=new Financiamiento();
        if (this.financiamiento.formaPago==null) this.financiamiento.formaPago=new FormaPago();
        if (this.financiamiento.plazoCredito==null) this.financiamiento.plazoCredito=new PlazoCredito();
        if (this.direccion==null) this.direccion=new Direccion();
        if (this.direccion.ubicacion==null) this.direccion.ubicacion=new Ubicacion();
        if (this.genero==null) this.genero=new Genero();
        if (this.estadoCivil==null) this.estadoCivil=new EstadoCivil();
        if (this.retencionesCliente[0].tipoRetencion==null) this.retencionesCliente[0].tipoRetencion= new TipoRetencion();
        if (this.retencionesCliente[1].tipoRetencion==null) this.retencionesCliente[1].tipoRetencion= new TipoRetencion();
        if (this.retencionesCliente[2].tipoRetencion==null) this.retencionesCliente[2].tipoRetencion= new TipoRetencion();
        if (this.retencionesCliente[3].tipoRetencion==null) this.retencionesCliente[3].tipoRetencion= new TipoRetencion();
     }
}
