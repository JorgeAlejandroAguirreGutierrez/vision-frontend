import { Component, OnInit, ViewChild, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../../constantes';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';
import { Sesion } from '../../../../modelos/usuario/sesion';
import { SesionService } from '../../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../../modelos/usuario/empresa';
import { ReporteExistencia } from 'src/app/modelos/reporte/reporte-existencia';
import { ReporteExistenciaService } from 'src/app/servicios/reporte/reporte-existencia.service';
import { ReporteExistenciaLinea } from 'src/app/modelos/reporte/reporte-existencia-linea';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-existencia',
  templateUrl: './existencia.component.html',
  styleUrls: ['./existencia.component.scss'],

})
export class ExistenciaComponent implements OnInit {

  abrirPanelExistencia: boolean = true;

  hoy = new Date();
  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  reporteExistencia = new ReporteExistencia();

  reporteExistencias: ReporteExistencia[] = [];
  reporteExistenciaLineas: ReporteExistenciaLinea[] = [];
  
  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Codigo', celda: (row: ReporteExistenciaLinea) => `${row.codigo}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: ReporteExistenciaLinea) => `${row.nombre}` },
    { nombreColumna: 'iva', cabecera: 'IVA', celda: (row: ReporteExistenciaLinea) => `${row.iva}` },
    { nombreColumna: 'existencia', cabecera: 'Existencia', celda: (row: ReporteExistenciaLinea) => `${row.existencia}` },
    { nombreColumna: 'costoTotal', cabecera: 'Costo Total', celda: (row: ReporteExistenciaLinea) => `$${row.costoTotal}` },
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<ReporteExistenciaLinea>;
  clickedRows = new Set<ReporteExistenciaLinea>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private sesionService: SesionService, private router: Router, 
    private datepipe: DatePipe, private reporteExistenciaService: ReporteExistenciaService) { } 

  ngOnInit(): void {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
  }
  
  obtener(){
    this.reporteExistenciaService.obtener(this.sesion.usuario.apodo, this.empresa.id).subscribe({
      next: res => {
        this.reporteExistencia = res.resultado as ReporteExistencia;
        this.reporteExistencias.push(this.reporteExistencia);
        this.llenarTablaVentaLineas(this.reporteExistencia.reporteExistenciaLineas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaVentaLineas(reporteExistenciaLineas: ReporteExistenciaLinea[]) {
    this.dataSource = new MatTableDataSource(reporteExistenciaLineas);
    this.dataSource.filterPredicate = (data: ReporteExistenciaLinea, filter: string): boolean =>
      data.codigo.includes(filter) || data.nombre.includes(filter) || data.iva.includes(filter) || 
      data.existencia.includes(filter) || data.costoTotal.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  pdf(event){
    if (event != null)
      event.preventDefault();
    this.reporteExistenciaService.pdf(this.sesion.usuario.apodo, this.empresa.id);
  }

  excel(event){
    if (event != null)
      event.preventDefault();
    this.reporteExistenciaService.excel(this.sesion.usuario.apodo, this.empresa.id);
  }
  
  seleccion(reporteExistenciaLinea: ReporteExistenciaLinea) {
    if (!this.clickedRows.has(reporteExistenciaLinea)){
      this.clickedRows.clear();
      this.clickedRows.add(reporteExistenciaLinea);
    } else {
      this.clickedRows.clear();
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
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', valores.vacio);
    this.dataSource.filter = valores.vacio;
  }
}
