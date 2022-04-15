import { Router } from '@angular/router';
import { Component, OnInit, HostListener, Input, Type, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
import { Auxiliar } from '../../modelos/auxiliar';
import { TelefonoAuxiliar } from '../../modelos/telefono-auxiliar';
import { CorreoAuxiliar } from '../../modelos/correo-auxiliar';
import { CelularAuxiliar } from '../../modelos/celular-auxiliar';
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
  estadoCliente:boolean = true;
  editing:boolean = false;

  cliente: Cliente;
  clienteCrear: Cliente;
  clienteBuscar = new Cliente();
  clienteActualizar: Cliente;
  clientes: Cliente[];
  segmento: Segmento = new Segmento();
  segmentos: Segmento[] = [];
  auxiliar: Auxiliar = new Auxiliar();
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
  auxiliarProvincia: string = "";
  auxiliarCanton: string = "";
  auxiliarParroquia: string = "";
  telefono = new Telefono();
  celular = new Celular();
  correo = new Correo();
  auxiliarTelefono = new TelefonoAuxiliar();
  auxiliarCelular = new CelularAuxiliar();
  auxiliarCorreo = new CorreoAuxiliar();

  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];
  auxiliarProvincias: Ubicacion[];
  auxiliarCantones: Ubicacion[];
  auxiliarParroquias: Ubicacion[];
  activacion_s_es_oi: boolean = true;
  activacionPlazoCredito: boolean = false;

  tiposRetencionesIvaBien: TipoRetencion[];
  tiposRetencionesIvaServicio: TipoRetencion[];
  tiposRetencionesRentaBien: TipoRetencion[];
  tiposRetencionesRentaServicio: TipoRetencion[];

  habilitarTipoContribuyente = false;
  indiceTipoContribuyente: number = -1;
  habilitarCelularTelefonoCorreoAuxiliar = true;

  archivoImportar: File;
  panelOpenState = false;
  value = 'Clear me';

  columnasCliente: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Cliente) => `${row.id}`},
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Cliente) => `${row.codigo}`},
    { nombreColumna: 'identificacion', cabecera: 'Indentificación', celda: (row: Cliente) => `${row.identificacion}`},
    { nombreColumna: 'razonSocial', cabecera: 'Razón Social', celda: (row: Cliente) => `${row.razonSocial}`},
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: Cliente) => `${row.direccion.direccion}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Cliente) => `${row.estado}`}
  ];
  cabeceraCliente: string[]  = this.columnasCliente.map(titulo => titulo.nombreColumna);
  dataSourceCliente: MatTableDataSource<Cliente>;
  clickedRows = new Set<Cliente>();

  columnasDependiente: any[] = [
    { nombreColumna: 'razonSocial', cabecera: 'Razón Social', celda: (row: Auxiliar) => `${row.razonSocial}`},
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: Auxiliar) => `${row.direccion.direccion}`},
    { nombreColumna: 'provincia', cabecera: 'Provincia', celda: (row: Auxiliar) => `${row.direccion.ubicacion.provincia}`},
    { nombreColumna: 'canton', cabecera: 'Cantón', celda: (row: Auxiliar) => `${row.direccion.ubicacion.canton}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Auxiliar) => `${row.estado ? 'ACTIVO' : 'INACTIVO'}`},
    { nombreColumna: 'acciones', cabecera: 'Acciones', celda: ''}
  ];
  cabeceraDependientes: string[]  = this.columnasDependiente.map(titulo => titulo.nombreColumna);
  dataSourceDependiente: MatTableDataSource<Auxiliar>;
  filaSeleccionada = new Set<Auxiliar>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private clienteService: ClienteService, private generoService: GeneroService,
    private estadoCivilService: EstadoCivilService, private origenIngresoService: OrigenIngresoService,
    private calificacionClienteService: CalificacionClienteService, private plazoCreditoService: PlazoCreditoService,
    private tipoPagoService: TipoPagoService, private formaPagoService: FormaPagoService,
    private ubicacionService: UbicacionService, private grupoClienteService: GrupoClienteService,
    private tipoRetencionService: TipoRetencionService, private router: Router, private tabService: TabService,
    private sesionService: SesionService, private empresaService: EmpresaService, private segmentoService: SegmentoService,
    private tipoContribuyenteService: TipoContribuyenteService, private modalService: NgbModal) { }

  ngOnInit() {
    util.validarSesion(this.sesion, this.sesionService, this.router);
    this.cliente = new Cliente();
    this.construirCliente();
    this.obtenerEmpresa();
    this.obtenerSesion();
    this.consultar();
    this.tipoContribuyenteService.consultar().subscribe({
      next: (res) => {
        this.tiposContribuyentes = res.resultado as TipoContribuyente[];
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.segmentoService.consultar().subscribe({
      next: (res) => {
        this.segmentos = res.resultado as Segmento[];
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.grupoClienteService.consultar().subscribe({
      next: (res) => {
        this.gruposClientes = res.resultado as GrupoCliente[]
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.generoService.consultar().subscribe({
      next: (res) => {
        this.generos = res.resultado as Genero[]
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.estadoCivilService.consultar().subscribe({
      next: (res) => {
        this.estadosCiviles = res.resultado as EstadoCivil[]
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.origenIngresoService.consultar().subscribe({
      next: (res) => {
        this.origenesIngresos = res.resultado as OrigenIngreso[];
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.calificacionClienteService.consultar().subscribe(
      res => {
        this.calificacionesClientes = res.resultado as CalificacionCliente[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.plazoCreditoService.consultar().subscribe(
      res => {
        this.plazosCreditos = res.resultado as PlazoCredito[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.tipoPagoService.consultar().subscribe(
      res => {
        this.tiposPagos = res.resultado as TipoPago[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.formaPagoService.consultar().subscribe(
      res => {
        this.formasPagos = res.resultado as FormaPago[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.ubicacionService.obtenerProvincias().subscribe(
      res => {
        this.provincias = res.resultado as Ubicacion[];
        this.auxiliarProvincias = res.resultado as Ubicacion[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.tipoRetencionService.obtenerIvaBien().subscribe(
      res => {
        this.tiposRetencionesIvaBien = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.tipoRetencionService.obtenerIvaServicio().subscribe(
      res => {
        this.tiposRetencionesIvaServicio = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.tipoRetencionService.obtenerRentaBien().subscribe(
      res => {
        this.tiposRetencionesRentaBien = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.tipoRetencionService.obtenerRentaServicio().subscribe(
      res => {
        this.tiposRetencionesRentaServicio = res.resultado as TipoRetencion[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G")
      this.crearCliente(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N")
      this.nuevoCliente(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "E")
      console.log('SHIFT + E');
    if (($event.shiftKey || $event.metaKey) && $event.key == "B")
      console.log('SHIFT + B');
    if (($event.shiftKey || $event.metaKey) && $event.key == "A")
      console.log('SHIFT + A');
  }

  obtenerSesion() {
    this.sesion = this.sesionService.getSesion();
  }

  construirCliente() {
    let clienteId = 0;
    this.clienteService.currentMessage.subscribe(message => clienteId = message);
    if (clienteId != 0) {
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
          Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
        }
      )
    }
  }

  obtenerEmpresa() {
    let empresa = new Empresa();
    empresa.id = 1;
    this.empresaService.obtener(empresa).subscribe(
      res => {
        empresa = res.resultado as Empresa
        this.urlLogo = environment.prefijo_url_imagenes + "logos/" + empresa.logo;
        this.nombreEmpresa = empresa.razonSocial;
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
  }

  nuevoCliente(event: any) {
    if (event != null)
      event.preventDefault();
    this.tabService.addNewTab(ClienteComponent, constantes.tab_crear_cliente);
  }

  open(content: any, event: any) {
    if (event != null)
      event.preventDefault();
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    }, (reason) => {

    });
  }

  async crearCliente(event: any) {
    if (event != null)
      event.preventDefault();
    //AGREGAR AUXILIAR
    if (this.auxiliar.razonSocial != constantes.vacio && this.auxiliar.direccion.direccion != constantes.vacio) {
      if (this.auxiliarTelefono.numero != constantes.vacio)
        this.auxiliar.telefonos.push(this.auxiliarTelefono);
      if (this.auxiliarTelefono.numero != constantes.vacio)
        this.auxiliar.celulares.push(this.auxiliarCelular);
      if (this.auxiliarCorreo.email != constantes.vacio)
        this.auxiliar.correos.push(this.auxiliarCorreo);
      let ubicacion: Ubicacion = new Ubicacion();
      ubicacion.provincia = this.auxiliarProvincia;
      ubicacion.canton = this.auxiliarCanton;
      ubicacion.parroquia = this.auxiliarParroquia;
      if (ubicacion.provincia != "" && ubicacion.canton != "" && ubicacion.parroquia != "") {
        await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
          res => {
            this.auxiliar.direccion.ubicacion = res.resultado as Ubicacion;
          },
          err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
        );
      }
      this.cliente.auxiliares.push(this.auxiliar);
    }

    //CLIENTE
    if (this.cliente.direccion.ubicacion.provincia != "" && this.cliente.direccion.ubicacion.canton != "" && this.cliente.direccion.ubicacion.parroquia != "") {
      await this.ubicacionService.obtenerUbicacionID(this.cliente.direccion.ubicacion).then(
        res => {
          this.cliente.direccion.ubicacion = res.resultado as Ubicacion;
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
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
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        let indiceTabActivo = constantes.tab_activo(this.tabService);
        //this.tabService.removeTab(indiceTabActivo);
        this.tabService.addNewTab(ClienteComponent, constantes.tab_crear_cliente);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }
  
  async crearAuxiliar() {
    if (this.auxiliarTelefono.numero != undefined)
      this.auxiliar.telefonos.push(this.auxiliarTelefono);
    if (this.auxiliarTelefono.numero != undefined)
      this.auxiliar.celulares.push(this.auxiliarCelular);
    if (this.auxiliarCorreo.email != undefined)
      this.auxiliar.correos.push(this.auxiliarCorreo);
    let ubicacion: Ubicacion = new Ubicacion();
    ubicacion.provincia = this.auxiliarProvincia;
    ubicacion.canton = this.auxiliarCanton;
    ubicacion.parroquia = this.auxiliarParroquia;
    if (ubicacion.provincia != "" && ubicacion.canton != "" && ubicacion.parroquia != "") {
      await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
        res => {
          this.auxiliar.direccion.ubicacion = res.resultado as Ubicacion;
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
      );
    }
    this.cliente.auxiliares.push(this.auxiliar);
    this.llenarDataSourceDependiente(this.cliente.auxiliares);
    this.auxiliar = new Auxiliar();
    this.habilitarCelularTelefonoCorreoAuxiliar = false;
    this.auxiliarProvincia = "";
    this.auxiliarCanton = "";
    this.auxiliarParroquia = "";
    this.auxiliarTelefono = new TelefonoAuxiliar();
    this.auxiliarCelular = new CelularAuxiliar();
    this.auxiliarCorreo = new CorreoAuxiliar();
  }

  eliminarAuxiliar(auxiliarSeleccionado: Auxiliar) {
    let index = this.cliente.auxiliares.indexOf(auxiliarSeleccionado);
    this.cliente.auxiliares.splice(index, 1);
    this.llenarDataSourceDependiente(this.cliente.auxiliares);
    if (this.cliente.auxiliares.length < 1)
      this.habilitarCelularTelefonoCorreoAuxiliar = true;
    console.log(this.cliente.auxiliares);  
  }

  editarAuxiliar(auxiliarSeleccionado: Auxiliar){
    this.editing = !this.editing;
    this.auxiliar = auxiliarSeleccionado;
  }

  confirmarEditarAuxiliar(row: Auxiliar){
    this.editing = !this.editing;
  }

  async actualizar(event: any) {
    if (event != null)
      event.preventDefault();
    //AGREGAR AUXILIARES
    if (this.auxiliar.razonSocial != constantes.vacio) {
      if (this.auxiliarTelefono.numero != constantes.vacio)
        this.auxiliar.telefonos.push(this.auxiliarTelefono);
      if (this.auxiliarTelefono.numero != constantes.vacio)
        this.auxiliar.celulares.push(this.auxiliarCelular);
      if (this.auxiliarCorreo.email != constantes.vacio)
        this.auxiliar.correos.push(this.auxiliarCorreo);
      let ubicacion: Ubicacion = new Ubicacion();
      ubicacion.provincia = this.auxiliarProvincia;
      ubicacion.canton = this.auxiliarCanton;
      ubicacion.parroquia = this.auxiliarParroquia;
      if (ubicacion.provincia != constantes.vacio && ubicacion.canton != constantes.vacio && ubicacion.parroquia != constantes.vacio) {
        await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
          res => {
            this.auxiliar.direccion.ubicacion = res.resultado as Ubicacion;
          },
          err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
        );
      }
      this.cliente.auxiliares.push(this.auxiliar);
    }
    //CLIENTE
    console.log(this.cliente);
    if (this.cliente.direccion.ubicacion.provincia != "" && this.cliente.direccion.ubicacion.canton != "" && this.cliente.direccion.ubicacion.parroquia != "") {
      await this.ubicacionService.obtenerUbicacionID(this.cliente.direccion.ubicacion).then(
        res => {
          this.cliente.direccion.ubicacion = res.resultado as Ubicacion;
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
      );
    }

    this.clienteService.actualizar(this.cliente).subscribe(
      res => {
        if (res.resultado != null) {
          Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
          this.cliente = res.resultado as Cliente;
          this.auxiliarCantones = [];
          this.auxiliarParroquias = [];

          this.auxiliarProvincia = "";
          this.auxiliarCanton = "";
          this.auxiliarParroquia = "";
          this.auxiliarTelefono = new TelefonoAuxiliar();
          this.auxiliarCelular = new CelularAuxiliar();
          this.auxiliarCorreo = new CorreoAuxiliar();
          this.auxiliar = new Auxiliar();
        }
        else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  actualizarLeer(event: any) {
    if (event!=null)
      event.preventDefault();
    this.clienteService.enviar(this.cliente.id);
    this.tabService.addNewTab(this.ComponenteCliente,'Actualizar Cliente');
  }

  eliminar(cliente: Cliente) {
    this.clienteService.eliminar(cliente).subscribe(
      res => {
        if (res.resultado != null) {
          Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
          this.cliente = res.resultado as Cliente
          this.ngOnInit();
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  eliminarLeer(event: any) {
    if (event!=null)
      event.preventDefault();
    this.clienteService.eliminar(this.cliente).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  consultar() {
    this.clienteService.consultar().subscribe(
      res => {
        this.clientes = res.resultado as Cliente[]
        this.llenarDataSourceCliente(this.clientes);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  filtroCliente(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCliente.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceCliente.paginator) {
      this.dataSourceCliente.paginator.firstPage();
    }
  }

  llenarDataSourceCliente(clientes : Cliente[]){
    this.dataSourceCliente = new MatTableDataSource(clientes);
    this.dataSourceCliente.filterPredicate = (data: Cliente, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.identificacion.toUpperCase().includes(filter) || data.razonSocial.toUpperCase().includes(filter) ||
      data.direccion.direccion.toUpperCase().includes(filter) || data.estado.toUpperCase().includes(filter);
    this.dataSourceCliente.paginator = this.paginator;
    this.dataSourceCliente.sort = this.sort;
  }

  seleccion(clienteSeleccionado: Cliente) {
    console.log(clienteSeleccionado);
    this.cliente=clienteSeleccionado;
    if (!this.clickedRows.has(clienteSeleccionado)){
      this.clickedRows.clear();
      this.clickedRows.add(clienteSeleccionado);
      this.cliente = clienteSeleccionado;
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

  llenarDataSourceDependiente(dependientes : Auxiliar[]){
    this.dataSourceDependiente = new MatTableDataSource(dependientes);
    this.dataSourceDependiente.filterPredicate = (data: Auxiliar, filter: string): boolean =>
      data.razonSocial.toUpperCase().includes(filter) || data.direccion.direccion.toUpperCase().includes(filter) ||
      data.direccion.ubicacion.provincia.toUpperCase().includes(filter);
    this.dataSourceDependiente.paginator = this.paginator;
    this.dataSourceDependiente.sort = this.sort;
  }

  seleccionDependiente(dependienteSeleccionado: Auxiliar) {
    console.log(dependienteSeleccionado);
    this.auxiliar=dependienteSeleccionado;
    if (!this.filaSeleccionada.has(dependienteSeleccionado)){
      this.filaSeleccionada.clear();
      this.filaSeleccionada.add(dependienteSeleccionado);
      this.auxiliar = dependienteSeleccionado;
    } else {
      this.filaSeleccionada.clear();
      this.auxiliar = new Auxiliar();
    }
  }

  buscar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.clienteService.buscar(this.clienteBuscar).subscribe(
      res => {
        this.clientes = res.resultado as Cliente[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  cambiarBuscarIdentificacion(){
    this.buscar(null);
  }
  cambiarBuscarRazonSocial(){
    this.buscar(null);
  }

  cambiarEstado(){
    if (this.estadoCliente){
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
            this.cliente.tipoIdentificacion = res.resultado.tipo_identificacion;
            this.cliente.tipoContribuyente = res.resultado.tipo_contribuyente as TipoContribuyente;
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
            Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
          }
        });
      },
      error: (err) => {
        this.cliente.tipoIdentificacion = '';
        this.cliente.tipoContribuyente = new TipoContribuyente();
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
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

  cambiarRazonSocialAuxiliar() {
    if (this.auxiliar.razonSocial != "") {
      this.habilitarCelularTelefonoCorreoAuxiliar = false;
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
    if (this.telefono.numero.length != 0 ){
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
    if (this.celular.numero.length != 0 ){
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
    if (this.correo.email.length != 0 ){
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

  crearTelefonoAuxiliar() {
    if (this.auxiliarTelefono.numero.length !=0 ){
      if (this.cliente.auxiliares.length > 0 && this.auxiliar.razonSocial == "") {
        this.cliente.auxiliares.slice(-1)[0].telefonos.push(this.auxiliarTelefono);
      } else {
        this.auxiliar.telefonos.push(this.auxiliarTelefono);
      }
      this.auxiliarTelefono = new TelefonoAuxiliar();
    }
  }
  validarTelefonoAuxiliar() {
    let digito = this.auxiliarTelefono.numero.substr(0, 1);
    if (this.auxiliarTelefono.numero.length != 11 || digito != "0") {
      this.auxiliarTelefono.numero = "";
      Swal.fire(constantes.error, "Telefono Invalido", constantes.error_swal);
    }
  }
  eliminarTelefonoAuxiliar(i: number) {
    this.auxiliar.telefonos.splice(i, 1);
    this.auxiliarTelefono = new TelefonoAuxiliar();
  }

  crearCelularAuxiliar() {
    if (this.auxiliarCelular.numero.length !=0 ){
      if (this.cliente.auxiliares.length > 0 && this.auxiliar.razonSocial == "") {
        this.cliente.auxiliares.slice(-1)[0].celulares.push(this.auxiliarCelular);
      }
      else {
        this.auxiliar.celulares.push(this.auxiliarCelular);
      }
      this.auxiliarCelular = new CelularAuxiliar();
    }
  }
  validarCelularAuxiliar() {
    let digito = this.auxiliarCelular.numero.substr(0, 2);
    if (this.auxiliarCelular.numero.length != 12 || digito != "09") {
      this.auxiliarCelular.numero = "";
      Swal.fire(constantes.error, "Celular Invalido", constantes.error_swal);
    }
  }
  eliminarCelularAuxiliar(i: number) {
    this.auxiliar.celulares.splice(i, 1);
    this.auxiliarCelular = new CelularAuxiliar();
  }

  crearCorreoAuxiliar() {
    if (this.auxiliarCorreo.email.length !=0 ){
      if (this.cliente.auxiliares.length > 0 && this.auxiliar.razonSocial == "") {
        this.cliente.auxiliares.slice(-1)[0].correos.push(this.auxiliarCorreo);
      } else {
        this.auxiliar.correos.push(this.auxiliarCorreo);
      }
      this.auxiliarCorreo = new CorreoAuxiliar();
    }
  }
  validarCorreoAuxiliar() {
    let arroba = this.auxiliarCorreo.email.includes("@");
    if (!arroba) {
      this.auxiliarCorreo.email = "";
      Swal.fire(constantes.error, "Correo Invalido", constantes.error_swal);
    }
  }
  eliminarCorreoAuxiliar(i: number) {
    this.auxiliar.correos.splice(i, 1);
    this.auxiliarCorreo = new CorreoAuxiliar();
  }


  provincia(provincia: string) {
    this.cliente.direccion.ubicacion.provincia = provincia;
    this.ubicacionService.obtenerCantones(provincia).subscribe(
      res => {
        if (res.resultado != null) {
          this.cantones = res.resultado as Ubicacion[];
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccionarAuxiliarProvincia(provincia: string) {
    this.auxiliar.direccion.ubicacion.provincia = provincia;
    this.ubicacionService.obtenerCantones(provincia).subscribe(
      res => {
        if (res.resultado != null) {
          this.auxiliarCantones = res.resultado as Ubicacion[];
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  canton(canton: string) {
    this.cliente.direccion.ubicacion.canton = canton;
    this.ubicacionService.obtenerParroquias(canton).subscribe(
      res => {
        if (res.resultado != null) {
          this.parroquias = res.resultado as Ubicacion[];
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccionarAuxiliarCanton(canton: string) {
    this.auxiliar.direccion.ubicacion.provincia = canton;
    this.ubicacionService.obtenerParroquias(canton).subscribe(
      res => {
        if (res.resultado != null) {
          this.auxiliarParroquias = res.resultado as Ubicacion[];
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  parroquia(parroquia: string) {
    this.cliente.direccion.ubicacion.parroquia = parroquia;
  }

  seleccionarAuxiliarParroquia(parroquia: string) {
    this.auxiliar.direccion.ubicacion.parroquia = parroquia;
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
    /*
    this.clienteService.importar(archivoImportar).subscribe(
      res => {
        if (res.resultado != null) {
          this.auxiliarCantones = res.resultado as Ubicacion[];
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );*/
  }

}
