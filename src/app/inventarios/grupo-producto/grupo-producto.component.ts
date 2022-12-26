import { Component, OnInit, HostListener, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { GrupoProductoService } from '../../servicios/inventario/grupo-producto.service';
import { GrupoProducto } from '../../modelos/inventario/grupo-producto';
import { CuentaContable } from '../../modelos/contabilidad/cuenta-contable';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriaProducto } from 'src/app/modelos/inventario/categoria-producto';
import { CategoriaProductoService } from 'src/app/servicios/inventario/categoria-producto.service';

export interface DialogData {
  cuentaContable: CuentaContable;
}

@Component({
  selector: 'app-grupo-producto',
  templateUrl: './grupo-producto.component.html',
  styleUrls: ['./grupo-producto.component.scss']
})
export class GrupoProductoComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  edicion: boolean = true;

  sesion: Sesion=null;
  grupoProducto = new GrupoProducto();
  gruposProductos: GrupoProducto[];
  categoriasProductos: CategoriaProducto[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GrupoProducto) => `${row.codigo}`},
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

  constructor(public dialog: MatDialog, private grupoProductoService: GrupoProductoService, private categoriaProductoService: CategoriaProductoService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarCategoriasProductos();
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
    this.grupoProducto = new GrupoProducto();
    this.clickedRows.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.grupoProductoService.crear(this.grupoProducto).subscribe({
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
    this.grupoProductoService.actualizar(this.grupoProducto).subscribe({
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
    this.grupoProductoService.activar(this.grupoProducto).subscribe({
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
    this.grupoProductoService.inactivar(this.grupoProducto).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.grupoProductoService.consultar().subscribe({
      next: res => {
        this.gruposProductos = res.resultado as GrupoProducto[]
        this.dataSource = new MatTableDataSource(this.gruposProductos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarCategoriasProductos() {
    this.categoriaProductoService.consultar().subscribe({
      next: res => {
        this.categoriasProductos = res.resultado as CategoriaProducto[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccion(grupoProducto: GrupoProducto) {
    if (!this.clickedRows.has(grupoProducto)){
      this.clickedRows.clear();
      this.clickedRows.add(grupoProducto);
      this.grupoProducto = { ... grupoProducto};
    } else {
      this.clickedRows.clear();
      this.grupoProducto= new GrupoProducto();
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  dialogoCuentasContables(): void {
    const dialogRef = this.dialog.open(DialogoGrupoProductoCuentaContableComponent, {
      width: '80%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        Object.assign(this.grupoProducto.cuentaContable, result as CuentaContable);
      }
    });
  }
}

@Component({
  selector: 'dialogo-grupo-producto-cuenta-contable',
  templateUrl: 'dialogo-grupo-producto-cuenta-contable.component.html',
})
export class DialogoGrupoProductoCuentaContableComponent {

  constructor(public dialogRef: MatDialogRef<DialogoGrupoProductoCuentaContableComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  cuentaContableSeleccionado(event: any) {
    console.log(event);
    this.data.cuentaContable = event;
  }
} 