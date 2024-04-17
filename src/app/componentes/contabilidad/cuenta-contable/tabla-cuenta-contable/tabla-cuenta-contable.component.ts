import { Component, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { valores, validarSesion, exito, exito_swal, error, error_swal } from '../../../../constantes';

import { Sesion } from 'src/app/modelos/acceso/sesion';
import { SesionService } from 'src/app/servicios/acceso/sesion.service';
import { Router } from '@angular/router';
import { CuentaContable } from '../../../../modelos/contabilidad/cuenta-contable';
import { CuentaContableService } from '../../../../servicios/contabilidad/cuenta-contable.service';

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

  columnas: any[] = [
    { nombreColumna: 'cuenta', cabecera: 'Cuenta', celda: (row: CuentaContable) => `${row.cuenta}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: CuentaContable) => `${row.descripcion}` },
    { nombreColumna: 'clasificacion', cabecera: 'Clasificación', celda: (row: CuentaContable) => `${row.clasificacion}` },
    { nombreColumna: 'nivel', cabecera: 'Nivel', celda: (row: CuentaContable) => `${row.nivel}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: CuentaContable) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<CuentaContable>;
  clickedRows = new Set<CuentaContable>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private sesionService: SesionService, private router: Router, 
    private cuentaContableService: CuentaContableService) { }

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
    this.clickedRows.clear;
  }

  consultar() {
    this.cuentaContableService.consultar().subscribe({
      next: res => {
        this.cuentasContables = res.resultado as CuentaContable[]
        this.llenarDataSource(this.cuentasContables);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarDataSource(cuentasContables : CuentaContable[]){
    this.ordenarAsc(cuentasContables, 'id');
    this.dataSource = new MatTableDataSource(this.cuentasContables);
    this.dataSource.filterPredicate = (data: CuentaContable, filter: string): boolean =>
      data.cuenta.toUpperCase().includes(filter) || data.descripcion.toUpperCase().includes(filter) || 
      data.clasificacion.toUpperCase().includes(filter) || String(data.nivel).toUpperCase().includes(filter) || 
      data.estado.toUpperCase().includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //this.observableDSCuentaContable.next(this.dataSourceCuentaContable);
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  seleccion(cuentaContable: CuentaContable) {
    if (!this.clickedRows.has(cuentaContable)){
      this.clickedRows.clear();
      this.clickedRows.add(cuentaContable);
      //this.cuentaContable = { ... cuentaContable};
      
    } else {
      this.clickedRows.clear();
      cuentaContable = new CuentaContable();
    }
    this.cuentaContableSeleccionado.emit(cuentaContable);
  }
}
