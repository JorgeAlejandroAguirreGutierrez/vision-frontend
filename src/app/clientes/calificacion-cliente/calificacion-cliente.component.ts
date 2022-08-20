import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as constantes from '../../constantes';
import * as util from '../../util';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { CalificacionCliente } from '../../modelos/calificacion-cliente';
import { CalificacionClienteService } from '../../servicios/calificacion-cliente.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-calificacion-cliente',
  templateUrl: './calificacion-cliente.component.html',
  styleUrls: ['./calificacion-cliente.component.scss']
})

export class CalificacionClienteComponent implements OnInit {

  estadoActivo: string = constantes.estadoActivo;
  estadoInactivo: string = constantes.estadoInactivo;

  abrirPanelNuevoCalificacionCliente : boolean= true;
  abrirPanelAdminCalificacionCliente: boolean = false;
  editarCalificacionCliente: boolean = true;

  sesion: Sesion=null;
  calificacionCliente= new CalificacionCliente();
  calificacionClientes: CalificacionCliente[];

  columnasCalificacionCliente: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: CalificacionCliente) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: CalificacionCliente) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: CalificacionCliente) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: CalificacionCliente) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: CalificacionCliente) => `${row.estado}` }
  ];
  cabeceraCalificacionCliente: string[] = this.columnasCalificacionCliente.map(titulo => titulo.nombreColumna);
  dataSourceCalificacionCliente: MatTableDataSource<CalificacionCliente>;
  observableDSCalificacionCliente: BehaviorSubject<MatTableDataSource<CalificacionCliente>> = new BehaviorSubject<MatTableDataSource<CalificacionCliente>>(null);
  clickedRows = new Set<CalificacionCliente>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroCalificacionCliente") inputFiltroCalificacionCliente: ElementRef;

  constructor(private renderer: Renderer2, private calificacionClienteService: CalificacionClienteService,
        private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultarCalificacionClientes();
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
    this.calificacionCliente = new CalificacionCliente();
    this.editarCalificacionCliente = true;
    this.clickedRows.clear();
    this.borrarFiltroCalificacionCliente();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.calificacionClienteService.crear(this.calificacionCliente).subscribe({
      next: res => {
        this.calificacionCliente = res.resultado as CalificacionCliente;
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.calificacionClientes.push(this.calificacionCliente);
        this.llenarTablaCalificacionCliente(this.calificacionClientes);
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarCalificacionCliente = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.calificacionClienteService.actualizar(this.calificacionCliente).subscribe({
      next: res => {
        this.calificacionCliente = res.resultado as CalificacionCliente;
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.calificacionCliente.estado = constantes.estadoEliminado;
    this.calificacionClienteService.eliminarPersonalizado(this.calificacionCliente).subscribe({
      next: res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarCalificacionClientes() {
    this.calificacionClienteService.consultar().subscribe({
      next: res => {
        this.calificacionClientes = res.resultado as CalificacionCliente[]
        this.llenarTablaCalificacionCliente(this.calificacionClientes);
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaCalificacionCliente(calificacionClientes: CalificacionCliente[]) {
    this.ordenarAsc(calificacionClientes, 'id');
    this.dataSourceCalificacionCliente = new MatTableDataSource(calificacionClientes);
    this.dataSourceCalificacionCliente.paginator = this.paginator;
    this.dataSourceCalificacionCliente.sort = this.sort;
    this.observableDSCalificacionCliente.next(this.dataSourceCalificacionCliente);
  }

  seleccion(calificacionCliente: CalificacionCliente) {
    if (!this.clickedRows.has(calificacionCliente)) {
      this.clickedRows.clear();
      this.clickedRows.add(calificacionCliente);
      this.calificacionCliente = calificacionCliente;
      this.editarCalificacionCliente = false;
    } else {
      this.limpiar();
    }
  }

  filtroCalificacionCliente(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCalificacionCliente.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceCalificacionCliente.paginator) {
      this.dataSourceCalificacionCliente.paginator.firstPage();
    }
  }
  borrarFiltroCalificacionCliente() {
    this.renderer.setProperty(this.inputFiltroCalificacionCliente.nativeElement, 'value', '');
    this.dataSourceCalificacionCliente.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

}
