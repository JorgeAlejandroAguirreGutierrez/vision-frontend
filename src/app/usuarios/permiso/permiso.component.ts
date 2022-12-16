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

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  edicion: boolean = true;

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
  @ViewChild("inputFiltro") inputFiltroPermiso: ElementRef;
  
  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Permiso) => `${row.codigo}`},
    { nombreColumna: 'modulo', cabecera: 'Módulo', celda: (row: Permiso) => `${row.modulo}`},
    { nombreColumna: 'opcion', cabecera: 'Opcion', celda: (row: Permiso) => `${row.opcion}`},
    { nombreColumna: 'operacion', cabecera: 'Operacion', celda: (row: Permiso) => `${row.operacion}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Permiso) => `${row.estado}`},
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Permiso>;
  clickedRows = new Set<Permiso>();
  observable: BehaviorSubject<MatTableDataSource<Permiso>> = new BehaviorSubject<MatTableDataSource<Permiso>>(null);
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
    this.selection.select(...this.dataSource.data);
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
    this.consultar();
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
    this.edicion = true;
    this.clickedRows.clear();
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
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.edicion = true;
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

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.permisoService.activar(this.permiso).subscribe({
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
    this.permisoService.inactivar(this.permiso).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
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
    this.controlPerfil.enable();
    this.consultar();
    if (this.perfiles.length > 0) {
      this.llenarDataSource(this.permisos);
    }
  }

  llenarDataSource(permisos : Permiso[]){
    this.ordenarAsc(permisos, 'id');
    this.dataSource = new MatTableDataSource(permisos);
    this.dataSource.filterPredicate = (data: Permiso, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.modulo.toUpperCase().includes(filter) ||
      data.operacion.toUpperCase().includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  borrarFiltro() {
    this.renderer.setProperty(this.dataSource, 'value', '');
    this.renderer.setProperty(this.inputFiltroPermiso.nativeElement , 'value', '');
    this.dataSource.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  consultar() {
    this.permisoService.consultar().subscribe({
      next: (res) => {
        this.permisos = res.resultado as Permiso[];
        this.llenarTabla(this.permisos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  llenarTabla(permisos: Permiso[]) {
    this.ordenarAsc(this.permisos, 'codigo');
    this.dataSource = new MatTableDataSource(this.permisos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.observable.next(this.dataSource);
  }
  

  seleccion(permiso: Permiso) {
    if (!this.clickedRows.has(permiso)) {
      this.clickedRows.clear();
      this.clickedRows.add(permiso);
      this.permiso = permiso;
      this.edicion = false;
    } else {
      this.limpiar();
    }
    this.selection.toggle(permiso)
  }
}
