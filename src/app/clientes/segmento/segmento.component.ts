import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
//import { BehaviorSubject } from 'rxjs';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Segmento } from '../../modelos/inventario/segmento';
import { SegmentoService } from '../../servicios/cliente/segmento.service';

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

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  formularioValido: boolean = false;
//  edicion: boolean = true;

  sesion: Sesion = null;
  segmento: Segmento = new Segmento();
  segmentos: Segmento[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Segmento) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: Segmento) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: Segmento) => `${row.abreviatura}` },
    { nombreColumna: 'margen_ganancia', cabecera: 'Margen Ganancia', celda: (row: Segmento) => `${row.margenGanancia} %` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Segmento) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Segmento>;
  //dataSource$: BehaviorSubject<MatTableDataSource<Segmento>> = new BehaviorSubject<MatTableDataSource<Segmento>>(null);
  clickedRows = new Set<Segmento>();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private segmentoService: SegmentoService,
    private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultar();
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.segmento = new Segmento();
    this.clickedRows.clear();
    this.borrarFiltro();
    this.formularioValido = false;
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.validarFormulario();
    if (!this.formularioValido)
      return;         
    this.segmentoService.crear(this.segmento).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.validarFormulario();
    if (!this.formularioValido)
      return;        
    this.segmentoService.actualizar(this.segmento).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.segmentoService.activar(this.segmento).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.segmentoService.inactivar(this.segmento).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.segmentoService.consultar().subscribe({
      next: res => {
        this.segmentos = res.resultado as Segmento[]
        this.llenarTabla(this.segmentos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(segmentos: Segmento[]) {
    this.ordenarAsc(segmentos, 'id');
    this.dataSource = new MatTableDataSource(segmentos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //this.dataSource$.next(this.dataSource); //Solo si quiero que se vea en la tablas los cambios
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  seleccion(segmento: Segmento) {
    if (!this.clickedRows.has(segmento)){
      this.clickedRows.clear();
      this.clickedRows.add(segmento);
      this.segmento = { ... segmento};
    } else {
      this.nuevo(null);
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

  validarFormulario(){
    //validar que los campos esten llenos antes de guardar
    this.formularioValido = true;
    if (this.segmento.descripcion == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      this.formularioValido = false;
      return;
    }
    if (this.segmento.margenGanancia <= 0) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      this.formularioValido = false;
      return;
    }
  }
}