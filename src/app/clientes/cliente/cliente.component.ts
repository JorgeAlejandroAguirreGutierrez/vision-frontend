import { Component, OnInit, HostListener, Type, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MouseEvent } from '@agm/core'; 
import { Router } from '@angular/router'; 
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';

import { environment } from '../../../environments/environment';
import { Empresa } from '../../modelos/empresa';
import { EmpresaService } from '../../servicios/empresa.service';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { TabService } from '../../componentes/services/tab.service';
import { Cliente } from '../../modelos/cliente';
import { ClienteService } from '../../servicios/cliente.service';
import { TipoContribuyente } from '../../modelos/tipo-contribuyente';
import { TipoContribuyenteService } from '../../servicios/tipo-contribuyente.service';
import { SegmentoService } from '../../servicios/segmento.service';
import { Segmento } from '../../modelos/segmento';
import { GrupoCliente } from '../../modelos/grupo-cliente'
import { GrupoClienteService } from '../../servicios/grupo-cliente.service';
import { Ubicacion } from '../../modelos/ubicacion';
import { UbicacionService } from '../../servicios/ubicacion.service';
import { Telefono } from '../../modelos/telefono';
import { Celular } from '../../modelos/celular';
import { Correo } from '../../modelos/correo';
import { Coordenada } from '../../modelos/coordenada';
import { Dependiente } from '../../modelos/dependiente';
import { TelefonoDependiente } from '../../modelos/telefono-dependiente';
import { CorreoDependiente } from '../../modelos/correo-dependiente';
import { CelularDependiente } from '../../modelos/celular-dependiente';
import { Genero } from '../../modelos/genero';
import { GeneroService } from '../../servicios/genero.service';
import { EstadoCivil } from '../../modelos/estado-civil';
import { EstadoCivilService } from '../../servicios/estado-civil.service';
import { OrigenIngreso } from '../../modelos/origen-ingreso';
import { OrigenIngresoService } from '../../servicios/origen-ingreso.service';
import { CalificacionCliente } from '../../modelos/calificacion-cliente';
import { CalificacionClienteService } from '../../servicios/calificacion-cliente.service';
import { PlazoCredito } from '../../modelos/plazo-credito';
import { PlazoCreditoService } from '../../servicios/plazo-credito.service';
import { FormaPago } from '../../modelos/forma-pago';
import { FormaPagoService } from '../../servicios/forma-pago.service';
import { TipoPago } from '../../modelos/tipo-pago';
import { TipoPagoService } from '../../servicios/tipo-pago.service';
import { TipoRetencion } from '../../modelos/tipo-retencion';
import { TipoRetencionService } from '../../servicios/tipo-retencion.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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
  urlAvatar: string = environment.prefijo_url_imagenes + "avatar/avatar1.png";

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
  latitud: number = -1.6705413480437092; //Tomar de configuación y poner en el init
  longitud: number = -78.64974203645144;
  ubicacionCentral: Coordenada = new Coordenada(this.latitud, this.longitud);
  ubicacionGeografica: Coordenada;
  mapTypeId: string = 'hybrid';
  coordenadas: Coordenada[] = [];

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

  constructor(public dialog: MatDialog, private clienteService: ClienteService, private generoService: GeneroService,
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
    this.sesion = util.validarSesion(this.sesionService, this.router);
    this.obtenerEmpresa();
    this.obtenerSesion();
    this.consultar();
    this.tipoContribuyenteService.consultar().subscribe({
      next: (res) => {
        this.tiposContribuyentes = res.resultado as TipoContribuyente[];
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.segmentoService.consultar().subscribe({
      next: (res) => {
        this.segmentos = res.resultado as Segmento[];
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.grupoClienteService.consultar().subscribe({
      next: (res) => {
        this.gruposClientes = res.resultado as GrupoCliente[]
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.generoService.consultar().subscribe({
      next: (res) => {
        this.generos = res.resultado as Genero[]
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.estadoCivilService.consultar().subscribe({
      next: (res) => {
        this.estadosCiviles = res.resultado as EstadoCivil[]
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.origenIngresoService.consultar().subscribe({
      next: (res) => {
        this.origenesIngresos = res.resultado as OrigenIngreso[];
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.calificacionClienteService.consultar().subscribe(
      res => {
        this.calificacionesClientes = res.resultado as CalificacionCliente[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.plazoCreditoService.consultar().subscribe(
      res => {
        this.plazosCreditos = res.resultado as PlazoCredito[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.tipoPagoService.consultar().subscribe(
      res => {
        this.tiposPagos = res.resultado as TipoPago[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.formaPagoService.consultar().subscribe(
      res => {
        this.formasPagos = res.resultado as FormaPago[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.ubicacionService.obtenerProvincias().subscribe(
      res => {
        this.provincias = res.resultado as Ubicacion[];
        this.dependienteProvincias = res.resultado as Ubicacion[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.tipoRetencionService.obtenerIvaBien().subscribe(
      res => {
        this.tiposRetencionesIvaBien = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.tipoRetencionService.obtenerIvaServicio().subscribe(
      res => {
        this.tiposRetencionesIvaServicio = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.tipoRetencionService.obtenerRentaBien().subscribe(
      res => {
        this.tiposRetencionesRentaBien = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
    this.tipoRetencionService.obtenerRentaServicio().subscribe(
      res => {
        this.tiposRetencionesRentaServicio = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
  }

  mapClicked($event: MouseEvent){
    let coordenada = new Coordenada($event.coords.lat, $event.coords.lng);
    this.coordenadas.push(coordenada);
  }

  getCurrentPosition(){
    navigator.geolocation.getCurrentPosition(position => {
      this.ubicacionCentral = new Coordenada(position.coords.latitude, position.coords.longitude);
      console.log(this.ubicacionCentral);
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
        this.urlLogo = environment.prefijo_url_imagenes + "logos/" + empresa.logo;
        this.nombreEmpresa = empresa.razonSocial;
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
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
    if (this.dependienteTelefono.numero != constantes.vacio)
      this.dependiente.telefonos.push(this.dependienteTelefono);
    if (this.dependienteTelefono.numero != constantes.vacio)
      this.dependiente.celulares.push(this.dependienteCelular);
    if (this.dependienteCorreo.email != constantes.vacio)
      this.dependiente.correos.push(this.dependienteCorreo);
    let ubicacion: Ubicacion = new Ubicacion();
    ubicacion.provincia = this.dependienteProvincia;
    ubicacion.canton = this.dependienteCanton;
    ubicacion.parroquia = this.dependienteParroquia;
    this.dependiente.direccion.ubicacion = ubicacion;
    this.cliente.puntoVenta = this.sesion.usuario.puntoVenta;
    if (this.telefono.numero != constantes.vacio)
      this.cliente.telefonos.push(this.telefono);
    if (this.celular.numero != constantes.vacio)
      this.cliente.celulares.push(this.celular);
    if (this.correo.email != constantes.vacio)
      this.cliente.correos.push(this.correo);
    console.log(this.cliente);
    this.clienteService.crear(this.cliente).subscribe(
      res => {
        this.cliente = res.resultado as Cliente;
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
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
    if (ubicacion.provincia != "" && ubicacion.canton != "" && ubicacion.parroquia != "") {
      this.cliente.dependientes.push(this.dependiente);
      this.llenarDataSourceDependiente(this.cliente.dependientes);
      this.dependiente = new Dependiente();
      this.habilitarCelularTelefonoCorreoDependiente = false;
      this.dependienteProvincia = "";
      this.dependienteCanton = "";
      this.dependienteParroquia = "";
      this.dependienteTelefono = new TelefonoDependiente();
      this.dependienteCelular = new CelularDependiente();
      this.dependienteCorreo = new CorreoDependiente();
    } else {
      Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: constantes.error_agregar_dependiente});
    }
  }

  eliminarDependiente(dependienteSeleccionado: Dependiente) {
    let index = this.cliente.dependientes.indexOf(dependienteSeleccionado);
    this.cliente.dependientes.splice(index, 1);
    this.llenarDataSourceDependiente(this.cliente.dependientes);
    if (this.cliente.dependientes.length < 1)
      this.habilitarCelularTelefonoCorreoDependiente = true;
    console.log(this.cliente.dependientes);
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
    if (this.dependiente.razonSocial != constantes.vacio) {
      if (this.dependienteTelefono.numero != constantes.vacio)
        this.dependiente.telefonos.push(this.dependienteTelefono);
      if (this.dependienteTelefono.numero != constantes.vacio)
        this.dependiente.celulares.push(this.dependienteCelular);
      if (this.dependienteCorreo.email != constantes.vacio)
        this.dependiente.correos.push(this.dependienteCorreo);
      let ubicacion: Ubicacion = new Ubicacion();
      ubicacion.provincia = this.dependienteProvincia;
      ubicacion.canton = this.dependienteCanton;
      ubicacion.parroquia = this.dependienteParroquia;
      if (ubicacion.provincia != constantes.vacio && ubicacion.canton != constantes.vacio && ubicacion.parroquia != constantes.vacio) {
        await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
          res => {
            this.dependiente.direccion.ubicacion = res.resultado as Ubicacion;
          },
          err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
        );
      }
      this.cliente.dependientes.push(this.dependiente);
    }
    //CLIENTE
    console.log(this.cliente);
    if (this.cliente.direccion.ubicacion.provincia != "" && this.cliente.direccion.ubicacion.canton != "" && this.cliente.direccion.ubicacion.parroquia != "") {
      await this.ubicacionService.obtenerUbicacionID(this.cliente.direccion.ubicacion).then(
        res => {
          this.cliente.direccion.ubicacion = res.resultado as Ubicacion;
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }

    this.clienteService.actualizar(this.cliente).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
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
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.clienteService.eliminarPersonalizado(this.cliente).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        let indiceTabActivo = constantes.tab_activo(this.tabService);
        this.tabService.removeTab(indiceTabActivo);
        this.tabService.addNewTab(ClienteComponent, constantes.tab_cliente);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultar() {
    this.clienteService.consultar().subscribe(
      res => {
        this.clientes = res.resultado as Cliente[]
        this.llenarDataSourceCliente(this.clientes);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
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
      console.log(this.cliente);
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
    console.log(dependienteSeleccionado);
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

  cambiarEstado() {
    if (this.estadoCliente) {
      this.cliente.estado = 'ACTIVO';
    } else {
      this.cliente.estado = 'INACTIVO';
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
            console.log(res);
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
            this.cliente.tipoIdentificacion = '';
            this.cliente.tipoContribuyente = new TipoContribuyente();
            Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
          }
        });
      },
      error: (err) => {
        this.cliente.tipoIdentificacion = '';
        this.cliente.tipoContribuyente = new TipoContribuyente();
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
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
    if (this.dependiente.razonSocial != "") {
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
    if (this.telefono.numero.length != 0) {
      this.cliente.telefonos.push(this.telefono);
      this.telefono = new Telefono();
    } else {
      Swal.fire(constantes.error, "Ingrese un número telefónico válido", constantes.error_swal);
    }
  }
  validarTelefono() {
    let digito = this.telefono.numero.substr(0, 1);
    if (this.telefono.numero.length != 11 || digito != "0") {
      this.telefono.numero = "";
      Swal.fire(constantes.error, "Telefono Invalido", constantes.error_swal);
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
      Swal.fire(constantes.error, "Ingrese un número de celular válido", constantes.error_swal);
    }
  }
  validarCelular() {
    let digito = this.celular.numero.substr(0, 2);
    if (this.celular.numero.length != 12 || digito != "09") {
      this.celular.numero = "";
      Swal.fire(constantes.error, "Celular Invalido", constantes.error_swal);
    }
  }
  eliminarCelular(i: number) {
    this.cliente.celulares.splice(i, 1);
  }

  crearCorreo() {
    if (this.correo.email.length != 0) {
      this.cliente.correos.push(this.correo);
      this.correo = new Correo();
    } else {
      Swal.fire(constantes.error, "Ingrese un correo válido", constantes.error_swal);
    }
  }
  validarCorreo() {
    let arroba = this.correo.email.includes("@");
    if (!arroba) {
      this.correo.email = "";
      Swal.fire(constantes.error, "Correo Invalido", constantes.error_swal);
    }
  }
  eliminarCorreo(i: number) {
    this.cliente.correos.splice(i, 1);
  }

  crearTelefonoDependiente() {
    if (this.dependienteTelefono.numero.length != 0) {
      if (this.cliente.dependientes.length > 0 && this.dependiente.razonSocial == "") {
        this.cliente.dependientes.slice(-1)[0].telefonos.push(this.dependienteTelefono);
      } else {
        this.dependiente.telefonos.push(this.dependienteTelefono);
      }
      this.dependienteTelefono = new TelefonoDependiente();
    }
  }
  validarTelefonoDependiente() {
    let digito = this.dependienteTelefono.numero.substr(0, 1);
    if (this.dependienteTelefono.numero.length != 11 || digito != "0") {
      this.dependienteTelefono.numero = "";
      Swal.fire(constantes.error, "Telefono Invalido", constantes.error_swal);
    }
  }
  eliminarTelefonoDependiente(i: number) {
    this.dependiente.telefonos.splice(i, 1);
    this.dependienteTelefono = new TelefonoDependiente();
  }

  crearCelularDependiente() {
    if (this.dependienteCelular.numero.length != 0) {
      if (this.cliente.dependientes.length > 0 && this.dependiente.razonSocial == "") {
        this.cliente.dependientes.slice(-1)[0].celulares.push(this.dependienteCelular);
      }
      else {
        this.dependiente.celulares.push(this.dependienteCelular);
      }
      this.dependienteCelular = new CelularDependiente();
    }
  }
  validarCelularDependiente() {
    let digito = this.dependienteCelular.numero.substr(0, 2);
    if (this.dependienteCelular.numero.length != 12 || digito != "09") {
      this.dependienteCelular.numero = "";
      Swal.fire(constantes.error, "Celular Invalido", constantes.error_swal);
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
      this.dependienteCorreo.email = "";
      Swal.fire(constantes.error, "Correo Invalido", constantes.error_swal);
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
        if (res.resultado != null) {
          this.cantones = res.resultado as Ubicacion[];
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarDependienteProvincia(provincia: string) {
    this.dependiente.direccion.ubicacion.provincia = provincia;
    this.ubicacionService.obtenerCantones(provincia).subscribe(
      res => {
        if (res.resultado != null) {
          this.dependienteCantones = res.resultado as Ubicacion[];
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  canton(canton: string) {
    this.cliente.direccion.ubicacion.canton = canton;
    this.ubicacionService.obtenerParroquias(canton).subscribe({
      next: res => {
        if (res.resultado != null) {
          this.parroquias = res.resultado as Ubicacion[];
        } else {
          Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: res.mensaje })
        }
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarDependienteCanton(canton: string) {
    this.dependiente.direccion.ubicacion.provincia = canton;
    this.ubicacionService.obtenerParroquias(canton).subscribe(
      res => {
        if (res.resultado != null) {
          this.dependienteParroquias = res.resultado as Ubicacion[];
        } else {
          Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: res.mensaje })
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  parroquia(parroquia: string) {
    this.cliente.direccion.ubicacion.parroquia = parroquia;
  }

  seleccionarDependienteParroquia(parroquia: string) {
    this.dependiente.direccion.ubicacion.parroquia = parroquia;
  }

  validarSexoEstadoCivilOrigenIngreso() {
    if (this.cliente.tipoContribuyente.tipo == constantes.tipo_contribuyente_juridica) {
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
          Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: res.mensaje })
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  dialogoMapas(): void {
    //console.log('El dialogo para selección de grupo producto fue abierto');
    const dialogRef = this.dialog.open(DialogoMapaComponent, {
      width: '80%',
      // Para enviar datos
      //data: { usuario: this.usuario, clave: this.clave, grupo_producto_recibido: "" }
      data: this.ubicacionGeografica as Coordenada
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('El dialogo para selección de coordenada fue cerrado');
      console.log(result);
      if (result) {
        this.ubicacionGeografica = result as Coordenada;
        this.ubicacionCentral = this.ubicacionGeografica;
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