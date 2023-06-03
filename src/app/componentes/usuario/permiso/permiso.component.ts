import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { valores, validarSesion, mensajes, exito, exito_swal, error, error_swal } from '../../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { MenuOpcion } from '../../../modelos/configuracion/menu-opcion';
import { MenuOpcionService } from '../../../servicios/configuracion/menu-opcion.service';
import { Perfil } from '../../../modelos/usuario/perfil';
import { PerfilService } from '../../../servicios/usuario/perfil.service';
import { Permiso } from 'src/app/modelos/usuario/permiso';
import { PermisoService } from '../../../servicios/usuario/permiso.service';

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
  si: string = valores.si;
  no: string = valores.no;

  indexPermiso: number = valores.menosUno;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  abrirPanelPermiso: boolean = false;
  deshabilitarPermisos: boolean = true;

  sesion: Sesion = null;
  modulo: String;
  perfil: Perfil = new Perfil();
  permiso: Permiso = new Permiso();

  perfiles: Perfil[];
  modulos: String[] = [];
  menuOpciones: MenuOpcion[] = [];

  columnas: any[] = [
    //{ nombreColumna: 'perfil', cabecera: 'Perfil', celda: (row: Permiso) => `${row.perfil.descripcion}` },
    { nombreColumna: 'modulo', cabecera: 'Módulo', celda: (row: Permiso) => `${row.menuOpcion.modulo}` },
    { nombreColumna: 'opcion', cabecera: 'Opción', celda: (row: Permiso) => `${row.menuOpcion.opcion}` },
    { nombreColumna: 'operacion', cabecera: 'Operación', celda: (row: Permiso) => `${row.menuOpcion.operacion}` },
    { nombreColumna: 'menu', cabecera: 'Menu', celda: (row: Permiso) => `${row.menuOpcion.menu}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Permiso) => `${row.estado}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Permiso>;
  clickedRows = new Set<Permiso>();

  @ViewChild('MatPaginator') paginator: MatPaginator;
  @ViewChild('MatSort') sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'A') //SHIFT + A
      this.actualizar(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  constructor(private renderer: Renderer2, private menuOpcionService: MenuOpcionService, private perfilService: PerfilService,
              private permisoService: PermisoService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultarPerfiles();
    this.consultarModulos();
  }

  consultarPerfiles() {
    this.perfilService.consultar().subscribe({
      next: res => {
        this.perfiles = res.resultado as Perfil[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
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
    this.dataSource = new MatTableDataSource<Permiso>([]);
    this.deshabilitarPermisos = true;
    this.nuevoPermiso();
  }

  nuevoPermiso(){
    this.permiso = new Permiso();
    this.clickedRows.clear();
    this.indexPermiso = valores.menosUno;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    //console.log(this.perfil);  
    this.perfilService.actualizar(this.perfil).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar(this.perfil);
        this.nuevoPermiso();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar(perfil: Perfil) {
      //console.log(this.permisos);
      this.deshabilitarPermisos = false;
      this.llenarTabla(perfil.permisos);
      this.nuevoPermiso();
  }

  llenarTabla(permisos: Permiso[]){
    this.dataSource = new MatTableDataSource(permisos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(permiso: Permiso, i: number) {
    if (!this.clickedRows.has(permiso)){
      this.clickedRows.clear();
      this.clickedRows.add(permiso);
      this.permiso = { ...permiso};
      this.indexPermiso = i;
      this.consultarOpciones(this.permiso.menuOpcion.modulo);
    } else {
      this.nuevoPermiso();
    }
  }

  activar(event){
    if (event != null)
      event.preventDefault();
   /* this.permisoService.activar(this.permiso).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });*/
    this.permiso.estado = valores.activo;
    this.perfil.permisos[this.indexPermiso] = this.permiso;
    this.actualizar(null);
  }

  inactivar(event){
    if (event != null)
      event.preventDefault();
    /*this.permisoService.inactivar(this.permiso).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });  
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });*/
    this.permiso.estado = valores.inactivo;
    this.perfil.permisos[this.indexPermiso] = this.permiso;
    this.actualizar(null);
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

  agregarPermiso(){
    if (this.existePermiso()) return;
    this.perfil.permisos.push({ ...this.permiso});
    this.consultar(this.perfil);
    this.nuevoPermiso();
  }

  actualizarPermiso(){
    if (this.existePermiso()) return;
    this.perfil.permisos[this.indexPermiso] = this.permiso;
    this.consultar(this.perfil);
    this.nuevoPermiso();
  }

  eliminarPermiso(i: number) {
    this.perfil.permisos.splice(i, 1);
    this.consultar(this.perfil);
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  //VERIFICACIONES
  existePermiso(): boolean{
    for (let i = 0; i < this.perfil.permisos.length; i++) {
      if (this.perfil.permisos[i].menuOpcion.opcion == this.permiso.menuOpcion.opcion){
        Swal.fire({ icon: error_swal, title: error, text: mensajes.error_permiso_existe })
        return true;
      } 
    };
    return false
  }
}
