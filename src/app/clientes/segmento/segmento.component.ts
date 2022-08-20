import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as constantes from '../../constantes';
import * as util from '../../util';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { Segmento } from '../../modelos/segmento';
import { SegmentoService } from '../../servicios/segmento.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-segmento',
  templateUrl: './segmento.component.html',
  styleUrls: ['./segmento.component.scss']
})

export class SegmentoComponent implements OnInit {

  estadoActivo: string = constantes.estadoActivo;
  estadoInactivo: string = constantes.estadoInactivo;

  abrirPanelNuevoSegmento: boolean = true;
  abrirPanelAdminSegmento: boolean = false;
  editarSegmento: boolean = true;

  sesion: Sesion = null;
  segmento: Segmento = new Segmento();
  segmentos: Segmento[];

  columnasSegmento: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Segmento) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Segmento) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: Segmento) => `${row.descripcion}` },
    { nombreColumna: 'margen_ganancia', cabecera: 'Margen Ganancia %', celda: (row: Segmento) => `${row.margenGanancia} %` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Segmento) => `${row.estado}` }
  ];
  cabeceraSegmento: string[] = this.columnasSegmento.map(titulo => titulo.nombreColumna);
  dataSourceSegmento: MatTableDataSource<Segmento>;
  observableDSSegmento: BehaviorSubject<MatTableDataSource<Segmento>> = new BehaviorSubject<MatTableDataSource<Segmento>>(null);
  clickedRows = new Set<Segmento>();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroSegmento") inputFiltroSegmento: ElementRef;

  constructor(private renderer: Renderer2, private segmentoService: SegmentoService,
    private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion = util.validarSesion(this.sesionService, this.router);
    this.consultarSegmentos();
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
    this.segmento = new Segmento();
    this.editarSegmento = true;
    this.clickedRows.clear();
    this.borrarFiltroSegmento();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.segmentoService.crear(this.segmento).subscribe({
      next: res => {
        this.segmento = res.resultado as Segmento;
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.segmentos.push(this.segmento);
        this.llenarTablaSegmento(this.segmentos);
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarSegmento = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.segmentoService.actualizar(this.segmento).subscribe({
      next: res => {
        this.segmento = res.resultado as Segmento;
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.segmentoService.eliminarPersonalizado(this.segmento).subscribe({
      next: res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarSegmentos() {
    this.segmentoService.consultar().subscribe({
      next: res => {
        this.segmentos = res.resultado as Segmento[]
        this.llenarTablaSegmento(this.segmentos);
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaSegmento(segmentos: Segmento[]) {
    this.ordenarAsc(segmentos, 'id');
    this.dataSourceSegmento = new MatTableDataSource(segmentos);
    this.dataSourceSegmento.paginator = this.paginator;
    this.dataSourceSegmento.sort = this.sort;
    this.observableDSSegmento.next(this.dataSourceSegmento);
  }

  seleccion(segmento: Segmento) {
    if (!this.clickedRows.has(segmento)) {
      this.clickedRows.clear();
      this.clickedRows.add(segmento);
      this.segmento = segmento;
      this.editarSegmento = false;
    } else {
      this.limpiar();
    }
  }

  filtroSegmento(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSegmento.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceSegmento.paginator) {
      this.dataSourceSegmento.paginator.firstPage();
    }
  }
  borrarFiltroSegmento() {
    this.renderer.setProperty(this.inputFiltroSegmento.nativeElement, 'value', '');
    this.dataSourceSegmento.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }
}