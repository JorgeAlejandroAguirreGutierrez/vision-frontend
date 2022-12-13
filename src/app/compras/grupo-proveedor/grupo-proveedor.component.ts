import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { GrupoProveedorService } from '../../servicios/compra/grupo-proveedor.service';
import { GrupoProveedor } from '../../modelos/compra/grupo-proveedor';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-grupo-proveedor',
  templateUrl: './grupo-proveedor.component.html',
  styleUrls: ['./grupo-proveedor.component.scss']
})

export class GrupoProveedorComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevoGrupoProveedor: boolean = true;
  abrirPanelAdminGrupoProveedor: boolean = false;
  editarGrupoProveedor: boolean = true;

  sesion: Sesion=null;
  grupoProveedor= new GrupoProveedor();
  grupoProveedors: GrupoProveedor[];

  columnasGrupoProveedor: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: GrupoProveedor) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GrupoProveedor) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: GrupoProveedor) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: GrupoProveedor) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: GrupoProveedor) => `${row.estado}` }
  ];
  cabeceraGrupoProveedor: string[] = this.columnasGrupoProveedor.map(titulo => titulo.nombreColumna);
  dataSourceGrupoProveedor: MatTableDataSource<GrupoProveedor>;
  observableDSGrupoProveedor: BehaviorSubject<MatTableDataSource<GrupoProveedor>> = new BehaviorSubject<MatTableDataSource<GrupoProveedor>>(null);
  clickedRows = new Set<GrupoProveedor>(); 
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroGrupoProveedor") inputFiltroGrupoProveedor: ElementRef;

  constructor(private renderer: Renderer2, private grupoProveedorService: GrupoProveedorService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarGrupoProveedor();
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  limpiar() {
    this.grupoProveedor = new GrupoProveedor();
    this.editarGrupoProveedor = true;
    this.clickedRows.clear();
    this.borrarFiltroGrupoProveedor();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.grupoProveedorService.crear(this.grupoProveedor).subscribe({
      next: res => {
        this.grupoProveedor = res.resultado as GrupoProveedor;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.grupoProveedors.push(this.grupoProveedor);
        this.llenarTablaGrupoProveedor(this.grupoProveedors);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarGrupoProveedor = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.grupoProveedorService.actualizar(this.grupoProveedor).subscribe({
      next: res => {
        this.grupoProveedor = res.resultado as GrupoProveedor;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarGrupoProveedor() {
    this.grupoProveedorService.consultar().subscribe({
      next: res => {
        this.grupoProveedors = res.resultado as GrupoProveedor[]
        this.llenarTablaGrupoProveedor(this.grupoProveedors);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaGrupoProveedor(grupoProveedors: GrupoProveedor[]) {
    this.ordenarAsc(grupoProveedors, 'id');
    this.dataSourceGrupoProveedor = new MatTableDataSource(grupoProveedors);
    this.dataSourceGrupoProveedor.paginator = this.paginator;
    this.dataSourceGrupoProveedor.sort = this.sort;
    this.observableDSGrupoProveedor.next(this.dataSourceGrupoProveedor);
  }

  seleccion(grupoProveedor: GrupoProveedor) {
    if (!this.clickedRows.has(grupoProveedor)) {
      this.clickedRows.clear();
      this.clickedRows.add(grupoProveedor);
      this.grupoProveedor = grupoProveedor;
      this.editarGrupoProveedor = false;
    } else {
      this.limpiar();
    }
  }

  filtroGrupoProveedor(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGrupoProveedor.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceGrupoProveedor.paginator) {
      this.dataSourceGrupoProveedor.paginator.firstPage();
    }
  }
  borrarFiltroGrupoProveedor() {
    this.renderer.setProperty(this.inputFiltroGrupoProveedor.nativeElement, 'value', '');
    this.dataSourceGrupoProveedor.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }
}
