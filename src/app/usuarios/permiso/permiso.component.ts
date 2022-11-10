import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { valores, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Perfil } from '../../modelos/usuario/perfil';
import { PerfilService } from '../../servicios/usuario/perfil.service';
import { Permiso } from '../../modelos/usuario/permiso';
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

  abrirPanelNuevoPermiso: boolean = true;
  abrirPanelAdminPermiso: boolean = true;
  editarPermiso: boolean = true;

  sesion: Sesion = null;
  perfil: Perfil = new Perfil();
  permiso: Permiso = new Permiso();

  permisos: Permiso[]=[];

  //Variables para los autocomplete
  perfiles: Perfil[]=[];
  controlPerfil = new UntypedFormControl();
  filtroPerfiles: Observable<Perfil[]> = new Observable<Perfil[]>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroPermiso") inputFiltroPermiso: ElementRef;
  
  columnasPermiso: any[] = [
    { nombreColumna: 'select', cabecera: 'select', celda: (row: any) => ''},
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Permiso) => `${row.id}`},
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Permiso) => `${row.codigo}`},
    { nombreColumna: 'modulo', cabecera: 'Módulo', celda: (row: Permiso) => `${row.modulo}`},
    { nombreColumna: 'opcion', cabecera: 'Opcion', celda: (row: Permiso) => `${row.opcion}`},
    { nombreColumna: 'operacion', cabecera: 'Operacion', celda: (row: Permiso) => `${row.operacion}`},
    //{ nombreColumna: 'acciones', cabecera: 'Acciones', celda: (row: any) => ''}
  ];
  cabeceraPermiso: string[]  = this.columnasPermiso.map(titulo => titulo.nombreColumna);
  dataSourcePermiso: MatTableDataSource<Permiso>;
  clickedRowsPermiso = new Set<Permiso>();
  selection = new SelectionModel<Permiso>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    //const numRows = this.dataSourcePermiso.data.length;
    const numRows = this.permisos.length;
    console.log("compa:", numSelected, numRows)
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    // Para poner todas las filas seleccionadas uso "select"
    this.selection.select(...this.dataSourcePermiso.data);
    //console.log(this.selection);
  }

  /** La etiqueta del checkbox sobre la fila pasada como parámetro */
  checkboxLabel(row?: Permiso): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  constructor(private renderer: Renderer2, private sesionService: SesionService, private router: Router,
    private perfilService: PerfilService, private permisoService: PermisoService) { }

  ngOnInit() {
    this.consultarPermisos();
    this.consultarPerfiles();
    this.filtroPerfiles = this.controlPerfil.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' || value==null ? value : value.id),
      map(perfil => typeof perfil === 'string' ? this.filtroPerfil(perfil) : this.perfiles.slice())
    );
  }

  limpiar() {
    this.perfil = new Perfil();
    this.editarPermiso = true;
    this.clickedRowsPermiso.clear();
    //this.borrarFiltroPermiso();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.permisoService.crear(this.permiso).subscribe({
      next: res => {
        this.permiso = res.resultado as Permiso;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.permisos.push(this.permiso);
        //this.llenarTablaPermiso(this.perfiles);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarPermiso = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.perfilService.actualizar(this.perfil).subscribe({
      next: res => {
        this.perfil = res.resultado as Perfil;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.permisoService.eliminarPersonalizado(this.permiso).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarPerfiles() {
    this.perfilService.consultar().subscribe({
      next: (res) => {
        this.perfiles = res.resultado as Perfil[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }
  private filtroPerfil(value: string): Perfil[] {
    if(this.perfiles.length>0) {
      const filterValue = value.toLowerCase();
      return this.perfiles.filter(perfil => perfil.descripcion.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verPerfil(perfil: Perfil): string {
    return perfil && perfil.descripcion ? perfil.descripcion : '';
  }
  seleccionarPerfil(){
    this.perfil = this.controlPerfil.value as Perfil;
    //this.productoProveedores = this.usuario.productosProveedores;
    //this.verBotones = true;
    this.controlPerfil.enable();
    //this.deshabilitarEditarPerfil = false;
    this.consultarPermisos();
    if (this.perfiles.length > 0) {
      this.llenarDataSourcePermiso(this.permisos);
    }
  }

  llenarDataSourcePermiso(permisos : Permiso[]){
    this.ordenarAsc(permisos, 'id');
    this.dataSourcePermiso = new MatTableDataSource(permisos);
    this.dataSourcePermiso.filterPredicate = (data: Permiso, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.modulo.toUpperCase().includes(filter) ||
      data.operacion.toUpperCase().includes(filter);
    this.dataSourcePermiso.paginator = this.paginator;
    this.dataSourcePermiso.sort = this.sort;
  }

  filtroPermiso(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePermiso.filter = filterValue.trim().toUpperCase();
    if (this.dataSourcePermiso.paginator) {
      this.dataSourcePermiso.paginator.firstPage();
    }
  }
  borrarFiltroPermiso() {
    this.renderer.setProperty(this.dataSourcePermiso, 'value', '');
    this.renderer.setProperty(this.inputFiltroPermiso.nativeElement , 'value', '');
    this.dataSourcePermiso.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  consultarPermisos() {
    //let select: Permiso[] = [];
    this.permisoService.consultar().subscribe({
      next: (res) => {
        this.permisos = res.resultado as Permiso[];
        //select = this.permisos;
        this.llenarDataSourcePermiso(this.permisos);
        this.selection.select(...this.permisos.filter(permiso => permiso.habilitado.valueOf()));
        console.log(this.permisos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  seleccion(permiso: Permiso) {
    if (!this.clickedRowsPermiso.has(permiso)) {
      this.clickedRowsPermiso.clear();
      this.clickedRowsPermiso.add(permiso);
      this.permiso = permiso;
      this.editarPermiso = false;
    } else {
      this.limpiar();
    }
    this.selection.toggle(permiso)
  }
}
