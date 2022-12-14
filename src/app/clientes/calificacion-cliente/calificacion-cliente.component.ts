import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { valores, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { CalificacionCliente } from '../../modelos/cliente/calificacion-cliente';
import { CalificacionClienteService } from '../../servicios/cliente/calificacion-cliente.service';

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

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo : boolean= true;
  abrirPanelAdmin: boolean = false;
  edicion: boolean = true;

  sesion: Sesion=null;
  calificacionCliente= new CalificacionCliente();
  calificacionesClientes: CalificacionCliente[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: CalificacionCliente) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: CalificacionCliente) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: CalificacionCliente) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: CalificacionCliente) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<CalificacionCliente>;
  observable: BehaviorSubject<MatTableDataSource<CalificacionCliente>> = new BehaviorSubject<MatTableDataSource<CalificacionCliente>>(null);
  clickedRows = new Set<CalificacionCliente>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private calificacionClienteService: CalificacionClienteService,
        private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  limpiar() {
    this.calificacionCliente = new CalificacionCliente();
    this.edicion = true;
    this.clickedRows.clear();
    this.borrarFiltro();
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
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.calificacionesClientes.push(this.calificacionCliente);
        this.llenarTabla(this.calificacionesClientes);
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
    this.calificacionClienteService.actualizar(this.calificacionCliente).subscribe({
      next: res => {
        this.calificacionCliente = res.resultado as CalificacionCliente;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.calificacionClienteService.activar(this.calificacionCliente).subscribe({
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
    this.calificacionClienteService.inactivar(this.calificacionCliente).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.calificacionClienteService.consultar().subscribe({
      next: res => {
        this.calificacionesClientes = res.resultado as CalificacionCliente[]
        this.llenarTabla(this.calificacionesClientes);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(calificacionClientes: CalificacionCliente[]) {
    this.ordenarAsc(calificacionClientes, 'id');
    this.dataSource = new MatTableDataSource(calificacionClientes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.observable.next(this.dataSource);
  }

  seleccion(calificacionCliente: CalificacionCliente) {
    if (!this.clickedRows.has(calificacionCliente)) {
      this.clickedRows.clear();
      this.clickedRows.add(calificacionCliente);
      this.calificacionCliente = calificacionCliente;
      this.edicion = false;
    } else {
      this.limpiar();
    }
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

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

}
