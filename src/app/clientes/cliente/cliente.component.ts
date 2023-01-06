import { Component, OnInit, HostListener, Type, ViewChild, Inject } from '@angular/core';
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

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TipoIdentificacion } from '../../modelos/configuracion/tipo-identificacion';
import { TipoIdentificacionService } from '../../servicios/configuracion/tipo-identificacion.service';

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

  sesion: Sesion;
  ComponenteCliente: Type<any> = ClienteComponent;

  indiceTipoContribuyente: number = -1;

  abrirPanelNuevoCliente: boolean = true;
  abrirPanelUbicacion: boolean = false;
  abrirPanelDependiente: boolean = false;
  abrirPanelDatoAdicional: boolean = false;
  abrirPanelAdminCliente: boolean = false;
  estadoCliente: boolean = true;
  dirEstablecida: boolean = true;
  activacion_s_es_oi: boolean = true;
  activacionPlazoCredito: boolean = false;
  deshabilitarTipoContribuyente: boolean = true;
  deshabilitarCliente: boolean = false;
  deshabilitarDireccion: boolean = false;
  deshabilitarDependiente: boolean = false;
  deshabilitarDatoAdicional: boolean = false;


  urlLogo: string = "";
  nombreEmpresa: string = "";
  urlAvatar: string = environment.prefijoUrlImagenes + "avatar/avatar1.png";

  cliente: Cliente = new Cliente();
  telefono: Telefono = new Telefono();
  celular: Celular = new Celular();
  correo: Correo = new Correo();
  dependienteTelefono: TelefonoDependiente = new TelefonoDependiente();
  dependienteCelular: CelularDependiente = new CelularDependiente();
  dependienteCorreo: CorreoDependiente = new CorreoDependiente();
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
  tiposPagos: TipoPago[];
  formasPagos: FormaPago[];
  tiposContribuyentes: TipoContribuyente[] = [];

  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];
  dependienteProvincias: Ubicacion[];
  dependienteCantones: Ubicacion[];
  dependienteParroquias: Ubicacion[];

  tiposRetencionesIvaBien: TipoRetencion[];
  tiposRetencionesIvaServicio: TipoRetencion[];
  tiposRetencionesRentaBien: TipoRetencion[];
  tiposRetencionesRentaServicio: TipoRetencion[];

  archivoImportar: File;

  posicionCentralDireccion: Coordenada = new Coordenada(valores.latCiudad, valores.lngCiudad);
  posicionCentralDependiente: Coordenada = new Coordenada(valores.latCiudad, valores.lngCiudad);
  posicionGeograficaDireccion: Coordenada;
  posicionGeograficaDependiente: Coordenada;
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
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Cliente) => `${row.id}` },
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
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabeceraDependientes: string[] = this.columnasDependiente.map(titulo => titulo.nombreColumna);
  dataSourceDependiente: MatTableDataSource<Dependiente>;
  clickedRowsDependiente = new Set<Dependiente>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G")
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N")
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "E")
      console.log('SHIFT + E');
  }

  constructor(public dialog: MatDialog, private clienteService: ClienteService, private tipoIdentificacionService: TipoIdentificacionService, private generoService: GeneroService,
    private estadoCivilService: EstadoCivilService, private origenIngresoService: OrigenIngresoService,
    private calificacionClienteService: CalificacionClienteService, private plazoCreditoService: PlazoCreditoService,
    private tipoPagoService: TipoPagoService, private formaPagoService: FormaPagoService,
    private ubicacionService: UbicacionService, private grupoClienteService: GrupoClienteService,
    private tipoRetencionService: TipoRetencionService, private router: Router, private tabService: TabService,
    private sesionService: SesionService, private empresaService: EmpresaService, private segmentoService: SegmentoService,
    private tipoContribuyenteService: TipoContribuyenteService, private modalService: NgbModal) { }

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
    this.consultarTipoPago();
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
        console.log(this.tiposIdentificaciones);
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
  consultarTipoPago(){
    this.tipoPagoService.consultarActivos().subscribe({
      next: res => {
        this.tiposPagos = res.resultado as TipoPago[]
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
        this.dependienteProvincias = res.resultado as Ubicacion[]
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

  nuevo(event){
    if (event != null)
      event.preventDefault();
    this.cliente = new Cliente();
    this.dependiente = new Dependiente();
    this.telefono = new Telefono();
    this.celular = new Celular();
    this.correo = new Correo();
    this.dependienteTelefono = new TelefonoDependiente();
    this.dependienteCelular = new CelularDependiente();
    this.dependienteCorreo = new CorreoDependiente();
    this.clickedRows.clear();
    this.clickedRowsDependiente.clear();
  }

  crear(event: any) {
    if (event != null)
      event.preventDefault();
    this.agregarDatos();
    this.clienteService.crear(this.cliente).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  agregarDatos() {
    if (this.telefono.numero != valores.vacio)
      this.cliente.telefonos.push(this.telefono);
    if (this.celular.numero != valores.vacio)
      this.cliente.celulares.push(this.celular);
    if (this.correo.email != valores.vacio)
      this.cliente.correos.push(this.correo);

    if (this.dependienteTelefono.numero != valores.vacio)
      this.dependiente.telefonos.push(this.dependienteTelefono);
    if (this.dependienteCelular.numero != valores.vacio)
      this.dependiente.celulares.push(this.dependienteCelular);
    if (this.dependienteCorreo.email != valores.vacio)
      this.dependiente.correos.push(this.dependienteCorreo);

    this.cliente.estacion = this.sesion.usuario.estacion;
  }

  agregarDependiente() {
    if(this.dependiente.razonSocial != valores.vacio){
      if (this.dependienteTelefono.numero != valores.vacio)
        this.dependiente.telefonos.push(this.dependienteTelefono);
      if (this.dependienteTelefono.numero != valores.vacio)
        this.dependiente.celulares.push(this.dependienteCelular);
      if (this.dependienteCorreo.email != valores.vacio)
        this.dependiente.correos.push(this.dependienteCorreo);
    this.cliente.dependientes.push(this.dependiente);
    this.llenarDataSourceDependiente(this.cliente.dependientes);
    }
  }

  eliminarDependiente(dependienteSeleccionado: Dependiente) {
    let index = this.cliente.dependientes.indexOf(dependienteSeleccionado);
    this.cliente.dependientes.splice(index, 1);
    this.llenarDataSourceDependiente(this.cliente.dependientes);
    if (this.cliente.dependientes.length < 1)
      this.deshabilitarDependiente = false;
  }

  actualizar(event: any) {
    if (event != null)
      event.preventDefault();
    this.agregarDependiente();
    this.clienteService.actualizar(this.cliente).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
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
        this.llenarDataSourceCliente(this.clientes);
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

  llenarDataSourceCliente(clientes: Cliente[]) {
    this.dataSourceCliente = new MatTableDataSource(clientes);
    this.dataSourceCliente.filterPredicate = (data: Cliente, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.identificacion.toUpperCase().includes(filter) || data.razonSocial.toUpperCase().includes(filter) ||
      data.direccion.toUpperCase().includes(filter) || data.estado.toUpperCase().includes(filter);
    this.dataSourceCliente.paginator = this.paginator;
    this.dataSourceCliente.sort = this.sort;
  }

  seleccion(cliente: any) {
    if (!this.clickedRows.has(cliente)){
      this.clickedRows.clear();
      this.clickedRows.add(cliente);
      this.cliente = { ... cliente};
    } else {
      this.clickedRows.clear();
      this.cliente = new Cliente();
    }
  }

  seleccionDependiente(dependiente: Dependiente) {
    if (!this.clickedRowsDependiente.has(dependiente)){
      this.clickedRowsDependiente.clear();
      this.clickedRowsDependiente.add(dependiente);
      this.dependiente = { ... dependiente};
    } else {
      this.clickedRowsDependiente.clear();
      this.dependiente = new Dependiente();
    }
  }

  filtroDependiente(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceDependiente.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceDependiente.paginator) {
      this.dataSourceDependiente.paginator.firstPage();
    }
  }

  llenarDataSourceDependiente(dependientes: Dependiente[]) {
    this.dataSourceDependiente = new MatTableDataSource(dependientes);
    this.dataSourceDependiente.filterPredicate = (data: Dependiente, filter: string): boolean =>
      data.razonSocial.toUpperCase().includes(filter) || data.direccion.toUpperCase().includes(filter) ||
      data.ubicacion.provincia.toUpperCase().includes(filter) || data.ubicacion.canton.toUpperCase().includes(filter);
    this.dataSourceDependiente.paginator = this.paginator;
    this.dataSourceDependiente.sort = this.sort;
  }

  ubicacionNormalizar() {
    if(this.cliente.ubicacion.provincia != valores.vacio){
      this.seleccionarProvincia();
    }
    if(this.cliente.ubicacion.canton != valores.vacio){
      this.seleccionarCanton();
    }
  }

  validarIdentificacion() {
    this.clienteService.validarIdentificacion(this.cliente.identificacion).subscribe({
      next: (res) => {
        this.cliente.tipoIdentificacion = res.resultado.tipoIdentificacion as TipoIdentificacion;
        this.cliente.tipoContribuyente = res.resultado.tipoContribuyente as TipoContribuyente;
        this.cambiarFormaPago();
        this.validarSexoEstadoCivilOrigenIngreso();
      },
      error: (err) => {
        this.cliente.tipoIdentificacion = null;
        this.cliente.tipoContribuyente = new TipoContribuyente();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  cambiarFormaPago() {
    if (this.cliente.financiamiento.formaPago.id == 1) {
      this.activacionPlazoCredito = true;
      this.cliente.financiamiento.plazoCredito.id = 0;
    } else {
      this.activacionPlazoCredito = false;
    }
  }

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
    if (this.dependienteTelefono.numero.length != valores.cero) {
      if (this.cliente.dependientes.length > valores.cero && this.dependiente.razonSocial == valores.vacio) {
        this.cliente.dependientes.slice(-1)[0].telefonos.push(this.dependienteTelefono);
      } else {
        this.dependiente.telefonos.push(this.dependienteTelefono);
      }
      this.dependienteTelefono = new TelefonoDependiente();
    }
  }
  validarTelefonoDependiente() {
    let digito = this.dependienteTelefono.numero.substring(0, 1);
    if (this.dependienteTelefono.numero.length != 11 || digito != "0") {
      this.dependienteTelefono.numero = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_invalido });
    }
  }
  eliminarTelefonoDependiente(i: number) {
    this.dependiente.telefonos.splice(i, 1);
    this.dependienteTelefono = new TelefonoDependiente();
  }

  crearCelularDependiente() {
    if (this.dependienteCelular.numero.length != 0) {
      if (this.cliente.dependientes.length > 0 && this.dependiente.razonSocial == valores.vacio) {
        this.cliente.dependientes.slice(-1)[0].celulares.push(this.dependienteCelular);
      }
      else {
        this.dependiente.celulares.push(this.dependienteCelular);
      }
      this.dependienteCelular = new CelularDependiente();
    }
  }
  validarCelularDependiente() {
    let digito = this.dependienteCelular.numero.substring(0, 2);
    if (this.dependienteCelular.numero.length != 12 || digito != "09") {
      this.dependienteCelular.numero = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_invalido });
    }
  }
  eliminarCelularDependiente(i: number) {
    this.dependiente.celulares.splice(i, 1);
    this.dependienteCelular = new CelularDependiente();
  }

  crearCorreoDependiente() {
    if (this.dependienteCorreo.email.length != 0) {
      if (this.cliente.dependientes.length > 0 && this.dependiente.razonSocial == "") {
        this.cliente.dependientes.slice(-1)[0].correos.push(this.dependienteCorreo);
      } else {
        this.dependiente.correos.push(this.dependienteCorreo);
      }
      this.dependienteCorreo = new CorreoDependiente();
    }
  }
  validarCorreoDependiente() {
    let arroba = this.dependienteCorreo.email.includes("@");
    if (!arroba) {
      this.dependienteCorreo.email = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_correo_invalido });
    }
  }
  eliminarCorreoDependiente(i: number) {
    this.dependiente.correos.splice(i, 1);
    this.dependienteCorreo = new CorreoDependiente();
  }


  seleccionarProvincia() {
    this.ubicacionService.consultarCantones(this.cliente.ubicacion.provincia).subscribe({
      next: res => {
        this.cantones = res.resultado as Ubicacion[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarDependienteProvincia() {
    this.ubicacionService.consultarCantones(this.dependiente.ubicacion.provincia).subscribe(
      res => {
        this.dependienteCantones = res.resultado as Ubicacion[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarCanton() {
    this.ubicacionService.consultarParroquias(this.cliente.ubicacion.canton).subscribe({
      next: res => {
        this.parroquias = res.resultado as Ubicacion[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarDependienteCanton() {
    this.ubicacionService.consultarParroquias(this.dependiente.ubicacion.canton).subscribe(
      res => {
        this.dependienteParroquias = res.resultado as Ubicacion[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  validarSexoEstadoCivilOrigenIngreso() {
    if (this.cliente.tipoContribuyente.tipo == otras.tipoContribuyenteJuridica) {
      this.activacion_s_es_oi = true;
    } else {
      this.activacion_s_es_oi = false;
      if (this.cliente.id == 0) {
        this.cliente.genero = this.generos[0];
        this.cliente.estadoCivil = this.estadosCiviles[0];
        this.cliente.origenIngreso = this.origenesIngresos[0];
        this.cliente.calificacionCliente = this.calificacionesClientes[0];
      }
    }
  }

  mapClicked($event: google.maps.MapMouseEvent) {
    let coordenada = new Coordenada($event.latLng.lat(), $event.latLng.lng());
    //this.coordenadas.push(coordenada);
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      this.posicionCentralDireccion = new Coordenada(position.coords.latitude, position.coords.longitude);
    })
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
          Swal.fire({ icon: error_swal, title: error, text: res.mensaje })
        }
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
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
      }
    });
  }

  dialogoMapasDependiente(): void {
    //console.log('El dialogo para selección de grupo producto fue abierto');
    const dialogRef = this.dialog.open(DialogoMapaComponent, {
      width: '80%',
      data: this.posicionGeograficaDependiente as Coordenada
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.posicionGeograficaDependiente = result as Coordenada;
        this.posicionCentralDependiente = this.posicionGeograficaDependiente;
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
    //console.log('El dialogo para selección de coordenada fue cancelado');
    this.data = new Coordenada(0, 0);
  }

  coordenadaSeleccionada(event: any) {
    if (event && event.latitud != 0) {
      this.data = event as Coordenada;
    } else {
      this.data = new Coordenada(0, 0);
    }
  }
}