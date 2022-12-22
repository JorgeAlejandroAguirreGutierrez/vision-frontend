import { Component, OnInit, HostListener, ElementRef, Inject, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
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
  edicion: boolean = true;

  sesion: Sesion=null;
  grupoCliente= new GrupoCliente();
  gruposClientes: GrupoCliente[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GrupoCliente) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: GrupoCliente) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: GrupoCliente) => `${row.abreviatura}` },
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
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
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
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.grupoClienteService.consultar().subscribe({
      next: res => {
        this.gruposClientes = res.resultado as GrupoCliente[]
        this.dataSource = new MatTableDataSource(this.gruposClientes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccion(grupoCliente: GrupoCliente) {
    if (!this.clickedRows.has(grupoCliente)){
      this.clickedRows.clear();
      this.clickedRows.add(grupoCliente);
      this.grupoCliente = { ... grupoCliente};
    } else {
      this.clickedRows.clear();
      this.grupoCliente = new GrupoCliente();
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Para capturar la imformación del Mat-dialog
  cuentaContableSeleccionado(event: any) {
    //console.log(event);
    let cuentaContableRecibido = event.movimientoContableSeleccionado as CuentaContable;
    this.grupoCliente.cuentaContable = cuentaContableRecibido;
    //console.log(grupoProductoRecibido.codigo);
  }

  dialogoCuentasContables(): void {
    const dialogRef = this.dialog.open(DialogoCuentaContableComponent, {
      width: '80%',
      //data: { usuario: this.usuario, clave: this.clave }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('El dialogo para selección de grupo producto fue cerrado');
      if (result) {
        this.grupoCliente.cuentaContable = result as CuentaContable;
      }
    });
  }
}

@Component({
  selector: 'dialogo-cuenta-contable',
  templateUrl: 'dialogo-cuenta-contable.component.html',
})
export class DialogoCuentaContableComponent {

  movimientoContable: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogoCuentaContableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CuentaContable) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Para capturar la imformación del Mat-dialog
  cuentaContableSeleccionado(event: any) {
    //console.log(event);
    if (event && event.id != 0) {
      this.data = event.movimientoContableSeleccionado as CuentaContable;
      //console.log(this.data.codigo);
    } else {
      this.data = new CuentaContable;
    }
  }
}  