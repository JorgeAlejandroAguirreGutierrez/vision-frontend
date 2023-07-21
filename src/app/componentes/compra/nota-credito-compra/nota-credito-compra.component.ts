import { Component, OnInit, ViewChild, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { valores, validarSesion, mensajes, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../comun/formato/format-date-picker';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { Proveedor } from '../../../modelos/compra/proveedor';
import { ProveedorService } from '../../../servicios/compra/proveedor.service';
import { NotaCreditoCompra } from '../../../modelos/compra/nota-credito-compra';
import { NotaCreditoCompraService } from '../../../servicios/compra/nota-credito-compra.service';
import { NotaCreditoCompraLinea } from '../../../modelos/compra/nota-credito-compra-linea';
import { FacturaCompra } from '../../../modelos/compra/factura-compra';
import { FacturaCompraService } from '../../../servicios/compra/factura-compra.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-nota-credito-compra',
  templateUrl: './nota-credito-compra.component.html',
  styleUrls: ['./nota-credito-compra.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class NotaCreditoCompraComponent implements OnInit {

  abrirPanelNuevoNC: boolean = true;
  abrirPanelNCLinea: boolean = false;
  abrirPanelAdmin: boolean = true;
  deshabilitarDescuento = true;


  si: string = valores.si;
  no: string = valores.no;
  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;
  estadoInternoPorPagar: string = valores.estadoInternoPorPagar;
  estadoInternoPagada: string = valores.estadoInternoPagada;
  devolucion: string = valores.devolucion;
  descuento: string = valores.descuento;
  conjunta: string = valores.conjunta;

  hoy = new Date();

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  facturaCompra: FacturaCompra = new FacturaCompra();
  notaCreditoCompra: NotaCreditoCompra = new NotaCreditoCompra();
  notaCreditoCompraLinea: NotaCreditoCompraLinea = new NotaCreditoCompraLinea();

  proveedorSeleccionado: Proveedor = new Proveedor();
  facturaCompraSeleccionado: FacturaCompra = new FacturaCompra();

  filtroIdentificaciones: Proveedor[] = [];
  filtroProveedores: Proveedor[] = [];
  filtroFacturaCompras: FacturaCompra[] = [];

  proveedores: Proveedor[] = [];
  notasCreditosCompras: NotaCreditoCompra[] = [];
  facturasCompras: FacturaCompra[] = [];


  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaCreditoCompra) => `${row.codigo}` },
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaCreditoCompra) => `${this.datepipe.transform(row.fecha, valores.fechaCorta)}` },
    { nombreColumna: 'comprobante', cabecera: 'Comprobante', celda: (row: NotaCreditoCompra) => `${row.numeroComprobante}` },
    { nombreColumna: 'proveedor', cabecera: 'Proveedor', celda: (row: NotaCreditoCompra) => `${row.facturaCompra.proveedor.nombreComercial}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaCreditoCompra) => `$ ${row.total}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: NotaCreditoCompra) => `${row.estado}` },
    { nombreColumna: 'estadoInterno', cabecera: 'Estado Interno', celda: (row: NotaCreditoCompra) => `${row.estadoInterno}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<NotaCreditoCompra>;
  clickedRows = new Set<NotaCreditoCompra>();

  columnasLinea: any[] = [
    { nombreColumna: 'producto', cabecera: 'Producto', celda: (row: NotaCreditoCompraLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: NotaCreditoCompraLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidadcompra', cabecera: 'Cant Comp', celda: (row: NotaCreditoCompraLinea) => `${row.cantidadCompra}` },
    { nombreColumna: 'cunitariocompra', cabecera: 'C.U. Comp', celda: (row: NotaCreditoCompraLinea) => `${row.costoUnitarioCompra}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant NC', celda: (row: NotaCreditoCompraLinea) => `${row.cantidad}` },
    { nombreColumna: 'costounitario', cabecera: 'C.U NC', celda: (row: NotaCreditoCompraLinea) => `${row.costoUnitario}` },
    { nombreColumna: 'impuesto', cabecera: 'IVA %', celda: (row: NotaCreditoCompraLinea) => `${row.impuesto.porcentaje} %` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: NotaCreditoCompraLinea) => `${row.subtotalLinea}` },
    { nombreColumna: 'importe', cabecera: 'Importe', celda: (row: NotaCreditoCompraLinea) => `${row.importeIvaLinea}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaCreditoCompraLinea) => `${row.totalLinea}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabeceraLinea: string[] = this.columnasLinea.map(titulo => titulo.nombreColumna);
  dataSourceLinea: MatTableDataSource<NotaCreditoCompraLinea>;
  clickedRowsLinea = new Set<NotaCreditoCompra>();

  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;
  @ViewChild('matSort') sort: MatSort;
  @ViewChild('matSortLinea') sortLinea: MatSort;
  @ViewChild('inputFiltro') inputFiltro: ElementRef;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
  }

  constructor(private renderer: Renderer2, private proveedorService: ProveedorService, private sesionService: SesionService, private datepipe: DatePipe,
    private router: Router, private notaCreditoCompraService: NotaCreditoCompraService, private facturaCompraService: FacturaCompraService,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.notaCreditoCompra.operacion = this.devolucion;
    this.consultar();
    this.consultarProveedores();
  }

  consultarProveedores() {
    this.proveedorService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.proveedores = res.resultado as Proveedor[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.notaCreditoCompra = new NotaCreditoCompra();
    this.proveedorSeleccionado = new Proveedor();
    this.facturaCompraSeleccionado = new FacturaCompra();
    this.dataSourceLinea = new MatTableDataSource<NotaCreditoCompraLinea>([]);
    this.deshabilitarDescuento = true;
    this.clickedRows.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return; 
    this.spinnerService.show();   
    this.notaCreditoCompra.sesion = this.sesion;
    this.notaCreditoCompra.empresa = this.empresa;
    this.notaCreditoCompra.numeroComprobante = this.notaCreditoCompra.establecimiento + valores.guion + this.notaCreditoCompra.puntoVenta + valores.guion + this.notaCreditoCompra.secuencial;
    this.notaCreditoCompraService.crear(this.notaCreditoCompra).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
        this.spinnerService.hide();  
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();
      }  
    });
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return; 
    this.notaCreditoCompraService.actualizar(this.notaCreditoCompra).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.notaCreditoCompraService.activar(this.notaCreditoCompra).subscribe({
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
    this.notaCreditoCompraService.inactivar(this.notaCreditoCompra).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.notaCreditoCompraService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.notasCreditosCompras = res.resultado as NotaCreditoCompra[]
        this.llenarTablaNotaCreditoCompra(this.notasCreditosCompras);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaNotaCreditoCompra(notasCreditosCompras: NotaCreditoCompra[]) {
    this.dataSource = new MatTableDataSource(notasCreditosCompras);
    this.dataSource.filterPredicate = (data: NotaCreditoCompra, filter: string): boolean =>
      this.datepipe.transform(data.fecha, valores.fechaCorta).includes(filter) || data.numeroComprobante.includes(filter) || data.secuencial.includes(filter) || 
      data.facturaCompra.proveedor.razonSocial.includes(filter) || data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(notaCreditoCompra: any) {
    if (!this.clickedRows.has(notaCreditoCompra)) {
      this.clickedRows.clear();
      this.clickedRows.add(notaCreditoCompra);
      this.obtenerNotaCredito(notaCreditoCompra);
    } else {
      this.nuevo(null);
    }
  }

  obtenerNotaCredito(notaCreditoCompra: NotaCreditoCompra){
    this.notaCreditoCompraService.obtener(notaCreditoCompra.id).subscribe({
      next: res => {
        this.notaCreditoCompra = res.resultado as NotaCreditoCompra;
        this.construir();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminarNotaCreditoCompraLinea(i: number){
    this.notaCreditoCompra.notaCreditoCompraLineas.splice(i, 1);
    this.calcular();
  }

  construir() {
    this.proveedorSeleccionado = this.notaCreditoCompra.facturaCompra.proveedor;
    this.formatearFecha();
    this.facturaCompraSeleccionado = this.notaCreditoCompra.facturaCompra;
    this.llenarTablaNotaCreditoCompraLineas(this.notaCreditoCompra.notaCreditoCompraLineas);
    this.seleccionarOperacion();
  }

  formatearFecha(){
    let fecha = new Date(this.notaCreditoCompra.fecha);
    this.notaCreditoCompra.fecha = fecha;
  }

  filtroNotaCreditoCompra(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  borrarFiltroNotaCreditoCompra() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSource.filter = '';
  }

  seleccionarIdentificacion(event) {
    let proveedorId = event.option.value.id;
    this.proveedorService.obtener(proveedorId).subscribe({
      next: res => {
        this.facturaCompra.proveedor = res.resultado as Proveedor;
        this.consultarFacturasCompras(proveedorId);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  verIdentificacion(proveedor: Proveedor): string {
    return proveedor && proveedor.identificacion ? proveedor.identificacion : valores.vacio;
  }
  filtrarIdentificaciones(event: any){
    this.filtroIdentificaciones = this.proveedores.filter(proveedor => proveedor.identificacion.toUpperCase().includes(event));
  }

  seleccionarProveedor(event) {
    let proveedorId = event.option.value.id;
    this.proveedorService.obtener(proveedorId).subscribe({
      next: res => {
        this.facturaCompra.proveedor = res.resultado as Proveedor;
        this.consultarFacturasCompras(proveedorId);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  verProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.nombreComercial ? proveedor.nombreComercial : valores.vacio;
  }
  filtrarProveedores(event: any){
    this.filtroProveedores = this.proveedores.filter(proveedor => proveedor.nombreComercial.toUpperCase().includes(event));
  }
  borrarProveedor(){
    this.proveedorSeleccionado = new Proveedor();
    this.filtroProveedores = [];
  }

  consultarFacturasCompras(proveedorId: number) {
    this.facturaCompraSeleccionado = new FacturaCompra();
    this.facturaCompraService.consultarPorProveedorYEmpresaYEstadoInternoYEstado(proveedorId, this.empresa.id, valores.estadoInternoPagada, valores.estadoActivo).subscribe({
      next: res => {
        this.facturasCompras = res.resultado as FacturaCompra[]
        this.filtroFacturaCompras = this.facturasCompras;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  verFacturaCompra(facturaCompra: FacturaCompra): string {
    return facturaCompra && facturaCompra.numeroComprobante ? facturaCompra.numeroComprobante : valores.vacio;
  }
  filtrarFacturasCompras(event: any){
    this.filtroFacturaCompras = this.facturasCompras.filter(facturaCompra => facturaCompra.numeroComprobante.toUpperCase().includes(event));
  }

  seleccionarFacturaCompra(event) {
    let facturaCompraId = event.option.value.id;
    this.notaCreditoCompraService.obtenerPorFacturaCompra(facturaCompraId).subscribe({
      next: res => {
        this.notaCreditoCompra = res.resultado as NotaCreditoCompra;
        this.formatearFecha();
        this.llenarTablaNotaCreditoCompraLineas(this.notaCreditoCompra.notaCreditoCompraLineas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaNotaCreditoCompraLineas(notasCreditoComprasLineas: NotaCreditoCompraLinea[]) {
    this.dataSourceLinea = new MatTableDataSource(notasCreditoComprasLineas);
    this.dataSourceLinea.filterPredicate = (data: NotaCreditoCompraLinea, filter: string): boolean =>
      data.producto.nombre.includes(filter) || data.producto.medida.abreviatura.includes(filter) || 
      data.producto.impuesto.abreviatura.includes(filter) || data.bodega.abreviatura.includes(filter);
      this.dataSourceLinea.paginator = this.paginatorLinea;
    this.dataSourceLinea.sort = this.sortLinea;
  }

  seleccionarOperacion() {
    if (this.notaCreditoCompra.operacion == valores.devolucion) {
      this.notaCreditoCompra.descuento = valores.cero;
      this.deshabilitarDescuento = true;
      if (this.notaCreditoCompra.id == valores.cero){
        for (let i=0; i < this.notaCreditoCompra.notaCreditoCompraLineas.length; i++){
          this.notaCreditoCompra.notaCreditoCompraLineas[i].cantidad = valores.cero;
        }
      }
    }
    if (this.notaCreditoCompra.operacion == valores.descuento) {
      this.deshabilitarDescuento = false;
      if (this.notaCreditoCompra.id == valores.cero){
        for (let i=0; i < this.notaCreditoCompra.notaCreditoCompraLineas.length; i++){
          this.notaCreditoCompra.notaCreditoCompraLineas[i].cantidad = this.notaCreditoCompra.notaCreditoCompraLineas[i].cantidadCompra;
        }
      }
    }
  }

  rellenarNumeroEstablecimiento() {
    this.notaCreditoCompra.establecimiento = this.pad(this.notaCreditoCompra.establecimiento, 3);
  }

  rellenarNumeroPuntoVenta() {
    this.notaCreditoCompra.puntoVenta = this.pad(this.notaCreditoCompra.puntoVenta, 3);
  }

  rellenarNumeroSecuencial() {
    this.notaCreditoCompra.secuencial = this.pad(this.notaCreditoCompra.secuencial, 9);
  }

  private pad(numero: string, size: number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  // CALCULOS
  calcular() {
    this.spinnerService.show();  
    this.notaCreditoCompraService.calcular(this.notaCreditoCompra).subscribe({
      next: res => {
        this.notaCreditoCompra = res.resultado as NotaCreditoCompra;
        this.formatearFecha();
        this.llenarTablaNotaCreditoCompraLineas(this.notaCreditoCompra.notaCreditoCompraLineas);
        this.spinnerService.hide();
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();
      }
    });
    
  }

  //VALIDACIONES
  validarFormulario(): boolean {
    if (this.notaCreditoCompra.fecha == null ){ //|| this.notaCreditoCompra.fecha > this.hoy
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.notaCreditoCompra.facturaCompra.id == valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.notaCreditoCompra.establecimiento == valores.vacio || this.notaCreditoCompra.puntoVenta == valores.vacio ||
      this.notaCreditoCompra.secuencial == valores.vacio){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.notaCreditoCompra.operacion == valores.vacio){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }  
}
