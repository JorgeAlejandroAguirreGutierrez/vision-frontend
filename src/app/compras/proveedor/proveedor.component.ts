import { Component, OnInit, HostListener, Type, ViewChild, Inject, ɵConsole } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { valores, validarSesion, otras, tabs, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { Router } from '@angular/router'; 
import { environment } from '../../../environments/environment';

import { Empresa } from '../../modelos/usuario/empresa';
import { EmpresaService } from '../../servicios/usuario/empresa.service';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { TabService } from '../../componentes/services/tab.service';
import { Cliente } from '../../modelos/cliente/cliente';
import { ClienteService } from '../../servicios/cliente/cliente.service';
import { TipoContribuyente } from '../../modelos/cliente/tipo-contribuyente';
import { TipoContribuyenteService } from '../../servicios/cliente/tipo-contribuyente.service';
import { SegmentoService } from '../../servicios/cliente/segmento.service';
import { Segmento } from '../../modelos/inventario/segmento';
import { GrupoCliente } from '../../modelos/cliente/grupo-cliente'
import { GrupoClienteService } from '../../servicios/cliente/grupo-cliente.service';
import { Ubicacion } from '../../modelos/configuracion/ubicacion';
import { UbicacionService } from '../../servicios/configuracion/ubicacion.service';
import { Telefono } from '../../modelos/cliente/telefono';
import { Celular } from '../../modelos/cliente/celular';
import { Coordenada } from '../../modelos/configuracion/coordenada';
import { Correo } from '../../modelos/cliente/correo';
import { Dependiente } from '../../modelos/cliente/dependiente';
import { TelefonoDependiente } from '../../modelos/cliente/telefono-dependiente';
import { CorreoDependiente } from '../../modelos/cliente/correo-dependiente';
import { CelularDependiente } from '../../modelos/cliente/celular-dependiente';
import { Genero } from '../../modelos/cliente/genero';
import { GeneroService } from '../../servicios/cliente/genero.service';
import { EstadoCivil } from '../../modelos/cliente/estado-civil';
import { EstadoCivilService } from '../../servicios/cliente/estado-civil.service';
import { OrigenIngreso } from '../../modelos/cliente/origen-ingreso';
import { OrigenIngresoService } from '../../servicios/cliente/origen-ingreso.service';
import { CalificacionCliente } from '../../modelos/cliente/calificacion-cliente';
import { CalificacionClienteService } from '../../servicios/cliente/calificacion-cliente.service';
import { PlazoCredito } from '../../modelos/cliente/plazo-credito';
import { PlazoCreditoService } from '../../servicios/cliente/plazo-credito.service';
import { FormaPago } from '../../modelos/cliente/forma-pago';
import { FormaPagoService } from '../../servicios/cliente/forma-pago.service';
import { TipoPago } from '../../modelos/cliente/tipo-pago';
import { TipoPagoService } from '../../servicios/cliente/tipo-pago.service';
import { TipoRetencion } from '../../modelos/configuracion/tipo-retencion';
import { TipoRetencionService } from '../../servicios/configuracion/tipo-retencion.service';
import { Proveedor } from '../../modelos/compra/proveedor';
import { ProveedorService } from '../../servicios/compra/proveedor.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClienteComponent } from '../../clientes/cliente/cliente.component';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss']
})
export class ProveedorComponent implements OnInit {

  sesion: Sesion;
  ComponenteProveedor: Type<any> = ProveedorComponent;

  urlLogo: string = valores.vacio;
  nombreEmpresa: string = valores.vacio;
  urlAvatar: string = environment.prefijoUrlImagenes + "avatar/avatar1.png";

  abrirPanel: boolean = true;
  abrirPanelUbicacion: boolean = false;
  abrirPanelDependiente: boolean = false;
  abrirPanelDatoAdicional: boolean = false;
  abrirPanelAdmin: boolean = false;
  edicion:boolean = false;

  cliente: Cliente = new Cliente;
  proveedor: Proveedor = new Proveedor;
  proveedores: Proveedor[];
  proveedorCrear: Proveedor;
  proveedorBuscar = new Proveedor();
  proveedorActualizar: Proveedor;
  segmento: Segmento = new Segmento();
  segmentos: Segmento[] = [];
  dependiente: Dependiente = new Dependiente();
  gruposClientes: GrupoCliente[];
  generos: Genero[];
  estadosCiviles: EstadoCivil[];
  origenesIngresos: OrigenIngreso[];
  calificacionesClientes: CalificacionCliente[];
  plazosCreditos: PlazoCredito[];
  tiposPagos: TipoPago[];
  formasPagos: FormaPago[];
  tiposContribuyentes: TipoContribuyente[] = [];

  proveedorProvincia: string = valores.vacio;
  proveedorCanton: string = valores.vacio;
  proveedorParroquia: string = valores.vacio;
  dependienteProvincia: string = valores.vacio;
  dependienteCanton: string = valores.vacio;
  dependienteParroquia: string = valores.vacio;
  telefono = new Telefono();
  celular = new Celular();
  correo = new Correo();
  dependienteTelefono = new TelefonoDependiente();
  dependienteCelular = new CelularDependiente();
  dependienteCorreo = new CorreoDependiente();

  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];
  dependienteProvincias: Ubicacion[];
  dependienteCantones: Ubicacion[];
  dependienteParroquias: Ubicacion[];
  activacion_s_es_oi: boolean = true;
  activacionPlazoCredito: boolean = false;

  tiposRetencionesIvaBien: TipoRetencion[];
  tiposRetencionesIvaServicio: TipoRetencion[];
  tiposRetencionesRentaBien: TipoRetencion[];
  tiposRetencionesRentaServicio: TipoRetencion[];

  habilitarTipoContribuyente = false;
  indiceTipoContribuyente: number = -1;
  habilitarCelularTelefonoCorreoDependiente = true;

  //Mapa
  latitud: number = valores.latCiudad; //Tomar de configuación y poner en el init
  longitud: number = valores.lngCiudad;
  posicionCentral: Coordenada = new Coordenada(this.latitud, this.longitud);
  posicionGeografica: Coordenada;
  //mapTypeId: string = 'hybrid';
  //coordenadas: Coordenada[] = [];
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 12,
  };

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Proveedor) => `${row.codigo}`},
    { nombreColumna: 'identificacion', cabecera: 'Indentificación', celda: (row: Proveedor) => `${row.identificacion}`},
    { nombreColumna: 'razon_social', cabecera: 'Razón Social', celda: (row: Proveedor) => `${row.razonSocial}`},
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: Proveedor) => `${row.tipoIdentificacion}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Proveedor) => `${row.estado}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Proveedor>;
  clickedRows = new Set<Proveedor>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private modalService: NgbModal, private proveedorService: ProveedorService, private clienteService: ClienteService, private generoService: GeneroService,
    private estadoCivilService: EstadoCivilService, private origenIngresoService: OrigenIngresoService,
    private calificacionClienteService: CalificacionClienteService, private plazoCreditoService: PlazoCreditoService,
    private tipoPagoService: TipoPagoService, private formaPagoService: FormaPagoService,
    private ubicacionService: UbicacionService, private grupoClienteService: GrupoClienteService,
    private tipoRetencionService: TipoRetencionService, private router: Router, private tabService: TabService,
    private sesionService: SesionService, private empresaService: EmpresaService, private segmentoService: SegmentoService,
    private tipoContribuyenteService: TipoContribuyenteService) { }

    @HostListener('window:keypress', ['$event'])
    keyEvent($event: KeyboardEvent) {
      if (($event.shiftKey || $event.metaKey) && $event.key == "G")
        this.crear(null);
      if (($event.shiftKey || $event.metaKey) && $event.key == "N")
        this.nuevo(null);
      if (($event.shiftKey || $event.metaKey) && $event.key == "E")
        console.log('SHIFT + E');
      if (($event.shiftKey || $event.metaKey) && $event.key == "B")
        console.log('SHIFT + B');
      if (($event.shiftKey || $event.metaKey) && $event.key == "A")
        console.log('SHIFT + A');
    }
  
  ngOnInit() {
    this.obtenerEmpresa();
    this.consultar();
  }

  obtenerEmpresa() {
    let empresa = new Empresa();
    empresa.id = 1;
    this.empresaService.obtener(empresa.id).subscribe({
      next:(res) => {
        empresa = res.resultado as Empresa
        this.urlLogo = environment.prefijoUrlImagenes + "logos/" + empresa.logo;
        this.nombreEmpresa = empresa.razonSocial;
      },
      error:(err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message });
      }
    });
  }
  
  validarIdentificacion() {
    this.proveedorService.obtenerIdentificacion(this.proveedor.identificacion).subscribe({
      next: res => {
        this.proveedorService.validarIdentificacion(this.proveedor.identificacion).subscribe({
          next: res => {
            this.proveedor.tipoIdentificacion = res.resultado.tipo_identificacion;
            this.proveedor.tipoContribuyente = res.resultado.tipo_contribuyente as TipoContribuyente
            if (this.proveedor.tipoContribuyente == null) {
              this.habilitarTipoContribuyente = true;
            } else {
              this.proveedor.tipoContribuyente = this.obtenerTipoContribuyente();
            }
            this.proveedor.segmento.id = 1;
            this.proveedor.grupoProveedor.id = 1;
            this.proveedor.financiamiento.formaPago.id = 1;
            this.cambiarFormaPago();
            this.validarSexoEstadoCivilOrigenIngreso();
          },
          error: err => {
            this.proveedor.tipoIdentificacion = valores.vacio;
            this.proveedor.tipoContribuyente = new TipoContribuyente();
            Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message });
          }
        });
      },
      error: err => {
        this.proveedor.tipoIdentificacion = valores.vacio;
        this.proveedor.tipoContribuyente = new TipoContribuyente();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message });
      }
    });
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.tabService.addNewTab(ProveedorComponent, tabs.tab_proveedor);
  }

  open(content: any, event: any) {
    if (event != null)
      event.preventDefault();
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    }, (reason) => {

    });
  }

  crear(event: any) {
    if (event != null)
      event.preventDefault();
    //AGREGAR DEPENDIENTE
    if (this.dependiente.razonSocial != valores.vacio && this.dependiente.direccion != valores.vacio) {
      if (this.dependienteTelefono.numero != valores.vacio)
        this.dependiente.telefonosDependiente.push(this.dependienteTelefono);
      if (this.dependienteTelefono.numero != valores.vacio)
        this.dependiente.celularesDependiente.push(this.dependienteCelular);
      if (this.dependienteCorreo.email != valores.vacio)
        this.dependiente.correosDependiente.push(this.dependienteCorreo);
      if (this.telefono.numero != valores.vacio)
        this.proveedor.telefonos.push(this.telefono);
      if (this.celular.numero != valores.vacio)
        this.proveedor.celulares.push(this.celular);
      if (this.correo.email != valores.vacio)
        this.proveedor.correos.push(this.correo);
    }
    this.proveedorService.crear(this.proveedor).subscribe({
      next: res => {
        this.proveedor = res.resultado as Proveedor;
        Swal.fire(exito, res.mensaje, exito_swal);
        let indice_tab_activo = tab_activo(this.tabService);
        this.tabService.removeTab(indice_tab_activo);
        this.tabService.addNewTab(ProveedorComponent, tabs.tab_proveedor);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
    });
  }
  
  crearDependiente() {
    if (this.dependienteTelefono.numero != undefined)
      this.dependiente.telefonosDependiente.push(this.dependienteTelefono);
    if (this.dependienteTelefono.numero != undefined)
      this.dependiente.celularesDependiente.push(this.dependienteCelular);
    if (this.dependienteCorreo.email != undefined)
      this.dependiente.correosDependiente.push(this.dependienteCorreo);
    this.proveedor.dependientes.push(this.dependiente);
    this.dependiente = new Dependiente();
    this.habilitarCelularTelefonoCorreoDependiente = false;
    this.dependienteProvincia = valores.vacio;
    this.dependienteCanton = valores.vacio;
    this.dependienteParroquia = valores.vacio;
    this.dependienteTelefono = new TelefonoDependiente();
    this.dependienteCelular = new CelularDependiente();
    this.dependienteCorreo = new CorreoDependiente();
  }

  eliminarDependiente(dependiente: Dependiente) {
    let index = this.proveedor.dependientes.indexOf(dependiente);
    this.proveedor.dependientes.splice(index, 1);
    if (this.proveedor.dependientes.length < 1)
      this.habilitarCelularTelefonoCorreoDependiente = true;
  }

  editarDependiente(dependiente: Dependiente){
    this.edicion = !this.edicion;
    this.dependiente = dependiente;
  }

  confirmarEditarDependiente(row: Dependiente){
    this.edicion = !this.edicion;
  }

  async actualizar(event) {
    if (event != null)
      event.preventDefault();
    //AGREGAR DEPENDIENTES
    if (this.dependiente.razonSocial != valores.vacio) {
      if (this.dependienteTelefono.numero != valores.vacio)
        this.dependiente.telefonosDependiente.push(this.dependienteTelefono);
      if (this.dependienteTelefono.numero != valores.vacio)
        this.dependiente.celularesDependiente.push(this.dependienteCelular);
      if (this.dependienteCorreo.email != valores.vacio)
        this.dependiente.correosDependiente.push(this.dependienteCorreo);
    }
    this.proveedorService.actualizar(this.proveedor).subscribe({
      next: res => {
        if (res.resultado != null) {
          Swal.fire(exito, res.mensaje, exito_swal);
          this.proveedor = res.resultado as Proveedor;
          this.dependienteCantones = [];
          this.dependienteParroquias = [];

          this.dependienteProvincia = "";
          this.dependienteCanton = "";
          this.dependienteParroquia = "";
          this.dependienteTelefono = new TelefonoDependiente();
          this.dependienteCelular = new CelularDependiente();
          this.dependienteCorreo = new CorreoDependiente();
          this.dependiente = new Dependiente();
        }
        else {
          Swal.fire(error, res.mensaje, error_swal);
        }
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.proveedorService.activar(this.proveedor).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.proveedorService.inactivar(this.proveedor).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.proveedorService.consultar().subscribe({
      next: (res) => {
        this.proveedores = res.resultado as Proveedor[]
        this.llenarDataSource(this.proveedores);
      },
      error: (err) => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
    });
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  llenarDataSource(proveedores : Proveedor[]){
    this.dataSource = new MatTableDataSource(proveedores);
    this.dataSource.filterPredicate = (data: Proveedor, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.identificacion.toUpperCase().includes(filter) || data.razonSocial.toUpperCase().includes(filter) ||
      data.tipoIdentificacion.toUpperCase().includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(proveedorSeleccionado: Proveedor) {
    this.proveedor=proveedorSeleccionado;
    if (!this.clickedRows.has(proveedorSeleccionado)){
      this.clickedRows.clear();
      this.clickedRows.add(proveedorSeleccionado);
      this.proveedor = proveedorSeleccionado;
    } else {
      this.clickedRows.clear();
      this.proveedor = new Proveedor();
    }
  }

  buscar(event) {
    if (event!=null)
      event.preventDefault();
    this.proveedorService.buscar(this.proveedorBuscar).subscribe({
      next: res => {
        this.proveedores = res.resultado as Proveedor[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
    });
  }

  cambiarBuscarIdentificacion(){
    this.buscar(null);
  }
  cambiarBuscarRazonSocial(){
    this.buscar(null);
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

  ubicacionNormalizarActualizar() {
    if (this.proveedor.ubicacion != null) {
      this.proveedorProvincia = this.proveedor.ubicacion.provincia;
      this.proveedorCanton = this.proveedor.ubicacion.canton;
      this.proveedorParroquia = this.proveedor.ubicacion.parroquia;
    }
    this.provincia(this.proveedorProvincia);
    this.canton(this.proveedorCanton);
  }


  validarTipoContribuyente() {
    this.proveedor.tipoContribuyente = this.tiposContribuyentes[this.indiceTipoContribuyente];
  }

  obtenerTipoContribuyente() {
    for (let i = 0; i < this.tiposContribuyentes.length; i++) {
      if (this.proveedor.tipoContribuyente.id == this.tiposContribuyentes[i].id)
        return this.tiposContribuyentes[i];
    }
  }

  cambiarRazonSocialDependiente() {
    if (this.dependiente.razonSocial != valores.vacio) {
      this.habilitarCelularTelefonoCorreoDependiente = false;
    }
  }

  cambiarFormaPago() {
    // forma de pago id=1; es PREPAGO
    if (this.proveedor.financiamiento.formaPago.id == 1) {
      this.activacionPlazoCredito = true;
      this.proveedor.financiamiento.plazoCredito = null;
    } else {
      this.activacionPlazoCredito = false;
    }
  }

  crearTelefono() {
    if (this.telefono.numero.length != valores.cero ){
    this.proveedor.telefonos.push(this.telefono);
    this.telefono = new Telefono();
     } else {
      Swal.fire(error, "Ingrese un número telefónico válido", error_swal);
    }
  }
  validarTelefono() {
    let digito = this.telefono.numero.substring(0, 1);
    if (this.telefono.numero.length != 11 || digito != "0") {
      this.telefono.numero = valores.vacio;
      Swal.fire(error, "Telefono Invalido", error_swal);
    }
  }
  eliminarTelefono(i: number) {
    this.proveedor.telefonos.splice(i, 1);
  }

  crearCelular() {
    if (this.celular.numero.length != valores.cero ){
      this.proveedor.celulares.push(this.celular);
      this.celular = new Celular();
       } else {
        Swal.fire(error, "Ingrese un número de celular válido", error_swal);
      }
  }
  validarCelular() {
    let digito = this.celular.numero.substring(0, 2);
    if (this.celular.numero.length != 12 || digito != "09") {
      this.celular.numero = valores.vacio;
      Swal.fire(error, "Celular Invalido", error_swal);
    }
  }
  eliminarCelular(i: number) {
    this.proveedor.celulares.splice(i, 1);
  }

  crearCorreo() {
    if (this.correo.email.length != 0 ){
      this.proveedor.correos.push(this.correo);
      this.correo = new Correo();
       } else {
        Swal.fire(error, "Ingrese un correo válido", error_swal);
      }
  }
  validarCorreo() {
    let arroba = this.correo.email.includes("@");
    if (!arroba) {
      this.correo.email = valores.vacio;
      Swal.fire(error, "Correo Invalido", error_swal);
    }
  }
  eliminarCorreo(i: number) {
    this.proveedor.correos.splice(i, 1);
  }

  crearTelefonoDependiente() {
    if (this.dependienteTelefono.numero.length !=0 ){
      if (this.proveedor.dependientes.length > 0 && this.dependiente.razonSocial == "") {
        this.proveedor.dependientes.slice(-1)[0].telefonosDependiente.push(this.dependienteTelefono);
      } else {
        this.dependiente.telefonosDependiente.push(this.dependienteTelefono);
      }
      this.dependienteTelefono = new TelefonoDependiente();
    }
  }
  validarTelefonoDependiente() {
    let digito = this.dependienteTelefono.numero.substring(0, 1);
    if (this.dependienteTelefono.numero.length != 11 || digito != "0") {
      this.dependienteTelefono.numero = "";
      Swal.fire(error, "Telefono Invalido", error_swal);
    }
  }
  eliminarTelefonoDependiente(i: number) {
    this.dependiente.telefonosDependiente.splice(i, 1);
    this.dependienteTelefono = new TelefonoDependiente();
  }

  crearCelularDependiente() {
    if (this.dependienteCelular.numero.length != valores.cero ){
      if (this.proveedor.dependientes.length > 0 && this.dependiente.razonSocial == valores.vacio) {
        this.proveedor.dependientes.slice(-1)[0].celularesDependiente.push(this.dependienteCelular);
      }
      else {
        this.dependiente.celularesDependiente.push(this.dependienteCelular);
      }
      this.dependienteCelular = new CelularDependiente();
    }
  }
  validarCelularDependiente() {
    let digito = this.dependienteCelular.numero.substring(0, 2);
    if (this.dependienteCelular.numero.length != 12 || digito != "09") {
      this.dependienteCelular.numero = "";
      Swal.fire(error, "Celular Invalido", error_swal);
    }
  }
  eliminarCelularDependiente(i: number) {
    this.dependiente.celularesDependiente.splice(i, 1);
    this.dependienteCelular = new CelularDependiente();
  }

  crearCorreoDependiente() {
    if (this.dependienteCorreo.email.length != valores.cero ){
      if (this.proveedor.dependientes.length > 0 && this.dependiente.razonSocial == valores.vacio) {
        this.proveedor.dependientes.slice(-1)[0].correosDependiente.push(this.dependienteCorreo);
      } else {
        this.dependiente.correosDependiente.push(this.dependienteCorreo);
      }
      this.dependienteCorreo = new CorreoDependiente();
    }
  }
  validarCorreoDependiente() {
    let arroba = this.dependienteCorreo.email.includes("@");
    if (!arroba) {
      this.dependienteCorreo.email = valores.vacio;
      Swal.fire(error, "Correo Invalido", error_swal);
    }
  }
  eliminarCorreoDependiente(i: number) {
    this.dependiente.correosDependiente.splice(i, 1);
    this.dependienteCorreo = new CorreoDependiente();
  }


  provincia(provincia: string) {
    this.proveedor.ubicacion.provincia = provincia;
    this.ubicacionService.consultarCantones(provincia).subscribe(
      res => {
        if (res.resultado != null) {
          this.cantones = res.resultado as Ubicacion[];
        } else {
          Swal.fire(error, res.mensaje, error_swal);
        }
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccionarDependienteProvincia(provincia: string) {
    this.dependiente.ubicacion.provincia = provincia;
    this.ubicacionService.consultarCantones(provincia).subscribe(
      res => {
        if (res.resultado != null) {
          this.dependienteCantones = res.resultado as Ubicacion[];
        } else {
          Swal.fire(error, res.mensaje, error_swal);
        }
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
    );
  }

  canton(canton: string) {
    this.proveedor.ubicacion.canton = canton;
    this.ubicacionService.consultarParroquias(canton).subscribe(
      res => {
        if (res.resultado != null) {
          this.parroquias = res.resultado as Ubicacion[];
        } else {
          Swal.fire(error, res.mensaje, error_swal);
        }
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccionarAuDependienteCanton(canton: string) {
    this.dependiente.ubicacion.provincia = canton;
    this.ubicacionService.consultarParroquias(canton).subscribe(
      res => {
        if (res.resultado != null) {
          this.dependienteParroquias = res.resultado as Ubicacion[];
        } else {
          Swal.fire(error, res.mensaje, error_swal);
        }
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
    );
  }

  parroquia(parroquia: string) {
    this.proveedor.ubicacion.parroquia = parroquia;
  }

  seleccionarAuxiliarParroquia(parroquia: string) {
    this.dependiente.ubicacion.parroquia = parroquia;
  }

  validarSexoEstadoCivilOrigenIngreso() {
    if (this.proveedor.tipoContribuyente.tipo == otras.tipoContribuyenteJuridica) {
      this.activacion_s_es_oi = true;
    } else {
      this.activacion_s_es_oi = false;
      if (this.proveedor.id == 0) {
        this.proveedor.genero = this.generos[0];
        this.proveedor.estadoCivil = this.estadosCiviles[0];
        this.proveedor.origenIngreso = this.origenesIngresos[0];
        this.proveedor.calificacionCliente = this.calificacionesClientes[0];
      }
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  importar(archivos: FileList) {
    let archivoImportar = archivos.item(0);
    this.clienteService.importar(archivoImportar).subscribe(
      res => {
        if (res.resultado != null) {
          this.dependienteCantones = res.resultado as Ubicacion[];
        } else {
          Swal.fire(error, res.mensaje, error_swal);
        }
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
    );
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  dialogoMapas(): void {
    const dialogRef = this.dialog.open(DialogoMapaProveedorComponent, {
      width: '80%',
      data: this.posicionGeografica as Coordenada
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.posicionGeografica = result as Coordenada;
        this.posicionCentral = this.posicionGeografica;
      }
    });
  }

}

@Component({
  selector: 'dialogo-mapa-proveedor',
  templateUrl: 'dialogo-mapa-proveedor.component.html',
})
export class DialogoMapaProveedorComponent {

  mapa: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogoMapaProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Coordenada) { }

  onNoClick(): void {
    this.dialogRef.close();
    //console.log('El dialogo para selección de coordenada fue cancelado');
    this.data = new Coordenada(0,0);
  }

  coordenadaSeleccionada(event: any) {
    //console.log(event);
    if (event && event.latitud != 0) {
      this.data = event as Coordenada;
      //this.producto.grupo_producto = grupoProductoRecibido;
      console.log(this.data);
    } else {
      this.data = new Coordenada(0,0);
    }
  }
}