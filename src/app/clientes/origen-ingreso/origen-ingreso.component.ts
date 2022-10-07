import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { OrigenIngreso } from '../../modelos/cliente/origen-ingreso';
import { OrigenIngresoService } from '../../servicios/cliente/origen-ingreso.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-origen-ingreso',
  templateUrl: './origen-ingreso.component.html',
  styleUrls: ['./origen-ingreso.component.scss']
})

export class OrigenIngresoComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevoOrigenIngreso: boolean = true;
  abrirPanelAdminOrigenIngreso: boolean = false;
  editarOrigenIngreso: boolean = true;

  sesion: Sesion=null;
  origenIngreso= new OrigenIngreso();
  origenIngresos: OrigenIngreso[];
  
  columnasOrigenIngreso: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: OrigenIngreso) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: OrigenIngreso) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: OrigenIngreso) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: OrigenIngreso) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: OrigenIngreso) => `${row.estado}` }
  ];
  cabeceraOrigenIngreso: string[] = this.columnasOrigenIngreso.map(titulo => titulo.nombreColumna);
  dataSourceOrigenIngreso: MatTableDataSource<OrigenIngreso>;
  observableDSOrigenIngreso: BehaviorSubject<MatTableDataSource<OrigenIngreso>> = new BehaviorSubject<MatTableDataSource<OrigenIngreso>>(null);
  clickedRows = new Set<OrigenIngreso>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroOrigenIngreso") inputFiltroOrigenIngreso: ElementRef;

  constructor(private renderer: Renderer2, private origenIngresoService: OrigenIngresoService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarOrigenIngresos();
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
    this.origenIngreso = new OrigenIngreso();
    this.editarOrigenIngreso = true;
    this.clickedRows.clear();
    this.borrarFiltroOrigenIngreso();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.origenIngresoService.crear(this.origenIngreso).subscribe({
      next: res => {
        this.origenIngreso = res.resultado as OrigenIngreso;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.origenIngresos.push(this.origenIngreso);
        this.llenarTablaOrigenIngreso(this.origenIngresos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarOrigenIngreso = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.origenIngresoService.actualizar(this.origenIngreso).subscribe({
      next: res => {
        this.origenIngreso = res.resultado as OrigenIngreso;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.origenIngresoService.eliminarPersonalizado(this.origenIngreso).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarOrigenIngresos() {
    this.origenIngresoService.consultar().subscribe({
      next: res => {
        this.origenIngresos = res.resultado as OrigenIngreso[]
        this.llenarTablaOrigenIngreso(this.origenIngresos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaOrigenIngreso(origenIngresos: OrigenIngreso[]) {
    this.ordenarAsc(origenIngresos, 'id');
    this.dataSourceOrigenIngreso = new MatTableDataSource(origenIngresos);
    this.dataSourceOrigenIngreso.paginator = this.paginator;
    this.dataSourceOrigenIngreso.sort = this.sort;
    this.observableDSOrigenIngreso.next(this.dataSourceOrigenIngreso);
  }

  seleccion(origenIngreso: OrigenIngreso) {
    if (!this.clickedRows.has(origenIngreso)) {
      this.clickedRows.clear();
      this.clickedRows.add(origenIngreso);
      this.origenIngreso = origenIngreso;
      this.editarOrigenIngreso = false;
    } else {
      this.limpiar();
    }
  }

  filtroOrigenIngreso(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceOrigenIngreso.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceOrigenIngreso.paginator) {
      this.dataSourceOrigenIngreso.paginator.firstPage();
    }
  }
  borrarFiltroOrigenIngreso() {
    this.renderer.setProperty(this.inputFiltroOrigenIngreso.nativeElement, 'value', '');
    this.dataSourceOrigenIngreso.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }
}
