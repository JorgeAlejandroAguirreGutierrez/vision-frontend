import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import * as constantes from '../../../constantes';
import * as util from '../../../util';
import { GrupoProducto } from '../../../modelos/grupo-producto';
import { GrupoProductoService } from '../../../servicios/grupo-producto.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/sesion';

@Component({
  selector: 'app-tabla-grupo-producto',
  templateUrl: './tabla-grupo-producto.component.html',
  styleUrls: ['./tabla-grupo-producto.component.scss']
})
export class TablaGrupoProductoComponent implements OnInit {

  sesion: Sesion=null;
  @Output() grupoProductoSeleccionado = new EventEmitter();
  gruposProductos: GrupoProducto[];

  columnasGrupoProducto: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: GrupoProducto) => `${row.id}`},
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GrupoProducto) => `${row.codigo}`},
    { nombreColumna: 'grupo', cabecera: 'Grupo', celda: (row: GrupoProducto) => `${row.grupo}`},
    { nombreColumna: 'subgrupo', cabecera: 'Subgrupo', celda: (row: GrupoProducto) => `${row.subgrupo}`},
    { nombreColumna: 'seccion', cabecera: 'Sección', celda: (row: GrupoProducto) => `${row.seccion}`},
    { nombreColumna: 'linea', cabecera: 'Línea', celda: (row: GrupoProducto) => `${row.linea}`},
    { nombreColumna: 'sublinea', cabecera: 'Sublínea', celda: (row: GrupoProducto) => `${row.sublinea}`},
    { nombreColumna: 'presentacion', cabecera: 'Presentación', celda: (row: GrupoProducto) => `${row.presentacion}`},
  ];
  cabeceraGrupoProducto: string[]  = this.columnasGrupoProducto.map(titulo => titulo.nombreColumna);
  dataSourceGrupoProducto: MatTableDataSource<GrupoProducto>;
  observableDSGrupoProducto: BehaviorSubject<MatTableDataSource<GrupoProducto>> = new BehaviorSubject<MatTableDataSource<GrupoProducto>>(null);
  @Input() clickedRows = new Set<GrupoProducto>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroGrupoProducto") inputFiltroGrupoProducto: ElementRef;

  constructor(private renderer: Renderer2, private sesionService: SesionService, private router: Router, 
    private grupoProductoService: GrupoProductoService) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultarGrupoProductos();
  }

  filtroGrupoProducto(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGrupoProducto.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceGrupoProducto.paginator) {
      this.dataSourceGrupoProducto.paginator.firstPage();
    }
  }
  borrarFiltroGrupoProducto() {
    this.renderer.setProperty(this.inputFiltroGrupoProducto.nativeElement, 'value', '');
    this.dataSourceGrupoProducto.filter = '';
  }

  consultarGrupoProductos() {
    this.grupoProductoService.consultar().subscribe({
      next: res => {
        this.gruposProductos = res.resultado as GrupoProducto[];
        this.llenarDataSourceGrupoProducto(this.gruposProductos);
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarDataSourceGrupoProducto(gruposProductos : GrupoProducto[]){
    this.ordenarAsc(gruposProductos, 'id');
    this.dataSourceGrupoProducto = new MatTableDataSource(gruposProductos);
    this.dataSourceGrupoProducto.filterPredicate = (data: GrupoProducto, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.grupo.toUpperCase().includes(filter) || data.subgrupo.toUpperCase().includes(filter) ||
      data.seccion.toUpperCase().includes(filter) || data.linea.toUpperCase().includes(filter) || data.sublinea.toUpperCase().includes(filter) || data.presentacion.toUpperCase().includes(filter);
    this.dataSourceGrupoProducto.paginator = this.paginator;
    this.dataSourceGrupoProducto.sort = this.sort;
    this.observableDSGrupoProducto.next(this.dataSourceGrupoProducto);
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  seleccion(grupoProductoSeleccionado: GrupoProducto) {
    if (!this.clickedRows.has(grupoProductoSeleccionado)){
      this.clickedRows.clear();
      this.clickedRows.add(grupoProductoSeleccionado);
    } else {
      this.clickedRows.clear();
      grupoProductoSeleccionado = new GrupoProducto();
    }
    this.grupoProductoSeleccionado.emit(
      { grupoProductoSeleccionado }
    );
  }
}
