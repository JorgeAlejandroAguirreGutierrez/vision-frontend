import { Component, HostListener, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
import { NotaCredito } from 'src/app/modelos/venta/nota-credito';
import { NotaCreditoService } from 'src/app/servicios/venta/nota-credito.service';
import { NotaCreditoLinea } from 'src/app/modelos/venta/nota-credito-linea';
import { NotaCreditoElectronicaService } from 'src/app/servicios/venta/nota-credito-eletronica.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, startWith } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-nota-credito',
  templateUrl: './nota-credito.component.html',
  styleUrls: ['./nota-credito.component.scss']
})

export class NotaCreditoComponent implements OnInit {

  abrirPanelNuevoNC: boolean = true;
  abrirPanelNCLinea: boolean = false;
  abrirPanelAdmin: boolean = true;
  deshabilitarDescuento = true;

  si: string = valores.si;
  no: string = valores.no;
  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;
  estadoEmitida: string = valores.estadoEmitida;
  estadoRecaudada: string = valores.estadoRecaudada;
  estadoAnulada: string = valores.estadoAnulada
  procesoSRIPendiente: string = valores.procesoSRIPendiente;
  procesoSRIAutorizada: string = valores.procesoSRIAutorizada;
  procesoSRIAnulada: string = valores.procesoSRIAnulada;
  devolucion: string = valores.devolucion;
  descuento: string = valores.descuento;
  conjunta: string = valores.conjunta;

  hoy: Date = new Date();
  fechaMinima: Date = new Date();
 
  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  factura: Factura = new Factura();
  notaCredito: NotaCredito = new NotaCredito();
  notaCreditoLinea: NotaCreditoLinea = new NotaCreditoLinea();

  clientes: Cliente[] = [];
  facturas: Factura[] = [];
  notasCreditos: NotaCredito[] = [];

  controlIdentificacionCliente = new UntypedFormControl();
  controlRazonSocialCliente = new UntypedFormControl();
  controlFactura = new UntypedFormControl();
  filtroIdentificacionClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  filtroRazonSocialClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  filtroFacturas: Observable<Factura[]> = new Observable<Factura[]>();

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaCredito) => `${row.codigo}`},
    { nombreColumna: 'comprobante', cabecera: 'Comprobante', celda: (row: NotaCredito) => `${row.numeroComprobante}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaCredito) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}`},
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: NotaCredito) => `${row.factura.cliente.razonSocial}`},
    { nombreColumna: 'factura', cabecera: 'Factura', celda: (row: NotaCredito) => `${row.factura.numeroComprobante}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaCredito) => `$${row.total}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: NotaCredito) => `${row.estado}`},
    { nombreColumna: 'procesoSRI', cabecera: 'Proceso SRI', celda: (row: NotaCredito) => `${row.procesoSRI}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<NotaCredito>;
  clickedRows = new Set<NotaCredito>();

  columnasLinea: any[] = [
    { nombreColumna: 'producto', cabecera: 'Producto', celda: (row: NotaCreditoLinea) => `${row.nombreProducto}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: NotaCreditoLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidadventa', cabecera: 'Cant Vent', celda: (row: NotaCreditoLinea) => `${row.cantidadVenta}` },
    { nombreColumna: 'cunitarioventa', cabecera: 'C.U. Vent', celda: (row: NotaCreditoLinea) => `${row.costoUnitarioVenta}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant NC', celda: (row: NotaCreditoLinea) => `${row.cantidad}` },
    { nombreColumna: 'costounitario', cabecera: 'C.U NC', celda: (row: NotaCreditoLinea) => `$${row.costoUnitario}` },
    { nombreColumna: 'impuesto', cabecera: 'IVA %', celda: (row: NotaCreditoLinea) => `${row.impuesto.porcentaje}%` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: NotaCreditoLinea) => `$${row.subtotalLinea}` },
    { nombreColumna: 'importe', cabecera: 'Importe', celda: (row: NotaCreditoLinea) => `$${row.importeIvaLinea}` },
    { nombreColumna: 'totalLinea', cabecera: 'Total', celda: (row: NotaCreditoLinea) => `$${row.totalLinea}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabeceraLinea: string[]  = this.columnasLinea.map(titulo => titulo.nombreColumna);
  dataSourceLinea: MatTableDataSource<NotaCreditoLinea>;
  clickedRowsLinea = new Set<NotaCreditoLinea>();
  
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
    private router: Router, private notaCreditoService: NotaCreditoService, private facturaService: FacturaService, private spinnerService: NgxSpinnerService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.fechaMinima = new Date(this.fechaMinima.setDate(this.hoy.getDate() - 3))
    this.notaCredito.establecimiento = this.sesion.usuario.estacion.establecimiento.codigoSRI;
    this.notaCredito.puntoVenta = this.sesion.usuario.estacion.codigoSRI;
    this.notaCredito.fecha = this.hoy;
    this.consultar();
    this.consultarClientes();
    this.inicializarFiltros();
  }

  //FILTROS AUTOCOMPLETE
  inicializarFiltros() {
    this.filtroIdentificacionClientes = this.controlIdentificacionCliente.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(identificacion => typeof identificacion === 'string' ? this.filtroIdentificacionCliente(identificacion) : this.clientes.slice())
      );
    this.filtroRazonSocialClientes = this.controlRazonSocialCliente.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(razon_social => typeof razon_social === 'string' ? this.filtroRazonSocialCliente(razon_social) : this.clientes.slice())
      );
    this.filtroFacturas = this.controlFactura.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(secuencial => typeof secuencial === 'string' ? this.filtroFactura(secuencial) : this.facturas.slice())
      );
  }

  private filtroIdentificacionCliente(value: string): Cliente[] {
    if (this.clientes.length > valores.cero) {
      const filterValue = value.toUpperCase();
      return this.clientes.filter(cliente => cliente.identificacion.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verIdentificacionCliente(cliente: Cliente): string {
    return cliente && cliente.identificacion ? cliente.identificacion : valores.vacio;
  }
  private filtroRazonSocialCliente(value: string): Cliente[] {
    if (this.clientes.length > valores.cero) {
      const filterValue = value.toUpperCase();
      return this.clientes.filter(cliente => cliente.razonSocial.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verRazonSocialCliente(cliente: Cliente): string {
    return cliente && cliente.razonSocial ? cliente.razonSocial : valores.vacio;
  }
  private filtroFactura(value: string): Factura[] {
    if (this.facturas.length > valores.cero) {
      const filterValue = value.toUpperCase();
      return this.facturas.filter(factura => factura.numeroComprobante.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verFactura(factura: Factura): string {
    return factura && factura.numeroComprobante ? factura.numeroComprobante : valores.vacio;
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
      if (event!=null)
      event.preventDefault();
    this.notaCredito = new NotaCredito();
    this.hoy = new Date();
    this.notaCredito.fecha = this.hoy;
    this.notaCredito.establecimiento = this.sesion.usuario.estacion.establecimiento.codigoSRI;
    this.notaCredito.puntoVenta = this.sesion.usuario.estacion.codigoSRI;
    this.controlIdentificacionCliente.patchValue(valores.vacio);
    this.controlRazonSocialCliente.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<NotaCreditoLinea>([]);
    this.clickedRows.clear();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;   
    this.spinnerService.show();
    this.notaCredito.usuario = this.sesion.usuario;
    this.notaCredito.empresa = this.empresa;
    this.notaCreditoService.crear(this.notaCredito).subscribe(
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

  crearNotaCreditoElectronica(event){
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;   
    this.spinnerService.show();   
    this.notaCreditoElectronicaService.enviar(this.notaCredito.id).subscribe({
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
    this.notaCreditoService.actualizar(this.notaCredito).subscribe(
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

  anular(event) {
    if (event != null)
      event.preventDefault();
    this.notaCreditoService.anular(this.notaCredito).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.notaCreditoService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.notasCreditos = res.resultado as NotaCredito[]
        this.llenarTablaNotaCreditoVenta(this.notasCreditos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaNotaCreditoVenta(notasCreditos: NotaCredito[]) {
    this.dataSource = new MatTableDataSource(notasCreditos);
    this.dataSource.filterPredicate = (data: NotaCredito, filter: string): boolean =>
      this.datepipe.transform(data.fecha, "dd-MM-yyyy").includes(filter) || data.numeroComprobante.includes(filter) || 
      data.secuencial.includes(filter) || data.factura.cliente.razonSocial.includes(filter) || 
      data.estado.includes(filter) || data.procesoSRI.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccionar(notaCreditoVenta: any) {
    if (!this.clickedRows.has(notaCreditoVenta)){
      this.clickedRows.clear();
      this.clickedRows.add(notaCreditoVenta);
      this.obtenerNotaCreditoVenta(notaCreditoVenta.id);
    } else {
      this.nuevo(null);
    }
  }

  obtenerNotaCreditoVenta(id: number){
    this.notaCreditoService.obtener(id).subscribe({
      next: res => {
        this.notaCredito = res.resultado as NotaCredito;
        this.construir();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminarNotaCreditoVentaLinea(i: number){
    this.notaCredito.notaCreditoLineas.splice(i, 1);
    this.calcular();
  }

  construir() {
    this.controlIdentificacionCliente.patchValue(this.notaCredito.factura.cliente);
    this.controlRazonSocialCliente.patchValue(this.notaCredito.factura.cliente);
    this.controlFactura.patchValue(this.notaCredito.factura);
    if(this.notaCredito.id != valores.cero){
      let fecha = new Date(this.notaCredito.fecha);
      this.notaCredito.fecha = fecha;
    }
    if(this.notaCredito.id == valores.cero){
      this.notaCredito.fecha = this.hoy;
    }
    this.dataSourceLinea = new MatTableDataSource(this.notaCredito.notaCreditoLineas);
    this.dataSourceLinea.filterPredicate = (data: NotaCreditoLinea, filter: string): boolean =>
      data.producto.nombre.includes(filter) || data.producto.medida.abreviatura.includes(filter) || 
      data.producto.impuesto.abreviatura.includes(filter) || data.bodega.abreviatura.includes(filter);
      this.dataSourceLinea.paginator = this.paginatorLinea;
    this.dataSourceLinea.sort = this.sortLinea;
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

  seleccionarIdentificacionCliente() {
    this.spinnerService.show();
    let clienteId = this.controlIdentificacionCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        this.notaCredito.factura.cliente = res.resultado as Cliente;
        this.controlIdentificacionCliente.patchValue(this.notaCredito.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.notaCredito.factura.cliente);
        this.facturaService.consultarPorClienteYEmpresaYEstado(this.notaCredito.factura.cliente.id, this.empresa.id, valores.estadoRecaudada).subscribe(
          res => {
            this.facturas = res.resultado as Factura[];
            this.spinnerService.hide();
          },
          err => {
            this.spinnerService.hide();
            Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
          }
        );
      },
      error: err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  seleccionarRazonSocialCliente() {
    this.spinnerService.show();
    let clienteId = this.controlRazonSocialCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        this.notaCredito.factura.cliente = res.resultado as Cliente;
        this.controlIdentificacionCliente.patchValue(this.notaCredito.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.notaCredito.factura.cliente);
        this.facturaService.consultarPorClienteYEmpresaYEstado(this.notaCredito.factura.cliente.id, this.empresa.id, valores.estadoRecaudada).subscribe(
          res => {
            this.facturas = res.resultado as Factura[];
            this.spinnerService.hide();
          },
          err => {
            this.spinnerService.hide();
            Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
          }
        );
      },
      error: err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  seleccionarFactura() {
    this.spinnerService.show();
    let facturaId = this.controlFactura.value.id;
    this.notaCreditoService.obtenerPorFactura(facturaId).subscribe(
      res => {
        this.notaCredito = res.resultado as NotaCredito;
        this.notaCredito.establecimiento = this.sesion.usuario.estacion.establecimiento.codigoSRI;
        this.notaCredito.puntoVenta = this.sesion.usuario.estacion.codigoSRI;
        this.construir();
        this.spinnerService.hide();
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();
      }
    );
  }

  seleccionarOperacion(){
    if (this.notaCredito.operacion == valores.devolucion) {
      this.notaCredito.descuento = valores.cero;
      this.deshabilitarDescuento = true;
      if (this.notaCredito.id == valores.cero){
        for (let i=0; i < this.notaCredito.notaCreditoLineas.length; i++){
          this.notaCredito.notaCreditoLineas[i].cantidad = valores.cero;
        }
      }
    }
    if (this.notaCredito.operacion == valores.descuento) {
      this.deshabilitarDescuento = false;
      if (this.notaCredito.id == valores.cero){
        for (let i=0; i < this.notaCredito.notaCreditoLineas.length; i++){
          this.notaCredito.notaCreditoLineas[i].cantidad = this.notaCredito.notaCreditoLineas[i].cantidadVenta;
        }
      }
    }
    this.calcular();
  }

  calcular(){
    this.spinnerService.show();
    this.notaCreditoService.calcular(this.notaCredito).subscribe({
      next: res => {
        this.spinnerService.hide();
        this.notaCredito = res.resultado as NotaCredito;
        this.construir();
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
    this.notaCreditoElectronicaService.obtenerPDF(this.notaCredito.id);
  }
  
  enviarPDFYXML(event){
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();
    this.notaCreditoElectronicaService.enviarPDFYXML(this.notaCredito.id).subscribe({
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
    if (this.notaCredito.fecha == null || this.notaCredito.fecha > this.hoy){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_fecha });
      return false;
    }
    if (this.notaCredito.factura.id == valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.notaCredito.operacion == valores.vacio){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }  
}