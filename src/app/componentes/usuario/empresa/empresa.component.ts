import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { valores, validarSesion, mensajes, imagenes, otras, exito, exito_swal, error, error_swal } from '../../../constantes';
import Swal from 'sweetalert2';
import { Buffer } from 'buffer';

import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { ImagenService } from '../../../servicios/administracion/imagen.service'

import { Empresa } from '../../../modelos/usuario/empresa';
import { EmpresaService } from '../../../servicios/usuario/empresa.service';
import { TipoIdentificacion } from '../../../modelos/configuracion/tipo-identificacion';

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
  si: string = valores.si;
  no: string = valores.no;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  deshabilitarIdentificacion: boolean = false;

  sesion: Sesion=null;
  empresa: Empresa = new Empresa();

  empresas: Empresa[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Empresa) => `${row.codigo}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificacion', celda: (row: Empresa) => `${row.identificacion}` },
    { nombreColumna: 'razonSocial', cabecera: 'Razon Social', celda: (row: Empresa) => `${row.razonSocial}` },
    { nombreColumna: 'nombreComercial', cabecera: 'Nombre Comercial', celda: (row: Empresa) => `${row.nombreComercial}` },
    { nombreColumna: 'obligado', cabecera: 'Obligado', celda: (row: Empresa) => `${row.obligadoContabilidad}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Empresa) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Empresa>;
  clickedRows = new Set<Empresa>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private router: Router, private imagenService: ImagenService,
    private sesionService: SesionService, private empresaService: EmpresaService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.empresa.logo64 = imagenes.logo_empresa;
    this.consultar();
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.empresa= new Empresa();
    this.empresa.logo64 = imagenes.logo_empresa;
    this.deshabilitarIdentificacion = false;
    this.clickedRows.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;      
    this.empresaService.crear(this.empresa).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;      
    this.empresaService.actualizar(this.empresa).subscribe({
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
    this.empresaService.activar(this.empresa).subscribe({
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
    this.empresaService.inactivar(this.empresa).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.empresaService.consultar().subscribe({
      next: res => {
        this.empresas = res.resultado as Empresa[];
        this.llenarTabla(this.empresas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(empresas: Empresa[]){
    this.ordenarAsc(empresas, 'id');
    this.dataSource = new MatTableDataSource(empresas);
    this.dataSource.filterPredicate = (data: Empresa, filter: string): boolean =>
      data.identificacion.includes(filter) || data.razonSocial.includes(filter) || data.nombreComercial.includes(filter) || 
      data.obligadoContabilidad.includes(filter) || data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  seleccion(empresa: Empresa) {
    if (!this.clickedRows.has(empresa)){
      this.clickedRows.clear();
      this.clickedRows.add(empresa);
      this.empresa = { ... empresa};
      this.deshabilitarIdentificacion = true;
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
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSource.filter = '';
  }

  capturarFile(event : any) : any{
    const archivoCapturado = event.target.files[0];
    this.imagenService.convertirBase64(archivoCapturado).then((imagen: any) => {
      this.empresa.logo64 = imagen.base64;
      //this.empresa.logo = Buffer.from(imagen.byteArray.buffer).toJSON();
      //this.empresa.logo = imagen.byteArray;
      //console.log(this.empresa.logo64);
      //console.log(this.empresa.logo);
    });
  }

  //VALIDACIONES
  validarIdentificacion() {
    this.empresaService.validarIdentificacion(this.empresa.identificacion).subscribe({
      next: (res) => {
        this.empresa.tipoIdentificacion = res.resultado.tipoIdentificacion as TipoIdentificacion;
      },
      error: (err) => {
        this.empresa.tipoIdentificacion = null;
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  validarFormulario(): boolean {
    //validar que los campos esten llenos antes de guardar
    if (this.empresa.identificacion == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.empresa.tipoIdentificacion == null || this.empresa.tipoIdentificacion.descripcion != otras.tipoIdentificacionRUC) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_ruc });
      return false;
    }
    if (this.empresa.razonSocial == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.empresa.nombreComercial == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.empresa.direccion == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.empresa.logo64 == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_imagen });
      return false;
    }
    return true;
  }
}