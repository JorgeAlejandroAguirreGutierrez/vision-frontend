import { Component, OnInit, ViewChild, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../../constantes';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';
import { Sesion } from '../../../../modelos/usuario/sesion';
import { SesionService } from '../../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../../modelos/usuario/empresa';
import { ReporteVenta } from 'src/app/modelos/reporte/reporte-venta';
import { ReporteVentaService } from 'src/app/servicios/reporte/reporte-venta.service';
import { ReporteVentaLinea } from 'src/app/modelos/reporte/reporte-venta-linea';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-detalle-ventas',
  templateUrl: './detalle-ventas.component.html',
  styleUrls: ['./detalle-ventas.component.scss'],

})
export class DetalleVentasComponent implements OnInit {

  abrirPanelPeriodo: boolean = true;
  abrirPanelDetalle: boolean = true;
  abrirPanelResumen: boolean = true;

  hoy = new Date();
  fechaInicio: Date = new Date();
  fechaFinal: Date = new Date();

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  reporteVenta = new ReporteVenta();

  reporteVentas: ReporteVenta[] = [];
  reporteVentaLineas: ReporteVentaLinea[] = [];
  
  columnas: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: ReporteVentaLinea) => `${row.fecha}` },
    { nombreColumna: 'hora', cabecera: 'Hora', celda: (row: ReporteVentaLinea) => `${row.hora}` },
    { nombreColumna: 'documento', cabecera: 'Doc', celda: (row: ReporteVentaLinea) => `${row.documento}` },
    { nombreColumna: 'establecimiento', cabecera: 'Estab', celda: (row: ReporteVentaLinea) => `${row.establecimiento}` },
    { nombreColumna: 'estacion', cabecera: 'P. Vta', celda: (row: ReporteVentaLinea) => `${row.estacion}` },
    { nombreColumna: 'secuencia', cabecera: 'Secuencia', celda: (row: ReporteVentaLinea) => `${row.secuencia}` },
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: ReporteVentaLinea) => `${row.cliente}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificacion', celda: (row: ReporteVentaLinea) => `${row.identificacion}` },
    { nombreColumna: 'vendedor', cabecera: 'Vendedor', celda: (row: ReporteVentaLinea) => `${row.vendedor}` },
    { nombreColumna: 'tipoVenta', cabecera: 'TipoVenta', celda: (row: ReporteVentaLinea) => `${row.tipoVenta}` },
    { nombreColumna: 'subtotal0', cabecera: 'Subt. 0', celda: (row: ReporteVentaLinea) => `${row.subtotal0}` },
    { nombreColumna: 'subtotal12', cabecera: 'Subt. 12', pie: 0, celda: (row: ReporteVentaLinea) => `${row.subtotal12}` },
    { nombreColumna: 'iva', cabecera: 'Iva', celda: (row: ReporteVentaLinea) => `${row.iva}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<ReporteVentaLinea>;
  clickedRows = new Set<ReporteVentaLinea>();

  columnasComprobantes: any[] = [
    { nombreColumna: 'emitidas', cabecera: 'Emitidas', celda: (row: ReporteVenta) => `${row.facturasEmitidas}` },
    { nombreColumna: 'anuladas', cabecera: 'Anuladas', celda: (row: ReporteVenta) => `${row.facturasAnuladas}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: ReporteVenta) => `${row.facturasTotales}` }
  ];
  cabeceraComprobantes: string[] = this.columnasComprobantes.map(titulo => titulo.nombreColumna);

  columnasResumen: any[] = [
    { nombreColumna: 'gravado', cabecera: 'V. Gravadas', celda: (row: ReporteVenta) => `${row.total12}` },
    { nombreColumna: 'nogravado', cabecera: 'V. No Gravadas', celda: (row: ReporteVenta) => `${row.total0}` },
    { nombreColumna: 'importe', cabecera: 'Importe', celda: (row: ReporteVenta) => `${row.totalIva}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: ReporteVenta) => `${row.total}` }
  ];
  cabeceraResumen: string[] = this.columnasResumen.map(titulo => titulo.nombreColumna);

  columnasCobros: any[] = [
    { nombreColumna: 'efectivo', cabecera: 'Efectivo', celda: (row: ReporteVenta) => `${row.efectivo}` },
    { nombreColumna: 'cheque', cabecera: 'Cheque', celda: (row: ReporteVenta) => `${row.cheque}` },
    { nombreColumna: 'tarjetaCredito', cabecera: 'T. Crédito', celda: (row: ReporteVenta) => `${row.tarjetaCredito}` },
    { nombreColumna: 'tarjetaDebito', cabecera: 'T. Débito', celda: (row: ReporteVenta) => `${row.tarjetaDebito}` },
    { nombreColumna: 'deposito', cabecera: 'Deposito', celda: (row: ReporteVenta) => `${row.deposito}` },
    { nombreColumna: 'transferencia', cabecera: 'Transferencia', celda: (row: ReporteVenta) => `${row.transferencia}` },
    { nombreColumna: 'credito', cabecera: 'Crédito', celda: (row: ReporteVenta) => `${row.credito}` },
    { nombreColumna: 'totalRecaudacion', cabecera: 'Total', celda: (row: ReporteVenta) => `${row.totalRecaudacion}` }
  ];
  cabeceraCobros: string[] = this.columnasCobros.map(titulo => titulo.nombreColumna);

  dataSourceResumen: MatTableDataSource<ReporteVenta>;
  clickedRowsResumen = new Set<ReporteVenta>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private sesionService: SesionService, private router: Router, 
    private datepipe: DatePipe, private reporteVentaService: ReporteVentaService) { } 

  ngOnInit(): void {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
  }
  
  obtener(){
    let fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    let fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteVentaService.obtener(this.sesion.usuario.apodo, fechaInicio, fechaFinal, this.empresa.id).subscribe({
      next: res => {
        this.reporteVenta = res.resultado as ReporteVenta;
        this.reporteVentas.push(this.reporteVenta);
        this.dataSourceResumen = new MatTableDataSource(this.reporteVentas);
        this.llenarTablaVentaLineas(this.reporteVenta.reporteVentaLineas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaVentaLineas(reporteVentaLineas: ReporteVentaLinea[]) {
    this.dataSource = new MatTableDataSource(reporteVentaLineas);
    this.dataSource.filterPredicate = (data: ReporteVentaLinea, filter: string): boolean =>
      data.fecha.includes(filter) || data.documento.includes(filter) || data.establecimiento.includes(filter) || 
      data.estacion.includes(filter) || data.secuencia.includes(filter) || data.cliente.includes(filter) || data.identificacion.includes(filter) ||
      data.vendedor.includes(filter) || data.tipoVenta.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  pdf(event){
    let fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    let fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteVentaService.pdf(this.sesion.usuario.apodo, fechaInicio, fechaFinal, this.empresa.id);
  }

  excel(event){
    let fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    let fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteVentaService.excel(this.sesion.usuario.apodo, fechaInicio, fechaFinal, this.empresa.id);
  }
  
  seleccion(reporteVentaLinea: ReporteVentaLinea) {
    if (!this.clickedRows.has(reporteVentaLinea)){
      this.clickedRows.clear();
      this.clickedRows.add(reporteVentaLinea);
      //this.calificacionCliente = { ... calificacionCliente};
    } else {
      this.clickedRows.clear();
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
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', valores.vacio);
    this.dataSource.filter = valores.vacio;
  }

  calcularSubtotal0() {
    //return this.reporteVenta.reporteVentaLineas.map(t => Number(t.subtotal0)).reduce((acc, value) => acc + value, 0);
    return this.reporteVenta.total0;
  }
}
