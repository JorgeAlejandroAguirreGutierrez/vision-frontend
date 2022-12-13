import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { valores, validarSesion, mensajes, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Empresa } from '../../modelos/usuario/empresa';
import { EmpresaService } from '../../servicios/usuario/empresa.service';

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
  abrirPanelAdminEmpresa: boolean = true;
  editarEmpresa: boolean = true;
  obligadoContabilidad: boolean = false;
  formularioValido: boolean = true;

  sesion: Sesion=null;
  empresa= new Empresa();
  empresas: Empresa[];

  columnasEmpresa: any[] = [
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

  constructor(private renderer: Renderer2, private router: Router, 
    private sesionService: SesionService, private empresaService: EmpresaService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
    this.empresa.obligadoContabilidad = mensajes.no;
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
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

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.empresaService.activar(this.empresa).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
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
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
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
}