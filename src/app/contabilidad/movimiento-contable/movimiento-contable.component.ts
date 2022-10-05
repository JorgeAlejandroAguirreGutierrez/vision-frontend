import { Component, OnInit, HostListener  } from '@angular/core';
import Swal from 'sweetalert2';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { MovimientoContableService } from '../../servicios/contabilidad/movimiento-contable.service';
import { MovimientoContable } from '../../modelos/contabilidad/movimiento-contable';
import { AfectacionContable } from '../../modelos/contabilidad/afectacion-contable';
import { AfectacionContableService } from '../../servicios/contabilidad/afectacion-contable.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';


@Component({
  selector: 'app-movimiento-contable',
  templateUrl: './movimiento-contable.component.html',
  styleUrls: ['./movimiento-contable.component.scss']
})
export class MovimientoContableComponent implements OnInit {

  abrirPanelNuevoMovimientoContable = true;
  abrirPanelAdminMovimientoContable = false;

  sesion: Sesion=null;
  movimientoContable= new MovimientoContable();
  movimientosContables: MovimientoContable[];
  afectacionesContables: AfectacionContable[];
  
  columnasMovimientoContable: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: MovimientoContable) => `${row.id}`},
    { nombreColumna: 'inventario', cabecera: 'Inventario', celda: (row: MovimientoContable) => `${row.codigo}`},
    { nombreColumna: 'costoVenta', cabecera: 'Costo Venta', celda: (row: MovimientoContable) => `${row.costoVenta}`},
    { nombreColumna: 'devolucionCompra', cabecera: 'Dev. Compra', celda: (row: MovimientoContable) => `${row.devolucionCompra}`},
    { nombreColumna: 'descuentoCompra', cabecera: 'Des. Compra', celda: (row: MovimientoContable) => `${row.descuentoCompra}`},
    { nombreColumna: 'venta', cabecera: 'Venta', celda: (row: MovimientoContable) => `${row.venta}`},
    { nombreColumna: 'devolucionVenta', cabecera: 'Dev. Venta', celda: (row: MovimientoContable) => `${row.devolucionVenta}`},
    { nombreColumna: 'descuentoVenta', cabecera: 'Des. Venta', celda: (row: MovimientoContable) => `${row.descuentoVenta}`},
    { nombreColumna: 'devolucionCostoVenta', cabecera: 'Dev Const Venta', celda: (row: MovimientoContable) => `${row.devolucionCostoVenta}`},
  ];

  cabeceraMovimientoContable: string[] = this.columnasMovimientoContable.map(titulo => titulo.nombreColumna);
  dataSourceMovimientoContable: MatTableDataSource<MovimientoContable>;
  clickedRows = new Set<MovimientoContable>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private movimientoContableService: MovimientoContableService, private afectacionContableService: AfectacionContableService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarAfectacionesContables();
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
      this.eliminar(null);
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.movimientoContable = new MovimientoContable();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.movimientoContableService.crear(this.movimientoContable).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.movimientoContable=res.resultado as MovimientoContable;
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.movimientoContableService.actualizar(this.movimientoContable).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.movimientoContable=res.resultado as MovimientoContable;
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.movimientoContableService.eliminar(this.movimientoContable).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.movimientoContableService.consultar().subscribe(
      res => {
        this.movimientosContables = res.resultado as MovimientoContable[]
        this.dataSourceMovimientoContable = new MatTableDataSource(this.movimientosContables);
        this.dataSourceMovimientoContable.paginator = this.paginator;
        this.dataSourceMovimientoContable.sort = this.sort;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(movimientoContable: MovimientoContable) {
    if (!this.clickedRows.has(movimientoContable)){
      this.clickedRows.clear();
      this.clickedRows.add(movimientoContable);
      this.movimientoContable = movimientoContable;
    } else {
      this.clickedRows.clear();
      this.movimientoContable = new MovimientoContable();
    }
  }

  filtroMovimientoContable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMovimientoContable.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceMovimientoContable.paginator) {
      this.dataSourceMovimientoContable.paginator.firstPage();
    }
  }

  consultarAfectacionesContables() {
    this.afectacionContableService.consultar().subscribe(
      res => {
        this.afectacionesContables = res.resultado as AfectacionContable[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
}
