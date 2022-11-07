import { Component, OnInit, HostListener, Type, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router'; 
import Swal from 'sweetalert2';
import { valores, mensajes, otras, tabs, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
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
//import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  sesion: Sesion;
  ComponenteCliente: Type<any> = ClienteComponent;

  urlLogo: string = "";
  nombreEmpresa: string = "";
  urlAvatar: string = environment.prefijoUrlImagenes + "avatar/avatar1.png";

  abrirPanelCliente: boolean = true;
  abrirPanelUbicacion: boolean = false;
  abrirPanelDependiente: boolean = false;
  abrirPanelDatoAdicional: boolean = false;
  abrirPanelAdminCliente: boolean = false;
  estadoCliente: boolean = true;
  editing: boolean = false;
  dirEstablecida: boolean = true;

  cliente: Cliente = new Cliente();
  clientes: Cliente[];
  tiposIdentificaciones: TipoIdentificacion[];
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

  clienteProvincia: string = "";
  clienteCanton: string = "";
  clienteParroquia: string = "";
  dependienteProvincia: string = "";
  dependienteCanton: string = "";
  dependienteParroquia: string = "";
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

  archivoImportar: File;
  panelOpenState = false;
  value = 'Clear me';

  //Mapa
  latitud: number = valores.latCiudad; //Tomar de configuación y poner en el init
  longitud: number = valores.lngCiudad;
  posicionCentralDireccion: Coordenada = new Coordenada(this.latitud, this.longitud);
  posicionCentralDependiente: Coordenada = new Coordenada(this.latitud, this.longitud);
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
 // @ViewChild(MapInfoWindow) infoWindowDireccion: MapInfoWindow;

  columnasCliente: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Cliente) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Cliente) => `${row.codigo}` },
    { nombreColumna: 'identificacion', cabecera: 'Indentificación', celda: (row: Cliente) => `${row.identificacion}` },
    { nombreColumna: 'razonSocial', cabecera: 'Razón Social', celda: (row: Cliente) => `${row.razonSocial}` },
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: Cliente) => `${row.direccion.direccion}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Cliente) => `${row.estado}` }
  ];
  cabeceraCliente: string[] = this.columnasCliente.map(titulo => titulo.nombreColumna);
  dataSourceCliente: MatTableDataSource<Cliente>;
  clickedRows = new Set<Cliente>();

  columnasDependiente: any[] = [
    { nombreColumna: 'razonSocial', cabecera: 'Razón Social', celda: (row: Dependiente) => `${row.razonSocial}` },
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: Dependiente) => `${row.direccion.direccion}` },
    { nombreColumna: 'provincia', cabecera: 'Provincia', celda: (row: Dependiente) => `${row.direccion.ubicacion.provincia}` },
    { nombreColumna: 'canton', cabecera: 'Cantón', celda: (row: Dependiente) => `${row.direccion.ubicacion.canton}` },
    { nombreColumna: 'parroquia', cabecera: 'Parroquia', celda: (row: Dependiente) => `${row.direccion.ubicacion.parroquia}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Dependiente) => `${row.estado}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabeceraDependientes: string[] = this.columnasDependiente.map(titulo => titulo.nombreColumna);
  dataSourceDependiente: MatTableDataSource<Dependiente>;
  filaSeleccionada = new Set<Dependiente>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private clienteService: ClienteService, private tipoIdentificacionService: TipoIdentificacionService, private generoService: GeneroService,
    private estadoCivilService: EstadoCivilService, private origenIngresoService: OrigenIngresoService,
    private calificacionClienteService: CalificacionClienteService, private plazoCreditoService: PlazoCreditoService,
    private tipoPagoService: TipoPagoService, private formaPagoService: FormaPagoService,
    private ubicacionService: UbicacionService, private grupoClienteService: GrupoClienteService,
    private tipoRetencionService: TipoRetencionService, private router: Router, private tabService: TabService,
    private sesionService: SesionService, private empresaService: EmpresaService, private segmentoService: SegmentoService,
    private tipoContribuyenteService: TipoContribuyenteService, private modalService: NgbModal) { }

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
    this.sesion = validarSesion(this.sesionService, this.router);
    this.obtenerEmpresa();
    this.obtenerSesion();
    this.consultar();
    this.tipoIdentificacionService.consultar().subscribe({
      next: (res) => {
        this.tiposIdentificaciones = res.resultado as TipoIdentificacion[];
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.tipoContribuyenteService.consultar().subscribe({
      next: (res) => {
        this.tiposContribuyentes = res.resultado as TipoContribuyente[];
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.segmentoService.consultar().subscribe({
      next: (res) => {
        this.segmentos = res.resultado as Segmento[];
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.grupoClienteService.consultar().subscribe({
      next: (res) => {
        this.gruposClientes = res.resultado as GrupoCliente[]
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.generoService.consultar().subscribe({
      next: (res) => {
        this.generos = res.resultado as Genero[]
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.estadoCivilService.consultar().subscribe({
      next: (res) => {
        this.estadosCiviles = res.resultado as EstadoCivil[]
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.origenIngresoService.consultar().subscribe({
      next: (res) => {
        this.origenesIngresos = res.resultado as OrigenIngreso[];
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.calificacionClienteService.consultar().subscribe(
      res => {
        this.calificacionesClientes = res.resultado as CalificacionCliente[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.plazoCreditoService.consultar().subscribe(
      res => {
        this.plazosCreditos = res.resultado as PlazoCredito[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.tipoPagoService.consultar().subscribe(
      res => {
        this.tiposPagos = res.resultado as TipoPago[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.formaPagoService.consultar().subscribe(
      res => {
        this.formasPagos = res.resultado as FormaPago[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.ubicacionService.obtenerProvincias().subscribe(
      res => {
        this.provincias = res.resultado as Ubicacion[];
        this.dependienteProvincias = res.resultado as Ubicacion[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.tipoRetencionService.obtenerIvaBien().subscribe(
      res => {
        this.tiposRetencionesIvaBien = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.tipoRetencionService.obtenerIvaServicio().subscribe(
      res => {
        this.tiposRetencionesIvaServicio = res.resultado as TipoRetencion[]
        
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.tipoRetencionService.obtenerRentaBien().subscribe(
      res => {
        this.tiposRetencionesRentaBien = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.tipoRetencionService.obtenerRentaServicio().subscribe(
      res => {
        this.tiposRetencionesRentaServicio = res.resultado as TipoRetencion[];
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
  }

  mapClicked($event: google.maps.MapMouseEvent){
    let coordenada = new Coordenada($event.latLng.lat(), $event.latLng.lng());
    //this.coordenadas.push(coordenada);
  }

  getCurrentPosition(){
    navigator.geolocation.getCurrentPosition(position => {
      this.posicionCentralDireccion = new Coordenada(position.coords.latitude, position.coords.longitude);
      console.log(this.posicionCentralDireccion);
    })
  }

  obtenerSesion() {
    this.sesion = this.sesionService.getSesion();
  }

  obtenerEmpresa() {
    let empresaId = 1;
    this.empresaService.obtener(empresaId).subscribe(
      res => {
        let empresa = res.resultado as Empresa
        this.urlLogo = environment.prefijoUrlImagenes + "logos/" + empresa.logo;
        this.nombreEmpresa = empresa.razonSocial;
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
  }

  nuevo(event: any) {
    if (event != null)
      event.preventDefault();
    this.cliente = new Cliente();
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
    //AGREGAR AUXILIAR
    if (this.dependienteTelefono.numero != valores.vacio)
      this.dependiente.telefonos.push(this.dependienteTelefono);
    if (this.dependienteTelefono.numero != valores.vacio)
      this.dependiente.celulares.push(this.dependienteCelular);
    if (this.dependienteCorreo.email != valores.vacio)
      this.dependiente.correos.push(this.dependienteCorreo);
    let dependienteUbicacion: Ubicacion = new Ubicacion();
    dependienteUbicacion.provincia = this.dependienteProvincia;
    dependienteUbicacion.canton = this.dependienteCanton;
    dependienteUbicacion.parroquia = this.dependienteParroquia;
    this.dependiente.direccion.ubicacion = dependienteUbicacion;
    
    if (this.telefono.numero != valores.vacio)
      this.cliente.telefonos.push(this.telefono);
    if (this.celular.numero != valores.vacio)
      this.cliente.celulares.push(this.celular);
    if (this.correo.email != valores.vacio)
      this.cliente.correos.push(this.correo);
    this.cliente.puntoVenta = this.sesion.usuario.puntoVenta;
    let ubicacion: Ubicacion = new Ubicacion();
    ubicacion.provincia = this.clienteProvincia;
    ubicacion.canton = this.clienteCanton;
    ubicacion.parroquia = this.clienteParroquia;
    this.dependiente.direccion.ubicacion = dependienteUbicacion;
    this.cliente.direccion.ubicacion= ubicacion;
    this.clienteService.crear(this.cliente).subscribe(
      res => {
        this.cliente = res.resultado as Cliente;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  agregarDependiente() {
    if (this.dependienteTelefono.numero != undefined)
      this.dependiente.telefonos.push(this.dependienteTelefono);
    if (this.dependienteTelefono.numero != undefined)
      this.dependiente.celulares.push(this.dependienteCelular);
    if (this.dependienteCorreo.email != undefined)
      this.dependiente.correos.push(this.dependienteCorreo);
    let ubicacion: Ubicacion = new Ubicacion();
    ubicacion.provincia = this.dependienteProvincia;
    ubicacion.canton = this.dependienteCanton;
    ubicacion.parroquia = this.dependienteParroquia;
    if (ubicacion.provincia != valores.vacio && ubicacion.canton != valores.vacio && ubicacion.parroquia != valores.vacio) {
      this.cliente.dependientes.push(this.dependiente);
      this.llenarDataSourceDependiente(this.cliente.dependientes);
      this.dependiente = new Dependiente();
      this.habilitarCelularTelefonoCorreoDependiente = false;
      this.dependienteProvincia = valores.vacio;
      this.dependienteCanton = valores.vacio;
      this.dependienteParroquia = valores.vacio;
      this.dependienteTelefono = new TelefonoDependiente();
      this.dependienteCelular = new CelularDependiente();
      this.dependienteCorreo = new CorreoDependiente();
    } else {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_agregar_dependiente});
    }
  }

  eliminarDependiente(dependienteSeleccionado: Dependiente) {
    let index = this.cliente.dependientes.indexOf(dependienteSeleccionado);
    this.cliente.dependientes.splice(index, 1);
    this.llenarDataSourceDependiente(this.cliente.dependientes);
    if (this.cliente.dependientes.length < 1)
      this.habilitarCelularTelefonoCorreoDependiente = true;
  }

  editarDependiente(dependienteSeleccionado: Dependiente) {
    this.editing = !this.editing;
    this.dependiente = dependienteSeleccionado;
  }

  confirmarEditarDependiente(row: Dependiente) {
    this.editing = !this.editing;
  }

  async actualizar(event: any) {
    if (event != null)
      event.preventDefault();
    //AGREGAR AUXILIARES
    if (this.dependiente.razonSocial != valores.vacio) {
      if (this.dependienteTelefono.numero != valores.vacio)
        this.dependiente.telefonos.push(this.dependienteTelefono);
      if (this.dependienteTelefono.numero != valores.vacio)
        this.dependiente.celulares.push(this.dependienteCelular);
      if (this.dependienteCorreo.email != valores.vacio)
        this.dependiente.correos.push(this.dependienteCorreo);
      let ubicacion: Ubicacion = new Ubicacion();
      ubicacion.provincia = this.dependienteProvincia;
      ubicacion.canton = this.dependienteCanton;
      ubicacion.parroquia = this.dependienteParroquia;
      if (ubicacion.provincia != valores.vacio && ubicacion.canton != valores.vacio && ubicacion.parroquia != valores.vacio) {
        await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
          res => {
            this.dependiente.direccion.ubicacion = res.resultado as Ubicacion;
          },
          err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        );
      }
      this.cliente.dependientes.push(this.dependiente);
    }
    //CLIENTE
    if (this.cliente.direccion.ubicacion.provincia != valores.vacio && this.cliente.direccion.ubicacion.canton != valores.vacio && this.cliente.direccion.ubicacion.parroquia != valores.vacio) {
      await this.ubicacionService.obtenerUbicacionID(this.cliente.direccion.ubicacion).then(
        res => {
          this.cliente.direccion.ubicacion = res.resultado as Ubicacion;
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }

    this.clienteService.actualizar(this.cliente).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.cliente = res.resultado as Cliente;
        this.dependienteCantones = [];
        this.dependienteParroquias = [];
        this.dependienteProvincia = "";
        this.dependienteCanton = "";
        this.dependienteParroquia = "";
        this.dependienteTelefono = new TelefonoDependiente();
        this.dependienteCelular = new CelularDependiente();
        this.dependienteCorreo = new CorreoDependiente();
        this.dependiente = new Dependiente();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.clienteService.eliminarPersonalizado(this.cliente).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        let indiceTabActivo = tab_activo(this.tabService);
        this.tabService.removeTab(indiceTabActivo);
        this.tabService.addNewTab(ClienteComponent, tabs.tab_cliente);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultar() {
    this.clienteService.consultar().subscribe(
      res => {
        this.clientes = res.resultado as Cliente[]
        this.llenarDataSourceCliente(this.clientes);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
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
      data.direccion.direccion.toUpperCase().includes(filter) || data.estado.toUpperCase().includes(filter);
    this.dataSourceCliente.paginator = this.paginator;
    this.dataSourceCliente.sort = this.sort;
  }

  seleccion(clienteSeleccionado: any) {
    if (!this.clickedRows.has(clienteSeleccionado)) {
      this.clickedRows.clear();
      this.clickedRows.add(clienteSeleccionado);
      let cliente = new Cliente();
      Object.assign(cliente, clienteSeleccionado as Cliente);
      cliente.normalizar();
      this.cliente = cliente;
      this.clienteProvincia = this.cliente.direccion.ubicacion.provincia;
      this.provincia(this.clienteProvincia);
      this.clienteCanton = this.cliente.direccion.ubicacion.canton;
      this.canton(this.clienteCanton);
      this.clienteParroquia = this.cliente.direccion.ubicacion.parroquia;
      this.cambiarFormaPago();
      this.llenarDataSourceDependiente(this.cliente.dependientes);
    } else {
      this.clickedRows.clear();
      this.cliente = new Cliente();
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
      data.razonSocial.toUpperCase().includes(filter) || data.direccion.direccion.toUpperCase().includes(filter) ||
      data.direccion.ubicacion.provincia.toUpperCase().includes(filter);
    this.dataSourceDependiente.paginator = this.paginator;
    this.dataSourceDependiente.sort = this.sort;
  }

  seleccionDependiente(dependienteSeleccionado: Dependiente) {
    this.dependiente = dependienteSeleccionado;
    if (!this.filaSeleccionada.has(dependienteSeleccionado)) {
      this.filaSeleccionada.clear();
      this.filaSeleccionada.add(dependienteSeleccionado);
      this.dependiente = dependienteSeleccionado;
    } else {
      this.filaSeleccionada.clear();
      this.dependiente = new Dependiente();
    }
  }

  ubicacionNormalizarActualizar() {
    if (this.cliente.direccion.ubicacion != null) {
      this.clienteProvincia = this.cliente.direccion.ubicacion.provincia;
      this.clienteCanton = this.cliente.direccion.ubicacion.canton;
      this.clienteParroquia = this.cliente.direccion.ubicacion.parroquia;
    }
    this.provincia(this.clienteProvincia);
    this.canton(this.clienteCanton);
  }

  validarIdentificacion() {
    this.clienteService.obtenerIdentificacion(this.cliente.identificacion).subscribe({
      next: (res) => {
        this.clienteService.validarIdentificacion(this.cliente.identificacion).subscribe({
          next: (res) => {
            this.cliente.tipoIdentificacion = res.resultado.tipoIdentificacion;
            this.cliente.tipoContribuyente = res.resultado.tipoContribuyente as TipoContribuyente;
            if (this.cliente.tipoContribuyente == null) {
              this.habilitarTipoContribuyente = true;
            } else {
              this.cliente.tipoContribuyente = this.obtenerTipoContribuyente() as TipoContribuyente;
            }
            this.cliente.segmento.id = 1;
            this.cliente.grupoCliente.id = 1;
            this.cliente.financiamiento.formaPago.id = 1;
            this.cambiarFormaPago();
            this.validarSexoEstadoCivilOrigenIngreso();
          },
          error: (err) => {
            this.cliente.tipoIdentificacion = null;
            this.cliente.tipoContribuyente = new TipoContribuyente();
            Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
          }
        });
      },
      error: (err) => {
        this.cliente.tipoIdentificacion = null;
        this.cliente.tipoContribuyente = new TipoContribuyente();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  validarTipoContribuyente() {
    this.cliente.tipoContribuyente = this.tiposContribuyentes[this.indiceTipoContribuyente];
  }

  obtenerTipoContribuyente() {
    for (let i = 0; i < this.tiposContribuyentes.length; i++) {
      if (this.cliente.tipoContribuyente.id == this.tiposContribuyentes[i].id)
        return this.tiposContribuyentes[i];
    }
  }

  cambiarRazonSocialDependiente() {
    if (this.dependiente.razonSocial != valores.vacio) {
      this.habilitarCelularTelefonoCorreoDependiente = false;
    }
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
      this.cliente.telefonos.push(this.telefono);
      this.telefono = new Telefono();
    } else {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_ingresado });
    }
  }
  validarTelefono() {
    let digito = this.telefono.numero.substring(0, 1);
    if (this.telefono.numero.length != 11 || digito != "0") {
      //this.telefono.numero = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_invalido });
    }
  }
  eliminarTelefono(i: number) {
    this.cliente.telefonos.splice(i, 1);
  }

  crearCelular() {
    if (this.celular.numero.length != 0) {
      this.cliente.celulares.push(this.celular);
      this.celular = new Celular();
    } else {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_ingresado });
    }
  }
  validarCelular() {
    let digito = this.celular.numero.substring(0, 2);
    if (this.celular.numero.length != 12 || digito != "09") {
      //this.celular.numero = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_invalido });
    }
  }
  eliminarCelular(i: number) {
    this.cliente.celulares.splice(i, 1);
  }

  crearCorreo() {
    if (this.correo.email.length != valores.cero) {
      this.cliente.correos.push(this.correo);
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


  provincia(provincia: string) {
    this.cliente.direccion.ubicacion.provincia = provincia;
    this.ubicacionService.obtenerCantones(provincia).subscribe({
      next: res => {
        this.cantones = res.resultado as Ubicacion[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarDependienteProvincia(provincia: string) {
    this.dependiente.direccion.ubicacion.provincia = provincia;
    this.ubicacionService.obtenerCantones(provincia).subscribe(
      res => {
        this.dependienteCantones = res.resultado as Ubicacion[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  canton(canton: string) {
    this.cliente.direccion.ubicacion.canton = canton;
    this.ubicacionService.obtenerParroquias(canton).subscribe({
      next: res => {
        this.parroquias = res.resultado as Ubicacion[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarDependienteCanton(canton: string) {
    this.dependiente.direccion.ubicacion.provincia = canton;
    this.ubicacionService.obtenerParroquias(canton).subscribe(
      res => {
        this.dependienteParroquias = res.resultado as Ubicacion[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  parroquia(parroquia: string) {
    this.cliente.direccion.ubicacion.parroquia = parroquia;
  }

  seleccionarDependienteParroquia(parroquia: string) {
    this.dependiente.direccion.ubicacion.parroquia = parroquia;
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
    //console.log('El dialogo para selección de grupo producto fue abierto');
    const dialogRef = this.dialog.open(DialogoMapaComponent, {
      width: '80%',
      // Para enviar datos
      //data: { usuario: this.usuario, clave: this.clave, grupo_producto_recibido: "" }
      data: this.posicionGeograficaDireccion as Coordenada
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('El dialogo para selección de coordenada fue cerrado');
      console.log(result);
      if (result) {
        this.posicionGeograficaDireccion = result as Coordenada;
        this.posicionCentralDireccion = this.posicionGeograficaDireccion;
       //console.log(result);
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
      //console.log('El dialogo para selección de coordenada fue cerrado');
      console.log(result);
      if (result) {
        this.posicionGeograficaDependiente = result as Coordenada;
        this.posicionCentralDependiente = this.posicionGeograficaDependiente;
       //console.log(result);
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