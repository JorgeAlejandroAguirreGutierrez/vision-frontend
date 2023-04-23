import { Component, OnInit, HostListener } from '@angular/core';
import { valores, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Parametro } from '../../modelos/configuracion/parametro';
import { ParametroService } from '../../servicios/configuracion/parametro.service';
import { Perfil } from '../../modelos/usuario/perfil';
import { PerfilService } from '../../servicios/usuario/perfil.service';
import { Permiso } from 'src/app/modelos/usuario/permiso';
import { PermisoService } from '../../servicios/usuario/permiso.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  abrirPanelPermiso: boolean = false;

  sesion: Sesion = null;
  perfil: Perfil = new Perfil();
  permiso: Permiso = new Permiso();

  perfiles: Perfil[];
  permisos: Permiso[];
  modulos: Parametro[] = [];
  operaciones: Parametro[] = [];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Perfil) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: Perfil) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: Perfil) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Perfil) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Perfil>;
  clickedRows = new Set<Perfil>();

  columnasPermiso: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Permiso) => `${row.codigo}` },
    { nombreColumna: 'modulo', cabecera: 'Módulo', celda: (row: Permiso) => `${row.modulo}` },
    { nombreColumna: 'operacion', cabecera: 'Opción', celda: (row: Permiso) => `${row.operacion}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Permiso) => `${row.estado}` },
    { nombreColumna: 'habilitado', cabecera: 'Habilitado', celda: (row: Permiso) => `${row.habilitado}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabeceraPermiso: string[] = this.columnasPermiso.map(titulo => titulo.nombreColumna);
  dataSourcePermiso: MatTableDataSource<Permiso>;
  clickedRowsPermiso = new Set<Permiso>();

  @ViewChild('MatPaginator1') paginator1: MatPaginator;
  @ViewChild('MatPaginator2') paginator2: MatPaginator;
  @ViewChild('MatSort1') sort1: MatSort;
  @ViewChild('MatSort2') sort2: MatSort;

  constructor(private parametroService: ParametroService, private perfilService: PerfilService,
              private permisoService: PermisoService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultar();
    //this.consultarPermisos();
    this.consultarModulos();
    this.consultarOperaciones();
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
    this.perfil = new Perfil();
    this.permisos = [];
    this.clickedRows.clear();
    this.clickedRowsPermiso.clear();
    this.dataSourcePermiso = new MatTableDataSource<Permiso>([]);
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.perfilService.crear(this.perfil).subscribe({
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
    this.perfilService.actualizar(this.perfil).subscribe({
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
    this.perfilService.activar(this.perfil).subscribe({
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
    this.perfilService.inactivar(this.perfil).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.perfilService.consultar().subscribe({
      next: res => {
        this.perfiles = res.resultado as Perfil[];
        this.llenarTabla(this.perfiles);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(perfiles: Perfil[]){
    this.dataSource = new MatTableDataSource(perfiles);
    this.dataSource.paginator = this.paginator1;
    this.dataSource.sort = this.sort1;
  }

  seleccion(perfil: Perfil) {
    if (!this.clickedRows.has(perfil)){
      this.clickedRows.clear();
      this.clickedRows.add(perfil);
      this.perfil = { ... perfil};
      this.permisos = this.perfil.permisos;
      this.llenarTablaPermisos(this.permisos);
    } else {
      this.nuevo(null);
    }
  }

  consultarPermisos() {
    this.permisoService.consultar().subscribe({
      next: res => {
        this.permisos = res.resultado as Permiso[];
        this.llenarTablaPermisos(this.permisos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaPermisos(permisos: Permiso[]){
    this.dataSourcePermiso = new MatTableDataSource(permisos);
    this.dataSourcePermiso.paginator = this.paginator2;
    this.dataSourcePermiso.sort = this.sort2;
  }

  activarPermiso(permiso: Permiso){
    this.permisoService.activar(permiso).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        permiso.habilitado = valores.si;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivarPermiso(permiso: Permiso){
    this.permisoService.inactivar(permiso).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        permiso.habilitado = valores.no;
        permiso.estado = valores.inactivo;        
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });


  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filtroPermiso(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePermiso.filter = filterValue.trim().toUpperCase();
    if (this.dataSourcePermiso.paginator) {
      this.dataSourcePermiso.paginator.firstPage();
    }
  }

  consultarModulos() {
    this.parametroService.consultarPorTipo(valores.modulo).subscribe({
      next: res => {
        this.modulos = res.resultado as Parametro[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarOperaciones() {
    this.parametroService.consultarPorTipo(valores.operacion).subscribe({
      next: res => {
        this.operaciones = res.resultado as Parametro[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  agregarPermiso(){
    this.perfil.permisos.push({ ... this.permiso});
    this.permiso= new Permiso();
  }

  eliminarPermiso(i: number) {
    this.perfil.permisos.splice(i, 1);
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

}
