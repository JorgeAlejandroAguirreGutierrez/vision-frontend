import { Router } from '@angular/router'; 
import { Component, OnInit, HostListener, Input, Type, ViewChild, ɵConsole } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';

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
import { Proveedor } from '../../modelos/proveedor';
import { ProveedorService } from '../../servicios/proveedor.service';

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

  urlLogo: string = "";
  nombreEmpresa: string = "";
  urlAvatar: string = environment.prefijo_url_imagenes + "avatar/avatar1.png";

  abrirPanelProveedor: boolean = true;
  abrirPanelUbicacion: boolean = false;
  abrirPanelDependiente: boolean = false;
  abrirPanelDatoAdicional: boolean = false;
  abrirPanelAdminProveedor: boolean = false;
  estadoProveedor: boolean = true;
  editing:boolean = false;

  cliente: Cliente = new Cliente;
  proveedor: Proveedor = new Proveedor;
  proveedores: Proveedor[];
  //cliente: Cliente;
  proveedorCrear: Proveedor;
  proveedorBuscar = new Proveedor();
  proveedorActualizar: Proveedor;
  //proveedores: Proveedor[];
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

  proveedorProvincia: string = "";
  proveedorCanton: string = "";
  proveedorParroquia: string = "";
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

  //ComponenteLeerCliente: Type<any> = ClienteLeerComponent;
  habilitarTipoContribuyente = false;
  indiceTipoContribuyente: number = -1;
  habilitarCelularTelefonoCorreoDependiente = true;

  archivoImportar: File = null;
  panelOpenState = false;
  value = 'Clear me';

  columnasProveedor: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Proveedor) => `${row.id}`},
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Proveedor) => `${row.codigo}`},
    { nombreColumna: 'identificacion', cabecera: 'Indentificación', celda: (row: Proveedor) => `${row.identificacion}`},
    { nombreColumna: 'razon_social', cabecera: 'Razón Social', celda: (row: Proveedor) => `${row.razonSocial}`},
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: Proveedor) => `${row.tipoIdentificacion}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Proveedor) => `${row.estado ? 'ACTIVO' : 'INACTIVO'}`}
  ];
  cabeceraProveedor: string[]  = this.columnasProveedor.map(titulo => titulo.nombreColumna);
  dataSourceProveedor: MatTableDataSource<Proveedor>;
  clickedRows = new Set<Proveedor>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private modalService: NgbModal, private proveedorService: ProveedorService, private clienteService: ClienteService, private generoService: GeneroService,
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
        this.crearProveedor(null);
      if (($event.shiftKey || $event.metaKey) && $event.key == "N")
        this.nuevoProveedor(null);
      if (($event.shiftKey || $event.metaKey) && $event.key == "E")
        console.log('SHIFT + E');
      if (($event.shiftKey || $event.metaKey) && $event.key == "B")
        console.log('SHIFT + B');
      if (($event.shiftKey || $event.metaKey) && $event.key == "A")
        console.log('SHIFT + A');
    }
  
  validar_sesion() {
    this.sesion = this.sesionService.getSesion();
    if (this.sesion == undefined)
      this.router.navigate(['/iniciosesion']);
  }

  obtener_sesion() {
    this.sesion = this.sesionService.getSesion();
  }

  obtenerEmpresa() {
    let empresa = new Empresa();
    empresa.id = 1;
    this.empresaService.obtener(empresa.id).subscribe({
      next:(res) => {
        empresa = res.resultado as Empresa
        this.urlLogo = environment.prefijo_url_imagenes + "logos/" + empresa.logo;
        this.nombreEmpresa = empresa.razonSocial;
      },
      error:(err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
  }

  ngOnInit() {
    this.proveedor = new Proveedor();
    this.validar_sesion();
    this.obtener_sesion();
    this.obtenerEmpresa();
    this.construirProveedor();
    this.consultarProveedores();
    this.tipoContribuyenteService.consultar().subscribe({
      next: (res) => {
        this.tiposContribuyentes = res.resultado as TipoContribuyente[]
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
      next: res => {
        this.generos = res.resultado as Genero[]
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.estadoCivilService.consultar().subscribe({
      next: res => {
        this.estadosCiviles = res.resultado as EstadoCivil[]
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.origenIngresoService.consultar().subscribe({
      next: res => {
        this.origenesIngresos = res.resultado as OrigenIngreso[]
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.calificacionClienteService.consultar().subscribe({
      next: res => {
        this.calificacionesClientes = res.resultado as CalificacionCliente[]
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.plazoCreditoService.consultar().subscribe({
      next: res => {
        this.plazosCreditos = res.resultado as PlazoCredito[]
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.tipoPagoService.consultar().subscribe({
      next: res => {
        this.tiposPagos = res.resultado as TipoPago[]
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.formaPagoService.consultar().subscribe({
      next: res => {
        this.formasPagos = res.resultado as FormaPago[]
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.ubicacionService.obtenerProvincias().subscribe({
      next: res => {
        this.provincias = res.resultado as Ubicacion[];
        this.dependienteProvincias = res.resultado as Ubicacion[]
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.tipoRetencionService.obtenerIvaBien().subscribe({
      next: res => {
        this.tiposRetencionesIvaBien = res.resultado as TipoRetencion[]
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.tipoRetencionService.obtenerIvaServicio().subscribe({
      next: res => {
        this.tiposRetencionesIvaServicio = res.resultado as TipoRetencion[]
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.tipoRetencionService.obtenerRentaBien().subscribe({
      next: res => {
        this.tiposRetencionesRentaBien = res.resultado as TipoRetencion[]
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
    this.tipoRetencionService.obtenerRentaServicio().subscribe({
      next: res => {
        this.tiposRetencionesRentaServicio = res.resultado as TipoRetencion[]
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
  }

  construirProveedor() {
    let proveedorId = 0;
    this.proveedorService.currentMessage.subscribe(message => proveedorId = message);
    if (proveedorId != 0) {
      this.clienteService.obtener(proveedorId).subscribe({
        next: res => {
          Object.assign(this.proveedor, res.resultado as Proveedor);
          this.cliente.normalizar();
          this.validarSexoEstadoCivilOrigenIngreso();
          this.ubicacionNormalizarActualizar();
          console.log(this.proveedor);
          this.proveedorService.enviar(0);
        },
        error: err => {
          Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
        }
      })
    }
  }

  nuevoProveedor(event) {
    if (event != null)
      event.preventDefault();
    this.tabService.addNewTab(ProveedorComponent, constantes.tab_proveedor);
  }

  open(content: any, event: any) {
    if (event != null)
      event.preventDefault();
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    }, (reason) => {

    });
  }

  async crearProveedor(event: any) {
    if (event != null)
      event.preventDefault();
    //AGREGAR DEPENDIENTE
    if (this.dependiente.razonSocial != constantes.vacio && this.dependiente.direccion.direccion != constantes.vacio) {
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
      if (ubicacion.provincia != "" && ubicacion.canton != "" && ubicacion.parroquia != "") {
        await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
          res => {
            this.dependiente.direccion.ubicacion = res.resultado as Ubicacion;
          },
          err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
        );
      }
      this.proveedor.dependientes.push(this.dependiente);
    }

    //proveedor
    if (this.proveedor.direccion.ubicacion.provincia != "" && this.proveedor.direccion.ubicacion.canton != "" && this.cliente.direccion.ubicacion.parroquia != "") {
      await this.ubicacionService.obtenerUbicacionID(this.proveedor.direccion.ubicacion).then(
        res => {
          this.proveedor.direccion.ubicacion = res.resultado as Ubicacion;
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
    this.proveedor.puntoVenta = this.sesion.usuario.puntoVenta;
    if (this.telefono.numero != constantes.vacio)
      this.proveedor.telefonos.push(this.telefono);
    if (this.celular.numero != constantes.vacio)
      this.proveedor.celulares.push(this.celular);
    if (this.correo.email != constantes.vacio)
      this.proveedor.correos.push(this.correo);
    console.log(this.proveedor);
    this.proveedorService.crear(this.proveedor).subscribe({
      next: res => {
        this.proveedor = res.resultado as Proveedor;
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        let indice_tab_activo = constantes.tab_activo(this.tabService);
        this.tabService.removeTab(indice_tab_activo);
        this.tabService.addNewTab(ProveedorComponent, constantes.tab_proveedor);
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    });
  }
  
  async crearDependiente() {
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
      await this.ubicacionService.obtenerUbicacionID(ubicacion).then(
        res => {
          this.dependiente.direccion.ubicacion = res.resultado as Ubicacion;
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
      );
    }
    this.proveedor.dependientes.push(this.dependiente);
    this.dependiente = new Dependiente();
    this.habilitarCelularTelefonoCorreoDependiente = false;
    this.dependienteProvincia = "";
    this.dependienteCanton = "";
    this.dependienteParroquia = "";
    this.dependienteTelefono = new TelefonoDependiente();
    this.dependienteCelular = new CelularDependiente();
    this.dependienteCorreo = new CorreoDependiente();
  }

  eliminarDependiente(dependiente: Dependiente) {
    let index = this.proveedor.dependientes.indexOf(dependiente);
    this.proveedor.dependientes.splice(index, 1);
    if (this.proveedor.dependientes.length < 1)
      this.habilitarCelularTelefonoCorreoDependiente = true;
    console.log(this.proveedor.dependientes);  
  }

  editarDependiente(dependiente: Dependiente){
    this.editing = !this.editing;
    this.dependiente = dependiente;
  }

  confirmarEditarDependiente(row: Dependiente){
    this.editing = !this.editing;
  }

  async actualizar(event) {
    if (event != null)
      event.preventDefault();
    //AGREGAR DEPENDIENTES
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
          err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
        );
      }
      this.proveedor.dependientes.push(this.dependiente);
    }
    //proveedor
    console.log(this.proveedor);
    if (this.proveedor.direccion.ubicacion.provincia != "" && this.proveedor.direccion.ubicacion.canton != "" && this.cliente.direccion.ubicacion.parroquia != "") {
      await this.ubicacionService.obtenerUbicacionID(this.proveedor.direccion.ubicacion).then(
        res => {
          this.proveedor.direccion.ubicacion = res.resultado as Ubicacion;
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
      );
    }

    this.proveedorService.actualizar(this.proveedor).subscribe({
      next: res => {
        if (res.resultado != null) {
          Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
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
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    });
  }

  actualizarLeer(event) {
    if (event!=null)
      event.preventDefault();
    this.proveedorService.enviar(this.proveedor.id);
    this.tabService.addNewTab(this.ComponenteProveedor,'Actualizar proveedor');
  }

  eliminar(proveedor: Proveedor) {
    this.proveedorService.eliminar(proveedor).subscribe({
      next: res => {
        if (res.resultado != null) {
          Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
          this.proveedor = res.resultado as Proveedor
          this.ngOnInit();
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    });
  }

  eliminarLeer(event) {
    if (event!=null)
      event.preventDefault();
    this.proveedorService.eliminar(this.proveedor).subscribe({
      next: res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.consultarProveedores();
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    });
  }

  consultarProveedores() {
    this.proveedorService.consultar().subscribe({
      next: (res) => {
        this.proveedores = res.resultado as Proveedor[]
        this.llenarDataSourceProveedor(this.proveedores);
      },
      error: (err) => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    });
  }

  filtroProveedor(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProveedor.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceProveedor.paginator) {
      this.dataSourceProveedor.paginator.firstPage();
    }
  }

  llenarDataSourceProveedor(proveedores : Proveedor[]){
    this.dataSourceProveedor = new MatTableDataSource(proveedores);
    this.dataSourceProveedor.filterPredicate = (data: Proveedor, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.identificacion.toUpperCase().includes(filter) || data.razonSocial.toUpperCase().includes(filter) ||
      data.tipoIdentificacion.toUpperCase().includes(filter);
    this.dataSourceProveedor.paginator = this.paginator;
    this.dataSourceProveedor.sort = this.sort;
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
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
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
    if (this.proveedor.direccion.ubicacion != null) {
      this.proveedorProvincia = this.proveedor.direccion.ubicacion.provincia;
      this.proveedorCanton = this.proveedor.direccion.ubicacion.canton;
      this.proveedorParroquia = this.proveedor.direccion.ubicacion.parroquia;
    }
    this.provincia(this.proveedorProvincia);
    this.canton(this.proveedorCanton);
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
            this.proveedor.grupoCliente.id = 1;
            this.proveedor.financiamiento.formaPago.id = 1;
            this.cambiarFormaPago();
            this.validarSexoEstadoCivilOrigenIngreso();
          },
          error: err => {
            this.proveedor.tipoIdentificacion = '';
            this.proveedor.tipoContribuyente = new TipoContribuyente();
            Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
          }
        });
      },
      error: err => {
        this.proveedor.tipoIdentificacion = '';
        this.proveedor.tipoContribuyente = new TipoContribuyente();
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    });
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
    if (this.dependiente.razonSocial != "") {
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
    if (this.telefono.numero.length != 0 ){
    this.proveedor.telefonos.push(this.telefono);
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
    this.proveedor.telefonos.splice(i, 1);
  }

  crearCelular() {
    if (this.celular.numero.length != 0 ){
      this.proveedor.celulares.push(this.celular);
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
    this.proveedor.celulares.splice(i, 1);
  }

  crearCorreo() {
    if (this.correo.email.length != 0 ){
      this.proveedor.correos.push(this.correo);
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
    this.proveedor.correos.splice(i, 1);
  }

  crearTelefonoDependiente() {
    if (this.dependienteTelefono.numero.length !=0 ){
      if (this.proveedor.dependientes.length > 0 && this.dependiente.razonSocial == "") {
        this.proveedor.dependientes.slice(-1)[0].telefonos.push(this.dependienteTelefono);
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
    if (this.dependienteCelular.numero.length !=0 ){
      if (this.proveedor.dependientes.length > 0 && this.dependiente.razonSocial == "") {
        this.proveedor.dependientes.slice(-1)[0].celulares.push(this.dependienteCelular);
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
    if (this.dependienteCorreo.email.length !=0 ){
      if (this.proveedor.dependientes.length > 0 && this.dependiente.razonSocial == "") {
        this.proveedor.dependientes.slice(-1)[0].correos.push(this.dependienteCorreo);
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
    this.proveedor.direccion.ubicacion.provincia = provincia;
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
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  canton(canton: string) {
    this.proveedor.direccion.ubicacion.canton = canton;
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

  seleccionarAuDependienteCanton(canton: string) {
    this.dependiente.direccion.ubicacion.provincia = canton;
    this.ubicacionService.obtenerParroquias(canton).subscribe(
      res => {
        if (res.resultado != null) {
          this.dependienteParroquias = res.resultado as Ubicacion[];
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  parroquia(parroquia: string) {
    this.proveedor.direccion.ubicacion.parroquia = parroquia;
  }

  seleccionarAuxiliarParroquia(parroquia: string) {
    this.dependiente.direccion.ubicacion.parroquia = parroquia;
  }

  validarSexoEstadoCivilOrigenIngreso() {
    if (this.proveedor.tipoContribuyente.tipo == constantes.tipo_contribuyente_juridica) {
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
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

}