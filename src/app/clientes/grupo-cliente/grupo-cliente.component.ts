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

  abrirPanelNuevoGrupoCliente = true;
  abrirPanelAdminGrupoCliente = false;

  sesion: Sesion=null;
  grupoCliente= new GrupoCliente();
  gruposClientes: GrupoCliente[];

  columnasGrupoCliente: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: GrupoCliente) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GrupoCliente) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: GrupoCliente) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: GrupoCliente) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: GrupoCliente) => `${row.estado}` }
  ];
  cabeceraGrupoCliente: string[] = this.columnasGrupoCliente.map(titulo => titulo.nombreColumna);
  dataSourceGrupoCliente: MatTableDataSource<GrupoCliente>;
  clickedRows = new Set<GrupoCliente>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private grupoClienteService: GrupoClienteService,
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
    this.grupoCliente = new GrupoCliente();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.grupoClienteService.crear(this.grupoCliente).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.grupoCliente=res.resultado as GrupoCliente;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.grupoClienteService.actualizar(this.grupoCliente).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.grupoCliente=res.resultado as GrupoCliente;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.grupoClienteService.eliminarPersonalizado(this.grupoCliente).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.grupoClienteService.consultar().subscribe(
      res => {
        this.gruposClientes = res.resultado as GrupoCliente[]
        this.dataSourceGrupoCliente = new MatTableDataSource(this.gruposClientes);
        this.dataSourceGrupoCliente.paginator = this.paginator;
        this.dataSourceGrupoCliente.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(grupoCliente: GrupoCliente) {
    if (!this.clickedRows.has(grupoCliente)){
      this.clickedRows.clear();
      this.clickedRows.add(grupoCliente);
      this.grupoCliente = grupoCliente;
    } else {
      this.clickedRows.clear();
      this.grupoCliente = new GrupoCliente();
    }
  }

  filtroGrupoCliente(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGrupoCliente.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceGrupoCliente.paginator) {
      this.dataSourceGrupoCliente.paginator.firstPage();
    }
  }
}
