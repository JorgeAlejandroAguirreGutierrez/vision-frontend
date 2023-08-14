import { Component, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import Swal from 'sweetalert2';
import { valores, validarSesion, exito, exito_swal, error, error_swal } from '../../../../constantes';
import { Router } from '@angular/router';
import { CuentaContable } from '../../../../modelos/contabilidad/cuenta-contable';
import { CuentaContableService } from '../../../../servicios/contabilidad/cuenta-contable.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SesionService } from '../../../../servicios/usuario/sesion.service';
import { Sesion } from '../../../../modelos/usuario/sesion';
import { Empresa } from 'src/app/modelos/usuario/empresa';


@Component({
  selector: 'app-tabla-grupo-producto-cuenta-contable',
  templateUrl: './tabla-grupo-producto-cuenta-contable.component.html',
  styleUrls: ['./tabla-grupo-producto-cuenta-contable.component.scss']
})
export class TablaGrupoProductoCuentaContableComponent implements OnInit {

  sesion: Sesion = null;
  empresa: Empresa = null;
  @Output() cuentaContableSeleccionado = new EventEmitter();
  cuentasContables: CuentaContable[];
  cuentaContable= new CuentaContable();

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
    this.sesion = validarSesion(this.sesionService, this.router);
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
        this.dataSource = new MatTableDataSource(this.cuentasContables);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
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