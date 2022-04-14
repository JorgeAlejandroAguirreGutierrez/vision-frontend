import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() grupo_producto_seleccionado = new EventEmitter();
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
  clickedRows = new Set<GrupoProducto>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private sesionService: SesionService, private router: Router, private grupoProductoService: GrupoProductoService) { }

  ngOnInit() {
    util.validarSesion(this.sesion, this.sesionService, this.router);
    this.consultar();
  }

  filtroGrupoProducto(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGrupoProducto.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceGrupoProducto.paginator) {
      this.dataSourceGrupoProducto.paginator.firstPage();
    }
  }

  consultar() {
    this.grupoProductoService.consultar().subscribe(
      res => {
        this.gruposProductos = res.resultado as GrupoProducto[];
        this.llenarDataSourceGrupoProducto(this.gruposProductos);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  llenarDataSourceGrupoProducto(gruposProductos : GrupoProducto[]){
    this.dataSourceGrupoProducto = new MatTableDataSource(gruposProductos);
    this.dataSourceGrupoProducto.filterPredicate = (data: GrupoProducto, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.grupo.toUpperCase().includes(filter) || data.subgrupo.toUpperCase().includes(filter) ||
      data.seccion.toUpperCase().includes(filter) || data.linea.toUpperCase().includes(filter) || data.sublinea.toUpperCase().includes(filter) || data.presentacion.toUpperCase().includes(filter);
    this.dataSourceGrupoProducto.paginator = this.paginator;
    this.dataSourceGrupoProducto.sort = this.sort;
  }

  seleccion(grupoProductoSeleccionado: GrupoProducto) {
    if (!this.clickedRows.has(grupoProductoSeleccionado)){
      this.clickedRows.clear();
      this.clickedRows.add(grupoProductoSeleccionado);
      this.grupo_producto_seleccionado.emit(
        { grupoProductoSeleccionado }
      );
    } else {
      this.clickedRows.clear();
      this.grupo_producto_seleccionado.emit(
         new GrupoProducto()
      );
    }
  }
}
