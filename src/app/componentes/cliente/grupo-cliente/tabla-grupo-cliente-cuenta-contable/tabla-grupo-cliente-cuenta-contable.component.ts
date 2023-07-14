import { Component, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { valores, validarSesion, error, error_swal } from '../../../../constantes';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Empresa } from '../../../../modelos/usuario/empresa';
import { CuentaContable } from '../../../../modelos/contabilidad/cuenta-contable';
import { CuentaContableService } from '../../../../servicios/contabilidad/cuenta-contable.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-tabla-grupo-cliente-cuenta-contable',
  templateUrl: './tabla-grupo-cliente-cuenta-contable.component.html',
  styleUrls: ['./tabla-grupo-cliente-cuenta-contable.component.scss']
})
export class TablaGrupoClienteCuentaContableComponent implements OnInit {

  @Output() cuentaContableSeleccionado = new EventEmitter();

  sesion: Sesion=null;
  empresa: Empresa = new Empresa();
  cuentaContable= new CuentaContable();

  cuentasContables: CuentaContable[];

  columnas: any[] = [
    { nombreColumna: 'cuenta', cabecera: 'Cuenta', celda: (row: CuentaContable) => `${row.cuenta}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: CuentaContable) => `${row.descripcion}` },
    { nombreColumna: 'clasificacion', cabecera: 'Clasificación', celda: (row: CuentaContable) => `${row.clasificacion}` },
    { nombreColumna: 'nivel', cabecera: 'Nivel', celda: (row: CuentaContable) => `${row.nivel}` }
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
    this.empresa = this.sesion.empresa;
    this.consultar();
  }

  nuevo(){
    this.cuentaContable = new CuentaContable();
    this.clickedRows.clear();
  }

  consultar() {
    this.cuentaContableService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
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
      data.clasificacion.toUpperCase().includes(filter) || String(data.nivel).toUpperCase().includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
      this.cuentaContable = { ... cuentaContable};
    } else {
      this.nuevo();
    }
    if (this.cuentaContable.clasificacion=='M'){
      this.cuentaContableSeleccionado.emit(this.cuentaContable);
    } else {
      this.cuentaContableSeleccionado.emit(new CuentaContable());
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
    this.clickedRows.clear;
  }
}