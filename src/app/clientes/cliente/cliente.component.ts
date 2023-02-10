import { Component, OnInit, HostListener, Type, ViewChild, Inject, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { valores, mensajes, otras, tabs, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { environment } from '../../../environments/environment';
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
import { Correo } from '../../modelos/cliente/correo';
import { Coordenada } from '../../modelos/configuracion/coordenada';
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
import { TipoIdentificacion } from '../../modelos/configuracion/tipo-identificacion';
import { TipoIdentificacionService } from '../../servicios/configuracion/tipo-identificacion.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;
  si: string = valores.si;
  no: string = valores.no;
  casa: string = valores.etiquetaCasa;
  trabajo: string = valores.etiquetaTrabajo;
  empresa: string = valores.etiquetaEmpresa;
  direccionPredeterminada: string = valores.si;

  sesion: Sesion;
  ComponenteCliente: Type<any> = ClienteComponent;

  abrirPanelNuevoCliente: boolean = true;
  abrirPanelUbicacion: boolean = true;
  abrirPanelDependiente: boolean = false;
  verPanelDependiente: boolean = false;
  abrirPanelDatoAdicional: boolean = false;
  verPanelDatoAdicional: boolean = false;
  abrirPanelAdminCliente: boolean = true;
  estadoCliente: boolean = true;
  deshabilitarObligado: boolean = false;
  deshabilitarDinardap: boolean = true;
  deshabilitarPlazoCredito: boolean = true;
  deshabilitarTipoContribuyente: boolean = true;
  deshabilitarCliente: boolean = false;
  deshabilitarDireccion: boolean = false;
  deshabilitarDependiente: boolean = false;
  verIconoEditarDependiente: boolean = false;
  deshabilitarDatoAdicional: boolean = false;


  urlLogo: string = ""; 
  nombreEmpresa: string = "";
  provinciaCliente: string = "";
  cantonCliente: string = "";
  parroquiaCliente: string = "";
  provinciaDependiente: string = "";
  cantonDependiente: string = "";
  parroquiaDependiente: string = "";
  urlAvatar: string = environment.prefijoUrlImagenes + "avatar/avatar1.png";

  cliente: Cliente = new Cliente();
  telefono: Telefono = new Telefono();
  celular: Celular = new Celular();
  correo: Correo = new Correo();
  telefonoDependiente: TelefonoDependiente = new TelefonoDependiente();
  celularDependiente: CelularDependiente = new CelularDependiente();
  correoDependiente: CorreoDependiente = new CorreoDependiente();
  dependiente: Dependiente = new Dependiente();

  clientes: Cliente[];
  tiposIdentificaciones: TipoIdentificacion[];
  segmentos: Segmento[] = [];
  gruposClientes: GrupoCliente[];
  generos: Genero[];
  estadosCiviles: EstadoCivil[];
  origenesIngresos: OrigenIngreso[];
  calificacionesClientes: CalificacionCliente[];
  plazosCreditos: PlazoCredito[];
  formasPagos: FormaPago[];
  tiposContribuyentes: TipoContribuyente[] = [];

  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];
  provinciasDependiente: Ubicacion[];
  cantonesDependiente: Ubicacion[];
  parroquiasDependiente: Ubicacion[];

  tiposRetencionesIvaBien: TipoRetencion[];
  tiposRetencionesIvaServicio: TipoRetencion[];
  tiposRetencionesRentaBien: TipoRetencion[];
  tiposRetencionesRentaServicio: TipoRetencion[];

  archivoImportar: File;

  latInicial: number = valores.latCiudad;
  posicionCentralDireccion: Coordenada = new Coordenada(valores.latCiudad, valores.lngCiudad);
  posicionCentralDependiente: Coordenada = new Coordenada(valores.latCiudad, valores.lngCiudad);
  posicionGeograficaDireccion: Coordenada = new Coordenada(valores.latCiudad, valores.lngCiudad);
  posicionGeograficaDependiente: Coordenada = new Coordenada(valores.latCiudad, valores.lngCiudad);
  //coordenadas: Coordenada[] = [];
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 12,
  };

  columnasCliente: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Cliente) => `${row.codigo}` },
    { nombreColumna: 'identificacion', cabecera: 'Indentificación', celda: (row: Cliente) => `${row.identificacion}` },
    { nombreColumna: 'razonSocial', cabecera: 'Razón Social', celda: (row: Cliente) => `${row.razonSocial}` },
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: Cliente) => `${row.direccion}` },
    { nombreColumna: 'obligado', cabecera: 'Obligado', celda: (row: Cliente) => `${row.tipoContribuyente.obligadoContabilidad}` },
    { nombreColumna: 'especial', cabecera: 'Especial', celda: (row: Cliente) => `${row.especial}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Cliente) => `${row.estado}` }
  ];
  cabeceraCliente: string[] = this.columnasCliente.map(titulo => titulo.nombreColumna);
  dataSourceCliente: MatTableDataSource<Cliente>;
  clickedRows = new Set<Cliente>();

  columnasDependiente: any[] = [
    { nombreColumna: 'razonSocial', cabecera: 'Razón Social', celda: (row: Dependiente) => `${row.razonSocial}` },
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: Dependiente) => `${row.direccion}` },
    { nombreColumna: 'provincia', cabecera: 'Provincia', celda: (row: Dependiente) => `${row.ubicacion.provincia}` },
    { nombreColumna: 'canton', cabecera: 'Cantón', celda: (row: Dependiente) => `${row.ubicacion.canton}` },
    { nombreColumna: 'parroquia', cabecera: 'Parroquia', celda: (row: Dependiente) => `${row.ubicacion.parroquia}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Cliente) => `${row.estado}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabeceraDependientes: string[] = this.columnasDependiente.map(titulo => titulo.nombreColumna);
  dataSourceDependiente: MatTableDataSource<Dependiente>;
  clickedRowsDependiente = new Set<Dependiente>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;
  @ViewChild("inputFiltroDependiente") inputFiltroDependiente: ElementRef;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G")
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N")
      this.nuevo(null);
  }

  constructor(private renderer: Renderer2, public dialog: MatDialog, private clienteService: ClienteService, 
    private tipoIdentificacionService: TipoIdentificacionService, private generoService: GeneroService,
    private estadoCivilService: EstadoCivilService, private origenIngresoService: OrigenIngresoService,
    private calificacionClienteService: CalificacionClienteService, private plazoCreditoService: PlazoCreditoService,
    private formaPagoService: FormaPagoService,
    private ubicacionService: UbicacionService, private grupoClienteService: GrupoClienteService,
    private tipoRetencionService: TipoRetencionService, private router: Router, 
    private sesionService: SesionService, private segmentoService: SegmentoService,
    private tipoContribuyenteService: TipoContribuyenteService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarTipoIdentificacion();
    this.consultarTipoContribuyente();
    this.consultarSegmento();
    this.consultarGrupoCliente();
    this.consultarGenero();
    this.consultarEstadoCivil();
    this.consultarOrigenIngreso();
    this.consultarCalificacionCliente();
    this.consultarPlazoCredito();
    this.consultarFormaPago();
    this.consultarProvincias();
    this.consultarIvaBien();
    this.consultarIvaServicio();
    this.consultarRentaBien();
    this.consultarRentaServicio();
  }

  consultarTipoIdentificacion(){
    this.tipoIdentificacionService.consultar().subscribe({
      next: (res) => {
        this.tiposIdentificaciones = res.resultado as TipoIdentificacion[];
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarTipoContribuyente(){
    this.tipoContribuyenteService.consultar().subscribe({
      next: (res) => {
        this.tiposContribuyentes = res.resultado as TipoContribuyente[];
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarSegmento(){
    this.segmentoService.consultarActivos().subscribe({
      next: (res) => {
        this.segmentos = res.resultado as Segmento[];
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarGrupoCliente(){
    this.grupoClienteService.consultarActivos().subscribe({
      next: (res) => {
        this.gruposClientes = res.resultado as GrupoCliente[]
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarGenero(){
    this.generoService.consultarActivos().subscribe({
      next: (res) => {
        this.generos = res.resultado as Genero[]
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarEstadoCivil(){
    this.estadoCivilService.consultarActivos().subscribe({
      next: (res) => {
        this.estadosCiviles = res.resultado as EstadoCivil[]
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarOrigenIngreso(){
    this.origenIngresoService.consultarActivos().subscribe({
      next: (res) => {
        this.origenesIngresos = res.resultado as OrigenIngreso[];
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarCalificacionCliente(){
    this.calificacionClienteService.consultarActivos().subscribe({
      next: res => {
        this.calificacionesClientes = res.resultado as CalificacionCliente[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarPlazoCredito(){
    this.plazoCreditoService.consultarActivos().subscribe({
      next: res => {
        this.plazosCreditos = res.resultado as PlazoCredito[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarFormaPago(){
    this.formaPagoService.consultarActivos().subscribe({
      next: res => {
        this.formasPagos = res.resultado as FormaPago[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarProvincias(){
    this.ubicacionService.consultarProvincias().subscribe({
      next: res => {
        this.provincias = res.resultado as Ubicacion[];
        this.provinciasDependiente = res.resultado as Ubicacion[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarIvaBien(){
    this.tipoRetencionService.consultarIvaBien().subscribe({
      next: res => {
        this.tiposRetencionesIvaBien = res.resultado as TipoRetencion[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarIvaServicio(){
    this.tipoRetencionService.consultarIvaServicio().subscribe({
      next: res => {
        this.tiposRetencionesIvaServicio = res.resultado as TipoRetencion[]

      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarRentaBien(){
    this.tipoRetencionService.consultarRentaBien().subscribe({
      next: res => {
        this.tiposRetencionesRentaBien = res.resultado as TipoRetencion[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarRentaServicio(){
    this.tipoRetencionService.consultarRentaServicio().subscribe({
      next: res => {
        this.tiposRetencionesRentaServicio = res.resultado as TipoRetencion[];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  //CRUD CLIENTE
  nuevo(event){
    if (event != null)
      event.preventDefault();
    this.cliente = new Cliente();
    this.provinciaCliente = "";
    this.cantonCliente = "";
    this.parroquiaCliente = "";
    this.telefono = new Telefono();
    this.celular = new Celular();
    this.correo = new Correo();
    this.posicionCentralDireccion = new Coordenada(valores.latCiudad, valores.lngCiudad);
    this.posicionGeograficaDireccion = new Coordenada(valores.latCiudad, valores.lngCiudad);
    this.clickedRows.clear();
    this.borrarFiltroCliente();
    this.deshabilitarObligado = false;
    this.abrirPanelUbicacion = true;
  }

  crear(event: any) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormularioCliente())
      return;    
    this.cliente.estacion = this.sesion.usuario.estacion;
    this.agregarTelefonoCorreo();
    this.validarDependiente();
    console.log(this.cliente);
    this.clienteService.crear(this.cliente).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  agregarTelefonoCorreo() {
    if (this.telefono.numero != valores.vacio)
      this.cliente.telefonos.push({ ... this.telefono});
    if (this.celular.numero != valores.vacio)
      this.cliente.celulares.push({ ... this.celular});
    if (this.correo.email != valores.vacio)
      this.cliente.correos.push(this.correo);
  }

  actualizar(event: any) {
    if (event != null)
      event.preventDefault();
    this.agregarTelefonoCorreo();
    this.validarDependiente();
    console.log(this.cliente);
    this.clienteService.actualizar(this.cliente).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  validarDependiente() {
    if(this.verIconoEditarDependiente){ // Icono Actualizar, se está algún Dependiente seleccionado
      this.actualizarDependiente();
    } else { // Icono agregar, si es nuevo dependiente
      this.crearDependiente();
    }
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.clienteService.activar(this.cliente).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.clienteService.inactivar(this.cliente).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.clienteService.consultar().subscribe({
      next: res => {
        this.clientes = res.resultado as Cliente[]
        this.llenarTablaCliente(this.clientes);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaCliente(clientes: Cliente[]) {
    this.dataSourceCliente = new MatTableDataSource(clientes);
    this.dataSourceCliente.filterPredicate = (data: Cliente, filter: string): boolean =>
      data.codigo.includes(filter) || data.identificacion.includes(filter) || data.razonSocial.includes(filter) ||
      data.direccion.includes(filter) || data.tipoContribuyente.obligadoContabilidad.includes(filter) || data.especial.includes(filter) ||
      data.estado.includes(filter);
    this.dataSourceCliente.paginator = this.paginator;
    this.dataSourceCliente.sort = this.sort;
  }

  seleccion(cliente: any) {
    if (!this.clickedRows.has(cliente)){
      this.clickedRows.clear();
      this.clickedRows.add(cliente);
      //this.cliente = { ... cliente};
      this.obtenerCliente(cliente.id)
    } else {
      this.nuevo(null);
    }
  }

  obtenerCliente(id: number){
    this.clienteService.obtener(id).subscribe({
      next: res => {
        this.cliente = res.resultado as Cliente;
        this.llenarUbicacion();
        this.recuperarCoordenadasCliente();
        console.log(this.cliente);
        this.llenarTablaDependiente(this.cliente.dependientes);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarUbicacion(){
    // Llenar ubicación dependiente
    this.provinciaCliente = this.cliente.ubicacion.provincia;
    this.ubicacionService.consultarCantones(this.provinciaCliente).subscribe({
      next: res => {
        this.cantones = res.resultado as Ubicacion[];
        this.cantonCliente = this.cliente.ubicacion.canton;
        this.ubicacionService.consultarParroquias(this.cantonCliente).subscribe({
          next: res => {
            this.parroquias = res.resultado as Ubicacion[];
            this.parroquiaCliente = this.cliente.ubicacion.parroquia;
          },
          error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        });
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  filtroCliente(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCliente.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceCliente.paginator) {
      this.dataSourceCliente.paginator.firstPage();
    }
  }
  borrarFiltroCliente() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSourceCliente.filter = '';
  }

  // CRUD DEPENDIENTE
  nuevoDependiente(){
    this.dependiente = new Dependiente();
    this.provinciaDependiente = "";
    this.cantonDependiente = "";
    this.parroquiaDependiente = "";
    this.telefonoDependiente = new TelefonoDependiente();
    this.celularDependiente = new CelularDependiente();
    this.correoDependiente = new CorreoDependiente();
    this.posicionCentralDependiente = new Coordenada(valores.latCiudad, valores.lngCiudad);
    this.posicionGeograficaDependiente = new Coordenada(valores.latCiudad, valores.lngCiudad);;
    this.clickedRowsDependiente.clear();
    if (this.cliente.dependientes.length > 0 && this.verPanelDependiente) // si hay dependientes borra?
      //this.borrarFiltroDependiente(); 
    this.verIconoEditarDependiente = false;
  }

  crearDependiente() {
    if (this.dependiente.razonSocial != ''){
      if (!this.validarFormularioDependiente())
      return;
      this.agregarTelefonoCorreoDependiente();
      this.cliente.dependientes.push(this.dependiente);
      this.llenarTablaDependiente(this.cliente.dependientes);
      this.nuevoDependiente();
      this.verIconoEditarDependiente = false;
    }  
  }

  agregarTelefonoCorreoDependiente() {
    if (this.telefonoDependiente.numero != valores.vacio)
      this.dependiente.telefonosDependiente.push(this.telefonoDependiente);
    if (this.celularDependiente.numero != valores.vacio)
      this.dependiente.celularesDependiente.push(this.celularDependiente);
    if (this.correoDependiente.email != valores.vacio)
      this.dependiente.correosDependiente.push(this.correoDependiente);
  }

  actualizarDependiente(){
    for(let i=0; i < this.cliente.dependientes.length; i++){
      if (this.cliente.dependientes[i].id==this.dependiente.id){
        this.agregarTelefonoCorreoDependiente();
        this.cliente.dependientes[i] = this.dependiente;
      }
    }
    this.llenarTablaDependiente(this.cliente.dependientes);
    this.nuevoDependiente();
    this.verIconoEditarDependiente = false;
  }

  eliminarDependiente(dependienteSeleccionado: Dependiente) {
    let index = this.cliente.dependientes.indexOf(dependienteSeleccionado);
    this.cliente.dependientes.splice(index, 1);
    this.llenarTablaDependiente(this.cliente.dependientes);
    if (this.cliente.dependientes.length == 0)
      this.deshabilitarDependiente = true;
  }

  activarDependiente(dependienteSeleccionado: Dependiente) {
    dependienteSeleccionado.estado = valores.activo;
  }

  inactivarDependiente(dependienteSeleccionado: Dependiente) {
    dependienteSeleccionado.estado = valores.inactivo;
  }

  seleccionDependiente(dependiente: Dependiente) {
    if (!this.clickedRowsDependiente.has(dependiente)){
      this.clickedRowsDependiente.clear();
      this.clickedRowsDependiente.add(dependiente);
      this.dependiente = { ... dependiente};
      this.llenarUbicacionDependiente();
      this.recuperarCoordenadasDependiente();
      this.verIconoEditarDependiente = true;
    } else {
      this.nuevoDependiente();
    }
  }

  llenarUbicacionDependiente(){
    // Llenar ubicación dependiente
    this.provinciaDependiente = this.dependiente.ubicacion.provincia;
    this.ubicacionService.consultarCantones(this.provinciaDependiente).subscribe({
      next: res => {
        this.cantonesDependiente = res.resultado as Ubicacion[];
        this.cantonDependiente = this.dependiente.ubicacion.canton;
        this.ubicacionService.consultarParroquias(this.cantonDependiente).subscribe({
          next: res => {
            this.parroquiasDependiente = res.resultado as Ubicacion[];
            this.parroquiaDependiente = this.dependiente.ubicacion.parroquia;
          },
          error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        });
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  filtroDependiente(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceDependiente.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceDependiente.paginator) {
      this.dataSourceDependiente.paginator.firstPage();
    }
  }
  borrarFiltroDependiente() {
    this.renderer.setProperty(this.inputFiltroDependiente.nativeElement, 'value', '');
    this.dataSourceDependiente.filter = '';
  }

  llenarTablaDependiente(dependientes: Dependiente[]) {
    this.dataSourceDependiente = new MatTableDataSource(dependientes);
    this.dataSourceDependiente.filterPredicate = (data: Dependiente, filter: string): boolean =>
      data.razonSocial.includes(filter) || data.direccion.includes(filter) || data.ubicacion.provincia.includes(filter) || 
      data.ubicacion.canton.includes(filter) || data.ubicacion.parroquia.includes(filter);
    this.dataSourceDependiente.paginator = this.paginator;
    this.dataSourceDependiente.sort = this.sort;
  }

  //VALIDACIONES DE CAMPOS
  validarIdentificacion() {
    this.clienteService.validarIdentificacion(this.cliente.identificacion).subscribe({
      next: (res) => {
        this.cliente.tipoIdentificacion = res.resultado.tipoIdentificacion as TipoIdentificacion;
        this.cliente.tipoContribuyente = res.resultado.tipoContribuyente as TipoContribuyente;
        this.validarDocumento();
        this.validarDinardap();
        this.inicializarOpciones();
      },
      error: (err) => {
        this.cliente.tipoIdentificacion = null;
        this.cliente.tipoContribuyente = new TipoContribuyente();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  validarDocumento(){
    if (this.cliente.tipoIdentificacion.descripcion == otras.tipoIdentificacion){
      this.deshabilitarObligado = true;
    } else {
      this.deshabilitarObligado = false;  
    }
  }

  validarDinardap() {
    if (this.cliente.tipoContribuyente.tipo == otras.tipoContribuyenteJuridica) {
      this.deshabilitarDinardap = true;
    } else {
      this.deshabilitarDinardap = false;
      if (this.cliente.id == 0) {
        this.cliente.genero = this.generos[0];
        this.cliente.estadoCivil = this.estadosCiviles[0];
        this.cliente.origenIngreso = this.origenesIngresos[0];
        this.cliente.calificacionCliente = this.calificacionesClientes[0];
      }
    }
  }

  inicializarOpciones(){
    this.cliente.segmento = this.segmentos[0];
    this.cliente.grupoCliente = this.gruposClientes[0];
    this.cliente.formaPago = this.formasPagos[0];
    this.cliente.etiqueta = valores.etiquetaTrabajo;
  }

  cambiarFormaPago() {
    if (this.cliente.formaPago.id == 6) {
      this.deshabilitarPlazoCredito = false;
    } else {
      this.deshabilitarPlazoCredito = true;
      //this.cliente.formaPago.id = 0;
    }
  }

  validarFormularioCliente(): boolean {
    if (this.cliente.identificacion == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.cliente.razonSocial == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.cliente.direccion == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.cliente.referencia == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.provinciaCliente == '' || this.cantonCliente == '' || this.parroquiaCliente == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this. correo.email == '' && this.cliente.correos.length == 0) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_correo });
      return false;
    }
    return true;
  }

  validarFormularioDependiente(): boolean {
    if (this.dependiente.direccion == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.provinciaDependiente == '' || this.cantonDependiente == '' || this.parroquiaDependiente == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }

  // Para crear, validar y eliminar telefono, celular y correo
  crearTelefono() {
    if (this.telefono.numero.length != valores.cero) {
      this.cliente.telefonos.push({ ... this.telefono});
      this.telefono = new Telefono();
    } else {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_ingresado });
    }
  }
  validarTelefono() {
    let digito = this.telefono.numero.substring(0, 1);
    if (this.telefono.numero.length != 11 || digito != "0") {
      this.telefono.numero = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_invalido });
    }
  }
  eliminarTelefono(i: number) {
    this.cliente.telefonos.splice(i, 1);
  }

  crearCelular() {
    if (this.celular.numero.length != valores.cero) {
      this.cliente.celulares.push( { ... this.celular});
      this.celular = new Celular();
    } else {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_ingresado });
    }
  }
  validarCelular() {
    let digito = this.celular.numero.substring(0, 2);
    if (this.celular.numero.length != 12 || digito != "09") {
      this.celular.numero = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_invalido });
    }
  }
  eliminarCelular(i: number) {
    this.cliente.celulares.splice(i, 1);
  }

  crearCorreo() {
    if (this.correo.email.length != valores.cero) {
      this.cliente.correos.push({ ... this.correo});
      this.correo = new Correo();
    } else {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_correo_ingresado });
    }
  }
  validarCorreo() {
    let arroba = this.correo.email.includes("@");
    if (!arroba) {
      this.correo.email = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_correo_invalido });
    }
  }
  eliminarCorreo(i: number) {
    this.cliente.correos.splice(i, 1);
  }

  crearTelefonoDependiente() {
    if (this.telefonoDependiente.numero.length != valores.cero) {
      this.dependiente.telefonosDependiente.push({ ... this.telefonoDependiente});
      this.telefonoDependiente = new TelefonoDependiente();
    } else {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_ingresado });
    }
  }
  validarTelefonoDependiente() {
    let digito = this.telefonoDependiente.numero.substring(0, 1);
    if (this.telefonoDependiente.numero.length != 11 || digito != "0") {
      this.telefonoDependiente.numero = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_invalido });
    } 
  }
  eliminarTelefonoDependiente(i: number) {
    this.dependiente.telefonosDependiente.splice(i, 1);
  }

  crearCelularDependiente() {
    if (this.celularDependiente.numero.length != valores.cero) {
      this.dependiente.celularesDependiente.push( { ... this.celularDependiente});
      this.celularDependiente = new CelularDependiente();
    } else {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_ingresado });
    }
  }
  validarCelularDependiente() {
    let digito = this.celularDependiente.numero.substring(0, 2);
    if (this.celularDependiente.numero.length != 12 || digito != "09") {
      this.celularDependiente.numero = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_invalido });
    }
  }
  eliminarCelularDependiente(i: number) {
    this.dependiente.celularesDependiente.splice(i, 1);
  }

  crearCorreoDependiente() {
    if (this.correoDependiente.email.length != valores.cero) {
      this.dependiente.correosDependiente.push({ ... this.correoDependiente});
      this.correoDependiente = new CorreoDependiente();
    } else {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_correo_ingresado });
    }
  }
  validarCorreoDependiente() {
    let arroba = this.correoDependiente.email.includes("@");
    if (!arroba) {
      this.correoDependiente.email = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_correo_invalido });
    }
  }
  eliminarCorreoDependiente(i: number) {
    this.dependiente.correosDependiente.splice(i, 1);
  }

  // Para el selectChange de Provincia, Cantón y Parroquia
  seleccionarProvincia() {
    this.cliente.ubicacion.provincia = this.provinciaCliente;
    this.ubicacionService.consultarCantones(this.provinciaCliente).subscribe({
      next: res => {
        this.cantonCliente = "";
        this.cantones = res.resultado as Ubicacion[];
        this.parroquiaCliente = "";
        this.parroquias = [];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarCanton() {
    this.cliente.ubicacion.canton = this.cantonCliente;
    this.ubicacionService.consultarParroquias(this.cantonCliente).subscribe({
      next: res => {
        this.parroquiaCliente = "";
        this.parroquias = res.resultado as Ubicacion[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarParroquia() {
    this.cliente.ubicacion.parroquia = this.parroquiaCliente;
  }

  seleccionarProvinciaDependiente() {
    this.dependiente.ubicacion.provincia = this.provinciaDependiente;
    this.ubicacionService.consultarCantones(this.dependiente.ubicacion.provincia).subscribe({
      next: res => {
        this.cantonDependiente = "";
        this.cantonesDependiente = res.resultado as Ubicacion[];
        this.parroquiaDependiente = "";
        this.parroquiasDependiente = [];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarCantonDependiente() {
    this.dependiente.ubicacion.canton = this.cantonDependiente;
    this.ubicacionService.consultarParroquias(this.dependiente.ubicacion.canton).subscribe({
      next: res => {
        this.parroquiaDependiente = "";
        this.parroquiasDependiente = res.resultado as Ubicacion[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarParroquiaDependiente() {
    this.dependiente.ubicacion.parroquia = this.parroquiaDependiente;
  }

  // MAPA
  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      this.posicionCentralDireccion = new Coordenada(position.coords.latitude, position.coords.longitude);
    })
  }

  asignarCoordenadasCliente(){
    //this.cliente.coordenadas.push(this.posicionGeograficaDireccion);
    this.cliente.latitudgeo = this.posicionGeograficaDireccion.lat;
    this.cliente.longitudgeo = this.posicionGeograficaDireccion.lng;
  }

  recuperarCoordenadasCliente(){
    this.posicionGeograficaDireccion.lat = this.cliente.latitudgeo;
    this.posicionGeograficaDireccion.lng = this.cliente.longitudgeo;
    this.posicionCentralDireccion = this.posicionGeograficaDireccion;
  }

  asignarCoordenadasDependiente(){
    this.dependiente.latitudgeo = this.posicionGeograficaDependiente.lat;
    this.dependiente.longitudgeo = this.posicionGeograficaDependiente.lng;
  }

  recuperarCoordenadasDependiente(){
    this.posicionGeograficaDependiente.lat = this.dependiente.latitudgeo;
    this.posicionGeograficaDependiente.lng = this.dependiente.longitudgeo;
    this.posicionCentralDependiente = this.posicionGeograficaDependiente;
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  importar(archivos: FileList) {
    let archivoImportar = archivos.item(0);
    this.clienteService.importar(archivoImportar).subscribe(
      res => {
        if (res.resultado != null) {
          this.cantonesDependiente = res.resultado as Ubicacion[];
        } else {
          Swal.fire({ icon: error_swal, title: error, text: res.mensaje })
        }
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  dialogoMapasDireccion(): void {
    const dialogRef = this.dialog.open(DialogoMapaComponent, {
      width: '80%',
      data: this.posicionGeograficaDireccion as Coordenada
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.posicionGeograficaDireccion = result as Coordenada;
        this.posicionCentralDireccion = this.posicionGeograficaDireccion;
        this.asignarCoordenadasCliente();
      }
    });
  }

  dialogoMapasDependiente(): void {
    const dialogRef = this.dialog.open(DialogoMapaComponent, {
      width: '80%',
      data: this.posicionGeograficaDependiente as Coordenada
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.posicionGeograficaDependiente = result as Coordenada;
        this.posicionCentralDependiente = this.posicionGeograficaDependiente;
        this.asignarCoordenadasDependiente();
      }
    });
  }

}

@Component({
  selector: 'dialogo-mapa',
  templateUrl: 'dialogo-mapa.component.html',
})
export class DialogoMapaComponent {

  mapa: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogoMapaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Coordenada) { }

  onNoClick(): void {
    this.dialogRef.close();
    this.data = new Coordenada(valores.latCiudad, valores.lngCiudad);
  }

  coordenadaSeleccionada(event: any) {
    if (event && event.latitud != valores.latCiudad) {
      this.data = event as Coordenada;
    } else {
      this.data = new Coordenada(valores.latCiudad, valores.lngCiudad);
    }
  }
}