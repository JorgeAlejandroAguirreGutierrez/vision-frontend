import { Component, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../../constantes';

import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';
import { CuentaContable } from '../../../modelos/contabilidad/cuenta-contable';
import { CuentaContableService } from '../../../servicios/contabilidad/cuenta-contable.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-tabla-cuenta-contable',
  templateUrl: './tabla-cuenta-contable.component.html',
  styleUrls: ['./tabla-cuenta-contable.component.scss']
})
export class TablaCuentaContableComponent implements OnInit {

  sesion: Sesion=null;
  @Output() cuentaContableSeleccionado = new EventEmitter();
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

  constructor(private renderer: Renderer2, private sesionService: SesionService, private router: Router, 
    private cuentaContableService: CuentaContableService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarCuentaContable();
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
    this.clickedRows.clear;
  }

  consultarCuentaContable() {
    this.cuentaContableService.consultar().subscribe({
      next: res => {
        this.cuentasContables = res.resultado as CuentaContable[]
        this.llenarDataSourceCuentaContable(this.cuentasContables);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarDataSourceCuentaContable(cuentasContables : CuentaContable[]){
    this.ordenarAsc(cuentasContables, 'id');
    //console.log(gruposProductos);
    this.dataSourceCuentaContable = new MatTableDataSource(this.cuentasContables);
    this.dataSourceCuentaContable.filterPredicate = (data: CuentaContable, filter: string): boolean =>
      data.cuenta.toUpperCase().includes(filter) || data.descripcion.toUpperCase().includes(filter) || 
      data.clasificacion.toUpperCase().includes(filter) || String(data.nivel).toUpperCase().includes(filter) || 
      data.estado.toUpperCase().includes(filter);
    this.dataSourceCuentaContable.paginator = this.paginator;
     this.dataSourceCuentaContable.sort = this.sort;
    this.observableDSCuentaContable.next(this.dataSourceCuentaContable);
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  seleccion(cuentaContableSeleccionado: CuentaContable) {
    if (!this.clickedRows.has(cuentaContableSeleccionado)){
      this.clickedRows.clear();
      this.clickedRows.add(cuentaContableSeleccionado);
    } else {
      this.clickedRows.clear();
      cuentaContableSeleccionado = new CuentaContable();
    }
    this.cuentaContableSeleccionado.emit(
      { cuentaContableSeleccionado }
    );
  }
}
