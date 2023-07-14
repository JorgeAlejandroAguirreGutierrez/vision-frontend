import { Component, HostListener, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';
import { map, startWith, Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../comun/formato/format-date-picker';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { Cliente } from 'src/app/modelos/cliente/cliente';
import { ClienteService } from 'src/app/servicios/cliente/cliente.service';
import { Factura } from 'src/app/modelos/venta/factura';
import { FacturaService } from 'src/app/servicios/venta/factura.service';
import { NotaCreditoVenta } from 'src/app/modelos/venta/nota-credito-venta';
import { NotaCreditoVentaService } from 'src/app/servicios/venta/nota-credito-venta.service';
import { NotaCreditoVentaLinea } from 'src/app/modelos/venta/nota-credito-venta-linea';
import { NotaCreditoElectronicaService } from 'src/app/servicios/venta/nota-credito-eletronica.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-nota-credito-venta',
  templateUrl: './nota-credito-venta.component.html',
  styleUrls: ['./nota-credito-venta.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class NotaCreditoVentaComponent implements OnInit {

  estadoActivo = valores.estadoActivo;
  estadoInactivo = valores.estadoInactivo;
  estadoInternoEmitida = valores.estadoInternoEmitida;
  estadoInternoRecaudada = valores.estadoInternoRecaudada;
  estadoInternoAnulada = valores.estadoInternoAnulada
  estadoSriPendiente = valores.estadoSriPendiente;
  estadoSriAutorizada = valores.estadoSriAutorizada;
  estadoSriAnulada = valores.estadoSriAnulada;
  si = valores.si;
  no = valores.no;
  devolucion = valores.devolucion;
  descuento = valores.descuento;
  conjunta = valores.conjunta;

  panelOpenState = false;
  cargar = false;
  deshabilitarDevolucion = true;
  deshabilitarDescuento = true;
  abrirPanelAdmin = false;

  hoy = new Date();
 
  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  notaCreditoVenta: NotaCreditoVenta = new NotaCreditoVenta();
  notaCreditoVentaLinea: NotaCreditoVentaLinea = new NotaCreditoVentaLinea();

  clientes: Cliente[] = [];
  facturas: Factura[] = [];
  notasCreditosVentas: NotaCreditoVenta[] = [];


  seleccionCliente = new UntypedFormControl();
  filtroClientes: Observable<Cliente[]> = new Observable<Cliente[]>();

  seleccionFactura = new UntypedFormControl();
  filtroFacturas: Observable<Factura[]> = new Observable<Factura[]>();

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaCreditoVenta) => `${row.codigo}`},
    { nombreColumna: 'serie', cabecera: 'Serie', celda: (row: NotaCreditoVenta) => `${row.serie}`},
    { nombreColumna: 'secuencial', cabecera: 'Secuencial', celda: (row: NotaCreditoVenta) => `${row.secuencial}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaCreditoVenta) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}`},
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: NotaCreditoVenta) => `${row.factura.cliente.razonSocial}`},
    { nombreColumna: 'factura', cabecera: 'Factura', celda: (row: NotaCreditoVenta) => `${row.factura.secuencial}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaCreditoVenta) => `$ ${row.totalConDescuento}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: NotaCreditoVenta) => `${row.estado}`},
    { nombreColumna: 'estadoInterno', cabecera: 'Estado Interno', celda: (row: NotaCreditoVenta) => `${row.estadoInterno}`},
    { nombreColumna: 'estadoSri', cabecera: 'Estado SRI', celda: (row: NotaCreditoVenta) => `${row.estadoSri}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<NotaCreditoVenta>;
  clickedRows = new Set<NotaCreditoVenta>();

  columnasLinea: any[] = [
    { nombreColumna: 'producto', cabecera: 'Producto', celda: (row: NotaCreditoVentaLinea) => `${row.producto.nombre}`},
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: NotaCreditoVentaLinea) => `${row.producto.medida.abreviatura}`},
    { nombreColumna: 'cantidad', cabecera: 'Cantidad', celda: (row: NotaCreditoVentaLinea) => `${row.cantidad}`},
    { nombreColumna: 'devolucion', cabecera: 'Devolución', celda: (row: NotaCreditoVentaLinea) => `${row.devolucion}`},
    { nombreColumna: 'unitario', cabecera: 'Costo U.', celda: (row: NotaCreditoVentaLinea) => `$ ${row.costoUnitario}`},
    { nombreColumna: 'descuento', cabecera: 'Descuento', celda: (row: NotaCreditoVentaLinea) => `${row.valorDescuentoLinea}`},
    { nombreColumna: 'porcdescuento', cabecera: 'Descuento %', celda: (row: NotaCreditoVentaLinea) => `${row.porcentajeDescuentoLinea}`},
    { nombreColumna: 'impuesto', cabecera: 'IVA', celda: (row: NotaCreditoVentaLinea) => `$ ${row.producto.impuesto.porcentaje}`},
    { nombreColumna: 'bodega', cabecera: 'Bodega', celda: (row: NotaCreditoVentaLinea) => `${row.bodega.nombre}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaCreditoVentaLinea) => `$ ${row.totalSinDescuentoLinea}`}
  ];
  cabeceraLinea: string[]  = this.columnasLinea.map(titulo => titulo.nombreColumna);
  dataSourceLinea: MatTableDataSource<NotaCreditoVentaLinea>;
  clickedRowsLinea = new Set<NotaCreditoVentaLinea>();
  
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

  constructor(private renderer: Renderer2, private clienteService: ClienteService, private sesionService: SesionService, private notaCreditoElectronicaService: NotaCreditoElectronicaService, private dateAdapter: DateAdapter<Date>,
    private router: Router, private notaCreditoVentaService: NotaCreditoVentaService, private facturaService: FacturaService, private spinnerService: NgxSpinnerService, private datepipe: DatePipe) { this.dateAdapter.setLocale('en-GB') }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.consultar();
    this.consultarClientes();
    this.inicializarFiltros();
  }

  consultar() {
    this.notaCreditoVentaService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.notasCreditosVentas = res.resultado as NotaCreditoVenta[]
        this.llenarTablaNotaCreditoVenta(this.notasCreditosVentas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaNotaCreditoVenta(notasCreditosVentas: NotaCreditoVenta[]) {
    this.dataSource = new MatTableDataSource(notasCreditosVentas);
    this.dataSource.filterPredicate = (data: NotaCreditoVenta, filter: string): boolean =>
      this.datepipe.transform(data.fecha, "dd-MM-yyyy").includes(filter) || data.serie.includes(filter) || 
      data.secuencial.includes(filter) || data.factura.cliente.razonSocial.includes(filter) || data.estado.includes(filter);
      this.dataSource.paginator = this.paginator;
  }

  consultarClientes(){
    this.clienteService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.clientes = res.resultado as Cliente[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.notaCreditoVenta = new NotaCreditoVenta();
    this.seleccionCliente.patchValue(valores.vacio);
    this.seleccionFactura.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<NotaCreditoVentaLinea>([]);
    this.clickedRows.clear();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.notaCreditoVenta.sesion = this.sesion;
    this.notaCreditoVenta.empresa = this.empresa;
    this.notaCreditoVentaService.crear(this.notaCreditoVenta).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  crearNotaCreditoElectronica(event){
    this.cargar = true;
    if (event != null)
      event.preventDefault();
    this.notaCreditoElectronicaService.enviar(this.notaCreditoVenta.id).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
        this.cargar = false;
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.cargar = false;
      }
    );
  }

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    this.notaCreditoVentaService.actualizar(this.notaCreditoVenta).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);        
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.notaCreditoVentaService.activar(this.notaCreditoVenta).subscribe({
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
    this.notaCreditoVentaService.inactivar(this.notaCreditoVenta).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccion(notaCreditoVenta: any) {
    if (!this.clickedRows.has(notaCreditoVenta)){
      this.clickedRows.clear();
      this.clickedRows.add(notaCreditoVenta);
      this.obtenerNotaCreditoVenta(notaCreditoVenta.id);
    } else {
      this.nuevo(null);
    }
  }

  obtenerNotaCreditoVenta(id: number){
    this.notaCreditoVentaService.obtener(id).subscribe({
      next: res => {
        this.notaCreditoVenta = res.resultado as NotaCreditoVenta;
        this.construir();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  construir() {
    let fecha = new Date(this.notaCreditoVenta.fecha);
    this.notaCreditoVenta.fecha = fecha;
    this.seleccionCliente.patchValue(this.notaCreditoVenta.factura.cliente);
    this.seleccionFactura.patchValue(this.notaCreditoVenta.factura);
    this.dataSourceLinea = new MatTableDataSource<NotaCreditoVentaLinea>(this.notaCreditoVenta.notaCreditoVentaLineas);
    this.dataSourceLinea.paginator = this.paginatorLinea;
  }
  
  filtroNotaCreditoVenta(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  borrarFiltroNotaCreditoVenta() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSource.filter = '';
  }

  seleccionarCliente() {
    let clienteId = this.seleccionCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe(
      res => {
        this.notaCreditoVenta.factura.cliente = res.resultado as Cliente;
        this.seleccionCliente.patchValue(this.notaCreditoVenta.factura.cliente);
        this.facturaService.consultarPorClienteYEstadoYEstadoInterno(this.notaCreditoVenta.factura.cliente.id, this.estadoActivo, this.estadoInternoRecaudada).subscribe(
          res => {
            this.facturas = res.resultado as Factura[]
          },
          err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        );
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  obtenerPorFactura() {
    let facturaId = this.seleccionFactura.value.id;
    this.notaCreditoVentaService.obtenerPorFactura(facturaId).subscribe({
      next: res => {
        this.notaCreditoVenta = res.resultado as NotaCreditoVenta;
        this.construir();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarOperacion(){
    for(let notaCreditoVentaLinea of this.notaCreditoVenta.notaCreditoVentaLineas){
      notaCreditoVentaLinea.devolucion = valores.cero;
      notaCreditoVentaLinea.porcentajeDescuentoLinea = valores.cero;
      notaCreditoVentaLinea.valorDescuentoLinea = valores.cero;
    }
    if(this.notaCreditoVenta.operacion == valores.devolucion){
      this.deshabilitarDevolucion = false;
      this.deshabilitarDescuento = true;
    }
    if(this.notaCreditoVenta.operacion == valores.descuento){
      this.deshabilitarDevolucion = true;
      this.deshabilitarDescuento = false;
    }
    if(this.notaCreditoVenta.operacion == valores.conjunta){
      this.deshabilitarDevolucion = false;
      this.deshabilitarDescuento = false;
    }
  }

  seleccionarDevolucion(i: number, devolucion: number) {
    this.calcular();
  }
  
  seleccionarValorDescuentoLinea(i: number, valorDescuentoLinea: number) {
    this.calcular();
  }

  seleccionarPorcentajeDescuentoLinea(i: number, valorPorcentajeDescuentoLinea: number) {
    this.calcular();
  }

  calcular(){
    this.notaCreditoVentaService.calcular(this.notaCreditoVenta).subscribe({
      next: res => {
        this.notaCreditoVenta = res.resultado as NotaCreditoVenta;
        this.construir();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarValorDescuentoTotal(){
    this.calcular(); 
  }
  seleccionarPorcentajeDescuentoTotal(){
    this.calcular();   
  }

  obtenerPDF(event){
    if (event != null)
      event.preventDefault();
    this.notaCreditoElectronicaService.obtenerPDF(this.notaCreditoVenta.id);
  }
  
  enviarPDFYXML(event){
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();
    this.notaCreditoElectronicaService.enviarPDFYXML(this.notaCreditoVenta.id).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.spinnerService.hide();  
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();  
      }
    });
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  //FILTROS AUTOCOMPLETE
  inicializarFiltros(){
    this.filtroClientes = this.seleccionCliente.valueChanges
    .pipe(
      startWith(valores.vacio),
      map(value => typeof value === 'string' || value==null ? value : value.id),
      map(cliente => typeof cliente === 'string' ? this.filtroCliente(cliente) : this.clientes.slice())
    );
    this.filtroFacturas = this.seleccionFactura.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(factura => typeof factura === 'string' ? this.filtroFactura(factura) : this.facturas.slice())
      );
  }

  private filtroCliente(value: string): Cliente[] {
    if(this.clientes.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.clientes.filter(cliente => cliente.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verCliente(cliente: Cliente): string {
    return cliente && cliente.razonSocial ? cliente.razonSocial : valores.vacio;
  }

  private filtroFactura(value: string): Factura[] {
    if(this.facturas.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.facturas.filter(factura => factura.secuencial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verFactura(factura: Factura): string {
    return factura && factura.secuencial ? factura.secuencial : valores.vacio;
  }
}
