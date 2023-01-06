import { GrupoCliente } from './grupo-cliente';
import { TipoContribuyente } from './tipo-contribuyente';
import { Segmento } from '../inventario/segmento';
import { Financiamiento } from './financiamiento';
import { Genero } from './genero';
import { EstadoCivil } from './estado-civil';
import { CalificacionCliente } from './calificacion-cliente';
import { OrigenIngreso } from './origen-ingreso';
import { Estacion } from '../usuario/estacion';
import { Telefono } from './telefono';
import { Celular } from './celular';
import { Correo } from './correo';
import { Dependiente } from './dependiente';
import { RetencionCliente } from './retencion-cliente';
import { FormaPago } from './forma-pago';
import { PlazoCredito } from './plazo-credito';
import { Ubicacion } from '../configuracion/ubicacion';
import { TipoRetencion } from '../configuracion/tipo-retencion';
import { TipoIdentificacion } from '../configuracion/tipo-identificacion';
import { valores } from "../../constantes";

export class Cliente {
   id:number;
   codigo:string;
   identificacion:string;
   razonSocial:string;
   especial: string;
   estado:string;
   obligadoContabilidad: string;
   direccion: string;
   referencia: string;
   tipoIdentificacion: TipoIdentificacion;
   estacion: Estacion;
   grupoCliente: GrupoCliente;
   tipoContribuyente: TipoContribuyente;
   segmento: Segmento;
   ubicacion: Ubicacion;
   financiamiento: Financiamiento;
   genero: Genero;
   estadoCivil: EstadoCivil;
   calificacionCliente: CalificacionCliente;
   origenIngreso: OrigenIngreso;
   
   dependientes: Dependiente[];
   telefonos: Telefono[];
   celulares: Celular[];
   correos: Correo[];
   retencionesCliente: RetencionCliente[];

   constructor() {
      this.id=valores.cero;
      this.razonSocial=valores.vacio;
      this.identificacion=valores.vacio;
      this.obligadoContabilidad = valores.no;
      this.estado=valores.activo;
      this.especial=valores.no;
      this.direccion = valores.vacio;
      this.referencia = valores.vacio;
      this.ubicacion= new Ubicacion();
      this.tipoIdentificacion=new TipoIdentificacion();
      this.estacion=new Estacion();
      this.tipoContribuyente=new TipoContribuyente();
      this.segmento=new Segmento();
      this.grupoCliente=new GrupoCliente();
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

   normalizar(){
      if (this.tipoContribuyente==null) this.tipoContribuyente=new TipoContribuyente();
      if (this.segmento==null) this.segmento=new Segmento();
      if (this.grupoCliente==null) this.grupoCliente=new GrupoCliente();
      if (this.calificacionCliente==null) this.calificacionCliente=new CalificacionCliente();
      if (this.origenIngreso==null) this.origenIngreso=new OrigenIngreso();
      if (this.financiamiento==null) this.financiamiento=new Financiamiento();
      if (this.financiamiento.formaPago==null) this.financiamiento.formaPago=new FormaPago();
      if (this.financiamiento.plazoCredito==null) this.financiamiento.plazoCredito=new PlazoCredito();
      if (this.genero==null) this.genero=new Genero();
      if (this.estadoCivil==null) this.estadoCivil=new EstadoCivil();
      if (this.retencionesCliente[0].tipoRetencion==null) this.retencionesCliente[0].tipoRetencion= new TipoRetencion();
      if (this.retencionesCliente[1].tipoRetencion==null) this.retencionesCliente[1].tipoRetencion= new TipoRetencion();
      if (this.retencionesCliente[2].tipoRetencion==null) this.retencionesCliente[2].tipoRetencion= new TipoRetencion();
      if (this.retencionesCliente[3].tipoRetencion==null) this.retencionesCliente[3].tipoRetencion= new TipoRetencion();
   }
}
