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

  abrirPanelNuevoSegmento = true;
  abrirPanelAdminSegmento = false;

  sesion: Sesion=null;
  segmento= new Segmento();
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
  clickedRows = new Set<Segmento>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private segmentoService: SegmentoService,
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
    this.segmento = new Segmento();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.segmentoService.crear(this.segmento).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.segmento=res.resultado as Segmento;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.segmentoService.actualizar(this.segmento).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.segmento=res.resultado as Segmento;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.segmentoService.eliminarPersonalizado(this.segmento).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.segmentoService.consultar().subscribe(
      res => {
        this.segmentos = res.resultado as Segmento[]
        this.dataSourceSegmento = new MatTableDataSource(this.segmentos);
        this.dataSourceSegmento.paginator = this.paginator;
        this.dataSourceSegmento.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(segmento: Segmento) {
    if (!this.clickedRows.has(segmento)){
      this.clickedRows.clear();
      this.clickedRows.add(segmento);
      this.segmento = segmento;
    } else {
      this.clickedRows.clear();
      this.segmento = new Segmento();
    }
  }

  filtroSegmento(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSegmento.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceSegmento.paginator) {
      this.dataSourceSegmento.paginator.firstPage();
    }
  }
}
