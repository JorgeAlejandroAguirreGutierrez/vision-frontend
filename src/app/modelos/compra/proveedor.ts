import { GrupoProveedor } from './grupo-proveedor';
import { TipoContribuyente } from '../cliente/tipo-contribuyente';
import { Segmento } from '../inventario/segmento';
import { Direccion } from '../cliente/direccion';
import { Financiamiento } from '../cliente/financiamiento';
import { Genero } from '../cliente/genero';
import { EstadoCivil } from '../cliente/estado-civil';
import { CalificacionCliente } from '../cliente/calificacion-cliente';
import { OrigenIngreso } from '../cliente/origen-ingreso';
import { Estacion } from '../usuario/estacion';
import { Telefono } from '../cliente/telefono';
import { Celular } from '../cliente/celular';
import { Correo } from '../cliente/correo';
import { Dependiente } from '../cliente/dependiente';
import { RetencionCliente } from '../cliente/retencion-cliente';
import { valores } from "../../constantes";

export class Proveedor {
    id:number;
    codigo:string;
    identificacion:string;
    tipoIdentificacion:string;
    razonSocial: string;
    nombreComercial: string;
    especial: boolean;
    obligadoContabilidad: boolean;
    estado: string;
    
    estacion: Estacion;
    grupoProveedor: GrupoProveedor;
    tipoContribuyente: TipoContribuyente;
    segmento: Segmento;
    direccion: Direccion;
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
        this.codigo=valores.vacio;
        this.identificacion=valores.vacio;
        this.tipoIdentificacion=valores.vacio;
        this.razonSocial=valores.vacio;
        this.nombreComercial=valores.vacio;
        this.obligadoContabilidad=false;
        this.estado=valores.activo;
        this.especial=false;
        this.estacion=new Estacion();
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
