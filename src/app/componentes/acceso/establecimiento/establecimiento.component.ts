import { Component, OnInit, ViewChild, Inject, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';

import { Empresa } from '../../../modelos/acceso/empresa';
import { EmpresaService } from '../../../servicios/acceso/empresa.service';
import { EstablecimientoService } from '../../../servicios/acceso/establecimiento.service';
import { Establecimiento } from '../../../modelos/acceso/establecimiento';
import { Ubicacion } from '../../../modelos/configuracion/ubicacion';
import { UbicacionService } from '../../../servicios/configuracion/ubicacion.service';
import { Regimen } from '../../../modelos/configuracion/regimen';
import { RegimenService } from '../../../servicios/configuracion/regimen.service';
import { Coordenada } from '../../../modelos/configuracion/coordenada';

import { Sesion } from '../../../modelos/acceso/sesion';
import { SesionService } from '../../../servicios/acceso/sesion.service';
import { TelefonoEstablecimiento } from '../../../modelos/acceso/telefono-establecimiento';
import { CelularEstablecimiento } from '../../../modelos/acceso/celular-establecimiento';
import { CorreoEstablecimiento } from '../../../modelos/acceso/correo-establecimiento';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-establecimiento',
  templateUrl: './establecimiento.component.html',
  styleUrls: ['./establecimiento.component.scss']
})

export class EstablecimientoComponent implements OnInit {

  activo: string = valores.estadoActivo;
  inactivo: string = valores.estadoInactivo;

  sesion: Sesion = null;
  abrirPanelAdmin: boolean = true;
  abrirPanelNuevo: boolean = true;
  deshabilitarEmpresa: boolean = true;
  perfilAdministrador: boolean = false;

  empresaSeleccionada: Empresa = new Empresa();
  establecimiento: Establecimiento = new Establecimiento();
  telefono = new TelefonoEstablecimiento();
  celular = new CelularEstablecimiento();
  correo = new CorreoEstablecimiento();

  empresas: Empresa[]=[];
  establecimientos: Establecimiento[] = [];
  regimenes: Regimen[] = [];
  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];

  filtroRazonSociales: Empresa[] = [];
  filtroNombreComerciales: Empresa[] = [];

  //Mapa
  latInicial: number = valores.latCiudad;
  posicionCentral: Coordenada = new Coordenada(valores.latCiudad, valores.lngCiudad);
  posicionGeografica: Coordenada = new Coordenada(valores.latCiudad, valores.lngCiudad);
  //coordenadas: Coordenada[] = [];
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 12,
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Establecimiento) => `${row.codigo}`},
    { nombreColumna: 'empresa', cabecera: 'Empresa', celda: (row: Establecimiento) => `${row.empresa.nombreComercial}`},
    { nombreColumna: 'establecimiento', cabecera: 'Establecimiento', celda: (row: Establecimiento) => `${row.descripcion}`},
    { nombreColumna: 'direccion', cabecera: 'Dirección', celda: (row: Establecimiento) => `${row.direccion}`},
    { nombreColumna: 'codigoSRI', cabecera: 'Código SRI', celda: (row: Establecimiento) => `${row.codigoSRI}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Establecimiento) => `${row.estado}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Establecimiento>;
  clickedRows = new Set<Establecimiento>();
  
  constructor(private renderer: Renderer2, public dialog: MatDialog, private establecimientoService: EstablecimientoService, private empresaService: EmpresaService, 
    private sesionService: SesionService, private router: Router, private ubicacionService: UbicacionService, private regimenService: RegimenService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.establecimiento.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.validarPerfil();
    this.consultar();
    this.consultarEmpresas();
    this.consultarRegimenes();
    this.consultarProvincias();
  }

  consultarEmpresas() {
    this.empresaService.consultar().subscribe({
      next: (res) => {
        this.empresas = res.resultado as Empresa[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }
  consultarRegimenes(){
    this.regimenService.consultarPorEstado(valores.estadoActivo).subscribe({
      next: res => {
        this.regimenes = res.resultado as Regimen[];
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
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  nuevo(event: any) {
    if (event!=null)
      event.preventDefault();
    this.establecimiento = new Establecimiento();
    this.telefono = new TelefonoEstablecimiento();
    this.celular = new CelularEstablecimiento();
    this.correo = new CorreoEstablecimiento();
    this.inicializarMapa();
    this.clickedRows.clear();
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;    
    this.agregarTelefonoCorreo();
    this.establecimientoService.crear(this.establecimiento).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  agregarTelefonoCorreo(){
    if(this.telefono.numero != valores.vacio){
      this.establecimiento.telefonosEstablecimiento.push(this.telefono);
    }
    if(this.celular.numero != valores.vacio){
      this.establecimiento.celularesEstablecimiento.push(this.celular);
    }
    if(this.correo.email != valores.vacio){
      this.establecimiento.correosEstablecimiento.push(this.correo);
    }
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;    
    this.agregarTelefonoCorreo();
    this.establecimientoService.actualizar(this.establecimiento).subscribe({
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
    this.establecimientoService.activar(this.establecimiento).subscribe({
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
    this.establecimientoService.inactivar(this.establecimiento).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar(){
    this.establecimientoService.consultarPorEmpresa(this.establecimiento.empresa.id).subscribe({
      next: res => {
        this.establecimientos = res.resultado as Establecimiento[];
        this.llenarTabla(this.establecimientos);
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  llenarTabla(establecimientos: Establecimiento[]){
    this.dataSource = new MatTableDataSource(establecimientos);
    this.dataSource.filterPredicate = (data: Establecimiento, filter: string): boolean =>
      data.codigo.includes(filter) || data.empresa.nombreComercial.includes(filter) || data.descripcion.includes(filter) || 
      data.direccion.includes(filter) || data.codigoSRI.includes(filter) || data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(establecimiento: Establecimiento) {
    if (!this.clickedRows.has(establecimiento)){
      this.clickedRows.clear();
      this.inicializarMapa();
      this.clickedRows.add(establecimiento);
      this.establecimiento = { ... establecimiento};
      this.empresaSeleccionada = this.establecimiento.empresa;
      this.recuperarCoordenadas();
      this.seleccionarProvincia();
      this.seleccionarCanton();
    } else {
      this.nuevo(null);
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  borrarFiltro() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', valores.vacio);
    this.dataSource.filter = valores.vacio;
  }

  seleccionarRazonSocial(event) {
    let empresaId = event.option.value.id;
    this.empresaService.obtener(empresaId).subscribe({
      next: res => {
        this.empresaSeleccionada = res.resultado as Empresa;
        this.establecimiento.empresa = this.empresaSeleccionada;
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  verRazonSocial(empresa: Empresa): string {
    return empresa && empresa.razonSocial ? empresa.razonSocial : valores.vacio;
  }
  filtrarRazonSociales(event: any){
    this.filtroRazonSociales = this.empresas.filter(empresa => empresa.razonSocial.toUpperCase().includes(event));
  }
  borrarRazonSocial(){
    this.empresaSeleccionada = new Empresa();
    this.filtroRazonSociales = [];
    this.filtroNombreComerciales = [];
  }

  seleccionarNombreComercial(event) {
    let empresaId = event.option.value.id;
    this.empresaService.obtener(empresaId).subscribe({
      next: res => {
        this.empresaSeleccionada = res.resultado as Empresa;
        this.establecimiento.empresa = this.empresaSeleccionada;
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  verNombreComercial(empresa: Empresa): string {
    return empresa && empresa.nombreComercial ? empresa.nombreComercial : valores.vacio;
  }
  filtrarNombresComerciales(event: any){
    this.filtroNombreComerciales = this.empresas.filter(empresa => empresa.nombreComercial.toUpperCase().includes(event));
  }

  seleccionarProvincia() {
    this.ubicacionService.consultarCantones(this.establecimiento.ubicacion.provincia).subscribe({
      next: res => {
        if (res.resultado != null) {
          this.cantones = res.resultado as Ubicacion[];
        } else {
          Swal.fire(error, res.mensaje, error_swal);
        }
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarCanton() {
    this.ubicacionService.consultarParroquias(this.establecimiento.ubicacion.canton).subscribe({
      next: res => {
        if (res.resultado != null) {
          this.parroquias = res.resultado as Ubicacion[];
        } else {
          Swal.fire({ icon: error_swal, title: error, text: res.mensaje })
        }
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  agregarTelefono() {
    let digito = this.telefono.numero.substring(0, 1);
    if (this.telefono.numero.length != 11 || digito != "0") {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_invalido });
    } else {
      this.establecimiento.telefonosEstablecimiento.push({ ... this.telefono});
      this.telefono = new TelefonoEstablecimiento();
    }
  }
  validarTelefono() {
    let digito = this.telefono.numero.substring(0, 1);
    if (this.telefono.numero.length != 11 || digito != "0") {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_invalido });
    }
  }
  eliminarTelefono(i: number) {
    this.establecimiento.telefonosEstablecimiento.splice(i, 1);
  }

  agregarCelular() {
    let digito = this.celular.numero.substring(0, 2);
    if (this.celular.numero.length != 12 || digito != "09") {
      this.celular.numero = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_invalido });
    } else{
      this.establecimiento.celularesEstablecimiento.push({ ... this.celular});
      this.celular = new CelularEstablecimiento();
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
    this.establecimiento.celularesEstablecimiento.splice(i, 1);
  }

  agregarCorreo() {
    let arroba = this.correo.email.includes("@");
    if (!arroba) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_correo_invalido });
    } else{
      this.establecimiento.correosEstablecimiento.push({ ... this.correo});
      this.correo = new CorreoEstablecimiento();
    }
  }
  validarCorreo() {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    let validacion = expression.test(this.correo.email);
    if (!validacion) {
      this.correo.email = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_correo_invalido });
    }
  }
  eliminarCorreo(i: number) {
    this.establecimiento.correosEstablecimiento.splice(i, 1);
  }

  //MAPA
  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  asignarCoordenadas(){
    this.establecimiento.latitudgeo = this.posicionGeografica.lat;
    this.establecimiento.longitudgeo = this.posicionGeografica.lng;
  }

  recuperarCoordenadas(){
    this.posicionGeografica.lat = this.establecimiento.latitudgeo;
    this.posicionGeografica.lng = this.establecimiento.longitudgeo;
    this.posicionCentral = this.posicionGeografica;
  }

  inicializarMapa(){
    this.posicionCentral = new Coordenada(valores.latCiudad, valores.lngCiudad);
    this.posicionGeografica = new Coordenada(valores.latCiudad, valores.lngCiudad);
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  rellenarNumeroEstablecimiento() {
    this.establecimiento.codigoSRI = this.pad(this.establecimiento.codigoSRI, 3);
  }

  pad(numero: string, size: number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }

  // VALIDACIONES
  validarPerfil() {
    if (this.sesion.usuario.perfil.abreviatura == 'ADM'){
      this.perfilAdministrador = true;
    }
  }

  validarFormulario(): boolean {
    if (this.establecimiento.empresa.id == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.establecimiento.regimen.id == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.establecimiento.codigoSRI == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.establecimiento.direccion == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.establecimiento.ubicacion.parroquia == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_imagen });
      return false;
    }
    return true;
  }
  
  dialogoMapas(): void {
    const dialogRef = this.dialog.open(DialogoMapaEstablecimientoComponent, {
      width: '80%',
      data: this.posicionGeografica as Coordenada
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.posicionGeografica = result as Coordenada;
        this.posicionCentral = this.posicionGeografica;
        this.asignarCoordenadas();
      }
    });
  }

}

@Component({
  selector: 'dialogo-mapa-establecimiento',
  templateUrl: 'dialogo-mapa-establecimiento.component.html',
})

export class DialogoMapaEstablecimientoComponent {

  mapa: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogoMapaEstablecimientoComponent>,
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
