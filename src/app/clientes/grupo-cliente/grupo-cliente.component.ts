import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as constantes from '../../constantes';
import * as util from '../../util';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { GrupoClienteService } from '../../servicios/grupo-cliente.service';
import { GrupoCliente } from '../../modelos/grupo-cliente';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-grupo-cliente',
  templateUrl: './grupo-cliente.component.html',
  styleUrls: ['./grupo-cliente.component.scss']
})

export class GrupoClienteComponent implements OnInit {

  estadoActivo: string = constantes.estadoActivo;
  estadoInactivo: string = constantes.estadoInactivo;

  abrirPanelNuevoGrupoCliente: boolean = true;
  abrirPanelAdminGrupoCliente: boolean = false;
  editarGrupoCliente: boolean = true;

  sesion: Sesion=null;
  grupoCliente= new GrupoCliente();
  grupoClientes: GrupoCliente[];

  columnasGrupoCliente: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: GrupoCliente) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GrupoCliente) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: GrupoCliente) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: GrupoCliente) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: GrupoCliente) => `${row.estado}` }
  ];
  cabeceraGrupoCliente: string[] = this.columnasGrupoCliente.map(titulo => titulo.nombreColumna);
  dataSourceGrupoCliente: MatTableDataSource<GrupoCliente>;
  observableDSGrupoCliente: BehaviorSubject<MatTableDataSource<GrupoCliente>> = new BehaviorSubject<MatTableDataSource<GrupoCliente>>(null);
  clickedRows = new Set<GrupoCliente>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroGrupoCliente") inputFiltroGrupoCliente: ElementRef;

  constructor(private renderer: Renderer2, private grupoClienteService: GrupoClienteService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultarGrupoCliente();
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
    this.grupoCliente = new GrupoCliente();
    this.editarGrupoCliente = true;
    this.clickedRows.clear();
    this.borrarFiltroGrupoCliente();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.grupoClienteService.crear(this.grupoCliente).subscribe({
      next: res => {
        this.grupoCliente = res.resultado as GrupoCliente;
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.grupoClientes.push(this.grupoCliente);
        this.llenarTablaGrupoCliente(this.grupoClientes);
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarGrupoCliente = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.grupoClienteService.actualizar(this.grupoCliente).subscribe({
      next: res => {
        this.grupoCliente = res.resultado as GrupoCliente;
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.grupoClienteService.eliminarPersonalizado(this.grupoCliente).subscribe({
      next: res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarGrupoCliente() {
    this.grupoClienteService.consultar().subscribe({
      next: res => {
        this.grupoClientes = res.resultado as GrupoCliente[]
        this.llenarTablaGrupoCliente(this.grupoClientes);
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaGrupoCliente(grupoClientes: GrupoCliente[]) {
    this.ordenarAsc(grupoClientes, 'id');
    this.dataSourceGrupoCliente = new MatTableDataSource(grupoClientes);
    this.dataSourceGrupoCliente.paginator = this.paginator;
    this.dataSourceGrupoCliente.sort = this.sort;
    this.observableDSGrupoCliente.next(this.dataSourceGrupoCliente);
  }

  seleccion(grupoCliente: GrupoCliente) {
    if (!this.clickedRows.has(grupoCliente)) {
      this.clickedRows.clear();
      this.clickedRows.add(grupoCliente);
      this.grupoCliente = grupoCliente;
      this.editarGrupoCliente = false;
    } else {
      this.limpiar();
    }
  }

  filtroGrupoCliente(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGrupoCliente.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceGrupoCliente.paginator) {
      this.dataSourceGrupoCliente.paginator.firstPage();
    }
  }
  borrarFiltroGrupoCliente() {
    this.renderer.setProperty(this.inputFiltroGrupoCliente.nativeElement, 'value', '');
    this.dataSourceGrupoCliente.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }
}
