import { Component, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { valores, validarSesion, error, error_swal } from '../../../../constantes';
import { MovimientoContableService } from '../../../../servicios/contabilidad/movimiento-contable.service';
import { MovimientoContable } from '../../../../modelos/contabilidad/movimiento-contable';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabla-movimiento-contable',
  templateUrl: './tabla-movimiento-contable.component.html',
  styleUrls: ['./tabla-movimiento-contable.component.scss']
})
export class TablaMovimientoContableComponent implements OnInit {

  sesion: Sesion=null;
  @Output() movimientoContableSeleccionado = new EventEmitter();
  movimientosContables: MovimientoContable[];

  columnasMovimientoContable: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: MovimientoContable) => `${row.id}`},
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: MovimientoContable) => `${row.codigo}`},
    { nombreColumna: 'afectacion', cabecera: 'Afectación', celda: (row: MovimientoContable) => `${row.afectacionContable.abreviatura}`},
    { nombreColumna: 'inventario', cabecera: 'Inventario', celda: (row: MovimientoContable) => `${row.inventario.cuenta}`},
    { nombreColumna: 'costo_Venta', cabecera: 'Costo Venta', celda: (row: MovimientoContable) => `${row.costoVenta.cuenta}`},
    { nombreColumna: 'devolucionCompra', cabecera: 'Dev. Compra', celda: (row: MovimientoContable) => `${row.devolucionCompra.cuenta}`},
    { nombreColumna: 'descuentoCompra', cabecera: 'Des. Compra', celda: (row: MovimientoContable) => `${row.descuentoCompra.cuenta}`},
    { nombreColumna: 'venta', cabecera: 'Venta', celda: (row: MovimientoContable) => `${row.venta.cuenta}`},
    { nombreColumna: 'devolucionVenta', cabecera: 'Dev. Venta', celda: (row: MovimientoContable) => `${row.devolucionVenta.cuenta}`},
    { nombreColumna: 'descuentoVenta', cabecera: 'Des. Venta', celda: (row: MovimientoContable) => `${row.descuentoVenta.cuenta}`},
    { nombreColumna: 'devolucionCostoVenta', cabecera: 'Dev. Costo Venta', celda: (row: MovimientoContable) => `${row.devolucionCostoVenta.cuenta}`},
  ];
  cabeceraMovimientoContable: string[]  = this.columnasMovimientoContable.map(titulo => titulo.nombreColumna);
  dataSourceMovimientoContable: MatTableDataSource<MovimientoContable>;
  observableDSMovimientoContable: BehaviorSubject<MatTableDataSource<MovimientoContable>> = new BehaviorSubject<MatTableDataSource<MovimientoContable>>(null);
  clickedRows = new Set<MovimientoContable>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroMovimientoContable") inputFiltroMovimientoContable: ElementRef;

  constructor(private renderer: Renderer2, private sesionService: SesionService, private router: Router, 
    private movimientoContableService: MovimientoContableService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarMovimientoContable();
  }

  filtroMovimientoContable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMovimientoContable.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceMovimientoContable.paginator) {
      this.dataSourceMovimientoContable.paginator.firstPage();
    }
  }
  borrarFiltroMovimientoContable() {
    this.renderer.setProperty(this.inputFiltroMovimientoContable.nativeElement, 'value', '');
    this.dataSourceMovimientoContable.filter = '';
    this.clickedRows.clear;
  }

  consultarMovimientoContable() {
    this.movimientoContableService.consultar().subscribe({
      next: res => {
        this.movimientosContables = res.resultado as MovimientoContable[]
        this.llenarDataSourceMovimientoContable(this.movimientosContables);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarDataSourceMovimientoContable(movimientosContables : MovimientoContable[]){
    this.ordenarAsc(movimientosContables, 'id');
    this.dataSourceMovimientoContable = new MatTableDataSource(this.movimientosContables);
    this.dataSourceMovimientoContable.filterPredicate = (data: MovimientoContable, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.afectacionContable.abreviatura.toUpperCase().includes(filter) || data.inventario.cuenta.toUpperCase().includes(filter) || data.costoVenta.cuenta.toUpperCase().includes(filter) || 
      data.devolucionCompra.cuenta.toUpperCase().includes(filter) || data.descuentoCompra.cuenta.toUpperCase().includes(filter) || data.venta.cuenta.toUpperCase().includes(filter) || 
      data.devolucionVenta.cuenta.toUpperCase().includes(filter) || data.descuentoVenta.cuenta.toUpperCase().includes(filter) || data.devolucionCostoVenta.cuenta.toUpperCase().includes(filter);
    this.dataSourceMovimientoContable.paginator = this.paginator;
     this.dataSourceMovimientoContable.sort = this.sort;
    this.observableDSMovimientoContable.next(this.dataSourceMovimientoContable);
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  seleccion(movimientoContableSeleccionado: MovimientoContable) {
    if (!this.clickedRows.has(movimientoContableSeleccionado)){
      this.clickedRows.clear();
      this.clickedRows.add(movimientoContableSeleccionado);
    } else {
      this.clickedRows.clear();
      movimientoContableSeleccionado = new MovimientoContable();
    }
    this.movimientoContableSeleccionado.emit(
      { movimientoContableSeleccionado }
    );
  }
}
