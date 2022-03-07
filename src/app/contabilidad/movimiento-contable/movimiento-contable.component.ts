import { Component, OnInit, HostListener  } from '@angular/core';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { MovimientoContableService } from '../../servicios/movimiento-contable.service';
import { MovimientoContable } from '../../modelos/movimiento-contable';
import { AfectacionContable } from '../../modelos/afectacion-contable';
import { AfectacionContableService } from '../../servicios/afectacion-contable.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-movimiento-contable',
  templateUrl: './movimiento-contable.component.html',
  styleUrls: ['./movimiento-contable.component.scss']
})
export class MovimientoContableComponent implements OnInit {

  abrirPanelMovimientoContable: boolean = true;
  abrirPanelAdminMovimientoContable:boolean = false;

  sesion: Sesion;
  estado:string= 'ACTIVO'; // Quitar cuando se aumente el campo en la tabla segmento
  afectaciones: AfectacionContable[] = [];

  afectacion_contable = new AfectacionContable();
  movimientoContable: MovimientoContable= new MovimientoContable();
  movimientosContables: MovimientoContable[];
  movimientoContableActualizar: MovimientoContable= new MovimientoContable();
  movimientoContableBuscar: MovimientoContable=new MovimientoContable();

  columnas: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: MovimientoContable) => `${row.id}`},
    { nombreColumna: 'inventario', cabecera: 'Inventario', celda: (row: MovimientoContable) => `${row.codigo}`},
    { nombreColumna: 'costo_venta', cabecera: 'Costo Venta', celda: (row: MovimientoContable) => `${row.costoVenta}`},
    { nombreColumna: 'devolucion_compra', cabecera: 'Dev. Compra', celda: (row: MovimientoContable) => `${row.devolucionCompra}`},
    { nombreColumna: 'descuento_compra', cabecera: 'Des. Compra', celda: (row: MovimientoContable) => `${row.descuentoCompra}`},
    { nombreColumna: 'venta', cabecera: 'Venta', celda: (row: MovimientoContable) => `${row.venta}`},
    { nombreColumna: 'devolucion_venta', cabecera: 'Dev. Venta', celda: (row: MovimientoContable) => `${row.devolucionVenta}`},
    { nombreColumna: 'descuento_venta', cabecera: 'Des. Venta', celda: (row: MovimientoContable) => `${row.descuentoVenta}`},
    { nombreColumna: 'devolucion_costo_venta', cabecera: 'Dev Const Venta', celda: (row: MovimientoContable) => `${row.devolucionCostoVenta}`},
  ];
  columnasMovimientoContable: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSourceMovimientoContable: MatTableDataSource<MovimientoContable>;
  clickedRows = new Set<MovimientoContable>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private sesionService: SesionService, private movimientoContableService: MovimientoContableService, 
    private afectacionContableService: AfectacionContableService) { }

  ngOnInit() {
    this.sesion= this.sesionService.getSesion();
    this.construir_movimiento_contable();
    this.consultar();
    this.afectacionContableService.consultar().subscribe(
      res => {
        this.afectaciones = res.resultado as AfectacionContable[];
        this.movimientoContable.afectacionContable.id = this.afectaciones[0].id;
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "E") // SHIFT + E
      this.eliminar(null);
  }

  async construir_movimiento_contable() {
    let movimientoContableId=0;
    this.movimientoContableService.currentMessage.subscribe(message => movimientoContableId = message);
    if (movimientoContableId!= 0) {
      await this.movimientoContableService.obtenerAsync(movimientoContableId).then(
        res => {
          Object.assign(this.movimientoContable, res.resultado as MovimientoContable);
          this.movimientoContableService.enviar(0);
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.movimientoContable=new MovimientoContable();
  }

  borrar(event){
    if (event!=null){
      event.preventDefault()};
      if(this.movimientoContable.id!=0){
        let id=this.movimientoContable.id;
        let codigo=this.movimientoContable.codigo;
        this.movimientoContable=new MovimientoContable();
        this.movimientoContable.id=id;
        this.movimientoContable.codigo=codigo;
      }
      else{
        this.movimientoContable=new MovimientoContable();
      }
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.movimientoContableService.crear(this.movimientoContable).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.movimientoContable=new MovimientoContable();
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.movimientoContableService.actualizar(this.movimientoContable).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.movimientoContable=new MovimientoContable();
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizarLeer(event){
    if (event!=null)
      event.preventDefault();
      this.abrirPanelMovimientoContable = true;
      this.abrirPanelAdminMovimientoContable = false;
      if(this.movimientoContableActualizar.id!=0){
        this.movimientoContable={... this.movimientoContableActualizar};
        this.movimientoContableActualizar=new MovimientoContable();
      }
      
  }

  eliminar(event) {
    if (event!=null)
      event.preventDefault();
    this.movimientoContableService.eliminar(this.movimientoContable).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.movimientoContable = res.resultado as MovimientoContable;     
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
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
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event) {
    if (event!=null)
      event.preventDefault();
    this.movimientoContableService.buscar(this.movimientoContableBuscar).subscribe(
      res => {
          this.movimientosContables = res.resultado as MovimientoContable[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccion(movimientoContableSeleccionado: MovimientoContable) {
    if (!this.clickedRows.has(movimientoContableSeleccionado)){
      this.clickedRows.clear();
      this.clickedRows.add(movimientoContableSeleccionado);
      this.movimientoContable = movimientoContableSeleccionado;
      this.movimientoContableActualizar=movimientoContableSeleccionado;
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

  cambiarBuscarCodigo(){
    this.buscar(null);
  }

  cambiarBuscarDescripcion(){
    this.buscar(null);
  }

  cambiarBuscarAbreviatura(){
    this.buscar(null);
  }
}
