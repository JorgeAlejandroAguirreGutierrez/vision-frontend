import { Router } from '@angular/router';
import { Component, OnInit, HostListener, Input, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ClienteService } from '../../servicios/cliente.service';
import { GeneroService } from '../../servicios/genero.service';
import { EstadoCivilService } from '../../servicios/estado-civil.service';
import { OrigenIngresoService } from '../../servicios/origen-ingreso.service';
import { CalificacionClienteService } from '../../servicios/calificacion-cliente.service';
import { PlazoCreditoService } from '../../servicios/plazo-credito.service';
import { FormaPagoService } from '../../servicios/forma-pago.service';
import { TipoPagoService } from '../../servicios/tipo-pago.service';
import { UbicacionService } from '../../servicios/ubicacion.service';
import { Cliente } from '../../modelos/cliente';
import {GrupoCliente} from '../../modelos/grupo-cliente'
import { Genero } from '../../modelos/genero';
import { EstadoCivil } from '../../modelos/estado-civil';
import { OrigenIngreso } from '../../modelos/origen-ingreso';
import { CalificacionCliente } from '../../modelos/calificacion-cliente';
import { PlazoCredito } from '../../modelos/plazo-credito';
import { FormaPago } from '../../modelos/forma-pago';
import { TipoPago } from '../../modelos/tipo-pago';
import { Telefono } from '../../modelos/telefono';
import { Celular } from '../../modelos/celular';
import { Correo } from '../../modelos/correo';
import { Ubicacion } from '../../modelos/ubicacion';
import { TipoContribuyente } from '../../modelos/tipo-contribuyente';
import { GrupoClienteService } from '../../servicios/grupo-cliente.service';
import { TipoRetencionService } from '../../servicios/tipo-retencion.service';
import { TipoRetencion } from '../../modelos/tipo-retencion';
import { SesionService } from '../../servicios/sesion.service';
import { Sesion } from '../../modelos/sesion';
import { Auxiliar } from '../../modelos/auxiliar';
import { EmpresaService } from '../../servicios/empresa.service';
import { Empresa } from '../../modelos/empresa';
import { environment } from '../../../environments/environment';
import { TipoContribuyenteService } from '../../servicios/tipo-contribuyente.service';
import { TelefonoAuxiliar } from '../../modelos/telefono-auxiliar';
import { CorreoAuxiliar } from '../../modelos/correo-auxiliar';
import { CelularAuxiliar } from '../../modelos/celular-auxiliar';
import { Factura } from '../../modelos/factura';
import { FacturaDetalle } from '../../modelos/factura-detalle';

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
  habilitarCelularTelefonoCorreoAuxiliar=true;

  cliente: Cliente;
  clienteCrear: Cliente;
  clienteActualizar: Cliente;
  clientes: Cliente[];
  auxiliar: Auxiliar=new Auxiliar();
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
  auxiliarProvincia: string="";
  auxiliarCanton: string="";
  auxiliarParroquia: string="";
  telefono = new Telefono();
  celular = new Celular();
  correo = new Correo();
  auxiliarTelefono = new TelefonoAuxiliar();
  auxiliarCelular = new CelularAuxiliar();
  auxiliarCorreo = new CorreoAuxiliar();
  facturaCrear: Factura=new Factura();

  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];
  auxiliarProvincias: Ubicacion[];
  auxiliarCantones: Ubicacion[];
  auxiliarParroquias: Ubicacion[];
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
  urlAvatar: string= environment.prefijo_url_imagenes+"avatar/avatar1.png";

  isLinear = false;
  isEditable=false;
  completed=false;
  categoriaProducto="B";
  estado="EMITIDA";
  indiceDetalle=0;
  detalleEntregado="";
  buscarSerie:string="";

  seleccionAuxiliar: boolean =false;
  seleccionFacturar: boolean =false;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  seleccionProducto = new FormControl();
  seleccionIdentificacionCliente = new FormControl();
  seleccionRazonSocialCliente = new FormControl();
  seleccionIdentificacionClienteFactura = new FormControl();
  seleccionRazonSocialClienteFactura = new FormControl();

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
        this.auxiliarProvincias = res.resultado as Ubicacion[]
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
    console.log(this.cliente);
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
          this.cliente.construir();
          this.validarSexoEstadoCivilOrigenIngreso();
          this.ubicacionNormalizarActualizar();
          console.log(this.cliente);
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
    this.empresaService.obtener(empresa).subscribe(
      res => {
        empresa= res.resultado as Empresa
        this.urlLogo=environment.prefijo_url_imagenes+"logos/"+empresa.logo;
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
                this.cliente.tipoIdentificacion='';
                this.cliente.identificacion='';
                Swal.fire('Error', res.mensaje, 'error');
              } 
            },
            err => Swal.fire('Error', err.error.mensaje, 'error')
          );
        } else {
          this.cliente.tipoIdentificacion='';
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

  cambiarRazonSocialAuxiliar(){
    if (this.auxiliar.razonSocial!= ""){
      this.habilitarCelularTelefonoCorreoAuxiliar=false;
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
  crearTelefonoAuxiliar() {
    if (this.cliente.auxiliares.length>0 && this.auxiliar.razonSocial== ""){
      this.cliente.auxiliares.slice(-1)[0].telefonos.push(this.auxiliarTelefono);
    } else {
      this.auxiliar.telefonos.push(this.auxiliarTelefono);
    }
    this.auxiliarTelefono = new TelefonoAuxiliar(); 
  }
  eliminarTelefono(i: number) {
    this.cliente.telefonos.splice(i, 1);
  }
  eliminarTelefonoAuxiliar(i: number) {
    this.auxiliar.telefonos.splice(i, 1);
    this.auxiliarTelefono=new TelefonoAuxiliar();
  }

  crearCelular() {
    this.cliente.celulares.push(this.celular);
    this.celular = new Celular();
  }
  crearCelularAuxiliar() {
    if (this.cliente.auxiliares.length>0 && this.auxiliar.razonSocial== ""){
      this.cliente.auxiliares.slice(-1)[0].celulares.push(this.auxiliarCelular);
    } 
    else {
      this.auxiliar.celulares.push(this.auxiliarCelular);
    }
    this.auxiliarCelular = new CelularAuxiliar();
  }
  eliminarCelular(i: number) {
    
    this.cliente.celulares.splice(i, 1);
  }
  eliminarCelularAuxiliar(i: number) {
    this.auxiliar.celulares.splice(i, 1);
    this.auxiliarCelular=new CelularAuxiliar();
  }

  crearCorreo() {
    this.cliente.correos.push(this.correo);   
    this.correo = new Correo();
  }
  crear_correo_auxiliar() {
    if (this.cliente.auxiliares.length>0 && this.auxiliar.razonSocial== ""){
      this.cliente.auxiliares.slice(-1)[0].correos.push(this.auxiliarCorreo);
    } else {
      this.auxiliar.correos.push(this.auxiliarCorreo);
    }
    this.auxiliarCorreo = new CorreoAuxiliar();
  }
  eliminarCorreo(i: number) {
    this.cliente.correos.splice(i, 1);
  }
  eliminarCorreoAuxiliar(i: number) {
    this.auxiliar.correos.splice(i, 1);
    this.auxiliarCorreo=new CorreoAuxiliar();
  }

  async crearAuxiliar() {
    if (this.auxiliarTelefono.numero!=undefined)
      this.auxiliar.telefonos.push(this.auxiliarTelefono);
    if (this.auxiliarTelefono.numero!=undefined)
      this.auxiliar.celulares.push(this.auxiliarCelular);
    if (this.auxiliarCorreo.email!=undefined)
      this.auxiliar.correos.push(this.auxiliarCorreo);
    let ubicacion: Ubicacion= new Ubicacion();
    ubicacion.provincia=this.auxiliarProvincia;
    ubicacion.canton=this.auxiliarCanton;
    ubicacion.parroquia=this.auxiliarParroquia;
    if (ubicacion.provincia != "" && ubicacion.canton != "" && ubicacion.parroquia != ""){
      await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
        res => {
          this.auxiliar.direccion.ubicacion=res.resultado as Ubicacion;
        },
        err => Swal.fire('Error', err.error.mensaje, 'error')
      );
    }
    this.cliente.auxiliares.push(this.auxiliar);
    this.auxiliar=new Auxiliar();
    this.habilitarCelularTelefonoCorreoAuxiliar=false;
    this.auxiliarProvincia="";
    this.auxiliarCanton="";
    this.auxiliarParroquia="";
    this.auxiliarTelefono=new TelefonoAuxiliar();
    this.auxiliarCelular=new CelularAuxiliar();
    this.auxiliarCorreo=new CorreoAuxiliar();
  }

  eliminarAuxiliar(i: number) {
    this.cliente.auxiliares.splice(i, 1);
    if (this.cliente.auxiliares.length<1)
      this.habilitarCelularTelefonoCorreoAuxiliar=true;
  }

  async crear(event) {
    if (event!=null)
      event.preventDefault();
    //AGREGAR AUXILIAR
    if (this.auxiliar.razonSocial != "" && this.auxiliar.direccion.direccion != "" ){
      if (this.auxiliarTelefono.numero!="")
        this.auxiliar.telefonos.push(this.auxiliarTelefono);
      if (this.auxiliarTelefono.numero!="")
        this.auxiliar.celulares.push(this.auxiliarCelular);
      if (this.auxiliarCorreo.email!="")
        this.auxiliar.correos.push(this.auxiliarCorreo);
      let ubicacion: Ubicacion= new Ubicacion();
      ubicacion.provincia=this.auxiliarProvincia;
      ubicacion.canton=this.auxiliarCanton;
      ubicacion.parroquia=this.auxiliarParroquia;
      if (ubicacion.provincia != "" && ubicacion.canton != "" && ubicacion.parroquia != ""){
        await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
          res => {
            this.auxiliar.direccion.ubicacion=res.resultado as Ubicacion;
          },
          err => Swal.fire('Error', err.error.mensaje, 'error')
        );
      }
      this.cliente.auxiliares.push(this.auxiliar);
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
    this.cliente.puntoVenta=this.sesion.usuario.puntoVenta;
    if (this.telefono.numero!=undefined)
      this.cliente.telefonos.push(this.telefono);
    if (this.celular.numero!=undefined)
      this.cliente.celulares.push(this.celular);
    if (this.correo.email!=undefined)
      this.cliente.correos.push(this.correo);
    console.log(this.cliente);
    this.clienteService.crear(this.cliente).subscribe(
      res => {
        if (res.resultado!= null) {
          Swal.fire('Exito', res.mensaje, 'success');
          this.clienteCrear = res.resultado as Cliente;
          this.auxiliarCantones=[];
          this.auxiliarParroquias=[];
          this.indiceTipoContribuyente=-1;
          this.clienteProvincia="";
          this.clienteCanton="";
          this.clienteParroquia="";
          this.telefono=new Telefono();
          this.celular=new Celular();
          this.correo=new Correo();
          this.cliente=new Cliente();

          this.auxiliarProvincia="";
          this.auxiliarCanton="";
          this.auxiliarParroquia="";
          this.auxiliarTelefono=new TelefonoAuxiliar();
          this.auxiliarCelular=new CelularAuxiliar();
          this.auxiliarCorreo=new CorreoAuxiliar();
          this.auxiliar=new Auxiliar();

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
    if (this.auxiliar.razonSocial != undefined ){
      if (this.auxiliarTelefono.numero!=undefined)
        this.auxiliar.telefonos.push(this.auxiliarTelefono);
      if (this.auxiliarTelefono.numero!=undefined)
        this.auxiliar.celulares.push(this.auxiliarCelular);
      if (this.auxiliarCorreo.email!=undefined)
        this.auxiliar.correos.push(this.auxiliarCorreo);
      let ubicacion: Ubicacion= new Ubicacion();
      ubicacion.provincia=this.auxiliarProvincia;
      ubicacion.canton=this.auxiliarCanton;
      ubicacion.parroquia=this.auxiliarParroquia;
      if (ubicacion.provincia != "" && ubicacion.canton != "" && ubicacion.parroquia != ""){
        await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
          res => {
            this.auxiliar.direccion.ubicacion=res.resultado as Ubicacion;
          },
          err => Swal.fire('Error', err.error.mensaje, 'error')
        );
      }
      this.cliente.auxiliares.push(this.auxiliar);
    }
    //CLIENTE
    console.log(this.cliente);
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
          this.auxiliarCantones=[];
          this.auxiliarParroquias=[];
          
          this.auxiliarProvincia="";
          this.auxiliarCanton="";
          this.auxiliarParroquia="";
          this.auxiliarTelefono=new TelefonoAuxiliar();
          this.auxiliarCelular=new CelularAuxiliar();
          this.auxiliarCorreo=new CorreoAuxiliar();
          this.auxiliar=new Auxiliar();
        }
        else {
          Swal.fire('Error', res.mensaje, 'error');
        }
      },
      err => Swal.fire('Error', err.error.mensaje, 'error')
    );
  }

  eliminar(cliente: Cliente) {
    this.clienteService.eliminar(cliente).subscribe(
      res => {
        if (res.resultado!=null) {
          Swal.fire('Exito', res.mensaje, 'success');
          this.cliente = res.resultado as Cliente
          this.ngOnInit();
        } else {
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
  seleccionar_auxiliar_provincia(provincia: string) {
    this.auxiliar.direccion.ubicacion.provincia=provincia;
    this.ubicacionService.obtenerCantones(provincia).subscribe(
      res => {
        if (res.resultado!= null) {
          this.auxiliarCantones=res.resultado as Ubicacion[];
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

  seleccionarAuxiliarCanton(canton: string) {
    this.auxiliar.direccion.ubicacion.provincia=canton;
    this.ubicacionService.obtenerParroquias(canton).subscribe(
      res => {
        if (res.resultado!= null) {
          this.auxiliarParroquias= res.resultado as Ubicacion[];
        } else {
          Swal.fire('Error', res.mensaje, 'error');
        }
      }
    );
  }

  parroquia(parroquia: string) {
    this.cliente.direccion.ubicacion.parroquia=parroquia;
  }

  seleccionar_auxiliar_parroquia(parroquia: string) {
    this.auxiliar.direccion.ubicacion.parroquia=parroquia;
  }

  validarTelefono() {
    let digito=this.telefono.numero.substr(0,1);
    if (this.telefono.numero.length!=11 || digito!="0") {
      this.telefono.numero="";
      Swal.fire('Error', "Telefono Invalido", 'error');
    }
  }
  validarTelefonoAuxiliar() {
    let digito=this.auxiliarTelefono.numero.substr(0,1);
    if (this.auxiliarTelefono.numero.length!=11 || digito!="0") {
      this.auxiliarTelefono.numero="";
      Swal.fire('Error', "Telefono Invalido", 'error');
    }
  }

  validarCelular() {
    let digito=this.celular.numero.substr(0,2);
    if (this.celular.numero.length!=12 || digito!="09") {
      this.celular.numero="";
      Swal.fire('Error', "Celular Invalido", 'error');
    }
  }

  validarCelularAuxiliar() {
    let digito=this.auxiliarCelular.numero.substr(0,2);
    if (this.auxiliarCelular.numero.length!=12 || digito!="09") {
      this.auxiliarCelular.numero="";
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
  validarCorreoAuxiliar() {
    let arroba=this.auxiliarCorreo.email.includes("@");
    if (!arroba) {
      this.auxiliarCorreo.email="";
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
          this.auxiliarCantones=res.resultado as Ubicacion[];
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
