import { Component, OnInit, HostListener, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { GrupoClienteService } from '../../servicios/cliente/grupo-cliente.service';
import { GrupoCliente } from '../../modelos/cliente/grupo-cliente';
import { CuentaContable } from '../../modelos/contabilidad/cuenta-contable';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

//export interface DialogData {
//  cuentaContable: CuentaContable;
//}

@Component({
  selector: 'app-grupo-cliente',
  templateUrl: './grupo-cliente.component.html',
  styleUrls: ['./grupo-cliente.component.scss']
})
export class GrupoClienteComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;

  sesion: Sesion=null;
  grupoCliente= new GrupoCliente();
  gruposClientes: GrupoCliente[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GrupoCliente) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: GrupoCliente) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: GrupoCliente) => `${row.abreviatura}` },
    { nombreColumna: 'cuenta', cabecera: 'Cuenta Contable', celda: (row: GrupoCliente) => `${row.cuentaContable.cuenta}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: GrupoCliente) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<GrupoCliente>;
  clickedRows = new Set<GrupoCliente>(); 
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(public dialog: MatDialog, private renderer: Renderer2, private grupoClienteService: GrupoClienteService,
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

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.grupoCliente = new GrupoCliente();
    this.clickedRows.clear();
    this.borrarFiltro();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.grupoClienteService.crear(this.grupoCliente).subscribe({
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
    this.grupoClienteService.actualizar(this.grupoCliente).subscribe({
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
    this.grupoClienteService.activar(this.grupoCliente).subscribe({
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
    this.grupoClienteService.inactivar(this.grupoCliente).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.grupoClienteService.consultar().subscribe({
      next: res => {
        this.gruposClientes = res.resultado as GrupoCliente[]
        this.llenarTabla(this.gruposClientes);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(grupoClientes: GrupoCliente[]) {
    this.ordenarAsc(grupoClientes, 'id');
    this.dataSource = new MatTableDataSource(grupoClientes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  seleccion(grupoCliente: GrupoCliente) {
    if (!this.clickedRows.has(grupoCliente)){
      this.clickedRows.clear();
      this.clickedRows.add(grupoCliente);
      this.grupoCliente = { ... grupoCliente};
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

  validarFormulario(): boolean{
    //validar que los campos esten llenos antes de guardar
    if (this.grupoCliente.descripcion == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.grupoCliente.abreviatura == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.grupoCliente.cuentaContable.cuenta == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }

  dialogoCuentasContables(): void {
    const dialogRef = this.dialog.open(DialogoGrupoClienteCuentaContableComponent, {
      width: '80%',
      //data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(this.grupoCliente.cuentaContable, result as CuentaContable);
      }
    });
  }
}

@Component({
  selector: 'dialogo-grupo-cliente-cuenta-contable',
  templateUrl: 'dialogo-grupo-cliente-cuenta-contable.component.html',
})
export class DialogoGrupoClienteCuentaContableComponent {

  constructor(public dialogRef: MatDialogRef<DialogoGrupoClienteCuentaContableComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: CuentaContable) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  cuentaContableSeleccionado(event: any) {
      this.data = event;
  }
}  