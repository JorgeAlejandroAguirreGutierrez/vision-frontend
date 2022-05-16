import { Component, OnInit, Type } from '@angular/core';
import Swal from 'sweetalert2';
import * as constantes from '../../../constantes';
import * as util from '../../../util';
import { MovimientoContableService } from '../../../servicios/movimiento-contable.service';
import { MovimientoContable } from '../../../modelos/movimiento-contable';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sesion } from 'src/app/modelos/sesion';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabla-movimiento-contable',
  templateUrl: './tabla-movimiento-contable.component.html',
  styleUrls: ['./tabla-movimiento-contable.component.scss']
})
export class TablaMovimientoContableComponent implements OnInit {

  movimientoContable: MovimientoContable= new MovimientoContable();
  movimientosContables: MovimientoContable[];
  sesion: Sesion=null;

  columnas: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: MovimientoContable) => `${row.id}`},
    { nombreColumna: 'inventario', cabecera: 'Inventario', celda: (row: MovimientoContable) => `${row.codigo}`},
    { nombreColumna: 'costo_Venta', cabecera: 'Costo Venta', celda: (row: MovimientoContable) => `${row.costoVenta}`},
    { nombreColumna: 'devolucionCompra', cabecera: 'Dev. Compra', celda: (row: MovimientoContable) => `${row.devolucionCompra}`},
    { nombreColumna: 'descuentoCompra', cabecera: 'Des. Compra', celda: (row: MovimientoContable) => `${row.descuentoCompra}`},
    { nombreColumna: 'venta', cabecera: 'Venta', celda: (row: MovimientoContable) => `${row.venta}`},
    { nombreColumna: 'devolucionVenta', cabecera: 'Dev. Venta', celda: (row: MovimientoContable) => `${row.devolucionVenta}`},
    { nombreColumna: 'descuentoVenta', cabecera: 'Des. Venta', celda: (row: MovimientoContable) => `${row.descuentoVenta}`},
    { nombreColumna: 'devolucionCostoVenta', cabecera: 'Dev Const Venta', celda: (row: MovimientoContable) => `${row.devolucionCostoVenta}`},
  ];
  columnasMovimientoContable: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSourceMovimientoContable: MatTableDataSource<MovimientoContable>;
  clickedRows = new Set<MovimientoContable>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private sesionService: SesionService, private router: Router, private movimientoContableService: MovimientoContableService) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultar();
  }

  filtroMovimientoContable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMovimientoContable.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceMovimientoContable.paginator) {
      this.dataSourceMovimientoContable.paginator.firstPage();
    }
  }

  consultar() {
    this.movimientoContableService.consultar().subscribe(
      res => {
        this.movimientosContables = res.resultado as MovimientoContable[]
        this.dataSourceMovimientoContable = new MatTableDataSource(this.movimientosContables);
        this.dataSourceMovimientoContable.paginator = this.paginator;
        this.dataSourceMovimientoContable.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(movimientoContableSeleccionado: MovimientoContable) {
    if (!this.clickedRows.has(movimientoContableSeleccionado)){
      this.clickedRows.clear();
      this.clickedRows.add(movimientoContableSeleccionado);
      this.movimientoContable = movimientoContableSeleccionado;
    } else {
      this.clickedRows.clear();
      this.movimientoContable = new MovimientoContable();
    }
  }
}
