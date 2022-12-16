import { Router } from '@angular/router';
import { Component, OnInit, HostListener, Input, ViewChild } from '@angular/core';
import { UntypedFormControl, FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ClienteService } from '../../servicios/cliente/cliente.service';
import { GeneroService } from '../../servicios/cliente/genero.service';
import { EstadoCivilService } from '../../servicios/cliente/estado-civil.service';
import { OrigenIngresoService } from '../../servicios/cliente/origen-ingreso.service';
import { CalificacionClienteService } from '../../servicios/cliente/calificacion-cliente.service';
import { PlazoCreditoService } from '../../servicios/cliente/plazo-credito.service';
import { FormaPagoService } from '../../servicios/cliente/forma-pago.service';
import { TipoPagoService } from '../../servicios/cliente/tipo-pago.service';
import { UbicacionService } from '../../servicios/configuracion/ubicacion.service';
import { Cliente } from '../../modelos/cliente/cliente';
import {GrupoCliente} from '../../modelos/cliente/grupo-cliente'
import { Genero } from '../../modelos/cliente/genero';
import { EstadoCivil } from '../../modelos/cliente/estado-civil';
import { OrigenIngreso } from '../../modelos/cliente/origen-ingreso';
import { CalificacionCliente } from '../../modelos/cliente/calificacion-cliente';
import { PlazoCredito } from '../../modelos/cliente/plazo-credito';
import { FormaPago } from '../../modelos/cliente/forma-pago';
import { TipoPago } from '../../modelos/cliente/tipo-pago';
import { Telefono } from '../../modelos/cliente/telefono';
import { Celular } from '../../modelos/cliente/celular';
import { Correo } from '../../modelos/cliente/correo';
import { Ubicacion } from '../../modelos/configuracion/ubicacion';
import { TipoContribuyente } from '../../modelos/cliente/tipo-contribuyente';
import { GrupoClienteService } from '../../servicios/cliente/grupo-cliente.service';
import { TipoRetencionService } from '../../servicios/configuracion/tipo-retencion.service';
import { TipoRetencion } from '../../modelos/configuracion/tipo-retencion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Sesion } from '../../modelos/usuario/sesion';
import { Dependiente } from '../../modelos/cliente/dependiente';
import { EmpresaService } from '../../servicios/usuario/empresa.service';
import { Empresa } from '../../modelos/usuario/empresa';
import { environment } from '../../../environments/environment';
import { TipoContribuyenteService } from '../../servicios/cliente/tipo-contribuyente.service';
import { TelefonoDependiente } from '../../modelos/cliente/telefono-dependiente';
import { CorreoDependiente } from '../../modelos/cliente/correo-dependiente';
import { CelularDependiente } from '../../modelos/cliente/celular-dependiente';
import { Factura } from '../../modelos/comprobante/factura';
import { FacturaDetalle } from '../../modelos/comprobante/factura-detalle';

@Component({
  selector: 'app-factura-compra',
  templateUrl: './factura-compra.component.html',
  styleUrls: ['./factura-compra.component.scss']
})
export class FacturaCompraComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  collapsed = true;
  habilitarTipoContribuyente=false;
  indiceTipoContribuyente: number=-1;
  habilitarCelularTelefonoCorreoDependiente=true;

  cliente: Cliente;
  clienteCrear: Cliente;
  clienteActualizar: Cliente;
  clientes: Cliente[];
  dependiente: Dependiente=new Dependiente();
  gruposClientes: GrupoCliente[];
  generos: Genero[];
  estadosCiviles: EstadoCivil[];
  origenesIngresos: OrigenIngreso[];
  calificacionesClientes: CalificacionCliente[];
  plazosCreditos: PlazoCredito[];
  tiposPagos: TipoPago[];
  formasPagos: FormaPago[];
  tiposContribuyentes: TipoContribuyente[]=[];

  clienteProvincia: string="";
  clienteCanton: string="";
  clienteParroquia: string="";
  dependienteProvincia: string="";
  dependienteCanton: string="";
  dependienteParroquia: string="";
  telefono = new Telefono();
  celular = new Celular();
  correo = new Correo();
  dependienteTelefono = new TelefonoDependiente();
  dependienteCelular = new CelularDependiente();
  dependienteCorreo = new CorreoDependiente();
  facturaCrear: Factura=new Factura();

  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];
  dependienteProvincias: Ubicacion[];
  dependienteCantones: Ubicacion[];
  dependienteParroquias: Ubicacion[];
  activacion_s_es_oi: boolean= true;
  activacionPlazoCredito: boolean= false;

  tiposRetencionesIvaBien: TipoRetencion[];
  tiposRetencionesIvaServicio: TipoRetencion[];
  tiposRetencionesRentaBien: TipoRetencion[];
  tiposRetencionesRentaServicio: TipoRetencion[];

  archivoImportar: File=null;
  panelOpenState = true;
  value = 'Clear me';

  sesion: Sesion;

  urlLogo: string ="";
  nombreEmpresa: string="";
  urlAvatar: string= environment.prefijoUrlImagenes+"avatar/avatar1.png";

  isLinear = false;
  isEditable=false;
  completed=false;
  categoriaProducto="B";
  estado="EMITIDA";
  indiceDetalle=0;
  detalleEntregado="";
  buscarSerie:string="";

  seleccionDependiente: boolean =false;
  seleccionFacturar: boolean =false;

  firstFormGroup: UntypedFormGroup;
  secondFormGroup: UntypedFormGroup;
  thirdFormGroup: UntypedFormGroup;

  seleccionProducto = new UntypedFormControl();
  seleccionIdentificacionCliente = new UntypedFormControl();
  seleccionRazonSocialCliente = new UntypedFormControl();
  seleccionIdentificacionClienteFactura = new UntypedFormControl();
  seleccionRazonSocialClienteFactura = new UntypedFormControl();

  costoUltimo: number;
  costoPromedio: number;
  stockIndividual: number;
  stockTotal: number;
  impuestos: any[]=[];
  bodegas: any[]=[];
  medidas: any[]=[];

  constructor(private clienteService: ClienteService, private generoService: GeneroService,
    private estadoCivilService: EstadoCivilService, private origenIngresoService: OrigenIngresoService,
    private calificacionClienteService: CalificacionClienteService, private plazoCreditoService: PlazoCreditoService,
    private tipoPagoService: TipoPagoService, private formaPagoService: FormaPagoService,
    private ubicacionService: UbicacionService, private grupoClienteService: GrupoClienteService,
    private tipoRetencionService: TipoRetencionService, private router: Router,
    private sesionService: SesionService, private empresaService: EmpresaService,
    private tipoContribuyenteService: TipoContribuyenteService, private modalService: NgbModal) { }

    factura: Factura = new Factura();
    facturaDetalle: FacturaDetalle = new FacturaDetalle();
    Datos_prueba: any[] = [
      {nombre: 1, entregado:'si', descripcion: 'Hydrogen', cantidad:'2', valor: 1.0079, descuento: '11'},
      {nombre: 2, entregado:'si', descripcion: 'Helium',   cantidad:'2', valor: 4.0026, descuento: '1'},
      {nombre: 3, entregado:'si', descripcion: 'Lithium',  cantidad:'2', valor: 6.9417, descuento: '12'},
      {nombre: 4, entregado:'si', descripcion: 'Beryllium',cantidad:'2', valor: 9.0122, descuento: '13'},
      {nombre: 5, entregado:'si', descripcion: 'Boron',    cantidad:'2', valor: 10.811, descuento: '14'},
      {nombre: 6, entregado:'si', descripcion: 'Carbon',   cantidad:'2', valor: 12.017, descuento: '1'},
    ];
    columnasDetalleFactura: string[] = ['nombre', 'entregado', 'descripcion', 'cantidad', 'valor', 'descuento'
      , 'desc_por', 'desc_sub', 'desc_por_sub', 'desc_tot', 'desc_por_tot', 'impuesto', 'total', 'serie','acciones'];
    dataDetalleFactura = new MatTableDataSource<FacturaDetalle>(this.factura.facturaDetalles);
    dataDetalleFacturaPrueba = new MatTableDataSource<any>(this.Datos_prueba);

    Datos_retencion: any[] = [
      {periodo: 2020, establecimiento: '001', serie: '001', comprobante:'00000002', tipo:"R", codigo:'320', descripcion:'Retención por', base: 1.0079, porcentaje: '11', valor:0.20},
      {periodo: 2020, establecimiento: '001', serie: '001', comprobante:'00000002', tipo:"R", codigo:'320', descripcion:'Retención por', base: 4.0026, porcentaje: '1' , valor:0.20},
      {periodo: 2020, establecimiento: '001', serie: '001', comprobante:'00000002', tipo:"I", codigo:'344', descripcion:'Retención por', base: 6.9417, porcentaje: '12', valor:0.20},
      {periodo: 2020, establecimiento: '001', serie: '001', comprobante:'00000002', tipo:"I", codigo:'725', descripcion:'Retención por', base: 9.0122, porcentaje: '13', valor:0.20},
      {periodo: 2020, establecimiento: '001', serie: '001', comprobante:'00000002', tipo:"R", codigo:'320', descripcion:'Retención por', base: 10.811, porcentaje: '14', valor:0.20},
      {periodo: 2020, establecimiento: '001', serie: '001', comprobante:'00000002', tipo:"R", codigo:'320', descripcion:'Retención por', base: 12.017, porcentaje: '1' , valor:0.20},
    ];
    columnasRetencion: string[] = ['periodo', 'establecimiento', 'serie', 'comprobante', 'tipo', 'codigo'
      , 'descripcion', 'base', 'porcentaje', 'valor', 'acciones'];
    dataRetencion = new MatTableDataSource<any>(this.Datos_retencion);

  validarSesion(){
    this.sesion = this.sesionService.getSesion();
    if (this.sesion == undefined)
      this.router.navigate(['/iniciosesion']);
  }

  ngOnInit() {

    this.dataDetalleFacturaPrueba.paginator = this.paginator;
    this.cliente= new Cliente();
    this.validarSesion();
    this.construirCliente();
    this.obtenerEmpresa();
    this.obtenerSesion();
    this.tipoContribuyenteService.consultar().subscribe(
      res => {
        this.tiposContribuyentes = res.resultado as TipoContribuyente[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.grupoClienteService.consultar().subscribe(
      res => {
        this.gruposClientes = res.resultado as GrupoCliente[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.generoService.consultar().subscribe(
      res => {
        this.generos = res.resultado as Genero[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.estadoCivilService.consultar().subscribe(
      res => {
        this.estadosCiviles = res.resultado as EstadoCivil[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.origenIngresoService.consultar().subscribe(
      res => {
        this.origenesIngresos = res.resultado as OrigenIngreso[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.calificacionClienteService.consultar().subscribe(
      res => {
        this.calificacionesClientes = res.resultado as CalificacionCliente[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.plazoCreditoService.consultar().subscribe(
      res => {
        this.plazosCreditos = res.resultado as PlazoCredito[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.tipoPagoService.consultar().subscribe(
      res => {
        this.tiposPagos = res.resultado as TipoPago[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.formaPagoService.consultar().subscribe(
      res => {
        this.formasPagos = res.resultado as FormaPago[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.ubicacionService.obtenerProvincias().subscribe(
      res => {
        this.provincias = res.resultado as Ubicacion[];
        this.dependienteProvincias = res.resultado as Ubicacion[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.tipoRetencionService.obtenerIvaBien().subscribe(
      res => {
        this.tiposRetencionesIvaBien = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.tipoRetencionService.obtenerIvaServicio().subscribe(
      res => {
        this.tiposRetencionesIvaServicio = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.tipoRetencionService.obtenerRentaBien().subscribe(
      res => {
        this.tiposRetencionesRentaBien = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
    this.tipoRetencionService.obtenerRentaServicio().subscribe(
      res => {
        this.tiposRetencionesRentaServicio = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire('Error', err.error.mensaje, 'error')
      }
    );
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 71)
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 78)
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 69)
    console.log('SHIFT + E');
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 66)
      console.log('SHIFT + B');
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 65)
      console.log('SHIFT + A');

  }

  construirCliente() {
    let clienteId=0;
    this.clienteService.currentMessage.subscribe(message => clienteId = message);
    if (clienteId!= 0) {
      this.clienteService.obtener(clienteId).subscribe(
        res => {
          Object.assign(this.cliente, res.resultado as Cliente);
          this.cliente.normalizar();
          this.validarSexoEstadoCivilOrigenIngreso();
          this.ubicacionNormalizarActualizar();
          this.clienteService.enviar(0);
        },
        err => {
          Swal.fire('Error', err.error.mensaje, 'error')
        }
      )
    }
  }

  ubicacionNormalizarActualizar(){
    if (this.cliente.direccion.ubicacion!= null){
      this.clienteProvincia=this.cliente.direccion.ubicacion.provincia;
      this.clienteCanton=this.cliente.direccion.ubicacion.canton;
      this.clienteParroquia=this.cliente.direccion.ubicacion.parroquia;
    }
    this.provincia(this.clienteProvincia);
    this.canton(this.clienteCanton);
  }
  obtenerSesion(){
    this.sesion=this.sesionService.getSesion();
  }

  obtenerEmpresa(){
    let empresa=new Empresa();
    empresa.id=1;
    this.empresaService.obtener(empresa.id).subscribe(
      res => {
        empresa= res.resultado as Empresa
        this.urlLogo=environment.prefijoUrlImagenes+"logos/"+empresa.logo;
        this.nombreEmpresa=empresa.razonSocial;
      }
    );
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.cliente= new Cliente();
  }

  open(content: any, event) {
    if (event!=null)
      event.preventDefault();
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    }, (reason) => {

    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  validarIdentificacion() {
    this.clienteService.obtenerIdentificacion(this.cliente.identificacion).subscribe(
      res => {
        if (res.resultado==null){
          this.clienteService.validarIdentificacion(this.cliente.identificacion).subscribe(
            res => {
              if (res.resultado!=null){
                this.cliente.tipoIdentificacion=res.resultado.tipo_identificacion;
                this.cliente.tipoContribuyente=res.resultado.tipo_contribuyente as TipoContribuyente
                if (this.cliente.tipoContribuyente==null){
                  this.habilitarTipoContribuyente=true;
                } else {
                  this.cliente.tipoContribuyente=this.obtenerTipoContribuyente();
                }
                this.validarSexoEstadoCivilOrigenIngreso();
              } else {
                this.cliente.tipoIdentificacion=null;
                this.cliente.identificacion='';
                Swal.fire('Error', res.mensaje, 'error');
              } 
            },
            err => Swal.fire('Error', err.error.mensaje, 'error')
          );
        } else {
          this.cliente.tipoIdentificacion=null;
          this.cliente.identificacion='';
          Swal.fire('Error', res.mensaje, 'error');
        } 
      },
      err => Swal.fire('Error', err.error.mensaje, 'error')
    );
  }

  validarTipoContribuyente(){
    this.cliente.tipoContribuyente=this.tiposContribuyentes[this.indiceTipoContribuyente];
  }
  obtenerTipoContribuyente(){
    for (let i=0; i<this.tiposContribuyentes.length; i++){
      if (this.cliente.tipoContribuyente.id==this.tiposContribuyentes[i].id)
      return this.tiposContribuyentes[i];
    }
  }

  cambiarRazonSocialDependiente(){
    if (this.dependiente.razonSocial!= ""){
      this.habilitarCelularTelefonoCorreoDependiente=false;
    }
  }

  cambiar_forma_pago(){
    if (this.cliente.financiamiento.formaPago.abreviatura=="EF"){
      this.activacionPlazoCredito=true;
      this.cliente.financiamiento.plazoCredito=null;
    } else {
      this.activacionPlazoCredito=false;
    }
  }

  crearTelefono() {
    this.cliente.telefonos.push(this.telefono);
    this.telefono = new Telefono();
  }
  crearTelefonoDependiente() {
    if (this.cliente.dependientes.length>0 && this.dependiente.razonSocial== ""){
      this.cliente.dependientes.slice(-1)[0].telefonos.push(this.dependienteTelefono);
    } else {
      this.dependiente.telefonos.push(this.dependienteTelefono);
    }
    this.dependienteTelefono = new TelefonoDependiente(); 
  }
  eliminarTelefono(i: number) {
    this.cliente.telefonos.splice(i, 1);
  }
  eliminarTelefonoDependiente(i: number) {
    this.dependiente.telefonos.splice(i, 1);
    this.dependienteTelefono=new TelefonoDependiente();
  }

  crearCelular() {
    this.cliente.celulares.push(this.celular);
    this.celular = new Celular();
  }
  crearCelularDependiente() {
    if (this.cliente.dependientes.length>0 && this.dependiente.razonSocial== ""){
      this.cliente.dependientes.slice(-1)[0].celulares.push(this.dependienteCelular);
    } 
    else {
      this.dependiente.celulares.push(this.dependienteCelular);
    }
    this.dependienteCelular = new CelularDependiente();
  }
  eliminarCelular(i: number) {
    
    this.cliente.celulares.splice(i, 1);
  }
  eliminarCelularDependiente(i: number) {
    this.dependiente.celulares.splice(i, 1);
    this.dependienteCelular=new CelularDependiente();
  }

  crearCorreo() {
    this.cliente.correos.push(this.correo);   
    this.correo = new Correo();
  }
  crear_correo_dependiente() {
    if (this.cliente.dependientes.length>0 && this.dependiente.razonSocial== ""){
      this.cliente.dependientes.slice(-1)[0].correos.push(this.dependienteCorreo);
    } else {
      this.dependiente.correos.push(this.dependienteCorreo);
    }
    this.dependienteCorreo = new CorreoDependiente();
  }
  eliminarCorreo(i: number) {
    this.cliente.correos.splice(i, 1);
  }
  eliminarCorreoDependiente(i: number) {
    this.dependiente.correos.splice(i, 1);
    this.dependienteCorreo=new CorreoDependiente();
  }

  async crearDependiente() {
    if (this.dependienteTelefono.numero!=undefined)
      this.dependiente.telefonos.push(this.dependienteTelefono);
    if (this.dependienteTelefono.numero!=undefined)
      this.dependiente.celulares.push(this.dependienteCelular);
    if (this.dependienteCorreo.email!=undefined)
      this.dependiente.correos.push(this.dependienteCorreo);
    let ubicacion: Ubicacion= new Ubicacion();
    ubicacion.provincia=this.dependienteProvincia;
    ubicacion.canton=this.dependienteCanton;
    ubicacion.parroquia=this.dependienteParroquia;
    if (ubicacion.provincia != "" && ubicacion.canton != "" && ubicacion.parroquia != ""){
      await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
        res => {
          this.dependiente.direccion.ubicacion=res.resultado as Ubicacion;
        },
        err => Swal.fire('Error', err.error.mensaje, 'error')
      );
    }
    this.cliente.dependientes.push(this.dependiente);
    this.dependiente=new Dependiente();
    this.habilitarCelularTelefonoCorreoDependiente=false;
    this.dependienteProvincia="";
    this.dependienteCanton="";
    this.dependienteParroquia="";
    this.dependienteTelefono=new TelefonoDependiente();
    this.dependienteCelular=new CelularDependiente();
    this.dependienteCorreo=new CorreoDependiente();
  }

  eliminarDependiente(i: number) {
    this.cliente.dependientes.splice(i, 1);
    if (this.cliente.dependientes.length<1)
      this.habilitarCelularTelefonoCorreoDependiente=true;
  }

  async crear(event) {
    if (event!=null)
      event.preventDefault();
    //AGREGAR AUXILIAR
    if (this.dependiente.razonSocial != "" && this.dependiente.direccion.direccion != "" ){
      if (this.dependienteTelefono.numero!="")
        this.dependiente.telefonos.push(this.dependienteTelefono);
      if (this.dependienteTelefono.numero!="")
        this.dependiente.celulares.push(this.dependienteCelular);
      if (this.dependienteCorreo.email!="")
        this.dependiente.correos.push(this.dependienteCorreo);
      let ubicacion: Ubicacion= new Ubicacion();
      ubicacion.provincia=this.dependienteProvincia;
      ubicacion.canton=this.dependienteCanton;
      ubicacion.parroquia=this.dependienteParroquia;
      if (ubicacion.provincia != "" && ubicacion.canton != "" && ubicacion.parroquia != ""){
        await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
          res => {
            this.dependiente.direccion.ubicacion=res.resultado as Ubicacion;
          },
          err => Swal.fire('Error', err.error.mensaje, 'error')
        );
      }
      this.cliente.dependientes.push(this.dependiente);
    }
    
    //CLIENTE
    if (this.cliente.direccion.ubicacion.provincia != "" && this.cliente.direccion.ubicacion.canton != "" && this.cliente.direccion.ubicacion.parroquia != ""){
      await this.ubicacionService.obtenerUbicacionID(this.cliente.direccion.ubicacion).then(
        res => {
          this.cliente.direccion.ubicacion= res.resultado as Ubicacion;
        },
        err => Swal.fire('Error', err.error.mensaje, 'error')
      );
    }
    this.sesion= this.sesionService.getSesion();
    this.cliente.estacion=this.sesion.usuario.estacion;
    if (this.telefono.numero!=undefined)
      this.cliente.telefonos.push(this.telefono);
    if (this.celular.numero!=undefined)
      this.cliente.celulares.push(this.celular);
    if (this.correo.email!=undefined)
      this.cliente.correos.push(this.correo);
    this.clienteService.crear(this.cliente).subscribe(
      res => {
        if (res.resultado!= null) {
          Swal.fire('Exito', res.mensaje, 'success');
          this.clienteCrear = res.resultado as Cliente;
          this.dependienteCantones=[];
          this.dependienteParroquias=[];
          this.indiceTipoContribuyente=-1;
          this.clienteProvincia="";
          this.clienteCanton="";
          this.clienteParroquia="";
          this.telefono=new Telefono();
          this.celular=new Celular();
          this.correo=new Correo();
          this.cliente=new Cliente();

          this.dependienteProvincia="";
          this.dependienteCanton="";
          this.dependienteParroquia="";
          this.dependienteTelefono=new TelefonoDependiente();
          this.dependienteCelular=new CelularDependiente();
          this.dependienteCorreo=new CorreoDependiente();
          this.dependiente=new Dependiente();

        } else {
          Swal.fire('Error', res.mensaje, 'error');
        }
      },
      err => Swal.fire('Error', err.error.mensaje, 'error')
    ); 
  }

  async actualizar(event) {
    if (event!=null)
      event.preventDefault();
    //AGREGAR AUXILIARES
    if (this.dependiente.razonSocial != undefined ){
      if (this.dependienteTelefono.numero!=undefined)
        this.dependiente.telefonos.push(this.dependienteTelefono);
      if (this.dependienteTelefono.numero!=undefined)
        this.dependiente.celulares.push(this.dependienteCelular);
      if (this.dependienteCorreo.email!=undefined)
        this.dependiente.correos.push(this.dependienteCorreo);
      let ubicacion: Ubicacion= new Ubicacion();
      ubicacion.provincia=this.dependienteProvincia;
      ubicacion.canton=this.dependienteCanton;
      ubicacion.parroquia=this.dependienteParroquia;
      if (ubicacion.provincia != "" && ubicacion.canton != "" && ubicacion.parroquia != ""){
        await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
          res => {
            this.dependiente.direccion.ubicacion=res.resultado as Ubicacion;
          },
          err => Swal.fire('Error', err.error.mensaje, 'error')
        );
      }
      this.cliente.dependientes.push(this.dependiente);
    }
    //CLIENTE
    if (this.cliente.direccion.ubicacion.provincia != "" && this.cliente.direccion.ubicacion.canton != "" && this.cliente.direccion.ubicacion.parroquia != ""){
      await this.ubicacionService.obtenerUbicacionID(this.cliente.direccion.ubicacion).then(
        res => {
          this.cliente.direccion.ubicacion= res.resultado as Ubicacion;
        },
        err => Swal.fire('Error', err.error.mensaje, 'error')
      );
    }
    
    this.clienteService.actualizar(this.cliente).subscribe(
      res => {
        if (res.resultado!= null) {
          Swal.fire('Exito', res.mensaje, 'success');
          this.clienteActualizar = res.resultado as Cliente;
          this.dependienteCantones=[];
          this.dependienteParroquias=[];
          
          this.dependienteProvincia="";
          this.dependienteCanton="";
          this.dependienteParroquia="";
          this.dependienteTelefono=new TelefonoDependiente();
          this.dependienteCelular=new CelularDependiente();
          this.dependienteCorreo=new CorreoDependiente();
          this.dependiente=new Dependiente();
        }
        else {
          Swal.fire('Error', res.mensaje, 'error');
        }
      },
      err => Swal.fire('Error', err.error.mensaje, 'error')
    );
  }

  provincia(provincia: string) {
    this.cliente.direccion.ubicacion.provincia=provincia;
    this.ubicacionService.obtenerCantones(provincia).subscribe(
      res => {
        if (res.resultado!= null) {
          this.cantones = res.resultado as Ubicacion[];
        } else {
          Swal.fire('Error', res.mensaje, 'error');
        }
      }
    );
  }
  seleccionar_dependiente_provincia(provincia: string) {
    this.dependiente.direccion.ubicacion.provincia=provincia;
    this.ubicacionService.obtenerCantones(provincia).subscribe(
      res => {
        if (res.resultado!= null) {
          this.dependienteCantones=res.resultado as Ubicacion[];
        } else {
          Swal.fire('Error', res.mensaje, 'error');
        }
        
      }
    );
  }

  canton(canton: string) {
    this.cliente.direccion.ubicacion.canton=canton;
    this.ubicacionService.obtenerParroquias(canton).subscribe(
      res => {
        if (res.resultado!= null) {
          this.parroquias = res.resultado as Ubicacion[];
        } else {
          Swal.fire('Error', res.mensaje, 'error');
        }
      }
    );
  }

  seleccionarDependienteCanton(canton: string) {
    this.dependiente.direccion.ubicacion.provincia=canton;
    this.ubicacionService.obtenerParroquias(canton).subscribe(
      res => {
        if (res.resultado!= null) {
          this.dependienteParroquias= res.resultado as Ubicacion[];
        } else {
          Swal.fire('Error', res.mensaje, 'error');
        }
      }
    );
  }

  parroquia(parroquia: string) {
    this.cliente.direccion.ubicacion.parroquia=parroquia;
  }

  seleccionar_dependiente_parroquia(parroquia: string) {
    this.dependiente.direccion.ubicacion.parroquia=parroquia;
  }

  validarTelefono() {
    let digito=this.telefono.numero.substring(0,1);
    if (this.telefono.numero.length!=11 || digito!="0") {
      this.telefono.numero="";
      Swal.fire('Error', "Telefono Invalido", 'error');
    }
  }
  validarTelefonoDependiente() {
    let digito=this.dependienteTelefono.numero.substring(0,1);
    if (this.dependienteTelefono.numero.length!=11 || digito!="0") {
      this.dependienteTelefono.numero="";
      Swal.fire('Error', "Telefono Invalido", 'error');
    }
  }

  validarCelular() {
    let digito=this.celular.numero.substring(0,2);
    if (this.celular.numero.length!=12 || digito!="09") {
      this.celular.numero="";
      Swal.fire('Error', "Celular Invalido", 'error');
    }
  }

  validarCelularDependiente() {
    let digito=this.dependienteCelular.numero.substring(0,2);
    if (this.dependienteCelular.numero.length!=12 || digito!="09") {
      this.dependienteCelular.numero="";
      Swal.fire('Error', "Celular Invalido", 'error');
    }
  }

  validarCorreo() {
    let arroba=this.correo.email.includes("@");
    if (!arroba) {
      this.correo.email="";
      Swal.fire('Error', "Correo Invalido", 'error');
    }
  }
  validarCorreoDependiente() {
    let arroba=this.dependienteCorreo.email.includes("@");
    if (!arroba) {
      this.dependienteCorreo.email="";
      Swal.fire('Error', "Correo Invalido", 'error');
    }
  }

  validarSexoEstadoCivilOrigenIngreso(){
    if (this.cliente.tipoContribuyente.tipo=='JURIDICA') {
      this.activacion_s_es_oi=true;
    } else {
      this.activacion_s_es_oi=false;
      if (this.cliente.id==0){
        this.cliente.genero=this.generos[0];
        this.cliente.estadoCivil=this.estadosCiviles[0];
        this.cliente.origenIngreso=this.origenesIngresos[0];
        this.cliente.calificacionCliente=this.calificacionesClientes[0];
      }
    }
  }

  importar(archivos: FileList){
    let archivoImportar = archivos.item(0);
    this.clienteService.importar(archivoImportar).subscribe(
      res => {
        if (res.resultado!= null) {
          this.dependienteCantones=res.resultado as Ubicacion[];
        } else {
          Swal.fire('Error', res.mensaje, 'error');
        }
      }
    );
  }

  actualizarFacturaDetalle(i: number){

  }

  asignarSeries(i: number){

  }
  eliminarFacturaDetalle(i: number){

  }

  verProducto(){

  }

  guardar(){

  }

  seleccionarPorcentajeDescuentoLinea(){

  }

  seleccionarPrecio(){

  }

  seleccionarCantidad(){

  }

  agregarFacturaDetalle(){

  }

  cambiarProductos(valor: any){

  }

  seleccionarValorDescuentoLinea(){
    
  }

}
