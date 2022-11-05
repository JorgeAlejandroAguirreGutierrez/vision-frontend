import { Component, OnInit, HostListener, ElementRef, Renderer2, Inject } from '@angular/core';
import {EmailValidator, FormControl, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { BehaviorSubject } from 'rxjs';
import { valores, validarSesion, mensajes, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Empresa } from '../../modelos/usuario/empresa';
import { EmpresaService } from '../../servicios/configuracion/empresa.service';
import { Ubicacion } from '../../modelos/configuracion/ubicacion';
import { UbicacionService } from '../../servicios/configuracion/ubicacion.service';
import { Telefono } from '../../modelos/cliente/telefono';
import { Celular } from '../../modelos/cliente/celular';
import { Correo } from '../../modelos/cliente/correo';
import { Coordenada } from '../../modelos/configuracion/coordenada';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevoEmpresa: boolean = true;
  abrirPanelUbicacionEmpresa: boolean = true;
  abrirPanelAdminEmpresa: boolean = false;
  editarEmpresa: boolean = true;
  obligadoContabilidad: boolean = false;
  formularioValido: boolean = true;

  empresaProvincia: string = "";
  empresaCanton: string = "";
  empresaParroquia: string = "";

  sesion: Sesion=null;
  empresa= new Empresa();
  telefono = new Telefono();
  celular = new Celular();
  correo = new Correo();

  empresas: Empresa[];
  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];

  correoEmpresa = new FormControl('', [Validators.email]);

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

  columnasEmpresa: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Empresa) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Empresa) => `${row.codigo}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificacion', celda: (row: Empresa) => `${row.identificacion}` },
    { nombreColumna: 'razonSocial', cabecera: 'Razon Social', celda: (row: Empresa) => `${row.razonSocial}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Empresa) => `${row.estado}` }
  ];
  cabeceraEmpresa: string[] = this.columnasEmpresa.map(titulo => titulo.nombreColumna);
  dataSourceEmpresa: MatTableDataSource<Empresa>;
  observableDSEmpresa: BehaviorSubject<MatTableDataSource<Empresa>> = new BehaviorSubject<MatTableDataSource<Empresa>>(null);
  clickedRows = new Set<Empresa>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroEmpresa") inputFiltroEmpresa: ElementRef;

  constructor(public dialog: MatDialog, private renderer: Renderer2, private router: Router, 
    private sesionService: SesionService, private empresaService: EmpresaService, private ubicacionService: UbicacionService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarEmpresas();
    this.empresa.obligadoContabilidad = mensajes.no;
    this.ubicacionService.obtenerProvincias().subscribe({
      next: res => {
        this.provincias = res.resultado as Ubicacion[];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
      this.eliminar(null);
  }

  limpiar() {
    this.empresa = new Empresa();
    this.editarEmpresa = true;
    this.clickedRows.clear();
    this.borrarFiltroEmpresa();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();

    this.validarFormulario();
    if (!this.formularioValido)
      return;

    this.agregarTelefonosCorreo();  
    console.log(this.empresa);  
    this.empresaService.crear(this.empresa).subscribe({
      next: res => {
        this.empresa = res.resultado as Empresa;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.empresas.push(this.empresa);
        this.llenarTablaEmpresa(this.empresas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarEmpresa = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.empresaService.actualizar(this.empresa).subscribe({
      next: res => {
        this.empresa = res.resultado as Empresa;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.empresaService.eliminarPersonalizado(this.empresa).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarEmpresas() {
    this.empresaService.consultar().subscribe({
      next: res => {
        this.empresas = res.resultado as Empresa[]
        this.llenarTablaEmpresa(this.empresas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaEmpresa(empresas: Empresa[]) {
    this.ordenarAsc(empresas, 'id');
    this.dataSourceEmpresa = new MatTableDataSource(empresas);
    this.dataSourceEmpresa.paginator = this.paginator;
    this.dataSourceEmpresa.sort = this.sort;
    this.observableDSEmpresa.next(this.dataSourceEmpresa);
  }

  seleccion(empresa: Empresa) {
    if (!this.clickedRows.has(empresa)) {
      this.clickedRows.clear();
      this.clickedRows.add(empresa);
      this.empresa = empresa;
      this.editarEmpresa = false;
    } else {
      this.limpiar();
    }
  }

  estadoObligadoContabilidad(event: any){
    if (event.checked){
      this.empresa.obligadoContabilidad = mensajes.si;
    } else {
      this.empresa.obligadoContabilidad = mensajes.no;
    }
    //console.log(this.empresa.obligadoContabilidad);
    //console.log(this.obligadoContabilidad);
  }

  filtroEmpresa(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEmpresa.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceEmpresa.paginator) {
      this.dataSourceEmpresa.paginator.firstPage();
    }
  }
  borrarFiltroEmpresa() {
    this.renderer.setProperty(this.inputFiltroEmpresa.nativeElement, 'value', '');
    this.dataSourceEmpresa.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  provincia(provincia: string) {
    this.empresa.direccion.ubicacion.provincia = provincia;
    this.ubicacionService.obtenerCantones(provincia).subscribe({
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

  canton(canton: string) {
    this.empresa.direccion.ubicacion.canton = canton;
    this.ubicacionService.obtenerParroquias(canton).subscribe({
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

  parroquia(parroquia: string) {
    this.empresa.direccion.ubicacion.parroquia = parroquia;
  }

  agregarTelefonosCorreo(){
    if (this.telefono.numero != ""){
      this.empresa.telefonos.push(this.telefono);
      //console.log("telefono");
    }
    if (this.celular.numero != ""){
      this.empresa.celulares.push(this.celular);
    }
    if (this.correoEmpresa.value != '' && this.correoEmpresa.valid){
      this.correo.email = this.correoEmpresa.value
      this.empresa.correos.push(this.correo);
      //console.log("correo");
    }
  }

  crearTelefono() {
    if (this.telefono.numero.length != valores.cero) {
      this.empresa.telefonos.push(this.telefono);
      this.telefono = new Telefono();
    } else {
      Swal.fire(error, "Ingrese un número telefónico válido", error_swal);
    }
  }
  validarTelefono() {
    let digito = this.telefono.numero.substring(0, 1);
    if (this.telefono.numero.length != 11 || digito != "0") {
      //this.telefono.numero = valores.vacio;
      Swal.fire(error, "Telefono Invalido", error_swal);
    }
  }
  eliminarTelefono(i: number) {
    this.empresa.telefonos.splice(i, 1);
  }

  crearCelular() {
    if (this.celular.numero.length != valores.cero) {
      this.empresa.celulares.push(this.celular);
      this.celular = new Celular();
    } else {
      Swal.fire(error, "Ingrese un número de celular válido", error_swal);
    }
  }
  validarCelular() {
    let digito = this.celular.numero.substring(0, 2);
    if (this.celular.numero.length != 12 || digito != "09") {
      //this.celular.numero = valores.vacio;
      Swal.fire(error, "Celular Invalido", error_swal);
    }
  }
  eliminarCelular(i: number) {
    this.empresa.celulares.splice(i, 1);
  }

  getErrorMessage() {
    if (this.correoEmpresa.hasError('required')) {
      return 'Correo requerido';
    }
    return this.correoEmpresa.hasError('email') ? 'No es un correo' : '';
  }
  crearCorreo() {
    if (this.correoEmpresa.value != '' && this.correoEmpresa.valid) {
      this.correo.email = this.correoEmpresa.value;
      this.empresa.correos.push(this.correo);
      this.correo = new Correo();
      this.correoEmpresa.setValue('');
    } else {
      Swal.fire(error, "Ingrese un correo válido", error_swal);
    }
  }
  validarCorreo() {
    let arroba = this.correo.email.includes("@");
    if (!arroba) {
      //this.correo.email = "";
      Swal.fire(error, "Correo Invalido", error_swal);
    }
  }
  eliminarCorreo(i: number) {
    this.empresa.correos.splice(i, 1);
  }

  validarFormulario(){
    this.formularioValido = true;
    if (this.empresa.identificacion == '') {
      Swal.fire(error, mensajes.error_identificacion, error_swal);
      this.formularioValido = false;
      return;
    }
    if (this.empresa.razonSocial == '') {
      Swal.fire(error, mensajes.error_razon_social, error_swal);
      this.formularioValido = false;
      return;
    }
    if (this.empresa.direccion.direccion == '') {
      Swal.fire(error, mensajes.error_direccion, error_swal);
      this.formularioValido = false;
      return;
    }
    if (this.empresa.direccion.ubicacion.provincia == '' || this.empresa.direccion.ubicacion.canton == '' || this.empresa.direccion.ubicacion.parroquia == '') {
      Swal.fire(error, mensajes.error_ubicacion, error_swal);
      this.formularioValido = false;
      return;
    }

  }
  capturarFile(event : any) : any{
    const archivoCapturado = event.target.files[0];
    //console.log(archivoCapturado);
    this.extrarBase64(archivoCapturado).then((imagen: any) => {
      this.empresa.logo = imagen.base;
      //console.log(imagen);
    });
  }

  extrarBase64 = async ($event: any) => new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        })
      };
      reader.onerror = error => {
        resolve({
          base: reader.result
        })
      };
    } catch (e) {
      return null;
    }
  }); 

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  dialogoMapas(): void {
    //console.log('El dialogo para selección de grupo producto fue abierto');
    const dialogRef = this.dialog.open(DialogoMapaEmpresaComponent, {
      width: '80%',
      // Para enviar datos
      //data: { usuario: this.usuario, clave: this.clave, grupo_producto_recibido: "" }
      data: this.posicionGeografica as Coordenada
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('El dialogo para selección de coordenada fue cerrado');
      console.log(result);
      if (result) {
        this.posicionGeografica = result as Coordenada;
        this.posicionCentral = this.posicionGeografica;
        this.empresa.direccion.latitud = this.posicionGeografica.lat;
        this.empresa.direccion.longitud = this.posicionGeografica.lng;
       //console.log(result);
      }
    });
  }

}

@Component({
  selector: 'dialogo-mapa-empresa',
  templateUrl: 'dialogo-mapa-empresa.component.html',
})

export class DialogoMapaEmpresaComponent {

  mapa: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogoMapaEmpresaComponent>,
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
      //console.log(this.data);
    } else {
      this.data = new Coordenada(0,0);
    }
  }
}