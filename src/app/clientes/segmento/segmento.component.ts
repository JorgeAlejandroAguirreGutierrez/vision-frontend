import { Component, OnInit, HostListener, ElementRef, Renderer2  } from '@angular/core';
import * as constantes from '../../constantes';
import * as util from '../../util';
import Swal from 'sweetalert2';

import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { Segmento } from '../../modelos/segmento';
import { SegmentoService } from '../../servicios/segmento.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';


@Component({
  selector: 'app-segmento',
  templateUrl: './segmento.component.html',
  styleUrls: ['./segmento.component.scss']
})
export class SegmentoComponent implements OnInit {

  sesion: Sesion;
  estadoActivo: string = constantes.estadoActivo;
  estadoInactivo: string = constantes.estadoInactivo;

  abrirPanelNuevoSegmento: boolean = true;
  abrirPanelAdminSegmento: boolean = false;
  deshabilitarEditarSegmento: boolean = false;

  segmento = new Segmento();
  segmentos: Segmento[];

  columnasSegmento: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Segmento) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Segmento) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: Segmento) => `${row.descripcion}` },
    { nombreColumna: 'margen_ganancia', cabecera: 'Ganancia %', celda: (row: Segmento) => `${row.margenGanancia} %` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Segmento) => `${row.estado}` }
  ];
  cabeceraSegmento: string[] = this.columnasSegmento.map(titulo => titulo.nombreColumna);
  dataSourceSegmento: MatTableDataSource<Segmento>;
  clickedSegmento = new Set<Segmento>();

  @ViewChild('inputFiltroSegmento') inputFiltroSegmento: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private renderer: Renderer2, private segmentoService: SegmentoService, private sesionService: SesionService, private router: Router) { }

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
    this.deshabilitarEditarSegmento = false;
  }

  limpiar() {
    this.editar();
    this.segmento = new Segmento();
    this.clickedSegmento.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.segmentoService.crear(this.segmento).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.consultar();
        this.limpiar();
        this.abrirPanelAdminSegmento = true;
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar() {
    this.segmentoService.actualizar(this.segmento).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.segmento = res.resultado as Segmento;
        this.limpiar();
        this.llenarDataSourceSegmento(this.segmentos);
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminar(segmento: Segmento) {
    this.segmentoService.eliminar(segmento).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.segmento = res.resultado as Segmento
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminarEstado() {
    this.segmento.estado = constantes.estadoEliminado;
    //console.log(this.segmento);
    this.actualizar();
  }

  consultar() {
    this.segmentoService.consultar().subscribe(
      res => {
        this.segmentos = res.resultado as Segmento[];
        this.llenarDataSourceSegmento(this.segmentos);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  llenarDataSourceSegmento(segmento : Segmento[]){
    this.dataSourceSegmento = new MatTableDataSource(segmento);
    this.dataSourceSegmento.filterPredicate = (data: Segmento, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.descripcion.toUpperCase().includes(filter) || data.estado.toUpperCase().includes(filter);
      this.dataSourceSegmento.paginator = this.paginator;
      this.dataSourceSegmento.sort = this.sort;
  }

  filtroSegmento(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSegmento.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceSegmento.paginator) {
      this.dataSourceSegmento.paginator.firstPage();
    }
  }

  borrarFiltroSegmento(){
    //this.textoFiltroSegmento = '';
    this.renderer.setProperty(this.inputFiltroSegmento.nativeElement, 'value', '');
    //this.inputFiltroSegmento.nativeElement.value = '';
    this.dataSourceSegmento.filter = '';
  }

  seleccion(segmentoSeleccionado: Segmento) {
    if (!this.clickedSegmento.has(segmentoSeleccionado)) {
      this.clickedSegmento.clear();
      this.clickedSegmento.add(segmentoSeleccionado);
      this.segmento = segmentoSeleccionado;
      this.deshabilitarEditarSegmento = true;
      this.abrirPanelNuevoSegmento = true;
    } else {
      this.clickedSegmento.clear();
      this.segmento = new Segmento();
      this.deshabilitarEditarSegmento = false;
    }
  }
}
