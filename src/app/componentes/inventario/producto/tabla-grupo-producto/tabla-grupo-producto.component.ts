import { Component, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import Swal from 'sweetalert2';
import { validarSesion, error, error_swal } from '../../../../constantes';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SesionService } from '../../../../servicios/usuario/sesion.service';
import { Sesion } from '../../../../modelos/usuario/sesion';
import { GrupoProducto } from 'src/app/modelos/inventario/grupo-producto';
import { GrupoProductoService } from 'src/app/servicios/inventario/grupo-producto.service';
import { CuentaContable } from 'src/app/modelos/contabilidad/cuenta-contable';


@Component({
  selector: 'app-tabla-grupo-producto',
  templateUrl: './tabla-grupo-producto.component.html',
  styleUrls: ['./tabla-grupo-producto.component.scss']
})
export class TablaGrupoProductoComponent implements OnInit {

  sesion: Sesion = null;
  @Output() grupoProductoSeleccionado = new EventEmitter();
  gruposProductos: GrupoProducto[];
  grupoProducto = new GrupoProducto();

  columnas: any[] = [
    { nombreColumna: 'categoria', cabecera: 'Categoria', celda: (row: GrupoProducto) => `${row.categoriaProducto.descripcion}`},
    { nombreColumna: 'grupo', cabecera: 'Grupo', celda: (row: GrupoProducto) => `${row.grupo}`},
    { nombreColumna: 'subgrupo', cabecera: 'Subgrupo', celda: (row: GrupoProducto) => `${row.subgrupo}`},
    { nombreColumna: 'seccion', cabecera: 'Sección', celda: (row: GrupoProducto) => `${row.seccion}`},
    { nombreColumna: 'linea', cabecera: 'Línea', celda: (row: GrupoProducto) => `${row.linea}`},
    { nombreColumna: 'sublinea', cabecera: 'Sublínea', celda: (row: GrupoProducto) => `${row.sublinea}`},
    { nombreColumna: 'presentacion', cabecera: 'Presentación', celda: (row: GrupoProducto) => `${row.presentacion}`},
    { nombreColumna: 'cuenta', cabecera: 'Cuenta', celda: (row: GrupoProducto) => `${row.cuentaContable != null? row.cuentaContable.cuenta : new CuentaContable()}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: GrupoProducto) => `${row.estado}`},
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<GrupoProducto>;
  clickedRows = new Set<GrupoProducto>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private sesionService: SesionService, private router: Router, 
    private grupoProductoService: GrupoProductoService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
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
  
  consultar() {
    this.grupoProductoService.consultarActivos().subscribe({
      next: res => {
        this.gruposProductos = res.resultado as GrupoProducto[];
        this.llenarTabla(this.gruposProductos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(grupoProducto: GrupoProducto[]) {
    this.dataSource = new MatTableDataSource(grupoProducto);
    this.dataSource.filterPredicate = (data: GrupoProducto, filter: string): boolean =>
      data.categoriaProducto.descripcion.includes(filter) || data.grupo.includes(filter) || data.subgrupo.includes(filter) ||
      data.seccion.includes(filter) || data.linea.includes(filter) || data.sublinea.includes(filter) || data.presentacion.includes(filter) || 
      data.cuentaContable.cuenta.includes(filter) || data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(grupoProducto: GrupoProducto) {
    if (!this.clickedRows.has(grupoProducto)){
      this.clickedRows.clear();
      this.clickedRows.add(grupoProducto);
      this.grupoProducto = { ... grupoProducto};
      this.grupoProductoSeleccionado.emit(this.grupoProducto);
    } else {
      this.clickedRows.clear();
      grupoProducto = new GrupoProducto();
    }
  }
}