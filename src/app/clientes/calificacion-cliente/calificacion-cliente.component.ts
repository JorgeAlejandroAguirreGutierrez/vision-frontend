import { Component, OnInit, HostListener, Type } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { CalificacionCliente } from '../../modelos/calificacion-cliente';
import { CalificacionClienteService } from '../../servicios/calificacion-cliente.service';
import * as constantes from '../../constantes';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as util from '../../util';

@Component({
  selector: 'app-calificacion-cliente',
  templateUrl: './calificacion-cliente.component.html',
  styleUrls: ['./calificacion-cliente.component.scss']
})

export class CalificacionClienteComponent implements OnInit {

  abrirPanelNuevoCalificacion = true;
  abrirPanelAdminCalificacion = false;

  sesion: Sesion=null;
  calificacionCliente= new CalificacionCliente();
  calificacionesClientes: CalificacionCliente[];

  columnasCalificacionCliente: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: CalificacionCliente) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: CalificacionCliente) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: CalificacionCliente) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: CalificacionCliente) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: CalificacionCliente) => `${row.estado}` }
  ];
  cabeceraCalificacionCliente: string[] = this.columnasCalificacionCliente.map(titulo => titulo.nombreColumna);
  dataSourceCalificacionCliente: MatTableDataSource<CalificacionCliente>;
  clickedRows = new Set<CalificacionCliente>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private calificacionClienteService: CalificacionClienteService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultar();
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

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.calificacionCliente = new CalificacionCliente();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.calificacionClienteService.crear(this.calificacionCliente).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.calificacionCliente=res.resultado as CalificacionCliente;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.calificacionClienteService.actualizar(this.calificacionCliente).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.calificacionCliente=res.resultado as CalificacionCliente;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.calificacionClienteService.eliminarPersonalizado(this.calificacionCliente).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.calificacionClienteService.consultar().subscribe(
      res => {
        this.calificacionesClientes = res.resultado as CalificacionCliente[]
        this.dataSourceCalificacionCliente = new MatTableDataSource(this.calificacionesClientes);
        this.dataSourceCalificacionCliente.paginator = this.paginator;
        this.dataSourceCalificacionCliente.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(calificacionSeleccionada: CalificacionCliente) {
    if (!this.clickedRows.has(calificacionSeleccionada)){
      this.clickedRows.clear();
      this.clickedRows.add(calificacionSeleccionada);
      this.calificacionCliente = calificacionSeleccionada;
    } else {
      this.clickedRows.clear();
      this.calificacionCliente = new CalificacionCliente();
    }
  }

  filtroCalificacionCliente(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCalificacionCliente.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceCalificacionCliente.paginator) {
      this.dataSourceCalificacionCliente.paginator.firstPage();
    }
  }

}
