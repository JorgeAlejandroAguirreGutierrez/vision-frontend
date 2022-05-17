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
  ComponenteCliente: Type<any> = ClienteComponent;

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

  proveedor: Proveedor = new Proveedor;
  proveedores: Proveedor[];
  cliente: Cliente;
  clienteCrear: Cliente;
  clienteBuscar = new Cliente();
  clienteActualizar: Cliente;
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

  constructor(private clienteService: ClienteService, private generoService: GeneroService,
    private estadoCivilService: EstadoCivilService, private origenIngresoService: OrigenIngresoService,
    private calificacionClienteService: CalificacionClienteService, private plazoCreditoService: PlazoCreditoService,
    private tipoPagoService: TipoPagoService, private formaPagoService: FormaPagoService,
    private ubicacionService: UbicacionService, private grupoClienteService: GrupoClienteService,
    private tipoRetencionService: TipoRetencionService, private router: Router, private tabService: TabService,
    private sesionService: SesionService, private empresaService: EmpresaService, private segmentoService: SegmentoService,
    private tipoContribuyenteService: TipoContribuyenteService, private modalService: NgbModal, private proveedorService: ProveedorService) { }

  validar_sesion() {
    this.sesion = this.sesionService.getSesion();
    if (this.sesion == undefined)
      this.router.navigate(['/iniciosesion']);
  }

  ngOnInit() {
    this.cliente = new Cliente();
    this.validar_sesion();
    this.construirCliente();
    this.obtenerEmpresa();
    this.obtener_sesion();
    this.consultar();
    this.tipoContribuyenteService.consultar().subscribe(
      res => {
        this.tiposContribuyentes = res.resultado as TipoContribuyente[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.segmentoService.consultar().subscribe(
      res => {
        this.segmentos = res.resultado as Segmento[];
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.grupoClienteService.consultar().subscribe(
      res => {
        this.gruposClientes = res.resultado as GrupoCliente[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.generoService.consultar().subscribe(
      res => {
        this.generos = res.resultado as Genero[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.estadoCivilService.consultar().subscribe(
      res => {
        this.estadosCiviles = res.resultado as EstadoCivil[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    this.origenIngresoService.consultar().subscribe(
      res => {
        this.origenesIngresos = res.resultado as OrigenIngreso[]
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
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
        this.dependienteProvincias = res.resultado as Ubicacion[]
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

  obtener_sesion() {
    this.sesion = this.sesionService.getSesion();
  }

  construirCliente() {
    let clienteId = 0;
    this.clienteService.currentMessage.subscribe(message => clienteId = message);
    if (clienteId != 0) {
      this.clienteService.obtener(clienteId).subscribe(
        res => {
          Object.assign(this.cliente, res.resultado as Cliente);
          this.cliente.normalizar();
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
    this.empresaService.obtener(empresa.id).subscribe(
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

  nuevoCliente(event) {
    if (event != null)
      event.preventDefault();
    this.tabService.addNewTab(ClienteComponent, constantes.tab_cliente);
  }

  open(content: any, event) {
    if (event != null)
      event.preventDefault();
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    }, (reason) => {

    });
  }

  async crearCliente(event) {
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
      this.cliente.dependientes.push(this.dependiente);
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
        let indice_tab_activo = constantes.tab_activo(this.tabService);
        this.tabService.removeTab(indice_tab_activo);
        this.tabService.addNewTab(ClienteComponent, constantes.tab_cliente);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
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
    this.cliente.dependientes.push(this.dependiente);
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
    let index = this.cliente.dependientes.indexOf(dependiente);
    this.cliente.dependientes.splice(index, 1);
    if (this.cliente.dependientes.length < 1)
      this.habilitarCelularTelefonoCorreoDependiente = true;
    console.log(this.cliente.dependientes);  
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
      this.cliente.dependientes.push(this.dependiente);
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
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  actualizarLeer(event) {
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

  eliminarLeer(event) {
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
    this.proveedorService.consultar().subscribe(
      res => {
        this.proveedores = res.resultado as Proveedor[]
        this.llenarDataSourceProveedor(this.proveedores);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
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
    if (this.cliente.direccion.ubicacion != null) {
      this.clienteProvincia = this.cliente.direccion.ubicacion.provincia;
      this.clienteCanton = this.cliente.direccion.ubicacion.canton;
      this.clienteParroquia = this.cliente.direccion.ubicacion.parroquia;
    }
    this.provincia(this.clienteProvincia);
    this.canton(this.clienteCanton);
  }

  validarIdentificacion() {
    this.clienteService.obtenerIdentificacion(this.cliente.identificacion).subscribe(
      res => {
        this.clienteService.validarIdentificacion(this.cliente.identificacion).subscribe(
          res => {
            this.cliente.tipoIdentificacion = res.resultado.tipo_identificacion;
            this.cliente.tipoContribuyente = res.resultado.tipo_contribuyente as TipoContribuyente
            if (this.cliente.tipoContribuyente == null) {
              this.habilitarTipoContribuyente = true;
            } else {
              this.cliente.tipoContribuyente = this.obtenerTipoContribuyente();
            }
            this.cliente.segmento.id = 1;
            this.cliente.grupoCliente.id = 1;
            this.cliente.financiamiento.formaPago.id = 1;
            this.cambiarFormaPago();
            this.validarSexoEstadoCivilOrigenIngreso();
          },
          err => {
            this.cliente.tipoIdentificacion = '';
            this.cliente.tipoContribuyente = new TipoContribuyente();
            Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
          }
        );
      },
      err => {
        this.cliente.tipoIdentificacion = '';
        this.cliente.tipoContribuyente = new TipoContribuyente();
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
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
    // forma de pago id=1; es PREPAGO
    if (this.cliente.financiamiento.formaPago.id == 1) {
      this.activacionPlazoCredito = true;
      this.cliente.financiamiento.plazoCredito = null;
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

  crearTelefonoDependiente() {
    if (this.dependienteTelefono.numero.length !=0 ){
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
    if (this.dependienteCelular.numero.length !=0 ){
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
    if (this.dependienteCorreo.email.length !=0 ){
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
    this.cliente.direccion.ubicacion.parroquia = parroquia;
  }

  seleccionarAuxiliarParroquia(parroquia: string) {
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
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

}