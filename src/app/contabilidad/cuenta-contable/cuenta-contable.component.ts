import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { CuentaContable } from '../../modelos/contabilidad/cuenta-contable';
import { CuentaContableService } from '../../servicios/contabilidad/cuenta-contable.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cuenta-contable',
  templateUrl: './cuenta-contable.component.html',
  styleUrls: ['./cuenta-contable.component.scss']
})

export class CuentaContableComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevoCuentaContable: boolean = true;
  abrirPanelAdminCuentaContable: boolean = false;
  editarCuentaContable: boolean = true;

  sesion: Sesion = null;
  cuentaContable: CuentaContable = new CuentaContable();
  cuentasContables: CuentaContable[];

  columnasCuentaContable: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: CuentaContable) => `${row.id}` },
    { nombreColumna: 'cuenta', cabecera: 'Cuenta', celda: (row: CuentaContable) => `${row.cuenta}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: CuentaContable) => `${row.descripcion}` },
    { nombreColumna: 'clasificacion', cabecera: 'Clasificación', celda: (row: CuentaContable) => `${row.clasificacion}` },
    { nombreColumna: 'nivel', cabecera: 'Nivel', celda: (row: CuentaContable) => `${row.nivel}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: CuentaContable) => `${row.estado}` }
  ];
  cabeceraCuentaContable: string[] = this.columnasCuentaContable.map(titulo => titulo.nombreColumna);
  dataSourceCuentaContable: MatTableDataSource<CuentaContable>;
  observableDSCuentaContable: BehaviorSubject<MatTableDataSource<CuentaContable>> = new BehaviorSubject<MatTableDataSource<CuentaContable>>(null);
  clickedRows = new Set<CuentaContable>();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroCuentaContable") inputFiltroCuentaContable: ElementRef;

  constructor(private renderer: Renderer2, private cuentaContableService: CuentaContableService,
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

  limpiar() {
    this.cuentaContable = new CuentaContable();
    this.editarCuentaContable = true;
    this.clickedRows.clear();
    this.borrarFiltroCuentaContable();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.cuentaContableService.crear(this.cuentaContable).subscribe({
      next: res => {
        this.cuentaContable = res.resultado as CuentaContable;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.cuentasContables.push(this.cuentaContable);
        this.llenarTablaCuentaContable(this.cuentasContables);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarCuentaContable = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.cuentaContableService.actualizar(this.cuentaContable).subscribe({
      next: res => {
        this.cuentaContable = res.resultado as CuentaContable;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.cuentaContableService.activar(this.cuentaContable).subscribe({
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
    this.cuentaContableService.inactivar(this.cuentaContable).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.cuentaContableService.consultar().subscribe({
      next: res => {
        this.cuentasContables = res.resultado as CuentaContable[]
        this.llenarTablaCuentaContable(this.cuentasContables);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaCuentaContable(cuentasContables: CuentaContable[]) {
    this.ordenarAsc(cuentasContables, 'id');
    this.dataSourceCuentaContable = new MatTableDataSource(cuentasContables);
    this.dataSourceCuentaContable.paginator = this.paginator;
    this.dataSourceCuentaContable.sort = this.sort;
    this.observableDSCuentaContable.next(this.dataSourceCuentaContable);
  }

  seleccion(cuentaContable: CuentaContable) {
    if (!this.clickedRows.has(cuentaContable)) {
      this.clickedRows.clear();
      this.clickedRows.add(cuentaContable);
      this.cuentaContable = cuentaContable;
      this.editarCuentaContable = false;
    } else {
      this.limpiar();
    }
  }

  filtroCuentaContable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCuentaContable.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceCuentaContable.paginator) {
      this.dataSourceCuentaContable.paginator.firstPage();
    }
  }
  borrarFiltroCuentaContable() {
    this.renderer.setProperty(this.inputFiltroCuentaContable.nativeElement, 'value', '');
    this.dataSourceCuentaContable.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }
}
