import { Component, HostListener, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';

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

@Component({
  selector: 'app-nota-credito-venta',
  templateUrl: './nota-credito-venta.component.html',
  styleUrls: ['./nota-credito-venta.component.scss']
})

export class NotaCreditoVentaComponent implements OnInit {

  abrirPanelNuevoNC: boolean = true;
  abrirPanelNCLinea: boolean = false;
  abrirPanelAdmin: boolean = true;
  deshabilitarDescuento = true;
  deshabilitarDevolucion = true;

  si: string = valores.si;
  no: string = valores.no;
  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;
  estadoInternoEmitida: string = valores.estadoInternoEmitida;
  estadoInternoRecaudada: string = valores.estadoInternoRecaudada;
  estadoInternoAnulada: string = valores.estadoInternoAnulada
  estadoSriPendiente: string = valores.estadoSriPendiente;
  estadoSriAutorizada: string = valores.estadoSriAutorizada;
  estadoSriAnulada: string = valores.estadoSriAnulada;
  devolucion: string = valores.devolucion;
  descuento: string = valores.descuento;
  conjunta: string = valores.conjunta;

  hoy = new Date();
 
  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  factura: Factura = new Factura();
  notaCreditoVenta: NotaCreditoVenta = new NotaCreditoVenta();
  notaCreditoVentaLinea: NotaCreditoVentaLinea = new NotaCreditoVentaLinea();

  clienteSeleccionado: Cliente = new Cliente();
  facturaSeleccionado: Factura = new Factura();

  clientes: Cliente[] = [];
  facturas: Factura[] = [];
  notasCreditosVentas: NotaCreditoVenta[] = [];

  filtroIdentificaciones: Cliente[] = [];
  filtroClientes: Cliente[] = [];
  filtroFacturas: Factura[] = [];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaCreditoVenta) => `${row.codigo}`},
    { nombreColumna: 'comprobante', cabecera: 'Comprobante', celda: (row: NotaCreditoVenta) => `${row.numeroComprobante}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaCreditoVenta) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}`},
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: NotaCreditoVenta) => `${row.factura.cliente.razonSocial}`},
    { nombreColumna: 'factura', cabecera: 'Factura', celda: (row: NotaCreditoVenta) => `${row.factura.numeroComprobante}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaCreditoVenta) => `$ ${row.total}`},
    { nombreColumna: 'proceso', cabecera: 'Proceso', celda: (row: NotaCreditoVenta) => `${row.estadoInterno}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: NotaCreditoVenta) => `${row.estado}`},
    { nombreColumna: 'estadoSri', cabecera: 'Estado SRI', celda: (row: NotaCreditoVenta) => `${row.estadoSri}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<NotaCreditoVenta>;
  clickedRows = new Set<NotaCreditoVenta>();

  columnasLinea: any[] = [
    { nombreColumna: 'producto', cabecera: 'Producto', celda: (row: NotaCreditoVentaLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: NotaCreditoVentaLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidadventa', cabecera: 'Cant Vent', celda: (row: NotaCreditoVentaLinea) => `${row.cantidadVenta}` },
    { nombreColumna: 'cunitarioventa', cabecera: 'C.U. Vent', celda: (row: NotaCreditoVentaLinea) => `${row.costoUnitarioVenta}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant NC', celda: (row: NotaCreditoVentaLinea) => `${row.cantidad}` },
    { nombreColumna: 'costounitario', cabecera: 'C.U NC', celda: (row: NotaCreditoVentaLinea) => `${row.costoUnitario}` },
    { nombreColumna: 'impuesto', cabecera: 'IVA %', celda: (row: NotaCreditoVentaLinea) => `${row.impuesto.porcentaje} %` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: NotaCreditoVentaLinea) => `${row.subtotalLinea}` },
    { nombreColumna: 'importe', cabecera: 'Importe', celda: (row: NotaCreditoVentaLinea) => `${row.importeIvaLinea}` },
    { nombreColumna: 'totalLinea', cabecera: 'Total', celda: (row: NotaCreditoVentaLinea) => `${row.totalLinea}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
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
    if (($event.shiftKey || $event.metaKey)  && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
  }

  constructor(private renderer: Renderer2, private clienteService: ClienteService, private sesionService: SesionService, private notaCreditoElectronicaService: NotaCreditoElectronicaService, 
    private router: Router, private notaCreditoVentaService: NotaCreditoVentaService, private facturaService: FacturaService, private spinnerService: NgxSpinnerService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.notaCreditoVenta.establecimiento = this.sesion.usuario.estacion.establecimiento.codigoSRI;
    this.notaCreditoVenta.puntoVenta = this.sesion.usuario.estacion.codigoSRI;
    this.consultar();
    this.consultarClientes();
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
    this.notaCreditoVenta.establecimiento = this.sesion.usuario.estacion.establecimiento.codigoSRI;
    this.notaCreditoVenta.puntoVenta = this.sesion.usuario.estacion.codigoSRI;
    this.clienteSeleccionado = new Cliente();
    this.filtroClientes = [];
    this.facturaSeleccionado = new Factura();
    this.filtroFacturas = [];
    this.dataSourceLinea = new MatTableDataSource<NotaCreditoVentaLinea>([]);
    this.deshabilitarDescuento = true;
    this.clickedRows.clear();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;   
    this.spinnerService.show();
    this.notaCreditoVenta.sesion = this.sesion;
    this.notaCreditoVenta.empresa = this.empresa;
    this.notaCreditoVentaService.crear(this.notaCreditoVenta).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        //this.nuevo(null);
        this.spinnerService.hide();
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();   
      }
    );
  }

  crearNotaCreditoElectronica(event){
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;   
    this.spinnerService.show();   
    this.notaCreditoElectronicaService.enviar(this.notaCreditoVenta.id).subscribe({
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

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;     
    this.spinnerService.show();     
    this.notaCreditoVentaService.actualizar(this.notaCreditoVenta).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
        this.spinnerService.hide();     
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();   
      }
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
      this.datepipe.transform(data.fecha, "dd-MM-yyyy").includes(filter) || data.numeroComprobante.includes(filter) || 
      data.secuencial.includes(filter) || data.factura.cliente.razonSocial.includes(filter) || data.estado.includes(filter);
      this.dataSource.paginator = this.paginator;
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

  eliminarNotaCreditoVentaLinea(i: number){
    this.notaCreditoVenta.notaCreditoVentaLineas.splice(i, 1);
    this.calcular();
  }

  construir() {
    this.clienteSeleccionado = this.notaCreditoVenta.factura.cliente;
    this.formatearFecha();
    this.facturaSeleccionado = this.notaCreditoVenta.factura;
    this.llenarTablaNotaCreditoVentaLineas(this.notaCreditoVenta.notaCreditoVentaLineas);
    this.seleccionarOperacion();
  }

  formatearFecha(){
    let fecha = new Date(this.notaCreditoVenta.fecha);
    this.notaCreditoVenta.fecha = fecha;
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

  seleccionarIdentificacion(event) {
    let clienteId = event.option.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        this.factura.cliente = res.resultado as Cliente;
        this.consultarFacturas(clienteId);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  verIdentificacion(cliente: Cliente): string {
    return cliente && cliente.identificacion ? cliente.identificacion : valores.vacio;
  }
  filtrarIdentificaciones(event: any){
    this.filtroIdentificaciones = this.clientes.filter(cliente => cliente.identificacion.toUpperCase().includes(event));
  }

  seleccionarCliente(event) {
    let clienteId = event.option.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        this.notaCreditoVenta.factura.cliente = res.resultado as Cliente;
        this.consultarFacturas(clienteId);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  verCliente(cliente: Cliente): string {
    return cliente && cliente.razonSocial ? cliente.razonSocial : valores.vacio;
  }
  filtrarClientes(event: any){
    this.filtroClientes = this.clientes.filter(cliente => cliente.razonSocial.toUpperCase().includes(event));
  }

  consultarFacturas(clienteId: number) {
    this.facturaSeleccionado = new Factura();
    this.facturaService.consultarPorEmpresaYClienteYEstado(this.empresa.id, clienteId, valores.estadoActivo).subscribe({
      next: res => {
        this.facturas = res.resultado as Factura[]
        this.filtroFacturas = this.facturas;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  verFactura(factura: Factura): string {
    return factura && factura.numeroComprobante ? factura.numeroComprobante : valores.vacio;
  }
  filtrarFacturas(event: any){
    this.filtroFacturas = this.facturas.filter(factura => factura.numeroComprobante.toUpperCase().includes(event));
  }

  seleccionarFactura(event) {
    let facturaId = event.option.value.id;
    this.notaCreditoVentaService.obtenerPorFactura(facturaId).subscribe({
      next: res => {
        this.notaCreditoVenta= res.resultado as NotaCreditoVenta;
        this.notaCreditoVenta.establecimiento = this.sesion.usuario.estacion.establecimiento.codigoSRI;
        this.notaCreditoVenta.puntoVenta = this.sesion.usuario.estacion.codigoSRI;
        this.formatearFecha();
        this.llenarTablaNotaCreditoVentaLineas(this.notaCreditoVenta.notaCreditoVentaLineas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaNotaCreditoVentaLineas(notasCreditoVentaLineas: NotaCreditoVentaLinea[]) {
    this.dataSourceLinea = new MatTableDataSource(notasCreditoVentaLineas);
    this.dataSourceLinea.filterPredicate = (data: NotaCreditoVentaLinea, filter: string): boolean =>
      data.producto.nombre.includes(filter) || data.producto.medida.abreviatura.includes(filter) || 
      data.producto.impuesto.abreviatura.includes(filter) || data.bodega.abreviatura.includes(filter);
      this.dataSourceLinea.paginator = this.paginatorLinea;
    this.dataSourceLinea.sort = this.sortLinea;
  }


  seleccionarOperacion(){
    if (this.notaCreditoVenta.operacion == valores.devolucion) {
      this.notaCreditoVenta.descuento = valores.cero;
      this.deshabilitarDescuento = true;
      if (this.notaCreditoVenta.id == valores.cero){
        for (let i=0; i < this.notaCreditoVenta.notaCreditoVentaLineas.length; i++){
          this.notaCreditoVenta.notaCreditoVentaLineas[i].cantidad = valores.cero;
        }
      }
    }
    if (this.notaCreditoVenta.operacion == valores.descuento) {
      this.deshabilitarDescuento = false;
      if (this.notaCreditoVenta.id == valores.cero){
        for (let i=0; i < this.notaCreditoVenta.notaCreditoVentaLineas.length; i++){
          //this.notaCreditoVenta.notaCreditoVentaLineas[i].cantidad = this.notaCreditoVenta.notaCreditoVentaLineas[i].cantidadVenta;
        }
      }
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
    this.spinnerService.show();  
    this.notaCreditoVentaService.calcular(this.notaCreditoVenta).subscribe({
      next: res => {
        this.notaCreditoVenta = res.resultado as NotaCreditoVenta;
        this.formatearFecha();
        this.llenarTablaNotaCreditoVentaLineas(this.notaCreditoVenta.notaCreditoVentaLineas);
        this.spinnerService.hide();
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();
      }
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

  //VALIDACIONES
  validarFormulario(): boolean {
    if (this.notaCreditoVenta.fecha == null ){ //|| this.notaCreditoCompra.fecha > this.hoy
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.notaCreditoVenta.factura.id == valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.notaCreditoVenta.operacion == valores.vacio){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }  
}
