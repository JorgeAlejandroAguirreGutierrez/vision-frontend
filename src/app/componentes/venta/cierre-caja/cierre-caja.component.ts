import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../comun/formato/format-date-picker';

import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Empresa } from 'src/app/modelos/usuario/empresa';
import { CierreCaja } from 'src/app/modelos/venta/cierre-caja';
import { CierreCajaService } from '../../../servicios/venta/cierre-caja.service'
import { ReporteCaja } from 'src/app/modelos/reporte/reporte-caja';
import { ReporteCajaService } from 'src/app/servicios/reporte/reporte-caja.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cierre-caja',
  templateUrl: './cierre-caja.component.html',
  styleUrls: ['./cierre-caja.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class CierreCajaComponent implements OnInit {

  abrirPanelNuevo : boolean= true;
  abrirPanelAdmin: boolean = true;

  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;

  hoy = new Date();
  fechaInicio: Date = new Date();
  fechaFinal: Date = new Date();

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  cierreCaja: CierreCaja = new CierreCaja();
  reporteCaja = new ReporteCaja();

  cierresCajas: CierreCaja[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: CierreCaja) => `${row.codigo}` },
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: CierreCaja) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}` },
    { nombreColumna: 'billetes', cabecera: 'Tot. Billetes', celda: (row: CierreCaja) => `${row.totalBilletes}` },
    { nombreColumna: 'monedas', cabecera: 'Tot. Monedas', celda: (row: CierreCaja) => `${row.totalMonedas}` },
    { nombreColumna: 'total', cabecera: 'Tot. Caja', celda: (row: CierreCaja) => `${row.totalCaja}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: CierreCaja) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<CierreCaja>;
  clickedRows = new Set<CierreCaja>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  constructor(private renderer: Renderer2, private reporteCajaService: ReporteCajaService, private sesionService: SesionService, 
    private router: Router, private cierreCajaService: CierreCajaService, private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.consultar();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.cierreCaja = new CierreCaja();
    this.clickedRows.clear();
    this.borrarFiltro();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.cierreCaja.empresa = this.empresa
    this.cierreCaja.sesion = this.sesion;
    this.cierreCajaService.crear(this.cierreCaja).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;  
    this.cierreCaja.empresa = this.empresa
    this.cierreCaja.sesion = this.sesion;
    this.cierreCajaService.actualizar(this.cierreCaja).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.cierreCajaService.activar(this.cierreCaja).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.cierreCajaService.inactivar(this.cierreCaja).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.cierreCajaService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.cierresCajas = res.resultado as CierreCaja[];
        this.llenarTabla(this.cierresCajas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(cierresCajas: CierreCaja[]) {
    this.dataSource = new MatTableDataSource(cierresCajas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(cierreCaja: CierreCaja) {
    if (!this.clickedRows.has(cierreCaja)){
      this.clickedRows.clear();
      this.clickedRows.add(cierreCaja);
      this.cierreCaja = { ... cierreCaja};
      this.cierreCaja.fecha = new Date(this.cierreCaja.fecha);
    } else {
      this.nuevo(null);
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

  calcularTotales(){
    this.cierreCaja.totalBilletes = (this.cierreCaja.billete100 * 100) + (this.cierreCaja.billete50 * 50) + (this.cierreCaja.billete20 * 20) +
      (this.cierreCaja.billete10 * 10) + (this.cierreCaja.billete5 * 5) + (this.cierreCaja.billete1 * 1);
    this.cierreCaja.totalMonedas = (this.cierreCaja.moneda100 * 1) + (this.cierreCaja.moneda50 * 0.50) + (this.cierreCaja.moneda25 * 0.25) +
      (this.cierreCaja.moneda10 * 0.10) + (this.cierreCaja.moneda5 * 0.05) + (this.cierreCaja.moneda1 * 0.01);
    this.cierreCaja.totalCaja = this.cierreCaja.totalBilletes + this.cierreCaja.totalMonedas;          
  }

  pdf(event){
    let fechaInicio = this.datepipe.transform(this.cierreCaja.fecha, "dd-MM-yyyy");
    let fechaFinal = this.datepipe.transform(this.cierreCaja.fecha, "dd-MM-yyyy");
    this.reporteCajaService.pdf(this.sesion.usuario.apodo, fechaInicio, fechaFinal, this.empresa.id,
      this.cierreCaja.billete100, this.cierreCaja.billete50, this.cierreCaja.billete20, this.cierreCaja.billete10, this.cierreCaja.billete5, 0, this.cierreCaja.billete1,
      this.cierreCaja.moneda100, this.cierreCaja.moneda50, this.cierreCaja.moneda25, this.cierreCaja.moneda10, this.cierreCaja.moneda5, this.cierreCaja.moneda1);
  }

  excel(event){
    let fechaInicio = this.datepipe.transform(this.cierreCaja.fecha, "dd-MM-yyyy");
    let fechaFinal = this.datepipe.transform(this.cierreCaja.fecha, "dd-MM-yyyy");
    this.reporteCajaService.excel(this.sesion.usuario.apodo, fechaInicio, fechaFinal, this.empresa.id,
      this.cierreCaja.billete100, this.cierreCaja.billete50, this.cierreCaja.billete20, this.cierreCaja.billete10, this.cierreCaja.billete5, 0, this.cierreCaja.billete1,
      this.cierreCaja.moneda100, this.cierreCaja.moneda50, this.cierreCaja.moneda25, this.cierreCaja.moneda10, this.cierreCaja.moneda5, this.cierreCaja.moneda1);
  }

  validarFormulario(): boolean {
    //validar que los campos esten llenos antes de guardar
    if (this.cierreCaja.fecha == null) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.cierreCaja.estado == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }
}
