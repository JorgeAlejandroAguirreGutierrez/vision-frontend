import { Component, OnInit, ViewChild, HostListener, ElementRef, Renderer2 } from '@angular/core';
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

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-permiso',
  templateUrl: './permiso.component.html',
  styleUrls: ['./permiso.component.scss']
})
export class PermisoComponent implements OnInit {

  activo: string = valores.estadoActivo;
  inactivo: string = valores.estadoInactivo;
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
  permisos: Permiso[] = [];
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
    this.permisos = [];
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
    this.perfilService.actualizar(this.perfil).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevoPermiso();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
      this.permisoService.consultarPorPerfil(this.perfil.id).subscribe({
        next: res => {
          this.permisos = res.resultado as Permiso[];
          this.deshabilitarPermisos = false;
          this.llenarTabla(this.permisos);
          this.nuevoPermiso();
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
  }

  llenarTabla(permisos: Permiso[]){
    this.dataSource = new MatTableDataSource(permisos);
    this.dataSource.filterPredicate = (data: Permiso, filter: string): boolean =>
      data.codigo.includes(filter) || data.menuOpcion.modulo.includes(filter) || data.menuOpcion.opcion.includes(filter) ||
      data.menuOpcion.operacion.includes(filter) || data.menuOpcion.menu.includes(filter) || data.estado.includes(filter);
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

    this.permiso.estado = valores.estadoActivo;
    this.perfil.permisos[this.indexPermiso] = this.permiso;
    this.actualizar(null);
  }

  inactivar(event){
    if (event != null)
      event.preventDefault();
    this.permisoService.inactivar(this.permiso).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        //this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
    //this.permiso.estado = valores.estadoInactivo;
    //this.perfil.permisos[this.indexPermiso] = this.permiso;
    //this.actualizar(null);
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
    if (!this.validarPermiso()) return;
    if (this.existePermiso()) return;
    this.perfil.permisos.push({ ...this.permiso});
    this.llenarTabla(this.perfil.permisos);
  }

  actualizarPermiso(){
    if (!this.validarPermiso()) return;
    if (this.existePermiso()) return;
    this.perfil.permisos[this.indexPermiso] = this.permiso;
    this.llenarTabla(this.perfil.permisos);
  }

  eliminarPermiso(i: number) {
    this.perfil.permisos.splice(i, 1);
    this.llenarTabla(this.perfil.permisos);
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

  validarPermiso(): boolean {
    if (this.permiso.menuOpcion.id == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.permiso.menuOpcion.modulo == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }
}
