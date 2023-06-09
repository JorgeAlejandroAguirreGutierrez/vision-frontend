import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';

import { Empresa } from '../../../modelos/usuario/empresa';
import { EmpresaService } from '../../../servicios/usuario/empresa.service';
import { EstablecimientoService } from '../../../servicios/usuario/establecimiento.service';
import { Establecimiento } from '../../../modelos/usuario/establecimiento';
import { Ubicacion } from '../../../modelos/configuracion/ubicacion';
import { UbicacionService } from '../../../servicios/configuracion/ubicacion.service';
import { Regimen } from '../../../modelos/configuracion/regimen';
import { RegimenService } from '../../../servicios/configuracion/regimen.service';
import { Coordenada } from '../../../modelos/configuracion/coordenada';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { TelefonoEstablecimiento } from '../../../modelos/usuario/telefono-establecimiento';
import { CelularEstablecimiento } from '../../../modelos/usuario/celular-establecimiento';
import { CorreoEstablecimiento } from '../../../modelos/usuario/correo-establecimiento';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-establecimiento',
  templateUrl: './establecimiento.component.html',
  styleUrls: ['./establecimiento.component.scss']
})

export class EstablecimientoComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  sesion: Sesion=null;
  abrirPanelAdmin: boolean = true;
  abrirPanelNuevo: boolean = true;

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

  //Mapa
  latitud: number = valores.latCiudad;
  longitud: number = valores.lngCiudad;
  posicionCentral: Coordenada = new Coordenada(this.latitud, this.longitud);
  posicionGeografica: Coordenada;
  coordenadas: Coordenada[] = [];
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

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Establecimiento) => `${row.codigo}`},
    { nombreColumna: 'codigoSRI', cabecera: 'Código SRI', celda: (row: Establecimiento) => `${row.codigoSRI}`},
    { nombreColumna: 'establecimiento', cabecera: 'Establecimiento', celda: (row: Establecimiento) => `${row.descripcion}`},
    { nombreColumna: 'direccion', cabecera: 'Dirección', celda: (row: Establecimiento) => `${row.direccion}`},
    { nombreColumna: 'empresa', cabecera: 'Empresa', celda: (row: Establecimiento) => `${row.empresa.nombreComercial}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Establecimiento) => `${row.estado}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Establecimiento>;
  clickedRows = new Set<Establecimiento>();
  
  constructor(public dialog: MatDialog, private establecimientoService: EstablecimientoService, private empresaService: EmpresaService, 
    private sesionService: SesionService, private router: Router, private ubicacionService: UbicacionService, private regimenService: RegimenService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultarEmpresas();
    this.consultar();
    this.consultarRegimenes();
    this.consultarProvincias();
  }

  consultarRegimenes(){
    this.regimenService.consultarPorEstado(valores.activo).subscribe({
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

  consultarEmpresas() {
    this.empresaService.consultarPorEstado(valores.activo).subscribe({
      next: (res) => {
        this.empresas = res.resultado as Empresa[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  consultar(){
    this.establecimientoService.consultar().subscribe({
      next: res => {
        this.establecimientos = res.resultado as Establecimiento[];
        this.dataSource = new MatTableDataSource(this.establecimientos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
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
    this.clickedRows.clear();
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    if(this.telefono.numero != valores.vacio){
      this.establecimiento.telefonosEstablecimiento.push(this.telefono);
    }
    if(this.celular.numero != valores.vacio){
      this.establecimiento.celularesEstablecimiento.push(this.celular);
    }
    if(this.correo.email != valores.vacio){
      this.establecimiento.correosEstablecimiento.push(this.correo);
    }
    this.establecimientoService.crear(this.establecimiento).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    if(this.telefono.numero != valores.vacio){
      this.establecimiento.telefonosEstablecimiento.push(this.telefono);
    }
    if(this.celular.numero != valores.vacio){
      this.establecimiento.celularesEstablecimiento.push(this.celular);
    }
    if(this.correo.email != valores.vacio){
      this.establecimiento.correosEstablecimiento.push(this.correo);
    }
    this.establecimientoService.actualizar(this.establecimiento).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
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

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
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
    let arroba = this.correo.email.includes("@");
    if (!arroba) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_correo_invalido });
    }
  }

  eliminarCorreo(i: number) {
    this.establecimiento.correosEstablecimiento.splice(i, 1);
  }

  seleccion(establecimiento: Establecimiento) {
    if (!this.clickedRows.has(establecimiento)){
      this.clickedRows.clear();
      this.clickedRows.add(establecimiento);
      this.establecimiento = { ... establecimiento};
    } else {
      this.clickedRows.clear();
      this.establecimiento = new Establecimiento();
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
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
        this.establecimiento.latitud = this.posicionGeografica.lat;
        this.establecimiento.longitud = this.posicionGeografica.lng;
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
    this.data = new Coordenada(0,0);
  }

  coordenadaSeleccionada(event: any) {
    if (event && event.latitud != 0) {
      this.data = event as Coordenada;
    } else {
      this.data = new Coordenada(0,0);
    }
  }
}
