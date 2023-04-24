import { Component, OnInit, HostListener } from '@angular/core';
import { valores, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { MenuOpcion } from '../../modelos/configuracion/menu-opcion';
import { MenuOpcionService } from '../../servicios/configuracion/menu-opcion.service';
import { Perfil } from '../../modelos/usuario/perfil';
import { PerfilService } from '../../servicios/usuario/perfil.service';
import { Permiso } from 'src/app/modelos/usuario/permiso';
import { PermisoService } from '../../servicios/usuario/permiso.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-permiso',
  templateUrl: './permiso.component.html',
  styleUrls: ['./permiso.component.scss']
})
export class PermisoComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  abrirPanelPermiso: boolean = false;

  sesion: Sesion = null;
  modulo: String;
  perfil: Perfil = new Perfil();
  permiso: Permiso = new Permiso();

  perfiles: Perfil[];
  permisos: Permiso[];
  modulos: String[] = [];
  menuOpciones: MenuOpcion[] = [];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Permiso) => `${row.codigo}` },
    { nombreColumna: 'modulo', cabecera: 'Módulo', celda: (row: Permiso) => `${row.menuOpcion.modulo}` },
    { nombreColumna: 'operacion', cabecera: 'Opción', celda: (row: Permiso) => `${row.menuOpcion.opcion}` },
    { nombreColumna: 'menu', cabecera: 'Menu', celda: (row: Permiso) => `${row.menuOpcion.menu}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Permiso) => `${row.estado}` },
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Permiso>;
  clickedRows = new Set<Permiso>();

  @ViewChild('MatPaginator2') paginator2: MatPaginator;
  @ViewChild('MatSort2') sort2: MatSort;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  constructor(private menuOpcionService: MenuOpcionService, private perfilService: PerfilService,
              private permisoService: PermisoService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarModulos();
  }

  consultarModulos() {
    this.menuOpcionService.consultarModulos().subscribe({
      next: res => {
        this.modulos = res.resultado as String[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarOpciones(modulo: String) {
    this.menuOpcionService.consultarPorModulo(modulo).subscribe({
      next: res => {
        this.menuOpciones = res.resultado as MenuOpcion[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.perfil = new Perfil();
    this.permisos = [];
    this.clickedRows.clear();
    this.dataSource = new MatTableDataSource<Permiso>([]);
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
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }


  seleccion(permiso: Permiso) {
    if (!this.clickedRows.has(permiso)){
      this.clickedRows.clear();
      this.clickedRows.add(permiso);
      this.permiso = { ... permiso};
    } else {
      this.nuevo(null);
    }
  }

  consultarPermisos(perfil: Perfil) {
      this.permisos = perfil.permisos as Permiso[];
      this.llenarTabla(this.permisos);
  }

  llenarTabla(permisos: Permiso[]){
    this.dataSource = new MatTableDataSource(permisos);
    this.dataSource.paginator = this.paginator2;
    this.dataSource.sort = this.sort2;
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
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
