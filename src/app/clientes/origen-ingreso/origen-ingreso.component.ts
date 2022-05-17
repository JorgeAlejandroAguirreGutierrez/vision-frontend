import { Component, OnInit, HostListener, Type } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';

import { TabService } from '../../componentes/services/tab.service';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { OrigenIngreso } from '../../modelos/origen-ingreso';
import { OrigenIngresoService } from '../../servicios/origen-ingreso.service';

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

  abrirPanelNuevoOrigenIngreso = true;
  abrirPanelAdminOrigenIngreso = false;

  sesion: Sesion=null;
  origenIngreso= new OrigenIngreso();
  origenesIngresos: OrigenIngreso[];
  
  columnasOrigenIngreso: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: OrigenIngreso) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: OrigenIngreso) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: OrigenIngreso) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: OrigenIngreso) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: OrigenIngreso) => `${row.estado}` }
  ];
  cabeceraOrigenIngreso: string[] = this.columnasOrigenIngreso.map(titulo => titulo.nombreColumna);
  dataSourceOrigenIngreso: MatTableDataSource<OrigenIngreso>;
  clickedRows = new Set<OrigenIngreso>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private origenIngresoService: OrigenIngresoService,
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
    this.origenIngreso = new OrigenIngreso();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.origenIngresoService.crear(this.origenIngreso).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.origenIngreso=res.resultado as OrigenIngreso;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.origenIngresoService.actualizar(this.origenIngreso).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.origenIngreso=res.resultado as OrigenIngreso;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.origenIngresoService.eliminarPersonalizado(this.origenIngreso).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.origenIngresoService.consultar().subscribe(
      res => {
        this.origenesIngresos = res.resultado as OrigenIngreso[]
        this.dataSourceOrigenIngreso = new MatTableDataSource(this.origenesIngresos);
        this.dataSourceOrigenIngreso.paginator = this.paginator;
        this.dataSourceOrigenIngreso.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(origenIngreso: OrigenIngreso) {
    if (!this.clickedRows.has(origenIngreso)){
      this.clickedRows.clear();
      this.clickedRows.add(origenIngreso);
      this.origenIngreso = origenIngreso;
    } else {
      this.clickedRows.clear();
      this.origenIngreso = new OrigenIngreso();
    }
  }

  filtroOrigenIngreso(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceOrigenIngreso.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceOrigenIngreso.paginator) {
      this.dataSourceOrigenIngreso.paginator.firstPage();
    }
  }
}
