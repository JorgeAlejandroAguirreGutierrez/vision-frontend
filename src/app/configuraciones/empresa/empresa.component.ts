import { Component, OnInit, HostListener, ElementRef, Renderer2, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import * as constantes from '../../constantes';
import * as util from '../../util';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/sesion';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Empresa } from '../../modelos/empresa';
import { EmpresaService } from '../../servicios/empresa.service';
import { Ubicacion } from '../../modelos/ubicacion';
import { UbicacionService } from '../../servicios/ubicacion.service';
import { Telefono } from '../../modelos/telefono';
import { Celular } from '../../modelos/celular';
import { Correo } from '../../modelos/correo';
import { Coordenada } from '../../modelos/coordenada';

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

  estadoActivo: string = constantes.estadoActivo;
  estadoInactivo: string = constantes.estadoInactivo;

  abrirPanelNuevoEmpresa: boolean = true;
  abrirPanelUbicacionEmpresa: boolean = true;
  abrirPanelAdminEmpresa: boolean = false;
  editarEmpresa: boolean = true;

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

  //Mapa
  latitud: number = -1.6705413480437092; //Tomar de configuación y poner en el init
  longitud: number = -78.64974203645144;
  ubicacionCentral: Coordenada = new Coordenada(this.latitud, this.longitud);
  ubicacionGeografica: Coordenada;
  mapTypeId: string = 'hybrid';
  coordenadas: Coordenada[] = [];

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

  constructor(public dialog: MatDialog, private renderer: Renderer2, private sesionService: SesionService, private router: Router, 
    private empresaService: EmpresaService, private ubicacionService: UbicacionService) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultarEmpresas();
    this.ubicacionService.obtenerProvincias().subscribe({
      next: res => {
        this.provincias = res.resultado as Ubicacion[];
      },
      error: err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje });
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
    this.empresaService.crear(this.empresa).subscribe({
      next: res => {
        this.empresa = res.resultado as Empresa;
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.empresas.push(this.empresa);
        this.llenarTablaEmpresa(this.empresas);
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
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
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.empresaService.eliminarPersonalizado(this.empresa).subscribe({
      next: res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarEmpresas() {
    this.empresaService.consultar().subscribe({
      next: res => {
        this.empresas = res.resultado as Empresa[]
        this.llenarTablaEmpresa(this.empresas);
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
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
    this.empresa.direccionMatriz.ubicacion.provincia = provincia;
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

  canton(canton: string) {
    this.empresa.direccionMatriz.ubicacion.canton = canton;
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

  parroquia(parroquia: string) {
    this.empresa.direccionMatriz.ubicacion.parroquia = parroquia;
  }

  crearTelefono() {
    if (this.telefono.numero.length != 0) {
      this.empresa.telefonos.push(this.telefono);
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
    this.empresa.telefonos.splice(i, 1);
  }

  crearCelular() {
    if (this.celular.numero.length != 0) {
      this.empresa.celulares.push(this.celular);
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
    this.empresa.celulares.splice(i, 1);
  }

  crearCorreo() {
    if (this.correo.email.length != 0) {
      this.empresa.correos.push(this.correo);
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
    this.empresa.correos.splice(i, 1);
  }

  dialogoMapas(): void {
    //console.log('El dialogo para selección de grupo producto fue abierto');
    const dialogRef = this.dialog.open(DialogoMapaEmpresaComponent, {
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
      console.log(this.data);
    } else {
      this.data = new Coordenada(0,0);
    }
  }
}  