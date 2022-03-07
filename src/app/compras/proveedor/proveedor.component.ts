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

  //ComponenteLeerCliente: Type<any> = ClienteLeerComponent;
  habilitarTipoContribuyente = false;
  indiceTipoContribuyente: number = -1;
  habilitarCelularTelefonoCorreoAuxiliar = true;

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

  nuevoCliente(event) {
    if (event != null)
      event.preventDefault();
    this.tabService.addNewTab(ClienteComponent, constantes.tab_crear_cliente);
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
        let indice_tab_activo = constantes.tab_activo(this.tabService);
        this.tabService.removeTab(indice_tab_activo);
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
    this.auxiliar = new Auxiliar();
    this.habilitarCelularTelefonoCorreoAuxiliar = false;
    this.auxiliarProvincia = "";
    this.auxiliarCanton = "";
    this.auxiliarParroquia = "";
    this.auxiliarTelefono = new TelefonoAuxiliar();
    this.auxiliarCelular = new CelularAuxiliar();
    this.auxiliarCorreo = new CorreoAuxiliar();
  }

  eliminarAuxiliar(auxiliar_seleccionado: Auxiliar) {
    let index = this.cliente.auxiliares.indexOf(auxiliar_seleccionado);
    this.cliente.auxiliares.splice(index, 1);
    if (this.cliente.auxiliares.length < 1)
      this.habilitarCelularTelefonoCorreoAuxiliar = true;
    console.log(this.cliente.auxiliares);  
  }

  editarAuxiliar(auxiliar_seleccionado: Auxiliar){
    this.editing = !this.editing;
    this.auxiliar = auxiliar_seleccionado;
  }

  confirmarEditarAuxiliar(row: Auxiliar){
    this.editing = !this.editing;
  }

  async actualizar(event) {
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

  cambiarRazonSocialAuxiliar() {
    if (this.auxiliar.razonSocial != "") {
      this.habilitarCelularTelefonoCorreoAuxiliar = false;
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

  seleccionar_auxiliar_parroquia(parroquia: string) {
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
    this.clienteService.importar(archivoImportar).subscribe(
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

}