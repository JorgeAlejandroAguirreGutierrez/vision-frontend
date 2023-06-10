import { Component, OnInit, HostListener, ViewChild, Inject, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import Swal from 'sweetalert2';
import { valores, validarSesion, otras, mensajes, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { TipoContribuyente } from '../../../modelos/cliente/tipo-contribuyente';
import { TipoContribuyenteService } from '../../../servicios/cliente/tipo-contribuyente.service';
import { Segmento } from '../../../modelos/cliente/segmento';
import { GrupoProveedor } from '../../../modelos/compra/grupo-proveedor'
import { GrupoProveedorService } from '../../../servicios/compra/grupo-proveedor.service';
import { Ubicacion } from '../../../modelos/configuracion/ubicacion';
import { UbicacionService } from '../../../servicios/configuracion/ubicacion.service';
import { Coordenada } from '../../../modelos/configuracion/coordenada';
import { PlazoCredito } from '../../../modelos/cliente/plazo-credito';
import { PlazoCreditoService } from '../../../servicios/cliente/plazo-credito.service';
import { FormaPago } from '../../../modelos/cliente/forma-pago';
import { FormaPagoService } from '../../../servicios/cliente/forma-pago.service';
import { TipoRetencion } from '../../../modelos/configuracion/tipo-retencion';
import { TipoRetencionService } from '../../../servicios/configuracion/tipo-retencion.service';
import { Proveedor } from '../../../modelos/compra/proveedor';
import { ProveedorService } from '../../../servicios/compra/proveedor.service';
import { TipoIdentificacion } from '../../../modelos/configuracion/tipo-identificacion';
import { TipoIdentificacionService } from '../../../servicios/configuracion/tipo-identificacion.service';
import { TelefonoProveedor } from 'src/app/modelos/compra/telefono-proveedor';
import { CelularProveedor } from 'src/app/modelos/compra/celular-proveedor';
import { CorreoProveedor } from 'src/app/modelos/compra/correo-proveedor';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/modelos/usuario/empresa';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss']
})
export class ProveedorComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;
  si: string = valores.si;
  no: string = valores.no;
  provincia: string = valores.vacio;
  canton: string = valores.vacio;
  parroquia: string = valores.vacio;

  abrirPanelNuevo: boolean = true;
  abrirPanelUbicacion: boolean = true;
  abrirPanelDatoAdicional: boolean = false;
  verPanelDatoAdicional: boolean = false;
  abrirPanelAdmin: boolean = true;
  deshabilitarObligado: boolean = false;
  deshabilitarPlazoCredito: boolean = true;

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  proveedor: Proveedor = new Proveedor();
  proveedorBuscar = new Proveedor();
  segmento: Segmento = new Segmento();
  telefono: TelefonoProveedor = new TelefonoProveedor();
  celular: CelularProveedor = new CelularProveedor();
  correo: CorreoProveedor = new CorreoProveedor();

  proveedores: Proveedor[];
  tiposIdentificaciones: TipoIdentificacion[];
  gruposProveedores: GrupoProveedor[];
  plazosCreditos: PlazoCredito[];
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

  //Mapa
  latInicial: number = valores.latCiudad;
  posicionCentral: Coordenada = new Coordenada(valores.latCiudad, valores.lngCiudad);
  posicionGeografica: Coordenada = new Coordenada(valores.latCiudad, valores.lngCiudad);
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
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Proveedor) => `${row.codigo}` },
    { nombreColumna: 'identificacion', cabecera: 'Indentificación', celda: (row: Proveedor) => `${row.identificacion}` },
    { nombreColumna: 'razon_social', cabecera: 'Razón Social', celda: (row: Proveedor) => `${row.razonSocial}` },
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: Proveedor) => `${row.direccion}` },
    { nombreColumna: 'obligado', cabecera: 'Obligado', celda: (row: Proveedor) => `${row.obligadoContabilidad}` },
    { nombreColumna: 'especial', cabecera: 'Especial', celda: (row: Proveedor) => `${row.especial}` },
    { nombreColumna: 'fantasma', cabecera: 'Fantasma', celda: (row: Proveedor) => `${row.fantasma}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Proveedor) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Proveedor>;
  clickedRows = new Set<Proveedor>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, public dialog: MatDialog, private proveedorService: ProveedorService,
    private sesionService: SesionService, private plazoCreditoService: PlazoCreditoService,
    private formaPagoService: FormaPagoService, private ubicacionService: UbicacionService, private grupoProveedorService: GrupoProveedorService,
    private tipoRetencionService: TipoRetencionService, private router: Router, private tipoIdentificacionService: TipoIdentificacionService, 
    private tipoContribuyenteService: TipoContribuyenteService) { }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G")
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N")
      this.nuevo(null);
  }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.consultar();
    this.consultarTipoIdentificacion();
    this.consultarTipoContribuyente();
    this.consultarGrupoProveedor();
    this.consultarFormaPago();
    this.consultarPlazoCredito();
    this.consultarProvincias();
    this.consultarIvaBien();
    this.consultarIvaServicio();
    this.consultarRentaBien();
    this.consultarRentaServicio();
  }

  consultarTipoIdentificacion() {
    this.tipoIdentificacionService.consultar().subscribe({
      next: (res) => {
        this.tiposIdentificaciones = res.resultado as TipoIdentificacion[];
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarTipoContribuyente() {
    this.tipoContribuyenteService.consultar().subscribe({
      next: (res) => {
        this.tiposContribuyentes = res.resultado as TipoContribuyente[];
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarGrupoProveedor() {
    this.grupoProveedorService.consultarPorEmpresaYEstado(this.empresa.id, valores.activo).subscribe({
      next: (res) => {
        this.gruposProveedores = res.resultado as GrupoProveedor[]
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarFormaPago() {
    this.formaPagoService.consultarPorEstado(valores.activo).subscribe({
      next: res => {
        this.formasPagos = res.resultado as FormaPago[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarPlazoCredito() {
    this.plazoCreditoService.consultarPorEmpresaYEstado(this.empresa.id, valores.activo).subscribe({
      next: res => {
        this.plazosCreditos = res.resultado as PlazoCredito[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  consultarProvincias() {
    this.ubicacionService.consultarProvincias().subscribe({
      next: res => {
        this.provincias = res.resultado as Ubicacion[];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarIvaBien() {
    this.tipoRetencionService.consultarIvaBien().subscribe({
      next: res => {
        this.tiposRetencionesIvaBien = res.resultado as TipoRetencion[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarIvaServicio() {
    this.tipoRetencionService.consultarIvaServicio().subscribe({
      next: res => {
        this.tiposRetencionesIvaServicio = res.resultado as TipoRetencion[]

      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarRentaBien() {
    this.tipoRetencionService.consultarRentaBien().subscribe({
      next: res => {
        this.tiposRetencionesRentaBien = res.resultado as TipoRetencion[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  consultarRentaServicio() {
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
  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.proveedor = new Proveedor();
    this.provincia = valores.vacio;
    this.canton = valores.vacio;
    this.parroquia = valores.vacio;
    this.telefono = new TelefonoProveedor();
    this.celular = new CelularProveedor();
    this.correo = new CorreoProveedor();
    this.posicionCentral = new Coordenada(valores.latCiudad, valores.lngCiudad);
    this.posicionGeografica = new Coordenada(valores.latCiudad, valores.lngCiudad);
    this.clickedRows.clear();
    this.borrarFiltroProveedor();
    this.deshabilitarObligado = false;
    this.abrirPanelUbicacion = true;
  }

  crear(event: any) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.agregarTelefonoCorreo();
    this.proveedor.empresa = this.empresa;
    this.proveedorService.crear(this.proveedor).subscribe({
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
      this.proveedor.telefonosProveedor.push({ ... this.telefono });
    if (this.celular.numero != valores.vacio)
      this.proveedor.celularesProveedor.push({ ... this.celular });
    if (this.correo.email != valores.vacio)
      this.proveedor.correosProveedor.push(this.correo);
  }

  actualizar(event: any) {
    if (event != null)
      event.preventDefault();
    this.agregarTelefonoCorreo();
    this.proveedorService.actualizar(this.proveedor).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.proveedorService.activar(this.proveedor).subscribe({
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
    this.proveedorService.inactivar(this.proveedor).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.proveedorService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.proveedores = res.resultado as Proveedor[];
        this.llenarTabla(this.proveedores);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(proveedores: Proveedor[]) {
    this.dataSource = new MatTableDataSource(proveedores);
    this.dataSource.filterPredicate = (data: Proveedor, filter: string): boolean =>
      data.codigo.includes(filter) || data.identificacion.includes(filter) || data.razonSocial.includes(filter) ||
      data.direccion.includes(filter) || data.obligadoContabilidad.includes(filter) || 
      data.especial.includes(filter) || data.fantasma.includes(filter) ||data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(proveedor: any) {
    if (!this.clickedRows.has(proveedor)) {
      this.clickedRows.clear();
      this.clickedRows.add(proveedor);
      this.proveedorService.obtener(proveedor.id).subscribe({
        next: res => {
          this.proveedor = res.resultado as Proveedor;
          this.llenarUbicacion();
          this.recuperarCoordenadas();
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
    } else {
      this.nuevo(null);
    }
  }

  obtenerProveedor(id: number) {
    this.proveedorService.obtener(id).subscribe({
      next: res => {
        this.proveedor = res.resultado as Proveedor;
        this.llenarUbicacion();
        this.recuperarCoordenadas();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarUbicacion() {
    // Llenar ubicación dependiente
    this.provincia = this.proveedor.ubicacion.provincia;
    this.ubicacionService.consultarCantones(this.provincia).subscribe({
      next: res => {
        this.cantones = res.resultado as Ubicacion[];
        this.canton = this.proveedor.ubicacion.canton;
        this.ubicacionService.consultarParroquias(this.canton).subscribe({
          next: res => {
            this.parroquias = res.resultado as Ubicacion[];
            this.parroquia = this.proveedor.ubicacion.parroquia;
          },
          error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        });
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  filtroProveedor(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  borrarFiltroProveedor() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSource.filter = '';
  }

  //VALIDACIONES DE CAMPOS
  validarIdentificacion() {
    this.proveedorService.validarIdentificacion(this.proveedor.identificacion).subscribe({
      next: (res) => {
        this.proveedor.tipoIdentificacion = res.resultado.tipoIdentificacion as TipoIdentificacion;
        this.proveedor.tipoContribuyente = res.resultado.tipoContribuyente as TipoContribuyente;
        this.validarDocumento();
        this.inicializarOpciones();
      },
      error: (err) => {
        this.proveedor.tipoIdentificacion = null;
        this.proveedor.tipoContribuyente = new TipoContribuyente();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  buscar(event) {
    if (event != null)
      event.preventDefault();
    this.proveedorService.buscar(this.proveedorBuscar).subscribe({
      next: res => {
        this.proveedores = res.resultado as Proveedor[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  validarDocumento() {
    if (this.proveedor.tipoIdentificacion.descripcion == otras.tipoIdentificacionCedula) {
      this.deshabilitarObligado = true;
    } else {
      this.deshabilitarObligado = false;
    }
  }

  inicializarOpciones() {
    this.proveedor.grupoProveedor = this.gruposProveedores[0];
    this.proveedor.formaPago = this.formasPagos[0];
  }

  cambiarFormaPago() {
    if (this.proveedor.formaPago.id == 6) {
      this.deshabilitarPlazoCredito = false;
    } else {
      this.deshabilitarPlazoCredito = true;
      //this.cliente.formaPago.id = 0;
    }
  }

  validarFormulario(): boolean {
    if (this.proveedor.identificacion == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.proveedor.razonSocial == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.proveedor.direccion == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.proveedor.referencia == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.provincia == valores.vacio || this.canton == valores.vacio || this.parroquia == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.correo.email == valores.vacio && this.proveedor.correosProveedor.length == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_correo });
      return false;
    }
    return true;
  }

  // Para crear, validar y eliminar telefono, celular y correo
  crearTelefono() {
    if (this.telefono.numero.length != valores.cero) {
      this.proveedor.telefonosProveedor.push({ ... this.telefono });
      this.telefono = new TelefonoProveedor();
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
    this.proveedor.telefonosProveedor.splice(i, 1);
  }

  crearCelular() {
    if (this.celular.numero.length != valores.cero) {
      this.proveedor.celularesProveedor.push({ ... this.celular });
      this.celular = new CelularProveedor();
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
    this.proveedor.celularesProveedor.splice(i, 1);
  }

  crearCorreo() {
    if (this.correo.email.length != valores.cero) {
      this.proveedor.correosProveedor.push({ ... this.correo });
      this.correo = new CorreoProveedor();
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
    this.proveedor.correosProveedor.splice(i, 1);
  }

  // Para el selectChange de Provincia, Cantón y Parroquia
  seleccionarProvincia() {
    this.proveedor.ubicacion.provincia = this.provincia;
    this.ubicacionService.consultarCantones(this.provincia).subscribe({
      next: res => {
        this.canton = valores.vacio;
        this.cantones = res.resultado as Ubicacion[];
        this.parroquia = valores.vacio;
        this.parroquias = [];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarCanton() {
    this.proveedor.ubicacion.canton = this.canton;
    this.ubicacionService.consultarParroquias(this.canton).subscribe({
      next: res => {
        this.parroquia = valores.vacio;
        this.parroquias = res.resultado as Ubicacion[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarParroquia() {
    this.proveedor.ubicacion.parroquia = this.parroquia;
  }

  // MAPA
  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      this.posicionCentral = new Coordenada(position.coords.latitude, position.coords.longitude);
    })
  }

  asignarCoordenadas() {
    //this.cliente.coordenadas.push(this.posicionGeograficaDireccion);
    this.proveedor.latitudgeo = this.posicionGeografica.lat;
    this.proveedor.longitudgeo = this.posicionGeografica.lng;
  }

  recuperarCoordenadas() {
    this.posicionGeografica.lat = this.proveedor.latitudgeo;
    this.posicionGeografica.lng = this.proveedor.longitudgeo;
    this.posicionCentral = this.posicionGeografica;
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
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
    this.data = new Coordenada(valores.cero, valores.cero);
  }

  coordenadaSeleccionada(event: any) {
    if (event && event.latitud != 0) {
      this.data = event as Coordenada;
    } else {
      this.data = new Coordenada(valores.cero, valores.cero);
    }
  }
}