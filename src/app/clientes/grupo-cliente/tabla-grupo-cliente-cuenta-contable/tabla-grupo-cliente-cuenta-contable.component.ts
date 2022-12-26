import { Component, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
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
  selector: 'app-tabla-grupo-cliente-cuenta-contable',
  templateUrl: './tabla-grupo-cliente-cuenta-contable.component.html',
  styleUrls: ['./tabla-grupo-cliente-cuenta-contable.component.scss']
})
export class TablaGrupoClienteCuentaContableComponent implements OnInit {

  sesion: Sesion=null;
  @Output() cuentaContableSeleccionado = new EventEmitter();
  cuentasContables: CuentaContable[];
  cuentaContable= new CuentaContable();

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

  constructor(private sesionService: SesionService, private router: Router, 
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
  
  consultar() {
    this.cuentaContableService.consultar().subscribe({
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
      this.cuentaContableSeleccionado.emit(this.cuentaContable);
    } else {
      this.clickedRows.clear();
      cuentaContable = new CuentaContable();
    }
  }
}