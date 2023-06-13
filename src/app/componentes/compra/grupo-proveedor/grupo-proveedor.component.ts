import { Component, OnInit, ViewChild, HostListener, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { GrupoProveedor } from '../../../modelos/compra/grupo-proveedor';
import { GrupoProveedorService } from '../../../servicios/compra/grupo-proveedor.service';
import { CuentaContable } from '../../../modelos/contabilidad/cuenta-contable';

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
  abrirPanelAdmin: boolean = true;

  sesion: Sesion = null;
  empresa: Empresa = null;
  grupoProveedor= new GrupoProveedor();
  gruposProveedores: GrupoProveedor[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GrupoProveedor) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: GrupoProveedor) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: GrupoProveedor) => `${row.abreviatura}` },
    { nombreColumna: 'cuenta', cabecera: 'Cuenta Contable', celda: (row: GrupoProveedor) => `${row.cuentaContable.cuenta}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: GrupoProveedor) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<GrupoProveedor>;
  clickedRows = new Set<GrupoProveedor>(); 
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(public dialog: MatDialog, private renderer: Renderer2, private grupoProveedorService: GrupoProveedorService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
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
    this.grupoProveedor = new GrupoProveedor();
    this.clickedRows.clear();
    this.borrarFiltro();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.grupoProveedor.empresa = this.empresa;
    this.grupoProveedorService.crear(this.grupoProveedor).subscribe({
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
    if (!this.validarFormulario())
      return;        
    this.grupoProveedorService.actualizar(this.grupoProveedor).subscribe({
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
    this.grupoProveedorService.activar(this.grupoProveedor).subscribe({
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
    this.grupoProveedorService.inactivar(this.grupoProveedor).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.grupoProveedorService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.gruposProveedores = res.resultado as GrupoProveedor[]
        this.llenarTabla(this.gruposProveedores);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(grupoProveedores: GrupoProveedor[]) {
    this.ordenarAsc(grupoProveedores, 'id');
    this.dataSource = new MatTableDataSource(grupoProveedores);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  seleccion(grupoProveedor: GrupoProveedor) {
    if (!this.clickedRows.has(grupoProveedor)){
      this.clickedRows.clear();
      this.clickedRows.add(grupoProveedor);
      this.grupoProveedor = { ... grupoProveedor};
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
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', valores.vacio);
    this.dataSource.filter = valores.vacio;
  }

  validarFormulario(): boolean{
    //validar que los campos esten llenos antes de guardar
    if (this.grupoProveedor.descripcion == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.grupoProveedor.abreviatura == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.grupoProveedor.cuentaContable.cuenta == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }

  dialogoCuentasContables(): void {
    const dialogRef = this.dialog.open(DialogoGrupoProveedorCuentaContableComponent, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(this.grupoProveedor.cuentaContable, result as CuentaContable);
      }
    });
  }
}

@Component({
  selector: 'dialogo-grupo-proveedor-cuenta-contable',
  templateUrl: 'dialogo-grupo-proveedor-cuenta-contable.component.html',
})
export class DialogoGrupoProveedorCuentaContableComponent {

  constructor(public dialogRef: MatDialogRef<DialogoGrupoProveedorCuentaContableComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: CuentaContable) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  cuentaContableSeleccionado(event: any) {
      this.data = event;
  }
}  