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

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = false;
  edicion: boolean = true;

  sesion: Sesion=null;
  grupoProveedor= new GrupoProveedor();
  grupoProveedores: GrupoProveedor[];

  columnas: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: GrupoProveedor) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GrupoProveedor) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: GrupoProveedor) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: GrupoProveedor) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: GrupoProveedor) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<GrupoProveedor>;
  observable: BehaviorSubject<MatTableDataSource<GrupoProveedor>> = new BehaviorSubject<MatTableDataSource<GrupoProveedor>>(null);
  clickedRows = new Set<GrupoProveedor>(); 
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private grupoProveedorService: GrupoProveedorService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
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
    this.edicion = true;
    this.clickedRows.clear();
    this.borrarFiltro();
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
        this.grupoProveedores.push(this.grupoProveedor);
        this.llenarTabla(this.grupoProveedores);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.edicion = true;
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

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.grupoProveedorService.activar(this.grupoProveedor).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.grupoProveedorService.inactivar(this.grupoProveedor).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.grupoProveedorService.consultar().subscribe({
      next: res => {
        this.grupoProveedores = res.resultado as GrupoProveedor[]
        this.llenarTabla(this.grupoProveedores);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(grupoProveedores: GrupoProveedor[]) {
    this.ordenarAsc(grupoProveedores, 'id');
    this.dataSource = new MatTableDataSource(grupoProveedores);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.observable.next(this.dataSource);
  }

  seleccion(grupoProveedor: GrupoProveedor) {
    if (!this.clickedRows.has(grupoProveedor)) {
      this.clickedRows.clear();
      this.clickedRows.add(grupoProveedor);
      this.grupoProveedor = grupoProveedor;
      this.edicion = false;
    } else {
      this.limpiar();
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

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }
}
