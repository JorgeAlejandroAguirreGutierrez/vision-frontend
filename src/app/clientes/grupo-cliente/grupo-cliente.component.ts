import { Component, OnInit, HostListener  } from '@angular/core';
import * as constantes from '../../constantes';
import * as util from '../../util';
import Swal from 'sweetalert2';

import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { GrupoClienteService } from '../../servicios/grupo-cliente.service';
import { GrupoCliente } from '../../modelos/grupo-cliente';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grupo-cliente',
  templateUrl: './grupo-cliente.component.html',
  styleUrls: ['./grupo-cliente.component.scss']
})

export class GrupoClienteComponent implements OnInit {

  sesion: Sesion;
  estadoActivo: string = constantes.estadoActivo;
  estadoInactivo: string = constantes.estadoInactivo;
  textoFiltroGrupoCliente:string;

  abrirPanelNuevoGrupoCliente: boolean = true;
  abrirPanelAdminGrupoCliente: boolean = false;
  deshabilitarEditarGrupoCliente: boolean = false;

  grupoCliente = new GrupoCliente();
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
  clickedGrupoCliente = new Set<GrupoCliente>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private grupoClienteService: GrupoClienteService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    util.validarSesion(this.sesion, this.sesionService, this.router);
    this.consultar();
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.limpiar();
    if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
      this.eliminar(null);
  }

  editar() {
    this.deshabilitarEditarGrupoCliente = false;
  }

  limpiar() {
    this.editar();
    this.grupoCliente = new GrupoCliente();
    this.clickedGrupoCliente.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.grupoClienteService.crear(this.grupoCliente).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.consultar();
        this.limpiar();
        this.abrirPanelAdminGrupoCliente = true;
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar() {
    this.grupoClienteService.actualizar(this.grupoCliente).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.grupoCliente = res.resultado as GrupoCliente;
        this.limpiar();
        this.llenarDataSourceGrupoCliente(this.grupoClientes);
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminar(grupoCliente: GrupoCliente) {
    this.grupoClienteService.eliminar(grupoCliente).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.grupoCliente = res.resultado as GrupoCliente
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminarEstado() {
    this.grupoCliente.estado = constantes.estadoEliminado;
    this.actualizar();
  }

  consultar() {
    this.grupoClienteService.consultar().subscribe(
      res => {
        this.grupoClientes = res.resultado as GrupoCliente[];
        this.llenarDataSourceGrupoCliente(this.grupoClientes);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  llenarDataSourceGrupoCliente(grupoCliente : GrupoCliente[]){
    this.dataSourceGrupoCliente = new MatTableDataSource(grupoCliente);
    this.dataSourceGrupoCliente.filterPredicate = (data: GrupoCliente, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.descripcion.toUpperCase().includes(filter) || data.abreviatura.toUpperCase().includes(filter) || data.estado.toUpperCase().includes(filter);
      this.dataSourceGrupoCliente.paginator = this.paginator;
      this.dataSourceGrupoCliente.sort = this.sort;
  }

  filtroGrupoCliente(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGrupoCliente.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceGrupoCliente.paginator) {
      this.dataSourceGrupoCliente.paginator.firstPage();
    }
  }

  borrarFiltroGrupoCliente(){
    this.textoFiltroGrupoCliente = '';
    this.dataSourceGrupoCliente.filter = '';
  }

  seleccion(grupoClienteSeleccionado: GrupoCliente) {
    if (!this.clickedGrupoCliente.has(grupoClienteSeleccionado)) {
      this.clickedGrupoCliente.clear();
      this.clickedGrupoCliente.add(grupoClienteSeleccionado);
      this.grupoCliente = grupoClienteSeleccionado;
      this.deshabilitarEditarGrupoCliente = true;
      this.abrirPanelNuevoGrupoCliente = true;
    } else {
      this.clickedGrupoCliente.clear();
      this.grupoCliente = new GrupoCliente();
      this.deshabilitarEditarGrupoCliente = false;
    }
  }
}
